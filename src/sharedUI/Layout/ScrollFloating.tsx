'use client';
import React, { useEffect, useState } from 'react';
import { useScroll } from './Provider/ScrollProvider';
import { cn } from "../common/cn";

interface ScrollFloatingProps {
  children?: React.ReactNode;
  addClass?: string;
  h: number;
}

export const ScrollFloating: React.FC<ScrollFloatingProps> = ({ children, addClass, h }) => {
  const { scrollDirection } = useScroll();
  console.log(h)
  const [footerY, setFooterY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const pageY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      const calcFooterY = docHeight - h - winHeight - pageY;
      setFooterY(calcFooterY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [h]);

  return (
    <div
      className={`fixed bottom-0 w-full transition-[bottom] border-t inset-shadow-2xs`} //duration-300 ease-linear
    >
      <div className={`
      ${cn('',
        scrollDirection ? 'opacity-1 visible' : '',
        footerY <= 0 ? 'mb-4' : 'mb-14'
      )}
        fixed right-4 bottom-0 z-[10] duration-100
        `} //${scrollDirection ? 'opacity-1 visible' : 'opacity-0 invisible'}
        style={{ bottom: footerY <= 0 ? -footerY : undefined  }}
      >
        <button className='w-10 h-10 rounded-full bg-black'>{footerY}</button>
      </div>
    </div>
  );
};
