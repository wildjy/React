import type { Meta, StoryObj } from '@storybook/react';
import { NoData } from '../NoData';

const meta: Meta<typeof NoData> = {
  title: 'UI/NoData/NoData',
  component: NoData,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['default', 'info', 'lock', 'loading', 'delay'],
    },
    message: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoData>;

export const Default: Story = {
  args: {
    icon: 'default',
    message: '데이터가 없습니다.',
  },
};

export const Info: Story = {
  args: {
    icon: 'info',
    message: '조회 가능한 데이터가 없습니다.',
  },
};

export const Lock: Story = {
  args: {
    icon: 'lock',
    message: '권한이 없어 데이터를 확인할 수 없습니다.',
  },
};

export const Loading: Story = {
  args: {
    icon: 'loading',
    message: '데이터를 불러오는 중입니다.',
  },
};

export const Delay: Story = {
  args: {
    icon: 'delay',
    message: '계산 중입니다. 잠시만 기다려 주세요.',
  },
};

export const WithChildren: Story = {
  render: () => (
    <NoData
      icon="info"
      message="아직 결과가 없습니다."
      childrenClassName="mt-4"
    >
      <p className="text-sm text-gray-500">
        조건을 변경하거나 다시 시도해 주세요.
      </p>
      <button className="mt-3 px-4 py-2 text-sm bg-blue-500 text-white rounded">
        다시 조회
      </button>
    </NoData>
  ),
};

export const CustomLayout: Story = {
  args: {
    icon: 'info',
    message: '맞춤 스타일 NoData',
    setHeight: 'min-h-[30rem]',
    setFont: 'text-red-500 font-bold',
  },
};
