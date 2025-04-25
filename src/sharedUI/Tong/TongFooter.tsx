'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongFooterProps {
  children?: React.ReactNode;
}

export const TongFooter: React.FC<TongFooterProps> = ({ children }) => {
  const { innerClass, sideNav, isCheck } = useTong();
  return (
    <footer className={`${sideNav && !isCheck ? 'px-[17.375rem]' : ''} border-t border-gray-200 bg-white relative z-[1]`}>
      <div className={`${cn([`${innerClass} footer class`], '')}`}>TongFooter{children}</div>
    </footer>
  );
};
