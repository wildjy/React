"use client";
// import { useId } from 'sreact';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'relative peer border rounded-full after_center after:rounded-full after:content-[""] after:border after:transition-all',
  {
    variants: {
      // default size control
      size: {
        sm: "w-[1.25rem] h-[1.25rem] after:h-[0.85rem] after:w-[0.85rem]",
        md: "w-[1.75rem] h-[1.75rem] after:h-[1.125rem] after:w-[1.125rem]",
        lg: "w-[2rem] h-[2rem] after:h-[1.5rem] after:w-[1.5rem]",
      },
      mode: {
        base: `border-gray-200
          after:bg-white
          peer-checked:border-blue-700
          peer-checked:bg-white
          peer-checked:after:bg-blue-700
        `,
        check: `after:h-[100%] after:w-[100%]
          after:content-none
          after:border-none
          bg-center
          bg-[length:55%_55%]
          bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked.svg')]
          bg-no-repeat
          peer-checked:bg-blue-700
        `,
      },
    },
    defaultVariants: {
      size: "md",
      mode: "base",
    },
  }
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof InputVariants> {
  size?: "sm" | "md" | "lg";
  mode?: "base" | "check";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  disabled?: boolean;
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

  // const id = useId();

  const className = InputVariants({
    size: size as "sm" | "md" | "lg" | undefined,
    mode: mode as | "base" | "check" | undefined,
  });

  return (
    <label
      htmlFor={value}
      className={cn('relative inline-flex items-center cursor-pointer', addClass, {"cursor-default" : disabled })}
    >
      <input
        type="radio"
        name={name}
        id={value}
        value={value}
        className="sr-only peer"
        onChange={onChange}
        disabled={!!disabled}
        placeholder={label}
        {...props}
      />
      <div className={cn(className, addClass,
      { // disabled setting
        "text-gray-500 bg-gray-300 peer-checked:bg-gray-300 peer-checked:border-gray-300 after:bg-gray-300 after:border-none peer-checked:after:bg-gray-300 cursor-default" : disabled
      })}></div>

      { label && (
        <span className="ml-3 text-gray-900">{label}</span>
      )}
    </label>
  );
};

export default Radio;
