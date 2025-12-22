import { Meta, StoryObj } from '@storybook/react';
import { MyScoreGraph } from '../MyScoreGraph';

const meta: Meta<typeof MyScoreGraph> = {
  title: 'UI/Graph/MyScoreGraph',
  component: MyScoreGraph,
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'number', min: 0, max: 100 },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    tick: {
      control: 'object',
    },
    label: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyScoreGraph>;

export const Default: Story = {
  args: {
    score: 65,
  },
};

export const WithTicks: Story = {
  args: {
    score: 72,
    tick: {
      show: true,
      length: 5,
      label: true,
    },
  },
};

export const CustomTicks: Story = {
  args: {
    score: 72,
    tick: {
      show: true,
      length: 5,
      label: true,
      addClass: 'text-2xs text-blue-500',
    },
  },
};

export const LowScore: Story = {
  args: {
    score: 5,
    tick: {
      show: true,
      length: 4,
    },
  },
};

export const HighScore: Story = {
  args: {
    score: 100,
    tick: {
      show: true,
      length: 4,
    },
  },
};

export const CustomSize: Story = {
  args: {
    size: {
      width: 80,
      height: 160,
    },
    score: 42,
    tick: {
      show: true,
      length: 6,
    },
  },
};

export const CustomLabel: Story = {
  args: {
    score: 88,
    label: {
      show: true,
      label: '내 위치',
      mark: '%',
      color: '#1f2937',
      addClass: 'text-lg font-bold',
    },
    tick: {
      show: true,
      length: 5,
    },
  },
};

export const CustomColor: Story = {
  args: {
    score: 30,
    color: ['#34d399', '#e5e7eb'],
    tick: {
      show: true,
      length: 4,
    },
  },
};
