import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { cn } from "../../sharedUI/common/cn";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay , Scrollbar, A11y } from 'swiper/modules';
import SlideTabs from './SlideTab';
import SlideThumbs from './SlideImage';
import 'swiper/swiper-bundle.css';
interface SwiperSliderProps {
  // slides: {active: string, imgUrl: string}[];
  slides: {active: string, title: string, sub_txt: string}[];
  id?: string;
  freeMode?: boolean;
  pager?: boolean;
  auto?: boolean;
  space?: string;
  delay?: number;
  speed?: number;
  loop?: boolean;
}

const SwiperSlider: React.FC<SwiperSliderProps> = ({
  id,
  freeMode = true,
  pager = false,
  slides, loop,
  auto,
  space,
  delay = 400,
  speed = '500'
}) => {
  const [swiperIndex, setSwiperIndex] = useState(0); // -> 페이지네이션용
  const [swiperTotalIndex, setSwiperTotalIndex] = useState(0); // -> 페이지네이션용
  const [isBeginning, setIsBeginning] = useState(true); // 처음 상태
  const [isEnd, setIsEnd] = useState(false); // 마지막 상태
  const [swiper, setSwiper] = useState<SwiperClass>(); // -> 슬라이드용
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const swiperRef = useRef<any>(null);

  useLayoutEffect(() => {
    let timer: number;
    const activeSlide = () => {
      const swiperWrap = document.querySelector(`.swiper-${id}`);
      if(swiperWrap) {
        const slides = swiperWrap.querySelectorAll('.swiper-slide a');
        slides.forEach((slide, index) => {
          if (slide.classList.contains('active')) {
            swiperRef.current?.slideTo(index, 100, false);
          }
        });
      }
    }

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

    const multiHandler = () => {
      // handleResize();
      activeSlide();
    }

    multiHandler();
    window.addEventListener('resize', multiHandler);

    // active slide

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', multiHandler);
    };
  }, []);

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    swiperRef.current?.slideNext()
  }

  const handleSwiperInit = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const updateNavigationState = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const paginationRef = useRef(null);
  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  const swiperOption: any = {
    freeMode: freeMode,
    slidesPerView: "auto",
    spaceBetween: "0",
    autoplay: auto ? { delay: delay, disableOnInteraction: false, } : false,
    speed: speed,
    loop: loop,
    // navigation: delay <= 400 && loop === true ? false : isNavigationEnabled, //true isNavigationEnabled
    pagination: pagination,
    // updateOnWindowResize: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      handleSwiperInit;
      setActiveIndex(swiper.activeIndex);
    },
    onSlideChange: (swiper: SwiperClass) => {
      // console.log('슬라이드가 변경되었습니다!', e);
      updateNavigationState(swiper)
      setActiveIndex(swiper.activeIndex);
    },
    onActiveIndexChange: (swiper: SwiperClass) => {
      setSwiperIndex(swiper.realIndex);
    },
    onBeforeInit: (swiper: SwiperClass) => {
      setSwiper(swiper);
    },
    onResize: (swiper: SwiperClass) => {
      setSwiperTotalIndex(swiper.pagination.el.childElementCount);
      // console.log(swiper.pagination.el.childElementCount)
      const paginationCount = swiper.pagination.el?.childElementCount || 0;
      console.log(paginationCount)
      setIsVisible(paginationCount >= 2);
      if(auto) {
        if (swiperRef.current?.autoplay) {
          swiperRef.current.autoplay.start();
        }
      }
    },
  }

  return (
    <>
      <div className={`swiper-${id}`}>
        <Swiper
          modules={[FreeMode, Navigation, Pagination, Autoplay, ...(isNavigationEnabled ? [Navigation] : [])]} // ...(isNavigationEnabled ? [Navigation] : [])
          {...swiperOption}

          className={`swiper_lnb w-full`}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} style={{width: "auto" }}> {/* className={`mr-[3.75rem]`} */}
              <div style={{marginRight: `${space}` }} >
                {/* slide.. */}
                <SlideTabs slide={ slide } isActive={ activeIndex === index } />
                {/* <SlideThumbs slide={ slide } isActive={ activeIndex === index } /> */}
                {/* slide.. */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
{/* !isNavigationEnabled &&  */}
        <div className={`controller ${!visible ? 'hidden':''}`}>
          <button onClick={handlePrev} className={isBeginning ? 'opacity-70' : ''}>왼쪽 버튼</button>
          <div className={`pagination ${!pager && visible ? 'hidden' : ''}`}>
            <div>
              <span>{swiperIndex + 1}</span>
              <span>{'/'}</span>
              <span>{swiperTotalIndex}</span>
            </div>
            <div ref={paginationRef}></div>
          </div>
          <button onClick={handleNext} className={isEnd ? 'opacity-70' : ''}>오른쪽 버튼</button>
        </div>

        <p>{!isNavigationEnabled ? "Navigation Enabled" : "Navigation Disabled"}</p>
      </div>
    </>
  );
};

export default SwiperSlider;