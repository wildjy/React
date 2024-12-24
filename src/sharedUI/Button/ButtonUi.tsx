
import { cn } from "../common/cn";
import { VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import ButtonVariants from "./ButtonVariants";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">, VariantProps<typeof ButtonVariants>  {
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
  mode?: "primary" | "secondary" | "tertiary";
  round?: "default" | "full";
  addClass?: string;
  href?: string;
  name?: string;
  disabled?: boolean,
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  size,
  mode,
  round,
  addClass,
  name,
  href,
  disabled,
  ...props
}) => {
  const className = ButtonVariants ({
    size: size as "sm" | "md" | "lg" | undefined,
    mode: mode as "primary" | "secondary" | "tertiary" | undefined,
    round: round as "default" | "sm" | "full" | undefined,
  });

  const primary = mode ===  null || "primary";
  const tertiary = mode ===  "tertiary";

  return (
    <>
      <button type={type}
        className={cn(className, addClass, {
          'text-white bg-disabled-bg cursor-default': disabled && primary,
          'text-disabled-text bg-white border-disabled-line cursor-default': disabled && tertiary,
        })}
        {...props}
      >
        {name}
      </button>
    </>
  );
};

export default Button;