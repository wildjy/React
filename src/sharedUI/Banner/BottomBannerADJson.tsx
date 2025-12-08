'use client';
import { BannerItem } from './BannerItem';
import Image from 'next/image';

interface BottomBannerADJsonProps {
  datas?: BannerItem[];
}

export const BottomBannerADJson: React.FC<BottomBannerADJsonProps> = ({
  datas,
}) => {
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
            flex
            px-3 md:px-6 xl:px-0
            py-3 sm:py-4
            w-full
            items-center justify-center text-center grow
            rounded-md md:rounded-lg overflow-hidden
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
                width={Number(items?.badge.imageWidth)}
                height={Number(items?.badge.imageHeight)}
              />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
