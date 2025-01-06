"use client";
// import { useId } from 'sreact';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";

const InputVariants = cva(
  'inline-flex px-1 md:px-3 min-w-[3.5rem] md:min-w-[4.5rem] h-5 md:h-7 text-xs md:text-s items-center justify-center text-center relative peer ',
  {
    variants: {
      // default size control
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      mode: {
        base: `bg-gray-50
          peer-checked:text-blue-800
          peer-checked:bg-white
        `,
        check: ``,
      },
    },
    defaultVariants: {
      size: "md",
      mode: "base",
    },
  }
);

interface CustomRadioBoxProps {
  children?: React.ReactNode;
}

interface CustomRadioType extends React.FC<CustomRadioBoxProps> {
  Radio: typeof Radio;
}

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
const CustomRadio: CustomRadioType = ({ children }) => {
  return (
    <>
      <div className='p-1 md:p-2 inline-flex items-center justify-center bg-gray-50 border border-gray-200 rounded'>
        {children}
      </div>
    </>
  )
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
        "text-gray-500 peer-checked:text-gray-500 peer-checked:border-gray-300 cursor-default" : disabled
      })}>{label}</div>
    </label>
  );
};

CustomRadio.Radio = Radio;

export default CustomRadio;
