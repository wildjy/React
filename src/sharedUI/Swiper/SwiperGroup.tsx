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
  freeMode?: boolean;
  slidesPerView?: string | number;
  children?: React.ReactNode;
  addClass?: string;
  id?: number;
  image?: boolean;
  arrow?: boolean;
  pager?: boolean;
  onSlideChange?: (swiper: SwiperClass) => void;
}

export const SwiperGroup: React.FC<swiperProps> = ({
  freeMode = true,
  slidesPerView = 'auto',
  children,
  addClass,
  id,
  arrow = true,
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
    const timer = setTimeout(() => {
      swiperRef.current?.update();
    }, 50);

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
  }, [contentWidth]);

  // active slide
  useLayoutEffect(() => {
    const activeSlide = () => {
      const swiperWrap = document.querySelector(`.swipers-${id}`);
      if (swiperWrap) {
        const slides = swiperWrap.querySelectorAll('.swiper-slide a');
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
    autoplay: false, // { delay: 2500 }
    centeredSlides: false,
    loop: false,
    spaceBetween: 0,
    slidesPerView: slidesPerView,
    className: 'visible !important',
    watchOverflow: true,
    navigation: {
      nextEl: `.swiper-${id}-next`,
      prevEl: `.swiper-${id}-prev`,
    },
    pagination: pagination, // {{type: 'fraction', clickable: true }}
    onSwiper: (swiper: SwiperClass) => {
      // console.log(swiper)
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
      <Swiper modules={[FreeMode, Navigation, Pagination, Autoplay]} {...swiperOption}>
        {children}
      </Swiper>

      <div className={`controller`}>
        <button className={`swiper-${id}-prev absolute y_center -left-4 lg:-left-5 z-10 bg-white rounded-full  ${arrow ? '' : 'hidden'}`}>
          <img src="https://image.jinhak.com/jinhakImages/react/icon/arrow_off.svg" className="w-8 md:w-9 lg:w-11" alt="" />
        </button>
        <div className={`${pager ? '' : 'hidden'}`}>
          <div ref={paginationRef} className={`swiper-pagination !relative !mt-2 !md:mt-5 !top-auto !bottom-auto`}></div>
        </div>
        <button className={`swiper-${id}-next absolute y_center -right-4 lg:-right-5 z-10 bg-white rounded-full ${arrow ? '' : 'hidden'}`}>
          <img src="https://image.jinhak.com/jinhakImages/react/icon/arrow_on.svg" className="w-8 md:w-9 lg:w-11" alt="" />
        </button>
      </div>
    </div>
  );
};
