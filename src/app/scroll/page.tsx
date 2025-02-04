'use client';
import React, { useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { ScrollProvider, useScroll } from "../../sharedUI/Layout/Provider/ScrollProvider";
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

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current) {
        const offsetTop = targetRef.current?.offsetTop;
        setThreshold(offsetTop); // scroll 임의 타겟 위치
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
    <div className="h-[1500px]">
      <div className="absolute top-[9.375rem] left-0 w-[10px] h-[1px] bg-red-600 z-50"></div>
      <div className="h-[9.375rem] bg-gray-100"></div>

      <ScrollFixed fixHeight={'h-[75px]'}>
        <div ref={targetRef} className="flex justify-center items-center w-full h-[75px]">
          header {isFixed ? 'fix' : 'not fix'}
        </div>
      </ScrollFixed>

      <ScrollBottom>
        <nav className="px-5 py-3">{scrollDirection ? 'scroll Down' : 'scroll Up'}</nav>
      </ScrollBottom>

      <div className="">sss</div>
    </div>
  );
}