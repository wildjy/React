'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import throttle from 'lodash/throttle';

interface TongContextType {
  innerClass: string;
  top: boolean | undefined;
  gnb: boolean | undefined;
  sideNav: boolean | undefined;
  topBottom: boolean | undefined;
  isOpen: boolean | undefined;
  isNavOpen: boolean | undefined;
  isMobile: boolean | undefined;
  isDesktop: boolean | undefined;
  setIsOpen: (open: boolean) => void;
  setIsNavOpen: (open: boolean) => void;
}

export const TongContext = createContext<TongContextType | undefined>(undefined);
export const useSideNav = () => useContext(TongContext);

interface TongProviderProps {
  top?: boolean;
  gnb?: boolean;
  sideNav?: boolean;
  topBottom?: boolean;
  children: React.ReactNode;
}

export const TongProvider = ({ top, gnb, sideNav, topBottom, children }: TongProviderProps) => {
  const [isDesktop, setDesktop] = useState<boolean | undefined>(undefined);
  const [isMobile, setMobile] = useState<boolean | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const [isNavOpen, setIsNavOpen] = useState<boolean | undefined>(undefined);

  const innerClass = 'px-5 mx-auto w-full xl:px-0 xl:w-[80rem]'; // 1160 = 72.5rem, 1280 = 80rem

  useEffect(() => {
    const resizeEvent = throttle(() => {
      setDesktop(window.innerWidth < 1570); // 1160 = 1450,  1280 = 1570
      setMobile(window.innerWidth < 768); // 1160 = 1450,  1280 = 1570
    }, 10);

    resizeEvent();

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setDesktop, setMobile]);

  useEffect(() => {
    if (isMobile === false) {
      setIsOpen(false);
      setIsNavOpen(false);
    }
  }, [isMobile]);

  return (
    <TongContext.Provider
      value={{ innerClass, top, gnb, sideNav, topBottom, isDesktop, isMobile, isOpen, setIsOpen, isNavOpen, setIsNavOpen }}
    >
      {children}
    </TongContext.Provider>
  );
};

export const useTong = () => {
  const context = useContext(TongContext);
  if (!context) throw new Error('useSideNav must be used within a TongProvider');
  return context;
};
