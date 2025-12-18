import { Meta, StoryObj } from '@storybook/react';
import { InfoTransformFrame } from '../InfoTransformFrame';
import { InfoTransform } from '../InfoTransform';

const meta: Meta<typeof InfoTransformFrame> = {
  title: 'UI/InfoTransform/InfoTransformFrame',
  component: InfoTransformFrame,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['rec', 'rec1', 'recBg', 'recLine', 'recCustom'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoTransformFrame>;

const dummyDatas = [
  {
    title: { tit: '국어', sub: '표준점수' },
    score: '132',
    arrow: { value: 5, arrowType: true },
    tooltip: {
      title: '국어 점수',
      text: '표준점수 기준 국어 성적입니다.',
    },
  },
  {
    title:{ tit: '수학' },
    score: '2',
    subScore: '등급',
  },
  {
    title:{ tit: '영어', sub: '표준점수'  },
    score: '2',
    subScore: '등급',
  },
];

const Slot = ({ title }: { title: string }) => (
  <div className="p-4 text-center border border-dashed rounded">
    <b>{title}</b>
  </div>
);

export const Rec: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-50">
      <InfoTransformFrame {...args}>
        <Slot title="Slot 1" />
        <Slot title="Slot 2" />
        <Slot title="Slot 3" />
      </InfoTransformFrame>
    </div>
  ),
  args: {
    type: 'rec',
  },
};

export const Rec1: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-50">
      <InfoTransformFrame {...args}>
        <Slot title="Left" />
        <Slot title="Center" />
        <Slot title="Right" />
      </InfoTransformFrame>
    </div>
  ),
  args: {
    type: 'rec1',
  },
};


export const RecBg: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-50">
      <InfoTransformFrame {...args}>
        <Slot title="A" />
        <Slot title="B" />
      </InfoTransformFrame>
    </div>
  ),
  args: {
    type: 'recBg',
  },
};

export const RecLine: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-50">
      <InfoTransformFrame {...args}>
        <Slot title="Section 1" />
        <Slot title="Section 2" />
      </InfoTransformFrame>
    </div>
  ),
  args: {
    type: 'recLine',
  },
};

export const WithWidths: Story = {
  render: () => (
    <div className="p-6 bg-gray-50">
      <InfoTransformFrame
        type="rec"
        widths={['w-1/4', 'w-1/2', 'w-1/4']}
      >
        <Slot title="25%" />
        <Slot title="50%" />
        <Slot title="25%" />
      </InfoTransformFrame>
    </div>
  ),
};
