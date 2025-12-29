import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StepBar } from '../StepBar';

const meta: Meta<typeof StepBar> = {
  title: 'UI/StepBar/StepBar',
  component: StepBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StepBar>;

const stepData = [
  { name: '회원가입', url: '/#', isCompleted: true },
  { name: '정보 입력', url: '/#', isCompleted: true },
  { name: '정보 검토', url: '/#' },
  { name: '완료', url: '/#' },
];

const StepBarTemplate = ({ current = 0, posTop, addClass }: { current?: number; posTop?: string; addClass?: string }) => {
  const [stepIndex, setStepIndex] = useState(current);
  return (
    <div className="mt-15 min-h-[15rem] bg-gray-300 md:bg-white md:min-h-1/4 relative">
      <StepBar step={stepData} currentStep={stepIndex} onStepClick={setStepIndex} posTop={posTop} addClass={addClass} />
    </div>
  );
};

export const Default: Story = {
  render: () => <StepBarTemplate posTop="xl:-top-0" />,
};

export const ReviewStepActive: Story = {
  render: () => <StepBarTemplate posTop="xl:-top-0" current={2} />,
};

export const CustomPositionTop: Story = {
  render: () => <StepBarTemplate posTop="xl:-top-[6rem]" />,
};
