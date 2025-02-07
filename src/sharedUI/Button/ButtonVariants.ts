import { cva } from 'class-variance-authority';

export const ButtonVariants = cva(
  'w-[calc(100%/2-0.5rem/2)] md:w-auto grow md:grow-0 inline-flex items-center justify-center leading-none border border-transparent rounded-lg sm:rounded-lg md:rounded-lg',
  {
    variants: {
      size: {
        auto: `px-4 w-auto h-[1.66rem] md:h-[2.37rem] text-2xs md:text-s lg:text-s grow-0 rounded sm:rounded md:rounded`,
        sm: `w-auto min-w-[3.5rem] h-[1.75rem] sm:h-9 md:min-w-[6.25rem] md:h-[2.5rem] lg:h-[2.375rem]
        text-2xs sm:text-xs md:text-base lg:text-s rounded sm:rounded md:rounded`,
        md: `min-w-[8.75rem] h-11 sm:h-12 md:min-w-[8.75rem] md:h-13
        text-[0.875rem] sm:text-base md:text-lg lg:text-base`,
        lg: 'md:min-w-[10.625rem] h-[3rem] md:px-5 text-base lg:text-lg',
      },
      mode: {
        primary: 'text-white bg-blue-800',
        secondary: 'text-white bg-gray-200',
        tertiary: 'text-blue-800 border-blue-800',
        text: 'border-transparent bg-transparent',
      },
      round: {
        rec: 'rounded-none',
        sm: 'rounded',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'md',
      mode: 'primary',
    },
  }
);
