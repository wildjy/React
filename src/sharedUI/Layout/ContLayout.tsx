'use client';
import React, { ReactNode } from 'react';
import { cn } from "../common/cn";

interface ContLayoutProps {
  addClass?: string;
  children?: ReactNode;
}

export const ContLayout: React.FC<ContLayoutProps> = ({ children, addClass }) => {
  const slots = React.Children.toArray(children);

  return (
    <div
      className={`${cn(
        `ContLayout
        flex flex-wrap flex-row
        gap-y-6 sm:gap-y-7 md:gap-y-8 lg:gap-y-10`,
        addClass
      )}`}
    >
      {slots.length > 0 ? (
        slots.map((slot, index) => (
          <div key={index} className={`w-full`}>
            {slot}
          </div>
        ))
      ) : (
        <div>No data.</div>
      )}
    </div>
  );
};
