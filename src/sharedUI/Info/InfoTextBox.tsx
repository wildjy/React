'use client';
import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const InfoTextVariants = cva(
  `
  mt-7 md:mt-7 flex flex-wrap items-center rounded
  `,
  {
    variants: {
      display: {
        default: 'flex flex-wrap items-center',
        block: 'block',
      },
      type: {
        line: 'p-4 sm:p-5 md:p-6 border rounded-lg',
        bg: 'p-4 sm:p-5 md:p-6 bg-grayBlue-50',
      },
      align: {
        between: 'justify-center md:justify-between',
        left: 'justify-start md:justify-start',
        center: 'justify-center md:justify-center',
        right: 'justify-end md:justify-right',
      },
    },
    defaultVariants: {
      display: 'default',
      type: 'line',
      align: 'between',
    },
  }
);
interface InfoTextBoxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'display' | 'type' | 'align'>,
    VariantProps<typeof InfoTextVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

export const InfoTextBox: React.FC<InfoTextBoxProps> = ({ display, type, align, children, addClass }) => {
  const className = InfoTextVariants({
    display: display as 'default' | 'block' | undefined,
    type: type as 'line' | 'bg' | undefined,
    align: align as 'between' | 'left' | 'center' | 'right' | undefined,
  });

  return <div className={`${cn(className, addClass)}`}>{children}</div>;
};
