import { useState, useEffect,  useRef } from "react";
import { cn } from "../common/cn";
import { cva, VariantProps } from 'class-variance-authority';

const DualRangeSliderVariants = cva(`relative w-full`, {
  variants: {
    type: {
      'default': 'h-4 bg-gray-200 rounded-lg',
      'recom': `
        mt-5 mx-auto
        w-[17.5rem] sm:w-[24.375rem]
        h-[6rem] sm:h-[8.25rem]
        bg-[url("https://image.jinhak.com/jinhakImages/react/bg/battery_bg_recom_lg.svg")]
        bg-no-repeat bg-contain bg-center
      `,
    },
  },
  defaultVariants: {
    type: 'default',
  }
});

export type rangeType = 'default' | 'recom';

export interface DualRangeSliderProps extends VariantProps<typeof DualRangeSliderVariants> {
  type?: rangeType;
  min: number;
  max: number;
  step: number;
  tick?: boolean;
  input?: { show?: boolean, readonly?: boolean };
  value: { min: number; max: number };
  onChange: (minValue: number, maxValue: number) => void;
  addClass?: string;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  type,
  min = 0,
  max = 100,
  step = 1,
  tick = false,
  input = { show: false, readonly: true},
  value,
  onChange,
  addClass,
}) => {
  const [minValue, setMinValue] = useState<number | string>(0);
  const [maxValue, setMaxValue] = useState<number | string>(0);
  const [active, setActive] = useState<"min" | "max" | null>(null);
  const NumMin = Number(minValue || 0);
  const NumMax = Number(maxValue || 0);

  const className = DualRangeSliderVariants({
    type: type as rangeType | undefined,
  });

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinValue(value.min);
    setMaxValue(value.max);
  }, [value.min, value.max]);

  const clampToStep = (n: number) => Math.round(n / step) * step;

  const commitMin = (v: number) => {
    let val = clampToStep(v);
    if (val < min) val = min;
    if (val >= NumMax - step) val = NumMax - step;
    setMinValue(val);
    onChange(val, NumMax);
  };

  const commitMax = (v: number) => {
    let val = clampToStep(v);
    if (val > max) val = max;
    if (val <= NumMin + step) val = NumMin + step;
    setMaxValue(val);
    onChange(NumMin, val);
  };

  const posToValue = (clientX: number) => {
    const track = trackRef.current!;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return min + ratio * (max - min);
  };

  const pickHandle = (v: number): "min" | "max" => {
    if (v <= NumMin) return "min";
    if (v >= NumMax) return "max";
    const dMin = Math.abs(v - NumMin);
    const dMax = Math.abs(v - NumMax);
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
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    startDrag(e.clientX);
  };

  const progressStart = ((NumMin - min) / (max - min)) * 100;
  const progressEnd = ((NumMax - min) / (max - min)) * 100;

  // tick
  const ticks = [];
  for (let i = min; i <= max; i += 1) {
    const tickPosition = ((i - min) / (max - min)) * 100;
    ticks.push({ value: i, position: tickPosition });
  }

  const rangeInputClass = `
    ${cn(`range-input
      absolute top-1/2 -translate-y-1/2
      w-full h-full
      bg-transparent
      pointer-events-none appearance-none
    `,
    type === 'recom' && 'range-input none'
  )}`;

  const leftRadius = progressStart === 0 ? '0.25rem' : '0px';
  const rightRadius = progressEnd === 100 ? '0.25rem' : '0px';

  const batteryBg = `
    top-2 bottom-2 left-2 right-4
    sm:top-[0.625rem] sm:bottom-[0.625rem] sm:left-[0.625rem] sm:right-5
  `

  return (
    <div className={`w-full`}>
      <div className={`${cn(className, addClass, tick && 'mb-6')}`}>
        <div
          ref={trackRef}
          onPointerDownCapture={onTrackPointerDownCapture}
          className={`${cn('absolute top-0 bottom-0 w-full rounded-lg cursor-pointer',
            type === 'recom' && `w-auto ${batteryBg}`,
          )}
          `}
        >
          <div
            className={`${cn(`
              absolute w-full h-full
            bg-blue-500 opacity-30
              pointer-events-none rounded-full
            `,
            )}

            `}
            style={{
              left: `${progressStart}%`,
              width: `${progressEnd - progressStart}%`,
              borderRadius: `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`,
            }}
          >
            {type === 'recom' && (
              <>
                <div className="absolute left-0 -ml-2 -top-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
                    <path d="M1.34031 0C0.362638 0 -0.204715 1.10648 0.365886 1.90036L9.52558 14.6443C10.0044 15.3105 10.9956 15.3105 11.4744 14.6443L20.6341 1.90037C21.2047 1.10649 20.6374 0 19.6597 0H1.34031Z" fill="#A3C7D7"/>
                  </svg>
                  <span className="sr-only">min value</span>
                </div>
                <div className="absolute right-0 -mr-2 -top-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
                    <path d="M1.34031 0C0.362638 0 -0.204715 1.10648 0.365886 1.90036L9.52558 14.6443C10.0044 15.3105 10.9956 15.3105 11.4744 14.6443L20.6341 1.90037C21.2047 1.10649 20.6374 0 19.6597 0H1.34031Z" fill="#A3C7D7"/>
                  </svg>
                <span className="sr-only">max value</span></div>
              </>
            )}
          </div>

          {/* Tick Marks */}
          {tick && (
            <div className={`
              ${cn('absolute w-full -bottom-1',
                type === 'recom' && '-bottom-3'
              )}
            `}>
              {ticks.map((tick, index) => {
                if(index === 0) return null;
                return (
                  <div
                    key={tick.value}
                    className={`absolute bottom-0 text-xs text-gray-700`}
                    style={{ left: `${tick.position}%`, transform: "translateX(-50%)" }}
                  >
                    <span className="absolute right-0">{tick.value}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* min */}
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

        {/* max */}
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

      {input.show && (
        <div className="flex items-center justify-center mt-9 gap-x-3">
          <div>
            <input
              type="number"
              value={minValue}
              onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setMinValue("");
              } else {
                setMinValue(Number(val));
              }
            }}
              readOnly={input.readonly}
              className={`
                inputNumber
                w-[3.25rem] h-8
                sm:w-[5rem] sm:h-9
                md:w-[5.5rem] md:h-10
                text-center
                border border-gray-200
                rounded
              `}
            /> 칸
          </div>
          <span> ~ </span>
          <div>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setMaxValue("");
                } else {
                  setMaxValue(Number(val));
                }
              }}
              readOnly={input.readonly}
              className={`
                inputNumber
                w-[3.25rem] h-8
                sm:w-[5rem] sm:h-9
                md:w-[5.5rem] md:h-10
                text-center
                border border-gray-200
                rounded
              `}
            /> 칸
          </div>
        </div>
      )}
    </div>
  );
};
