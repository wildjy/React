'use client';
import React from 'react';
import { useScroll } from './Provider/ScrollProvider';
import { cn } from "../common/cn";

interface ScrollFixedProps {
  children?: React.ReactNode;
  addClass?: string;
  fixHeight?: string;
}

export const ScrollFixed: React.FC<ScrollFixedProps> = ({ children, addClass, fixHeight }) => {
  const { isFixed } = useScroll();

  return (
    <div className={`${fixHeight} ${cn('bg-gray-300 scrollfixed..  ', addClass)}`}>
      <div className={`${isFixed ? 'fixed' : ''}  top-0 left-0 right-0 bg-white border-b`}>{children}</div>
    </div>
  );
};
