import { Meta, StoryObj } from '@storybook/react';
import { SideADBanner } from '../SideADBanner';
import { BannerItem } from '../BannerItem';

const meta: Meta<typeof SideADBanner> = {
  title: 'UI/Banner/SideADBanner',
  component: SideADBanner,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['base', 'fixed'],
      description: '배너 위치 타입',
    },
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: '배너 정렬 방향',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideADBanner>;

const dummyData: BannerItem[] = [
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_1.jpg',
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
      <SideADBanner {...args} />
    </div>
  ),
  args: {
    align: 'left',
    addClass: 'mr-[260px]',
    datas: dummyData,
  },
};

export const Fixed: Story = {
  render: (args) => (
    <div className="mx-auto w-[500px] h-[62.5rem] relative border">
      <SideADBanner {...args} />
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
      <SideADBanner {...args} />
    </div>
  ),
  args: {
    type: 'fixed',
    align: 'right',
    addClass: 'ml-[260px]',
    datas: dummyData,
  },
};
