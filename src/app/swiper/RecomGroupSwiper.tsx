'use client';
import { useRef, useState, useEffect, Key } from 'react';
import { SwiperGroup } from "../../sharedUI/Swiper/SwiperGroup";
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Slide = {
  id: number;
  url: string;
  label: string;
};

interface RecomGroupSwiperProps {
  items: Slide[];
  isSelect: number[];
  setIsSelect: React.Dispatch<React.SetStateAction<number[]>>;
  isSelectInfo: Slide[];
  setIsSelectInfo: React.Dispatch<React.SetStateAction<Slide[]>>;
}

export const RecomGroupSwiper: React.FC<RecomGroupSwiperProps> = ({ items, isSelect, setIsSelect, isSelectInfo, setIsSelectInfo }) => {
  const [groupSwiper, setGroupSwiper] = useState<Slide[][]>([]);

  // const [isSelect, setIsSelect] = useState<number[]>([]);
  // const [isSelectInfo, setIsSelectInfo] = useState<Slide[] | null>([]);

  useEffect(() => {
    if (isSelect.includes(1)) {
      // setIsSelect(items.map((i) => i.id));
      setIsSelectInfo(items);
    } else {
      const selectInfo = items.filter((item) => isSelect.includes(item.id));
      // setIsSelect([...isSelect]);
      setIsSelectInfo(selectInfo);
    }
  }, [items]);

  const selectEvent = (id: number) => {
    if (id === 1) {
      if (isSelect.length === items.length) {
        setIsSelect([]);
        setIsSelectInfo([]);
      } else {
        setIsSelect(items.map((i) => i.id));
        setIsSelectInfo(items);
      }
      return;
    }

    setIsSelect((prev) => {
      const selectItems = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      const updatedSelectInfo = items.filter((item) => selectItems.includes(item.id));

      setIsSelectInfo(updatedSelectInfo);
      return selectItems;
    });
  };

  const [disableNav, setDisableNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const groupImages = (arr: Slide[], size: number, isMobile: boolean): Slide[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => {
      const group = arr.slice(i * size, i * size + size);

      if (isMobile && arr.length <= 3) {
        return group;
      }
      if (!isMobile && arr.length <= 4) {
        return group;
      }
      while (group.length < size) {
        group.push({
          id: 0,
          url: '',
          label: '',
        }); // empty
      }
      return group;
    });
  };

  useEffect(() => {
    const resizeEvent = () => {
      const win = window.innerWidth;
      setWindowWidth(win);
    };
    resizeEvent();
    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, []);

  useEffect(() => {
    const isMobile = windowWidth < 768;
    const groupSize = isMobile ? 6 : 8;

    setGroupSwiper(groupImages(items, groupSize, isMobile));
    setDisableNav(items.length > groupSize);
  }, [items, windowWidth]);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <SwiperGroup arrow={disableNav} pager freeMode={false} slidesPerView={1}>
        {groupSwiper.map((groupSlide, index) => (
          <SwiperSlide key={index} style={{ width: '100%' }}>
            <div className={`flex flex-wrap gap-3 md:gap-5`}>
              {groupSlide.map((src, idx) => (
                <div
                  key={idx}
                  onClick={src.url === '' ? undefined : () => selectEvent(src.id)}
                  className={`${windowWidth < 768 ? 'w-[calc(100%/3-0.5rem)]' : 'w-[calc(100%/4-0.5rem)] md:w-[calc(100%/4-1rem)]'}
                  ${idx === 0 ? 'py-5 sm:py-7 lg:py-12' : ''}
                  ${isSelect.includes(src.id) ? 'text-blue-800 border-blue-800' : 'border-gray-100'}
                  py-5 sm:py-6 md:py-8 lg:py-10
                  h-[6.25rem] sm:h-[8.75rem] md:h-[10.25rem] lg:h-[13.75rem]
                  flex flex-wrap content-start items-center justify-center text-center border
                  rounded-lg
                  ${
                    src.url === ''
                      ? `
                      bg-[length:4.375rem_3.125rem] lg:bg-[length:7.5rem_5.375rem] content-[""] bg-center bg-no-repeat
                      bg-[url(https://image.jinhak.com/jinhakImages/react/icon/icon_empty_univ.svg)]
                      `
                      : 'cursor-pointer'
                  }`}
                >
                  <img src={src.url} alt={src.label} className={`w-[2.375rem] sm:w-[3.125rem] md:w-[3.5rem] lg:w-[5rem]`} />
                  <p
                    className={`${idx === 0 && 'pt-3 sm:pt-5 md:pt-6'}
                    pt-3 sm:pt-4 md:pt-5 lg:pt-6 w-full
                    text-2xs sm:text-base xl:text-lg
                    leading-[1.2] xl:leading-[1.43]
                    truncate
                    whitespace-pre-line`}
                  >
                    {src.label}
                  </p>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </SwiperGroup>
    </div>
  );
};
