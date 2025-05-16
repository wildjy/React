'use client';
import React, { useState, useEffect } from 'react';
import { BannerItem } from './BannerItem';
import Image from 'next/image';

interface BottomADJsonProps {
  datas?: BannerItem[];
}

export const BottomADJson: React.FC<BottomADJsonProps> = ({ datas }) => {
  const [leftBg, setLeftBg] = useState<string>('#E0E6EF');
  const [rightBg, setRightBg] = useState<string>('#E7F5E7');

  useEffect(() => {
    const leftColors = ['##E0E6EF', 'red', 'green', 'purple', 'yellow'];
    const rightColors = ['##E7F5E7', 'brown', 'pink', 'lightblue', 'orange'];
    // setLeftBg(leftColors[Math.floor(Math.random() * leftColors.length)]);
    // setRightBg(rightColors[Math.floor(Math.random() * rightColors.length)]);
  }, []);

  return (
    <div
      className={`
        mt-7 xl:mt-9
        flex items-stretch justify-between
        h-[3.75rem] sm:h-[5.125rem] md:h-[5.25rem] lg:h-[5.125rem] xl:h-[6rem]
        lg:gap-6 xl:gap-5
      `}
    >
      {datas?.map((items, index) => (
        <div
          key={index}
          className={`${index === 1 ? 'hidden lg:flex' : 'flex'}
          py-3 sm:py-4
          w-full lg:w-1/2 h-full
          items-center justify-center text-center grow
          rounded-md md:rounded-lg overflow-hidden
          px-3 xl:px-0
          `}
          style={{ backgroundColor: index % 2 === 0 ? leftBg : rightBg }}
        >
          <a
            href={items?.badge.clickUrl}
            target={items?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="h-full"
          >
            <div className="h-full">
              <Image src={items?.badge.imgurl} alt={'대학이미지'} width={512} height={64} />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
