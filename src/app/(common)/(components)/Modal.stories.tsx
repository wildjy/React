import { StoryObj, Meta } from "@storybook/react";
import Modal from "./Modal";

export default {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
};
