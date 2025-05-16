/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import React, { useState, useEffect } from 'react';
import { BannerItem } from './BannerItem';

interface BottomJsonProps {
  leftTime?: number;
  rightTime?: number;
  controls?: boolean;
  leftBanners: BannerItem[];
  rightBanners: BannerItem[];
}

export const BottomRolling: React.FC<BottomJsonProps> = ({
  leftTime = 7000,
  rightTime = 7000,
  leftBanners,
  rightBanners,
  controls = false,
}) => {
  const [isLeftRolling, setIsLeftRolling] = useState(true);
  const [isRightRolling, setIsRightRolling] = useState(true);
  const [leftBanner, setLeftBanner] = useState<BannerItem>(leftBanners[0]);
  const [rightBanner, setRightBanner] = useState<BannerItem>(rightBanners[0]);

  useEffect(() => {
    if (!leftBanners || leftBanners.length === 0 || !isLeftRolling) return;

    const leftRolling = setInterval(() => {
      let nextLeft = leftBanners[Math.floor(Math.random() * leftBanners.length)];

      setLeftBanner((prevLeft) => {
        while (nextLeft.badge.imgurl === prevLeft.badge.imgurl && leftBanners.length > 1) {
          nextLeft = leftBanners[Math.floor(Math.random() * leftBanners.length)];
        }
        return nextLeft;
      });
    }, leftTime);

    return () => {
      clearInterval(leftRolling);
    };
  }, [leftTime, leftBanners, isLeftRolling, controls]);

  useEffect(() => {
    if (!rightBanners || rightBanners.length === 0 || !isRightRolling) return;

    const rightRolling = setInterval(() => {
      let nextRight = rightBanners[Math.floor(Math.random() * rightBanners.length)];

      setRightBanner((prevRight) => {
        while (nextRight.badge.imgurl === prevRight.badge.imgurl && rightBanners.length > 1) {
          nextRight = rightBanners[Math.floor(Math.random() * rightBanners.length)];
        }
        return nextRight;
      });
    }, rightTime);

    return () => {
      clearInterval(rightRolling);
    };
  }, [rightTime, rightBanners, isRightRolling, controls]);

  return (
    <div
      className={`
        mt-7 xl:mt-9
        hidden xl:flex xl:flex-wrap items-stretch justify-center
        lg:gap-6 xl:gap-5
      `}
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          className={`
          w-full lg:w-[35.25rem] h-full grow lg:grow-0
          items-center justify-center text-center
          rounded-md md:rounded-lg overflow-hidden
        `}
        >
          {index === 0 ? (
            // leftBanner
            <div className="relative">
              <a
                href={leftBanner?.badge.clickUrl}
                target={leftBanner?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="w-full"
              >
                <img src={leftBanner?.badge.imgurl} className="w-full" alt={'대학이미지'} />
              </a>

              {controls && leftBanners.length > 1 && (
                <div className={`absolute bottom-0 right-0 w-full text-right`}>
                  <button type="button" className="text-white bg-black" onClick={() => setIsLeftRolling(!isLeftRolling)}>
                    {isLeftRolling ? '멈춤' : '롤링'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // rightBanner
            <div className="relative">
              <div>
                <a
                  href={rightBanner?.badge.clickUrl}
                  target={rightBanner?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <img src={rightBanner?.badge.imgurl} className="w-full" alt={'대학이미지'} />
                </a>
              </div>

              {controls && rightBanners.length > 1 && (
                <div className={`absolute bottom-0 right-0 w-full text-right`}>
                  <button type="button" className="text-white bg-black" onClick={() => setIsRightRolling(!isRightRolling)}>
                    {isRightRolling ? '멈춤' : '롤링'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
