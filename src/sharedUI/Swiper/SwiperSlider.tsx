/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from "../common/cn";
import { Swiper as SwiperClass } from 'swiper';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css/effect-fade';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  EffectFade,
  Autoplay,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules';
import { Swiper, SwiperProps } from 'swiper/react';
import { SwiperController } from './SwiperController';

type slideType = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
type pagerType = 'bullets' | 'fraction' | 'progressbar' | 'custom';

export type SwiperControllerOption = {
  show: boolean;
  type: 'default' | 'fraction';
  addClass?: string;
};

export type SwiperArrowOption =
  | boolean
  | {
      show: boolean;
      leftAddClass?: string;
      rightAddClass?: string;
    };

export type SwiperPagerOption =
  | boolean
  | {
      show: boolean;
      type?: pagerType;
      addClass?: string;
      pagerClass?: string;
    };
export type SwiperScrollbarOption = {
  show: boolean;
  hide?: boolean;
  draggable?: boolean;
  sizeClass?: string;
  addClass?: string;
};

interface swiperProps {
  id?: number | string;
  slideType?: slideType;
  active?: number;
  freeMode?: boolean;
  loop?: boolean;
  autoplay?: { auto: boolean; delay?: number };
  centeredSlides?: boolean;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  children?: React.ReactNode;
  addClass?: string;
  image?: boolean;
  allowTouchMove?: boolean;
  arrow?: SwiperArrowOption;
  pager?: SwiperPagerOption;
  controller?: SwiperControllerOption;
  scrollbar?: SwiperScrollbarOption;
  breakpoints?: Record<number, SwiperProps>;
  onSlideChange?: (swiper: SwiperClass) => void;
  onSwiper?: (swiper: SwiperType) => void;
  slideWidth?: string; // storybook용 슬라이드 너비 설정
  slideHeight?: string; // storybook용 슬라이드 높이 설정
}

export const SwiperSlider: React.FC<swiperProps> = ({
  id = 'swiper-default',
  slideType = 'slide',
  active = 1,
  freeMode = true,
  loop = false,
  autoplay = { auto: false, delay: 2500 },
  centeredSlides = false,
  slidesPerView = 'auto',
  spaceBetween = 0,
  children,
  addClass,
  allowTouchMove = true,
  arrow = { show: false },
  pager = { show: false },
  controller = { show: true, type: 'default' },
  scrollbar = { show: false },
  breakpoints,
  onSlideChange,
  onSwiper,
}) => {
  const [contentWidth, setContentWidth] = useState<number>(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const paginationRef = useRef(null);

  const pagination = {
    el: `.swiper-${id}-pagination`,
    type: (typeof pager === 'object' && pager?.type) || 'bullets',
    clickable: true,
    renderBullet: function (index: number, className?: string) {
      return `
      <span class="
      ${cn(
        `${className} flex !w-[0.375rem] !h-[0.375rem] md:!w-[0.625rem] md:!h-[0.625rem]
        !opacity-100 !bg-gray-400 [&.swiper-pagination-bullet-active]:!bg-gray-800
      `,
        typeof pager === 'object' && pager.pagerClass
      )}
      ">
        <span class="sr-only">${index + 1}</span>
      </span>`;
    },
  };

  const scrollbarOption = {
    el: `.swiper-${id}-scrollbar`,
    hide: scrollbar?.hide ?? false,
    draggable: scrollbar?.draggable ?? true,
  };

  useEffect(() => {
    const swiper = swiperRef.current;

    const timer = setTimeout(() => {
      swiperRef.current?.update();
    }, 50);

    if (!swiper || !swiper.autoplay) return;

    if (swiper.autoplay) {
      if (typeof autoplay === 'object' && autoplay.auto) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
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
  // useLayoutEffect(() => {
  //   const activeSlide = () => {
  //     const swiperWrap = document.querySelector(`.swipers-${id}`);
  //     if (swiperWrap) {
  //       const slides = swiperWrap.querySelectorAll(
  //         '.swiper-slide a, .swiper-slide button, .swiper-slide div'
  //       );
  //       slides.forEach((slide, index) => {
  //         if (slide.classList.contains('active')) {
  //           swiperRef.current?.slideTo(index, 100, false);
  //         }
  //       });
  //     }
  //   };
  //   activeSlide();
  // }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || typeof active !== 'number') return;

    // loop 대응
    if (swiper.params.loop) {
      console.log('loop slideToLoop', active - 1);
      swiper.slideToLoop(active - 1, 0, false);
    } else {
      swiper.slideTo(active - 1, 0, false);
    }
  }, [active]);

  const multiOnSlideChange = (swiper: SwiperClass) => {
    if (onSlideChange) {
      onSlideChange(swiper);
    }
  };

  const swiperOption: SwiperProps = {
    effect: slideType,
    fadeEffect: { crossFade: slideType === 'fade' ? true : false },
    initialSlide: (active ?? 1) - 1,
    freeMode: centeredSlides ? false : freeMode,
    autoplay:
      autoplay && typeof autoplay === 'object' && autoplay.auto
        ? {
            delay: autoplay?.delay,
            disableOnInteraction: false,
          }
        : undefined,
    centeredSlides: centeredSlides,
    loop: loop,
    spaceBetween: spaceBetween,
    slidesPerView: slidesPerView,
    keyboard: {
      enabled: true,
      // onlyInViewport: true,
    },
    className: 'visible !important', //  !overflow-visible
    allowTouchMove: allowTouchMove, // (false-스와이핑안됨)버튼으로만 슬라이드 조작이 가능
    watchOverflow: true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: `.swiper-${id}-next`,
      prevEl: `.swiper-${id}-prev`,
    },
    scrollbar: scrollbarOption,
    pagination: pagination, // {{type: 'fraction', clickable: true }}
    breakpoints: breakpoints,
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
        {...swiperOption}
        modules={[
          EffectFade,
          FreeMode,
          Navigation,
          Pagination,
          Autoplay,
          Scrollbar,
        ]}
        onSwiper={onSwiper}
      >
        {children}
      </Swiper>

      <SwiperController
        ref={paginationRef}
        id={id}
        controller={controller}
        pager={pager}
        arrow={arrow}
        scrollbar={scrollbar}
      />

      {/* <p>swiper-slide-active index: {swiperIndex}</p> */}
      {/* <p>a Active index: {activeIndex}</p> */}
    </div>
  );
};
