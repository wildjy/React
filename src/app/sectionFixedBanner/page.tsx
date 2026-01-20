"use client";
import { cn } from "@/sharedUI/common/cn";
import { set, throttle } from "lodash";
import { useEffect, useRef, useState } from "react";

export default function SectionFixedBannerPage() {
/*
1. Section (절대 기준)
페이지 레이아웃의 뼈대
스크롤해도 위치 계산 기준으로 안정적
👉 판단 기준은 무조건 section

2. Banner (움직이는 대상)
fixed / relative로 바뀜
위치가 바뀌면 getBoundingClientRect()가 달라짐
👉 판단 기준으로 쓰면 안 됨

3. Anchor (기준선)
“여기까지 왔으면 고정해라”
*/

/* JS로 구현한 scroll spy 예제 */
/*
const sections = document.querySelectorAll('section');
const anchorY = 100; // 기준선

window.addEventListener('scroll', () => {
  let current = null;

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    const nextRect = sections[i + 1]?.getBoundingClientRect();

    // rect.top <= anchorY = 이 섹션은 기준선을 지났다
    // nextRect.top > anchorY = 다음 섹션은 아직 안 왔다

    if (rect.top <= anchorY && (!nextRect || nextRect.top > anchorY)) {
      current = sections[i].id;
      break;
    }
  }

  console.log('현재 섹션:', current);
});
*/

  type ScrollActiveAnchor = 'top' | 'center' | 'bottom';

  const sections = [
    { id: 'section-1' },
    { id: 'section-2' },
    { id: 'section-3' },
    { id: 'section-4' },
  ]

  // 상태값 셋팅
  const [posText, setPosText] = useState<ScrollActiveAnchor>('top'); //  /** 컨트롤 하는용 **/기준점
  const prevCurrentRef = useRef<string | null>(null);
  const [activeId , setActiveId] = useState<string | null>(null);
  const [fixedSectionId, setFixedSectionId] = useState<string | null>(null);
  const activeClass = 'active text-3xl font-bold text-blue-800';

  useEffect(() => {
    // 스크롤 위치에 따른 섹션 판단
    const getAnchorY = (type: ScrollActiveAnchor, offset = 0) => {
      switch (type) {
        case 'top':
          return 0 + offset;
        case 'center':
          return window.innerHeight / 2 + offset;
        case 'bottom':
          return window.innerHeight + offset - 1; // -1 to include bottom edge
      }
    };

    const Recompute = throttle(() => {
      const anchorY = getAnchorY(posText);
      let current: string | null = null;

      for (const section of sections) {
        const sectionElement = document.getElementById(section.id);
        if (!sectionElement) continue;

        const secRec = sectionElement.getBoundingClientRect();

        if (secRec.top <= anchorY && secRec.bottom > anchorY) {
          current = section.id;
          console.log('!!! in section', current);
          setFixedSectionId(section.id);
          break; // for...of 루프나 Array.some() = break 사용 가능
        }
      }

      // 첫번째 보정
      if(!current) {
        const first = document.getElementById(sections[0].id);
        /** 컨트롤 하는용 **/
        /* 용도 : active 이미 적용! == 아직 첫 섹션에 도달 전 */
        // if (first && first.getBoundingClientRect().top > anchorY) {

        /* 용도 : active 미적용! == 첫 섹션 안에 들어올 때만 */
        if (first && first.getBoundingClientRect().top <= anchorY && first.getBoundingClientRect().bottom > anchorY) {
          current = sections[0].id;
          console.log('== first current', current);
        }
      }

      // 마지막 보정
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const NEAR_BOTTOM = 4;
      if (pageBottom - scrollBottom < NEAR_BOTTOM) {
        current = sections[sections.length - 1].id;
        console.log('== last current', current);
      }
      console.log('previous.current', prevCurrentRef.current, ' / current', current);
      if (current !== prevCurrentRef.current) {
        setFixedSectionId(current);
        setActiveId(current);
        prevCurrentRef.current = current;
      }
    }, 50);

    Recompute(); // 최초 1회
    window.addEventListener('scroll', Recompute, { passive: true });
    window.addEventListener('resize', Recompute);

    return () => {
      window.removeEventListener('scroll', Recompute);
      window.removeEventListener('resize', Recompute);
    };
  }, []);

  console.log('fixedSectionId', fixedSectionId);
  return (
    <div className="relative">
      {/* 기준점 표시용 */}
      <AnchorCheck />
      {/* 기준점 표시용 */}

      <div className="flex items-center justify-center h-[50rem]">기준점 <b className="px-2 text-3xl">'{posText}'</b> 일때 </div>
      <SectionWrapper
        id="section-1"
        addClass={`${activeId === 'section-1' ? activeClass : ''} h-[15rem] bg-blue-100`}
      >
        <div className={cn('top-0 left-0 right-0', fixedSectionId === 'section-1' ? 'fixed' : '')}>Banner 1</div>
        Section 01
      </SectionWrapper>

      <SectionWrapper
        id="section-2"
        addClass={`${activeId === 'section-2' ? activeClass : ''} bg-green-100`}
      >
        <div className={cn('top-0 left-0 right-0', fixedSectionId === 'section-2' ? 'fixed' : '')}>Banner 2</div>
        Section 02
      </SectionWrapper>

      <SectionWrapper
        id="section-3"
        addClass={`${activeId === 'section-3' ? activeClass : ''} h-[50rem] bg-red-100`}
      >
        <div className={cn('top-0 left-0 right-0', fixedSectionId === 'section-3' ? 'fixed' : '')}>Banner 3</div>
        Section 03
      </SectionWrapper>

      <SectionWrapper
        id="section-4"
        addClass={`${activeId === 'section-4' ? activeClass : ''} bg-yellow-100`}
      >
        <div className={cn('top-0 left-0 right-0', fixedSectionId === 'section-4' ? 'fixed' : '')}>Banner 4</div>
        Section 04
      </SectionWrapper>

      <div className="flex items-center justify-center h-[5rem]">
        기준점 'top'일때 section마지막에 도달못할때 체크용
      </div>
    </div>
  );
}

export const AnchorCheck = () => {
  return (
    <>
      <div className="fixed top-0 w-full h-[1px] text-red-800 bg-red-800">
        <span className="absolute top-0 w-full text-center">TOP</span>
      </div>
      <div className="fixed top-1/2 w-full h-[1px] text-blue-800 bg-blue-800 -translate-y-1/2">
        <span className="absolute top-1/2 w-full -translate-y-1/2 text-center">Center</span>
      </div>
      <div className="fixed bottom-0 w-full h-[1px] text-black bg-black">
        <span className="absolute bottom-0 w-full text-center">Bottom</span>
      </div>
    </>
  )
}
export const SectionWrapper = ({id, addClass, children}: {id?: string, addClass?: string, children: React.ReactNode}) => {
  return <section  id={id} className={cn("flex items-center justify-center w-full h-[30rem]", addClass)}>{children}</section>;
}