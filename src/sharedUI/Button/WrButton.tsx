'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { cn } from '../common/cn';
import { cva } from 'class-variance-authority';

/**
 * Withremit 디자인 시스템 버튼 변형
 *
 * 색상 변경 시 이 파일의 각 variant 클래스만 수정하면 됩니다.
 * disabled: 모디파이어로 비활성 색상을 처리합니다.
 * confirm / warning disabled 는 배경색에 /20 투명도를 적용합니다.
 */

const WrButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold border transition-colors duration-150 select-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: [
          'bg-[#00a0dc] text-white border-transparent',
          'hover:bg-[#3f87b9]',
          'disabled:bg-[#c8d5da]',
        ],
        secondary: [
          'bg-white text-[#4a5c64] border-[#e3e8ea]',
          'hover:bg-[#f5f8fc] hover:border-[#a4b7c0]',
          'disabled:bg-[#f5f8fc] disabled:text-[#c8d5da] disabled:border-[#e3e8ea]',
        ],
        utility: [
          'bg-[#7a8e96] text-white border-transparent',
          'hover:bg-[#4a5c64]',
          'disabled:bg-[#c8d5da]',
        ],
        confirm: [
          'bg-[#1b5e9e] text-white border-transparent',
          'hover:bg-[#264a78]',
          'disabled:bg-[#1b5e9e]/20',
        ],
        warning: [
          'bg-[#f59e0b] text-white border-transparent',
          'hover:bg-[#d97706]',
          'disabled:bg-[#f59e0b]/20',
        ],
        delete: [
          'bg-white text-[#ef4444] border-[#ef4444]',
          'hover:bg-[#fbeded]',
          'disabled:bg-[#f5f8fc] disabled:text-[#c8d5da] disabled:border-[#e3e8ea]',
        ],
        text: [
          'bg-transparent text-[#1b5e9e] border-transparent',
          'hover:text-[#00a0dc]',
          'disabled:text-[#c8d5da]',
        ],
      },

      size: {
        lg:   'h-12 px-5 text-base rounded-lg',
        md:   'h-10 px-4 text-sm  rounded-lg',
        sm:   'h-8  px-3 text-sm  rounded',
        text: 'h-auto px-0 text-sm',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface WrButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    VariantProps<typeof WrButtonVariants> {
  type?: 'button' | 'submit';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const WrButton: React.FC<WrButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  startIcon,
  endIcon,
  children,
  className,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={cn(WrButtonVariants({ variant, size }), className)}
    {...props}
  >
    {startIcon && <span className="inline-flex shrink-0">{startIcon}</span>}
    {children}
    {endIcon && <span className="inline-flex shrink-0">{endIcon}</span>}
  </button>
);
