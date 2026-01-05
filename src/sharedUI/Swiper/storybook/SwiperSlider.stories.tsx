import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { SwiperSlider } from '../SwiperSlider';
import { SwiperSlide } from 'swiper/react';
import { cn } from "../../common/cn";

// Storybook 메타 설정
export default {
  title: 'UI/Swiper/SwiperSlider',
  component: SwiperSlider,
  argTypes: {
    id: { control: 'number', description: 'Swiper 고유 ID' },
    active: { control: 'number', description: 'Swiper active' },
    slidesPerView: {
      control: 'number',
      description: '한 번에 보여질 슬라이드 개수',
    },
    spaceBetween: {
      control: 'number',
      description: '슬라이드 간 간격 (px)',
    },
    slideWidth: {
      control: 'text',
      description: 'storybook용 슬라이드 너비 설정',
    },
    slideHeight: {
      control: 'text',
      description: 'storybook용 슬라이드 높이 설정',
    },
    image: { control: 'boolean', description: '이미지 슬라이드 여부' },
    arrow: { control: 'boolean', description: '네비게이션 화살표 표시 여부' },
    pager: { control: 'boolean', description: '페이지네이션 표시 여부' },
    loop: { control: 'boolean', description: '슬라이드 반복 여부' },
    centeredSlides: {
      control: 'boolean',
      description: '활성 슬라이드를 가운데에 배치 여부',
    },
    autoplay: {
      control: 'boolean',
      description: '자동 슬라이드 설정 (delay, disableOnInteraction 등)',
      table: {
        type: {
          type: { summary: 'boolean' },
          defaultValue: { summary: false },
        },
      },
    },
    delay: { control: 'number', description: '슬라이드 넘어가는 속도' },
    slides: { control: 'object', description: '슬라이드 데이터 배열' },
    keyboard: { control: 'boolean', description: '키보드 조작 설정' },
  },
  tags: ['autodocs'],
} as Meta<typeof SwiperSlider>;

type Slide = {
  active?: string;
  title?: string;
  url?: string;
};

// Template 설정
const Template: StoryFn<typeof SwiperSlider> = (args) => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const fetchSlides = [
      { active: '', title: 'swiper 1', url: '#/' },
      { active: 'active', title: 'swiper slide 2', url: '#/' },
      { active: '', title: 'slide 3', url: '#/' },
      { active: '', title: 'swiper slide 4 slide 4', url: '#/' },
      { active: '', title: 'slide 5', url: '#/' },
      { active: '', title: 'swiper slide 6', url: '#/' },
      { active: '', title: 'swiper slide 7', url: '#/' },
      { active: '', title: 'slide 8', url: '#/' },
      { active: '', title: 'swiper slide 9', url: '#/' },
      { active: '', title: 'swiper slide 10', url: '#/' },
    ];
    setSlides(fetchSlides);
  }, []);
  // const activeIndex = slides.findIndex((s) => s.active === 'active');
  // console.log('activeIndex', activeIndex);
  return (
    <div className="">
      <SwiperSlider
        {...args}
        // active={activeIndex >= 0 ? activeIndex : args.active}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            style={{ width: args.slideWidth || 'auto' }}
            className={`${slide.active} swiper-slide flex items-center justify-center w-auto px-1 md:px-2`}
          >
            <div
              className={`${slide.active} ${cn(
                'flex items-center justify-center px-7 py-2 border',
                (args.active ?? 0) - 1 === index
                  ? ' border-blue-800 text-blue-800'
                  : '',
                args.slideHeight ? args.slideHeight : ''
              )}`}
            >
              <p>{slide.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </SwiperSlider>
    </div>
  );
};

// 기본 스토리
// export const Default__ = (args: { active: number }) => {
//   const [slides, setSlides] = useState<Slide[]>([]);

//   useEffect(() => {
//     const fetchSlides = [
//       { active: '', title: 'swiper 1', url: '#/' },
//       { active: 'active', title: 'swiper slide 2', url: '#/' },
//       { active: '', title: 'slide 3', url: '#/' },
//       { active: '', title: 'swiper slide 4 slide 4', url: '#/' },
//       { active: '', title: 'slide 5', url: '#/' },
//       { active: '', title: 'swiper slide 6', url: '#/' },
//       { active: '', title: 'swiper slide 7', url: '#/' },
//       { active: '', title: 'slide 8', url: '#/' },
//       { active: '', title: 'swiper slide 9', url: '#/' },
//       { active: '', title: 'swiper slide 10', url: '#/' },
//     ];
//     setSlides(fetchSlides);
//   }, []);

//   return (
//     <div className="h-[100px]">
//       <SwiperSlider {...args}>
//         {slides.map((slide, index) => (
//           <SwiperSlide
//             key={index}
//             style={{ width: '100%' }}
//             className={`swiper-slide`}
//           >
//             <div
//               className={`${cn(
//                 'flex items-center justify-center px-7 h-[100px] border',
//                 args.active === index ? 'border-blue-800' : ''
//               )}`}
//             >
//               <p>{slide.title}</p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </SwiperSlider>
//     </div>
//   );
// };

export const Default = Template.bind({});
Default.args = {
  id: 'default',
  active: 1,
  freeMode: false,
  autoplay: false,
  slideWidth: '100%',
  slideHeight: 'h-[150px]',
  loop: false,
  arrow: {
    show: true,
    leftAddClass: 'custom-left-arrow',
    rightAddClass: 'custom-right-arrow',
  },
  pager: {
    show: true,
    addClass: 'custom-pagination',
    pagerClass: 'custom-bullet',
  },
};

// active 슬라이드 스토리
export const ActiveSlide = Template.bind({});
ActiveSlide.args = {
  id: 'activeSlide',
  active: 6,
  freeMode: false,
  autoplay: false,
  slideWidth: '100%',
  slideHeight: 'h-[150px]',
  loop: false,
};

// slidesPerView
export const slidesPerView = Template.bind({});
slidesPerView.args = {
  id: 'slidesPerView',
  active: 1,
  slidesPerView: 3,
};

export const MenuStyle = Template.bind({});
MenuStyle.args = {
  id: 'swiper-1',
  active: 1,
  freeMode: false,
  autoplay: false,
  delay: 2500,
  loop: false,
  pager: {
    show: true,
    addClass: 'custom-pagination ',
    pagerClass: 'custom-bullet',
  },
};

// Loop
export const Loop = Template.bind({});
Loop.args = {
  id: 'loop',
  active: 9,
  freeMode: true,
  loop: true,
};

// centeredSlides
export const CenteredSlides = Template.bind({});
CenteredSlides.args = {
  id: 'centeredSlides',
  active: 1,
  // freeMode: false,
  centeredSlides: true,
};

// AutoPlay
export const AutoPlay = Template.bind({});
AutoPlay.args = {
  id: 'autoPlay',
  active: 1,
  autoplay: true,
  delay: 1000,
  freeMode: true,
  loop: true,
};

// Free Mode
export const FreeMode = Template.bind({});
FreeMode.args = {
  id: 'freeMode',
  active: 1,
  freeMode: true,
};

// 화살표 스토리
export const Arrows = Template.bind({});
Arrows.args = {
  id: 'arrows',
  active: 3,
  freeMode: false,
  arrow: {
    show: true,
  },
};

// 화살표 커스텀 스토리
export const ArrowsCustom = Template.bind({});
ArrowsCustom.args = {
  id: 'arrowsCustom',
  active: 1,
  freeMode: false,
  arrow: {
    show: true,
    leftAddClass: 'custom-left-arrow bg-red-500',
    rightAddClass: 'custom-right-arrow bg-blue-500',
  },
};

// 페이지네이션 스토리
export const Pagination = Template.bind({});
Pagination.args = {
  id: 'pagination',
  active: 1,
  loop: false,
  freeMode: false,
  arrow: false,
  pager: {
    show: true,
  },
};

// 페이지네이션 커스텀 스토리
export const PaginationCustom = Template.bind({});
PaginationCustom.args = {
  id: 'pagination',
  active: 1,
  loop: false,
  freeMode: false,
  arrow: false,
  pager: {
    show: true,
    addClass: 'custom-pagination ',
    pagerClass:
      'custom-bullet !bg-green-500 [&.swiper-pagination-bullet-active]:!bg-blue-800',
  },
};
