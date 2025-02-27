import { Meta, StoryFn } from '@storybook/react';
import { Radio } from '../Radio';

// Storybook 메타 설정
export default {
  title: 'UI/Radio/Radio',
  component: Radio,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Radio 버튼의 크기 설정',
    },
    mode: {
      control: 'select',
      options: ['base', 'check'],
      description: 'Radio 버튼의 모드 설정',
    },
    label: { control: 'text', description: 'Radio 라벨 텍스트' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    value: { control: 'text', description: 'Radio 버튼의 값' },
    name: { control: 'text', description: 'Radio 그룹의 이름' },
    addClass: { control: 'text', description: '추가 클래스명' },
  },
  tags: ['autodocs'],
} as Meta<typeof Radio>;

// Template 설정
const Template: StoryFn<typeof Radio> = (args) => <Radio {...args} />;

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  mode: 'base',
  label: '기본 라디오 버튼',
  value: 'radio_default',
  name: 'example',
  disabled: false,
};

// 비활성화된 라디오 버튼
export const Disabled = Template.bind({});
Disabled.args = {
  size: 'md',
  mode: 'base',
  label: '비활성화 라디오 버튼',
  value: 'radio_disabled',
  name: 'example',
  disabled: true,
};

// 체크 모드 라디오 버튼
export const CheckMode = Template.bind({});
CheckMode.args = {
  size: 'md',
  mode: 'check',
  label: '체크 모드 라디오 버튼',
  value: 'radio_check',
  name: 'example',
};

// 크기별 라디오 버튼
export const Sizes = () => (
  <div className="flex flex-col gap-4">
    <Radio size="sm" label="Small" value="radio_sm" name="size_group" />
    <Radio size="md" label="Medium" value="radio_md" name="size_group" />
    <Radio size="lg" label="Large" value="radio_lg" name="size_group" />
  </div>
);

// 그룹 라디오 버튼
export const RadioGroup = () => (
  <div className="flex flex-col gap-4">
    <Radio size="md" label="Option 1" value="option1" name="group1" />
    <Radio size="md" label="Option 2" value="option2" name="group1" />
    <Radio size="md" label="Option 3" value="option3" name="group1" />
  </div>
);
