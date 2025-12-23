"use client";
import { HTMLAttributes } from "react";
import { cn } from "../common/cn";

interface DistributionGraphType {
  value: {value: number, color?: string}[];
  color?: number;
  center?: boolean;
  addClass?: string;
}

export const DistributionGraph: React.FC<DistributionGraphType> = ({ value, color = 210, center =  false, addClass }) => {
  const sortedValues = [...value].map((item, i) => ({ ...item, originalIndex: i })).sort((a, b) => a.value - b.value);

  const withRank = sortedValues.map((item, i) => ({
    ...item,
    rank: i + 1, // 1부터 9까지
  }));

  /*
    red = 0
    green = 120
    blue = 240
    purple = 280
  */
  const hue = color;
  const getHSLColor = (rank: number, hue: number) => {
    const lightness = 100 - (rank - 1) * 5.5; // 밝기 숫자가 적을수록 밝아짐
    return `hsl(${hue}, 100%, ${lightness}%)`; // hue: 0~360
  };

  const rankedGradeList = Array(value.length);
  withRank.forEach((item) => {
    const color = getHSLColor(item.rank, hue);
    rankedGradeList[item.originalIndex] = {
      value: item.value,
      color,
      rank: item.rank,
    };
  });

  return (
    <div className="w-full lg:w-[18rem] xl:w-[22rem] flex flex-col justify-center">{/* md:w-[14rem] */}
      {rankedGradeList.map((item, index) => (
        <div key={index}  className={`
          ${cn('text-2xs sm:text-xs', addClass,
            center ? 'flex justify-center text-center' : ''
          )}
        `}>
          <div
            className={`
              ml-[3rem] h-5 sm:h-6 md:h-7 px-3 text-right relative border
              ${index === 0 ? 'border-t' : 'border-t-0 '}
            `}
            style={{ width: item.value * 1.5 + '%', backgroundColor: item.color }}
          >
            {!center && (
              <span className={`
                absolute -left-[3rem] top-1/2 -translate-y-1/2
                text-gray-700
              `}>
                {index + 1} 등급
              </span>
            )}
            <span className={`
              absolute top-1/2 -translate-y-1/2
              ${item.value < 10 ? '-right-9 text-gray-700' : 'right-[0.5rem] text-white'}
            `}>
              <span className="hidden absolute -right-[3rem] top-1/2 -translate-y-1/2 text-xs text-red-700 mr-3">[{item.rank}]</span>
              {item.value}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}