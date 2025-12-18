import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InfoText } from '../InfoText';

export default {
  title: 'UI/Info/InfoText',
  component: InfoText,
  argTypes: {
    icon: {
      control: 'select',
      options: ['bar', 'dot', 'star', 'number'],
      description: 'Size of the dropdown',},
    child: { control: 'boolean' },
    addClass: { control: 'text' },
    texts: { control: 'object' },
  },
  tags: ['autodocs'],
} as Meta<typeof InfoText>;

const Template: StoryFn<typeof InfoText> = (args) => <InfoText {...args} />;

// 기본 InfoText
export const Default = Template.bind({});
Default.args = {
  texts: [{ text: '첫 번째 정보 항목입니다.' }, { text: '두 번째 정보 항목입니다.' }, { text: '세 번째 정보 항목입니다.' }],
};

// 기본 InfoText
export const Icon = Template.bind({});
Icon.args = {
  icon: 'number',
  texts: [
    { text: '첫 번째 정보 항목입니다.' },
    { text: '두 번째 정보 항목입니다.' },
    { text: '세 번째 정보 항목입니다.' },
    { text: '네 번째 정보 항목입니다.' },
    { text: '다섯 번째 정보 항목입니다.' }
  ],
};

// 사용자 정의 스타일 추가
export const CustomClass = Template.bind({});
CustomClass.args = {
  texts: [{ text: '이것은 사용자 정의 스타일이 적용된 정보입니다.' }, { text: '리스트 스타일을 변경할 수 있습니다.' }],
  addClass: 'text-blue-500 font-bold',
};

// HTML 태그 사용
export const WithHTML = Template.bind({});
WithHTML.args = {
  texts: [
    { text: <strong>굵은 텍스트</strong> },
    { text: <span className="text-red-500">빨간색 텍스트</span> },
    { text: <em>기울어진 텍스트</em> },
  ],
};

// 자식 요소 직접 전달
export const WithChildren = Template.bind({});
WithChildren.args = {
  children: (
    <>
      <li className="text-green-500">※ 이것은 직접 전달된 첫 번째 항목입니다.</li>
      <li className="text-blue-500">☆ 이것은 직접 전달된 두 번째 항목입니다.</li>
      <li>▶ 이것은 직접 전달된 세 번째 항목입니다.</li>
    </>
  ),
};
