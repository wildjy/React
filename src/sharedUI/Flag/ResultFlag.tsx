'use client';
import React, { HTMLAttributes, JSX } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";
import { code, CommonCodeKeys } from '../common/common-code-definitions';

const ResultFlagVariants = cva(`
  leading-none text-center
  rounded md:rounded-md`, {
  variants: {
    mode: {
      default: `flex items-center justify-center w-14 h-[1.3125rem] sm:h-7 md:w-[5.3125rem] md:h-[2rem] text-3xs sm:text-sm border`,
      badge: 'inline-block w-5 h-5 md:w-6 md:h-6 text-3xs sm:text-2xs md:text-sm font-light overflow-hidden',
    },
    type: {
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_SUPPLEMENT_OR_FAIL')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_FAIL')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'NOT_AVAILABLE')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'ANALYZING')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'IN_PROGRESS')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'ETC')]:
        'border-gray-400 bg-white text-gray-700',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_UNDER_ENROLLED')]:
        'border-[#496FDD] bg-white text-[#496FDD]',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_FIRST')]:
        'border-[#496FDD] bg-white text-[#496FDD]',
      [code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_SUPPLEMENT')]:
        'border-[#84AD54] bg-white text-[#84AD54]',
    },
  },

  defaultVariants: {
    mode: 'default',
    type: code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_SUPPLEMENT_OR_FAIL'),
  },

  compoundVariants: [
    {
      mode: 'badge',
      type: code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_FAIL'),
      className: 'bg-[#B3B3B3] text-white leading-[1.25rem] lg:leading-[1.5rem]',
    },
    {
      mode: 'badge',
      type: code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_FIRST'),
      className: 'bg-[#819CE8] text-white leading-[1.25rem] lg:leading-[1.5rem]',
    },
    {
      mode: 'badge',
      type: code('REGULAR_PASS_SCORE_RANGE_CODES', 'PASS_SUPPLEMENT'),
      className: 'bg-[#A0C07B] text-white leading-[1.25rem] lg:leading-[1.5rem]',
    },
  ],
});

const typeColors: Record<CommonCodeKeys['REGULAR_PASS_SCORE_RANGE_CODES'], string> = {
  PASS_FAIL: "text-gray-400",
  PASS_FIRST: "text-[#496FDD]",
  PASS_SUPL: "text-[#84AD54]",
};

interface ResultFlagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof ResultFlagVariants> {
  tag?: keyof JSX.IntrinsicElements;
  addClass?: string;
  label?: string;
  summary?: boolean;
  type?: CommonCodeKeys['REGULAR_PASS_SCORE_RANGE_CODES'];
}

export const ResultFlag: React.FC<ResultFlagProps> = ({
  tag: Flag = 'span',
  type,
  mode,
  label,
  summary,
  addClass,
}) => {
  const className = ResultFlagVariants({
    mode: mode as 'default' | undefined,
    type: type as CommonCodeKeys['REGULAR_PASS_SCORE_RANGE_CODES'],
  });

  const summaryColor = type ? typeColors[type] : "";

  return (
    summary ? (
      <span className={`${summary ? 'flex items-center gap-x-1 md:gap-x-2' : ''}`}>
        <Flag className={`${cn(className, addClass)}`}>{mode === 'badge' ? label?.charAt(0): label}</Flag>
        <span className={`text-3xs sm:text-2xs md:text-sm ${cn(summaryColor)}`}>{label}</span>
      </span>
    ) : (
      <Flag className={`${cn(className, addClass)}`}>{mode === 'badge' ? label?.charAt(0): label}</Flag>
    )
  )
};
