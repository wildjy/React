import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SideADRolling } from '../SideADRolling';

const meta: Meta<typeof SideADRolling> = {
  title: 'UI/Banner/SideADRolling',
  component: SideADRolling,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['base', 'fixed'],
      description: '배너 위치 고정 방식',
    },
    align: {
      control: 'radio',
      options: ['left', 'right'],
      description: '좌우 정렬 위치',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스 적용',
    },
    time: {
      time: { control: 'number', description: '배너 전환 간격(ms)' },
    },
    controls: {
      control: 'boolean',
      description: '재생/멈춤 버튼 표시',
    },
    datas: {
      control: 'object',
      description: '배너 데이터 오브젝트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideADRolling>;

const dummyData = [
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_1.jpg',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/22_NesinP/L22/1768910538/x01/JINHAK/hongik_2023_0410_173x182/hongik_2023_0410_173x182.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '1',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_2.jpg',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/22_NesinP/L22/98121208/x01/JINHAK/2408_iajou_173x182/2408_iajou_173x182_240903.html/792f7563516d67416f573441446d7746',
      openInExternalBrowser: '1',
    },
  },
];

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[800px] relative border">
      <p className="absolute text-lg -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">sample area</p>
      <SideADRolling {...args} />
    </div>
  ),
  args: {
    align: 'left',
    addClass: 'mr-[260px]',
    time: 7000,
    controls: true,
    datas: dummyData,
  },
};

export const Time: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[800px] relative border">
      <SideADRolling {...args} />
    </div>
  ),
  args: {
    align: 'left',
    addClass: 'mr-[260px]',
    time: 500,
    datas: dummyData,
  },
};

export const Fixed: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[62.5rem] relative border">
      <SideADRolling {...args} />
    </div>
  ),
  args: {
    type: 'fixed',
    addClass: 'mr-[260px]',
    datas: dummyData,
  },
};

export const AlignFixedRight: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[62.5rem] relative border">
      <SideADRolling {...args} />
    </div>
  ),
  args: {
    type: 'fixed',
    align: 'right',
    addClass: 'ml-[260px]',
    datas: dummyData,
  },
};

export const Custom: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[800px] relative border">
      <SideADRolling {...args} />
    </div>
  ),
  args: {
    type: 'fixed',
    align: 'right',
    addClass: 'ml-[260px]',
    datas: [
      {
        badge: {
          imgurl: 'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2409_seowon_564x91_1/seowon240910_564x91re.jpg',
          clickUrl: 'https://example.com',
          openInExternalBrowser: '1',
          imageHeight: 'auto',
        },
      },
    ],
  },
};
