'use client';
import React, { useState, ButtonHTMLAttributes } from 'react';
import { cn } from "../common/cn";

import { cva, VariantProps } from 'class-variance-authority';

type ChipType = 'thema' | 'filter';
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

export const Chip: React.FC<ChiProps> = ({ type, title, isActive, onClick, addClass }) => {
  const className = ChipVariants({
    type: type as ChipType | undefined,
  });

  const thema = type === 'thema';
  const filter = type === 'filter';

  return (
    <button
      onClick={onClick}
      className={`${cn(className, addClass, {
        'themaActive.. text-blue-800 border-blue-800 bg-white': isActive,
      })}
      `}
    >
      {title}
    </button>
  );
};
