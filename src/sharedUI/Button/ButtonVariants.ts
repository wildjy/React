
import { cva } from "class-variance-authority";

const ButtonVariants = cva(
  'w-[calc(100%/2-0.5rem/2)] md:w-auto grow md:grow-0 inline-flex items-center justify-center leading-none border border-transparent rounded-lg',
  {
    variants: {
      size: {
        auto: "px-4 w-auto md:min-w-fit grow-0",
        sm: "md:min-w-[6.875rem] h-[2rem] md:px-5 text-2xs lg:text-s rounded",
        md: "md:min-w-[8.75rem] h-[2.5rem] md:px-5 text-xs lg:text-base",
        lg: "md:min-w-[10.625rem] h-[3rem] md:px-5 text-base lg:text-lg",
      },
      mode: {
        primary: "text-white bg-blue-700",
        secondary: "text-white bg-gray-400",
        tertiary: "text-blue-700 border-blue-700",
      },
      round: {
        rec: "rounded-none",
        sm: "rounded",
        full: "rounded-full"
      },
    },
    defaultVariants: {
      size: "md",
      mode: "primary",
    },
  }
);

export default ButtonVariants;