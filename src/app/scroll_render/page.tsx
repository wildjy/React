'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider";
import { DropDown } from "../../sharedUI/DropDown/DropDown";
import { CloseButton } from "../../sharedUI/Button/CloseButton";
import { ScrollFixed } from "../../sharedUI/Layout/ScrollFixed";
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
  const targetRef = useRef<HTMLInputElement>(null);
  const [targetHeight, setTargetheight] = useState<number | null>(null);

  const topRef = useRef<HTMLInputElement>(null);
  const [topheight, setTopheight] = useState<number | null>(null);
  const bottomRef = useRef<HTMLInputElement>(null);
  const [bottomheight, setBottomheight] = useState<number | null>(null);

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current && topRef.current && bottomRef.current) {
        setTargetheight(targetRef.current.clientHeight);
        setTopheight(topRef.current.clientHeight);
        setBottomheight(bottomRef.current.clientHeight);

        // console.log(targetRef);
        // console.log(topRef.current.clientHeight);
        console.log(bottomRef.current.clientHeight);
        const newOffsetTop = topRef.current.clientHeight + bottomRef.current.clientHeight;
        const offsetTop = targetRef.current.offsetTop;
        console.log(offsetTop);
        // console.log(newOffsetTop);
        if (offsetTop !== undefined) {
          setThreshold(bottomRef.current.clientHeight); // ✅ 정확한 스크롤 기준값 업데이트
        }
      }
    };

    setTimeout(() => setOffsetTop(), 0); // ✅ DOM이 렌더링된 후 실행

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
        univ: '[가] 한국외국어대',
        name: '[서울]미디어커뮤니케이션학부',
      },
      value: '1',
    },
    {
      label: {
        univ: '[다] 서경대',
        name: 'LF_라이프스타일디자인',
      },
      value: '2',
    },
    {
      label: {
        univ: '[다] 건국대(서울)',
        name: '공과대학자유전공학부',
      },
      value: '3',
    },
    {
      label: {
        univ: '[다] 건국대(서울)',
        name: '공과대학자유전공학부',
      },
      value: '4',
    },
    {
      label: {
        univ: '[다] 건국대(서울)',
        name: '건국대건국대건국대건국대건국대',
      },
      value: '5',
    },
    {
      label: {
        univ: '[다] 건국대(서울)',
        name: 'LF_라이프스타일디자인',
      },
      value: '6',
    },
    {
      label: {
        univ: '[다] 건국대(서울)',
        name: 'LF_라이프스타일디자인',
      },
      value: '7',
    },
  ];

  const topHeight = `h-[2.75rem] md:h-[50px]`;
  const topFixedOffset = `top-[2.75rem] md:top-[50px]`;

  return (
    <div className="h-[1500px]">
      <div style={{ height: `${topheight}px` }}>
        <div
          ref={topRef}
          className={`${
            isFixed ? 'fixed' : 'relative'
          } top-0 left-0 flex px-4 justify-between items-center w-full ${topHeight} bg-blue-800 z-10 `}
        >
          <CloseButton size="md" type="back" addClass="md:hidden" onClick={() => undefined} />
          <div className="hidden md:block md:ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="28" viewBox="0 0 90 28" fill="none">
              <g clipPath="url(#clip0_1515_972)">
                <path d="M74.272 0L72.8918 6.61761L79.3377 11.6745L70.4499 18.9164L68.6147 28L90 11.4091L74.272 0Z" fill="#FFCC10" />
                <path
                  d="M5.96057 15.0542C5.47523 16.4589 4.73205 16.7086 3.92821 16.7086C3.21537 16.7086 2.89687 16.4745 2.5632 16.0999L0 18.0197C1.09201 18.9405 2.32053 19.3307 3.77654 19.3307C5.23256 19.3307 6.1729 19.081 7.02224 18.5659C8.40243 17.7231 8.8726 16.7242 9.29727 15.1323C9.82811 13.1345 11.0566 6.7666 11.0566 6.7666H7.76542C7.76542 6.7666 6.43074 13.7276 5.97573 15.0698L5.96057 15.0542Z"
                  fill="white"
                />
                <path
                  d="M48.7462 6.83643L43.1497 18.745H46.7897L51.3397 8.50643L51.7644 18.745H55.4045L54.6158 6.83643H48.7462Z"
                  fill="white"
                />
                <path d="M11.3751 18.7449H14.6663L17.1233 6.7583H13.8321L11.3751 18.7449Z" fill="white" />
                <path
                  d="M25.905 12.7828L22.083 6.7583H19.9596L17.5026 18.7449H20.8089L22.0375 12.7204L26.2083 18.7449H27.9829L30.4399 6.7583H27.1335L25.905 12.7828Z"
                  fill="white"
                />
                <path
                  d="M40.6168 6.7583L39.6765 11.3781H35.6573L36.5976 6.7583H33.3064L30.8494 18.7449H34.1557L35.1112 14.0002H39.1456L38.1749 18.7449H41.4662L43.9232 6.7583H40.6168Z"
                  fill="white"
                />
                <path
                  d="M70.9959 6.7583H66.9312L61.8807 11.0036L62.7452 6.7583H59.454L56.9969 18.7449H60.2881L61.3802 13.454L65.1264 18.7449H69.3731L64.5045 12.1117L70.9959 6.7583Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1515_972">
                  <rect width="90" height="28" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className={`flex justify-center items-center h-[9.375rem] md:h-[15.5rem] bg-blue-800`}>
        <div className={`${isFixed ? 'fixed top-[0.4rem] sm:top-[0.3rem] md:top-[0.8rem] z-10' : ''}`}>
          <div className="w-full">
            <DropDown
              label="선택"
              // onChange={() => {}}
              options={drop}
              type="ghost"
              min="p-0 min-w-[18.75rem]"
              fixed={true}
              value="1"
              icon="report"
              addClass={`text-white bg-transparent ${
                isFixed ? 'py-0 leading-[1.2] md:after:w-[1.25rem] md:after:h-[0.425rem]' : `text-base sm:text-lg md:text-5xl text-center `
              }`}
            />
          </div>
        </div>
      </div>

      <ScrollFixed top={`${topFixedOffset}`} addStyle={{ height: `${targetHeight}px` }}>
        <div ref={targetRef} className={`w-full`}>
          <p>header {isFixed ? 'fix' : 'not fix'}</p>
          <p>ss</p>
          <p>ss</p>
          <p>ss</p>
        </div>
      </ScrollFixed>
      <div className="h-[9.375rem] bg-gray-700"></div>
      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>
      <div className="">sss</div>
    </div>
  );
}