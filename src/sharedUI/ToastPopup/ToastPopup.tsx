'use client';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { useEffect, HTMLAttributes } from 'react';
import { Button } from '../Button/Button';

const ToastPopupVariants = cva(
  `
  fixed bottom-6
  min-w-[300px] w-[90dvw] md:w-[40rem] xl:w-[43.75rem]
  rounded-lg
  transition-all duration-500
  z-[110]
  `,
  {
    variants: {
      size: {
        base: `
      px-5 py-4 md:px-6 md:py-5 xl:px-9
      text-white text-2xs grow sm:text-md md:text-lg
      `,
        sm: `
      px-4 py-3 md:px-5 md:py-4 xl:px-8
      text-white text-3xs grow sm:text-s md:text-base
      `,
      },
      align: {
        left: `left-6`,
        center: `left-[50%] -translate-x-1/2`,
        right: `right-6`,
      },
      color: {
        base: `bg-black bg-opacity-60`,
      },
    },
    defaultVariants: {
      size: 'base',
      align: 'center',
      color: 'base',
    },
  }
);
interface ToastPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'size' | 'color'>, VariantProps<typeof ToastPopupVariants> {
  child?: boolean;
  children?: React.ReactNode;
  isActive?: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  addClass?: string;
  setColor?: string;
  message?: string[];
}

export const ToastPopup: React.FC<ToastPopupProps> = ({
  align,
  size,
  color,
  child = false,
  children,
  isActive,
  setToast,
  setColor,
  message,
  addClass,
}) => {
  const className = ToastPopupVariants({
    align: align as 'left' | 'center' | 'right' | undefined,
    size: size as 'base' | undefined,
    color: color as 'base' | undefined,
  });

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setToast(false);
      }, 4500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, setToast]);

  return (
    <div
      className={`
      ${cn(
        className,
        addClass,
        'transform transition-all duration-500 ease-in-out',
        isActive ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'
      )}
    `}
    >
      <div className="flex items-center justify-between">
        <p>
          {child ? (
            children
          ) : (
            <>
              <b className={`${setColor}`}>{message?.[0]}</b>가 {message?.[1]}되었습니다.
            </>
          )}
        </p>

        <div className="flex-none ml-4">
          <Button size="auto" mode="text" addClass="text-white" onClick={() => setToast(false)}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
