'use client';
import { useEffect } from 'react';
import { Button } from '../Button/Button';

interface ToastPopupProps {
  children?: React.ReactNode;
  isActive?: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToastPopup: React.FC<ToastPopupProps> = ({ children, isActive, setToast }) => {
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
      fixed bottom-6 x_center
      px-5 py-4 md:px-6 md:py-5 xl:px-9
      min-w-[300px] w-[90dvw] md:w-[40rem] xl:w-[43.75rem]
      bg-black rounded-lg bg-opacity-60
      transition-all duration-300
      z-[110]
    `}
    >
      <div className="flex items-center justify-between">
        <p className="text-white text-2xs grow sm:text-md md:text-lg">{children}</p>

        <div className="flex-none ml-4">
          <Button size="auto" mode="text" addClass="text-white" onClick={() => setToast(false)}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
