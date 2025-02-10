'use client';
import { cn } from "../common/cn";

interface InfoTextProps {
  texts: {
    text?: string | React.ReactNode;
  }[];
  addClass?: string;
}

export const InfoText: React.FC<InfoTextProps> = ({ texts, addClass }) => {
  return (
    <ul className={`${cn('text-2xs sm:text-3xs md:text-md ', addClass)}`}>
      {texts?.map((item, index) => (
        <li key={index} className='pl-4 before:absolute before:left-0 before:content-["-"] relative'>
          {item.text}
        </li>
      ))}
    </ul>
  );
};
