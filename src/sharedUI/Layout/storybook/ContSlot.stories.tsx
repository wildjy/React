import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ContSlot } from '../ContSlot';

export default {
  title: 'UI/Layout/ContSlot',
  component: ContSlot,
  argTypes: {
    addClass: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContSlot>;

const Template: StoryFn<typeof ContSlot> = (args) => <ContSlot {...args} />;

// **기본 그리드 (1열 → 2열)**
export const Default = Template.bind({});
Default.args = {
  addClass: 'p-4 bg-gray-100 gap-4',
  children: [
    <div key="1" className="p-4 bg-blue-200">
      Left Default
    </div>,
    <div key="2" className="p-4 text-center bg-red-200">
      Right Default
    </div>,
  ],
};

// **여백 추가된 스타일**
export const PaddedGrid = Template.bind({});
PaddedGrid.args = {
  addClass: 'p-8 bg-gray-200 gap-6',
  children: [
    <div key="1" className="p-4 text-right bg-blue-200">
      Left Default
    </div>,
    <div key="2" className="p-4 py-6 bg-red-200">
      Right Default
    </div>,
  ],
};

// **1열로만 표시 (모바일 레이아웃)**
export const SingleColumn = Template.bind({});
SingleColumn.args = {
  addClass: 'p-4 bg-gray-300 md:grid-cols-1',
  children: [
    <div key="1" className="p-4 bg-blue-200">
      Left Default
    </div>,
    <div key="2" className="p-4 bg-green-200">
      Right Default
    </div>,
  ],
};
