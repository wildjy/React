"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface TitleProps {
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  addClass?: string;
  setColor?: string;
  title?: string;
  sub?: string;
  align?: string;
}

export const SubTitle: React.FC<TitleProps> = ({ tag: Tag = 'p', children, setColor = 'text-gray-400', align = 'left', addClass }) => {
  return (
    <Tag
      className={`${cn(`mt-3 text-2xs sm:text-sm md:text-base lg:text-sm ${setColor}`, addClass, {
        'text-left': align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
      })}`}
    >
      {children}
    </Tag>
  );
};
