import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Swiper의 스타일을 반드시 가져와야 합니다.
import 'swiper/swiper-bundle.css';

// TypeScript를 사용할 경우 Swiper 관련 설정에 대해 props를 정의할 수 있습니다.
interface SwiperComponentProps {
  slides: string[]; // 슬라이드의 콘텐츠를 배열로 받을 수 있도록 설정
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({ slides }) => {
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        setIsNavigationEnabled(true); // 768px 이상, 1024px 미만에서는 활성화
      } else {
        setIsNavigationEnabled(false); // 그 외에는 비활성화
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    return () => {
      // 리스너 제거
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, ...(isNavigationEnabled ? [Navigation] : [])]}
        spaceBetween={0}
        slidesPerView= "auto" // 슬라이드 너비가 CSS로 지정됨
        loop={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={isNavigationEnabled} // 상태에 따라 navigation 활성화
        pagination={{ clickable: true }}
        // onSlideChange={() => console.log('슬라이드가 변경되었습니다!')}
        // onSwiper={(swiper) => console.log('Swiper 인스턴스:', swiper)}
        className={`w-full`}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="px-4 ml-2 first:ml-0 bg-slate-400 rounded-lg shadow-lg"
            style={{ width: "auto" }} // 슬라이드의 너비 설정
          >
            <div className="px-5 py-5 text-center font-bold text-white">{slide}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperComponent;