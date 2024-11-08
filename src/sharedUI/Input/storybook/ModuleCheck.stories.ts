// src/sharedUI/Input/CheckBox.stories.ts
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import CheckBox from "../CheckBox";

const meta = {
  title: "SharedUI/CheckBox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["radio", "checkbox"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "full"],
    },
    color: {
      control: { type: "select" },
      options: ["base", "ghost", "success", "warning", "error", "disabled"],
    },
    label: { control: "text" },
    value: { control: "text" },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseCheckbox: Story = {
  args: {
    type: "checkbox",
    size: "md",
    color: "base",
    label: "기본 체크박스",
    value: "base-checkbox",
  },
};

export const BaseRadio: Story = {
  args: {
    type: "radio",
    size: "md",
    color: "base",
    label: "기본 라디오",
    value: "base-radio",
  },
};

export const SmallCheckbox: Story = {
  args: {
    type: "checkbox",
    size: "sm",
    label: "작은 체크박스",
    value: "small-checkbox",
  },
};

export const LargeCheckbox: Story = {
  args: {
    type: "checkbox",
    size: "lg",
    label: "큰 체크박스",
    value: "large-checkbox",
  },
};

export const GhostCheckbox: Story = {
  args: {
    type: "checkbox",
    color: "ghost",
    label: "고스트 체크박스",
    value: "ghost-checkbox",
  },
};

export const SuccessCheckbox: Story = {
  args: {
    type: "checkbox",
    color: "success",
    label: "성공 체크박스",
    value: "success-checkbox",
  },
};

export const WarningCheckbox: Story = {
  args: {
    type: "checkbox",
    color: "warning",
    label: "경고 체크박스",
    value: "warning-checkbox",
  },
};

export const ErrorCheckbox: Story = {
  args: {
    type: "checkbox",
    color: "error",
    label: "에러 체크박스",
    value: "error-checkbox",
  },
};

export const DisabledCheckbox: Story = {
  args: {
    type: "checkbox",
    color: "disabled",
    label: "비활성화 체크박스",
    value: "disabled-checkbox",
    disabled: true,
  },
};

// export const RadioGroup: Story = {
//   render: () => (
//     <div className="flex flex-col gap-2">
//       <CheckBox
//         type="radio"
//         name="radio-group"
//         label="라디오 1"
//         value="radio1"
//       />
//       <CheckBox
//         type="radio"
//         name="radio-group"
//         label="라디오 2"
//         value="radio2"
//       />
//       <CheckBox
//         type="radio"
//         name="radio-group"
//         label="라디오 3"
//         value="radio3"
//       />
//     </div>
//   ),
// };

// export const CheckboxGroup: Story = {
//   render: () => (
//     <div className="flex flex-col gap-2">
//       <CheckBox
//         type="checkbox"
//         name="checkbox-group"
//         label="체크박스 1"
//         value="checkbox1"
//       />
//       <CheckBox
//         type="checkbox"
//         name="checkbox-group"
//         label="체크박스 2"
//         value="checkbox2"
//       />
//       <CheckBox
//         type="checkbox"
//         name="checkbox-group"
//         label="체크박스 3"
//         value="checkbox3"
//       />
//     </div>
//   ),
// };
