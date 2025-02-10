'use client';
import { cn } from "../common/cn";
import { useEffect } from 'react';
import { Button } from '../Button/Button';

interface ToastPopupProps {
  child?: boolean;
  children?: React.ReactNode;
  isActive?: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  addClass?: string;
  setColor?: string;
  message?: string[];
}

export const ToastPopup: React.FC<ToastPopupProps> = ({ child = false, children, isActive, setToast, setColor, message, addClass }) => {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setToast(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, setToast]);

  return (
    <div
      className={`
      ${isActive ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}
      ${cn(
        `fixed bottom-6 x_center
        px-5 py-4 md:px-6 md:py-5 xl:px-9
        min-w-[300px] w-[90dvw] md:w-[40rem] xl:w-[43.75rem]
        bg-black rounded-lg bg-opacity-60
        transition-all duration-300
        z-[110]`,
        addClass
      )}

    `}
    >
      <div className="flex items-center justify-between">
        <p className="text-white text-2xs grow sm:text-md md:text-lg">
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