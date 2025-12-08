import React, { useState } from 'react';
import { Button } from '../../sharedUI/Button/Button';
import RecommendRangeLayer from './RecommendRangeLayer';
import clsx from 'clsx';

interface RecommendRangeProps {
  rangeValue: {min: number, max: number},
  handleResultValue: (newRange: {min: number, max: number}) => void,
  addClass?: string;
}

export const RecommendRange: React.FC<RecommendRangeProps> = ({
  rangeValue,
  handleResultValue,
  addClass
}) => {
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    popup1: false,
  });

  const openLayer = (key: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const min = 0;
  const max = 9;

  const [range, setRange] = useState({first:  rangeValue });
  const [changeRange, setChangeRange] = useState({ min: 3.5, max: 7.5 })

  const [progress, setProgress] = useState(() => {
    const start = ((range.first.min - min) / (max - min)) * 100;
    const end = ((range.first.max - min) / (max - min)) * 100;
    return { start, end };
  });

  const handleChangeRange = (newRange:{from: number; to: number}) => {
    const start = ((newRange.from - min) / (max - min)) * 100;
    const end = ((newRange.to - min) / (max - min)) * 100;

    const mapped = { min: newRange.from, max: newRange.to };
    setRange({ first: mapped });
    setChangeRange(mapped);
    setProgress({start, end});
    handleResultValue(mapped);

    openLayer('popup1');
  }

  const handleResetRange = () => {
    const resetValue = { min: 3.5, max: 7.5 };
    setRange({first: resetValue});
    setChangeRange(resetValue)
    setProgress({
      start: ((resetValue.min - min) / (max - min)) * 100,
      end: ((resetValue.max - min) / (max - min)) * 100,
    })
  }

  const smBatteryBg = `
    w-[5.625rem] h-[2.625rem] sm:w-[6.375rem] sm:h-12 md:w-[7.0625rem] md:h-[3.25rem]
    bg-[url("https://image.jinhak.com/jinhakImages/react/bg/battery_bg_recom_sm.svg")]
    bg-no-repeat bg-contain bg-center
    relative
  `
  return (
    <div className={`${clsx('mt-3 sm:mt-4 lg:mt-5', addClass)}`}>
      <div className={`
        px-4 py-3
        md:px-10 md:py-4
        flex items-center justify-between
        border border-[#CFDCED] bg-[#F7F9FD]
        rounded-lg
      `}>
        <div className={`${smBatteryBg}`}>
          <div className={`
            absolute
            top-[0.1875rem] bottom-[0.1875rem] left-[0.1875rem] right-[0.4375rem]
            sm:top-1 sm:bottom-1 sm:left-[0.25rem]
            md:right-[0.6rem]
          `}>
            <div
              className={`${'absolute top-0 bottom-0 bg-blue-500 opacity-30'}`}
              style={{
                left: `${progress.start}%`,
                width: `${progress.end - progress.start}%`,
              }}
            />
          </div>
        </div>

        <p className='pl-4 mr-auto text-sm md:pl-5 md:text-base lg:text-lg'>
          <b>추천대학 범위</b>
          <span className='block md:inline'>{changeRange.min}칸 ~ {changeRange.max}칸</span>
        </p>
        <Button mode="tertiary" size="auto" onClick={() => openLayer('popup1')}>설정변경</Button>
      </div>

      <RecommendRangeLayer
        active={isOpen.popup1}
        value={{ from: range.first.min, to: range.first.max }}
        onReset={handleResetRange}
        onChangeRange={handleChangeRange}
        onClosed={() => setIsOpen((prev) => ({ ...prev, popup1: false }))}
      />
    </div>
  )
}