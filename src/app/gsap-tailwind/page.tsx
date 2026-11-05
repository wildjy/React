"use client";

import { useRef } from "react";
import { useGsapTemplate } from "../gsap/useGsapTemplate";
import "./gsap-tailwind-engine.css";

/**
 * [개발 확인용] GSAP 스크롤 템플릿 — Tailwind CSS 버전
 *
 * ../gsap/page.tsx 와 똑같은 14개 구간·똑같은 연출이다. 다른 점은 딱 하나,
 * 스타일을 전부 Tailwind 유틸리티 클래스로 짰다는 것이다(커스텀 gsap-template.css 없음).
 *
 * ⚠ gt_ 로 시작하는 클래스 이름(.gt_pin · .gt_tit · .gt_follow 등)은 지우면 안 된다.
 *    장식이 아니라 **엔진이 querySelector 로 요소를 찾는 이름표**다 — 실제 선택자는
 *    ../gsap/gsapSections.ts 에 있다. Tailwind 클래스는 그 옆에 "추가"한 것일 뿐,
 *    gt_ 클래스 자체는 이제 스타일을 하나도 갖지 않는다(순수 식별자).
 * ⚠ 애니메이션 엔진(useGsapTemplate)과 구간 설정(SECTIONS)은 ../gsap 폴더 것을 그대로
 *    가져와 쓴다 — 거기서만 손으로 유지한다. 중복해서 들고 있지 않는다.
 * ⚠ 엔진이 런타임에 직접 DOM class 를 붙이는 극소수 지점(.is_snap · .on · 진행 점)만
 *    ./gsap-tailwind-engine.css 에 남아 있다. 이유는 그 파일 맨 위 주석 참조.
 */
export default function GsapTailwindPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapTemplate(rootRef);

  return (
    <div className="gt_page font-sans text-[#292a31] leading-[normal] tracking-[normal]" ref={rootRef}>
      <div
        className="gt_bg pointer-events-none fixed inset-0 z-0 bg-white transition-colors duration-[600ms] ease-in-out"
        aria-hidden="true"
      />

      {/* 진행 표시 (mock 전용) : li 는 엔진이 직접 심는다 — 여기서는 빈 채로 둔다 */}
      <ul className="gt_progress fixed right-6 top-1/2 z-30 m-0 flex -translate-y-1/2 flex-col gap-2 p-0 [@media(max-width:1000px)]:hidden" />

      <div className="gt_wrap relative">
        {/* 01 : 고정 + 글자·박스가 떠오른다 (가장 기본) */}
        <section className="gt_sec relative z-[1]" id="gt01">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 01 — 고정 + 등장</h2>
              <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">
                판을 화면에 고정한 채 스크롤을 진행도로 바꿔 쓴다.
              </p>
              <div className="gt_grid mt-10 grid grid-cols-4 gap-5 [@media(max-width:750px)]:grid-cols-2">
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#eef0f4] text-lg font-bold text-[#5a5b6a]">BOX 1</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#eef0f4] text-lg font-bold text-[#5a5b6a]">BOX 2</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#eef0f4] text-lg font-bold text-[#5a5b6a]">BOX 3</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#eef0f4] text-lg font-bold text-[#5a5b6a]">BOX 4</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 : 고정 + 배경이 검정으로 넘어간다 */}
        <section className="gt_sec relative z-[1] text-white" id="gt02">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 02 — 배경 전환</h2>
              <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">
                배경은 구간이 아니라 화면에 깔린 판(.gt_bg) 하나가 칠한다.
              </p>
              <div className="gt_grid mt-10 grid grid-cols-4 gap-5 [@media(max-width:750px)]:grid-cols-2">
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#3a3a44] text-lg font-bold text-[#d2d2d6]">BOX 1</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#3a3a44] text-lg font-bold text-[#d2d2d6]">BOX 2</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#3a3a44] text-lg font-bold text-[#d2d2d6]">BOX 3</div>
                <div className="gt_box flex h-[220px] items-center justify-center rounded-xl bg-[#3a3a44] text-lg font-bold text-[#d2d2d6]">BOX 4</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 : 폭에 따라 연출이 통째로 다르다 (bp: true) */}
        <section className="gt_sec relative z-[1]" id="gt03">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <div className="gt_follow flex items-start gap-10 [@media(max-width:750px)]:block">
                <div className="gt_follow_txt sticky top-[140px] w-[340px] flex-none [@media(max-width:750px)]:static [@media(max-width:750px)]:mb-6 [@media(max-width:750px)]:w-auto">
                  <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 03</h2>
                  <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">폭이 바뀌면 이 구간만 다시 짓는다.</p>
                </div>
                <div className="gt_follow_list grid flex-1 grid-cols-2 gap-5 [@media(max-width:750px)]:flex [@media(max-width:750px)]:w-max">
                  <div className="gt_card flex h-[260px] items-center justify-center rounded-xl bg-[#e3f3e1] font-bold text-[#37833b] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">CARD 1</div>
                  <div className="gt_card flex h-[260px] items-center justify-center rounded-xl bg-[#e3f3e1] font-bold text-[#37833b] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">CARD 2</div>
                  <div className="gt_card flex h-[260px] items-center justify-center rounded-xl bg-[#e3f3e1] font-bold text-[#37833b] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">CARD 3</div>
                  <div className="gt_card flex h-[260px] items-center justify-center rounded-xl bg-[#e3f3e1] font-bold text-[#37833b] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">CARD 4</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 : 한 문장이 화면을 향해 커지며 사라진다 */}
        <section className="gt_sec relative z-[1] text-white" id="gt04">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <p className="gt_impact text-center text-[clamp(32px,6vw,64px)] font-extrabold leading-[1.4] [will-change:transform,opacity]">
                한 문장이 커지며 사라진다
              </p>
            </div>
          </div>
        </section>

        {/* 05 : 두 줄이 좌·우 화면 밖에서 들어오고 설명은 아래에서 올라온다 */}
        <section className="gt_sec relative z-[1]" id="gt05">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <div className="gt_lead text-center">
                <h2 className="tit mb-5 text-[clamp(26px,4.4vw,52px)] font-extrabold leading-[1.35]">
                  <span className="block [will-change:transform,opacity]">왼쪽에서 들어오는 줄,</span>
                  <span className="block [will-change:transform,opacity]">오른쪽에서 들어오는 줄</span>
                </h2>
                <p className="desc text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75 [will-change:transform,opacity]">
                  설명은 조금 늦게 아래에서 올라온다. 나갈 때는 왔던 방향으로 되돌아 나간다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 : 문장이 커지며 사라진 자리에 판이 scale 0 → 1 로 들어온다 */}
        <section className="gt_sec relative z-[1]" id="gt06">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <p className="gt_impact text-center text-[clamp(32px,6vw,64px)] font-extrabold leading-[1.4] [will-change:transform,opacity]">
                사라진 자리에 판이 들어온다
              </p>
              <div className="gt_shot mx-auto mt-8 flex h-[300px] max-w-[720px] items-center justify-center rounded-2xl bg-[#e3f3e1] font-bold text-[#37833b] [will-change:transform,opacity]">
                SHOT
              </div>
            </div>
          </div>
        </section>

        {/* 07 : 스크롤 진행도를 숫자와 막대에 그대로 쓴다 */}
        <section className="gt_sec relative z-[1]" id="gt07">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 07 — 진행도 쓰기</h2>
              <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">
                스크롤이 얼마나 진행됐는지를 숫자·막대에 그대로 옮긴다.
              </p>
              <p className="gt_count mx-0 mb-3 mt-10 text-[clamp(48px,10vw,120px)] font-extrabold leading-none">
                <span className="num">0</span>
                <em className="text-[0.4em] not-italic opacity-50">%</em>
              </p>
              <div className="gt_bar h-2 overflow-hidden rounded-full bg-[#e1e1e3]">
                <span className="block h-full w-0 rounded-full bg-[#00b80c]" />
              </div>
            </div>
          </div>
        </section>

        {/* 08 : 패럴랙스 — 겹친 판이 서로 다른 속도로 움직인다 */}
        <section className="gt_sec relative z-[1]" id="gt08">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 08 — 패럴랙스</h2>
              <div className="gt_parallax relative mt-10 h-[420px] [@media(max-width:750px)]:h-[360px]">
                <div className="gt_layer l1 absolute left-1/2 top-10 flex h-[300px] w-[88%] -translate-x-1/2 items-center justify-center rounded-2xl bg-[#e1e1e3] font-bold text-[#5a5b6a] will-change-transform [@media(max-width:750px)]:w-[96%]">
                  LAYER 1 (느리게)
                </div>
                <div className="gt_layer l2 absolute left-1/2 top-[110px] flex h-[260px] w-[64%] -translate-x-1/2 items-center justify-center rounded-2xl bg-[#cfe8cc] font-bold text-[#37833b] will-change-transform [@media(max-width:750px)]:w-[76%]">
                  LAYER 2
                </div>
                <div className="gt_layer l3 absolute left-1/2 top-[180px] flex h-[220px] w-[40%] -translate-x-1/2 items-center justify-center rounded-2xl bg-[#00b80c] font-bold text-white will-change-transform [@media(max-width:750px)]:w-[56%]">
                  LAYER 3 (빠르게)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 09 : 마퀴 — 끊기지 않고 흐르고, 스크롤 방향에 따라 뒤집힌다 */}
        <section className="gt_sec relative z-[1]" id="gt09">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 09 — 마퀴</h2>
              <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">위로 올리면 반대로 흐른다.</p>
            </div>
            <div className="gt_marquee mt-10 overflow-hidden">
              <div className="gt_marquee_row flex w-max will-change-transform">
                <span className="whitespace-nowrap text-[clamp(28px,5vw,64px)] font-extrabold tracking-[-0.02em] text-[#b4b4bb]">
                  GSAP&nbsp;·&nbsp;SCROLLTRIGGER&nbsp;·&nbsp;MARQUEE&nbsp;·&nbsp;
                </span>
                <span className="whitespace-nowrap text-[clamp(28px,5vw,64px)] font-extrabold tracking-[-0.02em] text-[#b4b4bb]">
                  GSAP&nbsp;·&nbsp;SCROLLTRIGGER&nbsp;·&nbsp;MARQUEE&nbsp;·&nbsp;
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 10 : 좌측 목차가 붙고, 우측 단계가 지날 때마다 목차가 바뀐다 */}
        <section className="gt_sec relative z-[1]" id="gt10">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_feature flex items-start gap-10 [@media(max-width:750px)]:block">
              <div className="gt_nav sticky top-[140px] w-[300px] flex-none [@media(max-width:750px)]:static [@media(max-width:750px)]:mb-6 [@media(max-width:750px)]:w-auto">
                <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 10</h2>
                <button
                  type="button"
                  className="on mt-2 block w-full rounded-[10px] border border-[#e1e1e3] bg-white px-[18px] py-[14px] text-left text-base font-bold text-[#9696a0] transition-colors duration-200"
                >
                  단계 1
                </button>
                <button
                  type="button"
                  className="mt-2 block w-full rounded-[10px] border border-[#e1e1e3] bg-white px-[18px] py-[14px] text-left text-base font-bold text-[#9696a0] transition-colors duration-200"
                >
                  단계 2
                </button>
                <button
                  type="button"
                  className="mt-2 block w-full rounded-[10px] border border-[#e1e1e3] bg-white px-[18px] py-[14px] text-left text-base font-bold text-[#9696a0] transition-colors duration-200"
                >
                  단계 3
                </button>
              </div>
              <div className="gt_steps grid flex-1 gap-5">
                <div className="gt_step flex h-[320px] items-center justify-center rounded-xl bg-[#eef0f4] font-bold text-[#5a5b6a] [@media(max-width:750px)]:h-[220px]">STEP 1</div>
                <div className="gt_step flex h-[320px] items-center justify-center rounded-xl bg-[#eef0f4] font-bold text-[#5a5b6a] [@media(max-width:750px)]:h-[220px]">STEP 2</div>
                <div className="gt_step flex h-[320px] items-center justify-center rounded-xl bg-[#eef0f4] font-bold text-[#5a5b6a] [@media(max-width:750px)]:h-[220px]">STEP 3</div>
              </div>
            </div>
          </div>
        </section>

        {/* 11 : 판을 고정한 채 화면 전체가 가로로 넘어간다 (풀스크린 6장) */}
        <section className="gt_sec relative z-[1]" id="gt11">
          <div className="gt_hpin h-screen overflow-hidden">
            <div className="gt_htrack flex h-full w-max will-change-transform">
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#eef0f4] px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">01</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">화면이 통째로 넘어간다</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">세로로 굴린 스크롤을 가로 이동으로 바꿔 쓴다.</p>
                </div>
              </div>
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#e3f3e1] px-10 py-20 text-[#37833b] [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">02</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">판은 고정돼 있다</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">움직이는 것은 안쪽 트랙뿐이다.</p>
                </div>
              </div>
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#ebf2ff] px-10 py-20 text-[#2264d1] [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">03</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">이동량은 함수로 넘긴다</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">창 크기가 바뀌면 다시 재야 하기 때문이다.</p>
                </div>
              </div>
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#fdedf2] px-10 py-20 text-[#c23564] [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">04</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">글은 가로 좌표로 띄운다</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">세로로 움직이지 않으니 세로 위치로는 알 수 없다.</p>
                </div>
              </div>
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#3a3a44] px-10 py-20 text-white [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">05</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">스크롤 길이 = 이동량</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">가로로 가는 만큼 세로 스크롤을 쓴다.</p>
                </div>
              </div>
              <div className="flex h-full w-screen flex-none items-center justify-center bg-[#00b80c] px-10 py-20 text-white [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
                <div className="gt_panel_in w-full max-w-[900px] [will-change:transform,opacity]">
                  <span className="block text-[clamp(56px,11vw,150px)] font-extrabold leading-none opacity-[0.16]">06</span>
                  <h3 className="mb-3 mt-2 text-[clamp(24px,3.8vw,46px)] font-extrabold leading-[1.3]">끝나면 고정이 풀린다</h3>
                  <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-70">다음 구간이 이어진다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12 : 기기 화면이 한 칸씩 바뀐다 (띠 → 기기 → 문구 순서로 등장) */}
        <section className="gt_sec relative z-[1]" id="gt12">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_roll relative mx-auto flex w-full max-w-[1450px] items-center justify-start [--gt-u:1px] gap-[calc(56*var(--gt-u))] h-[calc(709*var(--gt-u))] [@media(max-width:1530px)]:[--gt-u:calc((100vw_-_80px)/1450)] [@media(max-width:1000px)]:h-auto [@media(max-width:1000px)]:flex-col [@media(max-width:1000px)]:gap-8 [@media(max-width:1000px)]:px-0 [@media(max-width:1000px)]:py-14 [@media(max-width:750px)]:[--gt-u:calc((100vw_-_36px)/1450)]">
              <div
                className="gt_roll_band absolute left-1/2 z-0 -ml-[50vw] w-screen bg-[#e3f3e1] top-[calc(181*var(--gt-u))] h-[calc(363*var(--gt-u))] [@media(max-width:1000px)]:top-0 [@media(max-width:1000px)]:h-[calc(100%_-_525px)]"
                aria-hidden="true"
              />
              <div className="gt_roll_txt relative z-[1] w-[calc(663*var(--gt-u))] flex-none [@media(max-width:1000px)]:w-full">
                <h2 className="gt_tit m-0 text-[clamp(28px,calc(47*var(--gt-u)),47px)] font-extrabold leading-[calc(52*var(--gt-u))] tracking-[-0.018em] [@media(max-width:1000px)]:text-[28px] [@media(max-width:1000px)]:leading-[38px]">
                  섹션 12 — 화면이 한 칸씩 바뀐다
                </h2>
                <p className="gt_txt mt-[calc(11*var(--gt-u))] text-[clamp(15px,calc(18*var(--gt-u)),18px)] leading-[calc(26*var(--gt-u))] opacity-75 [@media(max-width:1000px)]:mt-[10px] [@media(max-width:1000px)]:text-[15px] [@media(max-width:1000px)]:leading-[24px]">
                  장수를 늘려도 되감기·시간·단계가 저절로 맞는다.
                </p>
                <a
                  href="javascript:void(0);"
                  className="gt_roll_btn mt-[calc(29*var(--gt-u))] inline-flex h-[calc(48*var(--gt-u))] min-w-[calc(210*var(--gt-u))] items-center justify-center rounded-[58px] bg-[#292a31] px-[calc(24*var(--gt-u))] text-[clamp(14px,calc(16*var(--gt-u)),16px)] font-extrabold leading-[calc(24*var(--gt-u))] text-white [@media(max-width:1000px)]:mt-6 [@media(max-width:1000px)]:h-[46px] [@media(max-width:1000px)]:min-w-[190px] [@media(max-width:1000px)]:text-[15px] [@media(max-width:1000px)]:leading-[22px]"
                >
                  버튼
                </a>
              </div>
              <div className="gt_roll_frame relative z-[1] w-[calc(926*var(--gt-u))] h-[calc(700*var(--gt-u))] flex-none overflow-hidden after:absolute after:left-0 after:top-0 after:z-[2] after:content-[''] after:pointer-events-none after:border-solid after:border-[#292a31] after:w-[calc(369*var(--gt-u))] after:h-[calc(700*var(--gt-u))] after:border-[calc(12*var(--gt-u))] after:rounded-[calc(48*var(--gt-u))] [@media(max-width:1000px)]:w-[260px] [@media(max-width:1000px)]:h-[560px] [@media(max-width:1000px)]:after:w-[260px] [@media(max-width:1000px)]:after:h-[493px] [@media(max-width:1000px)]:after:border-[9px] [@media(max-width:1000px)]:after:rounded-[34px]">
                <div className="gt_roll_view absolute left-[calc(13*var(--gt-u))] top-[calc(54*var(--gt-u))] h-[calc(590*var(--gt-u))] [@media(max-width:1000px)]:left-[9px] [@media(max-width:1000px)]:top-[38px] [@media(max-width:1000px)]:h-[416px]">
                  {/* ⚠ 한 벌만 적는다. 되감기용 클론은 스크립트가 만든다 */}
                  <div className="gt_roll_track flex h-full w-max flex-nowrap will-change-transform">
                    <div className="gt_roll_set flex h-full flex-none flex-nowrap">
                      <div className="mr-[calc(24*var(--gt-u))] flex h-full w-[calc(340*var(--gt-u))] flex-none items-center justify-center rounded-[calc(24*var(--gt-u))] bg-[#00b80c] text-[clamp(28px,calc(64*var(--gt-u)),64px)] font-extrabold text-white [@media(max-width:1000px)]:mr-0 [@media(max-width:1000px)]:w-[240px]">
                        01
                      </div>
                      <div className="mr-[calc(24*var(--gt-u))] flex h-full w-[calc(340*var(--gt-u))] flex-none items-center justify-center rounded-[calc(24*var(--gt-u))] bg-[#2264d1] text-[clamp(28px,calc(64*var(--gt-u)),64px)] font-extrabold text-white [@media(max-width:1000px)]:mr-0 [@media(max-width:1000px)]:w-[240px]">
                        02
                      </div>
                      <div className="mr-[calc(24*var(--gt-u))] flex h-full w-[calc(340*var(--gt-u))] flex-none items-center justify-center rounded-[calc(24*var(--gt-u))] bg-[#c23564] text-[clamp(28px,calc(64*var(--gt-u)),64px)] font-extrabold text-white [@media(max-width:1000px)]:mr-0 [@media(max-width:1000px)]:w-[240px]">
                        03
                      </div>
                      <div className="mr-[calc(24*var(--gt-u))] flex h-full w-[calc(340*var(--gt-u))] flex-none items-center justify-center rounded-[calc(24*var(--gt-u))] bg-[#e0a100] text-[clamp(28px,calc(64*var(--gt-u)),64px)] font-extrabold text-white [@media(max-width:1000px)]:mr-0 [@media(max-width:1000px)]:w-[240px]">
                        04
                      </div>
                      <div className="mr-[calc(24*var(--gt-u))] flex h-full w-[calc(340*var(--gt-u))] flex-none items-center justify-center rounded-[calc(24*var(--gt-u))] bg-[#3a3a44] text-[clamp(28px,calc(64*var(--gt-u)),64px)] font-extrabold text-white [@media(max-width:1000px)]:mr-0 [@media(max-width:1000px)]:w-[240px]">
                        05
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13 : 문구가 커진 채 왔다가 사라지고, 그 자리를 넓은 판이 이어받는다 */}
        <section className="gt_sec relative z-[1]" id="gt13">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_zoom grid w-full place-items-center [@media(max-width:750px)]:grid-cols-[minmax(0,1fr)]">
              <h2 className="gt_tit m-0 text-center [grid-area:1/1] [will-change:transform,opacity]">섹션 13 — 확대 등장 · 가로 밀기</h2>
              <div className="gt_sheet w-full [grid-area:1/1] [will-change:transform,opacity] [@media(max-width:750px)]:justify-self-start [@media(max-width:750px)]:overflow-hidden">
                <div className="gt_sheet_box mx-auto flex h-[420px] w-full max-w-[1120px] gap-4 rounded-2xl border border-[#d8dbe0] bg-white p-4 [@media(max-width:750px)]:h-[320px] [@media(max-width:750px)]:w-[1120px] [@media(max-width:750px)]:max-w-none">
                  <div className="flex flex-1 items-center justify-center rounded-[10px] bg-[#eef0f4] text-xl font-extrabold text-[#6a6d78] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">01</div>
                  <div className="flex flex-1 items-center justify-center rounded-[10px] bg-[#eef0f4] text-xl font-extrabold text-[#6a6d78] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">02</div>
                  <div className="flex flex-1 items-center justify-center rounded-[10px] bg-[#eef0f4] text-xl font-extrabold text-[#6a6d78] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">03</div>
                  <div className="flex flex-1 items-center justify-center rounded-[10px] bg-[#eef0f4] text-xl font-extrabold text-[#6a6d78] [@media(max-width:750px)]:w-[260px] [@media(max-width:750px)]:flex-none">04</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14 : 마무리 */}
        <section className="gt_sec relative z-[1]" id="gt14">
          <div className="gt_pin flex min-h-screen flex-col justify-center overflow-clip px-10 py-20 [@media(max-width:750px)]:px-[18px] [@media(max-width:750px)]:py-[60px]">
            <div className="gt_inner mx-auto w-full max-w-[1200px]">
              <h2 className="gt_tit mb-4 text-[clamp(28px,5vw,56px)] font-extrabold leading-tight">섹션 14 — 끝</h2>
              <p className="gt_txt text-[clamp(15px,1.6vw,18px)] leading-[1.6] opacity-75">
                여기에 새 구간을 이어 붙인다. 연출은 ../gsap 의 엔진을 그대로 쓰고, 스타일만 Tailwind 유틸리티 클래스로 짠다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
