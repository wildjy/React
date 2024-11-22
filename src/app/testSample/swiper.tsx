import React, { useRef, useState, useEffect } from 'react';
import { cn } from "../../sharedUI/common/cn";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { FreeMode, Navigation, Pagination, Autoplay , Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface SwiperComponentProps {
  slides: {title: string, sub_txt: string}[];
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({  slides }) => {
  const [swiperIndex, setSwiperIndex] = useState(0); // -> 페이지네이션용
  const [swiperTotalIndex, setSwiperTotalIndex] = useState(0); // -> 페이지네이션용
  const [visible, setVisible] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true); // 처음 상태
  const [isEnd, setIsEnd] = useState(false); // 마지막 상태
  const [swiper, setSwiper] = useState<SwiperClass>(); // -> 슬라이드용
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);

  const paginationRef = useRef(null);

  const pagination = {
    el: paginationRef.current,
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  useEffect(() => {
    const handleResize = () => {
      const breakPoint = window.innerWidth;
      if (breakPoint < 1024) {
        setIsNavigationEnabled(true);
      } else {
        setIsNavigationEnabled(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  swiper?.on('slideChange', () => {
    console.log('Slide changed to:', swiper.activeIndex);
  });

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

  return (
    <>
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Autoplay,  Navigation]} // ...(isNavigationEnabled ? [Navigation] : [])
        navigation={isNavigationEnabled}
        // navigation={true}
        spaceBetween={10}
        freeMode={true}
        slidesPerView= "auto" // 슬라이드 너비가 CSS로 지정됨
        loop={false}
        // autoplay={{
        //   delay: 0,
        //   disableOnInteraction: false,
        // }}
        pagination={pagination} // {{ clickable: true }}
        onSlideChange={(e) => {
          console.log('슬라이드가 변경되었습니다!', e);
          updateNavigationState(e)
        }}
        onActiveIndexChange={(e) => {
          setSwiperIndex(e.realIndex)
        }}
        onSwiper={(e) => {
          handleSwiperInit
          // setSwiper(e);
          console.log('Swiper 0인스턴스:', e.pagination.el)
          // console.log('Swiper 인스턴스:', e.pagination.el.childElementCount)
        }}
        onBeforeInit={(e) => {
          // 초기화 전에 네비게이션 버튼을 swiper에 할당합니다.
          setSwiper(e);
          console.log('Swiper 0인스턴스:', e)
        }}
        onResize={(e) => {
          setSwiper(e);
          // console.log('Swiper 0인스턴스:', e)
          // console.log('Swiper total bullet:', e.pagination.el.childElementCount)
          setSwiperTotalIndex(e.pagination.el.childElementCount);
          setVisible(e.pagination.el.childElementCount === 1);
          // console.log(e.slidesEl.firstElementChild)
        }}
        className={`w-full`}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="ml-2 first:ml-0"
            style={{width: "auto" }} // 슬라이드의 너비 설정
          >
            <div className="px-5 py-5 text-center font-bold text-white bg-slate-400  rounded-lg">{slide.title} {slide.sub_txt}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={!isNavigationEnabled ? 'hidden':''}>
        <button onClick={handlePrev} className={isBeginning ? 'opacity-50' : ''}>왼쪽 버튼</button>
        <div>
          <span>{swiperIndex + 1}</span>
          <span>{'/'}</span>
          <span>{swiperTotalIndex}</span>
        </div>
        <div ref={paginationRef}></div>
        <button onClick={handleNext} className={isEnd ? 'opacity-50' : ''}>오른쪽 버튼</button>
      </div>
    </>
  );
};

export default SwiperComponent;