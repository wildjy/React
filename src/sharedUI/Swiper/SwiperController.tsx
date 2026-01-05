import { forwardRef } from 'react';
import { cn } from "../common/cn";

interface SwiperControllerProps {
  id: number | string;
  arrow?:
    | boolean
    | { show: boolean; leftAddClass?: string; rightAddClass?: string };
  pager?: boolean | { show: boolean; addClass?: string; pagerClass?: string };
}

export const SwiperController = forwardRef<
  HTMLDivElement,
  SwiperControllerProps
>(({ id, arrow = true, pager }, ref) => {
  return (
    <div className={`controller`}>
      <button
        className={`${cn(
          `
          disabled:opacity-35 disabled:cursor-default
          swiper-${id}-prev absolute top-[50%] transform -translate-y-1/2 left-3 z-10 bg-white rounded-full`,
          typeof arrow === 'object' && arrow.leftAddClass,
          arrow === true ||
            (arrow &&
              typeof arrow === 'object' &&
              'show' in arrow &&
              arrow.show)
            ? ''
            : 'hidden'
        )}`}
      >
        <img
          src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
          className="rotate-180 w-7 md:w-8 lg:w-10"
          alt=""
        />
      </button>
      <div
        className={`${
          pager === true ||
          (pager && typeof pager === 'object' && 'show' in pager && pager.show)
            ? ''
            : 'hidden'
        }`}
      >
        <div
          ref={ref}
          className={`${cn(
            'swiper-pagination !-bottom-6 md:!-bottom-9 !z-0',
            typeof pager === 'object' && pager.addClass && pager.addClass
          )}`}
        ></div>
      </div>
      <button
        className={`${cn(
          `
          disabled:opacity-35 disabled:cursor-default
          swiper-${id}-next absolute top-[50%] transform -translate-y-1/2 right-3 z-10 bg-white rounded-full`,
          typeof arrow === 'object' && arrow.rightAddClass,
          arrow === true ||
            (arrow &&
              typeof arrow === 'object' &&
              'show' in arrow &&
              arrow.show)
            ? ''
            : 'hidden'
        )}`}
      >
        <img
          src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
          className="w-7 md:w-8 lg:w-10"
          alt=""
        />
      </button>
    </div>
  );
});
