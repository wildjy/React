'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongTopBottomProps {
  children?: React.ReactNode;
}

export const TongTopBottom: React.FC<TongTopBottomProps> = ({ children }) => {
  const { sideNav, isCheck } = useTong();
  return (
    <div className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''} bg-[#d9d9d9]`}>
      <div className={`${cn('mx-auto w-[72.5rem]', '')}`}>TongTopBottom</div>
    </div>
  );
};
