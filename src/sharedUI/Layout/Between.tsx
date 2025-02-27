'use client';
import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const BetweenVariants = cva(`flex md:justify-between items-center`, {
  variants: {
    type: {
      default: 'justify-between',
      left: 'justify-start',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

interface BetweenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type'>, VariantProps<typeof BetweenVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

export const Between: React.FC<BetweenProps> = ({ type, children, addClass }) => {
  const slots = React.Children.toArray(children);
  const className = BetweenVariants({
    type: type as 'default' | 'left' | 'right' | undefined,
  });

  return (
    <div className={`${cn(className, addClass)}`}>
      {slots.length > 0 ? slots.map((slot, index) => slot && <div key={index}>{slot}</div>) : <div>no data</div>}
    </div>
  );
};
