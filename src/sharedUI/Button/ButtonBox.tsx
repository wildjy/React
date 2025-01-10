import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from 'react';

const ButtonBoxVariants = cva(`mt-8 flex flex-wrap gap-3`, {
    variants: {
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
    },
    defaultVariants: {
      align: 'center',
    }
  }
)

interface ButtonBoxProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof ButtonBoxVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

export const ButtonBox: React.FC<ButtonBoxProps> = ({ children, align, addClass }) => {
  const className = ButtonBoxVariants({
    align: align as "left" |  "center" |"right" | undefined,
  })

  return (
    <>
      <div className={cn(className, addClass)}>
        { children }
      </div>
    </>
  )
}