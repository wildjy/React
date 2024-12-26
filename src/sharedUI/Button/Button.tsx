
import { cn } from "../common/cn";
import { VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import ButtonVariants from "./ButtonVariants";

type sizeType = "sm" | "md" | "lg";
type modeType = "primary" | "secondary" | "tertiary";
type roundType = "rec" | "sm" | "full";
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">, VariantProps<typeof ButtonVariants>  {
  type?: "button" | "submit";
  addClass?: string;
  href?: string;
  label?: string;
  disabled?: boolean,
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  size,
  mode,
  round,
  addClass,
  label,
  href,
  disabled,
  ...props
}) => {
  const className = ButtonVariants ({
    size: size as sizeType | undefined,
    mode: mode as modeType | undefined,
    round: round as roundType | undefined,
  });

  const primary = mode ===  null || "primary";
  const tertiary = mode ===  "tertiary";

  return (
    <>
      <button type={type}
        className={cn(className, addClass, {
          'text-white bg-[#E0E0E0] cursor-default': disabled && primary,
          'text-[#C4C4C4] bg-white border-[#C4C4C4] cursor-default': disabled && tertiary,
        })}
        {...props}
      >
        {label}
      </button>
    </>
  );
};

export default Button;