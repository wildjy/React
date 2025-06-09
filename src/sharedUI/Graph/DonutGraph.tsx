'use client';
import { VariantProps } from 'class-variance-authority';
import { useState, useEffect } from 'react';
import { cn } from "../common/cn";
import { cva } from 'class-variance-authority';

interface DonutGraphProps {
  size?: {
    width: number;
    depth: number;
  };
  color?: [string, string];
  min?: number;
  max?: number;
  score?: number;
  addClass?: string;
}

export const DonutGraph: React.FC<DonutGraphProps> = ({
  size = { width: 100, depth: 10 },
  min = 0,
  max = 0,
  color = ['#A4BEF0', '#dddddd'],
  score = 0,
  addClass,
}) => {
  const [percent, setPercent] = useState<number>(0);
  const donutSize = `${size.width / 16}rem`;
  const innerRatio = 100 - size.depth;
  const innerSize = `${innerRatio}%`;

  useEffect(() => {
    const value = Math.max(
      0,
      Math.min(100, ((score - min) / (max - min)) * 100)
    );
    setPercent(value);
  }, [score, min, max]);

  return (
    <div
      className={cn('flex justify-center items-center', '')}
      style={{
        width: donutSize,
        height: donutSize,
        borderRadius: '50%',
        background: `conic-gradient(${color[0]} 0% ${percent}%, ${color[1]} ${percent}% 100%)`,
      }}
    >
      <span
        className={cn(
          'flex justify-center items-center content-center flex-wrap leading-none text-center bg-white',
          addClass
        )}
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50%',
        }}
      >
        <b className="w-full leading-none">{score}</b>
        <span className="leading-none">/{max}</span>
      </span>
    </div>
  );
};
