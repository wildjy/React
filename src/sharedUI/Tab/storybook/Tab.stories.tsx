import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Tab from '../Tab';

export default {
  title: 'UI/Tab/Tab',
  component: Tab,
  argTypes: {
    initTab: {
      control: 'number',
      description: 'Initial tab to display.',
      defaultValue: 0,
    },
    modeType: {
      control: 'select',
      options: ['type1', 'type2', 'type3', 'type4'],
      description: 'Style type for the tab component.',
      defaultValue: 'type1',
    },
    addClass: {
      control: 'text',
      description: 'Additional custom classes.',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof Tab>;

const Template: StoryFn<typeof Tab> = (args) => (
  <Tab {...args}>
    <Tab.List>
      <Tab.Button>Tab 1</Tab.Button>
      <Tab.Button>Tab 2</Tab.Button>
      <Tab.Button>Tab 3</Tab.Button>
      <Tab.Button link blank>
        external Link - click
      </Tab.Button>
    </Tab.List>
    <Tab.ContentView>
      <Tab.Contents>
        <div>Content for Tab 1</div>
      </Tab.Contents>
      <Tab.Contents>
        <div>Content for Tab 2</div>
      </Tab.Contents>
      <Tab.Contents>
        <div>Content for Tab 3</div>
      </Tab.Contents>
    </Tab.ContentView>
  </Tab>
);

export const Default = Template.bind({});
Default.args = {
  initTab: 0,
  modeType: 'type1',
};

export const Type1 = Template.bind({});
Type1.args = {
  initTab: 1,
  modeType: 'type1',
};

export const Type2 = Template.bind({});
Type2.args = {
  initTab: 0,
  modeType: 'type2',
};

export const Type3 = Template.bind({});
Type3.args = {
  initTab: 0,
  modeType: 'type3',
};

export const Type4 = Template.bind({});
Type4.args = {
  initTab: 0,
  modeType: 'type4',
};

export const Type5 = Template.bind({});
Type5.args = {
  initTab: 1,
  modeType: 'type5',
};

export const CustomClass = Template.bind({});
CustomClass.args = {
  initTab: 0,
  modeType: 'type2',
  addClass: 'bg-yellow-100',
};

// **외부 링크 포함된 탭**
export const WithExternalLink = Template.bind({});
WithExternalLink.args = {
  modeType: 'type4',
  initTab: 3,
};
