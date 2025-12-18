import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Chip } from '../Chip'; // 프로젝트 경로에 맞게 수정

export default {
  title: 'UI/Chip/Chip',
  component: Chip,
  argTypes: {
    type: {
      control: 'radio',
      options: ['theme', 'filter'],
      defaultValue: 'theme',
    },
    title: { control: 'text', defaultValue: 'Chip 버튼' },
    isActive: { control: 'boolean', defaultValue: false },
    addClass: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = (args) => {
  const [isActive, setIsActive] = useState(args.isActive);

  return <Chip {...args} isActive={isActive} onClick={() => setIsActive(!isActive)} />;
};

// 기본 Chip (테마 스타일)
export const Default = Template.bind({});
Default.args = {
  type: 'theme',
  title: '기본 Chip',
};

// 필터 스타일 Chip
export const Filter = Template.bind({});
Filter.args = {
  type: 'filter',
  title: '필터 Chip',
};

// 활성화 상태
export const Active = Template.bind({});
Active.args = {
  type: 'theme',
  title: '활성화된 Chip',
  isActive: true,
};

// 사용자 정의 스타일 추가
export const CustomClass = Template.bind({});
CustomClass.args = {
  type: 'filter',
  title: '커스텀 스타일 Chip',
  addClass: 'text-red-500 border-red-500 bg-yellow-100',
};
