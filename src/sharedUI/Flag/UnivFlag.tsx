
"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface UnivFlagProps {
  tag?: keyof JSX.IntrinsicElements;
  addClass?: string;
  label?: string;
  type?: string;
}

export const UnivFlag: React.FC<UnivFlagProps> = ({ tag: Flag = 'span', type, label, addClass }) => {
  const flagItems = [
    {
      flagType: type === 'default',
      textColor: 'text-gray-700',
      textBg: 'border-gray-200 bg-white',
    },
    {
      flagType: type === 'flag1',
      textColor: 'text-white',
      textBg: 'border-[#8393D6] bg-[#8393D6]',
    },
    {
      flagType: type === 'flag2',
      textColor: 'text-white',
      textBg: 'border-[#54AEC8] bg-[#54AEC8]',
    },
    {
      flagType: type === 'flag3',
      textColor: 'text-white',
      textBg: 'border-[#99CC33] bg-[#99CC33]',
    },
    {
      flagType: type === 'flag4',
      textColor: 'text-white',
      textBg: 'border-[#B2B1B1] bg-[#B2B1B1]',
    },
    {
      flagType: type === 'flag5',
      textColor: 'text-white',
      textBg: 'border-[#7D7D7D] bg-[#7D7D7D]',
    },
  ];

  const className = `flex items-center justify-center
  w-15 h-6 sm:h-[1.625rem] md:w-[4.125rem] md:h-9
  text-3xs sm:text-sm leading-none
  text-center
  border
  rounded
  md:rounded-md`;

  return (
    <>
      {flagItems.map(
        (flag, index) =>
          flag.flagType && (
            <Flag key={index} className={` ${flag.textColor} ${flag.textBg} ${cn(className, addClass)}`}>
              {label}
            </Flag>
          )
      )}
    </>
  );
};
