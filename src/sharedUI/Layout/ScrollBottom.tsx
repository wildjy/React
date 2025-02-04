'use client';
import React from 'react';
import { useScroll } from './Provider/ScrollProvider';
import { cn } from "../common/cn";

interface ScrollBottomProps {
  children?: React.ReactNode;
  addClass?: string;
  h?: string;
}

export const ScrollBottom: React.FC<ScrollBottomProps> = ({ children, addClass, h }) => {
  const { scrollDirection } = useScroll();
  return (
    <div
      className={`${
        scrollDirection ? '-bottom-[100px] bg-gray-200' : 'bottom-0 bg-white'
      } fixed w-full transition-[bottom] duration-300 ease-linear border-t inset-shadow-2xs`}
    >
      <div>{children}</div>
    </div>
  );
};
