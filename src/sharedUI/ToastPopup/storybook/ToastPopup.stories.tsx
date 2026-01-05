import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { ToastPopup } from '../ToastPopup';
import { Button } from '../../Button/Button';

const meta: Meta<typeof ToastPopup> = {
  title: 'UI/ToastPopup/ToastPopup',
  component: ToastPopup,
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'],
    },
    size: {
      control: 'radio',
      options: ['base', 'sm'],
    },
    color: {
      control: 'radio',
      options: ['base'],
    },
    child: { control: 'boolean' },
    isActive: { control: 'boolean' },
    setToast: { table: { disable: true } },
    message: {
      _control: 'array',
      get control() {
        return this._control;
      },
      set control(value) {
        this._control = value;
      },
      defaultValue: ['알림', '성공'],
    },
    addClass: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof ToastPopup> = (args) => {
  const [isActive, setIsActive] = useState<boolean>(args.isActive || false);

  return (
    <div className="flex flex-col items-center px-10 h-[250px] overflow-hidden">
      <div className="relative ">
        <Button
          onClick={() => setIsActive(true)}
          addClass="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          토스트 팝업 열기
        </Button>

        <ToastPopup {...args} isActive={isActive} setToast={setIsActive} />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  isActive: false,
  message: ['알림', '성공'],
};

export const LeftAligned = Template.bind({});
LeftAligned.args = {
  isActive: false,
  align: 'left',
  message: ['경고', '실패'],
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  isActive: false,
  size: 'sm',
  message: ['작은 팝업', '완료'],
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  isActive: false,
  setColor: 'text-red-500',
  message: ['오류', '발생'],
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  isActive: false,
  child: true,
  children: (
    <span className="font-bold text-green-500">사용자 정의 메시지!</span>
  ),
};
