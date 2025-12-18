// DonutGraphCanvas.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { DonutGraphCanvas } from '../DonutGraphCanvas';

export default {
  title: 'UI/Graph/DonutGraphCanvas',
  component: DonutGraphCanvas,
  argTypes: {
    activeLine: { control: 'object', description: '게이지 선 표시' },
    half: { control: 'boolean', description: '반원 그래프' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    addClass: {
      control: 'text',
      description: '추가 클래스명 (내부 폰트사이즈 컨트롤)',
    },
    mark: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    scores: { control: 'number', description: '센터 표시' },
    myscore: { control: 'number', description: '나의 값(센터 표시)' },
    unit: { control: 'text' },
    size: {
      control: 'object',
      description: '{ size: number, depth: number, p: number }',
    },
    tick: {
      control: 'object',
      description: '{ show: boolean, length?: number, label?: boolean }',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof DonutGraphCanvas>;

const Template: StoryFn<typeof DonutGraphCanvas> = (args) => (
  <div className='flex justify-center items-center'>
    <DonutGraphCanvas {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  activeLine: { show: true, label: true },
  half: false,
  tick: {
    show: true,
    length: 4,
    label: true,
  },
  unit: '점',
  size: { size: 200, depth: 20, p: 35 },
  min: 0,
  max: 100,
  scores: {score: 75},
  disabled: false,
};

export const Size = Template.bind({});
Size.args = {
  size: {
    size: 200,
    depth: 5,
    p: 25
  },
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  min: 0,
  max: 100,
  scores: {score: 75},
};

export const Color = Template.bind({});
Color.args = {
  size: { size: 200, depth: 20 },
  colors: ['#84DCCA', '#999'],
  min: 0,
  max: 100,
  scores: {score: 90},
};

export const Unit = Template.bind({});
Unit.args = {
  unit: 'unit',
  size: { size: 200, depth: 20, p: 25 },
  min: 0,
  max: 100,
  scores: {show: true, score: 75},
};

export const MinMax = Template.bind({});
MinMax.args = {
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  size: { size: 200, depth: 10 },
  min: 720,
  max: 1000,
  scores: {score: 890},
};

export const Half = Template.bind({});
Half.args = {
  tick: {
    show: true,
    length: 4,
    label: true,
  },
  half: true,
  size: { size: 200, depth: 20 },
  min: 0,
  max: 100,
  myscore: { score: 83, label: '상위' },
  scores: {score: 56},
  unit: '%',
  disabled: false,
};

export const Tick = Template.bind({});
Tick.args = {
  tick: {
    show: true,
    length: 10,
    label: false,
  },
  size: { size: 200, depth: 10 },
  min: 0,
  max: 100,
  scores: {score: 45},
};

export const TickLabel = Template.bind({});
TickLabel.args = {
  tick: {
    show: true,
    length: 10,
    label: true,
    fontSize: '0.75rem',
  },
  size: {
    size: 200,
    depth: 10,
    p: 25
  },
  min: 0,
  max: 100,
  scores: {score: 45},
};

export const ActiveLine = Template.bind({});
ActiveLine.args = {
  activeLine: { show: true, label: false },
  half: false,
  size: { size: 200, depth: 15, p: 30 },
  min: 0,
  max: 100,
  scores: {score: 75},
  unit: '점',
  disabled: false,
};

export const ActiveLineLabel = Template.bind({});
ActiveLineLabel.args = {
  activeLine: { show: true, label: true },
  half: false,
  size: { size: 200, depth: 15, p: 35 },
  min: 0,
  max: 100,
  scores: {show: true, score: 75},
  unit: '점',
  disabled: false,
};

export const MyScore = Template.bind({});
MyScore.args = {
  half: false,
  tick: {
    show: true,
    length: 5,
    label: true,
  },
  size: { size: 200, depth: 20, p: 25 },
  min: 0,
  max: 100,
  scores: {
    show: true,
    score: 34
  },
  myscore: {
    show: true,
    score: 85,
    label: '내 점수',
    tick: true,
  },
  unit: '점',
  disabled: false,
};

export const LegendScore = Template.bind({});
LegendScore.args = {
  half: false,
  tick: {
    show: true,
    length: 5,
    label: true,
  },
  size: { size: 200, depth: 20, p: 25 },
  min: 0,
  max: 100,
  scores: {
    show: true,
    score: [10, 15, 25, 10, 40],
    label: ['A', 'B', 'C', 'D', 'E'],
    total: true,
    legend: true,
    legendScore: {
      show: true,
      color: 'red',
      addClass: ''
    },
    center: false,
    addClass: 'text-left bg-blue-50'
  },
  myscore: {
    show: true,
    score: 85,
    label: '내 점수',
    tick: true,
  },
  unit: '점',
  disabled: false,
};

export const Accumulate = Template.bind({});
Accumulate.args = {
  size: { size: 200, depth: 20 },
  colors: ['#FFCA69', '#FFFF37', '#6969FF', '#FF9191'],
  min: 0,
  max: 100,
  scores: {score: [8, 3, 27, 31], center: true},
  unit: '%',
};

export const AccumulateLabel = Template.bind({});
AccumulateLabel.args = {
  // tick: {
  //   show: true,
  //   length: 5,
  //   label: false,
  // },
  size: { size: 200, depth: 20 },
  colors: ['#FFCA69', '#358035', '#6969FF', '#FF9191'],
  min: 0,
  max: 100,
  scores: {score: [8, 22, 30, 10], label: true, center: false}, //  label: [8, 3, 27, 31],
  unit: '%',
};

export const AccumulateLegend = Template.bind({});
AccumulateLegend.args = {
  // tick: {
  //   show: true,
  //   length: 5,
  //   label: false,
  // },
  size: { size: 200, depth: 30 },
  colors: ['#FFCA69', '#358035', '#6969FF', '#FF9191'],
  min: 0,
  max: 100,
  scores: {score: [8, 22, 27, 13], label: false, fontSize: '.9rem', center: true, legend: true}, //  label: [8, 3, 27, 31],
  unit: '%',
};

export const AccumulateTotal = Template.bind({});
AccumulateTotal.args = {
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  size: { size: 200, depth: 20 },
  colors: ['#FFCA69', '#FFFF69', '#6969FF', '#FF9191', '#358035'],
  min: 0,
  max: 100,
  scores: {score: [10, 30, 20, 20, 20], label: false, total: true, center: true, legend: true},
  unit: '%',
};

export const AccumulateTotalLabel = Template.bind({});
AccumulateTotalLabel.args = {
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  size: { size: 200, depth: 20 },
  colors: ['#FFCA69', '#FFFF69', '#6969FF', '#FF9191', '#358035'],
  min: 0,
  max: 100,
  scores: {score: [10, 30, 20, 20, 20], label: ['국어', '영어', '수학', '과탐', '외국어'], total: true, center: false, legend: true},
  unit: '%',
};

export const AccumulateHalf = Template.bind({});
AccumulateHalf.args = {
  half: true,
  tick: {
    show: true,
    length: 5,
    label: true,
  },
  size: { size: 200, depth: 20 },
  colors: ['#FFCA69', '#FFFF69', '#6969FF', '#FF9191'],
  min: 0,
  max: 100,
  scores: {score: [8, 3, 27, 31], center: true, legend: true},
  unit: '%',
};

export const AccumulateFull = Template.bind({});
AccumulateFull.args = {
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  size: { size: 300, depth: 150 },
  colors: ['#FFCA69', '#20B2AA', '#6969FF', '#FF9191', '#358035'],
  min: 0,
  max: 100,
  scores: {score: [15, 20, 27, 23, 15], fontSize: '.9rem', color: '#fefefe', label: ['국어', '영어', '수학', '과탐', '외국어'], center: true, legend: true},
  unit: '%',
};

export const AccumulateHalfFull = Template.bind({});
AccumulateHalfFull.args = {
  half: true,
  tick: {
    show: true,
    length: 10,
    label: true,
  },
  size: { size: 300, depth: 150 },
  colors: ['#FFCA69', '#20B2AA', '#6969FF', '#FF9191', '#358035'],
  min: 0,
  max: 100,
  scores: {score: [15, 20, 27, 23, 15], fontSize: '.8rem', color: '#eee', label: true, center: true, legend: true},
  unit: '%',
};

export const AddClass = Template.bind({});
AddClass.args = {
  activeLine: { show: false, label: true },
  half: false,
  tick: {
    show: true,
    length: 5,
    label: true,
  },
  size: { size: 200, depth: 20, p: 35 },
  min: 0,
  max: 100,
  scores: {score: 75},
  addClass: 'text-2xl text-[red]',
};

export const Disabled = Template.bind({});
Disabled.args = {
  activeLine: { show: false, label: false },
  half: false,
  tick: {
    show: true,
    length: 5,
    label: true,
  },
  size: { size: 200, depth: 20, p: 25 },
  min: 0,
  max: 100,
  scores: {score: 75},
  disabled: true,
};
