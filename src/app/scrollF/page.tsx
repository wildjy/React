'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider";
import { ScrollFixed } from "../../sharedUI/Layout/ScrollFixed";
import { ScrollBottom } from "../../sharedUI/Layout/ScrollBottom";
import { JStepBar } from "../../sharedUI/StepBar/JStepBar";
import { JungsiStepBar } from "../../sharedUI/StepBar/JungsiStepBar";
import { ScrollFloating } from "../../sharedUI/Layout/ScrollFloating";

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

  return (
    <ScrollProvider>
      <div className="flex w-full h-full flex-col">

        {/* <ScrollFixed top={`top-0`} fixHeight={'h-[75px]'}>
          <div className="flex justify-center items-center w-full h-[75px]">
            header {isFixed ? 'fix' : 'not fix'}
          </div>
        </ScrollFixed> */}

        <div className="flex justify-center items-center w-full h-[75px]">
          header {isFixed ? 'fix' : 'not fix'}
        </div>

        <div className="h-[9.375rem] bg-gray-500">
          <JungsiStepBar
            currentStep={3}
            step={[
              {
                label: '기본정보',
                url: '#1/',
                result: { active: false, label: '00년 졸업예정', url: '#result1/' },
              },
              {
                label: '수능인증',
                url: '#2/',
                result: { active: true, label: '인증완료' },
              },
              {
                label: '모의지원',
                url: '#3/',
                result: {
                  active: true,
                  label: '20/30개',
                  url: '#result3/'
                },
              },
              {
                label: '합격예측',
                url: '#4/',
                result: { active: false, label: '미결제', url: '#result4/' },
              },
              {
                label: '점수공개',
                url: '#5/',
                result: { active: true, label: '1/3개', url: '#result5/' },
              },
              {
                label: '점수공개',
                url: '#5/',
                result: { active: true, label: '1/3개', url: '#result5/' },
              },
            ]}
            // disabled={{ label: '로그인 후 이용가능합니다.', url: '#goDisabledLink/' }}
          />

          {/* <JStepBar
            currentStep={3}
            step={[
              {
                label: '기본정보',
                url: '#1/',
                result: { active: false, label: '00년 졸업예정', url: '#result1/' },
              },
              {
                label: '수능인증',
                url: '#2/',
                result: { active: true, label: '인증완료' },
              },
              {
                label: '모의지원',
                url: '#3/',
                result: {
                  active: true,
                  label:
                  <>
                    20/30개
                    <span className='md:block'>불합격 or 발표대기</span>
                  </>,
                  url: '#result3/'
                },
              },
              {
                label: '합격예측',
                url: '#4/',
                result: { active: false, label: '미결제', url: '#result4/' },
              },
              {
                label: '점수공개',
                url: '#5/',
                result: { active: true, label: '1/3개', url: '#result5/' },
              },
            ]}
          /> */}

        </div>
        <div className="absolute top-[9.375rem] left-0 w-[10px] h-[1px] bg-red-600 z-50"></div>

        <div className="flex flex-grow flex-col bg-green-100">
          <div className='h-[62.5rem]'></div>
        </div>

        <div ref={targetRef} className="sm:pb-17 md:pb-18 xl:pb-0">
          <div className='h-[15.7rem] md:h-[12rem] xl:h-[14.1875rem] bg-gray-700'></div>
        </div>

        {/* <ScrollBottom>  targetH={targetTop}
          <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
        </ScrollBottom> */}

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