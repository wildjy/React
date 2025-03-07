'use client';
import { cn } from "../common/cn";

interface InfoTextProps {
  children: React.ReactNode;
  addClass?: string;
}

export const InfoTextChildren: React.FC<InfoTextProps> = ({ children, addClass }) => {
  return <ul className={`${cn('text-xs sm:text-sm md:text-base lg:text-md', addClass)}`}>{children}</ul>;
};

export const InfoTextLiClassName = 'pl-4 before:absolute before:left-0 before:content-["-"] relative';
