import { Meta, StoryFn } from '@storybook/react';
import { ButtonLink } from '../Link';

export default {
  title: 'UI/Button/Link',
  component: ButtonLink,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Set the size of the link.',
    },
    mode: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Set the mode of the link.',
    },
    round: {
      control: 'select',
      options: ['rec', 'sm', 'full'],
      description: 'Set the round style of the link.',
    },
    href: {
      control: 'text',
      description: 'Set the URL for the link.',
    },
    blank: {
      control: 'boolean',
      description: 'Open the link in a new tab.',
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
      description: 'Set the text displayed inside the link.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the link.',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof ButtonLink>;

const Template: StoryFn<typeof ButtonLink> = (args) => <ButtonLink {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'Default Link',
  href: '#',
  blank: false,
};

// Primary 링크 버튼
export const Primary = Template.bind({});
Primary.args = {
  size: 'lg',
  mode: 'primary',
  round: 'full',
  children: 'Primary Link',
  href: 'https://example.com',
  blank: true,
};

// Secondary 링크 버튼
export const Secondary = Template.bind({});
Secondary.args = {
  size: 'md',
  mode: 'secondary',
  round: 'rec',
  children: 'Secondary Link',
  href: 'https://example.com',
  blank: false,
};

// Tertiary 링크 버튼
export const Tertiary = Template.bind({});
Tertiary.args = {
  size: 'sm',
  mode: 'tertiary',
  round: 'sm',
  children: 'Tertiary Link',
  href: '#',
  blank: true,
};

// 아이콘 포함 링크
export const WithIcons = Template.bind({});
WithIcons.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'with Icons',
  startIcon: ['icon_checked.svg', 'w-3'],
  endIcon: ['icon_btn_arrow.svg', 'w-[0.45rem]'],
  href: '#',
};

// 비활성화된 링크 버튼
export const Disabled = Template.bind({});
Disabled.args = {
  size: 'md',
  mode: 'primary',
  round: 'sm',
  children: 'Disabled Link',
  href: '#',
  disabled: true,
};

// 사용자 정의 클래스 적용
export const CustomClass = Template.bind({});
CustomClass.args = {
  size: 'lg',
  mode: 'primary',
  round: 'full',
  children: 'Custom Link',
  addClass: 'bg-purple-600 hover:bg-purple-700 text-white',
  startIcon: ['icon_checked.svg', 'w-3'],
};
