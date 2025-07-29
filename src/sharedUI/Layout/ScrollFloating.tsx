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
  const [ scrollBottom, setScrollBottom ] = useState(0);
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
      const calcBottomY = docHeight - winHeight - pageY;
      const calcFooterY = docHeight - targetTop - winHeight - pageY;

      setScrollTop(pageY);
      setScrollBottom(calcBottomY);
      setFooterY(calcFooterY);
    }, 10);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTop, scrollBottom, targetTop]);

  // style
  const displayClass = (() => {
    if(!scrollTop && !direction) return 'block';
    if(scrollDirection) {
      return scrollBottom === 0 ? 'block' : 'hidden';
    }
    return 'block';
  })();

  const marginBottom = (() => {
    if(targetF) {
      if(footerY <= 0) return 'mb-[4.5rem] sm:mb-[4rem]'; // mb-[4.5rem] sm:mb-[4rem]
      return 'mb-[7rem] sm:mb-[7.5rem]'; // mb-[7rem] sm:mb-[7.5rem]
    }
    return 'b-[4rem] sm:mb-[4.5rem]'; // mb-[7rem]
  })();

  const alignClass = (() => {
    if(align === 'left') {
      return 'left-4 mb-[4rem] sm:mb-[4.5rem]';
    }
    return 'right-4';
  })();

  return (
    <div
      className={`block md:hidden fixed bottom-0 z-[10]`}
    >
      {/* footer 기준 높이 추출용 */}
      <div ref={targetRef} className="sm:pb-17 md:pb-18 xl:pb-0">
        <div className={`${align === 'left' ? 'h-[12rem]' : 'h-[15rem]'}`}></div>
      </div>

      <div>
        <div className={`
          ${cn('fixed mb-4 bottom-0 transition-[background-color] duration-100',
            displayClass, marginBottom, alignClass,
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