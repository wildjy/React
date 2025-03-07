'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider"
import { ReportLayout } from "../../sharedUI/Report/ReportLayout";
import { ReportTop } from "../../sharedUI/Report/ReportTop";
import { ReportTab } from "../../sharedUI/Report/ReportTab";
import { ReportContents } from "../../sharedUI/Report/ReportContents";
import { Between } from "../../sharedUI/Layout/Between";
import { DropDown } from "../../sharedUI/DropDown/DropDown";
import { InfoText } from "../../sharedUI/Info/InfoText";
import { InfoTextBox } from "../../sharedUI/Info/InfoTextBox";
import { Title } from "../../sharedUI/Title/Title";
import ToggleBox from "../../sharedUI/ToggleBox/ToggleBox";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth < 1024);
  const [isMobile, setIsMobile] = useState(false);

  const [isOpenPopup, setIsOpenPopup] = useState<{ [key: string]: boolean }>({
    popup1: false,
    popup2: false,
  });

  const OpenEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  };

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
      const win = window.innerWidth;
      setWindowWidth(win);
    }, 50);

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  useEffect(() => {
    setIsMobile(windowWidth < 1024);
  }, [windowWidth]);


  const slides = [
    { label: '3.28 학력평가', value: '1' },
    { label: '5.8 학력평가', value: '2' },
    { label: '6.4 모의평가', value: '3' },
    { label: '7.11 학력평가', value: '4' },
    { label: '9.4 모의평가', value: '5' },
    { label: '10.15 학력평가', value: '6' },
  ];

  const infoText = [
    {
      text: '실제 수능은 재수생 유입으로 인해 모의평가 시험 결과보다 점수가 내려가며, 따라서 회원님이 수능에서 받게 될 수능예측점수로 정시 합격가능성이 계산되었습니다.',
    },
    {
      text: '합격가능성은 각 대학의 수능 반영방법에 따라서 영역별 점수 및 가산점이 계산된 환산점수로, 과거 3개년간의 입시결과를 반영하여 예측된 점수입니다.',
    },
    {
      text: '정시 합격예측은 2025년 4월 발표된 2026학년도 전형계획 기준으로 서비스되고 있습니다. 이후 변경 발표된 내용은 적용되어 있지 않으며, 수능 이후 정시 합격예측에 적용됩니다.',
    },
  ];

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

  const topFixedHeight = `h-[3rem] sm:h-[3.5rem] md:h-[4.375rem]`;
  const topFixedOffset = `top-[3rem] sm:top-[3.5rem] md:top-[4.375rem]`;

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

        <div className="pt-7 sm:pt-8 md:pt-10 bg-white">
          <Between type="right">
            <div>
              <Title sub="서브 텍스트" title="기본 제목" />
            </div>
            <div>
              <DropDown
                label="Select an option"
                onChange={() => {}}
                options={slides}
                size="md"
                type="ghost"
                value="1"
              />
            </div>
          </Between>

          <InfoTextBox type="bg" display="block" addClass="mt-4">
            <Title title="타이틀.." addClass="text-blue-800" />

            <p className="mt-3 text-gray-800 text-2xs sm:text-sm md:text-md lg:text-base">
              <b>sub Text..</b>
            </p>

            <ToggleBox
              isOpen={!isMobile}
              align="left"
              size="md"
              addClass="mt-4 sm:mt-5 md:mt-6 border border-gray-300 rounded-lg lg:border-0 lg:bg-transparent"
              bottomAddClass={undefined}
            >
              <ToggleBox.Top activeClass="" addClass="lg:p-0">
                💡 해석 유의사항 확인
              </ToggleBox.Top>
              <ToggleBox.Bottom activeClass="" addClass="pt-0 lg:pt-3">
                <InfoText texts={infoText} />
              </ToggleBox.Bottom>
            </ToggleBox>
          </InfoTextBox>


          <ReportContents>
            <div>
              <p className="reportTitle">영역 1</p>
              <Title title="Sub Title" type="report" />
            </div>

            <div>
              <p className="reportTitle">영역 2</p>
              <Title title="Sub Title" type="report" />

            </div>

            <div>
              <p className="reportTitle">영역 3</p>
              <div>
                <Title title="Sub Title" type="report" />
              </div>
            </div>
          </ReportContents>

        </div>
      </div>
      {/* body */}

      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>
    </ReportLayout>
  );
}