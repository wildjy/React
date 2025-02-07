'use client';
import React, { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const ToggleButtonVariants = cva(
  `
  after:block after:relative after:transform after:transition-all after:duration-350
  after:content-[""] after:bg-center after:bg-no-repeat
  `,
  {
    variants: {
      type: {
        base: `after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg')]`,
      },
      size: {
        base: `w-7 h-7 md:w-9 md:h-9 after:w-full after:h-full after:bg-[length:60%_35%]`,
      },
    },
    defaultVariants: {
      type: 'base',
      size: 'base',
    },
  }
);

interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, VariantProps<typeof ToggleButtonVariants> {
  addClass?: string;
  active?: boolean;
  onClick?: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ type, size, addClass, active, onClick, ...props }) => {
  const className = ToggleButtonVariants({
    type: type as 'base' | undefined,
    size: size as 'base' | undefined,
  });

  return (
    <button
      type="button"
      className={`${cn(className, addClass)}
      ${active ? `after:-rotate-0` : `after:-rotate-180`}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      {...props}
    >
      <span className="sr-only">열고 닫기 버튼</span>
    </button>
  );
};
