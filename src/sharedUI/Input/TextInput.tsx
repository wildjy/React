"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const DivVariants = cva("inputCustom ", {
  variants: {
    mode: {
      base: "base",
      focus: "focus relative",
    },
  },
  defaultVariants: {
    mode: "base",
  },
});

const InputVariants = cva(
  "w-full px-3 py-2 border-gray-900 focus:outline-none rounded peer",
  {
    variants: {
      inputSize: {
        sm: "input-sm md:w-14",
        md: "input-md md:w-40",
        lg: "input-lg md:w-60",
        full: "input-full w-full",
      },
      color: {
        base: "border",
        ghost: "ghost border-b rounded-none",
        success: "border border-success",
        warning: "border border-warning",
        error: "border border-error",
        disabled: "bg-baseGray",
      },
    },
    defaultVariants: {
      inputSize: "md",
      color: "base",
    },
  }
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  mode?: "base" | "focus";
  inputSize?: "sm" | "md" | "lg" | "full";
  color?: "base" | "ghost" | "success" | "warning" | "error" | "disabled";
  label?: string;
  addClass?: string;
  addId?: string;
  disabled?: string;
  icon?: React.ReactElement;
}

const TextInput : FC<InputProps> = ({
  inputType,
  inputSize,
  mode,
  color = "base",
  icon,
  label,
  addClass,
  addId = "",
  onChange,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readOnly,
  ...props
}) => {
  const divClassName = DivVariants({
    mode: mode as "base" | "focus" | undefined,
  });
  const className = InputVariants({
    inputSize: inputSize as "sm" | "md" | "lg" | "full" | undefined,
    color: color as
      | "base"
      | "ghost"
      | "success"
      | "warning"
      | "error"
      | "disabled"
      | undefined,
    // icon,
  });

  return (
    <div className={cn(divClassName)}>
      <input
        type={inputType as "input" | "radio" | "checkbox"}
        className={cn(className, addClass)}
        onChange={onChange}
        id={addId}
        placeholder={label}
        disabled={!!className}
        {...props}
      />
      <label htmlFor={addId} className="flex justify-center items-center gap-3">
        {icon && icon} {label}
      </label>
    </div>
  );
};

export default TextInput;
