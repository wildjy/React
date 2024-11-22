import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Swiper의 스타일을 반드시 가져와야 합니다.
import 'swiper/swiper-bundle.css';

// TypeScript를 사용할 경우 Swiper 관련 설정에 대해 props를 정의할 수 있습니다.
interface SwiperComponentProps {
  slidesCustom: {padding: string, scale: number, title: string, width: string, sub_txt: string}[]; // 슬라이드의 콘텐츠를 배열로 받을 수 있도록 설정
}

const SwiperCustom: React.FC<SwiperComponentProps> = ({ slidesCustom }) => {
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const breakPoint = window.innerWidth;

      if (breakPoint < 1024) {
        setIsNavigationEnabled(true); // 1024px 미만에서는 활성화
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
        modules={[Navigation, Pagination, Navigation]} // ...(isNavigationEnabled ? [Navigation] : [])
        navigation={isNavigationEnabled} // 상태에 따라 navigation 활성화
        spaceBetween={10}
        slidesPerView= "auto" // 슬라이드 너비가 CSS로 지정됨
        loop={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        // onSlideChange={() => console.log('슬라이드가 변경되었습니다!')}
        // onSwiper={(swiper) => console.log('Swiper 인스턴스:', swiper)}
        className={`w-full`}
      >
        {slidesCustom.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="ml-2 first:ml-0"
            style={{paddingLeft: slide.padding, paddingRight: slide.padding, scale: slide.scale, width: slide.width }} // 슬라이드의 너비 설정
          >
            <div className="px-5 py-5 text-center font-bold text-white bg-slate-400  rounded-lg">{slide.title} {slide.sub_txt}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperCustom;