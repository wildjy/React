import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ScrollFixed } from '../ScrollFixed';
import { ScrollProvider } from '../Provider/ScrollProvider';

export default {
  title: 'UI/Layout/ScrollFixed',
  component: ScrollFixed,
  argTypes: {
    fixHeight: { control: 'text' },
    top: { control: 'text' },
    addClass: { control: 'text' },
    addStyle: { control: 'object' },
  },
} satisfies Meta<typeof ScrollFixed>;

const Template: StoryFn<typeof ScrollFixed> = (args) => (
  <ScrollProvider>
    <div style={{ height: '150vh', paddingTop: '0px' }}>
      <ScrollFixed {...args}>
        <div className="p-4 font-bold text-center text-white bg-blue-500">Fixed Content</div>
      </ScrollFixed>
      <div className="p-6 text-center bg-gray-100">Scroll Down to see the effect</div>
    </div>
  </ScrollProvider>
);

// **기본 ScrollFixed**
export const Default = Template.bind({});
Default.args = {
  fixHeight: 'h-16',
  top: 'top-5 left-5 right-5',
  addClass: 'bg-white shadow-md',
};

// **상단 여백 조절**
export const OffsetTop = Template.bind({});
OffsetTop.args = {
  ...Default.args,
  top: 'top-10',
};

// **고정된 높이 변경**
export const CustomHeight = Template.bind({});
CustomHeight.args = {
  ...Default.args,
  fixHeight: 'h-24',
};
