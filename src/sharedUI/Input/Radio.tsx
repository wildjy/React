"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'relative peer rounded-full after:rounded-full after:content-[""] after:absolute after:border after:transition-all',
  {
    variants: {
      size: {
        sm: "w-4 h-4 after:h-3 after:w-3 after:top-0.5 after:left-0.5 ",
        md: "w-6 h-6 after:h-5 after:w-5 after:top-0.5 after:left-0.5 ",
        lg: "w-8 h-8 after:h-7 after:w-7 after:top-2 after:left-2 ",
        full: "",
      },
      color: {
        base: "bg-gray-200 peer-checked:bg-blue-500 peer-checked:after:bg-white after:bg-white",
        ghost: "ghost border-b rounded-none",
        success: "border border-success",
        warning: "border border-warning",
        error: "border border-error",
        disabled: "bg-baseGray",
      },
    },
    defaultVariants: {
      size: "md",
      color: "base",
    },
  }
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof InputVariants> {
  type?: "radio" | "checkbox";
  size?: "sm" | "md" | "lg" | "full";
  color?: "base" | "ghost" | "success" | "warning" | "error" | "disabled";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  icon?: React.ReactElement;
}

const Radio: FC<InputProps> = ({
  type,
  size,
  color = "base",
  name,
  label,
  addClass,
  value = "",
  onChange,
  ...props
}) => {
  const className = InputVariants({
    type: type as "radio" | "checkbox" | undefined,
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    color: color as
      | "base"
      | "ghost"
      | "success"
      | "warning"
      | "error"
      | "disabled"
      | undefined,
  });

  return (
    <label
      htmlFor={value}
      className="relative inline-flex items-center cursor-pointer"
    >
      <input
        type="radio"
        name={name}
        id={value}
        value={value}
        className="sr-only peer"
        onChange={onChange}
        placeholder={label}
        {...props}
      />
      <div className={cn(className, addClass)}></div>
      <span className="ml-3 text-gray-900">{label}</span>
    </label>
  );
};

export default Radio;
