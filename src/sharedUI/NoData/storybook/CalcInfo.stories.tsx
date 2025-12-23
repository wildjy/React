// CalcInfo.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CalcInfo } from '../CalcInfo';

const meta: Meta<typeof CalcInfo> = {
  title: 'UI/NoData/CalcInfo',
  component: CalcInfo,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CalcInfo>;

export const Default: Story = {
  args: {
    datas: {
      name: '홍길동',
      time: '2',
      label: '대학검색',
      text: '내신/수능/기본정보',
      button: {
        label: '내 점수 확인',
        href: '/',
      },
    },
  },
};
