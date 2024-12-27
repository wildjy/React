
import { cn } from "../common/cn";
import { VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import ButtonVariants from "./ButtonVariants";

type sizeType = "sm" | "md" | "lg";
type modeType = "primary" | "secondary" | "tertiary";
type roundType = "rec" | "sm" | "full";
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">, VariantProps<typeof ButtonVariants>  {
  children?: React.ReactNode;
  type?: string;
  addClass?: string;
  startIcon?: React.ReactNode[];
  endIcon?: React.ReactNode[];
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  size,
  mode,
  round,
  addClass,
  startIcon,
  endIcon,
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
      <button type={`${type === 'submit' ? 'submit' : 'button'}`}
        className={cn(className, addClass, {
          'gap-3': startIcon || endIcon,
          'text-white bg-[#E0E0E0] cursor-default': disabled && primary,
          'text-[#C4C4C4] bg-white border-[#C4C4C4] cursor-default': disabled && tertiary,
        })}
        {...props}
      >
        {startIcon && (
          <img src={`https://image.jinhak.com/jinhakImages/react/icon/${startIcon[0]}`} className={`${startIcon[1]}`} alt="icon" />
        )}
        { children }
        {endIcon && (
          <img src={`https://image.jinhak.com/jinhakImages/react/icon/${endIcon[0]}`} className={`${endIcon[1]}`} alt="icon" />
        )}
      </button>
    </>
  );
};

export default Button;