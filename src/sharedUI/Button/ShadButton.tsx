import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../common/cn";

const shadButtonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-semibold tracking-[-0.25px] font-[Pretendard,sans-serif]",
    "rounded-[6px] transition-colors",
    "disabled:pointer-events-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:     "bg-[#292a31] text-white hover:bg-[#4a4b57] disabled:bg-[#e1e1e3]",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:     "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900",
        secondary:   "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300",
        ghost:       "hover:bg-gray-100 hover:text-gray-900",
        link:        "text-blue-800 underline-offset-4 hover:underline",
      },
      size: {
        xlarge: "h-[60px] px-[16px] text-[18px] leading-[26px] gap-[8px] [&_svg]:size-[20px]",
        large:  "h-[48px] px-[16px] text-[16px] leading-[24px] gap-[8px] [&_svg]:size-[16px]",
        medium: "h-[40px] px-[12px] text-[14px] leading-[22px] gap-[6px] [&_svg]:size-[16px]",
        small:  "h-[32px] px-[8px]  text-[13px] leading-[22px] gap-[4px] [&_svg]:size-[12px]",
        xsmall: "h-[28px] px-[8px]  text-[13px] leading-[22px] gap-[4px] [&_svg]:size-[12px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
);

export interface ShadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof shadButtonVariants> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const ShadButton = React.forwardRef<HTMLButtonElement, ShadButtonProps>(
  ({ className, variant, size, icon, iconPosition = "left", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(shadButtonVariants({ variant, size }), className)}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    );
  }
);
ShadButton.displayName = "ShadButton";

export { ShadButton, shadButtonVariants };
