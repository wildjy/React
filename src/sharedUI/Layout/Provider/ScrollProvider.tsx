'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const ScrollProvider: React.FC<ScrollFixedProps> = ({ children, initTop = 0 }) => {
  const [isFixed, setIsFixed] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(false);
  const [threshold, setThreshold] = useState(initTop);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const savedScrollY = window.scrollY;
    setIsFixed(savedScrollY > threshold);
    setPrevScrollY(savedScrollY);

    const scrollEvent = throttle(() => {
      const currentScroll = window.scrollY;

      // fixed scroll
      setIsFixed(currentScroll > threshold);

      // direction scroll
      if (currentScroll > prevScrollY && currentScroll > 5) {
        // console.log('down');
        setScrollDirection(true);
      } else {
        // console.log('up');
        setScrollDirection(false);
      }
      setPrevScrollY(currentScroll);
    }, 50);

    window.addEventListener('scroll', scrollEvent, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [isFixed, prevScrollY, scrollDirection, threshold]);

  return <ScrollContext.Provider value={{ setThreshold, isFixed, scrollDirection }}>{children}</ScrollContext.Provider>;
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll error');
  }
  return context;
};
