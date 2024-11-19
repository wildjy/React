"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'relative peer rounded after:rounded after:content-[""] after_center',
  {
    variants: {
      size: {
        sm: "w-5 h-5 after:h-5 after:w-5",
        md: "w-6 h-6 after:h-6 after:w-6",
        lg: "w-8 h-8 after:h-8 after:w-8",
        full: "",
      },
      color: {
        base: "border border-gray-200 peer-checked:bg-blue-500 peer-checked:after:bg-blue-700 after:bg-center after:bg-[length:60%_60%] peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] after:bg-no-repeat",
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
  size?: "sm" | "md" | "lg" | "full";
  color?: "base" | "ghost" | "success" | "warning" | "error" | "disabled";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  icon?: React.ReactElement;
}

const CheckBox: FC<InputProps> = ({
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
        type="checkbox"
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

export default CheckBox;
