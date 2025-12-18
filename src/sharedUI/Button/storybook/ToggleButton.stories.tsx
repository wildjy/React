import { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from '../ToggleButton';
import { useState } from 'react';

const meta: Meta<typeof ToggleButton> = {
  title: 'UI/Button/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: '토글 활성화 상태',
    },
    onClick: {
      action: 'clicked',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);

    return (
      <div className="p-6 flex items-center gap-4">
        <ToggleButton
          {...args}
          active={active}
          onClick={() => setActive((prev) => !prev)}
        />
        <span className="text-sm">
          상태: <b>{active ? '열림' : '닫힘'}</b>
        </span>
      </div>
    );
  },
  args: {
    active: false,
  },
};

export const Active: Story = {
  render: (args) => (
    <div className="p-6">
      <ToggleButton {...args} />
    </div>
  ),
  args: {
    active: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);

    return (
      <div className="p-6 flex items-center gap-4">
        <ToggleButton
          {...args}
          active={active}
          onClick={() => setActive((prev) => !prev)}
        />
        <span className="text-sm">
          상태: <b>{active ? '열림' : '닫힘'}</b>
        </span>
      </div>
    );
  },
  args: {},
};
