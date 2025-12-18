
import { cn } from "../common/cn";
import Image from 'next/image';

export const classInfoTextFontSize = `text-base sm:text-lg md:text-xl lg:text-md`;
export const classInfoFontSizeSmall = `text-xs sm:text-md md:text-base lg:text-xs`;
export const classInfoTextStyle = `flex flex-col items-center justify-center w-full mt-auto text-center`;

const DEFAULT_IMG =
  'https://image.jinhak.com/jinhakImages/react/coupon/coupon_default.svg';

export const CouponWrapper = ({
  children,
  imgURL,
  imgWidth,
  imgHeight,
  addClass,
}: {
  children: React.ReactNode;
  imgURL: string;
  imgWidth: number;
  imgHeight: number;
  isTablet?: boolean;
  addClass?: string;
}) => {
  return (
    <div
      className={`w-full
                        h-[23rem] sm:h-[26rem] md:h-[30rem] lg:w-[17rem] lg:h-[21.75rem]
                        rounded-xl lg:bg-white/30
                      `} // coupon height control
    >
      <div
        className={`${cn(
          'py-[1rem] lg:p-5 w-full h-full flex flex-col items-center justify-center',
          { addClass }
        )}`}
      >
        <div
          className={`${cn(
            'pt-1 lg:pt-1 px-10 sm:px-15 lg:px-0' //  px-8 sm:px-10 lg:px-0 image size control
            //coupon.id === 1 && 'px-10 sm:px-15 lg:px-0' // image size control
          )}`}
        >
          <Image
            src={imgURL || DEFAULT_IMG}
            width={imgWidth}
            height={imgHeight}
            alt={'쿠폰 이미지'}
          />
        </div>
        {/* info text and button */}
        {children}
      </div>
    </div>
  );
};
