import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════════
 * 구간 설정의 타입과 요소 찾기 — **손으로 유지하는 파일**이다.
 *
 * 구간 자체(SECTIONS)는 dev_gsap_template.html 에서 생성된다(gsapSections.ts).
 * 여기는 그 생성물이 기대는 바닥이다 — html 의 SECTIONS 주석에 적힌 항목이
 * 늘거나 줄면 아래 SectionConf 를 같이 고친다.
 * ═══════════════════════════════════════════════════════════════ */

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
   * 폭에 따라 설정이 달라지는 구간이라는 표시.
   * 이 표시가 있는 구간만 폭이 바뀔 때 다시 짓는다.
   * ⚠ mobile 을 갖거나 build 안에서 isMobile 로 갈라지면 반드시 켠다.
   *   빼먹으면 폭이 바뀌어도 옛 설정으로 남아 조용히 어긋난다.
   */
  bp?: boolean;
  /**
   * 페이지가 열리면 스크롤과 상관없이 **스스로 한 번 재생**하는 등장 연출.
   * 첫 화면처럼 「스크롤하기 전에 이미 떠 있어야 하는」 구간에 쓴다.
   * ⚠ 첫 설치 때 한 번만 돈다 — 폭이 바뀌어 구간을 다시 지어도 되풀이하지 않는다.
   * ⚠ build 와 **같은 요소를 잡지 않는다.** 같은 속성을 두고 다투면
   *   스크롤이 진행도 0 을 칠하는 순간 등장이 덮어써진다.
   * ⚠ html 쪽 엔진에는 아직 이 항목이 없다 — 쓰려면 html 엔진에도 같이 넣어야 짝이 맞는다.
   */
  intro?: (tl: gsap.core.Timeline, sec: HTMLElement, isMobile: boolean) => SectionCleanup;
  /** 타임라인을 짜는 함수. 정리할 것이 있으면 함수를 돌려준다. */
  build: (tl: gsap.core.Timeline, sec: HTMLElement, isMobile: boolean) => SectionCleanup;
};

/* 마크업은 page.tsx 가 고정으로 들고 있다 — 선택자는 늘 맞는다고 본다.
 * ⚠ html 원본의 `sec.querySelector(...)` 가 변환기를 지나며 이 둘로 바뀐다.
 *   strict 에서 Element|null 을 그대로 쓰면 offsetWidth 하나에도 막힌다. */
export const q = (root: ParentNode, sel: string) => root.querySelector(sel) as HTMLElement;
export const qa = (root: ParentNode, sel: string) => Array.from(root.querySelectorAll(sel)) as HTMLElement[];
