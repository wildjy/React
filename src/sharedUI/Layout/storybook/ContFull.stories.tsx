import type { Meta, StoryObj } from '@storybook/react';
import { ContFull } from '../ContFull';

const meta: Meta<typeof ContFull> = {
  title: 'UI/Layout/ContFull',
  component: ContFull,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    addClass: {
      control: 'text',
      description: '추가 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContFull>;

// **기본 그리드 (1열 → 2열)**
export const Default: Story = {
  args: {
    children: (
      <div className="flex items-center justify-center h-40 bg-blue-100">
        <p className="text-sm text-blue-800">
          ContFull 영역 (모바일에서는 좌우 풀)
          <br />
          visual 영역 예시입니다.
        </p>
      </div>
    ),
  },
};
