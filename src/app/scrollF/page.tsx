'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider";
import { ScrollFixed } from "../../sharedUI/Layout/ScrollFixed";
import { ScrollBottom } from "../../sharedUI/Layout/ScrollBottom";
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
    <div className="flex h-full flex-col">

      <ScrollFixed top={`top-0`} fixHeight={'h-[75px]'}>
        <div className="flex justify-center items-center w-full h-[75px]">
          header {isFixed ? 'fix' : 'not fix'}
        </div>
      </ScrollFixed>

      <div className="h-[9.375rem] bg-gray-500"></div>
      <div className="absolute top-[9.375rem] left-0 w-[10px] h-[1px] bg-red-600 z-50"></div>

      <div className="flex flex-grow flex-col bg-green-100">
        <div className='h-[62.5rem]'></div>
      </div>

      <div ref={targetRef} className="py-[4.5rem] bg-gray-700">footer</div>

      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>

      <ScrollFloating h={targetTop} />

    </div>
  );
}