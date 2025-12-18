import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { DropDown_Score, OptionType } from '../DropDown_Score';

export default {
  title: 'UI/DropDown/DropDown_Score',
  component: DropDown_Score,
  argTypes: {
    disabled: { control: 'boolean' },
    layer: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['base', 'shadow', 'ghostShadow', 'ghost'],
    },
    align: {
      control: 'select',
      options: ['left', 'center'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropDown_Score>;

const dropOptions1 = [
  { value: 'a', label: '생활과 윤리' },
  { value: 'b', label: '윤리와 사상', disabled: true },
  { value: 'c', label: '세계사' },
  { value: 'd', label: '동아시아사' },
  { value: 'e', label: '사회·문화' }, // 비활성화 옵션
  { value: 'f', label: '경제' },
  { value: 'g', label: '정치와 법' },
  { value: 'h', label: '한국지리' },
];

const dropOptions2 = [
  { value: 'i', label: '물리학 I' },
  { value: 'j', label: '화학 I' },
  { value: 'k', label: '생명과학 I' },
  { value: 'l', label: '지구과학 I' },
  { value: 'm', label: '물리학 II' },
  { value: 'n', label: '화학 II' },
  { value: 'o', label: '생명과학 II' },
  { value: 'p', label: '지구과학 II' },
];

const Template: StoryFn<typeof DropDown_Score> = (args) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(args.value || null);

  useEffect(() => {
    setSelectedValue(args.value || null);
  }, [args.value]);

  const handleChange = (option: OptionType) => {
    console.log('Selected Option:', option);
    setSelectedValue(option.value);
  };

  return (
    <div className="p-6 h-[300px]">
      <DropDown_Score {...args} options={dropOptions1} options1={dropOptions2} value={selectedValue} onChange={handleChange} />
      <p className="mt-4 text-gray-700">
        선택된 값: <strong>{selectedValue || '없음'}</strong>
      </p>
    </div>
  );
};

// **기본 DropDown_Score**
export const Default = Template.bind({});
Default.args = {
  label: '선택',
  type: 'base',
  align: 'left',
  layer: false,
  disabled: false,
};

// ✅ 선택된 옵션을 초기값으로 설정
export const SelectedValue = Template.bind({});
SelectedValue.args = {
  type: 'base',
  size: 'md',
  label: 'Selected Value',
  value: 'c',
};

// **비활성화된 DropDown**
export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

// ✅ 선택된 옵션을 초기값으로 설정
export const DisabledOption = Template.bind({});
DisabledOption.args = {
  type: 'base',
  size: 'md',
  label: 'Disabled Option',
};

// ✅ Shadow Type DropDown
export const ShadowType = Template.bind({});
ShadowType.args = {
  type: 'shadow',
  label: 'Shadow Dropdown',
};

// **레이어 모드 DropDown**
export const Layer768 = Template.bind({});
Layer768.args = {
  ...Default.args,
  layer: true,
};
