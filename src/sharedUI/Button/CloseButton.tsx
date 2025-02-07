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
      },
      size: {
        base: `w-3 h-3 sm:w-4 sm:h-4`,
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
    type: type as 'base' | undefined,
    size: size as 'base' | undefined,
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
