import { Meta, StoryObj } from '@storybook/react';
import { InfoNoData } from '../InfoNodata';

const meta: Meta<typeof InfoNoData> = {
  title: 'UI/NoData/InfoNoData',
  component: InfoNoData,
  tags: ['autodocs'],
  argTypes: {
    iconType: {
      control: 'select',
      options: ['info', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoNoData>;

export const Default: Story = {
  args: {
    title: '데이터가 없습니다.',
    subTxt: '조건에 맞는 결과를 찾을 수 없습니다.',
  },
};

export const WithInfoText: Story = {
  args: {
    title: '결과가 없습니다.',
    subTxt: '선택한 조건으로는 분석이 불가능합니다.',
    infoTxt: {
      label: '조건을 변경해 다시 시도해 주세요.',
      color: 'text-red-800',
    },
  },
};

export const WithTips: Story = {
  args: {
    title: '조회할 수 있는 데이터가 없습니다.',
    subTxt: '아직 성적 입력이 완료되지 않았습니다.',
    infoTxt: {
      label: '성적을 입력하면 분석 결과를 확인할 수 있습니다.',
      color: 'text-blue-800',
    },
    tip: [
      { text: '박스 넓이(회색tip박스)는 컨텐츠 크기에 따라 자동 조절됩니다.' },
      { text: '성적 입력 메뉴에서 성적을 먼저 입력해 주세요.' },
      { text: '모든 필수 과목을 입력해야 분석이 가능합니다.' },
    ],
  },
};

export const WithButton: Story = {
  args: {
    title: '분석할 데이터가 없습니다.',
    subTxt: '성적 입력 후 다시 시도해 주세요.',
    button: {
      label: '성적 입력하러 가기',
      url: '#',
    },
  },
};

export const FullOption: Story = {
  args: {
    iconType: 'info',
    title: '분석 결과가 없습니다.',
    subTxt: (
      <>
        아직 분석할 수 있는 데이터가 없습니다.
        <br />
        성적 입력 후 다시 이용해 주세요.
      </>
    ),
    infoTxt: {
      label: '입력한 성적은 언제든 수정할 수 있습니다.',
      color: 'text-gray-700',
    },
    tip: [
      { text: '성적 입력은 평균 1~2분 정도 소요됩니다.' },
      { text: '입력 완료 후 분석 결과가 자동으로 반영됩니다.' },
    ],
    button: {
      label: '성적 입력하기',
      url: '#',
    },
  },
};
