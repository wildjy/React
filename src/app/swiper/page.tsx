"use client";
import React from "react";
import { useEffect, useState } from 'react'
import Title from "../../sharedUI/Title/TitleDemo";
import SwiperComponent from "../../sharedUI/Swiper/Swiper";
import { SwiperGroup } from "../../sharedUI/Swiper/SwiperGroup";
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
    ];
    setSlides(fetchSlides);
  }, []);

  const selectIds = [2, 3];
  const [slides, setSlides] = useState<Slide[]>([]);
  const [groupSwiper, setGroupSwiper] = useState<Slide[][]>([]);
  const [isSelect, setIsSelect] = useState<number[]>(selectIds);
  const isAllSelected = isSelect.length === slides.length;

  const selectEvent = (id: number) => {
    if (id === 1) {
      if (isAllSelected) {
        setIsSelect([]);
      } else {
        setIsSelect(slides.slice(1).map((i) => i.id));
      }
    }
    setIsSelect((prev) => (prev.includes(id) ? prev.filter((id) => id !== id) : [...prev, id]));
  };

  console.log(groupSwiper);
  const [disableNav, setDisableNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const groupImages = (arr: Slide[], size: number, isMobile: boolean): Slide[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => {
      const group = arr.slice(i * size, i * size + size);

      if (isMobile && arr.length <= 3) {
        return arr.slice(i * size, size);
      }
      if (!isMobile && arr.length <= 4) {
        return arr.slice(i * size, size);
      }
      while (group.length < size) {
        group.push({
          id: 0,
          url: '',
          label: '',
        }); // empty
      }
      return group;
    });
  };

  useEffect(() => {
    const resizeEvent = () => {
      const win = window.innerWidth;
      setWindowWidth(win);
    };
    resizeEvent();
    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, []);

  useEffect(() => {
    const isMobile = windowWidth < 768;
    const groupSize = isMobile ? 6 : 8;

    setGroupSwiper(groupImages(slides, groupSize, isMobile));
    setDisableNav(slides.length > groupSize);
  }, [slides, windowWidth]);
  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
      <div className="p-5 flex gap-y-7 flex-wrap">

        <div className="stepbar w-full">
          <Title title="Swiper" size="md" bold="semi" />

          <div>

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
            <SwiperGroup arrow={disableNav} pager freeMode={false} slidesPerView={1}>
              {groupSwiper.map((groupSlide, index) => (
                <SwiperSlide key={index} style={{ width: '100%' }}>
                  <div className={`flex flex-wrap gap-3 md:gap-5`}>
                    {groupSlide.map((src, idx) => (
                      <div
                        key={idx}
                        onClick={src.url === '' ? undefined : () => selectEvent(src.id)}
                        className={`${windowWidth < 768 ? 'w-[calc(100%/3-0.35rem)]' : 'w-[calc(100%/4-0.4rem)] md:w-[calc(100%/4-0.75rem)]'}
                        ${idx === 0 ? 'py-5 sm:py-7 lg:py-12' : ''}
                        ${
                          src.id === 1
                            ? isAllSelected
                              ? 'text-blue-800 border-blue-800'
                              : 'border-gray-100'
                            : isSelect.includes(src.id)
                            ? 'text-blue-800 border-blue-800'
                            : 'border-gray-100'
                        }
                        py-5 sm:py-6 md:py-8 lg:py-10
                        h-[6.25rem] sm:h-[8.75rem] md:h-[10.25rem] lg:h-[13.75rem]
                        flex flex-wrap content-start items-center justify-center text-center border
                        rounded-lg cursor-pointer
                        ${
                          src.url === ''
                            ? `
                          bg-[length:4.375rem_3.125rem] lg:bg-[length:7.5rem_5.375rem] content-[""] bg-center bg-no-repeat
                          bg-[url(https://image.jinhak.com/jinhakImages/react/icon/icon_empty_univ.svg)]
                          `
                            : ''
                        }`}
                      >
                        <img src={src.url} alt={src.label} className={`w-[2.375rem] sm:w-[3.125rem] md:w-[3.5rem] lg:w-[5rem]`} />
                        <p
                          className={`${idx === 0 && 'pt-3 sm:pt-5 md:pt-6'}
                          pt-3 sm:pt-4 md:pt-5 lg:pt-6 w-full
                          text-2xs sm:text-base xl:text-lg
                          leading-[1.2] xl:leading-[1.43]
                          whitespace-pre-line`}
                        >
                          {src.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </SwiperGroup>
          </div>
        </div>

        <div className="w-full h-[500px] portrait:bg-blue-500 max-950:landscape:bg-green-500"></div>
      </div>

      </div>
    </div>
  );
};

export default SwiperPage;
