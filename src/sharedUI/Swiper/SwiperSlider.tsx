/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from "../common/cn";
import { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperProps } from 'swiper/react';

interface swiperProps {
  active?: number;
  freeMode?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  children?: React.ReactNode;
  addClass?: string;
  id?: number | string;
  image?: boolean;
  arrow?:
    | boolean
    | { show: boolean; leftAddClass?: string; rightAddClass?: string };
  allowTouchMove?: boolean;
  pager?: boolean | { show: boolean; addClass?: string; pagerClass?: string };
  onSlideChange?: (swiper: SwiperClass) => void;
}

export const SwiperSlider: React.FC<swiperProps> = ({
  freeMode = true,
  loop = false,
  autoplay,
  delay = 2500,
  slidesPerView = 'auto',
  spaceBetween = 0,
  children,
  addClass,
  id,
  arrow = true,
  allowTouchMove = true,
  pager,
  onSlideChange,
}) => {
  const [contentWidth, setContentWidth] = useState<number>(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const paginationRef = useRef(null);
  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index: number) {
      return `
      <span class="
      ${cn(
        `!w-[0.375rem] !h-[0.375rem] md:!w-[0.625rem] md:!h-[0.625rem]
        !opacity-100 !bg-gray-400 [&.swiper-pagination-bullet-active]:!bg-gray-800
      `,
        typeof pager === 'object' && pager.pagerClass
      )}
      ">
        <span class="sr-only">' + (index + 1) + '</span>
      </span>`;
    },
  };

  useEffect(() => {
    const swiper = swiperRef.current;

    const timer = setTimeout(() => {
      swiperRef.current?.update();
    }, 50);

    if (!swiper || !swiper.autoplay) return;

    if (swiper.autoplay) {
      autoplay ? swiper.autoplay.start() : swiper.autoplay.stop();
    }

    if (swiper.pagination && typeof swiper.pagination.update === 'function') {
      swiper.loopDestroy();
      swiper.loopCreate();
      swiper.update();
      swiper.pagination.render();
      swiper.pagination.update();
    }

    const handleResize = () => {
      if (swiperRef.current) {
        const contWidth = document.querySelector(`.container`);
        setContentWidth(contWidth?.clientWidth || 0);
        swiperRef.current?.update();
        // activeButton();
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [contentWidth, autoplay, loop]);

  // active slide
  useLayoutEffect(() => {
    const activeSlide = () => {
      const swiperWrap = document.querySelector(`.swipers-${id}`);
      if (swiperWrap) {
        const slides = swiperWrap.querySelectorAll(
          '.swiper-slide a, .swiper-slide button, .swiper-slide div'
        );
        slides.forEach((slide, index) => {
          if (slide.classList.contains('active')) {
            swiperRef.current?.slideTo(index, 100, false);
          }
        });
      }
    };
    activeSlide();
  }, []);

  const multiOnSlideChange = (swiper: SwiperClass) => {
    if (onSlideChange) {
      onSlideChange(swiper);
    }
  };

  const swiperOption: SwiperProps = {
    freeMode: freeMode,
    autoplay: {
      delay: delay,
      disableOnInteraction: false,
    },
    centeredSlides: false,
    loop: loop,
    spaceBetween: spaceBetween,
    slidesPerView: slidesPerView,
    className: 'visible !important', //  !overflow-visible
    allowTouchMove: allowTouchMove, // (false-스와이핑안됨)버튼으로만 슬라이드 조작이 가능
    watchOverflow: true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: `.swiper-${id}-next`,
      prevEl: `.swiper-${id}-prev`,
    },
    pagination: pagination, // {{type: 'fraction', clickable: true }}
    onSwiper: (swiper: SwiperClass) => {
      // console.log(swiper);
      swiperRef.current = swiper;
      // handleSwiperInit(swiper);
    },
    onActiveIndexChange: (swiper: SwiperClass) => {
      // console.log(swiper);
    },
    onBeforeInit: (swiper: SwiperClass) => {
      // console.log(swiper);
    },
    onSlideChange: multiOnSlideChange,
    onResize: (swiper: SwiperClass) => {
      swiper.update();
    },
  };

  return (
    <div className={`${cn(`swipers-${id} relative`, addClass)}`}>
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
        {...swiperOption}
      >
        {children}
      </Swiper>

      <div className={`controller`}>
        <button
          className={`${cn(
            `
            disabled:opacity-35 disabled:cursor-default
            swiper-${id}-prev absolute top-[50%] transform -translate-y-1/2 left-3 z-10 bg-white rounded-full`,
            typeof arrow === 'object' && arrow.leftAddClass
          )}
          ${
            arrow === true ||
            (arrow &&
              typeof arrow === 'object' &&
              'show' in arrow &&
              arrow.show)
              ? ''
              : 'hidden'
          }`}
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
            (pager &&
              typeof pager === 'object' &&
              'show' in pager &&
              pager.show)
              ? ''
              : 'hidden'
          }`}
        >
          <div
            ref={paginationRef}
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
            typeof arrow === 'object' && arrow.rightAddClass
          )} ${
            arrow === true ||
            (arrow &&
              typeof arrow === 'object' &&
              'show' in arrow &&
              arrow.show)
              ? ''
              : 'hidden'
          }`}
        >
          <img
            src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg"
            className="w-7 md:w-8 lg:w-10"
            alt=""
          />
        </button>
      </div>

      {/* <p>swiper-slide-active index: {swiperIndex}</p> */}
      {/* <p>a Active index: {activeIndex}</p> */}
    </div>
  );
};