import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ContLayout } from '../ContLayout';

export default {
  title: 'UI/Layout/ContLayout',
  component: ContLayout,
  argTypes: {
    addClass: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContLayout>;

const Template: StoryFn<typeof ContLayout> = (args) => <ContLayout {...args} />;

// **기본 그리드 (1열 → 2열)**
export const Default = Template.bind({});
Default.args = {
  addClass: 'p-4 bg-gray-100 gap-4',
  children: [
    <div key="1" className="p-4 bg-blue-200">
      Contents 1
    </div>,
    <div key="2" className="p-4 text-center bg-red-200">
      Contents 2
    </div>,
  ],
};
