import { Meta, StoryFn } from '@storybook/react';
import { CloseButton } from '../CloseButton';

export default {
  title: 'UI/Button/CloseButton',
  component: CloseButton,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['base', 'back', 'backWhite'],
      description: '아이콘 타입',
      table: {
        type: { summary: 'base' },
        defaultValue: { summary: 'base' },
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['base', 'sm', 'md'],
      description: '버튼 크기',
      table: {
        type: { summary: 'base | sm' },
        defaultValue: { summary: 'base' },
      },
    },
    addClass: {
      control: 'text',
      description: '추가적인 CSS 클래스',
      table: {
        type: { summary: 'string' },
      },
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CloseButton>;

const Template: StoryFn<typeof CloseButton> = (args) => <CloseButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'base',
  size: 'base',
  addClass: '',
};
