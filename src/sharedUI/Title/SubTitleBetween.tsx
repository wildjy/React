'use client';
import React from 'react';
import { cn } from "../common/cn";

interface TitleProps {
  mode?: string;
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  addClass?: string;
  title?: string;
  sub?: string;
  mainColor?: string;
  subColor?: string;
}

export const SubTitleBetween: React.FC<TitleProps> = ({
  mode,
  tag: Tag = 'p',
  title = '',
  sub = '',
  mainColor = '',
  subColor = '',
  addClass,
}) => {
  return (
    <Tag className={`${cn(`flex flex-wrap items-end justify-between`, addClass)}`}>
      <b className={`text-md sm:text-lg md:text-xl ${mainColor}`}>{title}</b>

      <span className={`${mode === 'type1' && 'mt-3 w-full sm:mt-0 sm:w-auto'} text-2xs sm:text-s md:text-base ${subColor}`}>{sub}</span>
    </Tag>
  );
};
