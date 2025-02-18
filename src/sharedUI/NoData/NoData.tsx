'use client';
import { cn } from "../common/cn";

interface NoDataProps {
  children?: React.ReactNode;
  message?: string | React.ReactNode;
  setHeight?: string;
  setFont?: string;
  addClass?: string;
}

export const NoData: React.FC<NoDataProps> = ({ children, setHeight = 'h-[21.875rem]', message, setFont, addClass }) => {
  return (
    <div className={`${setHeight} flex flex-wrap content-center items-center justify-center text-center`}>
      <div className={`${cn('w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13', addClass)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 50 50" fill="none">
          <path
            d="M24.1667 48.3335C11.7667 48.3335 1.66666 38.2335 1.66666 25.8335C1.66666 13.4335 11.7667 3.3335 24.1667 3.3335C36.5667 3.3335 46.6667 13.4335 46.6667 25.8335C46.6667 38.2335 36.5667 48.3335 24.1667 48.3335ZM24.1667 6.66683C13.6 6.66683 4.99999 15.2668 4.99999 25.8335C4.99999 36.4002 13.6 45.0002 24.1667 45.0002C34.7333 45.0002 43.3333 36.4002 43.3333 25.8335C43.3333 15.2668 34.7333 6.66683 24.1667 6.66683ZM24.1667 35.8335C23.25 35.8335 22.5 35.0835 22.5 34.1668C22.5 33.2502 23.2333 32.5002 24.1667 32.5002C25.0833 32.5002 25.8333 33.2502 25.8333 34.1668C25.8333 35.0835 25.0833 35.8335 24.1667 35.8335ZM24.1667 29.5835C23.25 29.5835 22.5 28.8335 22.5 27.9168V17.5002C22.5 16.5835 23.25 15.8335 24.1667 15.8335C25.0833 15.8335 25.8333 16.5835 25.8333 17.5002V27.9168C25.8333 28.8335 25.0833 29.5835 24.1667 29.5835Z"
            fill="#C4C4C4"
          />
        </svg>
      </div>
      <div className={`w-full mt-4 sm:mt-5`}>
        <p className={`${cn('text-md sm:text-base md:text-lg text-gray-400', setFont)}`}>{message}</p>
        {children}
      </div>
    </div>
  );
};
