"use client";

import { useRef } from "react";
import { useGsapTemplate } from "./useGsapTemplate";
import "./gsap-template.css";

/**
 * [개발 확인용] GSAP 스크롤 기본 템플릿
 * dev_gsap_template.html 을 현재 React(Next App Router) 구성으로 옮긴 것이다.
 *
 * 새 GSAP 랜딩을 시작할 때 **이 폴더를 복사해서** 이름을 바꿔 쓴다.
 *   page.tsx          — 마크업(지금 이 파일)
 *   gsapSections.ts   — 구간 설정. 연출을 고칠 때 여는 곳은 여기다.
 *   useGsapTemplate.ts— 엔진. 구간을 짓고·걷고·자리를 지킨다. 손댈 일이 거의 없다.
 *   gsap-template.css — 스타일. 전역 css 다(클래스는 전부 gt_ 로 시작한다).
 *
 * 오브젝트는 일부러 단순한 박스와 글자뿐이다 — 구조만 보라고.
 *
 * ⚠ 마크업과 gsapSections 의 선택자는 짝이다. 클래스 이름을 바꾸면 양쪽을 같이 고친다.
 * ⚠ 새 구간을 붙이려면 : 아래에 section 을 하나 더 두고 SECTIONS 에 한 줄 적는다.
 */
export default function GsapTemplatePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // 구간을 짓는 일은 전부 이 훅이 한다. 첫 페인트 전에 돌고, 언마운트에서 전부 되돌린다.
  useGsapTemplate(rootRef);

  return (
    <div className="gt_page" ref={rootRef}>
      <div className="gt_bg" aria-hidden="true" />

      <div className="gt_wrap">
        {/* 01 : 페이지가 열리면 스스로 떠오른다 (스크롤은 걷을 때만 쓴다) */}
        <section className="gt_sec" id="gt01">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 01 — 로드 시 등장</h2>
              <p className="gt_txt">첫 화면은 스크롤을 기다리지 않는다. 뜬 뒤에는 고정한 채 스크롤로 걷는다.</p>
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
              {/* ⚠ 이 숫자와 막대 폭은 React state 가 아니라 타임라인이 매 프레임 직접 쓴다.
                  scrub 은 초당 수십 번 갱신된다 — state 로 돌리면 그때마다 리렌더가 돈다. */}
              <p className="gt_count">
                <span className="num">0</span>
                <em>%</em>
              </p>
              <div className="gt_bar">
                <span />
              </div>
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
            ⚠ 목차 버튼의 클릭과 on 클래스는 React 가 아니라 build 가 맡는다 —
               구간을 다시 지을 때 리스너도 함께 떼야 하고, 그 시점을 아는 것은 build 쪽이다. */}
        <section className="gt_sec" id="gt10">
          <div className="gt_pin">
            <div className="gt_inner">
              <div className="gt_feature">
                <div className="gt_nav">
                  <h2 className="gt_tit">섹션 10</h2>
                  <button type="button" className="on">
                    단계 1
                  </button>
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
              <div className="gt_panel c1">
                <div className="gt_panel_in">
                  <span className="no">01</span>
                  <h3>화면이 통째로 넘어간다</h3>
                  <p>세로로 굴린 스크롤을 가로 이동으로 바꿔 쓴다.</p>
                </div>
              </div>
              <div className="gt_panel c2">
                <div className="gt_panel_in">
                  <span className="no">02</span>
                  <h3>판은 고정돼 있다</h3>
                  <p>움직이는 것은 안쪽 트랙뿐이다.</p>
                </div>
              </div>
              <div className="gt_panel c3">
                <div className="gt_panel_in">
                  <span className="no">03</span>
                  <h3>이동량은 함수로 넘긴다</h3>
                  <p>창 크기가 바뀌면 다시 재야 하기 때문이다.</p>
                </div>
              </div>
              <div className="gt_panel c4">
                <div className="gt_panel_in">
                  <span className="no">04</span>
                  <h3>글은 가로 좌표로 띄운다</h3>
                  <p>세로로 움직이지 않으니 세로 위치로는 알 수 없다.</p>
                </div>
              </div>
              <div className="gt_panel c5">
                <div className="gt_panel_in">
                  <span className="no">05</span>
                  <h3>스크롤 길이 = 이동량</h3>
                  <p>가로로 가는 만큼 세로 스크롤을 쓴다.</p>
                </div>
              </div>
              <div className="gt_panel c6">
                <div className="gt_panel_in">
                  <span className="no">06</span>
                  <h3>끝나면 고정이 풀린다</h3>
                  <p>다음 구간이 이어진다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12 : 마무리 */}
        <section className="gt_sec" id="gt12">
          <div className="gt_pin">
            <div className="gt_inner">
              <h2 className="gt_tit">섹션 12 — 끝</h2>
              <p className="gt_txt">여기에 새 구간을 이어 붙인다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
