import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button } from '../../Button/Button'; // 버튼 경로에 맞게 조정
import { ToolTip } from '../ToolTip';
import { ToolTipTexts } from '../ToolTipTexts';

const meta: Meta<typeof ToolTip> = {
  title: 'UI/ToolTip/ToolTip',
  component: ToolTip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '🧭 `ToolTip`은 버튼 클릭으로 열리고 바깥 클릭 시 닫히는 툴팁 팝업 컴포넌트입니다. `type`, `align`, `outClose` 옵션을 통해 다양한 위치 및 동작 제어가 가능합니다.',
      },
    },
  },
  argTypes: {
    iconUrl: {
      control: 'text',
      description: '툴팁을 여는 아이콘 URL (배경 이미지)',
    },
    type: {
      control: 'radio',
      options: ['base', 'layer'],
      description: '툴팁 위치 타입(layer일땐 align 적용불가)',
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: '`type="base"`일 경우 정렬 위치',
    },
    justify: {
      control: 'radio',
      options: ['start', 'center', 'end'],
      description: '툴팁 wrapper의 justify 설정',
    },
    close: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부',
    },
    outClose: {
      control: 'boolean',
      description: '툴팁 외부 클릭 시 닫히는 여부',
    },
    isOpen: {
      control: 'boolean',
      description: '툴팁 열림 여부 (제어형)',
    },
    addClass: {
      control: 'text',
      description: '툴팁에 추가할 클래스',
    },
    onClick: {
      action: 'clicked',
      description: '아이콘 버튼 클릭 이벤트',
    },
  },
};

export default meta;

const dummyDatas = [
  {
    title: '툴팁 title 1',
    text: '툴팁 내용 1이 들어갑니다.',
  },
  {
    title: '툴팁 title 2',
    text: (
      <>
        툴팁 내용 2가 들어갑니다. <br />
        여러 줄의 텍스트도 문제없습니다.
      </>
    ),
  },
  {
    text: (
      <>
        제목 없이도 본문 텍스트만 노출할 수 있습니다. <br />
        여러 줄의 텍스트도 문제없습니다.
      </>
    ),
  },
  {
    title: '툴팁 title 3',
    text: '툴팁 내용 3이 들어갑니다.',
  },
];

const Template: StoryFn<typeof ToolTip> = (args) => {
  const [open, setOpen] = useState<boolean>(args.isOpen ?? false);

  useEffect(() => {
    setOpen(args.isOpen ?? false);
  }, [args.isOpen]);

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }[args.justify || 'start'];

  return (
    <div className={`flex flex-wrap ${justifyClass} gap-3 h-[250px]`}>
      <span>툴팁 (ToolTip)</span>
      <ToolTip
        {...args}
        isOpen={open}
        onClick={() => {
          setOpen((prev) => !prev);
          args.onClick?.();
        }}
      >
        {dummyDatas.map((data, index) => (
          <div key={index} className="mt-3 first:mt-0">
            <ToolTipTexts title={data.title} text={data.text} />
          </div>
        ))}
        {!args.close && (
          <div className="md:mt-2">
            <Button size="sm" onClick={() => setOpen(false)}>
              닫기
            </Button>
          </div>
        )}
      </ToolTip>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'base',
  align: 'left',
  close: true,
  outClose: false,
  isOpen: false,
  addClass: '',
};

export const Layer = Template.bind({});
Layer.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'layer',
  align: 'left',
  close: true,
  isOpen: false,
  addClass: '',
};

export const Align = Template.bind({});
Align.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'base',
  align: 'right',
  close: true,
  isOpen: false,
  addClass: '',
  justify: 'end',
};

export const NoClose = Template.bind({});
NoClose.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'base',
  align: 'left',
  close: false,
  outClose: true,
  isOpen: false,
  addClass: '',
};

export const NoOutClose = Template.bind({});
NoOutClose.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'base',
  align: 'left',
  close: true,
  outClose: false,
  isOpen: false,
  addClass: '',
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_plus.svg',
  type: 'layer',
  align: 'left',
  close: true,
  isOpen: false,
  addClass: '',
};

export const CustomLayerClass = Template.bind({});
CustomLayerClass.args = {
  iconUrl: 'https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg',
  type: 'base',
  align: 'left',
  close: true,
  isOpen: false,
  addClass: 'min-w-[300px] bg-gray-50',
};
