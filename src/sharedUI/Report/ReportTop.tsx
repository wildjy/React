/* eslint-disable react/display-name */
'use client';
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { CloseButton } from '../Button/CloseButton';
import { DropDown, DropDownOptionType } from '../DropDown/DropDown';
import { Logo } from '../Flag/Logo';

interface ReportTopProps {
  selectValue?: string;
  univOption?: DropDownOptionType[];
  info?: { label: string; data: string }[];
  children?: React.ReactNode;
  isFixed: boolean;
  fixHeight: string;
  onChange?: () => void;
}

export const ReportTop = forwardRef<HTMLDivElement, ReportTopProps>(
  ({ selectValue, univOption, info, isFixed, fixHeight, onChange }, ref) => {
    const topRef = useRef<HTMLDivElement>(null);
    const [topheight, setTopheight] = useState<number | null>(null);

    useEffect(() => {
      const setOffsetTop = () => {
        if (topRef.current) {
          setTopheight(topRef.current.clientHeight);
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
    }, []);

    return (
      <div>
        <div style={{ height: `${topheight}px` }}>
          <div
            ref={topRef}
            className={`${
              isFixed ? 'fixed bg-blue-800 transition duration-150 z-20' : 'relative'
            } top-0 left-0 flex px-4 justify-between items-center w-full ${fixHeight} `}
          >
            <CloseButton size="md" type="backWhite" addClass="md:hidden" onClick={() => undefined} />
            <div className={`md:ml-auto ${isFixed ? 'hidden' : 'block'}`}>
              <Logo addClass="w-[3.75rem] h-[1.125rem] md:w-[5rem] md:h-[1.5rem] xl:w-[90px] xl:h-[28px]" />
            </div>
          </div>
        </div>

        <div ref={ref} className={`bottomRef.. flex justify-center items-center flex-wrap h-[9.375rem] md:h-[13.125rem] `}>
          <div className={`${isFixed ? 'fixed top-[0.4rem] sm:top-[0.3rem] md:top-[1.3rem] xl:top-[1.3rem] z-20' : ''}`}>
            <div className="w-full">
              <DropDown
                label="선택"
                onChange={onChange}
                options={univOption}
                type="ghost"
                min="p-0 min-w-[18.75rem]"
                fixed={true}
                isFixedScroll={isFixed}
                value={selectValue}
                icon="report"
                addClass={`font-bold text-white bg-transparent ${
                  isFixed
                    ? `pl-5 sm:pl-7 md:pl-8 py-0 md:text-2xl xl:text-2xl leading-[1.2] md:after:w-[1.25rem] md:after:h-[0.425rem]`
                    : `text-lg sm:text-xl md:text-3xl xl:text-5xl text-center`
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center w-full text-center">
            {info?.map((info, index) => (
              <div
                key={index}
                className={`grow md:grow-0 md:px-14 text-white border-r border-dashed last:border-r-0 relative
                  after:content-[""] after:absolute after:top-0 after:bottom-0
                `}
              >
                <p className="text-2xs sm:text-xs md:text-sm">{info.label}</p>
                <p className="text-base sm:text-lg lg:text-4xl">
                  <b>{info.data}</b>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
