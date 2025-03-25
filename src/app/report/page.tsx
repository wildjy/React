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
import { TableBase } from "../../sharedUI/Table/TableBase";
import { TableTypeMd } from "../../sharedUI/Table/TableTypeMd";
import { TableTypeRow } from "../../sharedUI/Table/TableTypeRow";
import { BottomJson } from "../../sharedUI/Banner/BottomJson";
import { NoData } from "../../sharedUI/NoData/NoData";
import { Error } from "../../sharedUI/NoData/Error";

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
        gun: '가외',
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
                <TableBase
                  datas={[
                    {
                      children: [
                        { title: '계열', data: '인문계', width: '30%' },
                        { title: '모집인원', data: '3.92' },
                        { title: '지원자수', data: '2.351' },
                        { title: '경쟁률', data: '5.34' },
                      ],
                    },
                    {
                      children: [{ data: '자연계', width: '30%' }, { data: '3.92' }, { data: '2.351' }, { data: '5.34' }],
                    },
                    {
                      children: [{ data: '예체능계', width: '30%' }, { data: '3.92' }, { data: '2.351' }, { data: '5.34' }],
                    },
                    {
                      children: [
                        { data: '전체', width: '30%' },
                        {
                          data: (
                            <>
                              <b>1.920</b>
                            </>
                          ),
                        },
                        {
                          data: (
                            <>
                              <b>11.351</b>
                            </>
                          ),
                        },
                        {
                          data: (
                            <>
                              <b>5.34</b>
                            </>
                          ),
                        },
                      ],
                    },
                  ]}
                />
                <TableBase
                  datas={[
                    {
                      children: [
                        {
                          title: '전형유형',
                          data: (
                            <>
                              <span className="block md:inline">학생부위주</span>(교과)
                            </>
                          ),
                          width: [{ pc: '15%', m: '20%' }],
                          align: 'left',
                        },
                        {
                          title: '세부유형별',
                          data: '부모가 모두 외국인인 외국인(3월)/정원외',
                          width: [{ pc: '30%', m: '30%' }],
                          align: 'left',
                        },
                        {
                          title: (
                            <>
                              <span className="block md:inline">모집</span>인원
                            </>
                          ),
                          data: '999',
                          width: [{ pc: '10%', m: '8%' }],
                        },
                        {
                          title: (
                            <>
                              <span className="block md:inline">등록</span>인원
                            </>
                          ),
                          data: '135',
                          width: [{ pc: '10%', m: '8%' }],
                        },
                        { title: '등록률', data: '135.34', width: [{ pc: '10%', m: '8%' }] },
                      ],
                    },
                    {
                      children: [
                        { data: '수능위주', align: 'left' },
                        { data: '학생부종합(기초생활및차상위)/정원외', align: 'left' },
                        { data: '70.6' },
                        { data: '135' },
                        { data: '135.34' },
                      ],
                    },
                  ]}
                />
                <TableTypeMd
                  datas={[
                    {
                      children: [
                        { title: '군', data: '가군', width: '10%' },
                        { title: '대학', data: '건국대(GLOCAL)', width: '15%' },
                        { title: '모집단위', data: 'KMU International Business School', width: '20%' },
                        { title: '모집인원', data: '-', width: '10%' },
                        { title: '전년도 경쟁률', data: '5.35', width: '15%' },
                        { title: '인터넷 접수 일정', data: '26.01.01~01.31', width: '20%' },
                      ],
                    },
                  ]}
                />
                <TableTypeRow
                  datas={[
                    {
                      children: [
                        { label: '출신학교 유형', th: true },
                        { label: '출신학교 유형' },
                        { label: '출신학교 유형' },
                        { label: '출신학교 유형' },
                      ],
                    },
                    {
                      children: [
                        { label: '출신학교 유형', th: true },
                        { label: '출신학교 유형' },
                        { label: '출신학교 유형' },
                        { label: '출신학교 유형' },
                      ],
                    },
                  ]}
                />
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

      <Error
        message={{
          title: '서비스 이용에 불편을 드려 죄송합니다.',
          sub: (
            <>
              서비스 처리 중 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해 주세요.
              <br />
              문제가 지속될 경우 고객센터(1544-7715) 혹은 1:1문의로 문의해 주시기 바랍니다.
            </>
          ),
        }}
        button={{ href: 'https://www.jinhak.com/', label: '메인으로 이동' }}
      />

          <BottomJson
            datas={[
              {
                badge: {
                  imgurl: 'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2503_gachon_512x64_1/gachon250312_512x64re.png',
                  imageHeight: '64',
                  clickUrl:
                    'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/25_ListN_test/L26/1475506037/x01/JINHAK/2503_TEST_299x226/2503_TEST_299x226_250307.html/792f7563516d65316962414144746b44',
                  openInExternalBrowser: '0',
                },
                info: { subj: '재능대학교', cont: '글로벌평생직업교육대학' },
              },
              {
                badge: {
                  imgurl: 'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2503_dongguk_512x64_2/dongguk250312_512x64re.png',
                  imageHeight: '64',
                  clickUrl:
                    'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMnesinA/L17/1862612116/x02/JINHAK/2503_dongguk_512x64_2/2503_dongguk_512x64_2_250312.html/792f7563516d65316962414144746b44',
                  openInExternalBrowser: '0',
                },
                info: { subj: '재능대학교', cont: '글로벌평생직업교육대학' },
              },
            ]}
          />
        </div>
      </div>
      {/* body */}

      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>
    </ReportLayout>
  );
}