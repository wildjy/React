import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ═══════════════════════════════════════════════════════════════
 * 구간 설정 — dev_gsap_template.html 의 SECTIONS 배열을 옮긴 것이다.
 *
 * 새 구간을 붙이려면 : page.tsx 마크업에 section 을 하나 더 두고
 * 아래 SECTIONS 에 한 줄 적는다. 엔진(useGsapTemplate)은 손대지 않는다.
 * ═══════════════════════════════════════════════════════════════ */

/** 스크롤을 얼마나 느긋하게 따라갈지. true(=즉시) 대신 숫자를 주면 그만큼 지연되며 따라온다. */
export const SCRUB = 0.4;

/**
 * 폭 경계.
 * ⚠ gsap-template.css 의 @media (max-width: 750px) 와 같아야 한다.
 *   한쪽만 고치면 스타일은 모바일인데 고정은 데스크톱인 구간이 생긴다.
 */
export const MOBILE_MQ = "(max-width: 750px)";

/** build 가 돌려줄 수 있는 정리 함수 — 구간을 걷을 때 불린다. */
export type SectionCleanup = (() => void) | void;

export type SectionConf = {
  /** 구간 요소 id */
  id: string;
  /** 고정해 둘 스크롤 길이("+=100%" = 화면 한 번 분량) 또는 end 문자열 */
  len: string;
  /** false 면 고정하지 않는다(기본 true) */
  pin?: boolean;
  /** 이 구간에 들어서면 배경판이 될 색 */
  bg?: string;
  /** 배경이 넘어가기 시작하는 지점(기본 top 60%) */
  bgStart?: string;
  /** fadeBeforeBg 가 걷히기 시작하는 지점(기본 top bottom) */
  fadeStart?: string;
  /** 다음 구간 배경이 바뀌기 전에 걷을 요소들(선택자 배열) */
  fadeBeforeBg?: string[];
  /**
   * 모바일에서 덮어쓸 값.
   * ⚠ unpin 만 켜고 start·end 를 두면 시작점이 틀어진다 — 기본값 top top 은
   *   「판이 화면을 다 채운 뒤」라 고정 구간에서만 맞다.
   */
  mobile?: { unpin?: boolean; start?: string; end?: string; fadeBeforeBg?: string[] };
  /**
   * 다시 잴 때 트윈 값을 다시 기록한다.
   * ⚠ 이걸 켠 구간에서는 from() 을 쓰지 않는다.
   *   from() 은 「지금 값」을 도착점으로 다시 적어 버려 영영 보이지 않게 된다. fromTo() 를 쓴다.
   */
  invalidate?: boolean;
  /** 구간별 scrub 값(기본 SCRUB) */
  scrub?: number;
  /**
   * 페이지가 열리면 스크롤과 상관없이 **스스로 한 번 재생**하는 등장 연출.
   * 첫 화면처럼 「스크롤하기 전에 이미 떠 있어야 하는」 구간에 쓴다.
   * ⚠ 첫 설치 때 한 번만 돈다 — 폭이 바뀌어 구간을 다시 지어도 되풀이하지 않는다.
   *   이미 뜬 것이 다시 사라졌다 뜨면 눈에 튄다.
   * ⚠ build 와 **같은 요소를 잡지 않는다.** 같은 속성을 두고 다투면
   *   스크롤이 진행도 0 을 칠하는 순간 등장이 덮어써진다.
   */
  intro?: (tl: gsap.core.Timeline, sec: HTMLElement, isMobile: boolean) => SectionCleanup;
  /**
   * 폭에 따라 설정이 달라지는 구간이라는 표시.
   * 이 표시가 있는 구간만 폭이 바뀔 때 다시 짓는다.
   * ⚠ mobile 을 갖거나 build 안에서 isMobile 로 갈라지면 반드시 켠다.
   *   빼먹으면 폭이 바뀌어도 옛 설정으로 남아 조용히 어긋난다.
   */
  bp?: boolean;
  /** 타임라인을 짜는 함수. 정리할 것이 있으면 함수를 돌려준다. */
  build: (tl: gsap.core.Timeline, sec: HTMLElement, isMobile: boolean) => SectionCleanup;
};

/* 마크업은 page.tsx 가 고정으로 들고 있다 — 선택자는 늘 맞는다고 본다. */
const q = (root: ParentNode, sel: string) => root.querySelector(sel) as HTMLElement;
const qa = (root: ParentNode, sel: string) => Array.from(root.querySelectorAll(sel)) as HTMLElement[];

export const SECTIONS: SectionConf[] = [
  // 01 : 첫 화면 — 페이지가 열리면 스스로 떠오르고, 걷기만 스크롤이 맡는다
  // ⚠ 등장(intro)과 걷기(build)가 잡는 요소가 다르다.
  //    intro 는 안쪽 낱낱(.gt_tit·.gt_txt·.gt_box), build 는 판 전체(.gt_inner).
  //    같은 요소를 두 쪽에서 잡으면 스크롤이 진행도 0 을 칠할 때 등장이 지워진다.
  {
    id: "gt01",
    len: "+=100%",
    intro: (tl, sec) => {
      // 첫 프레임부터 보이지 않아야 하니 from() 으로 시작 상태를 미리 칠한다.
      // (엔진이 첫 페인트 전에 도는 덕에 번쩍이지 않는다 — useGsapTemplate 주석 참조)
      tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" }, 0.2)
        .from(q(sec, ".gt_txt"), { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" }, "<0.15")
        .from(qa(sec, ".gt_grid .gt_box"), { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, "<0.2");
    },
    build: (tl, sec) => {
      // ⚠ 앞에 빈 시간을 둔다(위치 1 부터 길이 1 — 타임라인 전체는 2).
      //    0 에 두면 고정되자마자 걷히기 시작한다. len 의 앞 절반은 그대로 두고 뒤 절반에서 걷는다.
      // 걷지 않으면 다음 구간의 어두운 바탕 위에 검은 글자가 묻는다
      tl.to(q(sec, ".gt_inner"), { y: -40, opacity: 0, ease: "none", duration: 1 }, 1);
    },
  },

  // 02 : 배경이 검정으로 넘어간다
  // ⚠ bgStart 를 늦추면 01 이 걷히는 것도 같이 늦어진다 — 걷기의 끝이 이 값을 그대로 쓴다.
  {
    id: "gt02",
    len: "+=150%",
    bg: "#292a31",
    bgStart: "top 40%",
    fadeBeforeBg: [".gt_inner"],
    build: (tl, sec) => {
      tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, ease: "none" })
        .from(q(sec, ".gt_txt"), { y: 40, opacity: 0, ease: "none" }, ">0.2")
        .from(qa(sec, ".gt_grid .gt_box"), { y: 40, opacity: 0, stagger: 0.3, ease: "none" }, ">0.3");
    },
  },

  // 03 : 폭에 따라 연출이 통째로 다르다 — 이 템플릿의 핵심
  // ⚠ 구간 자체는 어느 쪽이든 고정하지 않는다(pin: false). 판이 화면 한 장에 안 들어가기 때문이다.
  //    그래서 구간 타임라인(tl)은 비워 두고 연출을 따로 건다.
  {
    id: "gt03",
    len: "bottom top",
    pin: false,
    bp: true,
    fadeBeforeBg: [".gt_follow"],
    mobile: { fadeBeforeBg: [] },
    build: (tl, sec, isMobile) => {
      const follow = q(sec, ".gt_follow");
      const row = q(sec, ".gt_follow_list");
      const cards = qa(sec, ".gt_card");

      if (isMobile) {
        // ⚠ 크기를 재는 기준은 고정하지 않는 요소여야 한다.
        //    ScrollTrigger 는 고정할 때 그 요소에 width 를 인라인으로 심는다 —
        //    고정이 걸리던 시점의 폭이라, 폭을 오가면 옛 값을 읽는 순간이 생긴다.
        //    .gt_pin 은 이 구간에서 한 번도 고정되지 않으므로 늘 지금 폭을 돌려준다.
        const win = q(sec, ".gt_pin");
        // ⚠ 이동량은 값이 아니라 함수로 넘기고 invalidateOnRefresh 로 다시 잰다.
        const travel = () => Math.max(1, row.offsetWidth - win.clientWidth);

        // 글은 고정이 걸리기 전에 다 뜬다
        gsap.from(qa(sec, ".gt_follow_txt > *"), {
          y: 40,
          opacity: 0,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: follow, start: "top 85%", end: "top 30%", scrub: SCRUB },
        });

        // 고정 + 가로 이동
        const slide = gsap.to(row, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: follow,
            start: "top 80px",
            end: () => "+=" + travel(),
            pin: follow,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // 카드 등장 — 판이 고정돼 세로로 움직이지 않으므로 세로 위치로는 「지금 화면 어디인지」를 알 수 없다.
        // containerAnimation 을 주면 start 를 가로 좌표로 읽어 준다.
        cards.forEach((card) => {
          gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 90%" },
          });
        });

        // 퇴장 — 가로로 다 민 뒤에 걷는다.
        // ⚠ 그 지점을 slide 의 트리거에서 읽지 않고 직접 구한다 — 남의 트리거를 읽으면
        //    그쪽이 먼저 걷힌 순간(폭이 바뀔 때 늘 생긴다) 사라진 것을 읽어 오류가 난다.
        const pinTop = () => {
          const r = win.getBoundingClientRect();
          const padTop = parseFloat(getComputedStyle(win).paddingTop) || 0;
          return r.top + (window.pageYOffset || 0) + padTop - 80;
        };
        gsap.to(follow, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: follow,
            start: () => pinTop() + travel(),
            end: () => pinTop() + travel() + 400,
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        });
      } else {
        // 데스크톱 — 좌측 글이 sticky 로 붙고 우측 카드가 그 옆을 지나간다.
        // ⚠ 글이 다 뜬 다음에 카드가 시작한다. 넘겨주는 지점을 상수로 두고
        //    글의 end 와 카드의 start 에 같은 값을 쓴다. 시간(초)에 맡기면 빠른 스크롤에 순서가 뒤집힌다.
        // ⚠ start 가 HANDOVER 보다 화면 아래여야 한다. 퍼센트가 클수록 화면 아래 = 스크롤상 먼저다.
        //    start 60% / HANDOVER 80% 로 두면 end 가 start 보다 일러 범위가 뒤집힌다.
        const HANDOVER = "top 80%";
        gsap.from(qa(sec, ".gt_follow_txt > *"), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: follow, start: "top 95%", end: HANDOVER, scrub: SCRUB },
        });
        gsap.from(cards, {
          y: 120,
          opacity: 0,
          stagger: 0.35,
          ease: "none",
          scrollTrigger: { trigger: follow, start: HANDOVER, end: "bottom bottom", scrub: SCRUB },
        });
      }
    },
  },

  // 04 : 한 문장이 떠오른 뒤 화면을 향해 커지며 사라진다
  // ⚠ 커지는 쪽을 떠오르는 쪽보다 길게 잡는다 — 같은 길이면 확대가 순식간에 끝나
  //    「사라진다」가 아니라 「깜빡인다」로 보인다.
  // ⚠ 퇴장을 따로 붙이지 않는다. 확대가 끝나는 지점에 이미 opacity 0 이다.
  {
    id: "gt04",
    len: "+=150%",
    bg: "#292a31",
    build: (tl, sec) => {
      const txt = q(sec, ".gt_impact");
      tl.from(txt, { opacity: 0, scale: 15, ease: "none", duration: 1 })
        .to(txt, { opacity: 0, scale: 1, ease: "none", duration: 1 });
    },
  },

  // 05 : 두 줄이 좌·우 화면 밖에서 들어오고 설명은 아래에서 올라온다.
  //      빠져나갈 때는 왔던 방향으로 되돌아 나간다.
  // ⚠ 이동 거리를 「화면 절반 + 그 줄의 절반」으로 잡는 것이 핵심이다 — 고정값으로 두면
  //    넓은 화면에서는 글자가 덜 나가 걸쳐 있고, 좁은 화면에서는 필요 이상으로 멀리 간다.
  // ⚠ 그래서 invalidate 를 켠다 — 다시 잴 때마다 거리를 새로 구해야 한다.
  {
    id: "gt05",
    len: "+=200%",
    bg: "#ffffff",
    invalidate: true,
    build: (tl, sec) => {
      const lines = qa(sec, ".gt_lead .tit span");
      const desc = q(sec, ".gt_lead .desc");

      // 그 줄을 화면 밖으로 완전히 빼는 거리. dir 이 -1 이면 왼쪽, 1 이면 오른쪽.
      // ⚠ 값이 아니라 함수로 넘긴다 — invalidate 될 때 GSAP 이 다시 부른다.
      const away = (el: HTMLElement, dir: number) => () => dir * (window.innerWidth / 2 + el.offsetWidth / 2);

      // ⚠ from() 이 아니라 fromTo() 를 쓴다. 이 구간은 invalidate 가 켜져 있는데,
      //    from() 은 다시 잴 때 「지금 화면의 값」을 도착점으로 새로 잡는다.
      //    다시 재는 순간 글자는 이미 시작 상태(화면 밖·투명)라 「투명 → 투명」이 되어
      //    영영 보이지 않는다. fromTo 는 시작·도착을 둘 다 적어 두므로 몇 번을 다시 재도 같다.
      // ⚠ 퇴장 쪽은 immediateRender 를 꺼 둔다. 켜 두면 만들어지는 즉시 제 시작 상태를 칠해
      //    등장 쪽이 방금 깔아 둔 값(화면 밖·투명)을 덮어 첫 화면부터 글자가 보인다.
      tl.fromTo(lines[0], { x: away(lines[0], -1), opacity: 0 }, { x: 0, opacity: 1, ease: "none", duration: 1 }, 0)
        .fromTo(lines[1], { x: away(lines[1], 1), opacity: 0 }, { x: 0, opacity: 1, ease: "none", duration: 1 }, 0)
        .fromTo(desc, { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 1 }, 0.3)
        // 퇴장 — 왔던 방향으로 되돌아 나간다. 세 줄이 같은 순간에 함께 움직인다.
        // ⚠ 다 들어온 뒤 0.4 만큼 머물렀다가 나간다. 붙여 두면 읽을 틈 없이 지나간다.
        .fromTo(
          lines[0],
          { x: 0, opacity: 1 },
          { x: away(lines[0], -1), opacity: 0, ease: "none", duration: 1, immediateRender: false },
          ">0.4",
        )
        .fromTo(
          lines[1],
          { x: 0, opacity: 1 },
          { x: away(lines[1], 1), opacity: 0, ease: "none", duration: 1, immediateRender: false },
          "<",
        )
        .fromTo(desc, { y: 0, opacity: 1 }, { y: -80, opacity: 0, ease: "none", duration: 1, immediateRender: false }, "<");
    },
  },

  // 06 : 04 의 확대·소멸 뒤에 판이 scale 0 → 1 로 들어온다
  // ⚠ 판이 들어오는 시작을 -0.3 만큼 당긴다 — 글자가 완전히 사라진 뒤에 시작하면
  //    빈 화면이 한 박자 생긴다.
  {
    id: "gt06",
    len: "+=250%",
    build: (tl, sec) => {
      const txt = q(sec, ".gt_impact");
      const shot = q(sec, ".gt_shot");
      tl.from(txt, { opacity: 0, scale: 15, ease: "none", duration: 1 })
        .to(txt, { opacity: 0, scale: 1, ease: "none", duration: 1 })
        .from(shot, { opacity: 0, scale: 0, ease: "none", duration: 1.2 }, ">-0.3");
    },
  },

  // 07 : 스크롤 진행도를 숫자·막대에 그대로 쓴다
  // ⚠ 숫자를 직접 세지 않는다. 값을 담은 객체 하나를 애니메이트하고 그 값을 DOM 에 옮긴다 —
  //    그래야 scrub 이 되감길 때 숫자도 같이 줄어든다(직접 세면 되감기가 안 된다).
  // ⚠ 매 프레임 DOM 을 건드리므로 값이 실제로 바뀐 때만 쓴다.
  {
    id: "gt07",
    len: "+=150%",
    build: (tl, sec) => {
      const num = q(sec, ".gt_count .num");
      const bar = q(sec, ".gt_bar span");
      const state = { v: 0 };
      let last = -1;
      tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, ease: "none", duration: 0.4 }).to(
        state,
        {
          v: 100,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            const p = Math.round(state.v);
            if (p === last) return;
            last = p;
            num.textContent = String(p);
            bar.style.width = p + "%";
          },
        },
        0,
      );
    },
  },

  // 08 : 패럴랙스 — 겹친 판이 서로 다른 속도로 움직여 깊이를 만든다
  // ⚠ px 가 아니라 yPercent 를 쓴다. 요소 높이 기준이라 화면 크기가 달라져도 비율이 유지된다.
  //    px 로 두면 좁은 화면에서 판이 화면 밖으로 과하게 나간다.
  {
    id: "gt08",
    len: "+=200%",
    build: (tl, sec) => {
      const layers = qa(sec, ".gt_layer");
      tl.to(layers[0], { yPercent: -20, ease: "none" }, 0)
        .to(layers[1], { yPercent: -50, ease: "none" }, 0)
        .to(layers[2], { yPercent: -85, ease: "none" }, 0);
    },
  },

  // 09 : 마퀴 — 끊기지 않고 흐르고, 스크롤 방향에 따라 뒤집힌다
  // ⚠ 구간을 고정하지 않는다(pin: false). 흐름은 스크롤과 무관하게 계속 돌아간다.
  // ⚠ 내용을 두 벌 깔고 절반(xPercent -50)만 밀면 이음매가 보이지 않는다.
  //    한 벌만 깔고 -100 까지 밀면 되돌아오는 순간이 눈에 띈다.
  {
    id: "gt09",
    len: "bottom top",
    pin: false,
    build: (tl, sec) => {
      const row = q(sec, ".gt_marquee_row");
      const loop = gsap.to(row, { xPercent: -50, ease: "none", duration: 14, repeat: -1 });

      // self.direction : 아래로 1, 위로 -1. 흐르는 방향을 그대로 뒤집는다.
      ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => loop.timeScale(self.direction === 1 ? 1 : -1),
      });

      // ⚠ 무한 트윈은 컨텍스트가 되돌릴 때 함께 죽지만, 되돌리기 전에 멈춰 두는 편이 확실하다.
      //    build 가 돌려준 함수는 구간을 걷을 때 불린다(revertSection 참조).
      return () => loop.kill();
    },
  },

  // 10 : 좌측 목차가 붙고, 우측 단계가 지날 때마다 목차가 바뀐다
  // ⚠ 단계마다 트리거를 따로 만든다. 한 트리거의 진행도로 나누면 단계 높이가 달라질 때 어긋난다.
  {
    id: "gt10",
    len: "bottom top",
    pin: false,
    build: (tl, sec) => {
      const btns = qa(sec, ".gt_nav button");
      const steps = qa(sec, ".gt_step");

      const setActive = (n: number) => btns.forEach((b, i) => b.classList.toggle("on", i === n));

      // 그 단계가 화면 가운데 띠에 걸쳐 있는 동안 목차를 켠다
      steps.forEach((step, n) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive) setActive(n);
          },
        });
      });

      // 단계는 순서대로 떠오른다
      gsap.from(steps, {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: sec, start: "top 70%", end: "top 20%", scrub: SCRUB },
      });

      // 목차를 누르면 그 단계로 간다.
      // ⚠ **리스너는 구간을 걷을 때 함께 떼야 한다.** 안 떼면 다시 지을 때마다 쌓인다 —
      //    그래서 정리 함수를 돌려준다.
      //    (React onClick 으로 붙이지 않은 이유 — steps 좌표는 구간을 다시 지을 때마다
      //     달라지는데, 그 시점을 아는 것은 build 쪽이다.)
      const offs: Array<() => void> = [];
      btns.forEach((btn, n) => {
        const onClick = () => steps[n].scrollIntoView({ behavior: "smooth", block: "center" });
        btn.addEventListener("click", onClick);
        offs.push(() => btn.removeEventListener("click", onClick));
      });
      return () => offs.forEach((off) => off());
    },
  },

  // 11 : 판을 고정한 채 화면 전체가 가로로 넘어간다 (풀스크린 6장)
  // ⚠ 구간 타임라인은 고정하지 않는다(pin: false). 고정은 아래 가로 트리거가 직접 건다 —
  //    한 구간을 두 트리거가 고정하면 여백이 두 번 잡혀 스크롤이 두 배로 늘어난다.
  // ⚠ 이동량(트랙 폭 - 화면 폭)은 값이 아니라 함수로 넘기고 invalidateOnRefresh 로 다시 잰다.
  //    그래서 이 구간은 폭이 바뀌어도 다시 지을 필요가 없다(bp 를 켜지 않는 이유다).
  // ⚠ 판 폭은 CSS(100vw)가 정한다. JS 가 폭까지 계산하면 폰트·이미지가 늦게 들어올 때 값이 틀어진다.
  {
    id: "gt11",
    len: "bottom top",
    pin: false,
    build: (tl, sec) => {
      const pin = q(sec, ".gt_hpin");
      const track = q(sec, ".gt_htrack");
      const panels = Array.from(track.children) as HTMLElement[];

      // 트랙이 가로로 가야 하는 거리. scrollWidth 는 넘치는 폭까지 포함한다.
      const travel = () => Math.max(1, track.scrollWidth - pin.clientWidth);

      // 고정 + 가로 이동. 스크롤 길이를 이동량과 같게 잡아 1:1 로 움직이게 한다.
      const slide = gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => "+=" + travel(),
          pin: pin,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 판 안의 글은 그 판이 화면에 들어올 때 뜬다.
      // ⚠ 판이 고정돼 세로로 움직이지 않으므로 세로 위치로는 「지금 화면 어디인지」를 알 수 없다.
      //    containerAnimation 을 주면 start 를 가로 좌표로 읽어 준다.
      panels.forEach((panel) => {
        gsap.from(q(panel, ".gt_panel_in"), {
          y: 40,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 70%" },
        });
      });
    },
  },

  // 12 : 마무리
  {
    id: "gt12",
    len: "+=100%",
    build: (tl, sec) => {
      tl.from(q(sec, ".gt_inner"), { y: 40, opacity: 0, ease: "none" });
    },
  },
];
