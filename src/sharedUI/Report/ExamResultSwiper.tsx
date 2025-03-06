'use client';
import { SwiperSlider } from '../Swiper/SwiperSlider';

import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ExamResult = {
  year: string;
  children: {
    label: string;
    result: string | React.ReactNode;
    point?: boolean;
  }[];
};

interface ExamResultSwiperProps {
  ExamData?: ExamResult[];
}

export const ExamResultSwiper: React.FC<ExamResultSwiperProps> = ({ ExamData }) => {
  return (
    <SwiperSlider arrow={false}>
      {ExamData?.map((item, index) => (
        <SwiperSlide key={index} className="flex items-center justify-center !w-[85%] md:!w-[52%] lg:!w-1/3 p-5 pt-0 pl-0 last:pl-2">
          <div
            className={`
            block p-5 md:p-6 border border-grayBlue-100 shadow-custom
            rounded-[1.625rem] md:rounded-[1.875rem]
          `}
          >
            <p className={`py-3 sm:py-4 text-sm md:text-base xl:text-lg text-center  bg-[#F1F6FB] rounded-xl md:rounded-2xl`}>
              <b>{item.year}학년도</b>
            </p>
            <ul className={`px-3 md:px-[0.625rem] text-2xs md:text-sm xl:text-base `}>
              {item.children.map((obj, index) => (
                <li key={index} className={`mt-3 md:mt-6 flex justify-between`}>
                  <span className="text-gray-500">{obj.label}</span>
                  <span>
                    <b className={`${obj.point && 'text-blue-800'}`}>{obj.result}</b>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SwiperSlide>
      ))}
    </SwiperSlider>
  );
};
