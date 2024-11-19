"use client";
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'relative peer border rounded-full after_center after:rounded-full after:content-[""] after:border after:transition-all',
  {
    variants: {
      size: {
        sm: "w-[1.5rem] h-[1.5rem] after:h-[1rem] after:w-[1rem]",
        md: "w-[1.75rem] h-[1.75rem] after:h-[1.125rem] after:w-[1.125rem]",
        lg: "w-[2rem] h-[2rem] after:h-[1.5rem] after:w-[1.5rem]",
        full: "",
      },
      mode: {
        base: "border-gray-200 peer-checked:border-blue-700 peer-checked:bg-white peer-checked:after:bg-blue-700 after:bg-white",
        check: "after:h-[100%] after:w-[100%] after:border-none peer-checked:bg-blue-500 peer-checked:after:bg-blue-700 after:bg-center after:bg-[length:55%_55%] peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] after:bg-no-repeat",
        disabled: "bg-baseGray",
      },
    },
    defaultVariants: {
      size: "md",
      mode: "base",
    },
  }
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof InputVariants> {
  size?: "sm" | "md" | "lg" | "full";
  mode?: "base" | "check" | "disabled";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  disabled?: string;
  icon?: React.ReactElement;
}

const Radio: FC<InputProps> = ({
  size,
  mode = "base",
  name,
  label,
  addClass,
  value = "",
  disabled,
  onChange,
  ...props
}) => {
  const className = InputVariants({
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    mode: mode as | "base" | "check" | undefined,
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
        disabled={mode === "disabled"}
        placeholder={label}
        {...props}
      />
      <div className={cn(className, addClass)}></div>
      <span className="ml-3 text-gray-900">{label}</span>
    </label>
  );
};

export default Radio;
