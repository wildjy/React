import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import BottomSheet from "../sharedUI/LayerPopup/BottomSheet";

// Storybook 메타 설정
export default {
  title: "Components/BottomSheet",
  component: BottomSheet,
  argTypes: {
    isOpen: { control: "boolean", description: "BottomSheet 열림/닫힘 상태" },
    type: {
      control: "select",
      options: ["base", "full"],
      description: "BottomSheet 형태",
    },
    dimm: { control: "boolean", description: "딤 배경 여부" },
    close: { control: "boolean", description: "닫기 버튼 표시 여부" },
    round: {
      control: "select",
      options: ["base", "sm", "md", "xl"],
      description: "BottomSheet 테두리 둥글기",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "내용 정렬",
    },
  },
} as Meta<typeof BottomSheet>;

// Template 설정
const Template: StoryFn<typeof BottomSheet> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleBottomSheet}
        className="p-2 bg-blue-500 text-white"
      >
        {isOpen ? "BottomSheet 닫기" : "BottomSheet 열기"}
      </button>
      <BottomSheet {...args} isOpen={isOpen} OpenEvent={toggleBottomSheet}>
        <BottomSheet.Header>
          <h3 className="text-lg font-semibold">BottomSheet Header</h3>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <p className="p-4">
            이곳은 BottomSheet의 본문 영역입니다. 다양한 콘텐츠를 넣어보세요.
          </p>
          <p className="p-4">
            스크롤 테스트를 위해 여러 줄을 추가해보세요.
          </p>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <div className="flex justify-end gap-2 p-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md">취소</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              확인
            </button>
          </div>
        </BottomSheet.Footer>
      </BottomSheet>
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

// Full 타입 스토리
export const FullSheet = Template.bind({});
FullSheet.args = {
  isOpen: true,
  type: "full",
  dimm: true,
  close: true,
  round: "none",
};

// 딤 제거 스토리
export const WithoutDimm = Template.bind({});
WithoutDimm.args = {
  isOpen: true,
  type: "base",
  dimm: false,
  close: true,
};

// 테두리 둥글기 스토리
export const RoundedSheet = Template.bind({});
RoundedSheet.args = {
  isOpen: true,
  type: "base",
  dimm: true,
  close: true,
  round: "xl",
};
