'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

const ScrollContext = createContext({ isFixed: false });

interface ScrollFixedProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const ScrollProvidar: React.FC<ScrollFixedProps> = ({ children, addClass }) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let previousScrollY = 0;
    const scrollEvent = throttle(() => {
      const scrollY = window.scrollY;
      if ((scrollY > 0 && !isFixed) || (scrollY === 0 && isFixed)) {
        setIsFixed(scrollY > 0);
      }
      previousScrollY = scrollY;
      console.log(scrollY);
    }, 30);

    window.addEventListener('scroll', scrollEvent, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, []);

  return <ScrollContext.Provider value={{ isFixed }}>{children}</ScrollContext.Provider>;
};

export const useScroll = () => useContext(ScrollContext);
