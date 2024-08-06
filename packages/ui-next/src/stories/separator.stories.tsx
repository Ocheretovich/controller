import { Separator as UISeparator } from "./separator";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Separator> = {
  title: "Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {};

function Separator() {
  return <UISeparator />;
}
