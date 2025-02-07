'use client';
import React, { useState } from 'react';
import { RangeSlider } from "./RangeSlider";
import { DualRangeSlider } from "./DualRangeSlider";

const App = () => {
  const [rangeValue, setRangeValue] = useState(50);

  const [range, setRange] = useState({ min: 20, max: 80 });

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="mb-4 text-xl font-bold">React Input Range</h2>
      <RangeSlider min={0} max={100} step={5} value={rangeValue} onChange={setRangeValue} />
      <p className="mt-4">선택한 값: {rangeValue}</p>

      <div>
        <h2 className="mb-4 text-xl font-bold">React Dual Range Slider</h2>
        <DualRangeSlider
          min={0}
          max={100}
          step={5}
          value={range}
          onChange={(min, max) => setRange({ min, max })}
        />
        <p className="mt-4">선택한 값: {range.min} - {range.max}</p>
      </div>
    </div>
  );
};

export default App;
