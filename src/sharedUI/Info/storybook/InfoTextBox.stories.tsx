import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InfoTextBox } from '../InfoTextBox';

export default {
  title: 'UI/Info/InfoTextBox',
  component: InfoTextBox,
  argTypes: {
    type: {
      control: 'radio',
      options: ['line', 'bg'],
    },
    addClass: { control: 'text' },
    children: { control: 'text', defaultValue: '여기에 정보를 입력하세요.' },
  },
  tags: ['autodocs'],
} as Meta<typeof InfoTextBox>;

const Template: StoryFn<typeof InfoTextBox> = (args) => <InfoTextBox {...args} />;

// 기본 InfoTextBox (line 스타일)
export const Default = Template.bind({});
Default.args = {
  type: 'line',
  children: '기본 테두리 스타일의 정보 박스입니다.',
};

// 배경 스타일
export const Background = Template.bind({});
Background.args = {
  type: 'bg',
  children: '배경 스타일의 정보 박스입니다.',
};

// 사용자 정의 클래스 추가
export const CustomClass = Template.bind({});
CustomClass.args = {
  type: 'line',
  addClass: 'border-2 border-red-500 bg-yellow-200',
  children: '사용자 정의 스타일을 적용한 정보 박스입니다.',
};
