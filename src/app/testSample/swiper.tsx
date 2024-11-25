import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { cn } from "../../sharedUI/common/cn";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay , Scrollbar, A11y } from 'swiper/modules';
import SlideTabs from './SlideTab';
import 'swiper/swiper-bundle.css';

interface SwiperSliderProps {
  slides: {active: string, title: string, sub_txt: string}[];
  // initialSlide: number;
  auto: boolean;
  delay: number;
  speed: number;
  loop: boolean;
}

const SwiperSlider: React.FC<SwiperSliderProps> = ({ slides, loop, auto, delay, speed}) => {
  const [swiperIndex, setSwiperIndex] = useState(0); // -> 페이지네이션용
  const [swiperTotalIndex, setSwiperTotalIndex] = useState(0); // -> 페이지네이션용
  const [isVisible, setIsVisible] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true); // 처음 상태
  const [isEnd, setIsEnd] = useState(false); // 마지막 상태
  const [swiper, setSwiper] = useState<SwiperClass>(); // -> 슬라이드용
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const paginationRef = useRef(null);
  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  useLayoutEffect(() => {
    let timer: number;
    const handleResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const breakPoint = window.innerWidth;

        if (breakPoint < 1024) {
          setIsNavigationEnabled(true);
        } else {
          setIsNavigationEnabled(false);
        }
      }, 50);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // active slide
    const slides = document.querySelectorAll('.swiper-slide a');
    slides.forEach((slide, index) => {
      if (slide.classList.contains('active')) {
        swiperRef.current?.slideTo(index, 100, false);
      }
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // swiper?.on('slideChange', () => {
  //   console.log('Slide changed to:', swiper.activeIndex);
  // });

  const handlePrev = () => {
    swiper?.slidePrev()
  }
  const handleNext = () => {
    swiper?.slideNext()
  }

  const handleSwiperInit = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const updateNavigationState = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

useEffect(() => {
}, [])

  return (
    <>
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Autoplay, ...(isNavigationEnabled ? [Navigation] : [])]} // ...(isNavigationEnabled ? [Navigation] : [])
        freeMode={false}
        // initialSlide={ initialSlide }
        slidesPerView= "auto"
        spaceBetween={0}
        autoplay={
          auto ? {
            delay: delay,
            disableOnInteraction: false,
          }: false
        }
        speed={speed}
        loop={loop}
        // navigation={true}
        navigation={isNavigationEnabled}
        pagination={pagination} // {{ clickable: true }}
        onSwiper={(e) => {
          // e.slideTo(2);
          swiperRef.current = e
          handleSwiperInit;
          setActiveIndex(e.activeIndex);
          console.log('activeIndex', e.activeIndex);
          console.log('e.pagination.el', e.pagination);
          console.log('e.pagination.el', e.pagination.bullets.length);
          console.log('e.pagination.el', e.pagination.el === null);
          // setIsVisible(e.pagination.el === null);
        }}
        onSlideChange={(e) => {
          // console.log('슬라이드가 변경되었습니다!', e);
          updateNavigationState(e)
          setActiveIndex(e.activeIndex);
          // console.log('슬라이드가 변경되었습니다!', e.activeIndex);
        }}
        onActiveIndexChange={(e) => {
          setSwiperIndex(e.realIndex);
        }}
        onBeforeInit={(e) => {
          setSwiper(e);
        }}
        onResize={(e) => {
          setSwiper(e);
          setSwiperTotalIndex(e.pagination.el.childElementCount);
          // setIsVisible(e.pagination.el.childElementCount === 1);
          // console.log('e.pagination.el.childElementCount', e.pagination.el);
        }}
        className={`swiper_lnb w-full`}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="mr-[3.75rem]" style={{width: "auto" }}>
            {/* slide.. */}
            <SlideTabs slide={ slide } isActive={ activeIndex === index } />
            {/* slide.. */}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={!isNavigationEnabled ? 'hidden':''}>
        <button onClick={handlePrev} className={isBeginning ? 'opacity-70' : ''}>왼쪽 버튼</button>
        <div>
          <span>{swiperIndex + 1}</span>
          <span>{'/'}</span>
          <span>{swiperTotalIndex}</span>
        </div>
        <div ref={paginationRef}></div>
        <button onClick={handleNext} className={isEnd ? 'opacity-70' : ''}>오른쪽 버튼</button>
      </div>

      <p>{isVisible ? "Navigation Enabled" : "Navigation Disabled"}</p>
    </>
  );
};

export default SwiperSlider;