import { Meta, StoryObj } from '@storybook/react';
import { DistributionGraph } from '../DistributionGraph';

const meta: Meta<typeof DistributionGraph> = {
  title: 'UI/Graph/DistributionGraph',
  component: DistributionGraph,
  tags: ['autodocs'],
  argTypes: {
    center: {
      control: 'boolean',
      description: '그래프 중앙 정렬 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DistributionGraph>;

const defaultValues = [
  { value: 4 },
  { value: 8 },
  { value: 12 },
  { value: 18 },
  { value: 22 },
  { value: 16 },
  { value: 10 },
  { value: 7 },
  { value: 3 },
];

export const Default: Story = {
  args: {
    value: defaultValues,
  },
};

export const Centered: Story = {
  args: {
    value: defaultValues,
    center: true,
  },
};

export const SkewedDistribution: Story = {
  args: {
    value: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 5 },
      { value: 9 },
      { value: 15 },
      { value: 20 },
      { value: 20 },
      { value: 25 },
    ],
  },
};

export const SmallValues: Story = {
  args: {
    value: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
    ],
  },
};

export const WideContainer: Story = {
  render: (args) => (
    <div className="p-6 bg-gray-50 w-full">
      <DistributionGraph {...args} />
    </div>
  ),
  args: {
    value: defaultValues,
  },
};
