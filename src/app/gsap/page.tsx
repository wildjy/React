"use client";

import { useRef } from "react";
import { useGsapTemplate } from "./useGsapTemplate";
import "./gsap-template.css";

/**
 * [개발 확인용] GSAP 스크롤 기본 템플릿
 *
 * ⚠ 이 파일은 dev_gsap_template.html 의 <body> 에서 **자동 생성된다.** 손으로 고치지 않는다.
 *    마크업을 고칠 곳은 html 이다 (고친 뒤 : npm run gsap:sync · 지켜보려면 npm run gsap:watch).
 *
 * 폴더 구성 — 새 랜딩은 **이 폴더를 통째로 복사해서** 이름을 바꿔 쓴다.
 *   dev_gsap_template.html — 원본 하나. 마크업·스타일·구간 설정이 여기 다 있다.
 *   page.tsx           — 마크업           (생성물)
 *   gsap-template.css  — 스타일           (생성물)
 *   gsapSections.ts    — 구간 설정        (생성물)
 *   gsapTypes.ts       — 구간 설정의 타입 (손으로 유지)
 *   useGsapTemplate.ts — 엔진             (손으로 유지 · html 쪽 엔진과 짝이다)
 */
export default function GsapTemplatePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // 구간을 짓는 일은 전부 이 훅이 한다. 첫 페인트 전에 돌고, 언마운트에서 전부 되돌린다.
  useGsapTemplate(rootRef);

  return (
    <div className="gt_page" ref={rootRef}>
      <div className="gt_bg" aria-hidden="true" />

      {/* 진행 표시 (mock 전용) : 지금 몇 번째 구간인지 확인용. 실제 페이지로 옮길 때는 뺀다 */}
      {/* ⚠ 점은 비워 둔다 — SECTIONS 개수만큼 스크립트가 만든다.
           손으로 적어 두면 구간을 늘리고 점을 안 늘려 조용히 어긋난다. */}
      <ul className="gt_progress" />

      <div className="gt_wrap">

        {/* 01 : 고정 + 글자·박스가 떠오른다 (가장 기본) */}
        <section className="gt_sec" id="gt01">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 01 — 고정 + 등장</h2>
              <p className="gt_txt">판을 화면에 고정한 채 스크롤을 진행도로 바꿔 쓴다.</p>
              <div className="gt_grid">
                <div className="gt_box">BOX 1</div>
                <div className="gt_box">BOX 2</div>
                <div className="gt_box">BOX 3</div>
                <div className="gt_box">BOX 4</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 : 고정 + 배경이 검정으로 넘어간다 */}
        <section className="gt_sec is_dark" id="gt02">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 02 — 배경 전환</h2>
              <p className="gt_txt">배경은 구간이 아니라 화면에 깔린 판(.gt_bg) 하나가 칠한다.</p>
              <div className="gt_grid">
                <div className="gt_box">BOX 1</div>
                <div className="gt_box">BOX 2</div>
                <div className="gt_box">BOX 3</div>
                <div className="gt_box">BOX 4</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 : 폭에 따라 연출이 통째로 다르다 (bp: true)
             데스크톱 — 좌측 글이 sticky 로 붙고 우측 카드가 그 옆을 지나간다
             모바일   — 판을 고정하고 카드 줄을 가로로 민다
             ⚠ 구간 자체는 어느 쪽이든 고정하지 않는다(pin: false). 연출을 따로 건다. */}
        <section className="gt_sec" id="gt03">
          <div className="gt_pin">
            <div className="gt_inner">
              <div className="gt_follow">
                <div className="gt_follow_txt">
                  <h2 className="gt_tit">섹션 03</h2>
                  <p className="gt_txt">폭이 바뀌면 이 구간만 다시 짓는다.</p>
                </div>
                <div className="gt_follow_list">
                  <div className="gt_card">CARD 1</div>
                  <div className="gt_card">CARD 2</div>
                  <div className="gt_card">CARD 3</div>
                  <div className="gt_card">CARD 4</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 : 한 문장이 화면을 향해 커지며 사라진다
             ⚠ 넘치는 부분은 .gt_pin 의 overflow: clip 이 자른다. */}
        <section className="gt_sec is_dark" id="gt04">
          <div className="gt_pin">
            <div className="gt_inner">
              <p className="gt_impact">한 문장이 커지며 사라진다</p>
            </div>
          </div>
        </section>

        {/* 05 : 두 줄이 좌·우 화면 밖에서 들어오고 설명은 아래에서 올라온다
             ⚠ 이동 거리가 화면 폭에 달려 있어 invalidate 를 켠다 → from() 대신 fromTo() 를 쓴다. */}
        <section className="gt_sec" id="gt05">
          <div className="gt_pin">
            <div className="gt_inner">
              <div className="gt_lead">
                <h2 className="tit">
                  <span>왼쪽에서 들어오는 줄,</span>
                  <span>오른쪽에서 들어오는 줄</span>
                </h2>
                <p className="desc">설명은 조금 늦게 아래에서 올라온다. 나갈 때는 왔던 방향으로 되돌아 나간다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 : 문장이 커지며 사라진 자리에 판이 scale 0 → 1 로 들어온다 */}
        <section className="gt_sec" id="gt06">
          <div className="gt_pin">
            <div className="gt_inner">
              <p className="gt_impact">사라진 자리에 판이 들어온다</p>
              <div className="gt_shot">SHOT</div>
            </div>
          </div>
        </section>

        {/* 07 : 스크롤 진행도를 숫자와 막대에 그대로 쓴다 */}
        <section className="gt_sec" id="gt07">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 07 — 진행도 쓰기</h2>
              <p className="gt_txt">스크롤이 얼마나 진행됐는지를 숫자·막대에 그대로 옮긴다.</p>
              <p className="gt_count"><span className="num">0</span><em>%</em></p>
              <div className="gt_bar"><span /></div>
            </div>
          </div>
        </section>

        {/* 08 : 패럴랙스 — 겹친 판이 서로 다른 속도로 움직인다 */}
        <section className="gt_sec" id="gt08">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 08 — 패럴랙스</h2>
              <div className="gt_parallax">
                <div className="gt_layer l1">LAYER 1 (느리게)</div>
                <div className="gt_layer l2">LAYER 2</div>
                <div className="gt_layer l3">LAYER 3 (빠르게)</div>
              </div>
            </div>
          </div>
        </section>

        {/* 09 : 마퀴 — 끊기지 않고 흐르고, 스크롤 방향에 따라 뒤집힌다
             ⚠ 내용을 두 벌 깔아야 이음매가 보이지 않는다(절반만큼만 밀기 때문이다). */}
        <section className="gt_sec" id="gt09">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 09 — 마퀴</h2>
              <p className="gt_txt">위로 올리면 반대로 흐른다.</p>
            </div>
            <div className="gt_marquee">
              <div className="gt_marquee_row">
                <span>GSAP&nbsp;·&nbsp;SCROLLTRIGGER&nbsp;·&nbsp;MARQUEE&nbsp;·&nbsp;</span>
                <span>GSAP&nbsp;·&nbsp;SCROLLTRIGGER&nbsp;·&nbsp;MARQUEE&nbsp;·&nbsp;</span>
              </div>
            </div>
          </div>
        </section>

        {/* 10 : 좌측 목차가 붙고, 우측 단계가 지날 때마다 목차가 바뀐다
             ⚠ 목차 클릭 리스너는 구간을 걷을 때 함께 떼야 한다 — build 가 정리 함수를 돌려준다. */}
        <section className="gt_sec" id="gt10">
          <div className="gt_pin">
            <div className="gt_inner">
              <div className="gt_feature">
                <div className="gt_nav">
                  <h2 className="gt_tit">섹션 10</h2>
                  <button type="button" className="on">단계 1</button>
                  <button type="button">단계 2</button>
                  <button type="button">단계 3</button>
                </div>
                <div className="gt_steps">
                  <div className="gt_step">STEP 1</div>
                  <div className="gt_step">STEP 2</div>
                  <div className="gt_step">STEP 3</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11 : 판을 고정한 채 화면 전체가 가로로 넘어간다 (풀스크린 6장)
             ⚠ 03 의 가로 슬라이드와 다르다 — 그쪽은 카드 줄이 판 안에서 흐르고,
                이쪽은 화면 한 장(100vw)이 통째로 넘어간다. */}
        <section className="gt_sec" id="gt11">
          <div className="gt_hpin">
            <div className="gt_htrack">
              <div className="gt_panel c1"><div className="gt_panel_in"><span className="no">01</span><h3>화면이 통째로 넘어간다</h3><p>세로로 굴린 스크롤을 가로 이동으로 바꿔 쓴다.</p></div></div>
              <div className="gt_panel c2"><div className="gt_panel_in"><span className="no">02</span><h3>판은 고정돼 있다</h3><p>움직이는 것은 안쪽 트랙뿐이다.</p></div></div>
              <div className="gt_panel c3"><div className="gt_panel_in"><span className="no">03</span><h3>이동량은 함수로 넘긴다</h3><p>창 크기가 바뀌면 다시 재야 하기 때문이다.</p></div></div>
              <div className="gt_panel c4"><div className="gt_panel_in"><span className="no">04</span><h3>글은 가로 좌표로 띄운다</h3><p>세로로 움직이지 않으니 세로 위치로는 알 수 없다.</p></div></div>
              <div className="gt_panel c5"><div className="gt_panel_in"><span className="no">05</span><h3>스크롤 길이 = 이동량</h3><p>가로로 가는 만큼 세로 스크롤을 쓴다.</p></div></div>
              <div className="gt_panel c6"><div className="gt_panel_in"><span className="no">06</span><h3>끝나면 고정이 풀린다</h3><p>다음 구간이 이어진다.</p></div></div>
            </div>
          </div>
        </section>

        {/* 12 : 기기 화면이 한 칸씩 바뀐다 (띠 → 기기 → 문구 순서로 등장) */}
        <section className="gt_sec" id="gt12">
          <div className="gt_pin">
            <div className="gt_roll">
              <div className="gt_roll_band" aria-hidden="true" />
              <div className="gt_roll_txt">
                <h2 className="gt_tit">섹션 12 — 화면이 한 칸씩 바뀐다</h2>
                <p className="gt_txt">장수를 늘려도 되감기·시간·단계가 저절로 맞는다.</p>
                <a href="javascript:void(0);" className="gt_roll_btn">버튼</a>
              </div>
              <div className="gt_roll_frame">
                <div className="gt_roll_view">
                  {/* ⚠ 한 벌만 적는다. 되감기용 클론은 스크립트가 만든다 */}
                  <div className="gt_roll_track">
                    <div className="gt_roll_set">
                      <div className="gt_shot c1">01</div>
                      <div className="gt_shot c2">02</div>
                      <div className="gt_shot c3">03</div>
                      <div className="gt_shot c4">04</div>
                      <div className="gt_shot c5">05</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13 : 문구가 커진 채 왔다가 사라지고, 그 자리를 넓은 판이 이어받는다 */}
        <section className="gt_sec" id="gt13">
          <div className="gt_pin">
            <div className="gt_zoom">
              <h2 className="gt_tit">섹션 13 — 확대 등장 · 가로 밀기</h2>
              <div className="gt_sheet">
                <div className="gt_sheet_box">
                  <div className="gt_sheet_col">01</div>
                  <div className="gt_sheet_col">02</div>
                  <div className="gt_sheet_col">03</div>
                  <div className="gt_sheet_col">04</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14 : 마무리 */}
        <section className="gt_sec" id="gt14">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 14 — 끝</h2>
              <p className="gt_txt">여기에 새 구간을 이어 붙인다. 고치는 곳은 늘 이 html 이고, React 세 파일은 저절로 따라온다.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
