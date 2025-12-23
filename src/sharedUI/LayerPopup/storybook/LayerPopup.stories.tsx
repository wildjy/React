import { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import LayerPopup from '../LayerPopup';

export default {
  title: 'UI/LayerPopup/LayerPopup',
  component: LayerPopup,
  argTypes: {
    type: {
      control: 'select',
      options: ['base', 'full', 'scroll', 'absolute'],
      description: 'Popup type to control layout and behavior',
      defaultValue: 'base',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment inside the popup',
      defaultValue: 'left',
    },
    dimm: {
      control: 'boolean',
      description: 'Enable or disable background dimming',
      defaultValue: true,
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility of the popup',
      defaultValue: true,
    },
    close: {
      control: 'boolean',
      description: 'Show or hide the close button',
      defaultValue: true,
    },
    round: {
      control: 'select',
      options: ['base', 'sm', 'md', 'xl'],
      description: 'Border rounding for the popup',
      defaultValue: 'base',
    },
    addClass: {
      control: 'text',
      description: 'Additional classes for styling',
      defaultValue: '',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof LayerPopup>;

// Default Template

// Template 설정
const Template: StoryFn<typeof LayerPopup> = (args) => {
  const [isOpen, setIsOpen] = useState(!!args.isOpen);

  // ⭐ 핵심
  useEffect(() => {
    setIsOpen(!!args.isOpen);
  }, [args.isOpen]);

  const togglePopup = () => setIsOpen((prev) => !prev);

  return (
    <div className="h-screen">
      <button
        onClick={togglePopup}
        className="p-2 text-white bg-blue-500 rounded-md"
      >
        {isOpen ? '팝업 닫기' : '팝업 열기'}
      </button>
      <div className="relative">
        <LayerPopup
          {...args}
          disabledAutoFocus={true}
          isOpen={isOpen}
          OpenEvent={togglePopup}
        >
          <LayerPopup.Header>
            <h3 className="text-lg font-semibold">Popup Header</h3>
          </LayerPopup.Header>
          <LayerPopup.Body>
            <p className="p-4">
              이곳은 팝업의 본문 영역입니다. 다양한 콘텐츠를 넣어보세요.
            </p>

            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
            </div>
          </LayerPopup.Body>
          <LayerPopup.Footer>
            <div className="flex justify-end gap-2 p-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={togglePopup}
              >
                취소
              </button>
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md">
                확인
              </button>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>
      </div>
    </div>
  );
};

// Default Story
export const Default = Template.bind({});
Default.args = {
  type: 'base',
  align: 'left',
  isOpen: true,
  dimm: true,
  close: true,
};

// BottomSheet Popup Story
export const BottomSheet768 = Template.bind({});
BottomSheet768.args = {
  type: 'bottomSheet',
  isOpen: true,
  dimm: true,
  close: true,
};

// Popup Out Close Story
export const OutClose = Template.bind({});
OutClose.args = {
  type: 'base',
  align: 'left',
  isOpen: true,
  dimm: true,
  close: true,
  outClose: true,
};

// Full Screen Popup Story
export const FullScreen768 = Template.bind({});
FullScreen768.args = {
  type: 'full',
  isOpen: true,
  dimm: true,
  close: true,
};

// Scrollable Popup Story
export const Scrollable = Template.bind({});
Scrollable.args = {
  type: 'scroll',
  isOpen: true,
  dimm: true,
  close: true,
  addClass: 'max-h-[20rem]',
};

// Absolute Position Popup Story
export const AbsolutePosition = Template.bind({});
AbsolutePosition.args = {
  type: 'absolute',
  isOpen: true,
  dimm: false,
  close: true,
};
