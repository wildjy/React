/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JStepBar, JStep } from '../JStepBar';
import { Button } from '../../Button';

const meta: Meta<typeof JStepBar> = {
  title: 'UI/StepBar/JStepBar',
  component: JStepBar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: '모바일 여부',
    },
    isOpenLayer: {
      control: 'boolean',
      description: '모바일 레이어 강제 오픈',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JStepBar>;

const baseSteps: JStep[] = [
  {
    id: 1,
    label: { label: '수험생 정보 입력', userName: '홍길동' },
    url: '/step1',
    result: {
      active: true,
      value: '완료',
    },
  },
  {
    id: 2,
    label: '성적 입력',
    url: '/step2',
    result: {
      active: true,
      value: '완료',
    },
  },
  {
    id: 3,
    label: '모의지원',
    url: '/step3',
    result: {
      active: false,
      value: '3',
      disabled: true,
      message: '오픈예정',
      alertMsg: '모의지원은 준비 중입니다.',
    },
  },
  {
    id: 4,
    label: '합격예측',
    url: '/step4',
    result: {
      active: false,
      value: '미이용',
      activeUrl: '/step4/result',
      disabled: true,
      message: '오픈예정',
      alertMsg: '합격예측은 준비 중입니다.',
    },
  },
  {
    id: 5,
    label: '5단계 스텝',
    url: '/step5',
    result: {
      active: false,
      value: '-',
      disabled: true,
      message: '오픈예정',
      alertMsg: '5단계 스텝은 준비 중입니다.',
    },
  },
];

export const DesktopDefault: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button size="auto" onClick={() => setOpen(!open)}>
          Open Mobile
        </Button>
        <JStepBar {...args} isOpenLayer={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  args: {
    step: baseSteps,
    isMobile: false,
  },
};

export const NumberType: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button size="auto" onClick={() => setOpen(!open)}>
          Open Mobile
        </Button>
        <JStepBar {...args} isOpenLayer={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  args: {
    step: baseSteps,
    isMobile: true,
    isOpenLayer: false,
  },
};

export const MobileOpened: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button size="auto" onClick={() => setOpen(!open)}>
          Open Mobile
        </Button>
        <JStepBar {...args} isOpenLayer={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  args: {
    step: baseSteps,
    isMobile: false,
  },
};

export const AllDisabled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button size="auto" onClick={() => setOpen(!open)}>
          Open Mobile
        </Button>
        <JStepBar {...args} isOpenLayer={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  args: {
    step: baseSteps.map((step) => ({
      ...step,
      result: {
        ...step.result,
        active: false,
        disabled: true,
        value: step.result?.value, // 기존 value 명시적으로 유지
      },
    })),
    isMobile: false,
  },
};
