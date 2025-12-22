'use client';
import { cn } from "../common/cn";

type InfoTextIcon = 'bar' | 'star' | 'dot' | 'number' | 'none';

interface InfoTextProps {
  icon?: InfoTextIcon;
  children?: React.ReactNode;
  texts?: {
    isHTML?: boolean;
    text?: string | React.ReactNode;
    addClass?: string;
  }[];
  addClass?: string;
}

export const InfoTextLiClassName =
  'pl-3 before:absolute before:left-0 before:content-["-"] relative';

export const InfoText: React.FC<InfoTextProps> = ({
  icon = 'bar',
  children,
  texts = [{ isHTML: false }],
  addClass,
}) => {
  const markerMap: Record<InfoTextIcon, string> = {
    bar: 'before:content-["-"]',
    star: 'before:content-["*"]',
    dot: 'before:content-["ㆍ"]',
    number: '',
    none: '',
  };

  const marker = markerMap[icon ?? 'dot'];

  return (
    <ul
      className={cn(
        'w-full text-xs sm:text-sm md:text-md text-gray-500 text-left',
        addClass
      )}
    >
      {children
        ? children
        : texts?.map((item, index) => {
            if (!item.text) return null;

            const baseClass = 'pl-3 before:absolute before:left-0 relative';

            return item.isHTML ? (
              <li
                key={index}
                className={cn(
                  baseClass,
                  (icon === 'number' || icon === 'none') && 'pl-0',
                  marker,
                  item.addClass
                )}
                dangerouslySetInnerHTML={{ __html: item.text as string }}
              />
            ) : (
              <li
                key={index}
                className={cn(
                  baseClass,
                  (icon === 'number' || icon === 'none') && 'pl-0',
                  marker,
                  item.addClass
                )}
              >
                {item.text}
              </li>
            );
          })}
    </ul>
  );
};
