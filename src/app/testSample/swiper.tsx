import React, { useRef, useState, useLayoutEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperProps } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay} from 'swiper/modules'; // Scrollbar, A11y
import SlideTabs from './SlideTab';
import 'swiper/swiper-bundle.css';
interface SwiperSliderProps {
  slides: {
    active?: string,
    title?: string,
    sub_tit?: string,
    url?: string,
    imgUrl?: string
  }[],
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
  slides,
  loop,
  auto,
  space,
  delay = 400,
  speed = '500'
}) => {
  const [swiperIndex, setSwiperIndex] = useState(0); // -> 페이지네이션용
  const [swiperTotalIndex, setSwiperTotalIndex] = useState(0); // -> 페이지네이션용
  const [isBeginning, setIsBeginning] = useState(true); // 처음 상태
  const [isEnd, setIsEnd] = useState(false); // 마지막 상태
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const swiperRefs = useRef<SwiperClass[]>([]);

  useLayoutEffect(() => {
    let timer: number;
    const activeSlide = () => {
      const swiperWrap = document.querySelector(`.swiper-${id}`);
      if(swiperWrap) {
        const slides = swiperWrap.querySelectorAll('.swiper-slide a');
        slides.forEach((slide, index) => {
          if (slide.classList.contains('active')) {
            swiperRefs.current[swiperIndex]?.slideTo(index, 100, false);
            console.log(swiperRefs.current[swiperIndex]);
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
      handleResize();
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
    swiperRefs.current[swiperIndex]?.slidePrev()
  }

  const handleNext = () => {
    swiperRefs.current[swiperIndex]?.slideNext()
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

  const swiperOption: SwiperProps  = {
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
      swiperRefs.current[swiperIndex] = swiper;
      handleSwiperInit(swiper);
      setActiveIndex(swiper.activeIndex);
      const paginationCount = swiper.pagination.el?.childElementCount || 0;
      // console.log(paginationCount)
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
      setSwiperIndex(swiper.realIndex);
    },
    onResize: (swiper: SwiperClass) => {
      if(swiper) {
        const paginationCount = swiper.pagination.el?.childElementCount || 0;
        setSwiperTotalIndex(paginationCount);
        console.log(paginationCount)
        setIsVisible(paginationCount > 1);
      }
      if(auto) {
        if (swiperRefs.current[swiperIndex].autoplay) {
          swiperRefs.current[swiperIndex].autoplay.start();
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
        <div className={`controller ${visible ? '':'hidden'}`}>
          <button onClick={handlePrev} className={isBeginning ? 'opacity-70' : ''}>왼쪽 버튼</button>
          <div className={`pagination ${pager ? '' : 'hidden'}`}>
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