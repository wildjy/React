import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { BottomRolling } from '../BottomRolling';
import { BannerItem } from '../BannerItem';

const meta: Meta<typeof BottomRolling> = {
  title: 'UI/Banner/BottomRolling',
  component: BottomRolling,
  tags: ['autodocs'],
  argTypes: {
    leftTime: {
      control: 'number',
      description: '롤링 간격(ms)',
    },
    rightTime: {
      control: 'number',
      description: '롤링 간격(ms)',
    },
    controls: {
      control: 'boolean',
      description: '개별 롤링 제어 버튼 노출 여부',
    },
  },
};

export default meta;

const leftBanners: BannerItem[] = [
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_1.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1479641528/x01/JINHAK/2505_dankook_WMNesinL_564x91_1/2505_dankook_WMNesinL_564x91_1_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_2.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1834219446/x02/JINHAK/2505_joongbu_WMNesinL_564x91_2/2505_joongbu_WMNesinL_564x91_2_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_3.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1310221744/x03/JINHAK/2505_seowon_WMNesinL_564x91_3/2505_seowon_WMNesinL_564x91_3_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
];

const rightBanners: BannerItem[] = [
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_4.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinR/L17/1144723437/x01/JINHAK/2505_konyang_WMNesinR_564x91_1/2505_konyang_WMNesinR_564x91_1_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_5.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinR/L17/704474922/x02/JINHAK/2503_gachon_WMNesinR_564x91_2/2503_gachon_WMNesinR_564x91_2_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottomRolling_ad_6.jpg',
      imageHeight: '91',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinR/L17/704474922/x02/JINHAK/2503_gachon_WMNesinR_564x91_2/2503_gachon_WMNesinR_564x91_2_250514.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '0',
    },
  },
];

export const Default: StoryObj<typeof BottomRolling> = {
  args: {
    leftTime: 7000,
    rightTime: 3500,
    controls: true,
    leftBanners,
    rightBanners,
  },
};
