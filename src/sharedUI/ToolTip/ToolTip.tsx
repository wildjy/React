'use client';
import { cva, VariantProps } from 'class-variance-authority';
import React, { createContext, useContext, useState } from 'react';
import { CloseButton } from '../Button/CloseButton';
import { cn } from "../common/cn";

const ToolTipVariants = cva(
  `
  fixed md:absolute left-[50%] transform -translate-x-1/2 md:left-0 md:translate-x-0 z-10
  p-6  min-w-[300px] max-w-[80dvw] w-max max-h-[90dvh] md:max-w-[300px]
  bg-white border border-gray-100 rounded-lg
  transition-all duration-300
  `,
  {
    variants: {
      type: {
        base: ``,
      },
    },
    defaultVariants: {
      type: 'base',
    },
  }
);

const ToolTipButton = cva(
  `
  block
  text-transparent
  w-[0.875rem] h-[0.875rem]
  sm:w-[1.125rem] sm:h-[1.125rem]
  bg-center bg-no-repeat bg-[length:100%_100%]

  `,
  {
    variants: {
      icon: {
        base: `bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg")]`,
      },
    },
    defaultVariants: {
      icon: 'base',
    },
  }
);

interface ToolTipProps extends VariantProps<typeof ToolTipButton>, VariantProps<typeof ToolTipVariants> {
  children?: React.ReactNode;
  isOpen?: boolean;
  addClass?: string;
  onClick?: () => void;
}

export const ToolTip: React.FC<ToolTipProps> = ({ icon, type, isOpen, onClick, children, addClass }) => {
  const classButton = ToolTipButton({
    icon: icon as 'base' | undefined,
  });

  const className = ToolTipVariants({
    type: type as 'base' | undefined,
  });

  return (
    <div className="relative">
      <button className={`${cn(classButton, '')}`} onClick={onClick}>
        <span className="sr-only">tooltip 버튼</span>
      </button>
      <div
        className={`${cn(className, addClass)}
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
      >
        <div className="flex justify-end">
          <CloseButton onClick={onClick} />
        </div>
        {children}
      </div>
    </div>
  );
};
