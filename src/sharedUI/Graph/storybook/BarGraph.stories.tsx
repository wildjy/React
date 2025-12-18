import { Meta, StoryObj } from '@storybook/react';
import { BarGraph } from '../BarGraph';

const meta: Meta<typeof BarGraph> = {
  title: 'UI/Graph/BarGraph',
  component: BarGraph,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['base', 'type_1', 'type_2'],
    },
    direction: {
      control: 'select',
      options: ['default', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarGraph>;

export const Basic: Story = {
  render: (args) => (
    <div className="max-w-[32rem] p-6">
      <BarGraph {...args} />
    </div>
  ),
  args: {
    min: 0,
    max: 100,
    value: 72,
    score: 45,
  },
};

export const WithLabels: Story = {
  render: (args) => (
    <div className="max-w-[32rem] p-6">
      <BarGraph {...args} />
    </div>
  ),
  args: {
    min: 0,
    max: 100,
    value: {
      score: 68,
      label: '평균',
      gap: 8,
      color: '#222222',
    },
    score: {
      score: 92,
      label: '나',
      gap: 10,
      color: '#FF0048',
    },
  },
};

export const RightDirection: Story = {
  render: (args) => (
    <div className="max-w-[32rem] p-6">
      <BarGraph {...args} />
    </div>
  ),
  args: {
    min: 0,
    max: 100,
    direction: 'right',
    value: {
      score: 80,
      label: '평균',
    },
    score: {
      score: 95,
      label: '나',
    },
  },
};

export const TypeVariants: Story = {
  render: () => (
    <div className="max-w-[32rem] p-6 space-y-6">
      <BarGraph min={0} max={100} value={85} score={5} type="base" />
      <BarGraph min={0} max={100} value={10} score={95} type="type_1" />
      <BarGraph min={0} max={100} value={56} score={35} type="type_2" />
    </div>
  ),
};