import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InfoBox } from '../InfoBox';

export default {
  title: 'UI/Info/InfoBox',
  component: InfoBox,
  argTypes: {
    addClass: { control: 'text' },
    children: { control: 'text', defaultValue: '이곳에 정보를 입력하세요.' },
  },
  tags: ['autodocs'],
} as Meta<typeof InfoBox>;

const Template: StoryFn<typeof InfoBox> = (args) => <InfoBox {...args} />;

// 기본 InfoBox
export const Default = Template.bind({});
Default.args = {
  children: '기본 스타일의 정보 박스입니다.',
};

// 사용자 정의 스타일 추가
export const CustomClass = Template.bind({});
CustomClass.args = {
  addClass: 'md:border-solid border-2 border-red-500 bg-yellow-200 text-blue-600 font-bold',
  children: '사용자 정의 스타일을 적용한 정보 박스입니다.',
};

// HTML 태그 사용
export const WithChildren = Template.bind({});
WithChildren.args = {
  children: (
    <span>
      <strong>굵은 텍스트</strong>
      <br />
      <span className="text-red-500">빨간색 텍스트</span>
      <br />
      <em>기울어진 텍스트</em>
    </span>
  ),
};

// 긴 내용의 박스
export const LongText = Template.bind({});
LongText.args = {
  children: '이것은 긴 내용이 포함된 InfoBox입니다. 여러 줄의 텍스트를 표시할 수 있습니다. 길이가 길어지면 박스가 자동으로 조정됩니다.',
};
