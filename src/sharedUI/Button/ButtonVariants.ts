import { cva } from 'class-variance-authority';

export const ButtonVariants = cva(
  'w-1/2 md:w-auto grow md:grow-0 inline-flex items-center justify-center leading-none border border-transparent rounded-lg sm:rounded-lg md:rounded-lg',
  {
    variants: {
      size: {
        auto: `grow-0 px-4 w-auto h-[1.75rem] sm:h-8 md:h-[2.5rem] lg:h-[2.375rem]
        text-2xs sm:text-xs md:text-base lg:text-sm leading-none
        rounded sm:rounded md:rounded`,
        xs: `w-auto px-2 min-w-[3rem] h-[1.5rem] sm:h-8 md:min-w-[4.25rem] md:h-[1.875rem] lg:h-7
        text-2xs sm:text-xs md:text-base lg:text-sm leading-none
        rounded sm:rounded md:rounded`,
        sm: `w-auto min-w-[3.5rem] h-[1.75rem] sm:h-8 md:min-w-[6.25rem] md:h-[2.5rem] lg:h-[2.375rem]
        text-2xs sm:text-xs md:text-base lg:text-sm leading-none
        rounded sm:rounded md:rounded`,
        md: `min-w-[6.75rem] h-10 sm:h-11 md:min-w-[8.75rem] md:h-12
        text-sm sm:text-base md:text-base leading-none`,
        lg: 'md:min-w-[10.625rem] h-[3rem] md:px-4 text-base leading-none lg:text-lg',
      },
      mode: {
        primary: 'text-white bg-blue-800',
        secondary: 'text-white bg-gray-200',
        tertiary: 'text-blue-800 border-blue-800 bg-white',
        quarter: 'text-gray-600 border-gray-300',
        text: `border-transparent bg-transparent underline`,
      },
      round: {
        rec: 'rounded-none',
        sm: 'rounded',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        mode: 'text',
        size: 'md',
        className: `px-auto py-auto min-w-auto w-auto sm:h-auto h-auto md:min-w-auto md:h-auto`,
      },
    ],
    defaultVariants: {
      size: 'md',
      mode: 'primary',
    },
  }
);
