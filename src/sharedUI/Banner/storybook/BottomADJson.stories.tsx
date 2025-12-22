import { Meta, StoryObj } from '@storybook/react';
import { BottomADJson } from '../BottomADJson';
import { BannerItem } from '../BannerItem';

const meta: Meta<typeof BottomADJson> = {
  title: 'UI/Banner/BottomADJson',
  component: BottomADJson,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'full'],
      description: '배너 사이즈 타입',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomADJson>;

const dummyData: BannerItem[] = [
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottom_ad_1.jpg',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/x01',
      openInExternalBrowser: '1',
      imageWidth: '512',
      imageHeight: '64',
      backgroundcolor: '#E0E6EF',
    },
  },
  {
    badge: {
      imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/bottom_ad_2.jpg',
      clickUrl:
        'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/x02',
      openInExternalBrowser: '1',
      imageWidth: '512',
      imageHeight: '64',
      backgroundcolor: '#E7F5E7',
    },
  },
];

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[64rem] border p-6">
      <BottomADJson {...args} />
    </div>
  ),
  args: {
    size: 'default',
    datas: dummyData,
  },
};

export const FullSize: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[64rem] border p-6">
      <BottomADJson {...args} />
    </div>
  ),
  args: {
    size: 'full',
    datas: dummyData,
  },
};

export const SingleBanner: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[64rem] border p-6">
      <BottomADJson {...args} />
    </div>
  ),
  args: {
    size: 'default',
    datas: [dummyData[0]],
  },
};
