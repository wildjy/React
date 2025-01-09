"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface subTopProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const SubTop: React.FC<subTopProps> = ({ children, addClass }) => {
  return (
    <div className={`${cn(`mt-8 md:mt-10 relative`, addClass)}`}>
      <div className="flex flex-wrap justify-between ">{children}</div>
    </div>
  );
};