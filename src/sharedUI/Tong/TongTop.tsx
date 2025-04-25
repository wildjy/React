'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongTopProps {
  children?: React.ReactNode;
}

export const TongTop: React.FC<TongTopProps> = ({ children }) => {
  const { sideNav, isCheck } = useTong();
  return (
    <div className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''}`}>
      <div className={`${cn('py-5 mx-auto w-[72.5rem]', '')}`}>TongTop{children}</div>
    </div>
  );
};
