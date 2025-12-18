import { Meta, StoryFn } from '@storybook/react';
import { Button } from '../Button';
import { ButtonBox } from '../ButtonBox';
import { ButtonLink } from '../Link';

export default {
  title: 'UI/Button/ButtonBox',
  component: ButtonBox,
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'], // `align` 옵션
      description: 'Set the alignment of the button box.',
    },
    addClass: {
      control: 'text', // 추가 클래스는 자유 텍스트 입력
      description: 'Add custom Tailwind CSS classes.',
    },
    children: {
      control: false, // children는 직접 스토리북에서 편집하지 않음
    },
  },
  tags: ['autodocs'],
} as Meta<typeof ButtonBox>;

const Template: StoryFn<typeof ButtonBox> = (args) => (
  <ButtonBox {...args}>
    <Button mode="secondary">취소</Button>
    <ButtonLink mode="primary">확인</ButtonLink>
    <ButtonLink mode="tertiary" round="full">
      tertiary
    </ButtonLink>
  </ButtonBox>
);

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  align: 'center',
};

// 왼쪽 정렬
export const AlignLeft = Template.bind({});
AlignLeft.args = {
  align: 'left',
};

// 오른쪽 정렬
export const AlignRight = Template.bind({});
AlignRight.args = {
  align: 'right',
};

// 사용자 정의 클래스 예제
export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  align: 'center',
  addClass: 'bg-gray-100 p-4 rounded shadow-lg',
};
