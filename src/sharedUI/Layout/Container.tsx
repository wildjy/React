"use client";
import { cn } from "../common/cn";

interface ContainerProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, addClass }) => {
  const className = 'py-6 max-w-full m-center xl:w-laptop xl:py-9 bg-white overflow-hidden'
  return (
    <>
      <div className={`${cn(className, addClass)}`}>
        { children }
      </div>
    </>
  )
}