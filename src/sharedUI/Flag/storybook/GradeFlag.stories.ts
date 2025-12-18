import type { Meta, StoryObj } from '@storybook/react';
import { GradeFlag } from '../GradeFlag';

const meta: Meta<typeof GradeFlag> = {
  component: GradeFlag,
  title: 'UI/Flag/GradeFlag',
  argTypes: {
    type: {
      control: 'radio',
      options: ['flag1', 'flag2', 'flag3', 'flag4'],
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GradeFlag>;

export const Flag1 = {
  args: {
    type: 'flag1',
    label: '가채점 집계중',
  },
};

export const Flag2 = {
  args: {
    type: 'flag2',
    label: '가채점 추정',
  },
};

export const Flag3 = {
  args: {
    type: 'flag3',
    label: '가채점 확정',
  },
};

export const Flag4 = {
  args: {
    type: 'flag4',
    label: '실채점 확정',
  },
};
