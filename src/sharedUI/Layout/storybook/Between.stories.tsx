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
  <div className="p-2 md:p-6">
    <Between {...args}>
      <div>
        <div className="p-4 bg-blue-200">Left Content</div>
      </div>
      <div>
        <div className="p-4 bg-red-200">Right Content</div>
      </div>
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
  type: 'onlyLeft',
};

// ✅ 오른쪽 정렬 (right)
export const Right = Template.bind({});
Right.args = {
  type: 'onlyRight',
};

// ✅ 왼쪽 정렬 (left)
export const LeftMobileBetween = Template.bind({});
LeftMobileBetween.args = {
  type: 'left',
};

// ✅ 오른쪽 정렬 (right)
export const RightMobileBetween = Template.bind({});
RightMobileBetween.args = {
  type: 'right',
};

// ✅ 오른쪽 정렬 (right)
export const HiddenRightContent = () => (
  <div className="p-2 md:p-6">
    <Between type="right">
      <div>
        <div className="p-4 bg-blue-200">
          Object를 숨길땐 기준 div는 유지하고
          <br />
          내부 컨텐츠만 숨기세요
        </div>
      </div>
      <div className="min-h-[1px]" />
    </Between>
  </div>
);

// ✅ 모바일에서 왼쪽 정렬, 데스크탑에서 기본 정렬 (mLeft)
export const BetweenMobileLeft = Template.bind({});
BetweenMobileLeft.args = {
  type: 'mLeft',
};

// ✅ 모바일에서 오른쪽 정렬, 데스크탑에서 기본 정렬 (mRight)
export const BetweenMobileRight = Template.bind({});
BetweenMobileRight.args = {
  type: 'mRight',
};

// ✅ 오른쪽 정렬 (right)
export const HiddenMobileRightContent = () => (
  <div className="p-2 md:p-6">
    <Between type="mRight">
      <div>
        <div className="p-4 bg-blue-200">
          Object를 숨길땐 기준 div는 유지하고
          <br />
          내부 컨텐츠만 숨기세요
        </div>
      </div>
      <div className="min-h-[1px]" />
    </Between>
  </div>
);
