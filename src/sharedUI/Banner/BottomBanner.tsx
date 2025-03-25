'use client';
import React, { useState, useEffect } from 'react';

interface BannerProps {
  datas?: string[];
}

export const BottomBanner: React.FC<BannerProps> = ({ datas }) => {
  const [leftBg, setLeftBg] = useState<string>('#E0E6EF');
  const [rightBg, setRightBg] = useState<string>('#E0E6EF');

  useEffect(() => {
    const leftColors = ['#E0E6EF', 'red', 'green', 'purple', 'yellow'];
    const rightColors = ['#E4F3EA', 'brown', 'pink', 'lightblue', 'orange'];
    setLeftBg(leftColors[Math.floor(Math.random() * leftColors.length)]);
    setRightBg(rightColors[Math.floor(Math.random() * rightColors.length)]);
  }, []);

  return (
    <div
      className={`
        mt-8 xl:mt-10
        flex items-stretch justify-between
        h-[3.75rem] sm:h-[5.125rem] md:h-[5.25rem] lg:h-[5.125rem] xl:h-[6rem]
        lg:gap-7 xl:gap-6
      `}
    >
      {datas?.map((items, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: items as string }}
          className={`${
            index === 1 ? 'hidden lg:flex' : 'flex'
          } items-center justify-center w-full h-full py-4 text-center sm:py-5 lg:w-1/2 grow`}
          style={{ backgroundColor: index % 2 === 0 ? leftBg : rightBg }}
        ></div>
      ))}
    </div>
  );
};
