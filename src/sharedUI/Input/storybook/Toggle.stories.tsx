import { Meta, StoryFn } from '@storybook/react';
import { Toggle } from '../Toggle';

export default {
  title: 'UI/Input/Toggle',
  component: Toggle,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '토글 크기',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
      description: 'ON 상태 색상',
    },
    innerText: {
      control: 'select',
      options: ['show', 'hide'],
      description: '트랙 내부 ON/OFF 텍스트 표시 여부',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트 (LabelToggle 형태)',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '라벨 위치',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스명',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = (args) => <Toggle {...args} />;

/** 기본 토글 */
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  color: 'primary',
  innerText: 'hide',
  disabled: false,
};

/** LabelToggle – 라벨 오른쪽 */
export const LabelRight = Template.bind({});
LabelRight.args = {
  size: 'md',
  color: 'primary',
  label: '알림 받기',
  labelPosition: 'right',
  disabled: false,
};

/** LabelToggle – 라벨 왼쪽 */
export const LabelLeft = Template.bind({});
LabelLeft.args = {
  size: 'md',
  color: 'primary',
  label: '알림 받기',
  labelPosition: 'left',
  disabled: false,
};

/** ON/OFF 텍스트 표시 */
export const WithInnerText = Template.bind({});
WithInnerText.args = {
  size: 'md',
  color: 'primary',
  innerText: 'show',
  label: '알림 받기',
  disabled: false,
};

/** 소형 */
export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  color: 'primary',
  label: '소형 토글',
  disabled: false,
};

/** 대형 */
export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  color: 'primary',
  label: '대형 토글',
  disabled: false,
};

/** Success 색상 */
export const Success = Template.bind({});
Success.args = {
  size: 'md',
  color: 'success',
  label: '성공 색상',
  disabled: false,
};

/** Warning 색상 */
export const Warning = Template.bind({});
Warning.args = {
  size: 'md',
  color: 'warning',
  label: '경고 색상',
  disabled: false,
};

/** Danger 색상 */
export const Danger = Template.bind({});
Danger.args = {
  size: 'md',
  color: 'danger',
  label: '위험 색상',
  disabled: false,
};

/** 비활성화 */
export const Disabled = Template.bind({});
Disabled.args = {
  size: 'md',
  color: 'primary',
  label: '비활성화',
  disabled: true,
};

/** 비활성화 + 체크 상태 */
export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  size: 'md',
  color: 'primary',
  label: '비활성화 (ON 상태)',
  disabled: true,
  defaultChecked: true,
};
