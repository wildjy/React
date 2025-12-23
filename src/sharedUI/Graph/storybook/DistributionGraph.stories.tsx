// DistributionGraph.stories.tsx
import React from 'react';
import { DistributionGraph } from '../DistributionGraph';

export default {
  title: 'UI/Graph/DistributionGraph',
  component: DistributionGraph,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: '분포 데이터 (value: number[])',
    },
    color: {
      control: { type: 'number', min: 0, max: 360 },
      description: 'HSL hue 값',
    },
    center: {
      control: 'boolean',
      description: '중앙 정렬 여부',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스',
    },
  },
};

type DistributionGraphProps = React.ComponentProps<typeof DistributionGraph>;

const Wrapper = (args: DistributionGraphProps) => (
  <div className="flex justify-center">
    <DistributionGraph {...args} />
  </div>
);

const defaultValues = [
  { value: 4 },
  { value: 7 },
  { value: 22 },
  { value: 38 },
  { value: 42 },
  { value: 36 },
  { value: 20 },
  { value: 14 },
  { value: 3 },
];

/* ---------------- 기본 ---------------- */

export const Default = () =>
  Wrapper({
    value: defaultValues,
  });

/* ---------------- 중앙 정렬 ---------------- */

export const Centered = () =>
  Wrapper({
    value: defaultValues,
    center: true,
  });

/* ---------------- 색상 변경 ---------------- */

export const BlueHue = () =>
  Wrapper({
    value: defaultValues,
    color: 210, // blue
  });

export const GreenHue = () =>
  Wrapper({
    value: defaultValues,
    color: 120, // green
  });

export const RedHue = () =>
  Wrapper({
    value: defaultValues,
    color: 0, // red
  });

/* ---------------- 작은 값 강조 ---------------- */

export const SmallValues = () =>
  Wrapper({
    value: defaultValues,
    color: 280, // purple
  });

/* ---------------- 텍스트 커스터마이즈 ---------------- */

export const CustomTextStyle = () =>
  Wrapper({
    value: defaultValues,
    addClass: 'text-xs md:text-sm font-medium',
  });
