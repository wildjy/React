'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider";
import { ScrollFixed } from "../../sharedUI/Layout/ScrollFixed";
import { ScrollBottom } from "../../sharedUI/Layout/ScrollBottom";
import { JStepBar } from "../../sharedUI/StepBar/JStepBar";
import { JungsiStepBar } from "../../sharedUI/StepBar/JungsiStepBar";
import { ScrollFloating } from "../../sharedUI/Layout/ScrollFloating";
import { BatteryFlag } from '../../sharedUI/Flag/BatteryFlag';
import { InfoTransform, InfoTransformItemType } from '../../sharedUI/Info/InfoTransform';
import { InfoTransformItem } from '../../sharedUI/Info/InfoTransformItem';
import { InfoTransformFrame } from '../../sharedUI/Info/InfoTransformFrame';
import { InfoTransformText } from '../../sharedUI/Info/InfoTransformText';
import { BeforePassResultTable } from './BeforePassResultTable';
import { code } from '@/sharedUI/common/common-code-definitions';
import { ToolTip } from '@/sharedUI/ToolTip/ToolTip';

export default function MarkingPage() {
  return (
    // initTop={200}
    <ScrollProvider>
      <ScrollPageContents />
    </ScrollProvider>
  );
}

function ScrollPageContents() {
  const { isFixed, setThreshold, scrollDirection } = useScroll();
  const [ targetTop, setTargetTop ] = useState(0);
  const targetRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = throttle(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      }

      checkMobile();
    }, 10);

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current) {
        const offsetTop = targetRef.current?.clientHeight;
        console.log(offsetTop)
        setThreshold(offsetTop);
        setTargetTop(offsetTop) // scroll 임의 타겟 위치
      }
    };

    setOffsetTop();

    const resizeEvent = throttle(() => {
      setOffsetTop();
    }, 50);

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  interface analysisType {
    title: string | { tit: string; sub?: string } | React.ReactNode;
    value?: string | React.ReactNode;
    text?: string | React.ReactNode;
    contents?: React.ReactNode;
    arrow?: { value: string | number, arrowType: boolean}
    tooltipData?: {title?: string | React.ReactNode, text?: string | React.ReactNode};
    url?: string;
  }[];

  interface analysisType1 {
    mainTitle?: string | React.ReactNode;
    title?: string | React.ReactNode;
    value?: string | React.ReactNode;
    text?: string | React.ReactNode;
    url?: string;
  }[];

  const passData1 = [
    { title: '내 모평 점수', score: '345.0' },
    { title: '수능예측점수 >', score: '355.5', action: () => alert("성적계산 페이지 이동") },
    { title: '지원가능점수', score: '340.0' },
    { title: '점수 차이', score:  '15'},
  ];

  const passData2 = [
    { title: '합격예측 결과', score: '최초합격' },
    { title: '내점수 >', score: '355.5', action: () => alert("성적계산 페이지 이동") },
    { title: '내 등수/분석대상자수', score: '3 등 / 83 명' },
  ];

  const passData5: analysisType1[] = [
    { mainTitle: '최초 합격 예상자 점수', title: '분석대상자 중 합격예상인원', value: '24 명'},
    { title: '평균점수', value: 541.74 + '점' },
    { title: '최초합격예상컷', value: 541.74 + '점' },
  ]

  const passData6: analysisType1[] = [
    { mainTitle: '최종 합격 예상자 점수', title: '분석대상자 중 합격예상인원', value: 24 + '명', text: '(최초합 7+ 추가합 17)'},
    { title: '평균점수', value: 541.74 + '점' },
    { title: '최초합격예상컷', value: 541.74 + '점' },
  ]

  const mypassResult1: InfoTransformItemType[] = [
    {
      title: { tit: '내 점수 >', sub: ''},
      score: '929.25',
      action: () => alert("성적산출 리포트 탭으로 이동"),
    },
    {
      title: { tit: '내 등수/지원자수', sub: ''},
      score: '19 등 / 153명(0)',
    },
    { title: { tit: '최종 합격예상 컷', sub: '(내 점수와 차이)'},
      score: '340.0',
      arrow: {value: '223.54', arrowType: true}, // [값, 양수/음수]
      tooltip: {
        title: '최초 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
    { title: { tit: '최초 합격예상 컷', sub: '(내 점수와 차이)'},
      score: '340.0',
      arrow: { value: '155.54', arrowType: true }, // [값, 양수/음수]
      tooltip: {
        title: '최초 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
  ]

  const mypassResult2: InfoTransformItemType[] = [
    {
      title: { tit: '사정단계(비율)', sub: ''},
      score: ['1단계(200%)', '2단계(200%)'],
    },
    {
      title: { tit: '내 점수 >', sub: ''},
      score: ['929.25', '929.25'],
      action: () => alert("성적산출 리포트 탭으로 이동"),
    },
    {
      title: { tit: '내 등수/지원자수', sub: ''},
      score: ['19 등 / 153명(0)', '19 등 / 153명(0)'],
    },
    { title: { tit: '최종 합격예상 컷', sub: '(내 점수와 차이)'},
      score: ['340.0', '340.0'],
      arrow: [
        { value: '123.54', arrowType: false },
        { value: '213.54', arrowType: true }
      ],
      tooltip: {
        title: '최초 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
    { title: { tit: '최초 합격예상 컷', sub: '(내 점수와 차이)'},
      score: ['340.0', '480.0'],
      arrow: [
        { value: '155.54', arrowType: true },
        { value: '333.54', arrowType: false }
      ],
      tooltip: {
        title: '최초 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
  ]

  const passData3: analysisType[] = [
    { title: '내 점수 >', value: 755.55 + '점', url: '#/' },
    { title: '내 등수/분석대상자수', value: '3등 /  83명', },
    { title: { tit: '최종 합격예상 컷', sub: '(내 점수와 차이)'},
      value: 755.55 + '점',
      arrow: { value: '155.54', arrowType: true }, // arrowType: true = 상승, false = 하락
      tooltipData: {
        title: '최종 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
    { title: { tit: '최초 합격예상 컷', sub: '(내 점수와 차이)'},
      value: 600.55 + '점',
      arrow: { value: '100.54', arrowType: false }, // arrowType: true = 상승, false = 하락
      tooltipData: {
        title: '최초 합격예상 컷',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
  ]

  const analysis4: analysisType[] = [
    { title: '분석대상자', value: 120 + '명',
      text: <>
        <span className='md:block'>실제지원자 155명</span>
        <span>허수 35명</span>
      </>
    },
    { title: '업데이트 일시', value: '12월 15일(월)',
      text: <>
        <span className='md:block'>다음 업데이트 예정</span>
        <span>12월 16일(화) 17:00</span>
      </>
    },
    { title: '데이터기준',
      value: '모의지원 + 전년도 결과로 분석',
      text: <>모의지원 결과 중심 분석되며<br />전년도 결과가 일부 포함</>},
  ]

  const passData7: analysisType[] = [
    { title: '합격예측결과', value: <><p className='text-blue-800 md:mt-15'>최초합격</p></>,
      tooltipData: {
        title: '합격예측결과',
        text: `
          최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
          이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
        `
      }
    },
    { title: '합격안정성', value: <><span className='text-blue-800'>9칸</span></>,
      tooltipData: {
        title: '합격안정성',
        text: <>
          합격안정성은 합격 예상컷을 기준으로 회원님의 위치를 ‘칸수’로 보여주는 지표입니다.
          칸수가 많을수록 상대적으로 안정적인 위치를 의미하나, 모집인원과 경쟁률 등 그 해 입시 상황에 따라 실제 결과는 달라질 수 있습니다.
          일반적으로 칸수별 의미는 아래와 같습니다.

          <ul>
            <li>- 7칸 이상: 안정(하향 지원)</li>
            <li>- 5~6칸: 적정(경쟁률에 의한 변수 발생 주의)</li>
            <li>- 4~5칸: 소신(기타 전형요소에 따른 변동 주의)</li>
            <li>- 3칸 이하: 불안(상향 지원)</li>
          </ul>
        </>
      },
      contents: <>
        <BatteryFlag value={9} />
      </>
    },
    { title: <>과거 3개년 <span className='text-blue-800'>6칸</span> 합불결과</>,
      tooltipData: {
        title: '과거 3개년 칸수별 합불결과',
        text: `
          열람하고 있는 모집단위 기준으로 과거 3개년 동안 동일한 칸수로 예측된 경우의 실제 합격 결과를 제공하고 있습니다.
          예를 들어 2025년 5칸의 합불 결과가 ‘최+추’로 추가합격이 포함된 경우에는 해당 칸수가 컷트라인에 걸쳐 있어 6칸으로 예측된 학생 중 일부는 최초합격, 일부는 추가합격한 사례가 있음을 의미합니다.

          ※학과 신설 등으로 과거 데이터가 없거나 부족한 경우에는 합불결과가 - 로 표시됩니다.
        `
      },
      contents: <>
        <BeforePassResultTable
          years={["2025", "2024", "2023"]}
          rows={[
            {
              title: "6칸",
              datas: [
                [{ type: code("REGULAR_PASS_SCORE_RANGE_CODES", "PASS_FIRST"), label: "최초합격" }],
                [{ type: code("REGULAR_PASS_SCORE_RANGE_CODES", "PASS_SUPPLEMENT"), label: "추가합격" }],
                "-",
              ],
            },
          ]}
        />
      </>,
    },
  ]


  return (
    <ScrollProvider>
      <div className="flex w-full h-full flex-col">

        <ScrollFixed top={`top-0`} fixHeight={'h-[75px]'}>
          <div className="flex justify-center items-center w-full h-[75px]">
            header {isFixed ? 'fix' : 'not fix'}
          </div>
        </ScrollFixed>

        <div className="flex justify-center items-center w-full h-[75px]">
          header {isFixed ? 'fix' : 'not fix'}
        </div>

        <div className="absolute top-[9.375rem] left-0 w-[10px] h-[1px] bg-red-600 z-50"></div>

        <div className="flex flex-grow flex-col bg-green-100">
          <div className='mx-auto xl:w-[72.5rem] min-h-[62.5rem]'>
          <ToolTip
            addClass=""
            align="left"
            iconUrl="https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg"
            onClick={() => {}}
            type="base"
          >
            <p className="text-sm text-gray-700">
              이것은 툴팁 내용입니다.
            </p>
          </ToolTip>

            <div>
              <JungsiStepBar
                currentStep={3}
                step={[
                  {
                    id: 1,
                    label: {label: '기본정보', userName: 'ㅇㅇㅇ'},
                    url: '#1/',
                    result: { active: false, value: '재학생' },
                  },
                  {
                    id: 2,
                    label: '수능인증',
                    url: '#2/',
                    result: { active: true, value: '인증완료' },
                  },
                  {
                    id: 3,
                    label: '모의지원',
                    url: '#3/',
                    result: {
                      active: false,
                      value: 20,
                    },
                  },
                  {
                    id: 4,
                    label: '합격예측',
                    url: '#4/',
                    result: { active: false, value: '미결제', activeUrl: '#completedPayUrl/' },
                  },
                  {
                    id: 5,
                    label: '점수공개',
                    url: '#5/',
                    result: { active: false, value: 1, message: '12/29 오픈예정',  disabled: true},
                  },
                ]}
                disabledUrl={'#disabled'}
                // disabled={{ label: '로그인 후 이용가능합니다.', url: '#goDisabledLink/' }}
              />

              <JStepBar
                step={[
                  {
                    id: 1,
                    label: {label: '기본정보', userName: 'ㅇㅇㅇ'},
                    url: '#1/',
                    result: { active: true, value: '재학생' },
                  },
                  {
                    id: 2,
                    label: '수능인증',
                    url: '#2/',
                    result: { active: true, value: '인증완료' },
                  },
                  {
                    id: 3,
                    label: '모의지원',
                    url: '#3/',
                    result: {
                      active: false,
                      value: 20,
                    },
                  },
                  {
                    id: 4,
                    label: '합격예측',
                    url: '#4/',
                    result: { active: false, value: '미결제', activeUrl: '#completedPayUrl/' },
                  },
                  {
                    id: 5,
                    label: '점수공개',
                    url: '#5/',
                    result: { active: false, value: 3, disabled: true },
                  },
                ]}
                isMobile={false}
              />
            </div>

            <div className='bg-white'>
              <InfoTransform datas={mypassResult1}
                mark={{ hideIndex: [1, 3] }}
              />

              <InfoTransform type="type1" datas={mypassResult2}
                mark={{ hideIndex: [0, 2] }}
              />

              <div className='pt-5 pb-7'>
                <InfoTransformFrame type="recLine" widths={['w-[30%]', 'w-[30%]', 'w-[60%]']}>
                  {passData7.map((item, index) => (
                    <InfoTransformItem
                      key={index}
                      index={index}
                      lastIndex={index === passData7.length - 1}
                      title={item.title}
                      value={item.value}
                      text={item.text}
                      arrow={item.arrow}
                      contents={item.contents}
                      tooltip={{ show: true, data: {title: item.tooltipData?.title, text: item.tooltipData?.text} }}
                    />
                  ))}
                </InfoTransformFrame>
              </div>


              <InfoTransformFrame type="recBg" addClass='mt-5'>
                <div className='w-full'>
                  <InfoTransformText datas={passData5} />
                </div>
                <div className='w-full'>
                  <InfoTransformText datas={passData6} />
                </div>
              </InfoTransformFrame>

              <div className='my-5'>
                <InfoTransformFrame type="rec">
                  {passData3.map((item, index) => (
                    <InfoTransformItem
                      key={index}
                      index={index}
                      lastIndex={index === passData3.length - 1}
                      title={item.title}
                      value={item.value}
                      text={item.text}
                      arrow={item.arrow}
                      url={item.url}
                      tooltip={{ show: [2, 3], data: {title: item.tooltipData?.title, text: item.tooltipData?.text} }}
                    />
                  ))}
                </InfoTransformFrame>
              </div>

              <InfoTransform datas={
                [
                  {
                    title: '내 점수 >',
                    score: '345.0',
                    subScore:
                    <>
                      <span>수능 355.22점</span>
                      <span>수능 355.22점</span>
                    </>,
                    action: () => alert("성적산출 리포트 탭으로 이동"),
                  },

                  {
                    title: '내 등수/지원자수(동점자)',
                    score: '19 등 / 153명',
                    subScore:
                    <>
                      <span>수능 2등 / 83명</span>
                      <span>내신 6등 / 73명</span>
                    </>,
                  },
                  { title: '상위 50% 지원자 평균', score: '340.0',
                    tooltip: {
                      title: '최초 합격예상 컷',
                      text: `
                        최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
                        이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
                      `
                    }
                  },
                  { title: '지원자 평균', score: '738.25',
                    tooltip: {
                      title: '최초 합격예상 컷',
                      text: `
                        최초합격예상컷은 추가합격(추합)을 제외하고, 1차 합격자 발표에서 합격할 것으로 예상되는 가장 낮은 점수입니다.
                        이 점수 이상이라면 최초 합격을 기대할 수 있습니다.
                      `
                    }
                  },
                ]}
                mark={{ hideIndex: 1 }}
              />

              <div className='mt-5'>
                <InfoTransform type="row" datas={passData1} />
              </div>
            </div>
          </div>
        </div>

        <div ref={targetRef} className="sm:pb-17 md:pb-18 xl:pb-0">
          <div className='h-[15.7rem] md:h-[12rem] xl:h-[14.1875rem] bg-gray-700'></div>
        </div>

        <ScrollBottom>  targetH={targetTop}
          <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
        </ScrollBottom>

        <ScrollFloating direction align='left'>
          <div className='flex flex-col gap-3'>
            <button className='bg-red-500 rounded-full size-9 md:size-12 xl:size-11'></button>
          </div>
        </ScrollFloating>

        {/* <ScrollFloating >
          <div className='flex flex-col gap-3'>
            <button className='w-10 h-10 rounded-full bg-red-200'></button>
            <button className='w-10 h-10 rounded-full bg-black'></button>
          </div>
        </ScrollFloating> */}

      </div>
    </ScrollProvider>
  );
}