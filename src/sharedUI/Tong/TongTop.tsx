'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongTopProps {
  children?: React.ReactNode;
}

export const TongTop: React.FC<TongTopProps> = ({ children }) => {
  const { innerClass, sideNav, isDesktop } = useTong();
  return (
    <div className={`3xl:px-[17.375rem]`}>
      <div className={`${cn([`${innerClass} py-3 md:py-4 flex justify-between items-center`], '')}`}>
        <h2 className="flex items-center text-sm md:text-base gap-x-2">
          <img src="https://image.jinhak.com/jinhakImages/tong/pi_logo_tmp.jpg" alt="대성학원" className="w-[4.375rem] md:w-auto" />
          <span className="hidden md:block">학생관리프로그램</span>
        </h2>

        <p className="mt-auto text-blue-800 text-2xs sm:text-xs md:text-base">
          <b>선생님! 방문해 주셔서 감사합니다.</b>
        </p>
      </div>
    </div>
  );
};

