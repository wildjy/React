'use client';
import React from 'react';
import { cn } from "../common/cn";

interface InfoBoxProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children, addClass }) => {
  const className = `mt-3 sm:mt-4 md:mt-5 py-5 sm:py-7 text-center border border-grayBlue-200 bg-white md:border-none md:bg-[#FAFBFD] rounded-lg`;

  return <div className={`${cn(className, addClass)}`}>{children}</div>;
};
