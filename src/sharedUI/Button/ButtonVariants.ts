import { cva } from 'class-variance-authority';

export const ButtonVariants = cva(
  'w-[calc(100%/2-0.5rem/2)] md:w-auto grow md:grow-0 inline-flex items-center justify-center leading-none border border-transparent rounded-lg sm:rounded-lg md:rounded-lg',
  {
    variants: {
      size: {
        auto: 'px-4 w-auto h-[1.66rem] md:h-[2.37rem] text-3xs md:text-s lg:text-s grow-0 rounded sm:rounded md:rounded',
        sm: 'w-auto min-w-[3.5rem] md:min-w-[5.41rem] h-[1.66rem] md:min-w-[7.1429rem] md:h-[2.37rem] text-3xs md:text-s lg:text-s rounded sm:rounded md:rounded',
        md: 'min-w-[8.75rem] h-[2.33rem] md:min-w-[8.75rem] md:h-[3rem] text-2xs md:text-base lg:text-base',
        lg: 'md:min-w-[10.625rem] h-[3rem] md:px-5 text-base l g:text-lg',
      },
      mode: {
        primary: 'text-white bg-blue-800',
        secondary: 'text-white bg-gray-200',
        tertiary: 'text-blue-800 border-blue-800',
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