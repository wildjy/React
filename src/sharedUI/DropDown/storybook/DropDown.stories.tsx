import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { DropDown } from '../DropDown'; // DropDown 경로 맞춰 수정

export default {
  title: 'UI/DropDown/DropDown',
  component: DropDown,
  argTypes: {
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['base', 'shadow', 'ghost', 'check'],
      description: 'The type of dropdown',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the dropdown',
    },
    icon: {
      control: 'boolean',
      description: 'Enable or disable the icon',
    },
    addClass: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    options: {
      control: 'object',
      description: 'Options for the dropdown',
    },
    label: {
      control: 'text',
      description: 'Label for the dropdown',
    },
    layer: {
      control: 'boolean',
      description: 'Whether to use layer mode',
    },
    layoutClass: {
      control: 'text',
      description: '외부 컨테이너 정렬 스타일 (ex: flex justify-end)',
      defaultValue: 'flex justify-end',
    },
    widthClass: {
      control: 'text',
      description: 'DropDown 감싸는 너비 설정 (ex: w-[100px])',
      defaultValue: 'w-[100px]',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof DropDown>;

interface DropDownStoryArgse extends React.ComponentProps<typeof DropDown> {
  layoutClass?: string;
  widthClass?: string;
}

// ✅ `useState`로 `selectedValue` 관리하여 선택 반영
const Template: StoryFn<DropDownStoryArgse> = (args) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    args.value || null
  );

  return (
    <div className="p-6 h-[300px]">
      <div className={args.layoutClass}>
        <div className={args.widthClass}>
          <DropDown
            {...args}
            value={selectedValue}
            onChange={(option) => setSelectedValue(option.value)}
          />
        </div>
      </div>
      <p className="mt-4 text-gray-700">
        선택된 값: <strong>{selectedValue || '없음'}</strong>
      </p>
    </div>
  );
};

// ✅ 기본 Dropdown
export const Default = Template.bind({});
Default.args = {
  type: 'base',
  size: 'md',
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 3' },
    { value: '5', label: 'Option 3' },
    { value: '6', label: 'Option 3' },
    { value: '7', label: 'Option 3' },
    { value: '8', label: 'Option 3' },
    { value: '9', label: 'Option 3' },
    { value: '10', label: 'Option 3' },
    { value: '11', label: 'Option 3' },
    { value: '12', label: 'Option 3' },
    { value: '13', label: 'Option 3' },
  ],
  label: 'Select an option',
};

// ✅ 선택된 옵션을 초기값으로 설정
export const SelectedValue = Template.bind({});
SelectedValue.args = {
  type: 'base',
  size: 'md',
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ],
  label: 'Selected Value',
  value: '2', // ✅ 초기 선택된 값 설정
};

// **비활성화된 DropDown**
export const Disabled = Template.bind({});
Disabled.args = {
  type: 'base',
  size: 'md',
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ],
  label: 'Selected Value',
  disabled: true,
};

// ✅ 선택된 옵션을 초기값으로 설정
export const DisabledOption = Template.bind({});
DisabledOption.args = {
  type: 'base',
  size: 'md',
  options: [
    { value: '1', label: 'Option 1', disabled: true },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ],
  label: 'Selected Value',
};

// ✅ Shadow Type DropDown
export const GhostType = Template.bind({});
GhostType.args = {
  type: 'ghost',
  size: 'md',
  options: [
    { value: '1', label: 'Shadow Option 1' },
    { value: '2', label: 'Shadow Option 2' },
    { value: '3', label: 'Shadow Option 3' },
  ],
  label: 'Ghost Dropdown',
  widthClass: 'w-[130px]',
};

// ✅ Shadow Type DropDown
export const ShadowType = Template.bind({});
ShadowType.args = {
  type: 'shadow',
  size: 'md',
  options: [
    { value: '1', label: 'Shadow Option 1' },
    { value: '2', label: 'Shadow Option 2' },
    { value: '3', label: 'Shadow Option 3' },
  ],
  label: 'Shadow Dropdown',
};

// ✅ Check Type DropDown
export const CheckType = Template.bind({});
CheckType.args = {
  type: 'check',
  size: 'md',
  options: [
    { value: '1', label: '최신순' },
    { value: '2', label: '인기순' },
  ],
  label: '선택',
  value: '1',
};

// **레이어 모드 DropDown**
export const Layer768 = Template.bind({});
Layer768.args = {
  ...Default.args,
  layer: true,
};

export const DropAlign = Template.bind({});
DropAlign.args = {
  type: 'base',
  size: 'md',
  min: 'min-w-[9rem]',
  dropAlign: 'right',
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ],
  label: 'Select',
  value: '2',
  layoutClass: 'flex justify-end',
  widthClass: 'w-[120px]',
};

// ✅ 커스텀 콘텐츠 DropDown
export const CustomContent = Template.bind({});
CustomContent.args = {
  type: 'base',
  size: 'md',
  custom: true,
  label: 'Custom Content',
  children: (
    <div className="p-4">
      <p>Custom Content Here</p>
      <button className="px-4 py-2 mt-2 text-white bg-blue-500 rounded">
        Action
      </button>
    </div>
  ),
};
