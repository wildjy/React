'use client';
import { BannerItem } from './BannerItem';
import Image from 'next/image';
import { cn } from "../common/cn";

export type sizeType = 'default' | 'full';
interface BottomADJsonProps {
  datas?: BannerItem[];
  size?: sizeType;
}

export const BottomADJson: React.FC<BottomADJsonProps> = ({
  datas,
  size = 'default',
}) => {

  const isStorybook =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('iframe.html');

  return (
    <div
      className={`
        mt-7 xl:mt-9
        flex items-stretch justify-between
        lg:gap-6 xl:gap-5
      `}
    >
      {datas?.map((items, index) => (
        <div
          key={index}
          className={`
          ${cn(
            `
            w-full lg:w-1/2 h-full
            items-center justify-center text-center grow
            rounded-md md:rounded-lg overflow-hidden
            `,
            size === 'full'
              ? 'sizeFull.. px-0 py-0 min-h-[4.125rem]'
              : 'py-3 sm:py-4 px-3 md:px-6 xl:px-0',
            index === 1 ? 'hidden lg:flex' : 'flex'
          )}

          `}
          style={{
            backgroundColor:
              index % 2 === 0
                ? items?.badge.backgroundcolor ?? '#E0E6EF'
                : items?.badge.backgroundcolor ?? '#E7F5E7',
          }}
        >
          <a
            href={items?.badge.clickUrl}
            target={
              items?.badge.openInExternalBrowser === '1' ? '_blank' : '_self'
            }
            rel="noopener noreferrer"
            className="h-full"
          >
            <div className="h-full">
              <Image
                src={items?.badge.imgurl}
                alt={'대학이미지'}
                width={Number(items?.badge.imageWidth || 512)} // 512 저장소 배너 기본값
                height={Number(items?.badge.imageHeight || 64)} // 64 저장소 배너 기본값
                unoptimized={isStorybook}
              />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
