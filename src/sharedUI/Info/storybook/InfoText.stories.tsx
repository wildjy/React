import type { Meta, StoryObj } from '@storybook/react';
import { InfoText, InfoTextLiClassName } from '../InfoText';

const meta: Meta<typeof InfoText> = {
  title: 'UI/Info/InfoText',
  component: InfoText,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['bar', 'star', 'dot', 'number', 'none'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoText>;

const dummyTexts = [
  { text: '첫 번째 안내 문구입니다.' },
  { text: '두 번째 안내 문구입니다.' },
  { text: '세 번째 안내 문구입니다.' },
];

export const Default: Story = {
  args: {
    icon: 'bar',
    texts: dummyTexts,
  },
};

export const Star: Story = {
  args: {
    icon: 'star',
    texts: dummyTexts,
  },
};

export const Dot: Story = {
  args: {
    icon: 'dot',
    texts: dummyTexts,
  },
};

export const Number: Story = {
  args: {
    icon: 'number',
    texts: dummyTexts,
  },
};

export const None: Story = {
  args: {
    icon: 'none',
    texts: dummyTexts,
  },
};

export const WithHTML: Story = {
  args: {
    icon: 'dot',
    texts: [
      {
        isHTML: true,
        text: '<b>HTML</b> 텍스트도 <span style="color:red">정상</span> 동작',
      },
      {
        text: '일반 텍스트도 함께 사용 가능',
      },
    ],
  },
};

export const CustomClass: Story = {
  args: {
    icon: 'star',
    texts: [
      {
        text: '강조 텍스트',
        addClass: 'text-red-600 font-semibold',
      },
      {
        text: '보조 텍스트',
        addClass: 'text-gray-400',
      },
    ],
  },
};

export const ChildrenIcon: Story = {
  render: () => (
    <InfoText>
      <li className={InfoTextLiClassName}>번호형 1</li>
      <li className={InfoTextLiClassName}>번호형 2</li>
    </InfoText>
  ),
};
