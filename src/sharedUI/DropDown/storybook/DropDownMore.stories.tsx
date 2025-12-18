import { Meta, StoryFn } from '@storybook/react';
import { DropDownMore } from '../DropDownMore';

export default {
  title: 'UI/DropDown/DropDownMore',
  component: DropDownMore,
  argTypes: {
    icon: {
      control: 'select',
      options: ['base', 'plus'],
      description: 'Icon type for the dropdown button',
      defaultValue: 'base',
    },
    addClass: {
      control: 'text',
      description: 'Additional classes for styling',
      defaultValue: '',
    },
    children: {
      control: 'text',
      description: 'Content inside the dropdown',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof DropDownMore>;

// Default Template
const Template: StoryFn<typeof DropDownMore> = (args) => (
  <div className="h-[300px]">
    <DropDownMore {...args} />
  </div>
);

// Default Story
export const Default = Template.bind({});
Default.args = {
  icon: 'base',
  children: (
    <ul role="listbox">
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
      >
        Option 1
      </li>
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
      >
        Option 2
      </li>
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
      >
        Option 3
      </li>
    </ul>
  ),
};

// Plus Icon Story
export const PlusIcon = Template.bind({});
PlusIcon.args = {
  icon: 'plus',
  addClass: 'bg-blue-100',
  children: (
    <ul role="listbox">
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-200"
      >
        Item A
      </li>
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-200"
      >
        Item B
      </li>
    </ul>
  ),
};

// Custom Styling Story
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  icon: 'base',
  addClass: 'bg-red-100 border-red-500',
  children: (
    <ul role="listbox">
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-red-200"
      >
        Red Option 1
      </li>
      <li
        role="option"
        tabIndex={0}
        className="px-4 py-2 text-sm cursor-pointer hover:bg-red-200"
      >
        Red Option 2
      </li>
    </ul>
  ),
};
