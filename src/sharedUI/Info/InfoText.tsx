'use client';
import { cn } from "../common/cn";

interface InfoTextProps {
  child?: boolean;
  children?: React.ReactNode;
  texts?: {
    text?: string | React.ReactNode;
  }[];
  addClass?: string;
}

export const InfoText: React.FC<InfoTextProps> = ({ child = false, children, texts, addClass }) => {
  return (
    <ul className={`w-full ${cn('text-xs sm:text-sm md:text-base lg:text-md text-gray-400', addClass)}`}>
      {child
        ? children
        : texts?.map((item, index) => (
            <li key={index} className='pl-4 before:absolute before:left-0 before:content-["-"] relative'>
              {item.text ?? ''}
            </li>
          ))}
    </ul>
  );
};