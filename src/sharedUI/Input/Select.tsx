"use client";
import clsx from 'clsx'
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { SelectHTMLAttributes, FC, ChangeEvent } from "react";

const SelectVariants = cva(
  'w-full md:w-auto p-5 border border-gray-400 leading-none focus:outline-none rounded-lg cursor-pointer appearance-none',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      mode: {
        base: 'base',
        ghost: 'ghost',
        disabled: 'disabled bg-disabled-bg',
      }
    },
    defaultVariants: {
      size: "md",
      mode: "base",
    },
  },
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>,
VariantProps<typeof SelectVariants> {
  size?: "sm" | "md" | "lg";
  mode?: "base" | "ghost" | "disabled";
  addClass?: string;
  name?: string;
  value?: string;
  label?: string;
  disabled?: string;
  options: {value: string; label: string}[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

// SelectComponent는 name, options, value, onChange를 받아 렌더링합니다.

const Select: FC<SelectProps> =({
  size,
  mode,
  addClass,
  name,
  value,
  label,
  disabled,
  options,
  onChange,
  ...props
}) => {

  const className = SelectVariants ({
    size: size as "sm" | "md" | "lg" | undefined,
    mode: mode as "base" | "ghost" | "disabled" | undefined,
  })

  return (
    <div>
      <label htmlFor={name} className="sr-only">{name}</label>
      <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      disabled={!!disabled}
      className={cn(className, addClass, {"text-gray-500 bg-disabled-bg peer-checked:after:bg-disabled-bg cursor-default" : disabled })}
      {...props}
      >
        <option value="">{label}</option>
        {
          options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))
        }
      </select>
    </div>
  )
}

export default Select;