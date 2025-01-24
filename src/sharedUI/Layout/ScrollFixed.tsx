/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import React from 'react';
import { useScroll } from './Providar/ScrollProvidar';
import { cn } from "../common/cn";

interface ScrollFixedProps {
  children?: React.ReactNode;
  addClass?: string;
  h?: string;
}

export const ScrollFixed: React.FC<ScrollFixedProps> = ({ children, addClass, h }) => {
  const { isFixed } = useScroll();
  console.log(isFixed);
  return (
    <div className={`mb-2 ${h} ${cn('scrollfixed..  ', addClass)}`}>
      <div className={`${isFixed ? 'fixed left-0 right-0' : ''}`}>{children}</div>
    </div>
  );
};
