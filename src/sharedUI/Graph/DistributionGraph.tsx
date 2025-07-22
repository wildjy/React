"use client";
import { HTMLAttributes } from "react";
import { cn } from "../common/cn";

interface DistributionGraphType {
  value: {value: number}[],
  center?: boolean;
  addClass?: string;
}

export const DistributionGraph: React.FC<DistributionGraphType> = ({ value, center =  false, addClass }) => {
  const sortedValues = [...value].map((item, i) => ({ ...item, originalIndex: i })).sort((a, b) => a.value - b.value);
  console.log([...value].map((item, i) => ({...item, originalIndex: i})).sort())
  console.log(sortedValues)

  // 2. 등급 매기기 (총 9단계)
  const withRank = sortedValues.map((item, i) => ({
    ...item,
    rank: i + 1, // 1부터 9까지
  }));

  const hue = 5;
  const getHSLColor = (rank: number, hue: number) => {
    const lightness = 100 - (rank - 1) * (70 / 8); // 밝기: 90% → 20%
    return `hsl(${hue}, 100%, ${lightness}%)`; // hue: 0~360
  };

  // 4. rank 정보 원래 순서대로 복원
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
    <div className="w-full md:w-[14rem] lg:w-[18rem] xl:w-[25rem] flex flex-col justify-center">
      {rankedGradeList.map((item, index) => (
        <div key={index}  className={` ${center ? 'flex justify-center text-center' : ''}`}>
          <div
            className={`ml-[3rem] h-7 px-3 text-s text-right relative border ${index === 0 ? 'border-t' : 'border-t-0 '}`}
            style={{width: item.value * 1.5 + '%', backgroundColor: item.color,}}
          >
            {!center && (
              <span className={`absolute -left-[3rem] top-1/2 -translate-y-1/2 text-gray-700`}>{index + 1} 등급</span>
            )}
            <span className={`${item.value < 10 ? '-right-9 text-gray-700' : 'right-[0.5rem] text-white'} absolute top-1/2 -translate-y-1/2 `}>
              {/* <span className="absolute -right-[3rem] top-1/2 -translate-y-1/2 text-xs text-red-700 mr-3">[{item.rank}]</span> */}
              {item.value}%
            </span>
          </div>
        </div>
      ))}

      <p className={`${cn('', addClass, {

      })}`}></p>
    </div>
  )
}