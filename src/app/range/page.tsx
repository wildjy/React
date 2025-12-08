'use client';
import React, { useState } from 'react';
import { RecommendRange } from "./RecommendRange";
import { RangeSlider } from "./RangeSlider";
import { DualRangeSlider } from "../../sharedUI/Range/DualRangeSlider";
import { from } from '../../../postcss.config.cjs';

const App = () => {

  const [rangeValue, setRangeValue] = useState(50);

  const [range, setRange] = useState({
    first: { min: 3.5, max: 7.5 },
    second: { min: 3.5, max: 7.5 },
  });

  const [resultRange, setResultRange] = useState({
    min: 0, max: 9
  })

  const min = 0;
  const max = 9;

  const [progress, setProgress] = useState(() => {
    const start = ((range.second.min - min) / (max - min)) * 100;
    const end = ((range.second.max - min) / (max - min)) * 100;
    return { start, end };
  });

  const changeRange = () => {
    const start = ((range.second.min - min) / (max - min)) * 100;
    const end = ((range.second.max - min) / (max - min)) * 100;

    setProgress({start: start, end: end})
    setResultRange(range.second)
  }

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    popup1: false,
    popup2: false,
    popup3: false,
  });


  // const openStepLayer = () => {
  //   setIsOpen((prev) => !prev);
  // };

  const openStepLayer = (key: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [saveValue, setSaveValue] = useState({min: 3.5, max: 7.5});


  return (
    <div className="w-full flex flex-col items-center flex-wrap">
      <h2 className="mb-4 text-xl font-bold">React Input Range</h2>
      <RangeSlider min={0} max={100} step={5} value={rangeValue} onChange={setRangeValue} />
      <p className="mt-4">선택한 값: {rangeValue}</p>

      <h2 className="mb-4 text-xl font-bold">React Dual Range Slider</h2>
      <div className='w-full xl:w-[80rem]'>
        <DualRangeSlider
          min={0}
          max={9}
          step={0.5}
          value={{ from: range.first.min, to: range.first.max }}
          onChange={(min, max) => setRange((prev) => ({...prev, first: { min, max }}))}
          addClass="w-full"
        />
      </div>
      <p className="mt-4">선택한 값: {range.first.min} - {range.first.max}</p>

      <div className='w-full xl:w-[80rem]'>
        <div className='w-[18.375rem] md:w-[24.375rem] '>
          <DualRangeSlider
            type='recom'
            min={0}
            max={9}
            step={0.5}
            input={{ show: true, readonly: false }}
            value={{ from: range.second.min, to: range.second.max }}
            onChange={(min, max) => setRange((prev) => ({ ...prev, second: { min, max }}))}
            addClass="w-full"
          />
        </div>
        <button onClick={changeRange}>확인</button>

        <div className='w-[7.0625rem] h-[3.25rem] border border-gray-700 relative'>
          <div
            className={`${'absolute top-0 bottom-0 bg-blue-500'}`}
            style={{
              left: `${progress.start}%`,
              width: `${progress.end - progress.start}%`,
            }}
          >
          </div>
        </div>
        {resultRange.min} ~ {resultRange.max}
      </div>

      <div className='w-full xl:w-[80rem]'>
        <RecommendRange
          rangeValue={saveValue}
          handleResultValue={(range) => {
            console.log("최종 설정된 범위:", range);
            setSaveValue(range)
          }}
        />
        {saveValue.min} ~ {saveValue.max}
      </div>
    </div>
  );
};

export default App;
