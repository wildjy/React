import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Pagination } from '../Pagination'; // 프로젝트 경로에 맞게 수정

export default {
  title: 'UI/Pagination/Pagination',
  component: Pagination,
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      defaultValue: 1,
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      defaultValue: 10,
    },
  },
  tags: ['autodocs'],
} as Meta<typeof Pagination>;

const Template: StoryFn<typeof Pagination> = (args) => {
  const [currentPage, setCurrentPage] = useState<number>(args.currentPage);

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />
      <p className="text-lg font-bold">현재 페이지: {currentPage}</p>
    </div>
  );
};

// 기본 Pagination
export const Default = Template.bind({});
Default.args = {
  currentPage: 1,
  totalPages: 10,
};

// 페이지가 5개만 있는 경우
export const FewPages = Template.bind({});
FewPages.args = {
  currentPage: 1,
  totalPages: 5,
};

// 첫 번째 페이지에서 시작하는 경우
export const FirstPage = Template.bind({});
FirstPage.args = {
  currentPage: 1,
  totalPages: 20,
};

// 마지막 페이지에서 시작하는 경우
export const LastPage = Template.bind({});
LastPage.args = {
  currentPage: 20,
  totalPages: 20,
};

// 100개 페이지 중 중간 페이지에서 시작
export const MiddlePage = Template.bind({});
MiddlePage.args = {
  currentPage: 50,
  totalPages: 100,
};
