import { Meta, StoryFn } from '@storybook/react';
import { TextInput } from '../TextInput';

// Storybook 메타 설정
export default {
  title: 'UI/Input/TextInput',
  component: TextInput,
  argTypes: {
    size: {
      control: 'select',
      options: ['base', 'sm', 'md', 'lg', 'full'],
      description: 'Input의 크기 설정',
    },
    mode: {
      control: 'select',
      options: ['base', 'ghost', 'success', 'warning', 'error'],
      description: 'Input의 모드 설정',
    },
    label: { control: 'text', description: 'Input의 라벨 텍스트' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    readonly: { control: 'boolean', description: '읽기 전용 여부' },
    addClass: { control: 'text', description: '추가 클래스명' },
    addId: { control: 'text', description: 'Input의 ID' },
  },
  tags: ['autodocs'],
} as Meta<typeof TextInput>;

// Template 설정
const Template: StoryFn<typeof TextInput> = (args) => <TextInput {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  label: '기본 입력',
  size: 'base',
  mode: 'base',
  addId: 'text-input-default',
};

// 비활성화 Input
export const Disabled = Template.bind({});
Disabled.args = {
  label: '비활성화 입력',
  size: 'base',
  mode: 'base',
  disabled: true,
  addId: 'text-input-disabled',
};

// 읽기 전용 Input
export const ReadOnly = Template.bind({});
ReadOnly.args = {
  label: '읽기 전용 입력',
  size: 'base',
  mode: 'base',
  addId: 'text-input-readonly',
};

// Ghost 모드 Input
export const GhostMode = Template.bind({});
GhostMode.args = {
  label: '고스트 모드 입력',
  size: 'base',
  mode: 'ghost',
  addId: 'text-input-ghost',
};

// 성공 모드 Input
export const SuccessMode = Template.bind({});
SuccessMode.args = {
  label: '성공 상태 입력',
  size: 'base',
  mode: 'success',
  addId: 'text-input-success',
};

// 에러 모드 Input
export const ErrorMode = Template.bind({});
ErrorMode.args = {
  label: '에러 상태 입력',
  size: 'base',
  mode: 'error',
  addId: 'text-input-error',
};

// 크기별 Input
export const Sizes = () => (
  <div className="flex flex-col gap-4">
    <TextInput label="Small Input" size="sm" addId="text-input-sm" />
    <TextInput label="Medium Input" size="md" addId="text-input-md" />
    <TextInput label="Large Input" size="lg" addId="text-input-lg" />
    <TextInput label="Full Width Input" size="full" addId="text-input-full" />
  </div>
);
