import React, { useState } from "react";

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 5,
  value = 50,
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newValue = Number(e.target.value);
    const newValue = Math.round(Number(e.target.value) / step) * step;
    setSliderValue(newValue);
    onChange(newValue);
  };

  // 진행 바 계산
  const progress = ((sliderValue - min) / (max - min)) * 100;

  // 5 단위 눈금 계산
  const ticks = [];
  for (let i = min; i <= max; i += 5) {
    const tickPosition = ((i - min) / (max - min)) * 100;
    ticks.push({ value: i, position: tickPosition });
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* 눈금 표시 (Tick Marks) */}
      <div className="relative w-full mb-2">
        {ticks.map((tick) => (
          <div
            key={tick.value}
            className="absolute h-3 border-l border-gray-400 text-gray-700 text-xs"
            style={{ left: `${tick.position}%`, transform: "translateX(-50%)" }}
          >
            {tick.value}
          </div>
        ))}
      </div>

      {/* 슬라이더 바 */}
      <div className="relative w-full h-2 bg-gray-300 rounded-lg">
        {/* 채워지는 진행 바 */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg"
          style={{ width: `${progress}%` }}
        ></div>

        {/* 실제 슬라이더 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>

      {/* 현재 값 표시 */}
      <div className="mt-2 text-lg font-semibold text-gray-700">{sliderValue}</div>
    </div>
  );
};
