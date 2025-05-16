/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect, HTMLAttributes } from 'react';
import { BannerItem } from './BannerItem';
import { CloseButton } from '../Button/CloseButton';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const SideADRollingVariants = cva(`hidden`, {
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

interface SideADRollingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type'>, VariantProps<typeof SideADRollingVariants> {
  time?: number;
  datas: BannerItem[];
  controls?: boolean;
  addClass?: string;
}

export const SideADRolling: React.FC<SideADRollingProps> = ({ type, align, time = 7000, datas, controls = false, addClass }) => {
  const className = SideADRollingVariants({
    type: type as 'base' | 'fixed' | undefined,
    align: align as 'left' | 'right' | undefined,
  });

  const [isRolling, setIsRolling] = useState(true);
  const [isClose, setIsClose] = useState(false);
  const [sideBanner, setSideBanner] = useState<BannerItem>(datas[0]);

  useEffect(() => {
    if (!datas || datas.length === 0 || !isRolling) return;

    setSideBanner(sideBanner);
    const Rolling = setInterval(() => {
      let sideRolling = datas[Math.floor(Math.random() * datas.length)];

      setSideBanner((prevLeft) => {
        while (sideRolling.badge.imgurl === prevLeft.badge.imgurl && datas.length > 1) {
          sideRolling = datas[Math.floor(Math.random() * datas.length)];
        }
        return sideRolling;
      });
    }, time);
    return () => clearInterval(Rolling);
  }, [time, sideBanner, isRolling, controls]);

  const rightAlign = align === 'right';

  return (
    <div
      className={`${cn(className, addClass)}
        ${isClose ? 'hidden' : 'xl:block'}
    `}
    >
      <div className="absolute right-0 z-[1]">
        <CloseButton onClick={() => setIsClose(true)} />
      </div>

      <div>
        <a
          href={sideBanner?.badge.clickUrl}
          target={sideBanner?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="flex"
        >
          <img src={sideBanner?.badge.imgurl} alt="대학이미지" className="max-w-none" />
        </a>
      </div>

      {controls && datas.length > 1 && (
        <div className={`${rightAlign ? 'text-left' : 'text-right'}`}>
          <button type="button" onClick={() => setIsRolling(!isRolling)}>
            {isRolling ? '멈춤' : '롤링'}
          </button>
        </div>
      )}
    </div>
  );
};
