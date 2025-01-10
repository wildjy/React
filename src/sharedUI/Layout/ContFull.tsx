"use client";
import { cn } from "../common/cn";

interface ContFullProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const ContFull: React.FC<ContFullProps> = ({ children, addClass }) => {
  const className = "-mx-6 md:mx-0"
  return (
    <>
      <div className={`${cn(className, addClass)}`}>
        { children }
      </div>
    </>
  )
}