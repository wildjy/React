/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect, HTMLAttributes } from 'react';
import { BannerItem } from './BannerItem';
import { CloseButton } from '../Button/CloseButton';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const SideADBannerVariants = cva(`hidden`, {
  variants: {
    type: {
      base: 'absolute',
      fixed: 'fixed',
    },
    align: {
      left: `right-1/2 mr-[655px]`,
      right: `left-1/2 ml-[655px]`,
    },
  },
  defaultVariants: {
    type: 'base',
    align: 'left',
  },
});

interface SideADBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type'>, VariantProps<typeof SideADBannerVariants> {
  datas: BannerItem[];
  addClass?: string;
}

export const SideADBanner: React.FC<SideADBannerProps> = ({ type, align, datas, addClass }) => {
  const className = SideADBannerVariants({
    type: type as 'base' | 'fixed' | undefined,
    align: align as 'left' | 'right' | undefined,
  });

  const [isClose, setIsClose] = useState(false);

  return (
    <div
      className={`${cn(className, addClass)}
        ${isClose ? 'hidden' : 'xl:block'}
    `}
    >
      <div className="absolute right-0 z-[1]">
        <CloseButton onClick={() => setIsClose(true)} />
      </div>

      {datas?.map((items, index) => (
        <div key={index}>
          <a
            href={items?.badge.clickUrl}
            target={items?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex"
          >
            <img src={items?.badge.imgurl} alt="대학이미지" className="max-w-none" />
          </a>
        </div>
      ))}
    </div>
  );
};
