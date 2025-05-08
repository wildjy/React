
'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { SwiperGnb } from './SwiperGnb';
import { cn } from "../common/cn";

interface TongGnbProps {
  children?: React.ReactNode;
}

export const TongGnb: React.FC<TongGnbProps> = ({ children }) => {
  const { innerClass, sideNav, isDesktop } = useTong();

  return (
    // <nav className={`${sideNav && !isDesktop ? 'px-[17.375rem]' : ''} py-5 border-b-[0.125rem] border-[#0a2b6e]`}>
    <nav className={`3xl:px-[17.375rem] py-3 md:py-4 border-b-[0.125rem] border-[#0a2b6e]`}>
      <div className={`${cn([`${innerClass}`], 'px-0 md:px-5')}`}>
        <SwiperGnb />
      </div>
    </nav>
  );
};
