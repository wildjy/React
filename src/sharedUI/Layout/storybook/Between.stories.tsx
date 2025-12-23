import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Between } from '../Between';

export default {
  title: 'UI/Layout/Between',
  component: Between,
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'left', 'right', 'mLeft', 'mRight'],
    },
    addClass: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Between>;

const Template: StoryFn<typeof Between> = (args) => (
  <div className="p-6">
    <Between {...args}>
      <div className="p-4 bg-blue-200">Left Content</div>
      <div className="p-4 bg-red-200">Right Content</div>
    </Between>
  </div>
);

// ✅ 기본 정렬 (default)
export const Default = Template.bind({});
Default.args = {
  type: 'default',
};

// ✅ 왼쪽 정렬 (left)
export const Left = Template.bind({});
Left.args = {
  type: 'left',
};

// ✅ 오른쪽 정렬 (right)
export const Right = Template.bind({});
Right.args = {
  type: 'right',
};

// ✅ 모바일에서 왼쪽 정렬, 데스크탑에서 기본 정렬 (mLeft)
export const MobileLeft = Template.bind({});
MobileLeft.args = {
  type: 'mLeft',
};

// ✅ 모바일에서 오른쪽 정렬, 데스크탑에서 기본 정렬 (mRight)
export const MobileRight = Template.bind({});
MobileRight.args = {
  type: 'mRight',
};
