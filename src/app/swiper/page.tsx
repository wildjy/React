"use client";
import React from "react";
import { useEffect, useState } from 'react'
import Title from "../../sharedUI/Title/TitleDemo";
import SwiperComponent from "../../sharedUI/Swiper/Swiper";
import { SwiperSlider} from "../../sharedUI/Swiper/SwiperSlider";
import { SwiperGroup } from "../../sharedUI/Swiper/SwiperGroup";
import { RecomGroupSwiper } from "./RecomGroupSwiper";
import { SwiperSlide } from 'swiper/react';

const SwiperPage: React.FC = () => {
  const [activeIndexes, setActiveIndexes] = useState<{ [key: string]: number }>({});

  const handleSlideChange = (id: number, swiper: any) => {
    const activeIndex = swiper.slides.findIndex((slide: HTMLElement) =>
      slide.querySelector('a')?.classList.contains('active')
    );
    setActiveIndexes((prev) => ({ ...prev, [id]: activeIndex }));
  };

  const slidesItems = [
    {
      active: '',
      url: '',
      title: '3월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      url: '',
      title: '5월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      url: '',
      title: '6월 학력평가',
      sub_txt: "텍스트222~",
    },
    {
      active: '',
      url: '',
      title: '7월 학력평가',
      sub_txt: "텍스트 333~",
    },
    {
      active: 'active',
      url: '',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      url: '',
      title: '10월 학력평가',
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
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/국어_최서희.jpg',
    },
    {
      active: '',
      url: '',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
  ];

  type Slide = {
    id: number;
    url: string;
    label: string;
  };

  useEffect(() => {
    const fetchSlides = [
      {
        id: 1,
        url: 'https://image.jinhak.com/jinhakImages/react/icon/icon_total_univ.svg',
        label: '전체 \n (21개 대학)',
      },
      {
        id: 2,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: '대학명',
      },
      {
        id: 3,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 4,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 5,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 6,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 7,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 8,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
      {
        id: 9,
        url: 'https://imgorg.jinhak.com/renewal2009/UnivLogo/1120m.gif',
        label: 'ㅇㅇㅇdd \n 대학명',
      },
    ];
    setSlides(fetchSlides);
  }, []);

  const [slides, setSlides] = useState<Slide[]>([]);

  const [isSelect, setIsSelect] = useState<number[]>([2, 3]);
  const [isSelectInfo, setIsSelectInfo] = useState<Slide[]>(slides.filter((item) => isSelect.includes(item.id)));

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
      <div className="p-5 flex gap-y-7 flex-wrap">

        <div className="stepbar w-full">
          <Title title="Swiper" size="md" bold="semi" />

          <div>
            <div className="mb-10">
              <SwiperSlider autoplay pager arrow freeMode loop delay={2000}>
                {slides_img.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    style={{width: 'auto'}}
                    className="pr-5 last:pr-0 flex justify-center items-center w-auto "
                  >
                    <a
                      href={slide.url}
                      className={`${slide.active} block py-2 font-bold ${
                        slide.active
                          ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
                          : ''
                      }`}
                    >
                        <img src={slide.imgUrl} alt="" />
                    </a>
                  </SwiperSlide>
                ))}
              </SwiperSlider>
            </div>

            <div className="mb-10">
              <SwiperSlider pager arrow freeMode delay={1800}>
                {slidesItems.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    style={{width: 'auto'}}
                    className="pr-5 last:pr-0 flex justify-center items-center w-auto "
                  >
                    <a
                      href={slide.url}
                      className={`${slide.active} block py-2 font-bold ${
                        slide.active
                          ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
                          : ''
                      }`}
                    >
                        {/* <img src={slide.imgUrl} alt="" /> */}
                        <p className="text-lg">{slide.title}</p>
                        <p className='text-md'>{slide.sub_txt}</p>
                    </a>
                  </SwiperSlide>
                ))}
              </SwiperSlider>
            </div>

            <div className="border-b border-gray-300">
              <SwiperComponent
                id={1}
                slides={slidesItems}
                arrow={false}
                pager={false}
                onSlideChange={(swiper) => handleSlideChange(1, swiper)}
              >
                {slidesItems.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    style={{width: 'auto'}}
                    className="pr-5 last:pr-0 flex justify-center items-center w-auto "
                  >
                    <a
                      href={slide.url}
                      className={`${slide.active} block py-2 font-bold ${
                        slide.active
                          ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
                          : ''
                      }`}
                    >
                        {/* <img src={slide.imgUrl} alt="" /> */}
                        <p className="text-lg">{slide.title}</p>
                        <p className='text-md'>{slide.sub_txt}</p>
                    </a>
                  </SwiperSlide>
                ))}
              </SwiperComponent>
            </div>

            <SwiperComponent
              id={2}
              slides={slides_img}
              image={true}
              arrow={true}
              pager={false}
              onSlideChange={(swiper) => handleSlideChange(2, swiper)}
            >
              {slides_img.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  style={{width: 'auto'}}
                  className="pr-5 last:pr-0 flex justify-center items-center w-auto "
                >
                  <a
                    href={slide.url}
                    className={`${slide.active} block py-2 font-bold ${
                      slide.active
                        ? 'text-blue-700 border-b-[0.313rem] border-blue-700 '
                        : ''
                    }`}
                  >
                      <img src={slide.imgUrl} alt="" />
                  </a>
                </SwiperSlide>
              ))}
            </SwiperComponent>

            <p>Active index for Swiper 1: {activeIndexes[1]}</p>
            <p>Active index for Swiper 2: {activeIndexes[2]}</p>
          </div>

          <div>

          <RecomGroupSwiper
            items={slides}
            isSelect={isSelect}
            setIsSelect={setIsSelect}
            isSelectInfo={isSelectInfo}
            setIsSelectInfo={setIsSelectInfo}
          />

          {isSelect}
          {isSelectInfo.map((info, i) => (
            <div key={i}>
              <p>{info.id}</p>
              <p>{info.url}</p>
              <p>{info.label}</p>
            </div>
          ))}
          </div>
        </div>

        <div className="w-full h-[500px] portrait:bg-blue-500 max-950:landscape:bg-green-500"></div>
      </div>

      </div>
    </div>
  );
};

export default SwiperPage;
