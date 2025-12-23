import type { Meta, StoryFn } from '@storybook/react';
import { Error } from '../Error';

export default {
  title: 'UI/Error/Error',
  component: Error,
  tags: ['autodocs'],
  argTypes: {
    notFound: { control: 'boolean' },
    message: { control: 'object' },
    button: { control: 'object' },
  },
} as Meta<typeof Error>;

const Template: StoryFn<React.ComponentProps<typeof Error>> = (args) => (
  <Error {...args} />
);

/* =========================
 * 기본 에러
 * ========================= */
export const Default = Template.bind({});
Default.args = {
  message: {
    title: '오류가 발생했습니다',
    sub: '잠시 후 다시 시도해 주세요.',
  },
};

/* =========================
 * 404 Not Found
 * ========================= */
export const NotFound = Template.bind({});
NotFound.args = {
  notFound: true,
  message: {
    title: '페이지를 찾을 수 없습니다',
    sub: '요청하신 페이지가 존재하지 않습니다.',
  },
};

/* =========================
 * 버튼 포함
 * ========================= */
export const WithButton = Template.bind({});
WithButton.args = {
  message: {
    title: '문제가 발생했습니다',
    sub: '홈으로 이동해 주세요.',
  },
  button: {
    label: '홈으로 가기',
    href: '/',
    mode: 'primary',
  },
};

/* =========================
 * 외부 링크 버튼
 * ========================= */
export const ExternalLink = Template.bind({});
ExternalLink.args = {
  message: {
    title: '서비스 이용이 제한되었습니다',
    sub: '자세한 내용은 고객센터를 확인해 주세요.',
  },
  button: {
    label: '고객센터',
    href: 'https://example.com',
    blank: true,
    mode: 'tertiary',
  },
};
