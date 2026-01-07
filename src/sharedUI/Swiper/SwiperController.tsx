import { forwardRef } from 'react';
import { cn } from "../common/cn";
import { SwiperArrowOption, SwiperControllerOption, SwiperPagerOption, SwiperScrollbarOption } from './SwiperSlider';

interface SwiperControllerProps {
  id: number | string;
  controller?: SwiperControllerOption;
  arrow?: SwiperArrowOption;
  pager?: SwiperPagerOption;
  scrollbar?: SwiperScrollbarOption;
}

export const SwiperController = forwardRef<
  HTMLDivElement,
  SwiperControllerProps
>(
  (
    {
      id,
      controller,
      arrow = { show: true },
      pager = { show: true },
      scrollbar = { show: false },
    },
    ref
  ) => {
    return (
      controller &&
      controller.show && (
        <div
          className={cn(
            `controller `,
            controller.type === 'fraction' &&
              'flex items-center justify-center gap-x-3 relative z-[10]',
            controller.addClass
          )}
        >
          {/* 이전 슬라이드 버튼 */}
          <button
            className={`${cn(
              `
              disabled:opacity-35 disabled:cursor-default
              swiper-${id}-prev z-10 bg-white rounded-full`,
              arrow === true ||
                (arrow &&
                  typeof arrow === 'object' &&
                  'show' in arrow &&
                  arrow.show)
                ? ''
                : 'hidden',
              controller.type === 'default' &&
                'absolute top-[50%] transform -translate-y-1/2 left-3',
              typeof arrow === 'object' && arrow.leftAddClass
            )}`}
          >
            {controller.type === 'default' ? (
              <img
                src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
                className="rotate-180 w-7 md:w-8 lg:w-10"
                alt=""
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.78033 1.21936C6.07322 0.940416 6.07322 0.488156 5.78033 0.20921C5.48744 -0.0697362 5.01256 -0.0697363 4.71967 0.20921L0.219671 4.49492C-0.0732229 4.77387 -0.0732229 5.22613 0.21967 5.50508L4.71967 9.79079C5.01256 10.0697 5.48744 10.0697 5.78033 9.79079C6.07322 9.51184 6.07322 9.05958 5.78033 8.78064L1.81066 5L5.78033 1.21936Z"
                  fill="#272727"
                />
              </svg>
            )}
          </button>

          {/* 페이지네비게이션 */}
          <div
            className={`${cn(
              pager === true ||
                (pager &&
                  typeof pager === 'object' &&
                  'show' in pager &&
                  pager.show)
                ? ''
                : 'hidden'
            )}`}
          >
            <div
              ref={ref}
              className={`${cn(
                `swiper-${id}-pagination swiper-pagination  !z-0`,
                controller.type === 'default' && '!-bottom-6 md:!-bottom-9',
                controller.type === 'fraction' &&
                  '!relative !top-0 !bottom-0 md:!-bottom-0 leading-none',
                typeof pager === 'object' && pager.addClass && pager.addClass
              )}`}
            ></div>
          </div>

          {/* 다음 슬라이드 버튼 */}
          <button
            className={`${cn(
              `
              disabled:opacity-35 disabled:cursor-default
              swiper-${id}-next z-10 bg-white rounded-full`,
              arrow === true ||
                (arrow &&
                  typeof arrow === 'object' &&
                  'show' in arrow &&
                  arrow.show)
                ? ''
                : 'hidden',
              controller.type === 'default' &&
                'absolute top-[50%] transform -translate-y-1/2 right-3',
              typeof arrow === 'object' && arrow.rightAddClass
            )}`}
          >
            {controller.type === 'default' ? (
              <img
                src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
                className="w-7 md:w-8 lg:w-10"
                alt=""
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.21967 8.78064C-0.0732229 9.05958 -0.0732229 9.51184 0.21967 9.79079C0.512564 10.0697 0.987437 10.0697 1.28033 9.79079L5.78033 5.50508C6.07322 5.22613 6.07322 4.77387 5.78033 4.49492L1.28033 0.20921C0.987437 -0.0697363 0.512563 -0.0697362 0.21967 0.20921C-0.0732233 0.488156 -0.0732233 0.940416 0.21967 1.21936L4.18934 5L0.21967 8.78064Z"
                  fill="#272727"
                />
              </svg>
            )}
          </button>

          {scrollbar && scrollbar.show && (
            <div className={cn('relative mx-auto', scrollbar?.sizeClass)}>
              <div
                className={cn(
                  `swiper-${id}-scrollbar swiper-scrollbar outside`,
                  scrollbar?.addClass
                )}
              ></div>
            </div>
          )}
        </div>
      )
    );
  }
);
