"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";
import { Success } from "./storybook/InputText.stories";


const InputVariants = cva(
  "w-full md:w-auto px-7 py-5 leading-none focus:outline-none rounded-lg ",
  {
    variants: {
      size: {
        sm: "input-sm",
        md: "input-md",
        lg: "input-lg",
        full: "input-full w-full",
      },
      mode: {
        base: "border border-gray-200 focus:ring-1 focus:ring-blue-700",
        ghost: "peer ghost border-b rounded-none",
        success: "peer border focus:ring-1 focus:ring-success",
        warning: "peer border border-warning",
        error: "peer border border-error",
        readonly: "border focus:ring-0",
        disabled: "border bg-baseGray",
      },
    },
    defaultVariants: {
      size: "md",
      mode: "base",
    },
  }
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> {
  size?: "sm" | "md" | "lg" | "full";
  mode?: "base" | "ghost" | "success" | "warning" | "error" | "readonly" | "disabled";
  label?: string;
  addClass?: string;
  addId?: string;
  disabled?: string;
  readonly?: string;
  icon?: React.ReactElement;
}

const TextInput : FC<InputProps> = ({
  size,
  mode = "base",
  icon,
  label,
  addClass,
  addId = "",
  onChange,
  disabled,
  readonly,
  readOnly,
  ...props
}) => {
  const className = InputVariants({
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    mode: mode as | "base" | "ghost" | "success" | "warning" | "error" | "readonly" | "disabled" | undefined,
    // icon,
  });

  return (
    <div className="relative">
      <input
        type="text"
        className={cn(className, addClass)}
        onChange={onChange}
        id={addId}
        placeholder={label}
        disabled={mode === "disabled"}
        readOnly={mode === "readonly"}
        {...props}
      />
      <label htmlFor={addId} className="">
        {icon && icon} {label}
      </label>
      { mode === "success" && (
        <span className="sr-only y_center
        peer-[:not(:placeholder-shown)]:not-sr-only
        peer-[:not(:placeholder-shown)]:absolute
        peer-[:not(:placeholder-shown)]:right-5
        "><img src="https://image.jinhak.com/jinhakImages/react/icon/icon_input_success.svg" alt="" /></span>
      )}
      { mode === "error" && (
        <span className="sr-only y_center
        peer-[:not(:placeholder-shown)]:not-sr-only
        peer-[:not(:placeholder-shown)]:absolute
        peer-[:not(:placeholder-shown)]:right-5
        "><img src="https://image.jinhak.com/jinhakImages/react/icon/icon_input_error.svg" alt="" /></span>
      )}
    </div>
  );
};

export default TextInput;
