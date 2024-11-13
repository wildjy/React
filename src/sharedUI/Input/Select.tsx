"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { SelectHTMLAttributes, FC, ChangeEvent } from "react";

const SelectVariants = cva(
  'p-2 border border-gray-400',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      color: {
        base: 'base',
      }
    },
    defaultVariants: {
      size: "",
      color: "",
    },
  },
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, 
VariantProps<typeof SelectVariants> {
  size?: "sm" | "md" | "lg";
  color?: "base";
  addClass?: string;
  name?: string;
  value?: string;
  options: {value: string; label: string}[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

// SelectComponent는 name, options, value, onChange를 받아 렌더링합니다.

const Select: FC<SelectProps> =({
  size, 
  color, 
  addClass,
  name,
  value,
  options,
  onChange,
  ...props
}) => {

  const className = SelectVariants ({
    size: size as "sm" | "md" | "lg" | undefined,
    color: color as "base" | undefined,
  })

  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <select 
      name={name}
      id={name}
      value={value} 
      onChange={onChange}
      className={cn(className, addClass)}
      {...props}
      >
        <option value="">Choose an option</option>
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