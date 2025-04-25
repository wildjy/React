/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongGnbProps {
  children?: React.ReactNode;
}

export const TongGnb: React.FC<TongGnbProps> = ({ children }) => {
  const { sideNav, isCheck } = useTong();
  return (
    <nav className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''} py-5 border-b-[0.125rem] border-[#0a2b6e]`}>
      <div className={`${cn('mx-auto w-[72.5rem]', '')}`}>TongGnb{children}</div>
    </nav>
  );
};
