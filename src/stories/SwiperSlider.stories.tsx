import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import SwiperSlider from "../sharedUI/Swiper/Swiper";

// Storybook 메타 설정
export default {
  title: "Components/SwiperSlider",
  component: SwiperSlider,
  argTypes: {
    id: { control: "number", description: "Swiper 고유 ID" },
    image: { control: "boolean", description: "이미지 슬라이드 여부" },
    arrow: { control: "boolean", description: "네비게이션 화살표 표시 여부" },
    pager: { control: "boolean", description: "페이지네이션 표시 여부" },
    slides: { control: "object", description: "슬라이드 데이터 배열" },
  },
} as Meta<typeof SwiperSlider>;

// 기본 슬라이드 데이터
const slidesData = [
  {
    title: "슬라이드 1",
    sub_txt: "Sub Text 1",
    url: "#",
    imgUrl: "https://via.placeholder.com/300x150",
  },
  {
    title: "슬라이드 2",
    sub_txt: "Sub Text 2",
    url: "#",
    imgUrl: "https://via.placeholder.com/300x150",
  },
  {
    title: "슬라이드 3",
    sub_txt: "Sub Text 3",
    url: "#",
    imgUrl: "https://via.placeholder.com/300x150",
  },
];

// Template 설정
const Template: StoryFn<typeof SwiperSlider> = (args) => <SwiperSlider {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  id: 1,
  image: false,
  arrow: true,
  pager: true,
  slides: slidesData,
};

// 이미지 슬라이드 스토리
export const ImageSlides = Template.bind({});
ImageSlides.args = {
  id: 2,
  image: true,
  arrow: true,
  pager: false,
  slides: slidesData.map((slide) => ({
    ...slide,
    imgUrl: "https://via.placeholder.com/300x150",
  })),
};

// 화살표 숨김 스토리
export const WithoutArrows = Template.bind({});
WithoutArrows.args = {
  id: 3,
  image: false,
  arrow: false,
  pager: true,
  slides: slidesData,
};

// 페이지네이션 숨김 스토리
export const WithoutPagination = Template.bind({});
WithoutPagination.args = {
  id: 4,
  image: false,
  arrow: true,
  pager: false,
  slides: slidesData,
};
