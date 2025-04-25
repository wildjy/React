'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import throttle from 'lodash/throttle';

interface TongContextType {
  sideNav: boolean;
  isCheck: boolean;
}

export const TongContext = createContext<TongContextType | undefined>(undefined);
export const useSideNav = () => useContext(TongContext);

interface TongProviderProps {
  sideNav: boolean;
  children: React.ReactNode;
}

export const TongProvider = ({ sideNav, children }: TongProviderProps) => {
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const resizeEvent = throttle(() => {
      setIsCheck(window.innerWidth < 1456);
    }, 50);

    resizeEvent();

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, [setIsCheck]);

  return <TongContext.Provider value={{ sideNav, isCheck }}>{children}</TongContext.Provider>;
};

export const useTong = () => {
  const context = useContext(TongContext);
  if (!context) throw new Error('useSideNav must be used within a TongProvider');
  return context;
};
