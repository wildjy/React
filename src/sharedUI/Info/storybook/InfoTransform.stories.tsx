import { Meta, StoryObj } from '@storybook/react';
import { InfoTransform, InfoTransformItemType } from '../InfoTransform';

const meta: Meta<typeof InfoTransform> = {
  title: 'UI/InfoTransform/InfoTransform',
  component: InfoTransform,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['col', 'row', 'type1'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoTransform>;

const baseDatas: InfoTransformItemType[] = [
  {
    title: { tit: '국어', sub: '표준점수' },
    score: '132',
    arrow: { value: 5, arrowType: true },
    tooltip: {
      title: '국어 점수',
      text: '국어 표준점수 기준입니다.',
    },
  },
  {
    title: { tit: '수학', sub: '표준점수' },
    score: '140',
    arrow: { value: 3, arrowType: false },
  },
  {
    title: { tit: '영어' },
    score: '2',
    subScore: '등급',
  },
];

export const Column: Story = {
  render: (args) => (
    <div className="p-6 max-w-[64rem]">
      <InfoTransform {...args} />
    </div>
  ),
  args: {
    type: 'col',
    datas: baseDatas,
    mark: {
      show: true,
      label: '점',
    },
  },
};

export const Row: Story = {
  render: (args) => (
    <div className="p-6 max-w-[64rem]">
      <InfoTransform {...args} />
    </div>
  ),
  args: {
    type: 'row',
    datas: baseDatas,
    mark: {
      show: true,
      label: '점',
    },
  },
};
