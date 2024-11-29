"use client";
import React from "react";
import { useRef, useState, ChangeEvent } from 'react';
import Title from "../../sharedUI/Title/Title";
import SwiperComponent from "../../sharedUI/Swiper/Swiper";

const SwiperPage: React.FC = () => {
  const [activeIndexes, setActiveIndexes] = useState<{ [key: string]: number }>({});

  const handleSlideChange = (id: number, swiper: any) => {
    const activeIndex = swiper.slides.findIndex((slide: HTMLElement) =>
      slide.querySelector('a')?.classList.contains('active')
    );
    setActiveIndexes((prev) => ({ ...prev, [id]: activeIndex }));
  };

  const slidesCustom = [
    {
      width: 'auto',
      title: '슬라이드 1',
      sub_txt: "텍스트111~",
    },
    {
      width: 'auto',
      title: '슬라이드 1',
      sub_txt: "텍스트111~",
    },
    {
      padding: '60px',
      scale: '1.2',
      width: '400px',
      title: '슬라이드 2',
      sub_txt: "텍스트222~",
    },
    {
      width: 'auto',
      title: '슬라이드 3',
      sub_txt: "텍스트 333~",
    },
    {
      width: 'auto',
      title: '슬라이드 4',
      sub_txt: "텍스트 444~",
    },
  ];

  const slides = [
    {
      active: '',
      title: '3월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '5월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '6월 학력평가',
      sub_txt: "텍스트222~",
    },
    {
      active: '',
      title: '7월 학력평가',
      sub_txt: "텍스트 333~",
    },
    {
      active: 'active',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '10월 학력평가',
      sub_txt: "텍스트 444~",
    },
  ];

  const slides_1 = [
    {
      active: '',
      title: '3월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '5월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '6월 학력평가',
      sub_txt: "텍스트222~",
    },
    {
      active: '',
      title: '7월 학력평가',
      sub_txt: "텍스트 333~",
    },
    {
      active: '',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '10월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '10월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: 'active',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
  ];

  const slides_img = [
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/덕성여대(2).jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/국어_최서희.jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/덕성여대(2).jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/국어_최서희.jpg',
    },
    {
      active: 'active',
      url: '',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
  ];

  const slides_img2 = [
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: 'active',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/덕성여대(2).jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/국어_최서희.jpg',
    },
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: '',
      url: '',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
  ];

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
      <div className="p-5 flex gap-y-7 flex-wrap">

        <div className="stepbar w-full">
          <Title title="Swiper" size="md" bold="semi" />

          <div>

            <SwiperComponent id={1} slides={slides} onSlideChange={(swiper) => handleSlideChange(1, swiper)} />
            <SwiperComponent id={2} slides={slides_img2} onSlideChange={(swiper) => handleSlideChange(2, swiper)} />

            <p>Active index for Swiper 1: {activeIndexes[1]}</p>
            <p>Active index for Swiper 2: {activeIndexes[2]}</p>
          </div>

        </div>

        <div className="w-full h-[500px] portrait:bg-blue-500 max-950:landscape:bg-green-500"></div>
      </div>

      </div>
    </div>
  );
};

export default SwiperPage;