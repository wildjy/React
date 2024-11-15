"use client";
import { cn } from "../../sharedUI/common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { SelectHTMLAttributes, FC, ChangeEvent } from "react";

const SelectVariants = cva(
  'p-2 border border-gray-400',
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      color: {
        base: "",
        ghost: "",
      },
    },
    defaultVariants: {
      size: "md",
      color: "base"
    }
  }
)

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, VariantProps<typeof SelectVariants> {
  size?: "sm" | "md" | "lg";
  color?: "sm" | "md";
  addClass?: string;
  name?: string;
  value?: string;
  label?: string;
  disabled?: string;
  options: {value: string, label: string}[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({
  size, color, addClass, name, label, options, disabled, onChange, ...props
}) => {

  const className = SelectVariants({
    size: size as "sm" | "md" | "lg" | undefined,
    color: color as "base" | "ghost" | undefined,
  })

  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <select
      id={name}
      className={cn(className, addClass)}
      name={name}
      disabled={!!disabled}
      onChange={onChange}
      {...props}
      >
        <option value="">select..</option>
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