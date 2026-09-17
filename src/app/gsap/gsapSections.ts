/* ═══════════════════════════════════════════════════════════════
 * 구간 설정
 *
 * ⚠ 이 파일은 dev_gsap_template.html 의 SECTIONS 배열에서 **자동 생성된다.** 손으로 고치지 않는다.
 *    연출을 고칠 곳은 html 이다 (고친 뒤 : npm run gsap:sync · 지켜보려면 npm run gsap:watch).
 *    여기서 고쳐 봐야 다음 변환 때 덮어써진다.
 *
 * 타입과 q/qa 는 gsapTypes.ts 에 있다 — 그쪽은 손으로 유지한다.
 * ═══════════════════════════════════════════════════════════════ */
/* eslint-disable */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { q, qa, type SectionConf } from "./gsapTypes";

export type { SectionConf, SectionCleanup } from "./gsapTypes";

/** 스크롤을 얼마나 느긋하게 따라갈지. true(=즉시) 대신 숫자를 주면 그만큼 지연되며 따라온다. */
export const SCRUB = 0.4;

/**
 * 폭 경계.
 * ⚠ css 의 @media 와 같아야 한다 — 둘 다 html 한 곳에서 나오니 저절로 맞는다.
 */
export const MOBILE_MQ = "(max-width: 750px)";

/**
 * html 의 모듈 스코프 mq 를 대신한다 — 구간 설정이 mq.matches 로 지금 폭을 묻는다.
 * ⚠ 물을 때마다 읽는다(게터). 모듈을 읽는 시점에 matchMedia 를 부르면
 *   서버에서 미리 그릴 때 window 가 없어 터진다.
 */
const mq = {
  get matches() {
    return typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches;
  },
};

/* ───────────────────────────────────────────────────────────
 * 구간 설정
 *   id     : 구간 요소 id
 *   len    : 고정해 둘 스크롤 길이("+=100%" = 화면 한 번 분량) 또는 end 문자열
 *   pin    : false 면 고정하지 않는다(기본 true)
 *   bg     : 이 구간에 들어서면 배경판이 될 색
 *   bgStart: 배경이 넘어가기 시작하는 지점(기본 top 60%)
 *   fadeBeforeBg : 다음 구간 배경이 바뀌기 전에 걷을 요소들(선택자 배열)
 *   mobile : 모바일에서 덮어쓸 값 { unpin, start, end, fadeBeforeBg }
 *            ⚠ unpin 만 켜고 start·end 를 두면 시작점이 틀어진다 — 기본값 top top 은
 *              「판이 화면을 다 채운 뒤」라 고정 구간에서만 맞다.
 *   invalidate : 다시 잴 때 트윈 값을 다시 기록한다
 *            ⚠ 이걸 켠 구간에서는 from() 을 쓰지 않는다.
 *              from() 은 「지금 값」을 도착점으로 다시 적어 버려 영영 보이지 않게 된다. fromTo() 를 쓴다.
 *   scrub  : 구간별 scrub 값(기본 SCRUB)
 *   bp     : 폭에 따라 설정이 달라지는 구간이라는 표시.
 *            이 표시가 있는 구간만 폭이 바뀔 때 다시 짓는다.
 *            ⚠ mobile 을 갖거나 build 안에서 isMobile 로 갈라지면 반드시 켠다.
 *              빼먹으면 폭이 바뀌어도 옛 설정으로 남아 조용히 어긋난다.
 *   build  : 타임라인을 짜는 함수. (tl, sec, isMobile) 을 받는다.
 *            정리할 것이 있으면 함수를 돌려준다 — 구간을 걷을 때 같이 불린다.
 * ─────────────────────────────────────────────────────────── */
/* 한 칸씩 멈춰 서며 도는 줄 (12 구간)
 *
 * ⚠ **클론을 마크업에 적지 않는다.** 줄 전체를 -50% 옮겼을 때 클론 첫 장이 제자리에 와야
 *    되감기가 눈에 안 띄는데, 그 한 벌을 손으로 적어 두면 장수를 늘릴 때 어긋난다.
 *    여기서 원본 벌을 복제한다 — 장수가 바뀌어도 저절로 맞는다.
 *
 * ⚠ **CSS @keyframes 로는 못 한다.** 단계 수가 장수에 따라 달라지는데 keyframes 의
 *    퍼센트는 값을 받을 수 없다. 흐르기만 하는 마퀴라면 CSS 가 맞다 — 멈춰 서야 해서 GSAP 이다. */
var SHOT_HOLD = 3;   // 한 장을 보여 주는 시간(초)
var SHOT_MOVE = 1;   // 다음 장으로 넘어가는 시간(초)

function buildRoll(sec: any) {
  var track = q(sec, ".gt_roll_track");
  var set = track && q(track, ".gt_roll_set");
  if (!set) { return; }
  var shots = set.children.length;
  if (shots < 2) { return; }

  // 이미 복제했으면 다시 만들지 않는다(구간을 다시 지을 때 겹친다)
  if (track.children.length < 2) {
    var clone = set.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  // ⚠ 한 칸 = 줄 전체(원본 + 클론 = shots × 2 칸) 중 하나 = 100 ÷ (shots × 2) %.
  //    shots 번 밀면 정확히 -50% 라 클론 첫 장이 제자리에 와 0% 와 같은 그림이 된다.
  var stepPct = 100 / (shots * 2);
  var roll = gsap.timeline({ repeat: -1 });
  for (var k = 1; k <= shots; k++) {
    roll
      .to(track, { duration: SHOT_HOLD })
      .to(track, { xPercent: -stepPct * k, duration: SHOT_MOVE, ease: 'power2.inOut' });
  }
}

export const SECTIONS: SectionConf[] = [

  // 01 : 고정 + 글자·박스가 순차로 떠오른다
  { id: 'gt01', len: '+=150%', build: function (tl, sec) {
    tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, ease: 'none' })
      .from(q(sec, ".gt_txt"), { y: 40, opacity: 0, ease: 'none' }, '>0.2')
      .from(qa(sec, ".gt_grid .gt_box"), { y: 40, opacity: 0, stagger: 0.3, ease: 'none' }, '>0.3')
      // 걷지 않으면 다음 구간의 어두운 바탕 위에 검은 글자가 묻는다
      .to(q(sec, ".gt_inner"), { y: -40, opacity: 0, ease: 'none' }, '>0.6');
  }},

  // 02 : 배경이 검정으로 넘어간다
  // ⚠ bgStart 를 늦추면 01 이 걷히는 것도 같이 늦어진다 — 걷기의 끝이 이 값을 그대로 쓴다.
  { id: 'gt02', len: '+=150%', bg: '#292a31', bgStart: 'top 40%',
    fadeBeforeBg: ['.gt_inner'], build: function (tl, sec) {
    tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, ease: 'none' })
      .from(q(sec, ".gt_txt"), { y: 40, opacity: 0, ease: 'none' }, '>0.2')
      .from(qa(sec, ".gt_grid .gt_box"), { y: 40, opacity: 0, stagger: 0.3, ease: 'none' }, '>0.3');
  }},

  // 03 : 폭에 따라 연출이 통째로 다르다 — 이 템플릿의 핵심
  // ⚠ 구간 자체는 어느 쪽이든 고정하지 않는다(pin: false). 판이 화면 한 장에 안 들어가기 때문이다.
  //    그래서 구간 타임라인(tl)은 비워 두고 연출을 따로 건다.
  { id: 'gt03', len: 'bottom top', pin: false, bp: true, fadeBeforeBg: ['.gt_follow'],
    mobile: { fadeBeforeBg: [] }, build: function (tl, sec, isMobile) {
    var follow = q(sec, ".gt_follow");
    var row = q(sec, ".gt_follow_list");
    var cards = qa(sec, ".gt_card");

    if (isMobile) {
      // ⚠ 크기를 재는 기준은 고정하지 않는 요소여야 한다.
      //    ScrollTrigger 는 고정할 때 그 요소에 width 를 인라인으로 심는다 —
      //    고정이 걸리던 시점의 폭이라, 폭을 오가면 옛 값을 읽는 순간이 생긴다.
      //    .gt_pin 은 이 구간에서 한 번도 고정되지 않으므로 늘 지금 폭을 돌려준다.
      var win = q(sec, ".gt_pin");
      // ⚠ 이동량은 값이 아니라 함수로 넘기고 invalidateOnRefresh 로 다시 잰다.
      var travel = function () { return Math.max(1, row.offsetWidth - win.clientWidth); };

      // 글은 고정이 걸리기 전에 다 뜬다
      gsap.from(qa(sec, ".gt_follow_txt > *"), {
        y: 40, opacity: 0, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: follow, start: 'top 85%', end: 'top 30%', scrub: SCRUB }
      });

      // 고정 + 가로 이동
      var slide = gsap.to(row, {
        x: function () { return -travel(); }, ease: 'none',
        scrollTrigger: {
          trigger: follow, start: 'top 80px',
          end: function () { return '+=' + travel(); },
          pin: follow, anticipatePin: 1, scrub: 1, invalidateOnRefresh: true
        }
      });

      // 카드 등장 — 판이 고정돼 세로로 움직이지 않으므로 세로 위치로는 「지금 화면 어디인지」를 알 수 없다.
      // containerAnimation 을 주면 start 를 가로 좌표로 읽어 준다.
      cards.forEach(function (card) {
        gsap.from(card, {
          y: 30, opacity: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 90%' }
        });
      });

      // 퇴장 — 가로로 다 민 뒤에 걷는다.
      // ⚠ 그 지점을 slide 의 트리거에서 읽지 않고 직접 구한다 — 남의 트리거를 읽으면
      //    그쪽이 먼저 걷힌 순간(폭이 바뀔 때 늘 생긴다) 사라진 것을 읽어 오류가 난다.
      var pinTop = function () {
        var r = win.getBoundingClientRect();
        var padTop = parseFloat(getComputedStyle(win).paddingTop) || 0;
        return r.top + (window.pageYOffset || 0) + padTop - 80;
      };
      gsap.to(follow, {
        opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: follow,
          start: function () { return pinTop() + travel(); },
          end: function () { return pinTop() + travel() + 400; },
          scrub: SCRUB, invalidateOnRefresh: true
        }
      });
    } else {
      // 데스크톱 — 좌측 글이 sticky 로 붙고 우측 카드가 그 옆을 지나간다.
      // ⚠ 글이 다 뜬 다음에 카드가 시작한다. 넘겨주는 지점을 상수로 두고
      //    글의 end 와 카드의 start 에 같은 값을 쓴다. 시간(초)에 맡기면 빠른 스크롤에 순서가 뒤집힌다.
      // ⚠ start 가 HANDOVER 보다 화면 아래여야 한다. 퍼센트가 클수록 화면 아래 = 스크롤상 먼저다.
      //    start 60% / HANDOVER 80% 로 두면 end 가 start 보다 일러 범위가 뒤집힌다.
      var HANDOVER = 'top 80%';
      gsap.from(qa(sec, ".gt_follow_txt > *"), {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: follow, start: 'top 95%', end: HANDOVER, scrub: SCRUB }
      });
      gsap.from(cards, {
        y: 120, opacity: 0, stagger: 0.35, ease: 'none',
        scrollTrigger: { trigger: follow, start: HANDOVER, end: 'bottom bottom', scrub: SCRUB }
      });
    }
  }},

  // 04 : 한 문장이 떠오른 뒤 화면을 향해 커지며 사라진다
  // ⚠ 커지는 쪽을 떠오르는 쪽보다 길게 잡는다 — 같은 길이면 확대가 순식간에 끝나
  //    「사라진다」가 아니라 「깜빡인다」로 보인다.
  // ⚠ 퇴장을 따로 붙이지 않는다. 확대가 끝나는 지점에 이미 opacity 0 이다.
  { id: 'gt04', len: '+=150%', bg: '#292a31', build: function (tl, sec) {
    var txt = q(sec, ".gt_impact");
    tl.from(txt, { opacity: 0, scale: 15, ease: 'none', duration: 1 })
      .to(txt, { opacity: 0, scale: 1, ease: 'none', duration: 1 });
  }},

  // 05 : 두 줄이 좌·우 화면 밖에서 들어오고 설명은 아래에서 올라온다.
  //      빠져나갈 때는 왔던 방향으로 되돌아 나간다.
  // ⚠ 이동 거리를 「화면 절반 + 그 줄의 절반」으로 잡는 것이 핵심이다 — 고정값으로 두면
  //    넓은 화면에서는 글자가 덜 나가 걸쳐 있고, 좁은 화면에서는 필요 이상으로 멀리 간다.
  // ⚠ 그래서 invalidate 를 켠다 — 다시 잴 때마다 거리를 새로 구해야 한다.
  { id: 'gt05', len: '+=200%', bg: '#ffffff', invalidate: true, build: function (tl, sec) {
    var lines = qa(sec, ".gt_lead .tit span");
    var desc = q(sec, ".gt_lead .desc");

    // 그 줄을 화면 밖으로 완전히 빼는 거리. dir 이 -1 이면 왼쪽, 1 이면 오른쪽.
    // ⚠ 값이 아니라 함수로 넘긴다 — invalidate 될 때 GSAP 이 다시 부른다.
    function away(el: any, dir: any) {
      return function () { return dir * (window.innerWidth / 2 + el.offsetWidth / 2); };
    }

    // ⚠ from() 이 아니라 fromTo() 를 쓴다. 이 구간은 invalidate 가 켜져 있는데,
    //    from() 은 다시 잴 때 「지금 화면의 값」을 도착점으로 새로 잡는다.
    //    다시 재는 순간 글자는 이미 시작 상태(화면 밖·투명)라 「투명 → 투명」이 되어
    //    영영 보이지 않는다. fromTo 는 시작·도착을 둘 다 적어 두므로 몇 번을 다시 재도 같다.
    // ⚠ 퇴장 쪽은 immediateRender 를 꺼 둔다. 켜 두면 만들어지는 즉시 제 시작 상태를 칠해
    //    등장 쪽이 방금 깔아 둔 값(화면 밖·투명)을 덮어 첫 화면부터 글자가 보인다.
    tl.fromTo(lines[0], { x: away(lines[0], -1), opacity: 0 },
                        { x: 0, opacity: 1, ease: 'none', duration: 1 }, 0)
      .fromTo(lines[1], { x: away(lines[1], 1), opacity: 0 },
                        { x: 0, opacity: 1, ease: 'none', duration: 1 }, 0)
      .fromTo(desc, { y: 80, opacity: 0 },
                    { y: 0, opacity: 1, ease: 'none', duration: 1 }, 0.3)
      // 퇴장 — 왔던 방향으로 되돌아 나간다. 세 줄이 같은 순간에 함께 움직인다.
      // ⚠ 다 들어온 뒤 0.4 만큼 머물렀다가 나간다. 붙여 두면 읽을 틈 없이 지나간다.
      .fromTo(lines[0], { x: 0, opacity: 1 },
                        { x: away(lines[0], -1), opacity: 0, ease: 'none', duration: 1, immediateRender: false }, '>0.4')
      .fromTo(lines[1], { x: 0, opacity: 1 },
                        { x: away(lines[1], 1), opacity: 0, ease: 'none', duration: 1, immediateRender: false }, '<')
      .fromTo(desc, { y: 0, opacity: 1 },
                    { y: -80, opacity: 0, ease: 'none', duration: 1, immediateRender: false }, '<');
  }},

  // 06 : 04 의 확대·소멸 뒤에 판이 scale 0 → 1 로 들어온다
  // ⚠ 판이 들어오는 시작을 -0.3 만큼 당긴다 — 글자가 완전히 사라진 뒤에 시작하면
  //    빈 화면이 한 박자 생긴다.
  { id: 'gt06', len: '+=250%', build: function (tl, sec) {
    var txt = q(sec, ".gt_impact");
    var shot = q(sec, ".gt_shot");
    tl.from(txt, { opacity: 0, scale: 15, ease: 'none', duration: 1 })
      .to(txt, { opacity: 0, scale: 1, ease: 'none', duration: 1 })
      .from(shot, { opacity: 0, scale: 0, ease: 'none', duration: 1.2 }, '>-0.3');
  }},

  // 07 : 스크롤 진행도를 숫자·막대에 그대로 쓴다
  // ⚠ 숫자를 직접 세지 않는다. 값을 담은 객체 하나를 애니메이트하고 그 값을 DOM 에 옮긴다 —
  //    그래야 scrub 이 되감길 때 숫자도 같이 줄어든다(직접 세면 되감기가 안 된다).
  // ⚠ 매 프레임 DOM 을 건드리므로 값이 실제로 바뀐 때만 쓴다.
  { id: 'gt07', len: '+=150%', build: function (tl, sec) {
    var num = q(sec, ".gt_count .num");
    var bar = q(sec, ".gt_bar span");
    var state = { v: 0 };
    var last = -1;
    tl.from(q(sec, ".gt_tit"), { y: 40, opacity: 0, ease: 'none', duration: 0.4 })
      .to(state, {
      v: 100, ease: 'none', duration: 1,
      onUpdate: function () {
        var p = Math.round(state.v);
        if (p === last) { return; }
        last = p;
        num.textContent = String(p);
        bar.style.width = p + '%';
      }
      }, 0);
  }},

  // 08 : 패럴랙스 — 겹친 판이 서로 다른 속도로 움직여 깊이를 만든다
  // ⚠ px 가 아니라 yPercent 를 쓴다. 요소 높이 기준이라 화면 크기가 달라져도 비율이 유지된다.
  //    px 로 두면 좁은 화면에서 판이 화면 밖으로 과하게 나간다.
  { id: 'gt08', len: '+=200%', build: function (tl, sec) {
    var layers = qa(sec, ".gt_layer");
    tl.to(layers[0], { yPercent: -20, ease: 'none' }, 0)
      .to(layers[1], { yPercent: -50, ease: 'none' }, 0)
      .to(layers[2], { yPercent: -85, ease: 'none' }, 0);
  }},

  // 09 : 마퀴 — 끊기지 않고 흐르고, 스크롤 방향에 따라 뒤집힌다
  // ⚠ 구간을 고정하지 않는다(pin: false). 흐름은 스크롤과 무관하게 계속 돌아간다.
  // ⚠ 내용을 두 벌 깔고 절반(xPercent -50)만 밀면 이음매가 보이지 않는다.
  //    한 벌만 깔고 -100 까지 밀면 되돌아오는 순간이 눈에 띈다.
  { id: 'gt09', len: 'bottom top', pin: false, build: function (tl, sec) {
    var row = q(sec, ".gt_marquee_row");
    var loop = gsap.to(row, { xPercent: -50, ease: 'none', duration: 14, repeat: -1 });

    // self.direction : 아래로 1, 위로 -1. 흐르는 방향을 그대로 뒤집는다.
    ScrollTrigger.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) { loop.timeScale(self.direction === 1 ? 1 : -1); }
    });

    // ⚠ 무한 트윈은 컨텍스트가 되돌릴 때 함께 죽지만, 되돌리기 전에 멈춰 두는 편이 확실하다.
    //    build 가 돌려준 함수는 구간을 걷을 때 불린다(revertSection 참조).
    return function () { loop.kill(); };
  }},

  // 10 : 좌측 목차가 붙고, 우측 단계가 지날 때마다 목차가 바뀐다
  // ⚠ 단계마다 트리거를 따로 만든다. 한 트리거의 진행도로 나누면 단계 높이가 달라질 때 어긋난다.
  { id: 'gt10', len: 'bottom top', pin: false, build: function (tl, sec) {
    var btns = qa(sec, ".gt_nav button");
    var steps = qa(sec, ".gt_step");

    function setActive(n: any) {
      btns.forEach(function (b, i) { b.classList.toggle('on', i === n); });
    }

    // 그 단계가 화면 가운데 띠에 걸쳐 있는 동안 목차를 켠다
    steps.forEach(function (step, n) {
      ScrollTrigger.create({
        trigger: step, start: 'top 60%', end: 'bottom 60%',
        onToggle: function (self) { if (self.isActive) { setActive(n); } }
      });
    });

    // 단계는 순서대로 떠오른다
    gsap.from(steps, {
      y: 60, opacity: 0, stagger: 0.2, ease: 'power2.out',
      scrollTrigger: { trigger: sec, start: 'top 70%', end: 'top 20%', scrub: SCRUB }
    });

    // 목차를 누르면 그 단계로 간다.
    // ⚠ **리스너는 구간을 걷을 때 함께 떼야 한다.** 안 떼면 다시 지을 때마다 쌓인다 —
    //    그래서 정리 함수를 돌려준다.
    var offs: any[] = [];
    btns.forEach(function (btn, n) {
      var onClick = function () { steps[n].scrollIntoView({ behavior: 'smooth', block: 'center' }); };
      btn.addEventListener('click', onClick);
      offs.push(function () { btn.removeEventListener('click', onClick); });
    });
    return function () { offs.forEach(function (off) { off(); }); };
  }},

  // 11 : 판을 고정한 채 화면 전체가 가로로 넘어간다 (풀스크린 6장)
  // ⚠ 구간 타임라인은 고정하지 않는다(pin: false). 고정은 아래 가로 트리거가 직접 건다 —
  //    한 구간을 두 트리거가 고정하면 여백이 두 번 잡혀 스크롤이 두 배로 늘어난다.
  // ⚠ 이동량(트랙 폭 - 화면 폭)은 값이 아니라 함수로 넘기고 invalidateOnRefresh 로 다시 잰다.
  //    그래서 이 구간은 폭이 바뀌어도 다시 지을 필요가 없다(bp 를 켜지 않는 이유다).
  // ⚠ 판 폭은 CSS(100vw)가 정한다. JS 가 폭까지 계산하면 폰트·이미지가 늦게 들어올 때 값이 틀어진다.
  { id: 'gt11', len: 'bottom top', pin: false, build: function (tl, sec) {
    var pin = q(sec, ".gt_hpin");
    var track = q(sec, ".gt_htrack");
    var panels = (Array.from(track.children) as HTMLElement[]);

    // 트랙이 가로로 가야 하는 거리. scrollWidth 는 넘치는 폭까지 포함한다.
    var travel = function () { return Math.max(1, track.scrollWidth - pin.clientWidth); };

    // 고정 + 가로 이동. 스크롤 길이를 이동량과 같게 잡아 1:1 로 움직이게 한다.
    var slide = gsap.to(track, {
      x: function () { return -travel(); }, ease: 'none',
      scrollTrigger: {
        trigger: sec, start: 'top top',
        end: function () { return '+=' + travel(); },
        pin: pin, anticipatePin: 1, scrub: 1, invalidateOnRefresh: true
      }
    });

    // 판 안의 글은 그 판이 화면에 들어올 때 뜬다.
    // ⚠ 판이 고정돼 세로로 움직이지 않으므로 세로 위치로는 「지금 화면 어디인지」를 알 수 없다.
    //    containerAnimation 을 주면 start 를 가로 좌표로 읽어 준다.
    panels.forEach(function (panel) {
      gsap.from(q(panel, ".gt_panel_in"), {
        y: 40, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left 70%' }
      });
    });
  }},

  // 12 : 기기 화면이 한 칸씩 바뀐다
  //
  // ⚠ 등장은 **타임라인 하나에 ScrollTrigger 하나**로 묶는다.
  //    같은 설정 객체를 여러 트윈의 scrollTrigger 로 돌려 쓰면 ScrollTrigger 가 그 객체에
  //    animation 을 써 넣으면서 연결이 서로를 덮어쓴다 — 마지막 트윈만 살고
  //    나머지는 from 상태(opacity 0)에 굳는다.
  //
  // ⚠ from() 이 아니라 **fromTo()** 다. from() 은 「지금 값」을 목적지로 기록해서,
  //    되감은 뒤 이미 opacity: 0 인 상태에서 다시 재면 0 → 0 이 되어 영영 안 보인다.
  //
  // ⚠ toggleActions 의 'reset' — 위로 빠져나가면 처음으로 되돌려 다시 내려올 때 또 보인다.
  { id: 'gt12', len: 'bottom top', pin: false, build: function (tl, sec) {
    var band = q(sec, ".gt_roll_band");
    var frame = q(sec, ".gt_roll_frame");
    var steps = [
      q(sec, ".gt_tit"),
      q(sec, ".gt_txt"),
      q(sec, ".gt_roll_btn")
    ].filter(Boolean);

    buildRoll(sec);

    gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top 70%', toggleActions: 'restart none none reset' }
    })
      .fromTo(band, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 0.9, ease: 'power2.out'
      })
      // 기기는 오른쪽에서 왼쪽으로 밀려 들어온다
      // ⚠ px 이 아니라 xPercent 다 — 창 폭이 바뀌어도 들어오는 거리가 따라온다
      .fromTo(frame, { xPercent: 45, opacity: 0 }, {
        xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out'
      }, '-=0.6')
      .fromTo(steps, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out'
      }, '-=0.7');
  }},

  // 13 : 문구가 커진 채 왔다가 사라지고, **그 자리를** 넓은 판이 이어받는다.
  // ⚠ 이어받는 지점을 '>-0.3' 으로 **겹친다.** 붙여 두면 문구가 완전히 사라진 뒤에
  //    판이 시작해 「바뀐다」가 아니라 「하나 끝나고 하나 시작한다」로 보인다.
  // ⚠ 판은 scale 0 에서 시작한다 — opacity 도 같이 올려야 한다.
  //    scale 만 쓰면 0 에서도 한 점이 찍혀 보이고, 커지는 첫 순간이 툭 튄다.
  // ⚠ **폭에 따라 연출이 다르다**(bp: true — 750 을 오가면 다시 짓는다).
  //    데스크톱 : 판이 화면 폭에 맞춰 줄고 scale 0 에서 커진다.
  //    모바일   : 줄이지 않는다. **원본 1120 그대로** 두고 스크롤이 가로로 민다 —
  //               좁은 화면에 넓은 표를 욱여넣으면 글자가 읽히지 않기 때문이다.
  // ⚠ invalidate 를 켠다 — 미는 거리가 화면 폭에 달려 있어 다시 잴 때마다 새로 구해야 한다.
  //    그래서 등장이 from() 이 아니라 **fromTo()** 다(05 의 주의와 같은 이유).
  { id: 'gt13', len: '+=250%', bp: true, invalidate: true, build: function (tl, sec, isMobile) {
    var txt = q(sec, ".gt_zoom .gt_tit");
    var sheet = q(sec, ".gt_sheet");
    var box = sheet && q(sheet, ".gt_sheet_box");

    // 문구 — 확대된 채 흐릿하게 왔다가 제자리에서 사라진다
    tl.fromTo(txt, { opacity: 0, scale: 15 },
                   { opacity: 1, scale: 1, ease: 'none', duration: 1 })
      .to(txt, { opacity: 0, ease: 'none', duration: 1 });

    if (isMobile && box) {
      // 밀 거리 = 원본 폭 - **실제로 보이는 폭**.
      // ⚠⚠ 「보이는 폭」을 창의 width 로 재면 두 가지가 어긋난다 —
      //     ① 창을 화면보다 넓게 잡으면 그 값이 원본을 넘겨 **거리가 0 이 되어 아무 일도 안 일어난다.**
      //     ② 창에 좌우 padding 이 있으면 판이 쉬는 자리가 창 왼쪽 끝이 아니라 **여백 뒤**다 —
      //        그만큼 더 밀지 않으면 딱 그 값만큼이 끝까지 안 밀려 잘린 채 남는다.
      //     그래서 **판이 쉬는 자리부터 실제로 보이는 오른쪽 끝까지**를 직접 잰다.
      // ⚠ 값이 아니라 **함수**로 넘긴다 — invalidate 될 때 GSAP 이 다시 부른다.
      // ⚠ **지금이 모바일일 때만 잰다.** 폭이 바뀌어 데스크톱 CSS 가 먼저 적용된 순간에
      //    재면 판이 이미 화면 폭으로 줄어 있어 거리가 0 으로 주저앉는다.
      // ⚠ 화면 폭은 documentElement 에서 읽는다. .gt_pin 은 **이 구간에서 고정되는 요소**라
      //    ScrollTrigger 가 심어 둔 인라인 width 를 돌려줄 수 있다.
      var travel = function () {
        if (!mq.matches) { return 0; }
        var cs = getComputedStyle(sheet);
        var padL = parseFloat(cs.paddingLeft) || 0;
        var padR = parseFloat(cs.paddingRight) || 0;
        var rect = sheet.getBoundingClientRect();
        var startX = rect.left + padL;
        var endX = Math.min(rect.right - padR, document.documentElement.clientWidth);
        return Math.max(0, box.offsetWidth - (endX - startX));
      };
      tl.fromTo(sheet, { opacity: 0 },
                       { opacity: 1, ease: 'none', duration: 0.6 }, '>-0.3')
        // 가로 밀기 — 구간이 이미 고정 + scrub 이라 **스크롤이 그대로 가로 이동이 된다.**
        //    따로 핀을 걸 필요가 없다(03 은 구간을 고정하지 않아 제 핀을 따로 건다).
        .to(box, { x: function () { return -travel(); }, ease: 'none', duration: 2 });
    } else {
      tl.fromTo(sheet, { opacity: 0, scale: 0 },
                       { opacity: 1, scale: 1, ease: 'none', duration: 1.2 }, '>-0.3');
    }
  }},

  // 14 : 마무리
  { id: 'gt14', len: '+=100%', build: function (tl, sec) {
    tl.from(q(sec, ".gt_inner"), { y: 40, opacity: 0, ease: 'none' });
  }}
];
