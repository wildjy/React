import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { UnivFlag } from '../UnivFlag'; // 경로를 프로젝트 구조에 맞게 조정

export default {
  title: 'UI/Flag/UnivFlag',
  component: UnivFlag,
  argTypes: {
    tag: {
      control: 'select',
      options: ['span', 'div', 'p'],
    },
    type: {
      control: 'radio',
      options: ['IN_PROGRESS', 'PASS_50', 'PASS_80', 'PASS_100', 'PASS_110', 'PASS_150'],
    },
    label: { control: 'text', defaultValue: 'Flag Label' },
    addClass: { control: 'text' },
  },
  tags: ['autodocs'],
} as Meta<typeof UnivFlag>;

const Template: StoryFn<typeof UnivFlag> = (args) => <UnivFlag {...args} />;

// 기본 UnivFlag
export const Default = Template.bind({});
Default.args = {
  type: 'IN_PROGRESS',
  label: '계산불가',
};

// flag1 스타일
export const PASS_50 = Template.bind({});
PASS_50.args = {
  type: 'PASS_50',
  label: '안정',
};

// flag2 스타일
export const PASS_80 = Template.bind({});
PASS_80.args = {
  type: 'PASS_80',
  label: '적정',
};

// flag3 스타일
export const PASS_100 = Template.bind({});
PASS_100.args = {
  type: 'PASS_100',
  label: '소신',
};

// flag4 스타일
export const PASS_110 = Template.bind({});
PASS_110.args = {
  type: 'PASS_110',
  label: '위험',
};

// flag5 스타일
export const PASS_150 = Template.bind({});
PASS_150.args = {
  type: 'PASS_150',
  label: '매우위험',
};

// 사용자 정의 클래스 추가
export const CustomClass = Template.bind({});
CustomClass.args = {
  type: 'flag1',
  label: 'Custom',
  addClass: 'border-2 border-red-500',
};
