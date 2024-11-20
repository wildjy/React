"use client";
import clsx from 'clsx'
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'relative mr-3 leading-none rounded after:content-[""] after:transition-all',
  {
    variants: {
      size: {
        sm: "w-[1.5rem] h-[1.5rem] after:h-[1.5rem] after:w-[1.5rem]",
        md: "w-[1.75rem] h-[1.75rem] after:h-[1.75rem] after:w-[1.75rem]",
        lg: "w-[2rem] h-[2rem] after:h-[2rem] after:w-[2rem]",
        auto: "",
      },
      color: {
        base: "",
        fill: "",
        line: "",
      },
      round: {
        sm: "",
        md: "",
        full: "",
      },
      mode: {
        base: "border border-gray-200 after_center after:rounded peer-checked:bg-blue-500 peer-checked:after:bg-blue-700 after:bg-center after:bg-[length:60%_60%] peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] after:bg-no-repeat",
        check: "rounded-full after_center after:rounded-full border border-gray-200 peer-checked:bg-blue-500 peer-checked:after:bg-blue-700 after:bg-center after:bg-[length:60%_60%] peer-checked:after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] after:bg-no-repeat",
        text: "px-5 py-3 mr-0 w-auto h-auto text-gray-900 after:w-auto after:h-auto after:content-none peer-checked:text-blue-700",
        rectangle: "px-5 py-3 mr-0 w-auto h-auto after:w-auto after:h-auto after:content-none border border-gray-200 peer-checked:text-blue-700 peer-checked:border-blue-500",
        icon: "pl-9 pr-5 py-3 mr-0 w-auto h-auto after:w-auto after:h-auto after:content-none border border-gray-200 peer-checked:text-blue-700 peer-checked:border-blue-500 bg-[length:17%] bg-[10%_center] bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_input_success.svg')] peer-checked:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_input_error.svg')] bg-no-repeat",
        disabled: "bg-disabled-bg",
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
  size?: "sm" | "md" | "lg" | "auto";
  mode?: "base" | "check" | "text" | "rectangle" | "icon" |"disabled";
  name?: string;
  label?: string;
  addClass?: string;
  value?: string;
  disabled?: string;
  icon?: React.ReactElement;
}

const CheckBox: FC<InputProps> = ({
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
    size: size as "sm" | "md" | "lg" | "auto" | undefined,
    mode: mode as "base" | "check" | "text" | "rectangle" | "icon" | "disabled" | undefined,
  });

  const atType = ["rectangle", "text", "icon"].includes(mode);
  const atIcon = ["icon"].includes(mode);
  const disabledClass = "text-gray-500 after:bg-disabled-bg peer-checked:after:bg-disabled-bg cursor-default";

  return (
    <label
      htmlFor={value}
      className={cn('relative inline-flex items-center cursor-pointer', addClass, {"cursor-default" : disabled })}
    >
      <input
        type="checkbox"
        name={name}
        id={value}
        value={value}
        className="sr-only peer"
        disabled={!!disabled}
        onChange={onChange}
        placeholder={label}
        {...props}
      />

      <div className={cn(className, addClass,
        {
          "text-gray-500 after:bg-disabled-bg peer-checked:after:bg-disabled-bg bg-no-repeat cursor-default" : disabled ,
          "bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_input_error.svg')]": disabled && atIcon,
          "bg-none": disabled && !atIcon,
        }
      )}>
      {atType && label}
      </div>
      {!atType && (<span className={cn('text-gray-900', addClass, {"text-gray-500" : disabled })}>{label}</span>)}

    </label>
  );
};

export default CheckBox;
