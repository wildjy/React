'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from "../common/cn";
import { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperProps } from 'swiper/react';
import { SwiperController } from './SwiperController';

interface swiperProps {
  active?: number;
  freeMode?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  slidesPerView?: number | 'auto';
  slideWidth?: string; // storybook용 슬라이드 너비 설정
  slideHeight?: string; // storybook용 슬라이드 높이 설정
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

export const SwiperGroup: React.FC<swiperProps> = ({
  active,
  freeMode = true,
  loop = false,
  autoplay,
  delay = 2500,
  slidesPerView = 'auto',
  spaceBetween = 0,
  children,
  addClass,
  id = 'swiper-default',
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
    renderBullet: function (index: number, className?: string) {
      return `
      <span class="!w-[0.375rem] !h-[0.375rem] md:!w-[0.625rem] md:!h-[0.625rem] ${className}" style="background-color: #272727">
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

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || typeof active !== 'number') return;

    // loop 대응
    if (swiper.params.loop) {
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
    initialSlide: active ?? 0,
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
      // console.log(swiper)
      swiperRef.current = swiper;
      // handleSwiperInit(swiper);
      // ⭐ navigation 다시 연결
      if (
        swiper.params.navigation &&
        typeof swiper.params.navigation !== 'boolean'
      ) {
        swiper.params.navigation.nextEl = `.swiper-${id}-next`;
        swiper.params.navigation.prevEl = `.swiper-${id}-prev`;
      }

      // ⭐ 재초기화
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();

      // ⭐ 무조건 첫 슬라이드로 이동
      swiper.slideTo(0, 0);
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
    <div className={` ${cn(`swipers-${id} relative`, addClass)}`}>
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
        {...swiperOption}
      >
        {children}
      </Swiper>

      <SwiperController
        ref={paginationRef}
        id={id}
        pager={pager}
        arrow={arrow}
      />
    </div>
  );
};
