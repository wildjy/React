'use client';
import React, { useState, useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { cn } from "../common/cn";
import { ScrollFixed } from '../Layout/ScrollFixed';
import { NoData } from '../NoData/NoData';
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
  const { innerClass, sideNav, topBottom, isDesktop, isNavOpen, setIsNavOpen } = useTong();
  const slots = React.Children.toArray(children);

  const { isFixed, setThreshold, scrollDirection } = useScroll();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current) {
        const offsetTop = targetRef.current?.offsetTop;
        setThreshold(offsetTop - (topBottom ? 70 : 0)); // scroll 임의 타겟 위치
      }
    };

    setOffsetTop();

    const resizeEvent = throttle(() => {
      setOffsetTop();
    }, 10);

    resizeEvent();

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  return (
    <div className={`3xl:min-h-[62.5rem]`}>
      <div className="flex items-stretch">
        {slots.length > 0 ? (
          slots.slice(0, 2).map((slot, index) =>
            index === 0 ? (
              sideNav && (
                <ScrollFixed key={index} top={`top-[0] left-auto right-auto z-[5] h-full`}>
                  <div ref={targetRef} className={`${cn('scroll contents....  h-full relative', addClass)}`}>
                    {/* ${sideNav && !isDesktop ? 'absolute' : 'fixed'} */}
                    <div
                      className={`
                        ${cn(
                          [
                            `
                            fixed 3xl:absolute
                            top-0 bottom-0 w-[11.625rem]
                            border-r border-gray-200 bg-white
                            transition duration-150 z-[10] 3xl:z-[5]`,
                          ],
                          {
                            '3xl:top-[4.375rem]': isFixed && topBottom,
                            '-translate-x-full': isDesktop && !isNavOpen,
                            'translate-x-0': !isDesktop || isNavOpen,
                            hidden: isDesktop === undefined,
                          }
                        )}
                      `}
                    >
                      {isDesktop && (
                        <div
                          className={`
                          absolute -right-[2.5rem] -translate-y-1/2 top-1/2
                          flex justify-center items-center
                          w-[2.5rem] h-[2.5rem]
                          text-white bg-gray-1000
                        `}
                        >
                          <button onClick={() => setIsNavOpen(!isNavOpen)}>{isNavOpen ? '열고' : '닫기'}</button>
                        </div>
                      )}
                      {slot}
                    </div>
                  </div>
                </ScrollFixed>
              )
            ) : (
              <div key={index} className={`3xl:px-[17.375rem] grow`}>
                <div className={`${innerClass}`}>{slot}</div>
              </div>
            )
          )
        ) : (
          <div className={`3xl:px-[17.375rem] grow`}>
            <div className={`${innerClass}`}>
              <NoData message="No Contents." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
