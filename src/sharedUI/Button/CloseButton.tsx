'use client';
import React, { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const CloseButtonVariants = cva(
  `block
  bg-center bg-no-repeat bg-[length:100%_100%]
  `,
  {
    variants: {
      type: {
        base: `bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg')]`,
        back: `bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg')]`,
      },
      size: {
        base: `w-[0.625rem] h-[0.625rem] sm:w-4 sm:h-4 md:w-[0.875rem] md:h-[0.875rem]`,
        sm: `w-[0.625rem] h-[0.625rem] sm:w-3 sm:h-3 md:w-[0.625rem] md:h-[0.625rem]`,
        md: `w-[1rem] h-[1rem] sm:w-6 sm:h-6 md:w-8 md:h-8`,
      },
    },
    defaultVariants: {
      type: 'base',
      size: 'base',
    },
  }
);

interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, VariantProps<typeof CloseButtonVariants> {
  addClass?: string;
  onClick?: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ type, size, addClass, onClick, ...props }) => {
  const className = CloseButtonVariants({
    type: type as 'base' | 'back' | undefined,
    size: size as 'base' | 'sm' | 'md' | undefined,
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`${cn(className, addClass)}`}
      {...props}
    >
      <span className="sr-only">닫기</span>
    </button>
  );
};

