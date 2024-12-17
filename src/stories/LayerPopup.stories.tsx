import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import LayerPopup from "../sharedUI/LayerPopup/LayerPopup";

// Storybook 메타 설정
export default {
  title: "Components/LayerPopup",
  component: LayerPopup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isOpen: { control: "boolean", description: "팝업 열림/닫힘 상태" },
    type: {
      control: "select",
      options: ["base", "full", "scroll"],
      description: "팝업의 형태",
    },
    dimm: { control: "boolean", description: "딤 배경 여부" },
    close: { control: "boolean", description: "닫기 버튼 표시 여부" },
    round: {
      control: "select",
      options: ["base", "sm", "md", "xl"],
      description: "팝업 테두리 둥글기",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "팝업 내용 정렬",
    },
  },
} as Meta<typeof LayerPopup>;

// Template 설정
const Template: StoryFn<typeof LayerPopup> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={togglePopup}
        className="p-2 bg-blue-500 text-white rounded-md"
      >
        {isOpen ? "팝업 닫기" : "팝업 열기"}
      </button>
      <LayerPopup
        {...args}
        isOpen={isOpen}
        OpenEvent={togglePopup}
        addClass="shadow-lg"
      >
        <LayerPopup.Header>
          <h3 className="text-lg font-semibold">Popup Header</h3>
        </LayerPopup.Header>
        <LayerPopup.Body>
          <p className="p-4">
            이곳은 팝업의 본문 영역입니다. 다양한 콘텐츠를 넣어보세요.
          </p>
        </LayerPopup.Body>
        <LayerPopup.Footer>
          <div className="flex justify-end gap-2 p-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md">취소</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              확인
            </button>
          </div>
        </LayerPopup.Footer>
      </LayerPopup>
    </>
  );
};

// 기본 스토리
export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  type: "base",
  dimm: true,
  close: true,
  round: "md",
  align: "center",
};

// Scroll 타입 스토리
export const ScrollPopup = Template.bind({});
ScrollPopup.args = {
  isOpen: true,
  type: "scroll",
  dimm: true,
  close: true,
  round: "xl",
};

// Full 타입 스토리
export const FullPopup = Template.bind({});
FullPopup.args = {
  isOpen: true,
  type: "full",
  dimm: true,
  close: true,
  round: "base",
};
