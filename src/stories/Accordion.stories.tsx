import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from '../sharedUI/Accordion/Accordion';

// 스토리북 메타 설정
export default {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Accordion>;

// Template 설정
const Template: StoryFn<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <Accordion.Item>
      <Accordion.Top icon="plus" addClass="text-lg font-semibold">
        아코디언 Top 1
      </Accordion.Top>
      <Accordion.Bottom>
        <p>아코디언 Bottom 1의 콘텐츠입니다.</p>
        <p>여기에 원하는 내용을 추가하세요.</p>
      </Accordion.Bottom>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Top icon="arrow" addClass="text-lg font-semibold">
        아코디언 Top 2
      </Accordion.Top>
      <Accordion.Bottom>
        <p>아코디언 Bottom 2의 콘텐츠입니다.</p>
      </Accordion.Bottom>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Top icon="base" addClass="text-lg font-semibold">
        아코디언 Top 3
      </Accordion.Top>
      <Accordion.Bottom>
        <Accordion motion>
          <Accordion.Item>
            <Accordion.Top icon="plus" addClass="text-base">
              중첩 아코디언 Top 1
            </Accordion.Top>
            <Accordion.Bottom addClass="p-2">
              중첩 아코디언 Bottom 1의 콘텐츠입니다.
            </Accordion.Bottom>
          </Accordion.Item>
        </Accordion>
      </Accordion.Bottom>
    </Accordion.Item>
  </Accordion>
);

// Default 스토리
export const Default = Template.bind({});
Default.args = {
  motion: true, // 애니메이션 적용 여부
};
