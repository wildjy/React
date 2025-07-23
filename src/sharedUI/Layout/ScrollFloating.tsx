'use client';
import React, { useRef, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { useScroll } from './Provider/ScrollProvider';
import { cn } from "../common/cn";

interface ScrollFloatingProps {
  children?: React.ReactNode;
  direction?: boolean;
  align?: string;
  addClass?: string;
  targetF?: boolean;
}

export const ScrollFloating: React.FC<ScrollFloatingProps> = ({ children, direction = false, align, addClass, targetF = false }) => {
  const { scrollDirection } = useScroll();
  const [ footerY, setFooterY ] = useState(0);
  const [ scrollTop, setScrollTop ] = useState(0);
  const [ targetTop, setTargetTop ] = useState(0);
  const targetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const setOffsetTop = () => {
      if (targetRef.current) {
        const offsetTop = targetRef.current?.clientHeight;
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
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const pageY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      setScrollTop(pageY);
      const calcFooterY = docHeight - targetTop - winHeight - pageY;
      setFooterY(calcFooterY);
    }, 10);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTop, targetTop]);

  return (
    <div
      className={`block fixed bottom-0`} // md:hidden
    >
      {/* footer 기준 높이 추출용 */}
      <div ref={targetRef} className="w-[1px] sm:pb-17 md:pb-18 xl:pb-0 bg-red-700">
        <div className={`${align === 'left' ? 'h-[12rem]' : 'h-[15.7rem] md:h-[12rem] xl:h-[14.1875rem]'}`}></div>
      </div>

      <div>
        <div className={`
          ${cn('fixed mb-4 bottom-0 z-[10] transition-[background-color] duration-100',
            align === 'left' ?
            'left-4' :
            'right-4 ',
            // 'right-4 mb-[7rem] sm:mb-[7.5rem]',
            direction && (scrollDirection ? 'opacity-1' : 'opacity-0'),
            scrollTop ? 'block' : 'hidden',
            targetF ? (
              footerY <= 0 && 'mb-0' //mb-[4.5rem] sm:mb-[4rem]
            ) : undefined
          )}
        `}

          style={{ bottom: targetF && footerY <= 0 ? -footerY : undefined  }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
