"use client";
// import { useId } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'w-full peer leading-none border border-gray-200 focus:outline-none rounded-lg', // md:w-auto
  {
    variants: {
      size: {
        base: 'px-7 py-5',
        sm: `input-sm..
        px-2 h-[1.375rem] sm:h-[1.875rem] md:h-[2.5rem] lg:h-[2.375rem]
        text-2xs sm:text-s md:text-base lg:text-s rounded md:rounded-lg`,
        md: 'input-sm..',
        lg: 'input-lg..',
        full: 'input-full w-full',
      },
      mode: {
        base: 'focus:border-blue-700 focus:ring-blue-700',
        ghost: 'focus:border-blue-700 border-0 border-b rounded-none placeholder-transparent ',
        success: 'focus:border-success', // border-success
        warning: 'focus:border-warning', // focus:ring-1 focus:ring-warning px-3 xl:px-5 py-2 md:py-3
        error: 'focus:border-error', // focus:ring-1 focus:ring-error
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      size: 'base',
      mode: 'base',
      align: 'left',
    },
  }
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof InputVariants> {
  mode?: "base" | "ghost" | "success" | "warning" | "error";
  label?: string;
  addClass?: string;
  addId?: string;
  disabled?: boolean;
  readonly?: string;
  icon?: React.ReactElement;
}

export const TextInput : FC<InputProps> = ({
  size,
  mode = "base",
  align,
  icon,
  label,
  addClass,
  addId = "",
  onChange,
  disabled,
  readonly,
  ...props
}) => {
  const className = InputVariants({
    size: size as "base" | "sm" | "md" | "lg" | "full" | undefined,
    mode: mode as | "base" | "ghost" | "success" | "warning" | "error" | undefined,
    align: align as | "left" | "center" | "right" | undefined,
    // icon,
  });
  // const id = useId();

  const atType = ["ghost"].includes(mode);

  return (
    <div className="w-full relative">
      <input
        type="text"
        className={cn(className, addClass,
        {
          "border-gray-200": disabled,
          "focus:border-gray-500": readonly,
        })}
        onChange={onChange}
        id={addId}
        placeholder={label}
        disabled={!!disabled}
        readOnly={!!readonly}
        {...props}
      />
      <label htmlFor={addId} className={cn('sr-only', addClass,
        {
          "not-sr-only absolute text-sm text-gray-600 transition-all left-0 -top-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm" : atType
        })}>
        {icon && icon} {label}
      </label>
      { mode === "success" && (
        <span className="sr-only y_center
        peer-[:not(:placeholder-shown)]:not-sr-only
        peer-[:not(:placeholder-shown)]:absolute
        peer-[:not(:placeholder-shown)]:right-5
        "><img src="https://image.jinhak.com/jinhakImages/react/icon/icon_input_success.svg" className="w-[1.5rem] md:w-full" alt="" /></span>
      )}
      { mode === "error" && (
        <span className="sr-only y_center
        peer-[:not(:placeholder-shown)]:not-sr-only
        peer-[:not(:placeholder-shown)]:absolute
        peer-[:not(:placeholder-shown)]:right-5
        "><img src="https://image.jinhak.com/jinhakImages/react/icon/icon_input_error.svg" className="w-[1.5rem] md:w-full" alt="" /></span>
      )}
    </div>
  );
};
