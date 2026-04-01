import { Meta, StoryFn } from '@storybook/react';
import { ShadButton } from '../ShadButton';

export default {
  title: 'UI/Button/ShadButton',
  component: ShadButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '버튼 스타일',
    },
    size: {
      control: 'select',
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
      description: '버튼 크기',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '아이콘 위치',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof ShadButton>;

const     PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <rect x="2" y="9.25" width="16" height="1.5" rx="0.75" />
    <rect x="9.25" y="2" width="1.5" height="16" rx="0.75" />
  </svg>
);

const Template: StoryFn<typeof ShadButton> = (args) => <ShadButton {...args} />;

// --- Size variants (Primary) ---

export const XLarge = Template.bind({});
XLarge.args = { variant: 'primary', size: 'xlarge', children: 'button' };

export const Large = Template.bind({});
Large.args = { variant: 'primary', size: 'large', children: 'button' };

export const Medium = Template.bind({});
Medium.args = { variant: 'primary', size: 'medium', children: 'button' };

export const Small = Template.bind({});
Small.args = { variant: 'primary', size: 'small', children: 'button' };

export const XSmall = Template.bind({});
XSmall.args = { variant: 'primary', size: 'xsmall', children: 'button' };

// --- Icon position ---

export const IconLeft = Template.bind({});
IconLeft.args = {
  variant: 'primary',
  size: 'large',
  children: 'button',
  icon: <PlusIcon />,
  iconPosition: 'left',
};

export const IconRight = Template.bind({});
IconRight.args = {
  variant: 'primary',
  size: 'large',
  children: 'button',
  icon: <PlusIcon />,
  iconPosition: 'right',
};

// --- States ---

export const Hover = Template.bind({});
Hover.args = { variant: 'primary', size: 'large', children: 'button', className: 'bg-[#4a4b57]' };

export const Disabled = Template.bind({});
Disabled.args = { variant: 'primary', size: 'large', children: 'button', disabled: true };

// --- Other variants ---

export const Destructive = Template.bind({});
Destructive.args = { variant: 'destructive', size: 'large', children: 'Destructive' };

export const Outline = Template.bind({});
Outline.args = { variant: 'outline', size: 'large', children: 'Outline' };

export const Secondary = Template.bind({});
Secondary.args = { variant: 'secondary', size: 'large', children: 'Secondary' };

export const Ghost = Template.bind({});
Ghost.args = { variant: 'ghost', size: 'large', children: 'Ghost' };

export const Link = Template.bind({});
Link.args = { variant: 'link', size: 'large', children: 'Link' };
