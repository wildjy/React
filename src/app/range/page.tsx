'use client';
import React, { useState } from 'react';
import { RangeSlider } from "./RangeSlider";
import { DualRangeSlider } from "./DualRangeSlider";

const App = () => {
  const [rangeValue, setRangeValue] = useState(50);
  const [range, setRange] = useState({ min: 20, max: 80 });

  return (
    <div className="w-full flex flex-col items-center flex-wrap">
      <h2 className="mb-4 text-xl font-bold">React Input Range</h2>
      <RangeSlider min={0} max={100} step={5} value={rangeValue} onChange={setRangeValue} />
      <p className="mt-4">선택한 값: {rangeValue}</p>

      <h2 className="mb-4 text-xl font-bold">React Dual Range Slider</h2>
      <div className='w-full xl:w-[80rem]'>
        <DualRangeSlider
          min={0}
          max={100}
          step={5}
          value={range}
          onChange={(min, max) => setRange({ min, max })}
          addClass="w-full"
        />
      </div>
      <div>
        선택: {range.min} ~ {range.max}
      </div>
      <p className="mt-4">선택한 값: {range.min} - {range.max}</p>
    </div>
  );
};

export default App;
