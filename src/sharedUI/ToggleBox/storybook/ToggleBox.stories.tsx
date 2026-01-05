import React, { useEffect, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ToggleBox from '../ToggleBox';

export default {
  title: 'UI/ToggleBox/ToggleBox',
  component: ToggleBox,
  argTypes: {
    isOpen: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    icon: { control: 'select', options: ['default', 'plus'] },
    addClass: { control: 'text' },
    topAddClass: { control: 'text' },
    bottomAddClass: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleBox>;

const Template: StoryFn<typeof ToggleBox> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);

  return (
    <div className="p-6">
      <ToggleBox {...args} isOpen={isOpen} addClass={args.addClass}>
        <ToggleBox.Top onClick={() => setIsOpen(!isOpen)} addClass={args?.topAddClass || ''}>
          클릭하여 열기/닫기
        </ToggleBox.Top>
        <ToggleBox.Bottom addClass={args?.bottomAddClass || ''}>
          <p className="p-4 bg-gray-100">이곳에 내용을 넣을 수 있습니다!</p>
        </ToggleBox.Bottom>
      </ToggleBox>
    </div>
  );
};

// 기본 토글 박스
export const Default = Template.bind({});
Default.args = {
  isOpen: false,
  size: 'md',
  align: 'left',
  icon: 'default',
  addClass: '',
  topAddClass: 'bg-blue-500 text-white p-4 rounded-t-lg',
  bottomAddClass: 'bg-gray-100 p-4 rounded-b-lg',
};

// ✅ 초기 열림 상태
export const Open = Template.bind({});
Open.args = {
  ...Default.args,
  isOpen: true,
};

// ✅ Responsive (768px 이상 열림)
export const ResponsiveInitialState: StoryFn<typeof ToggleBox> = (args) => {
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="p-6">
      <ToggleBox {...args} isOpen={isTablet}>
        <ToggleBox.Top addClass="bg-blue-500 text-white p-4 rounded-t-lg">
          클릭하여 열기/닫기
        </ToggleBox.Top>
        <ToggleBox.Bottom addClass="bg-gray-100 p-4 rounded-b-lg">
          <p className="p-4 bg-gray-100">이곳에 내용을 넣을 수 있습니다!</p>
        </ToggleBox.Bottom>
      </ToggleBox>
    </div>
  );
};

ResponsiveInitialState.args = {
  size: 'md',
  align: 'left',
  icon: 'default',
};
ResponsiveInitialState.storyName = 'Responsive (768px 이상 열림)';

// ✅ 아이콘 스타일 변경
export const PlusIcon = Template.bind({});
PlusIcon.args = {
  ...Default.args,
  icon: 'plus',
};

// ✅ 큰 사이즈
export const Large = Template.bind({});
Large.args = {
  ...Default.args,
  size: 'lg',
};

// ✅ 가운데 정렬
export const CenterAlign = Template.bind({});
CenterAlign.args = {
  ...Default.args,
  align: 'center',
};

// ✅ 가운데 정렬
export const CustomStyle = Template.bind({});
CustomStyle.args = {
  ...Default.args,
  addClass: 'bg-green-500 text-white p-4 font-bold',
  topAddClass: 'border border-red-700',
  bottomAddClass: 'bg-yellow-200 p-6',
};
