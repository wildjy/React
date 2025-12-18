'use client';
import { cn } from "../common/cn";

export type iconType =
  | 'default'
  | 'info'
  | 'lock'
  | 'loading'
  | 'delay'
  | undefined;
interface NoDataProps {
  icon?: iconType;
  children?: React.ReactNode;
  message?: string | React.ReactNode;
  setHeight?: string;
  setFont?: string;
  addClass?: string;
  childrenClassName?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  icon = 'default',
  children,
  setHeight = 'min-h-[21.875rem]',
  message,
  setFont,
  addClass,
  childrenClassName,
}) => {
  const icons = {
    default: <></>,
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 46 46"
        fill="none"
      >
        <path
          d="M23.1667 45.3335C10.7667 45.3335 0.666748 35.2335 0.666748 22.8335C0.666748 10.4335 10.7667 0.333496 23.1667 0.333496C35.5667 0.333496 45.6667 10.4335 45.6667 22.8335C45.6667 35.2335 35.5667 45.3335 23.1667 45.3335ZM23.1667 3.66683C12.6001 3.66683 4.00008 12.2668 4.00008 22.8335C4.00008 33.4002 12.6001 42.0002 23.1667 42.0002C33.7334 42.0002 42.3334 33.4002 42.3334 22.8335C42.3334 12.2668 33.7334 3.66683 23.1667 3.66683ZM23.1667 32.8335C22.2501 32.8335 21.5001 32.0835 21.5001 31.1668C21.5001 30.2502 22.2334 29.5002 23.1667 29.5002C24.0834 29.5002 24.8334 30.2502 24.8334 31.1668C24.8334 32.0835 24.0834 32.8335 23.1667 32.8335ZM23.1667 26.5835C22.2501 26.5835 21.5001 25.8335 21.5001 24.9168V14.5002C21.5001 13.5835 22.2501 12.8335 23.1667 12.8335C24.0834 12.8335 24.8334 13.5835 24.8334 14.5002V24.9168C24.8334 25.8335 24.0834 26.5835 23.1667 26.5835Z"
          fill="#C4C4C4"
        />
      </svg>
    ),
    lock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 50 50"
        fill="none"
      >
        <g clipPath="url(#clip0_5444_11522)">
          <path
            d="M25.007 50C11.2196 50 0 38.7943 0 25.007C0 11.2196 11.2196 0 25.007 0C38.7943 0 50.014 11.2196 50.014 25.007C50.014 38.7943 38.7943 50.014 25.007 50.014V50ZM25.007 3.4887C13.1454 3.4887 3.4887 13.1454 3.4887 25.007C3.4887 36.8685 13.1454 46.5253 25.007 46.5253C36.8685 46.5253 46.5253 36.8685 46.5253 25.007C46.5253 13.1454 36.8685 3.4887 25.007 3.4887Z"
            fill="#C4C4C4"
          />
          <path
            d="M31.2864 34.6358H18.7271C16.885 34.6358 15.3779 33.1007 15.3779 31.2029V24.686C15.3779 22.8021 16.885 21.2531 18.7271 21.2531H19.5644V18.1691C19.5644 15.0851 22.0065 12.5732 25.0067 12.5732C28.007 12.5732 30.4491 15.0851 30.4491 18.1691V21.2531H31.2864C33.1284 21.2531 34.6355 22.7881 34.6355 24.686V31.2029C34.6355 33.0868 33.1284 34.6358 31.2864 34.6358ZM18.7271 23.7789C18.2666 23.7789 17.8898 24.1836 17.8898 24.7V31.2168C17.8898 31.7192 18.2666 32.1379 18.7271 32.1379H31.2864C31.7469 32.1379 32.1237 31.7332 32.1237 31.2168V24.7C32.1237 24.1976 31.7469 23.7789 31.2864 23.7789H18.7271ZM22.0762 21.2671H27.9372V18.1831C27.9372 16.4806 26.6255 15.0991 25.0067 15.0991C23.388 15.0991 22.0762 16.4806 22.0762 18.1831V21.2671ZM25.0067 30.2958C24.309 30.2958 23.7508 29.7376 23.7508 29.0399V26.8629C23.7508 26.1652 24.309 25.607 25.0067 25.607C25.7045 25.607 26.2627 26.1652 26.2627 26.8629V29.0399C26.2627 29.7376 25.7045 30.2958 25.0067 30.2958Z"
            fill="#C4C4C4"
          />
        </g>
        <defs>
          <clipPath id="clip0_5444_11522">
            <rect width="100%" height="100%" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    loading: (
      <img
        src="https://image.jinhak.com/jinhakImages/react/icon/icon_loading_animated.gif"
        width={64}
        height={64}
        alt="로딩"
      />
    ),
    delay: (
      <img
        src="https://image.jinhak.com/jinhakImages/react/icon/icon_delay_animated.gif"
        width={88}
        height={88}
        alt="계산중"
      />
    ),
  };

  return (
    <div
      className={`${cn(
        'flex flex-wrap content-center items-center justify-center text-center',
        icon === 'default' || addClass ? 'min-h-auto' : setHeight,
        addClass
      )}
    `}
    >
      {icon && icon !== 'default' ? (
        <div
          className={`${cn(
            'mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
            (icon === 'loading' || icon === 'delay') &&
              'w-14 h-14 sm:w-15 sm:h-15 lg:w-17 lg:h-17'
          )}`}
        >
          {icons[icon]}
        </div>
      ) : null}

      <div className={`w-full`}>
        <div
          className={`${cn(
            'text-md sm:text-base md:text-lg text-gray-400',
            setFont
          )}`}
        >
          {message}
        </div>
        {children && (
          <div className={cn(childrenClassName)}>{children}</div>
        )}
      </div>
    </div>
  );
};
