'use client';
import React, { ButtonHTMLAttributes } from 'react';
import { cn } from "../common/cn";

import { cva, VariantProps } from 'class-variance-authority';

export type ChipType = 'thema' | 'filter' | 'private';
const ChipVariants = cva(
  `
  px-4 py-[0.375rem]
  text-2xs sm:text-sm md:text-base
  border
  `,
  {
    variants: {
      type: {
        thema: `thema.. text-gray-400 border-[#f7f7f7] bg-[#f7f7f7] rounded-full`,
        filter: `filter.. text-gray-400 border-gray-200 bg-white rounded-lg`,
        private: `private.. flex items-center text-gray-400 border-gray-200 bg-white rounded-full
        after:ml-3
        after:opacity-60
        after:w-[0.6875rem] after:h-[0.375rem] after:bg-[length:100%]
        after:content-[""] after:bg-center after:bg-no-repeat
        after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg')]
        `,
      },
    },
  }
);

interface ChiProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, VariantProps<typeof ChipVariants> {
  type?: ChipType;
  isActive: boolean;
  title?: string;
  addClass?: string;
  onClick: () => void;
}

export const Chip: React.FC<ChiProps> = ({ type = 'filter', title, isActive, onClick, addClass, ...props }) => {
  const className = ChipVariants({
    type: type as ChipType | undefined,
  });

  const atPrivate = ['private'].includes(type);

  return (
    <button
      onClick={onClick}
      className={`${cn(
        className,
        addClass,
        isActive && 'themaActive.. text-blue-800 border-blue-800 bg-white',
        isActive &&
          atPrivate &&
          `
          text-blue-800 border-blue-800 bg-white after:opacity-100
            after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_toggle_blue.svg')]
          `
      )}
      `}
      {...props}
    >
      {title}
    </button>
  );
};