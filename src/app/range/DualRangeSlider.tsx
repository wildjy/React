import React, { useState } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (minValue: number, maxValue: number) => void;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 5,
  value,
  onChange,
}) => {
  const [minValue, setMinValue] = useState(value.min);
  const [maxValue, setMaxValue] = useState(value.max);

  // ✅ 최소값 핸들러 (정상 작동하도록 수정)
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Math.round(Number(e.target.value) / step) * step;
    if (newValue < min) newValue = min;
    if (newValue >= maxValue - step) newValue = maxValue - step; // 최소값이 최대값을 넘지 않도록 제한
    setMinValue(newValue);
    onChange(newValue, maxValue);
  };

  // ✅ 최대값 핸들러 (정상 작동하도록 수정)
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Math.round(Number(e.target.value) / step) * step;
    if (newValue > max) newValue = max;
    if (newValue <= minValue + step) newValue = minValue + step; // 최대값이 최소값보다 작아지지 않도록 제한
    setMaxValue(newValue);
    onChange(minValue, newValue);
  };

  // ✅ 슬라이더 진행 바 위치 계산
  const progressStart = ((minValue - min) / (max - min)) * 100;
  const progressEnd = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* 눈금 표시 */}
      <div className="relative w-full mb-2">
        {[...Array((max - min) / step + 1)].map((_, index) => {
          const tickValue = min + index * step;
          const tickPosition = ((tickValue - min) / (max - min)) * 100;
          return (
            <div
              key={tickValue}
              className="absolute h-3 border-l border-gray-400 text-gray-700 text-xs"
              style={{ left: `${tickPosition}%`, transform: "translateX(-50%)" }}
            >
              {tickValue}
            </div>
          );
        })}
      </div>

      {/* 슬라이더 바 */}
      <div className="relative w-full h-2 bg-gray-300 rounded-lg">
        {/* 채워지는 진행 바 */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg"
          style={{ left: `${progressStart}%`, width: `${progressEnd - progressStart}%` }}
        ></div>

        {/* 최소값 슬라이더 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* 최대값 슬라이더 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>

      {/* 현재 값 표시 */}
      <div className="mt-2 text-lg font-semibold text-gray-700">
        {minValue} - {maxValue}
      </div>
    </div>
  );
};
