'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTong } from './TongContext';
import { cn } from "../common/cn";

interface TongFooterProps {
  children?: React.ReactNode;
}

export const TongFooter: React.FC<TongFooterProps> = ({ children }) => {
  const [isShow, setIsShow] = useState(false);

  const { innerClass, sideNav, isDesktop } = useTong();

  type footerNavItem = {
    label: string;
    href: string;
  };

  type footerInfoItem = {
    label: string;
  };

  type footerCopyItem = {
    label: string;
    href?: string;
  };

  type snsInfoItem = {
    label: string;
    imgSrc: string;
    href?: string;
  };

  type markInfoItem = {
    label: string;
    imgSrc: string;
  };

  const footerNav: footerNavItem[] = [
    { label: '회사소개', href: '' },
    { label: '이용약관', href: '' },
    { label: '개인정보처리방침', href: '' },
  ];

  const footerInfo: footerInfoItem[] = [
    { label: '㈜진학사 사업자등록번호 : 101-81-57765' },
    { label: '통신판매업 신고번호 : 2002-00342호' },
    { label: 'FAX  02-735-8432' },
    { label: '고객센터 1544-7715' },
  ];

  const footerCopy: footerCopyItem[] = [
    { label: 'Copyright(c) JINHAK Corp. All Rights Reserved' },
    { label: 'jinhak@jinhak.com', href: 'mailto:jinhak@jinhak.com' },
    { label: 'FAX  02-735-8432' },
  ];

  const snsInfo: snsInfoItem[] = [
    {
      href: 'http://post.naver.com/jinhak_com',
      imgSrc: 'https://image.jinhak.com/jinhakImages/common/icon_footer_post.png',
      label: '네이버 포스트',
    },
    {
      href: 'https://blog.naver.com/jinhak_com',
      imgSrc: 'https://image.jinhak.com/jinhakImages/common/icon_footer_blog.png',
      label: '네이버 블로그',
    },
    {
      href: 'https://www.youtube.com/channel/UCxGvIRwvQdBDRYKtRULB76A',
      imgSrc: 'https://image.jinhak.com/jinhakImages/common/icon_footer_youtube.png',
      label: '유튜브',
    },
    {
      href: 'https://www.facebook.com/jinhaksa',
      imgSrc: 'https://image.jinhak.com/jinhakImages/common/icon_footer_facebook.png',
      label: '페이스북',
    },
    {
      href: 'https://www.instagram.com/jinhaksa/',
      imgSrc: 'https://image.jinhak.com/jinhakImages/common/icon_footer_instagram.png',
      label: '인스타그램',
    },
  ];

  const markInfo: markInfoItem[] = [
    {
      imgSrc: 'https://image.jinhak.com/renewal2019/common/footer_mark_lg.gif',
      label: 'LG U+',
    },
    {
      imgSrc: 'https://image.jinhak.com/renewal2019/common/footer_mark_award1.gif',
      label: '대한민국 교육기업 대상',
    },
    {
      imgSrc: 'https://image.jinhak.com/renewal2019/common/footer_mark_award2.gif',
      label: '대한민국 교육브랜드 대상',
    },
    {
      imgSrc: 'https://image.jinhak.com/renewal2019/common/footer_mark_isms.gif',
      label: 'ISMS 인증',
    },
  ];

  return (
    <footer className={`${sideNav && !isDesktop ? 'px-[17.375rem]' : ''} border-t border-gray-200 bg-white relative z-[1]`}>
      <div className={`${cn([`${innerClass} py-5 sm:py-7 xl:py-11 3xl:pt-10 3xl:pb-12 flex justify-between flex-wrap`], '')}`}>
        <div>
          <ul className={`flex text-sm`}>
            {footerNav.map((nav, index) => (
              <li
                key={index}
                className={`
                  flex items-center
                  last:after:hidden after:content-[""] after:mx-2 after:w-[1px] after:h-[60%] after:bg-gray-300`}
              >
                <a href="#/">{index === footerNav.length - 1 ? <b className="text-blue-800">{nav.label}</b> : nav.label}</a>
              </li>
            ))}
          </ul>
          <ul className={`mt-2 md:mt-0 flex flex-wrap text-sm 3xl:flex-nowrap`}>
            {footerInfo.map((nav, index) => (
              <li
                key={index}
                className={`
                  flex items-center
                  last:after:hidden after:content-[""] after:mx-2 after:w-[1px] after:h-[60%] after:bg-gray-300`}
              >
                {nav.label}
              </li>
            ))}
          </ul>
          <div className={`flex flex-wrap items-center gap-2 mt-2 3xl:flex-nowrap`}>
            <ul className="flex flex-wrap text-sm 3xl:flex-nowrap">
              {footerCopy.map((copy, index) => (
                <li
                  key={index}
                  className={`
                  ${index === 0 ? 'text-gray-400' : ''}
                  flex items-center
                  last:after:hidden after:content-[""] after:mx-2 after:w-[1px] after:h-[60%] after:bg-gray-300`}
                >
                  {copy.href ? <a href={copy.href || '#/'}>{copy.label}</a> : copy.label}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 md:w-auto">
              {snsInfo.map((sns, index) => (
                <a key={index} href={sns.href} target="_blank" rel="noreferrer" className="size-7">
                  <img src={sns.imgSrc} alt={sns.label} className="w-full" />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* <div className={`${isDesktop ? 'hidden' : 'block'} mt-auto`}> */}
        <div className={`hidden xl:block mt-auto`}>
          <div className="flex items-center gap-3">
            {markInfo.map((mark, index) =>
              index === markInfo.length - 1 ? (
                <div
                  key={index}
                  className={`
                    relative cursor-pointer
                  `}
                >
                  <div
                    className={`
                    ${isShow ? 'block' : 'hidden'}
                    absolute bottom-14 right-0 2xl:left-1/2 2xl:-translate-x-1/2
                    p-2
                    w-[180px]
                    text-xs text-gray-400 bg-white border`}
                  >
                    <p>
                      [진학사 ISMS] <br />
                      인증범위:입시,취업정보 제공
                      <br />
                      유효기간: 20.11.04 ~ 24.11.03
                    </p>
                  </div>
                  <img src={mark.imgSrc} onMouseOver={() => setIsShow(true)} onMouseLeave={() => setIsShow(false)} alt={mark.label} />
                </div>
              ) : (
                <div key={index}>
                  <img src={mark.imgSrc} alt={mark.label} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
