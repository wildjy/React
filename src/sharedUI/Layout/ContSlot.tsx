"use client";
import React, {} from 'react';
import { cn } from "../common/cn";

interface ContHalfProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const ContSlot: React.FC<ContHalfProps> = ({ children, addClass }) => {
  const slots = React.Children.toArray(children);
  console.log(slots)

  return (
    <>
      <div className={`${cn(`grid grid-cols-1 md:grid-cols-2`, addClass)}`}>
        {
          slots.length > 0 ? (
            slots.map((slot, index) => (slot && (
              <div key={index} className={`bg-gray-400`}>
                {slot}
              </div>
              )
            ))
          ) : (
            <div>no data</div>
          )
        }
      </div>
    </>
  )
}