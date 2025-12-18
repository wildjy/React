import { Meta, StoryFn } from '@storybook/react';
import { Button } from '../Button';

export default {
  title: 'UI/Button/Button',
  component: Button,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Set the size of the button.',
    },
    mode: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Set the mode of the button.',
    },
    round: {
      control: 'select',
      options: ['rec', 'sm', 'full'],
      description: 'Set the round style of the button.',
    },
    type: {
      control: 'text',
      description: 'Set the type of the button.',
    },
    addClass: {
      control: 'text',
      description: 'Add custom Tailwind CSS classes.',
    },
    startIcon: {
      control: 'object',
      description: 'Set a start icon with the format [iconName, className].',
    },
    endIcon: {
      control: 'object',
      description: 'Set an end icon with the format [iconName, className].',
    },
    children: {
      control: 'text',
      description: 'Set the text displayed inside the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button.',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'Default Button',
};

// Primary 버튼
export const Primary = Template.bind({});
Primary.args = {
  size: 'lg',
  mode: 'primary',
  round: 'full',
  children: 'Primary Button',
};

// Secondary 버튼
export const Secondary = Template.bind({});
Secondary.args = {
  size: 'md',
  mode: 'secondary',
  round: 'rec',
  children: 'Secondary Button',
};

// Tertiary 버튼
export const Tertiary = Template.bind({});
Tertiary.args = {
  size: 'sm',
  mode: 'tertiary',
  round: 'sm',
  children: 'Tertiary Button',
};

// 아이콘 포함 버튼
export const WithIcons = Template.bind({});
WithIcons.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'with Icons',
  startIcon: ['icon_checked.svg', 'w-3'],
  endIcon: ['icon_btn_arrow.svg', 'w-[0.45rem]'],
};
export const WithBlueIcons = Template.bind({});
WithBlueIcons.args = {
  size: 'md',
  mode: 'tertiary',
  round: 'sm',
  children: 'with Icons',
  endIcon: ['icon_btn_arrow_blue.svg', 'w-[0.45rem]'],
};

// 비활성화된 버튼
export const Disabled = Template.bind({});
Disabled.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'Disabled Button',
  disabled: true,
};

// 사용자 정의 클래스 적용
export const CustomClass = Template.bind({});
CustomClass.args = {
  size: 'lg',
  mode: 'primary',
  round: 'full',
  children: 'Custom Button',
  addClass: 'bg-purple-600 hover:bg-purple-700 text-white',
  startIcon: ['icon_checked.svg', 'w-3'],
};
