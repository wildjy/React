import { Meta, StoryObj } from '@storybook/react';
import { DropDownReport, DropDownReportOptionType } from '../DropDownReport';
import { useState } from 'react';

const meta: Meta<typeof DropDownReport> = {
  title: 'UI/DropDown/DropDownReport',
  component: DropDownReport,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['base', 'shadow', 'ghost', 'ghostShadow', 'check'],
    },
    align: {
      control: 'select',
      options: ['left', 'center'],
    },
    icon: {
      control: 'select',
      options: ['base', 'report'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fixed: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropDownReport>;
const options: DropDownReportOptionType[] = [
  {
    value: '1',
    label: { gun: '가', univ: '서울대', name: '컴퓨터공학과' },
  },
  {
    value: '2',
    label: { gun: '나', univ: '연세대', name: '전자공학과' },
  },
  {
    value: '3',
    label: { gun: '다', univ: '고려대', name: '기계공학과' },
  },
  {
    value: '4',
    label: '기타 옵션 (string)',
  },
];

export const Default: Story = {
  render: (args) => (
    <div className="max-w-[20rem] min-h-[15rem] p-6 bg-blue-600 md:bg-white">
      <DropDownReport {...args} />
    </div>
  ),
  args: {
    addClass: 'font-bold md:font-normal text-white md:text-gray-800 bg-transparent border-0 md:border text-center md:text-left',
    options,
    label: '선택하세요',
  },
};

//✅ 인터랙티브 (외부 value 제어 확인용)
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="max-w-[20rem] min-h-[15rem]  p-6 space-y-4">
        <DropDownReport
          {...args}
          value={value}
          onChange={(option) => setValue(option.value)}
        />
        <div className="text-sm">
          선택 값: <b>{value ?? '없음'}</b>
        </div>
      </div>
    );
  },
  args: {
    options,
    label: '학과 선택',
  },
};

export const FixedMode: Story = {
  render: (args) => (
    <div className="h-[100dvh] p-6 bg-gray-100">
      <DropDownReport {...args} />
    </div>
  ),
  args: {
    options,
    fixed: true,
    icon: 'report',
    label: '내 저장 목록',
  },
};