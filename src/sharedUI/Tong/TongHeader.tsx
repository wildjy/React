/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongHeaderProps {
  children?: React.ReactNode;
}

export const TongHeader: React.FC<TongHeaderProps> = ({ children }) => {
  const { sideNav, isCheck } = useTong();
  return (
    <header className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''}  py-10 bg-[#f4f5f9] border-b-[0.125rem] border-[#e5e7e9]`}>
      <div className={`${cn('mx-auto w-[72.5rem]', '')}`}>TongHeader</div>
    </header>
  );
};
