"use client";
import { HTMLAttributes } from "react";
import { cn } from "../common/cn";

interface DistributionGraphType {
  center?: boolean;
  addClass?: string;
}

export const DistributionGraph: React.FC<DistributionGraphType> = ({ center =  false, addClass }) => {
  const gradeList = [
    {value: 4.3 },
    {value: 15.5 },
    {value: 32.8 },
    {value: 6.9 },
    {value: 4.3 },
    {value: 15.5 },
    {value: 8.7 },
    {value: 6.8 },
    {value: 5.2 },
  ];

  return (
    <div className="w-1/2 flex flex-col justify-center">
      {gradeList.map((item, index) => (
        <div key={index}  className={` ${center ? 'flex justify-center text-center' : ''}`}>
          <div className="ml-[2.8rem] text-white bg-gray-1000 dark:bg-red-400 relative" style={{width: item.value + '%'}}>
            {!center && (
              <span className={`absolute -left-[2.8rem] top-1/2 -translate-y-1/2 text-gray-700`}>{index + 1} 등급</span>
            )}
            {item.value}
            </div>
        </div>
      ))}

      <p className={`${cn('', addClass, {

      })}`}></p>
    </div>
  )
}