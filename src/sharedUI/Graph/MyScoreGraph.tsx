/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import { useState, useEffect, useRef } from 'react';
import { cn } from "../common/cn";

interface MyScoreGraphProps {
  size?: {
    width: number;
    height: number;
  };
  min?: number;
  max?: number;
  score?: number;
  tick?: {
    show?: boolean;
    length?: number;
    label?: boolean;
    addClass?: string;
  };
  label?: {
    show?: boolean;
    label?: string;
    color?: string;
    mark?: string;
    addClass?: string;
  };
  color?: [string, string];
  addClass?: string;
}

export const MyScoreGraph: React.FC<MyScoreGraphProps> = ({
  size = { width: 50, height: 100 },
  min = 0,
  max = 100,
  score = 0,
  tick = { show: false, length: 3, label: false, addClass: '' },
  label = { show: true, label: '상위', color: '#272727', mark: '%' },
  color = ['#A4BEF0', '#dddddd'],
  addClass,
}) => {
  const w = `${size.width / 16}rem`;
  const h = `${size.height / 16}rem`;
  const tickW = useRef<HTMLDivElement>(null);
  const [myPos, setMyPos] = useState<string>('0%');
  const [ticks, setTicks] = useState<number[]>([]);
  const [tickWidth, setTickWidth] = useState<number>(0);
  const halfWidth = `${-((size.width + tickWidth + 10) / 2) / 16}rem`;

  useEffect(() => {
    function getTopPercent(score: number, min: number, max: number) {
      const percent = Math.max(
        0,
        Math.min(100, ((score - min) / (max - min)) * 100)
      );
      return `${percent}%`;
    }

    const calcMy = getTopPercent(score, min, max);
    setMyPos(calcMy);

    const tickLength = tick.show ? tick.length || 3 : 0;
    if (tick.show && tickLength > 1) {
      const tickValues = Array.from({ length: tickLength }, (_, i) =>
        Math.round(min + ((max - min) / (tickLength - 1)) * i)
      );
      setTicks(tickValues);
    } else {
      setTicks([]);
    }
  }, [
    score,
    min,
    max,
    tick?.show,
    tick?.length,
    tick?.label,
]);

  useEffect(() => {
    if (tickW.current) {
      setTickWidth(tickW.current.clientWidth);
    }
  }, [ticks]);

  return (
    <div
      className={`${cn(
        'flex flex-col flex-wrap justify-center text-center',
        addClass
      )}`}
      data-min={min}
      data-max={max}
      data-score={score}
      style={{
        width: w,
      }}
    >
      {label.show && (
        <p
          className={`${cn('mb-1', label.addClass)}`}
          style={{ color: `${label.color ? label.color : color[0]}` }}
        >
          {label.label} {score}
          {label.mark}
        </p>
      )}
      <div
        className="relative flex flex-wrap items-center justify-center w-full"
        style={{
          // fontSize: fontSize,
          height: h,
          backgroundColor: color[1],
        }}
      >
        <p
          style={{
            ...(max === score ? { bottom: 0 } : { top: myPos }),
            backgroundColor: color[0],
          }}
          className={`absolute w-full h-[0.1875rem] shadow-md`}
        >
          <span
            style={{
              borderLeftWidth: '0.625rem',
              borderLeftColor: color[0],
            }}
            className={`absolute top-1/2 -translate-y-1/2 -left-[0.625rem]
            border-[0.3125rem] border-t-transparent border-b-transparent border-r-transparent`}
          >
            <span className="sr-only">내 위치</span>
          </span>
          <span className="sr-only">상위 {score}%</span>
        </p>
        <div
          className={`${cn(
              `
              absolute top-0 bottom-0
              right-1/2 translate-x-1/2
              flex flex-col justify-between
              text-sm md:text-md
              text-left leading-none
              `,
              tick.addClass
            )}
          `}
          ref={tickW}
          style={{ marginRight: halfWidth }}
        >
          {ticks.map((tick, index) => (
            <span key={index}>{tick}%</span>
          ))}
        </div>
      </div>
    </div>
  );
};
