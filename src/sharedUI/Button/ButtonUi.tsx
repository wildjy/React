
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";

const ButtonVariants = cva(
  ' px-5 py-4 leading-none border radius',
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      color: {
        primary: "border-blue-700",
        secondary: " ",
        tertiary: " ",
      },
      // ...props
    },
    defaultVariants: {
      size: "",
      color: "primary",
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof ButtonVariants> {
  size?: "sm" | "md" | "lg" | "full";
  color?: "primary" | "secondary" | "tertiary";
  addClass?: string;
  value?: string;
};

const Button: FC<ButtonProps> = ({
  size,
  color,
  addClass,
  name,
  value,
  ...props
}) => {

  const className = ButtonVariants ({
    size: size as "sm" | "md" | "lg" | "full" | undefined,
    color: color as "primary" | "secondary" | "tertiary" | "full" | undefined,
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