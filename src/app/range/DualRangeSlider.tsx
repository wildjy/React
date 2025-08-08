import { useState, useEffect,  useRef } from "react";

export interface DualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (minValue: number, maxValue: number) => void;
  addClass?: string;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  addClass,
}) => {
  const [minValue, setMinValue] = useState(value.min);
  const [maxValue, setMaxValue] = useState(value.max);
  const [active, setActive] = useState<"min" | "max" | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  // 외부에서 value가 바뀌면 동기화
  useEffect(() => {
    setMinValue(value.min);
    setMaxValue(value.max);
  }, [value.min, value.max]);

  const clampToStep = (n: number) => Math.round(n / step) * step;

  const commitMin = (v: number) => {
    let val = clampToStep(v);
    if (val < min) val = min;
    if (val >= maxValue - step) val = maxValue - step;
    setMinValue(val);
    onChange(val, maxValue);
  };

  const commitMax = (v: number) => {
    let val = clampToStep(v);
    if (val > max) val = max;
    if (val <= minValue + step) val = minValue + step;
    setMaxValue(val);
    onChange(minValue, val);
  };

  const posToValue = (clientX: number) => {
    const track = trackRef.current!;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return min + ratio * (max - min);
  };

  const pickHandle = (v: number): "min" | "max" => {
    if (v <= minValue) return "min";
    if (v >= maxValue) return "max";
    const dMin = Math.abs(v - minValue);
    const dMax = Math.abs(v - maxValue);
    return dMin <= dMax ? "min" : "max";
  };

  const startDrag = (clientX: number) => {
    const v = posToValue(clientX);
    const handle = pickHandle(v);
    setActive(handle);
    if (handle === "min") commitMin(v);
    else commitMax(v);

    const onMove = (e: PointerEvent) => {
      const v2 = posToValue(e.clientX);
      if (handle === "min") commitMin(v2);
      else commitMax(v2);
    };

    const onUp = () => {
      setActive(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onTrackPointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    // 캡처 단계에서 먼저 가로채 트랙 클릭/드래그 지원
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    startDrag(e.clientX);
  };

  const progressStart = ((minValue - min) / (max - min)) * 100;
  const progressEnd = ((maxValue - min) / (max - min)) * 100;

  const rangeInputClass = `
    absolute top-1/2 -translate-y-1/2
    w-full h-8
    bg-transparent
    pointer-events-none appearance-none
  `;

  return (
    <div className={`${addClass}`}>
      <div
        ref={trackRef}
        className={`relative w-full h-8 cursor-pointer`}
        onPointerDownCapture={onTrackPointerDownCapture}
      >
        {/* 바 배경 */}
        <div className={`absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gray-200 pointer-events-none rounded-lg `} />
        {/* 채워진 영역 */}

        <div
          className={`absolute top-1/2 h-2 -translate-y-1/2 bg-blue-500 pointer-events-none rounded-lg`}
          style={{
            left: `${progressStart}%`,
            width: `${progressEnd - progressStart}%`,
          }}
        />

        {/* min 핸들 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => commitMin(Number(e.target.value))}
          onPointerDown={() => setActive("min")}
          onPointerUp={() => setActive(null)}
          className={`${rangeInputClass} ${active === "min" ? "z-[20]" : "z-[10]"}`}
          aria-label="Minimum value"
        />

        {/* max 핸들 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => commitMax(Number(e.target.value))}
          onPointerDown={() => setActive("max")}
          onPointerUp={() => setActive(null)}
          className={`${rangeInputClass} ${active === "max" ? "z-[20]" : "z-[10]"}}`}
          aria-label="Maximum value"
        />
      </div>

      <div className="d">
        {minValue} - {maxValue}
      </div>
    </div>
  );
};
