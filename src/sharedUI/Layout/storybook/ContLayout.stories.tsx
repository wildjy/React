import type { Meta, StoryFn } from '@storybook/react';
import { ContLayout } from '../ContLayout';

const meta: Meta<typeof ContLayout> = {
  title: 'UI/Layout/ContLayout',
  component: ContLayout,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['page', 'sm', 'md', 'lg', 'layer'],
      description: '컨텐츠 레이아웃 타입 (gap 규칙)',
    },
    addClass: {
      control: 'text',
      description: '추가 클래스',
    },
  },
};

export default meta;

const Template: StoryFn<typeof ContLayout> = (args) => (
  <div className="p-5 bg-gray-50">
    <ContLayout {...args} />
  </div>
);

const DemoBox = ({ label }: { label: string }) => (
  <div className="p-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-md">
    {label}
  </div>
);

export const Page = Template.bind({});
Page.args = {
  type: 'page',
  children: [
    <DemoBox key="1" label="Section 1" />,
    <DemoBox key="2" label="Section 2" />,
    <DemoBox key="3" label="Section 3" />,
  ],
};

export const Layer = Template.bind({});
Layer.args = {
  type: 'layer',
  children: [
    <DemoBox key="1" label="Section 1" />,
    <DemoBox key="2" label="Section 2" />,
    <DemoBox key="3" label="Section 3" />,
  ],
};

export const SizeVariants = () => (
  <div className="flex flex-col gap-10 p-5 bg-gray-50">
    <section>
      <h3 className="mb-3 font-bold">sm</h3>
      <ContLayout type="sm">
        <DemoBox label="SM Item 1" />
        <DemoBox label="SM Item 2" />
      </ContLayout>
    </section>

    <section>
      <h3 className="mb-3 font-bold">md</h3>
      <ContLayout type="md">
        <DemoBox label="MD Item 1" />
        <DemoBox label="MD Item 2" />
      </ContLayout>
    </section>

    <section>
      <h3 className="mb-3 font-bold">lg</h3>
      <ContLayout type="lg">
        <DemoBox label="LG Item 1" />
        <DemoBox label="LG Item 2" />
      </ContLayout>
    </section>
  </div>
);
