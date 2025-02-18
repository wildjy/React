'use client';
import { FC } from 'react';
import { cn } from "../common/cn";

interface PaginationProps {
  addClass?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ addClass, currentPage, totalPages, onPageChange }) => {
  const size = `min-w-7 h-7 text-sm sm:text-base `;
  const maxPageButtons = 5;

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    // eslint-disable-next-line prefer-const
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 md:mt-8 lg:mt-12">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${cn(size, addClass)} bg-center bg-no-repeat bg-[length:100%_100%]
        ${
          currentPage === 1
            ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_first_off.svg")]'
            : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_first.svg")]'
        }`}
      >
        <span className="sr-only">처음 페이지 버튼</span>
      </button>

      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${cn(size, addClass)} bg-center bg-no-repeat bg-[length:100%_100%]
        ${
          currentPage === 1
            ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_prev_off.svg")]'
            : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_prev.svg")]'
        }`}
      >
        <span className="sr-only">이전 페이지 버튼</span>
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${cn(size, addClass)} ${currentPage === page ? 'text-gray-800 font-bold' : 'text-gray-300 hover:text-gray-800'}`}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${cn(size, addClass)} bg-center bg-no-repeat bg-[length:100%_100%]
        ${
          currentPage === totalPages
            ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_next_off.svg")]'
            : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_next.svg")]'
        }`}
      >
        <span className="sr-only">다음페이지 버튼</span>
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${cn(size, addClass)} bg-center bg-no-repeat bg-[length:100%_100%]
        ${
          currentPage === totalPages
            ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_last_off.svg")]'
            : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_paging_last.svg")]'
        }`}
      >
        <span className="sr-only">마지막페이지 버튼</span>
      </button>
    </div>
  );
};
