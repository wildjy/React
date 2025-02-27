'use client';
import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

type modeType = 'default' | 'left' | 'right' | 'mLeft' | 'mRight';
const BetweenVariants = cva(`flex items-center`, {
  variants: {
    type: {
      default: 'justify-between',
      left: 'justify-between md:justify-start',
      mLeft: 'justify-start md:justify-between',
      right: 'justify-between md:justify-end',
      mRight: 'justify-end md:justify-between',
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
    type: type as modeType | undefined,
  });

  return (
    <div className={`${cn(className, addClass)}`}>
      {slots.length > 0 ? slots.map((slot, index) => slot && <div key={index}>{slot}</div>) : <div>no data</div>}
    </div>
  );
};
