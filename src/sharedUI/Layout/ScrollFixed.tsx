'use client';
import React from 'react';
import { useScroll } from './Provider/ScrollProvider';
import { cn } from "../common/cn";

interface ScrollFixedProps {
  fixHeight?: string;
  top?: string;
  children?: React.ReactNode;
  addClass?: string;
  addStyle?: React.CSSProperties;
}

export const ScrollFixed: React.FC<ScrollFixedProps> = ({ fixHeight, top, children, addClass, addStyle }) => {
  const { isFixed } = useScroll();

  return (
    <div className={`${fixHeight} ${cn('scrollfixed..  ', addClass)}`} style={addStyle}>
      <div className={`${isFixed ? 'fixed' : ''} ${top} left-0 right-0`}>{children}</div>
    </div>
  );
};
