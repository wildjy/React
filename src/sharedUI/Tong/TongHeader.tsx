/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { CloseButton } from '../Button/CloseButton';
import { cn } from "../common/cn";

interface TongHeaderProps {
  children?: React.ReactNode;
}

export const TongHeader: React.FC<TongHeaderProps> = ({ children }) => {
  const { innerClass, sideNav, isDesktop, isMobile, isOpen, setIsOpen } = useTong();

  type utilmenuItem = {
    label: string;
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
  };

  const utilmenu: utilmenuItem[] = [
    { label: 'user ID', href: '#/' },
    { label: '회원가입', href: '#/' },
    { label: '마이페이지', href: '#/' },
    { label: '고객센터', href: '#/' },
    { label: '이용가이드', href: '#/', target: '_blank' },
  ];

  return (
    <header className={`3xl:px-[17.375rem] bg-[#f4f5f9] border-b-[0.125rem] border-[#e5e7e9]`}>
      <div
        className={`${cn(
          [
            `${innerClass}
              py-3 md:py-4
              flex justify-between flex-wrap md:flex-nowrap relative z-[2]`,
          ],
          ''
        )}`}
      >
        <h1 className="flex items-center text-sm md:text-base gap-x-2">
          <img src="https://image.jinhak.com/jinhakImages/tong/logo_jinhak.png" alt="JINHAK" className="w-[4.375rem] md:w-auto" />
          학생관리프로그램
        </h1>

        <div className="">
          <button
            className={`
              inline-block md:hidden
              absolute top-4 right-5
              w-[1.125rem] sm:w-[1.375rem]
              h-[1.125rem] sm:h-[1.375rem]
              align-middle
              bg-center bg-no-repeat bg-[url('https://image.jinhak.com/jinhakImages/icon/ico_mypage.png')]
            `}
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* <svg
              width="100%"
              height="100%"
              viewBox="0 0 20 14"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500"
            >
              <path
                d="M19.1743 14H0.825688C0.366972 14 0 13.6456 0 13.2025C0 12.7595 0.366972 12.4051 0.825688 12.4051H19.1743C19.633 12.4051 20 12.7595 20 13.2025C20 13.6456 19.633 14 19.1743 14ZM19.1743 7.79747H0.825688C0.366972 7.79747 0 7.44304 0 7C0 6.55696 0.366972 6.20253 0.825688 6.20253H19.1743C19.633 6.20253 20 6.55696 20 7C20 7.44304 19.633 7.79747 19.1743 7.79747ZM19.1743 1.59494H0.825688C0.366972 1.59494 0 1.24051 0 0.797468C0 0.35443 0.366972 0 0.825688 0H19.1743C19.633 0 20 0.35443 20 0.797468C20 1.24051 19.633 1.59494 19.1743 1.59494Z"
                fill="currentColor"
              ></path>
            </svg> */}
          </button>

          <div
            className={`
            ${isOpen && isMobile ? 'block' : 'hidden md:block'}
            absolute right-5 2xl:left-1/2 2xl:-translate-x-1/2
            md:relative md:mt-0 md:right-0
            p-2
            text-xs
            bg-white border shadow-lg rounded-md
            md:bg-transparent md:border-0 md:shadow-none

          `}
          >
            <div className="flex justify-end md:hidden">
              <CloseButton onClick={() => setIsOpen(!isOpen)} />
            </div>
            <ul className="md:flex">
              {utilmenu.map((menu, index) => (
                <li
                  key={index}
                  className={`
                  first:mt-0 mt-1
                  flex items-center
                  last:after:hidden after:content-[""] after:mx-3 after:w-[1px] after:h-[50%] after:bg-gray-300`}
                >
                  <a href={menu.href}>{menu.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
