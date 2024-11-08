import { Meta, StoryObj } from "@storybook/react";
import MockExamPage from "./page";

export default {
  title: "Pages/MockExam",
  component: MockExamPage,
} as Meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
};
