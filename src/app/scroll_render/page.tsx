'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider"
import { ReportLayout } from "../../sharedUI/Report/ReportLayout";
import { ReportTop } from "../../sharedUI/Report/ReportTop";
import { ReportTab } from "../../sharedUI/Report/ReportTab";
import { ReportContents } from "../../sharedUI/Report/ReportContents";
import { Between } from "../../sharedUI/Layout/Between";;
import { DropDown } from "../../sharedUI/DropDown/DropDown";
import { InfoText } from "../../sharedUI/Info/InfoText";
import { InfoTextBox } from "../../sharedUI/Info/InfoTextBox";
import { Title } from "../../sharedUI/Title/Title";
import { Arrow } from "../../sharedUI/Flag/Arrow";
import Table from "../../sharedUI/Table/Table";
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
  const [isMobile, setIsMobile] = useState(false);

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
              <p className="title">내 합격예측 분석 결과</p>

              {/* <AnalysisResult name="진학사" myScore="876.72" type="type1" Analysis={Analysis} /> */}

              <Table addClass="tableTypeRow">
                <Table.Colgroup>
                  <col className="w-full md:w-1/6" />
                </Table.Colgroup>
                <Table.Tbody tdW="w-full">
                  <tr>
                    <th>합격가능성 구분</th>
                    <td>인정지원</td>
                    <td>적정지원</td>
                    <td>소신지원</td>
                    <td>모험지원</td>
                    <td>모험지원</td>
                  </tr>
                  <tr>
                    <th>점수범위</th>
                    <td>770~800</td>
                    <td>740~769</td>
                    <td>700~739</td>
                    <td>600~699</td>
                    <td>0~599</td>
                  </tr>
                </Table.Tbody>
              </Table>

              <div>
                <Title title="3.28 학력평가로 본 성적분석" type="report" />
                <InfoTextBox type="bg" display="block" addClass="mt-0 md:mt-0 border border-gray-100">
                  <p className="text-center text-gray-800 border-b border-gray-100 text-2xs sm:text-sm md:text-md lg:text-base">
                    지원가능점수와 나의 점수차이 77.77점은 , 수능 원점수로 약 5점 정도입니다.
                  </p>

                  <ul className="flex justify-between">
                    <li className="flex items-center gap-2">💯 원점수</li>
                    <li className="flex items-center gap-2">
                      약 <Arrow type={true} />5 점
                    </li>
                    <li className="flex items-center gap-2">✏️ 문항 수</li>
                    <li className="flex items-center gap-2">
                      약 <Arrow type={false} /> 2.5 개
                    </li>
                  </ul>

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
              <p className="title">모집요강</p>
              <Title title="모집인원 및 경쟁률" type="report" />

              {/* <Table addClass="tableTypeMd">
                <Table.Colgroup>
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                </Table.Colgroup>
                <Table.Thead thW="w-1/3">
                    <th>군</th>
                    <th>대학</th>
                    <th>모집단위</th>
                    <th>모집인원</th>
                    <th>전년도 경쟁률</th>
                </Table.Thead>
                <Table.Tbody tdW="w-2/3">
                  <tr>
                    <td>가군</td>
                    <td>한국외국어대</td>
                    <td>경영경제</td>
                    <td>-</td>
                    <td>5.35</td>
                  </tr>
                </Table.Tbody>
              </Table> */}

              <Title title="전형 요소별 반영방법" type="report" />

              {/* <Table addClass="tableTypeMd">
                <Table.Colgroup>
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                </Table.Colgroup>
                <Table.Thead thW="w-1/3">
                    <th>사정단계(비율%)</th>
                    <th>수능</th>
                    <th>학생부</th>
                    <th>모집인원</th>
                    <th>전년도 경쟁률</th>
                </Table.Thead>
                <Table.Tbody tdW="w-2/3">
                  <tr>
                    <td>가군</td>
                    <td>한국외국어대</td>
                    <td>경영경제</td>
                    <td>-</td>
                    <td>5.35</td>
                  </tr>
                </Table.Tbody>
              </Table> */}

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

              {/* <Table addClass="mt-4 sm:mt-5 tableTypeMd">
                <Table.Colgroup>
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                </Table.Colgroup>
                <Table.Thead thW="w-1/3">
                    <th>국어</th>
                    <th>수학</th>
                    <th>학생부</th>
                    <th>모집인원</th>
                    <th>전년도 경쟁률</th>
                </Table.Thead>
                <Table.Tbody tdW="w-2/3">
                  <tr>
                    <td>가군</td>
                    <td>한국외국어대</td>
                    <td>경영경제</td>
                    <td>-</td>
                    <td>5.35</td>
                  </tr>
                </Table.Tbody>
              </Table> */}

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
              <p className="title">모집단위별 입시결과</p>
            </div>
          </ReportContents>


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