// src/sharedUI/Input/ModuleInput.stories.ts
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import InputText from "../TextInput";

const meta = {
  title: "SharedUI/InputText",
  component: InputText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: { type: "select" },
      options: ["base", "focus"],
    },
    inputSize: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "full"],
    },
    color: {
      control: { type: "select" },
      options: ["base", "ghost", "success", "warning", "error", "disabled"],
    },
    inputType: {
      control: { type: "select" },
      options: ["input", "radio", "checkbox"],
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    mode: "base",
    inputSize: "md",
    color: "base",
    label: "Base Input",
    inputType: "input",
  },
};

export const Focus: Story = {
  args: {
    mode: "focus",
    inputSize: "md",
    color: "base",
    label: "Focus Input",
    inputType: "input",
  },
};

export const Small: Story = {
  args: {
    inputSize: "sm",
    label: "Small Input",
    inputType: "input",
  },
};

export const Large: Story = {
  args: {
    inputSize: "lg",
    label: "Large Input",
    inputType: "input",
  },
};

export const Ghost: Story = {
  args: {
    color: "ghost",
    label: "Ghost Input",
    inputType: "input",
  },
};

export const Success: Story = {
  args: {
    color: "success",
    label: "Success Input",
    inputType: "input",
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    label: "Warning Input",
    inputType: "input",
  },
};

export const Error: Story = {
  args: {
    color: "error",
    label: "Error Input",
    inputType: "input",
  },
};

// export const WithIcon: Story = {
//   args: {
//     label: "Input with Icon",
//     icon: <span>🔍</span>,
//     inputType: "input",
//   },
// };

export const Checkbox: Story = {
  args: {
    inputType: "checkbox",
    label: "Checkbox Input",
  },
};

export const Radio: Story = {
  args: {
    inputType: "radio",
    label: "Radio Input",
  },
};
