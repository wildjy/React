"use client";
import { cn } from "../common/cn";

interface ContainerProps {
  children?: React.ReactNode;
  addClass?: string;
}

const Container: React.FC<ContainerProps> = ({ children, addClass }) => {
  const className = 'px-6 py-6 max-w-full m-center md:px-7 md:max-w-full lg:w-tablet xl:w-laptop xl:px-12 xl:py-9 bg-white overflow-hidden'
  return (
    <>
      <div className={`${cn(className, addClass)}`}>
        { children }
      </div>
    </>
  )
}

export default Container;