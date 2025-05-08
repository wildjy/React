'use client';
import React, { useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';
import { ScrollFixed } from '../Layout/ScrollFixed';
import { ScrollProvider, useScroll } from '../Layout/Provider/ScrollProvider';
import { useTong } from './TongContext';
import { DropDown } from '../DropDown/DropDown';

export default function TongTopBottom() {
  return (
    <ScrollProvider initTop={0}>
      <Test />
    </ScrollProvider>
  );
}

function Test() {
  const { innerClass, topBottom } = useTong();
  const { setThreshold } = useScroll();
  const targetRef = useRef<HTMLDivElement>(null);

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
    }, 10);

    resizeEvent();

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setThreshold]);

  return (
    topBottom && (
      <div className={`h-[3.75rem] md:h-[4.375rem]`}>
        <ScrollFixed top={`top-0 3xl:z-[10]`}>
          <div ref={targetRef} className={`flex items-center 3xl:px-[17.375rem] h-[3.75rem] md:h-[4.375rem] bg-[#d9d9d9]`}>
            <div className={`flex items-center ${innerClass}`}>
              <p className={`hidden md:block mr-7 text-lg xl:text-xl`}>현재 상담중인 학생</p>
              <div className="flex gap-x-2">
                <div>
                  <DropDown
                    label="Select an option"
                    options={[
                      {
                        label: '1학년',
                        value: '1',
                      },
                      {
                        label: '2학년',
                        value: '2',
                      },
                      {
                        label: '3학년',
                        value: '3',
                      },
                      {
                        label: 'N수생',
                        value: '4',
                      },
                    ]}
                    size="sm"
                    addClass="py-[0.3rem] sm:py-[0.5rem] h-[1.875rem] sm:h-[2.5rem] border border-[#9f9f9f]"
                    layer
                    value={'1'}
                  />
                </div>
                <div>
                  <DropDown
                    label="Select an option"
                    options={[
                      {
                        label: '1학년 test 클래스',
                        value: '1',
                      },
                      {
                        label: '2학년 test 클래스',
                        value: '2',
                      },
                      {
                        label: '3학년 test 클래스',
                        value: '3',
                      },
                    ]}
                    size="sm"
                    addClass="py-[0.3rem] sm:py-[0.5rem] h-[1.875rem] sm:h-[2.5rem] border border-[#9f9f9f]"
                    min="md:min-w-[9rem]"
                    layer
                    value={null}
                  />
                </div>
                <div>
                  <DropDown
                    label="Select an option"
                    options={[
                      {
                        label: 'Option 1',
                        value: '1',
                      },
                      {
                        label: 'Option 2',
                        value: '2',
                      },
                      {
                        label: 'Option 3',
                        value: '3',
                      },
                    ]}
                    size="sm"
                    addClass="py-[0.3rem] sm:py-[0.5rem] h-[1.875rem] sm:h-[2.5rem] border border-[#9f9f9f]"
                    layer
                    value={null}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollFixed>
      </div>
    )
  );
}
