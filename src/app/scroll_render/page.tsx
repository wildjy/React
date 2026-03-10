'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider"
import { AnalysisResult } from "../../sharedUI/Report/AnalysisResult";
import { Button } from "../../sharedUI/Button/Button";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { ReportLayout } from "../../sharedUI/Report/ReportLayout";
import { ReportTop } from "../../sharedUI/Report/ReportTop";
import { ReportTab } from "../../sharedUI/Report/ReportTab";
import { ReportTableTypeRow } from "../../sharedUI/Report/ReportTableTypeRow";
import { ReportTableTypeMd } from "../../sharedUI/Report/ReportTableTypeMd";
import { ExamResultSwiper } from "../../sharedUI/Report/ExamResultSwiper";
import { ScoreAnalysis } from "../../sharedUI/Report/ScoreAnalysis";
import { ReportContents } from "../../sharedUI/Report/ReportContents";
import { Between } from "../../sharedUI/Layout/Between";
import { ContTable } from "../../sharedUI/Layout/ContTable";
import { DropDown } from "../../sharedUI/DropDown/DropDown";
import { InfoText } from "../../sharedUI/Info/InfoText";
import { InfoTextBox } from "../../sharedUI/Info/InfoTextBox";
import { Title } from "../../sharedUI/Title/Title";
import { Arrow } from "../../sharedUI/Flag/Arrow";
import Table from "../../sharedUI/Table/Table";
import ToggleBox from "../../sharedUI/ToggleBox/ToggleBox";
import { ScrollBottom } from "../../sharedUI/Layout/ScrollBottom";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
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
    // const isMobile = !IS_SERVER && windowWidth < 1024;
    // console.log(windowWidth);
    setIsMobile(windowWidth < 1024);
    // console.log(isMobile);
  }, [windowWidth]);


  const slides = [
    { label: '3.28 학력평가', value: '1' },
    { label: '5.8 학력평가', value: '2' },
    { label: '6.4 모의평가', value: '3' },
    { label: '7.11 학력평가', value: '4' },
    { label: '9.4 모의평가', value: '5' },
    { label: '10.15 학력평가', value: '6' },
  ];


  const Analysis: { label: string; score: string | [string, boolean] }[] = [
    { label: '내 모평 점수', score: '999.99' },
    { label: '수능예측 점수', score: '999.99' },
    { label: '지원가능 점수', score: '999.99' },
    { label: '점수 차이', score: ['999.99', true] },
  ];

  const ScoreAnalysisData: { label: string; score: [string, boolean] }[] = [
    { label: '💯 원점수', score: ['5', true] },
    { label: '✏️ 문항수', score: ['2.5', true] },
  ];

  const gradeTable = [
    { grade: '1', score: '100' },
    { grade: '2', score: '97' },
    { grade: '3', score: '92' },
    { grade: '4', score: '87' },
    { grade: '5', score: '82' },
    { grade: '6', score: '77' },
    { grade: '7', score: '72' },
    { grade: '8', score: '67' },
    { grade: '9', score: '62' },
  ];

  const ExamResult = [
    {
      year: '2025',
      children: [
        { label: '군', result: '나군' },
        { label: '모집인원', result: '87' },
        { label: '경쟁률', result: '3.60', point: true },
        { label: '합격자평균백분위', result: '-' },
        { label: '추가합격 인원', result: '2번(3차)', point: true },
        { label: '추가합격 비율', result: '-' },
        { label: '합격자수(지원자수)', result: '25명', point: true },
      ],
    },
    {
      year: '2024',
      children: [
        { label: '군', result: '나군' },
        { label: '모집인원', result: '87' },
        { label: '경쟁률', result: '3.60', point: true },
        { label: '합격자평균백분위', result: '-' },
        { label: '추가합격 인원', result: '2번(3차)', point: true },
        { label: '추가합격 비율', result: '-' },
        { label: '합격자수(지원자수)', result: '25명' },
      ],
    },
    {
      year: '2023',
      children: [
        { label: '군', result: '나군' },
        { label: '모집인원', result: '87' },
        { label: '경쟁률', result: '3.60', point: true },
        { label: '합격자평균백분위', result: '-' },
        { label: '추가합격 인원', result: '2번(3차)', point: true },
        { label: '추가합격 비율', result: '-' },
        { label: '합격자수(지원자수)', result: '25명' },
      ],
    },
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

        <div className="pt-7 sm:pt-8 md:pt-10 h-[102.25rem] bg-white ">
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
            <Title title="합격예측 분석 기준" addClass="text-blue-800" />

            <p className="mt-3 text-gray-800 text-2xs sm:text-sm md:text-md lg:text-base">
              <b>진학사님의 리포트는 3.28 학력평가 기준 수능예측점수로 분석되었습니다.</b>
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
              <p className="reportTitle">내 합격예측 분석 결과</p>

              <AnalysisResult name="진학사" myScore="876.72" type="type5" Analysis={Analysis} />

              <ReportTableTypeRow
                datas={[
                  {
                    children: [
                      { label: '합격가능성 구분', th: true },
                      { label: '인정지원' },
                      { label: '적정지원' },
                      { label: '소신지원' },
                      { label: '위험지원' },
                      { label: '매우위험' },
                    ],
                  },
                  {
                    children: [
                      { label: '점수범위', th: true },
                      { label: '770~800' },
                      { label: '740~769' },
                      { label: '700~739' },
                      { label: '600~699' },
                      { label: '0~599' },
                    ],
                  },
                ]}
              />

              <div>
                <Title title="3.28 학력평가로 본 성적분석" type="report" />
                <InfoTextBox type="bg" display="block" addClass="mt-0 md:mt-0 border border-gray-100">
                  <ScoreAnalysis gapScore="77.77" gapValue="5" arrowType={true} data={ScoreAnalysisData} />

                  <ToggleBox
                    align="left"
                    size="md"
                    addClass="mt-4 sm:mt-5 md:mt-6 border border-gray-300 rounded-lg"
                    bottomAddClass={undefined}
                  >
                    <ToggleBox.Top activeClass="" addClass="">
                      💡 해석 유의사항 확인
                    </ToggleBox.Top>
                    <ToggleBox.Bottom activeClass="" addClass="pt-0 lg:pt-3">
                      <InfoText texts={infoText} />
                    </ToggleBox.Bottom>
                  </ToggleBox>
                </InfoTextBox>
              </div>
            </div>

            <div>
              <p className="reportTitle">모집요강</p>
              <Title title="모집인원 및 경쟁률" type="report" />

              <ReportTableTypeMd
                datas={[
                  {
                    children: [
                      { title: '군', data: '가군' },
                      { title: '대학', data: '한국외국어대' },
                      { title: '모집단위', data: '경영경제' },
                      { title: '모집인원', data: '-' },
                      { title: '전년도 경쟁률', data: '5.35' },
                    ]
                  },
                  {
                    children: [
                      { data: '나군' },
                      { data: '한국외국어대' },
                      { data: '경영경제' },
                      { data: '-' },
                      { title: '전년도 경쟁률', data: '5.35' },
                    ]
                  },
                ]}
              />

              <Title title="전형 요소별 반영방법" type="report" />
              <ReportTableTypeMd
                datas={[
                  {
                    children: [
                      { title: '사정단계(비율%)', data: '가군' },
                      { title: '수능', data: '한국외국어대' },
                      { title: '학생부', data: '경영경제' },
                      { title: '모집인원', data: '-' },
                      { title: '전년도 경쟁률', data: '5.35' },
                    ]
                  }
                ]}
              />

              <Title title="수능 반영방법" type="report" />

              <InfoText
                texts={[
                  {
                    text: '활용지표 : 백분위',
                  },
                  {
                    text: (
                      <>
                        반영영역 : <b>[택2] 국, 수(확/미/기), 영, 사/과/직(2), 한한</b>
                      </>
                    ),
                  },
                  {
                    text: '최적학력기준 : 국어, 수학, 영어, 사탐/과탐(2) 중 3개 영역 등급 합 6 이내',
                  },
                  {
                    text: '영역별 반영 비율(%)',
                  },
                ]}
                addClass="text-gray-800"
              />

              <ReportTableTypeMd
                addClass="mt-3 sm:mt-4 sm:mt-5"
                datas={[
                  {
                    children: [
                      { title: '국어', data: '60' },
                      { title: '수학', data: '60' },
                      {
                        title: (
                          <>
                            영어
                            <button className="underline" onClick={() => OpenEventPopup('popup1')}>
                              (등급표)
                            </button>
                          </>
                        ),
                        data: '40',
                      },
                      { title: '탐구', data: '40' },
                      { title: '제2외/한문', data: '50' },
                      { title: '한국사', data: '50' },
                    ]
                  }
                ]}
              />

              <InfoText
                texts={[
                  {
                    text: '가산점 : 가산점이 없습니다.',
                  },
                  {
                    text: '한국사 반영방법 : 등급별로 가산점 적용',
                  },
                  {
                    text: '학교폭력 반영 : 조치사항별로 전형 총점에서 감점 적용',
                  },
                  {
                    text: '특이사항 : 국,수,영,탐,한 중 성적이 우수한 영역 2개를 60%, 40% 순으로 반영(탐구는 1과목을 1개 영역으로 반영)',
                  },
                ]}
                addClass="mt-4 sm:mt-5 text-gray-800"
              />
            </div>

            <div>
              <p className="reportTitle">모집단위별 입시결과</p>
              <div>
                <ExamResultSwiper ExamData={ExamResult} />
              </div>
            </div>
          </ReportContents>

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

          <LayerPopup align="center" close={false} dimm isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
            <LayerPopup.Header>
              <p className="mb-3text-sm md:text-lg lg:text-2xl">
                <b>한국외국어대 영어 영역 등급표</b>
              </p>
            </LayerPopup.Header>

            <LayerPopup.Body>
              <div className="w-full sm:w-[20rem] md:w-[25rem]">
                <ContTable>
                  <Table>
                    <Table.Colgroup>
                      <col className="w-1/2" />
                    </Table.Colgroup>
                    <Table.Thead>
                      <th className="py-5 lg:py-5">등급</th>
                      <th className="py-5 lg:py-5">점수</th>
                    </Table.Thead>
                    <Table.Tbody>
                      {gradeTable.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 lg:py-3">{item.grade}</td>
                          <td className="py-3 lg:py-3">{item.score}</td>
                        </tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ContTable>
              </div>
            </LayerPopup.Body>

            <LayerPopup.Footer>
              <ButtonBox>
                <Button mode="tertiary" onClick={() => OpenEventPopup('popup1')}>
                  닫기
                </Button>
              </ButtonBox>
            </LayerPopup.Footer>
          </LayerPopup>

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