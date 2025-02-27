'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider"
import { ReportLayout } from "../../sharedUI/Report/ReportLayout";
import { ReportTop } from "../../sharedUI/Report/ReportTop";
import { ReportTab } from "../../sharedUI/Report/ReportTab";
import { Between } from "../../sharedUI/Layout/Between";;
import { DropDown } from "../../sharedUI/DropDown/DropDown";
import { Title } from "../../sharedUI/Title/Title";
import { SubTitleBetween } from "../../sharedUI/Title/SubTitleBetween";
import { ScrollBottom } from "../../sharedUI/Layout/ScrollBottom";

export default function MarkingPage() {
  return (
    // initTop={200}
    <ScrollProvider initTop={0}>
      <ScrollPageContents />
    </ScrollProvider>
  );
}

function ScrollPageContents() {
  const { isFixed, setThreshold, scrollDirection } = useScroll();

  const targetRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [targetHeight, setTargetheight] = useState<number | null>(null);

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current && bottomRef.current) {
        setTargetheight(targetRef.current.clientHeight);

        const offsetTop = targetRef.current.offsetTop;
        const Threshold = bottomRef.current.clientHeight;
        if (offsetTop !== undefined) {
          setThreshold(Threshold);
        }
      }
    };

    setTimeout(() => setOffsetTop(), 0);

    const resizeEvent = throttle(() => {
      setOffsetTop();
    }, 50);

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  const drop = [
    {
      label: {
        gun: '가',
        univ: '서경대',
        name: '[서울] 미디어커뮤니케이션학부',
      },
      value: '1',
    },
    {
      label: {
        univ: '서경대',
        name: 'LF_라이프스타일디자인',
      },
      value: '2',
    },
    {
      label: {
        gun: '다',
        univ: '건국대(서울)',
        name: '공과대학자유전공학부',
      },
      value: '3',
    },
    {
      label: {
        univ: '건국대(서울)',
        name: '공과대학자유전공학부',
      },
      value: '4',
    },
    {
      label: {
        univ: '건국대(서울)',
        name: '건국대건국대건국대건국대건국대',
      },
      value: '5',
    },
    {
      label: {
        univ: '건국대 (서울)',
        name: 'LF_라이프스타일디자인',
      },
      value: '6',
    },
    {
      label: {
        univ: '건국대 (서울)',
        name: 'LF_라이프스타일디자인',
      },
      value: '7',
    },
  ];

  const topInfo = [
    { label: '모집인원', data: '20' },
    { label: '전년도 경쟁률', data: '16.5' },
    { label: '실제 \n 지원자수', data: '999' },
    { label: '전체 \n 지원자수', data: '999' },
  ];

  const mainTab = [
    { label: '합격예측', url: '#/1' },
    { label: '성적산출', url: '#/2' },
    { label: '입시결과', url: '#/3' },
  ];

  const topFixedHeight = `h-[2.75rem] md:h-[4.375rem]`;
  const topFixedOffset = `top-[2.75rem] md:top-[4.375rem]`;

  return (
    <ReportLayout>
      {/* top */}
      <ReportTop
        isFixed={isFixed}
        fixHeight={topFixedHeight}
        ref={bottomRef}
        selectValue="1"
        univOption={drop}
        info={topInfo}
        onChange={() => {}}
      />
      {/* top */}

      {/* body */}
      <div className={`m-center px-6 md:px-7 lg:px-11 xl:px-8 xl:w-[80rem] bg-white rounded-t-[1.25rem] xl:rounded-t-[1.875rem]`}>
        <ReportTab isFixed={isFixed} fixOffset={topFixedOffset} targetHeight={targetHeight} ref={targetRef} mainTab={mainTab} initTab={0} />

        <div className="pt-7 sm:pt-8 md:pt-10 h-[102.25rem] bg-white ">
          <Between type="right">
            <div>
              <Title sub="서브 텍스트" title="기본 제목" />
            </div>
            <div>
              <DropDown
                label="Select an option"
                onChange={() => {}}
                options={[
                  {
                    label: 'Option 1',
                    value: '1',
                  },
                  {
                    label: 'Option 2',
                    value: '2',
                  },
                  {
                    label: 'Option 3',
                    value: '3',
                  },
                ]}
                size="md"
                type="ghost"
                value={null}
              />
            </div>
          </Between>
          <SubTitleBetween sub="서브 텍스트" title="메인 타이틀" />
          <p className="fixed bottom-0"></p>
        </div>
      </div>
      {/* body */}

      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>
    </ReportLayout>
  );
}