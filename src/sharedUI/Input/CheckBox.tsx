"use client";
// import { useId } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ChangeEvent, FC, InputHTMLAttributes } from 'react';

type modeType = 'base' | 'text' | 'rectangle' | 'icon' | 'toggle';

const InputVariants = cva(
  `relative leading-none after:content-[""] bg-white transition-all after:transition-all
  peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2
  `,
  {
    variants: {
      // default size control
      size: {
        sm: `w-4 h-4 after:h-4 after:w-4
        sm:w-5 sm:h-5 sm:after:h-5 sm:after:w-5
        md:w-[1.625rem] md:h-[1.625rem] md:after:h-[1.625rem] md:after:w-[1.625rem]
        lg:w-[1.375rem] lg:h-[1.375rem] lg:after:h-[1.375rem] lg:after:w-[1.375rem]`,
        md: 'w-[1.75rem] h-[1.75rem] after:h-[1.75rem] after:w-[1.75rem]',
        lg: 'w-[2rem] h-[2rem] after:h-[2rem] after:w-[2rem]',
        auto: '',
      },
      mode: {
        base: `border
          after:absolute
          after:top-[50%]
          after:left-[50%]
          after:transform
          after:-translate-x-1/2
          after:-translate-y-1/2
          after:bg-center
          after:bg-no-repeat
          after:bg-[length:60%_60%]
          peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked.svg')]
        `,
        text: `
          after:content-none
          mr-0 w-auto h-auto
          after:w-auto
          after:h-auto
        `,
        rectangle: `px-3 py-[0.375rem]
          text-2xs sm:text-sm md:text-base
          border
          border-gray-200
          mr-0 w-auto h-auto
          after:w-auto
          after:h-auto
          after:content-none
        `,
        icon: `pl-8 pr-4 py-2
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
        toggle: `
          absolute top-1/2 -translate-y-1/2
          w-4 h-4 md:w-5 md:h-5
          !rounded-full !after:rounded-full
        `,
      },
      color: {
        base: 'border-gray-200 peer-checked:text-blue-700 peer-checked:after:bg-blue-800 peer-checked:border-blue-800',
        fill: 'text-gray-400 border-transparent bg-gray-50 peer-checked:text-blue-800 peer-checked:border-blue-800 peer-checked:bg-white',
        switch: `
          bg-white
          translate-x-[0.15rem]
          md:translate-x-[0.15rem]
          transform transition-transform
          peer-checked:translate-x-[1.32rem]
          md:peer-checked:translate-x-[1.8rem]
        `,
        lineCheck:
          "border-gray-700 peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg')]",
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
  }
);

interface InputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'size' | 'color' | 'round'
    >,
    VariantProps<typeof InputVariants> {
  mode?: modeType;
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  disabled?: boolean;
  icon?: React.ReactElement;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CheckBox: FC<InputProps> = ({
  size,
  mode = 'base',
  color,
  round,
  name,
  label,
  addClass,
  value = '',
  disabled,
  onChange,
  ...props
}) => {
  // const id = useId();

  const className = InputVariants({
    size: size as 'sm' | 'md' | 'lg' | 'auto' | undefined,
    mode: mode as modeType | undefined,
    color: color as 'base' | 'fill' | 'switch' | 'lineCheck' | undefined,
    round: round as 'base' | 'none' | 'md' | 'lg' | 'full' | undefined,
  });

  const atType = ['rectangle', 'text', 'icon'].includes(mode);
  const atIcon = ['icon'].includes(mode);
  const atText = ['text'].includes(mode);
  const atToggle = ['toggle'].includes(mode);

  return (
    <label
      // htmlFor={value}
      className={cn(
        `peer relative inline-flex items-center cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`,
        addClass,
        {
          'cursor-default': disabled,
          // 'w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-800': atToggle,
        }
      )}
    >
      <input
        type="checkbox"
        name={name}
        // id={value}
        value={value}
        className="sr-only peer"
        disabled={!!disabled}
        onChange={onChange}
        placeholder={label}
        role="switch"
        aria-disabled={disabled}
        aria-label={label}
        {...props}
      />
      {atToggle && (
        <div
          className={`${cn(
            [
              `after:content-["OFF"]
              peer-checked:px-[0.5rem]
              peer-checked:after:content-["ON"]
              peer-checked:justify-start
              peer-checked:bg-blue-800
              flex justify-end items-center px-[0.4rem]
              w-10 h-5 md:w-13 md:h-6 text-3xs leading-none
              text-white bg-gray-200 rounded-full
              transition-all duration-300`,
            ],
            {
              'cursor-not-allowed': disabled && atToggle,
            }
          )}`}
        ></div>
      )}
      <div
        className={cn(className, addClass, {
          // disabled setting
          'text-disabled-text bg-disabled-bg border-disabled-line peer-checked:border-disabled-line after:bg-gray-300 peer-checked:after:bg-gray-300 cursor-not-allowed':
            disabled,
          'opacity-75 bg-[10%_center] peer-checked:bg-[10%_center] ':
            disabled && atIcon,
          'bg-transparent': disabled && atText,
          'bg-gray-50': disabled && atToggle,
          'mr-0': label,
        })}
      >
        {atType && label}
      </div>
      {label && !atType && (
        <span
          className={cn('ml-2 text-gray-900 ', addClass, {
            'text-gray-500': disabled,
            'sr-only': atToggle,
          })}
        >
          {label}
        </span>
      )}
    </label>
  );
};
