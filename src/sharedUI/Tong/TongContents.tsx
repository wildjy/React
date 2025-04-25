'use client';
import React, { useState, useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { cn } from "../common/cn";
import { ScrollFixed } from '../Layout/ScrollFixed';
import { ScrollProvider, useScroll } from '../Layout/Provider/ScrollProvider';
import { useTong } from './TongContext';

export default function TongContents({
  sideNav,
  addClass,
  children,
}: {
  sideNav?: boolean;
  addClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <ScrollProvider initTop={0}>
      <ScrollPageContents sideNav={sideNav} addClass={addClass}>
        {children}
      </ScrollPageContents>
    </ScrollProvider>
  );
}

function ScrollPageContents({ addClass, children }: { sideNav?: boolean; addClass?: string; children?: React.ReactNode }) {
  const { innerClass, sideNav, isCheck } = useTong();
  const [isOpen, setIsOpen] = useState(false);
  const slots = React.Children.toArray(children);

  const { isFixed, setThreshold, scrollDirection } = useScroll();
  const targetRef = useRef<HTMLInputElement>(null);

  const OpenEvent = () => {
    setIsOpen((prev) => !prev);
  };

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

    resizeEvent();

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  console.log(isCheck);
  return (
    <div className={`min-h-[62.5rem]`}>
      <div className="flex items-stretch ">
        {slots.length > 0 ? (
          slots.slice(0, 2).map((slot, index) =>
            index === 0 ? (
              sideNav && (
                <ScrollFixed top={`top-0`} key={index}>
                  <div ref={targetRef} className={`${cn('scroll contents.... relative', addClass)}`}>
                    <div
                      className={`
                        ${cn('absolute top-0 left-0 w-[11.625rem] border-r border-gray-200 translate-x-none', {
                          '-translate-x-full': isCheck && !isOpen,
                          '-translate-x-none': !isCheck && isOpen,
                        })}
                      `}
                    >
                      {isFixed ? 'fix' : 'not fix'}
                      {isCheck && (
                        <div className="absolute -right-[50px] w-[50px] -translate-y-1/2 top-1/2 text-white bg-gray-1000">
                          <button onClick={OpenEvent}>열고닫기</button>
                        </div>
                      )}
                      {slot}
                    </div>
                  </div>
                </ScrollFixed>
              )
            ) : (
              <div key={index} className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''}  grow`}>
                <div className={`${innerClass}`}>{slot}</div>
              </div>
            )
          )
        ) : (
          <div>No data.</div>
        )}
      </div>
    </div>
  );
}
