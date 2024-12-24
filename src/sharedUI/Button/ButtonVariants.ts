
import { cva } from "class-variance-authority";

const ButtonVariants = cva(
  'px-6 py-3 inline-flex items-center justify-center leading-none border border-transparent',
  {
    variants: {
      size: {
        sm: "text-s",
        md: "text-base",
        lg: "text-xl",
      },
      mode: {
        primary: "text-white bg-blue-700",
        secondary: "text-white bg-gray-400",
        tertiary: "text-blue-700 border-blue-700",
      },
      round: {
        default: "rounded-lg",
        sm: "rounded",
        full: "rounded-full"
      },
    },
    defaultVariants: {
      size: "md",
      mode: "primary",
      round: "default",
    },
  }
);

export default ButtonVariants;