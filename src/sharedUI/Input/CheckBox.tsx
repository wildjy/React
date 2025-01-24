"use client";
// import { useId } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva('relative leading-none after:content-[""] bg-white transition-all after:transition-all ', {
  variants: {
    // default size control
    size: {
      sm: `w-5 h-5 after:h-5 after:w-5
      sm:w-6 sm:h-6 sm:after:h-6 sm:after:w-6
      md:w-[1.625rem] md:h-[1.625rem] md:after:h-[1.625rem] md:after:w-[1.625rem]
      lg:w-[1.375rem] lg:h-[1.375rem] lg:after:h-[1.375rem] lg:after:w-[1.375rem]`,
      md: 'w-[1.75rem] h-[1.75rem] after:h-[1.75rem] after:w-[1.75rem]',
      lg: 'w-[2rem] h-[2rem] after:h-[2rem] after:w-[2rem]',
      auto: '',
    },
    mode: {
      base: `border after_center
          after:bg-center
          after:bg-no-repeat
          after:bg-[length:60%_60%]
          peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked.svg')]
        `,
      text: `px-5 py-3
          after:content-none
          mr-0 w-auto h-auto
          after:w-auto
          after:h-auto
        `,
      rectangle: `px-5 py-3
          border
          border-gray-200
          mr-0 w-auto h-auto
          after:w-auto
          after:h-auto
          after:content-none
        `,
      icon: `pl-9 pr-5 py-3
          border
          bg-[length:17%]
          bg-[10%_center]
          bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_input_success.svg')]
          mr-0 w-auto h-auto
          after:w-auto
          after:h-auto
          after:content-none
          peer-checked:bg-[length:17%]
          peer-checked:bg-[10%_center]
          peer-checked:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_input_error.svg')] bg-no-repeat
        `,
    },
    color: {
      base: 'border-gray-200 peer-checked:text-blue-700 peer-checked:after:bg-blue-700 peer-checked:border-blue-700',
      fill: 'text-gray-500 border-transparent bg-gray-50 peer-checked:text-gray-700 peer-checked:border-gray-700 peer-checked:bg-white',
      blue: '',
      lineCheck: "border-gray-700 peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg')]",
    },
    round: {
      base: 'rounded after:rounded ',
      none: 'rounded-none after:rounded-none',
      md: 'rounded-md after:rounded-md',
      lg: 'rounded-lg after:rounded-lg',
      full: 'rounded-full after:rounded-full',
    },
  },
  defaultVariants: {
    size: 'md',
    mode: 'base',
    color: 'base',
    round: 'base',
  },
});
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof InputVariants> {
  size?: "sm" | "md" | "lg" | "auto";
  mode?: "base" | "text" | "rectangle" | "icon";
  color?: "base" | "fill" | "blue" | "lineCheck";
  round?: "base" | "none" | "md" | "lg" | "full";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  disabled?: boolean;
  icon?: React.ReactElement;
}

export const CheckBox: FC<InputProps> = ({
  size,
  mode = "base",
  color,
  round,
  name,
  label,
  addClass,
  value = "",
  disabled,
  onChange,
  ...props
}) => {
  // const id = useId();

  const className = InputVariants({
    size: size as "sm" | "md" | "lg" | "auto" | undefined,
    mode: mode as "base" | "text" | "rectangle" | "icon" | undefined,
    color: color as "base" | "fill" | "blue" | "lineCheck" | undefined,
    round: round as "base" | "none" | "md" | "lg" | "full" | undefined,
  });

  const atType = ["rectangle", "text", "icon"].includes(mode);
  const atIcon = ["icon"].includes(mode);
  const atText = ["text"].includes(mode);

  return (
    <label
      htmlFor={value}
      className={cn('relative flex items-center cursor-pointer', addClass, {"cursor-default" : disabled })}
    >
      <input
        type="checkbox"
        name={name}
        id={value}
        value={value}
        className="sr-only peer"
        disabled={!!disabled}
        onChange={onChange}
        placeholder={label}
        {...props}
      />
      <div className={cn(className, addClass,
        { // disabled setting
          "text-disabled-text bg-disabled-bg border-disabled-line peer-checked:border-disabled-line after:bg-gray-300 peer-checked:after:bg-gray-300 cursor-default" : disabled ,
          "opacity-75 bg-[10%_center] peer-checked:bg-[10%_center] ": disabled && atIcon,
          "bg-transparent": disabled && atText,
          "mr-0": label,
        }
      )}>
      {atType && label}
      </div>
      { label && !atType  && (
        <span className={cn('ml-3 text-gray-900 ', addClass, {"text-gray-500" : disabled })}>{label}</span>
      )}
    </label>
  );
};