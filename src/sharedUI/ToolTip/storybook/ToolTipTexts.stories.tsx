import type { Meta, StoryObj } from '@storybook/react';
import { ToolTipTexts } from '../ToolTipTexts';

const meta: Meta<typeof ToolTipTexts> = {
  title: 'UI/Tooltip/ToolTipTexts',
  component: ToolTipTexts,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '툴팁 상단 제목',
    },
    text: {
      control: 'text',
      description: '툴팁 본문 텍스트',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToolTipTexts>;

const TOOLTIP_TEXTS_DEMO: {
  id: string;
  title?: string;
  text: string;
}[] = [
  {
    id: 'score-base',
    title: '점수 산출 기준',
    text: '최근 3개년 수능 및 모의지원 데이터를 기반으로 계산된 점수입니다.',
  },
  {
    id: 'reference-only',
    title: '안내',
    text: '본 결과는 참고용이며 실제 합격 결과를 보장하지 않습니다.',
  },
  {
    id: 'no-title',
    text: '대학별 전형 요소에 따라 반영 비율이 상이할 수 있습니다.',
  },
  {
    id: 'long-text',
    title: '유의사항',
    text:
      '전형 변경, 모집 인원 변동 등 외부 요인에 의해 결과가 달라질 수 있으므로 ' +
      '최종 지원 시 반드시 대학 모집요강을 확인하시기 바랍니다.',
  },
];

export const Default: Story = {
  args: {
    title: '안내',
    text: '해당 점수는 최근 3개년 데이터를 기반으로 산출되었습니다.',
  },
};

export const WithoutTitle: Story = {
  args: {
    text: '제목 없이도 본문 텍스트만 노출할 수 있습니다.',
  },
};

export const LongText: Story = {
  args: {
    title: '유의사항',
    text: (
      <>
        본 결과는 참고용이며 실제 합격 결과를 보장하지 않습니다.
        <br />
        지원 전략 수립 시 활용해 주세요.
      </>
    ),
  },
};

export const DemoList: Story = {
  render: () => (
    <div className="flex flex-col max-w-sm gap-4">
      {TOOLTIP_TEXTS_DEMO.map(({ id, title, text }) => (
        <div
          key={id}
          className="p-4 bg-white border border-gray-200 rounded-md"
        >
          <ToolTipTexts title={title} text={text} />
        </div>
      ))}
    </div>
  ),
};
