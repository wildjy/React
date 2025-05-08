
'use client';
import React, { useState, useEffect } from 'react';
import { SwiperSlider } from '../Swiper/SwiperSlider';
import { SwiperSlide } from 'swiper/react';

type Slide = {
  active?: string;
  title?: string;
  url?: string;
};

export const SwiperGnb = () => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const fetchSlides = [
      { active: '', title: '이용안내', url: '#/' },
      { active: 'active', title: '클래스등록', url: '#/' },
      { active: '', title: '학생/성정 등록', url: '#/' },
      { active: '', title: '상담하기', url: '#/' },
      { active: '', title: '연간회원 전용', url: '#/' },
    ];
    setSlides(fetchSlides);
  }, []);

  return (
    <SwiperSlider id={1} arrow={false} addClass="md:-ml-4">
      {slides.length > 0 ? (
        slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ width: 'auto' }} className="flex items-center justify-center w-auto pr-0 last:pr-0">
            <a
              href={slide.url}
              className={`
                ${slide.active} px-4 py-1 block text-sm sm:text-base md:text-lg lg:text-lg font-bold rounded-full
                hover:bg-[#0a2b6e] hover:text-white
                ${
                  slide.active
                    ? 'bg-[#0a2b6e] text-white' //after:z-10 after:content-[""] after:absolute after:-bottom-[1px] after:w-full after:border-b-[0.313rem] after:border-blue-700
                    : ''
                }`}
            >
              <p className="">{slide.title}</p>
            </a>
          </SwiperSlide>
        ))
      ) : (
        <p>loading swiper-slide..</p>
      )}
    </SwiperSlider>
  );
};
