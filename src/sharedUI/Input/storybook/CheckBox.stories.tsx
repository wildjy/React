import { Meta, StoryFn } from '@storybook/react';
import { CheckBox } from '../CheckBox';

// Storybook 메타 설정
export default {
  title: 'UI/CheckBox/CheckBox',
  component: CheckBox,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'auto'],
      description: 'CheckBox의 크기 설정',
    },
    mode: {
      control: 'select',
      options: ['base', 'text', 'rectangle', 'icon'],
      description: 'CheckBox의 모드 설정',
    },
    color: {
      control: 'select',
      options: ['base', 'fill', 'blue', 'lineCheck'],
      description: 'CheckBox의 색상 테마',
    },
    round: {
      control: 'select',
      options: ['base', 'none', 'md', 'lg', 'full'],
      description: 'CheckBox 테두리 둥글기 설정',
    },
    label: { control: 'text', description: 'CheckBox 라벨 텍스트' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    value: { control: 'text', description: 'CheckBox의 값' },
    addClass: { control: 'text', description: '추가 클래스명' },
  },
  tags: ['autodocs'],
} as Meta<typeof CheckBox>;

// Template 설정
const Template: StoryFn<typeof CheckBox> = (args) => <CheckBox {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  label: '기본 체크박스',
  value: 'checkbox_default',
  size: 'md',
  mode: 'base',
  color: 'base',
  round: 'base',
  disabled: false,
};

// 비활성화 체크박스
export const Disabled = Template.bind({});
Disabled.args = {
  label: '비활성화 체크박스',
  value: 'checkbox_disabled',
  size: 'md',
  mode: 'base',
  color: 'base',
  round: 'base',
  disabled: true,
};

// 텍스트 모드 체크박스
export const TextMode = Template.bind({});
TextMode.args = {
  label: '텍스트 모드 체크박스',
  value: 'checkbox_text',
  mode: 'text',
  color: 'base',
  size: 'md',
};

// 아이콘 모드 체크박스
export const IconMode = Template.bind({});
IconMode.args = {
  label: '아이콘 모드 체크박스',
  value: 'checkbox_icon',
  mode: 'icon',
  size: 'md',
  color: 'fill',
};

// 테두리 둥글기 테스트
export const Rounded = Template.bind({});
Rounded.args = {
  label: '둥근 테두리 체크박스',
  value: 'checkbox_rounded',
  round: 'full',
  size: 'lg',
  color: 'blue',
};
