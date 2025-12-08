'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

interface ScrollContextType {
  isFixed: boolean;
  scrollDirection: boolean;
  setThreshold: (value: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollFixedProps {
  children?: React.ReactNode;
  initTop?: number;
}

export const ScrollProvider: React.FC<ScrollFixedProps> = ({
  children,
  initTop = 0,
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(false);
  const [threshold, setThreshold] = useState(initTop);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const prevScrollYRef = useRef(0);

  useEffect(() => {
    const savedScrollY = window.scrollY;
    setIsFixed(savedScrollY > threshold);
    setPrevScrollY(savedScrollY);

    const scrollEvent = throttle(() => {
      const currentScroll = window.scrollY;

      // fixed scroll
      setIsFixed(currentScroll > threshold);

      // direction scroll
      if (currentScroll > prevScrollYRef.current && currentScroll > 5) {
        // console.log('down');
        setScrollDirection(true);
      } else {
        // console.log('up');
        setScrollDirection(false);
      }
      prevScrollYRef.current = currentScroll;
    }, 50);

    window.addEventListener('scroll', scrollEvent, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [threshold]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setThreshold(200);
      else if (window.innerWidth >= 768) setThreshold(100);
      else setThreshold(50);

      setIsFixed(false);
      prevScrollYRef.current = window.scrollY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScrollContext.Provider value={{ setThreshold, isFixed, scrollDirection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll error');
  }
  return context;
};