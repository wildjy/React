
'use client';
import React, { useState, useEffect } from 'react';
import { ScrollFloating } from '../Layout/ScrollFloating';
import { JStepBar, JStep } from './JStepBar';
import { throttle } from 'lodash';

export const JungsiStepBar = ({
  step,
  currentStep,
  disabled,
  disabledUrl
}: {
  step: JStep[],
  currentStep: number,
  // disabled?: {label: string, url: string},
  disabledUrl?: string,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setMobileIsOpen] = useState(false);

  const openStepLayer = () => {
    setMobileIsOpen((prev) => !prev);
  };

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


  return (
    <div>
      <JStepBar
        currentStep={currentStep}
        isOpenLayer={isMobileOpen}
        onClose={openStepLayer}
        disabledUrl={disabledUrl}
        step={step}
        isMobile={isMobile}
      />

      {/*
        처음~ 끝 : 고정 노출
        위치 : Top 위
      */}
      <ScrollFloating direction>
        <div className='flex flex-col gap-3'>
          <button className='text-white bg-black rounded-full size-9 md:size-12 xl:size-11'>챗봇</button>
          <button className='text-white bg-black rounded-full size-9 md:size-12 xl:size-11'>쿠폰</button>
          <button className={`
              ${ isMobileOpen ? 'text-blue-700 border-blue-700' : 'border-gray-100'}
              block px-1 size-9 md:size-12 xl:size-11
              text-3xs
              border bg-white rounded-full
            `}
            onClick={openStepLayer}
            >
            {isMobileOpen ? 'Close': 'Open'}
          </button>
        </div>
      </ScrollFloating>
    </div>
  )
}