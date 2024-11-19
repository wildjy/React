
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";

const ButtonVariants = cva(
  ' leading-none border rounded',
  {
    variants: {
      size: {
        sm: "",
        md: "px-5 py-[0.906rem]",
        lg: "",
      },
      mode: {
        primary: "text-white bg-blue-700",
        secondary: "border-blue-700",
        tertiary: " ",
      },
      round: {
        default: "rounded", 
        full: "rounded-full"
      }
      // ...props
    },
    defaultVariants: {
      size: "md",
      mode: "primary",
      round: "default",
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof ButtonVariants> {
  size?: "sm" | "md" | "lg" | "full";
  mode?: "primary" | "secondary" | "tertiary";
  round?: "default" | "full";
  addClass?: string;
  value?: string;
};

const Button: FC<ButtonProps> = ({
  size,
  mode,
  round,
  addClass,
  name,
  value,
  ...props
}) => {

  const className = ButtonVariants ({
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    mode: mode as "primary" | "secondary" | "tertiary" | "full" | undefined,
    round: round as "default" | "full" | undefined,
  });

  return (
    <div className="button-Box flex-1 text-center">
      <button
        className={cn(className, addClass)}
        value={value}
      {...props}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;