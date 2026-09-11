import { RefObject, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOBILE_MQ, SCRUB, SECTIONS } from "./gsapSections";

/* ═══════════════════════════════════════════════════════════════
 * GSAP 스크롤 기본 템플릿 — 엔진
 * dev_gsap_template.html 의 「여기부터는 손댈 일이 거의 없다」 아래를 옮긴 것이다.
 *
 * 이 코드가 푸는 문제는 하나다 —
 *   **고정(pin)한 구간이 있는 페이지에서 창 폭이 바뀌면 자리와 연출이 틀어진다.**
 *
 * 왜 틀어지나
 *   ① 고정은 「트리거를 만들 때」 정해진다. 이미 만든 트리거의 pin 여부는 고칠 수 없다.
 *      그래서 폭이 바뀌어 연출이 달라져야 하면 그 구간을 **다시 지어야** 한다.
 *   ② CSS 는 폭이 바뀌는 그 순간 바뀌는데 트리거는 아직 옛 설정이다.
 *      그 사이에 ScrollTrigger 가 제 판단으로 한 번 다시 재면, 바뀐 CSS 위에서 옛 기준으로 잰다.
 *   ③ 고정이 붙었다 떨어지면 문서 높이가 달라져 보던 자리가 밀린다.
 *
 * 어떻게 푸나
 *   ① 구간마다 따로 컨텍스트를 든다 → 필요한 구간만 다시 짓는다(bp 표시).
 *   ② 폭이 바뀌면 그 자리에서 곧바로 걷고, 짓는 일만 250ms 뒤로 미룬다.
 *      → 옛 설정이 새 CSS 위에서 재어지는 창이 사라진다.
 *   ③ 다시 재기 전에 보던 자리를 문서 좌표로 적어 두고, 끝난 뒤 되돌린다.
 *
 * React 로 옮기며 달라진 것은 셋뿐이다.
 *   · 모든 상태를 effect **안쪽 지역 변수**로 둔다 — 전역에 두면 StrictMode 가
 *     두 번 마운트할 때 첫 번째가 남긴 값을 두 번째가 물려받아 어긋난다.
 *   · document 가 아니라 **root 엘리먼트 안에서만** 구간을 찾는다.
 *   · 언마운트에서 건 것을 전부 되돌린다(리스너·타이머·트리거·컨텍스트).
 * ═══════════════════════════════════════════════════════════════ */

/** ⚠ effect 는 첫 페인트 전에 돌아야 한다 — from() 의 시작 상태가 칠해지기 전에 한 프레임이
 *  그려지면 글자가 번쩍 보였다 사라진다. SSR(프리렌더) 중에는 useEffect 로 물러선다. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** ⚠ CSS 의 .gt_bg 배경색과 같은 값이어야 한다 */
const DEFAULT_BG = "#ffffff";

export function useGsapTemplate(rootRef: RefObject<HTMLDivElement | null>) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // ⚠ 모바일 주소창이 여닫히면 resize 가 뜬다 — 그때마다 다시 재면 스크롤 중에 고정이 튄다.
    //    폭이 바뀔 때만 다시 잰다(.gt_pin 이 dvh 가 아니라 vh 인 것과 같은 이유다).
    ScrollTrigger.config({ ignoreMobileResize: true });

    // globals.css 의 scroll-smooth · overflow-x:hidden 을 이 페이지 동안만 무른다(css 주석 참조)
    document.documentElement.classList.add("gt_active");

    const mq = window.matchMedia(MOBILE_MQ);

    const bgEl = root.querySelector<HTMLElement>(".gt_bg");
    const setBg = (color?: string | null) => {
      if (bgEl) bgEl.style.backgroundColor = color || DEFAULT_BG;
    };

    const secOf = (i: number) => root.querySelector<HTMLElement>("#" + SECTIONS[i].id);

    const triggers: Array<ScrollTrigger | null> = [];   // 구간 타임라인의 트리거 (자리 계산에 쓴다)
    const bgTriggers: Array<ScrollTrigger | null> = []; // 배경 트리거 (지금 어느 구간인지 읽는다)

    // ⚠ 컨텍스트를 구간마다 따로 든다. 하나로 묶으면 한 구간만 다시 지을 수가 없다.
    const ctxs: Array<gsap.Context | null> = [];
    // 구간마다 그때 생긴 트리거 목록. 걷을 때 거꾸로 걷기 위해 갖고 있는다.
    const stOf: Array<ScrollTrigger[] | null> = [];
    // build 가 돌려준 정리 함수
    const cleanups: Array<(() => void) | null> = [];

    // 페이지가 열릴 때 스스로 도는 등장 연출(intro). 스크롤 트리거를 달지 않는 보통 타임라인이다.
    // ⚠ 구간 컨텍스트(ctxs) 밖에 둔다. 안에 두면 폭이 바뀌어 구간을 다시 지을 때
    //    같이 되돌려져 이미 뜬 것이 도로 사라진다.
    const introTls: Array<gsap.core.Timeline | null> = [];
    const introCleanups: Array<(() => void) | null> = [];
    const introDone: boolean[] = [];

    // ── 구간 하나를 건다 ──────────────────────────────────
    const installSection = (i: number, isMobile: boolean) => {
      const conf = SECTIONS[i];
      const sec = secOf(i);
      if (!sec) return;

      // ── 등장 ── 스크롤을 기다리지 않고 한 번 재생한다.
      // ⚠ 첫 설치 때만 만든다. 폭이 바뀌어 다시 지을 때 또 만들면 뜬 것이 다시 사라졌다 뜬다.
      if (conf.intro && !introDone[i]) {
        introDone[i] = true;
        const itl = gsap.timeline();
        introCleanups[i] = conf.intro(itl, sec, isMobile) || null;
        introTls[i] = itl;
      }

      const before = ScrollTrigger.getAll();

      ctxs[i] = gsap.context(() => {
        const m = (isMobile && conf.mobile) || {};
        const noPin = conf.pin === false || !!m.unpin;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: m.start || (noPin ? "top 60%" : "top top"),
            end: m.end || conf.len,
            pin: noPin ? false : sec.querySelector(".gt_pin"),
            anticipatePin: noPin ? 0 : 1,
            scrub: conf.scrub != null ? conf.scrub : SCRUB,
            invalidateOnRefresh: !!conf.invalidate,
            // 눈금이 필요하면 켠다 : markers: true
          },
        });

        cleanups[i] = conf.build(tl, sec, isMobile) || null;
        triggers[i] = tl.scrollTrigger ?? null;

        // 다음 구간의 배경이 바뀌는 그 시점에 맞춰 이 구간 요소를 걷는다.
        // ⚠ 구간 타임라인이 아니라 다음 구간을 trigger 로 쓴다 — 배경 전환이 그쪽 위치로 정해진다.
        // ⚠ 잡는 속성은 opacity 뿐이다. y·scale 은 구간 타임라인 몫이라 겹치지 않는다.
        const fadeSel = m.fadeBeforeBg || conf.fadeBeforeBg;
        if (fadeSel && fadeSel.length && SECTIONS[i + 1]) {
          const nextSec = secOf(i + 1);
          const fadeEls = fadeSel.map((s) => sec.querySelector(s)).filter(Boolean) as Element[];
          if (nextSec && fadeEls.length) {
            gsap.to(fadeEls, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: nextSec,
                start: conf.fadeStart || "top bottom",
                end: SECTIONS[i + 1].bgStart || "top 60%",
                scrub: SCRUB,
              },
            });
          }
        }

        // 배경 — 이 구간에 들어서면 배경판을 그 구간 색으로 바꾼다.
        // ⚠ tween 으로 만들지 않는다. 구간마다 tween 을 만들면 같은 속성을 두고 다투고,
        //    되감아 올라와도 자기 시작값을 칠해 앞 구간 색이 복원되지 않는다.
        // ⚠ 색만 정하고 보간은 CSS transition 에 맡긴다(.gt_bg 참조).
        const prevBg = i > 0 ? SECTIONS[i - 1].bg : null;
        bgTriggers[i] = ScrollTrigger.create({
          trigger: sec,
          start: conf.bgStart || "top 60%",
          end: "bottom 40%",
          onEnter: () => setBg(conf.bg),
          onEnterBack: () => setBg(conf.bg),
          // ⚠ 위로 되돌아 빠져나갈 때 앞 구간 색으로 되돌린다.
          //    이게 없으면 앞 구간으로 올라가도 어두운 색이 남는다.
          onLeaveBack: () => setBg(prevBg),
        });
      }, root);

      // 방금 새로 생긴 것만 골라 둔다 — 다른 구간 것을 건드리지 않는다.
      const after = ScrollTrigger.getAll();
      stOf[i] = after.filter((st) => before.indexOf(st) < 0);
      // 문서 순서대로 다시 재게 한다. 앞 구간의 고정 여백이 뒤 좌표에 포함돼야 한다.
      stOf[i]!.forEach((st) => {
        st.vars.refreshPriority = (SECTIONS.length - i) * 10 + (st.pin ? 1 : 0);
      });
    };

    // ── 구간 하나를 걷는다 ────────────────────────────────
    // ⚠ 트리거를 거꾸로, 그리고 컨텍스트보다 먼저 걷는다. 나중에 만든 트리거가 앞서 만든
    //    것에 매달려 있어(containerAnimation 등) 앞에서부터 걷으면 매달린 쪽이 사라진 짝을 읽는다.
    const revertSection = (i: number) => {
      (stOf[i] || []).slice().reverse().forEach((st) => st.kill(true));
      stOf[i] = null;
      if (cleanups[i]) {
        cleanups[i]!();
        cleanups[i] = null;
      }
      if (ctxs[i]) {
        ctxs[i]!.revert();
        ctxs[i] = null;
      }
      triggers[i] = null;
      bgTriggers[i] = null;

      const sec = secOf(i);
      if (!sec) return;
      // ⚠ 고정이 걸렸던 요소에 남은 인라인 값을 확실히 지운다.
      //    ScrollTrigger 는 고정할 때 width·height·padding·position 을 인라인으로 심는다.
      //    kill(true) 가 대부분 되돌리지만 폭을 여러 번 오가면 한 번씩 남고,
      //    남으면 다음 폭에서 옛 크기로 굳은 판이 된다.
      // ⚠ 아래 셋은 인라인 스타일을 우리가 쓰지 않는 요소다. 고정 대상이 늘면 여기에 같이 적는다.
      [".gt_pin", ".gt_follow", ".gt_hpin"].forEach((sel) => {
        const el = sec.querySelector<HTMLElement>(sel);
        if (el) el.style.cssText = "";
      });
    };

    // ── 상태 ──────────────────────────────────────────────
    let installedMobile = mq.matches; // 지금 걸려 있는 설정이 모바일인가
    let pendingRebuild = false;       // 다시 짓기를 기다리는 중인가 (두 훅을 잠근다)
    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;
    let keepAt: { top?: boolean; i?: number; p?: number } | null = null; // 되돌릴 자리

    // ── 자리 기억·되돌리기 ────────────────────────────────
    // ⚠ 다시 재기는 폭이 바뀔 때만 일어나지 않는다 — 창 높이·이미지 로드·폰트 교체에도 일어나고,
    //    그때마다 문서 높이가 달라져 보던 자리가 밀린다.
    // ⚠ 트리거의 start/end 가 아니라 문서 좌표로 적는다. 트리거 값은 다시 짓는 동안 사라진다.
    type Place = { start: number; end: number };
    let sectionPlaces: Array<Place | null> = [];
    let measuredWidth = window.innerWidth;
    let measuredHeight = window.innerHeight;
    let stableScrollY = window.pageYOffset || 0;

    // 브라우저의 스크롤 앵커 보정은 resize 이벤트보다 먼저 일어날 수 있다.
    // 크기가 바뀌기 전 마지막 위치를 남겨 그 보정값으로 엉뚱한 구간을 고르지 않는다.
    const onScroll = () => {
      if (!pendingRebuild && window.innerWidth === measuredWidth && window.innerHeight === measuredHeight) {
        stableScrollY = window.pageYOffset || 0;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const sectionPlace = (st: ScrollTrigger | null): Place | null => {
      if (!st || !st.trigger) return null;
      const rect = st.trigger.getBoundingClientRect();
      const start = rect.top + (window.pageYOffset || 0);
      return { start: start, end: start + rect.height };
    };
    const rememberPlace = () => {
      const resized = window.innerWidth !== measuredWidth || window.innerHeight !== measuredHeight;
      const y = resized ? stableScrollY : window.pageYOffset || 0;
      keepAt = null;
      if (y <= 1) {
        keepAt = { top: true };
        return;
      }
      sectionPlaces.forEach((place, i) => {
        if (place && y >= place.start && y < place.end) {
          keepAt = { i: i, p: (y - place.start) / (place.end - place.start) };
        }
      });
    };
    const restorePlace = () => {
      if (keepAt && keepAt.top) {
        keepAt = null;
        window.scrollTo(0, 0);
        return;
      }
      const place = keepAt && keepAt.i != null ? sectionPlace(triggers[keepAt.i]) : null;
      const p = keepAt ? keepAt.p : null;
      keepAt = null;
      if (!place || p == null) return;
      const y = place.start + (place.end - place.start) * p;
      if (isFinite(y)) window.scrollTo(0, y);
    };

    // ── 배경 다시 칠하기 ──────────────────────────────────
    // ⚠ 배경색은 인라인 스타일이라 되돌리기 대상이 아니다. 다시 건 트리거는 「들어설 때」만 칠하므로,
    //    이미 구간 안에 서 있으면 아무도 칠하지 않아 앞 색이 남는다.
    // ⚠ 판정은 「지나온 것 중 가장 마지막 구간」이다. 구간 안(start~end)으로 판정하면
    //    끝을 지난 구간이 빠져 기본색으로 돌아간다.
    // ⚠ 한 프레임 전환을 꺼서(.is_snap) 즉시 맞춘다 — 켜 둔 채 칠하면 「방금 지나온 색」이 비친다.
    const paintBg = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      let nowBg: string | null | undefined = null;
      bgTriggers.forEach((st, n) => {
        if (st && y >= st.start) nowBg = SECTIONS[n].bg;
      });
      if (!bgEl) return;
      bgEl.classList.add("is_snap");
      setBg(nowBg);
      bgEl.getBoundingClientRect(); // 값을 굳힌다(전환 없이 칠해지도록)
      requestAnimationFrame(() => bgEl.classList.remove("is_snap"));
    };

    // ── 다시 짓기 ─────────────────────────────────────────
    // ⚠ 들어오는 길이 둘(미디어쿼리 change · 다시 재기 직전)인데 **하는 일은 하나여야 한다.**
    //    한쪽만 「걷기」를 빼먹으면 그 길로 들어왔을 때 옛 설정이 새 CSS 위에서 재어진다.
    //    그래서 두 길 모두 이 함수 하나를 부른다.
    const scheduleRebuild = () => {
      if (pendingRebuild) return;
      // ⚠ 폭이 바뀐 그 순간 적어 둔다. 250ms 뒤에 읽으면 그 사이 ScrollTrigger 가
      //    제 판단으로 다시 재면서 자리를 흔들어 놓은 뒤다.
      if (!keepAt) rememberPlace();
      pendingRebuild = true;

      // ⚠ 옛 설정을 여기서 바로 걷는다. 이 순간 CSS 는 이미 새 폭인데 트리거는 아직 옛 설정이다.
      //    그대로 두면 250ms 동안 ScrollTrigger 가 바뀐 CSS 위에서 옛 기준으로 한 번 잰다.
      //    걷어만 두고 짓는 것은 250ms 뒤다 — 그 사이 화면은 연출 없이 그냥 흐른다.
      //    틀린 값으로 움직이는 것보다 낫다.
      SECTIONS.forEach((conf, i) => {
        if (conf.bp) revertSection(i);
      });

      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(applyBreakpoint, 250);
    };

    // 폭이 바뀔 때 — bp 표시가 붙은 구간만 다시 건다.
    // ⚠ 나머지는 손대지 않는다. 좌표만 달라지는 것이고 그건 아래 refresh 가 맞춰 준다.
    //    전부 다시 짓던 방식은 고정을 구간 수만큼 떼고 다시 붙였고, 한 군데만 어긋나도 화면 전체가 무너졌다.
    function applyBreakpoint() {
      const isMobile = mq.matches;
      // ⚠ 반드시 갱신한다. 이 값이 그대로면 「어긋났나」 판정이 늘 참이 되어
      //    다시 재기가 일어날 때마다 다시 짓기를 예약한다 — 끝나지 않는 되풀이가 된다.
      installedMobile = isMobile;

      SECTIONS.forEach((conf, i) => {
        if (!conf.bp) return;
        try {
          revertSection(i); // scheduleRebuild 가 이미 걷었지만 두 번 불러도 안전하다
          installSection(i, isMobile);
        } catch (err) {
          // 어느 구간에서 터졌는지 알아야 고칠 수 있다 — 삼키지 않고 남긴다.
          console.error("[gsap-template] 구간을 다시 거는 중 오류 —", conf.id, isMobile ? "모바일" : "데스크톱", err);
        }
      });

      // ⚠ 여기서 clearProps 를 부르지 않는다 — 방금 설치한 from() 의 시작 상태가 지워진다.
      //    옛 스타일은 revertSection 이 이미 되돌렸다.
      pendingRebuild = false;
      ScrollTrigger.sort();
      // ⚠ 다시 건 뒤에는 반드시 다시 잰다 — 고정이 붙었다 떨어지며 문서 높이가 달라지는데
      //    트리거는 만들어질 때의 좌표를 갖고 있다.
      // ⚠ 자리 되돌리기·배경 칠하기는 여기서 부르지 않는다 — 아래 refresh 훅이 맡는다.
      ScrollTrigger.refresh();
    }

    // ── 훅 ────────────────────────────────────────────────
    // ⚠ 훅은 한 번만 건다. gsap.context 밖이라 다시 지어도 살아 있다.
    const onRefreshInit = () => {
      // 지금 걸려 있는 설정과 실제 폭이 어긋났나 — change 이벤트보다 다시 재기가 먼저 올 수 있다.
      // ⚠ 여기서 직접 걷지 않는다. 지금은 좌표를 다시 재는 도중이다.
      //    scheduleRebuild 가 걷기와 예약을 한꺼번에 맡는다(위 주석 참조).
      if (mq.matches !== installedMobile) {
        scheduleRebuild();
        return;
      }
      // 다시 짓기를 기다리는 중이면 이미 적어 두었다. 덮어쓰지 않는다.
      if (!pendingRebuild && !keepAt) rememberPlace();
    };

    // ⚠ 이 안에서 스크롤을 옮기지 않는다. refresh 는 좌표를 다시 재는 도중에 불리는데,
    //    그 자리에서 스크롤을 건드리면 재기가 다시 돌면서 서로를 물어 좌표가 어긋난다.
    //    한 프레임 뒤로 미뤄 재기가 끝난 다음에 옮긴다.
    const onRefresh = () => {
      if (pendingRebuild) return; // 옛 설정으로 잰 좌표다 — 쓰지 않는다
      requestAnimationFrame(() => {
        if (pendingRebuild) return; // 그 사이 또 폭이 바뀌었으면 다음 차례에 맡긴다
        restorePlace();
        sectionPlaces = triggers.map(sectionPlace);
        measuredWidth = window.innerWidth;
        measuredHeight = window.innerHeight;
        stableScrollY = window.pageYOffset || 0;
        paintBg();
      });
    };

    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // 예전 사파리는 미디어쿼리에 addEventListener 를 받지 않는다
    if (mq.addEventListener) mq.addEventListener("change", scheduleRebuild);
    else mq.addListener(scheduleRebuild);

    // 이미지·폰트가 늦게 들어와 높이가 달라지는 경우를 대비한다.
    // ⚠ 동기로 한 번 더 부르는 것은 의미가 없다 — load 를 기다려야 한다.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // ── 시작 ──────────────────────────────────────────────
    installedMobile = mq.matches;
    SECTIONS.forEach((conf, i) => installSection(i, installedMobile));
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // ── 끝 ────────────────────────────────────────────────
    // ⚠ 건 순서의 역순으로 전부 되돌린다. 하나라도 남기면 StrictMode 가 두 번 마운트할 때
    //    첫 번째가 남긴 트리거가 두 번째 것과 같은 요소를 두고 다툰다.
    return () => {
      window.removeEventListener("load", onLoad);
      if (mq.removeEventListener) mq.removeEventListener("change", scheduleRebuild);
      else mq.removeListener(scheduleRebuild);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      window.removeEventListener("scroll", onScroll);
      if (rebuildTimer) clearTimeout(rebuildTimer);
      // ⚠ 뒤 구간부터 걷는다 — 앞 구간의 고정을 먼저 떼면 뒤 구간 좌표가 그 자리에서 밀린다.
      for (let i = SECTIONS.length - 1; i >= 0; i--) revertSection(i);
      // 등장은 구간 컨텍스트 밖이라 여기서 따로 되돌린다.
      // ⚠ kill 이 아니라 revert 다. 재생 도중에 kill 하면 그때의 어중간한 값이 인라인으로 남고,
      //    StrictMode 가 곧바로 다시 마운트하면 from() 이 그 값을 도착점으로 삼아 반투명하게 굳는다.
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        if (introCleanups[i]) {
          introCleanups[i]!();
          introCleanups[i] = null;
        }
        if (introTls[i]) {
          introTls[i]!.revert();
          introTls[i] = null;
        }
        introDone[i] = false;
      }
      document.documentElement.classList.remove("gt_active");
    };
  }, [rootRef]);
}
