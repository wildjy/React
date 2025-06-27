'use client';
import { VariantProps } from 'class-variance-authority';
import { useState, useEffect, HTMLAttributes } from 'react';
import { cn } from "../common/cn";
import { cva } from 'class-variance-authority';

const BarGraphVariants = cva(`w-full flex rounded-full relative`, {
  variants: {
    type: {
      base: ``,
      type_1: ``,
      type_2: ``,
    },
  },
  defaultVariants: {
    type: 'base',
  },
});

interface BarGraphProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof BarGraphVariants> {
  disabled?: boolean;
  children?: React.ReactNode;
  size?: number;
  min?: number;
  max?: number;
  color?: [string, string];
  average?: number;
  myscore?: number;
  addClass?: string;
}

export const BarGraph: React.FC<BarGraphProps> = ({
  type,
  size = 20,
  min = 0,
  max = 0,
  average = 0,
  myscore = 0,
  disabled = false,
  color = ['#A4BEF0', '#dddddd'],
  children,
  addClass,
}) => {
  const [width, setWidth] = useState<string>('0%');
  const [myPos, setMyPos] = useState<string>('0%');
  const height = size / 16 + 'rem';
  const fontSize = size / 1.7 / 16 + 'rem';

  useEffect(() => {
    function getLeftPercent(score: number, min: number, max: number) {
      const percent = Math.max(
        0,
        Math.min(100, ((score - min) / (max - min)) * 100)
      );
      return `${percent}%`;
    }
    const calcWidth = getLeftPercent(average, min, max);
    const calcMy = getLeftPercent(myscore, min, max);
    setWidth(calcWidth);
    setMyPos(calcMy);
  }, [average, myscore, min, max]);

  const className = BarGraphVariants({
    type: type as 'base' | 'type_1' | 'type_2' | undefined,
  });

  return (
    <div
      className={cn(className, addClass)}
      data-min={disabled ? undefined : min}
      data-max={disabled ? undefined : max}
      data-average={disabled ? undefined : average}
      style={{
        height: height,
        // fontSize: fontSize,
        backgroundColor: color[1],
      }}
    >
      {!disabled && (
        <p
          className={`my.. absolute top-0 bottom-0 w-[0.125rem] bg-[#FF0048] z-[2]
              before:content-[''] before:absolute before:-top-[0.6rem] before:left-1/2 before:-translate-x-1/2
              before:w-0 before:h-0
              before:border-l-[0.375rem] before:border-r-[0.375rem] before:border-t-[0.4375rem]
              before:border-l-transparent before:border-r-transparent before:border-t-[#FF0048]
            `}
          style={{ left: myPos }}
        >
          <b
            className={`${cn(
              'absolute -top-[2rem] left-1/2 -translate-x-1/2 min-w-[4rem] text-sm md:text-md text-center text-[#FF0048] ',
              '',
              {
                'text-left -left-[0.3rem] -translate-x-0':
                  Number(myscore) < Number(min) + 5,
                'text-right left-auto -right-[0.3rem] -translate-x-0':
                  Number(myscore) > Number(max) - 10,
              }
            )}`}
          >
            나 <span className="score">{myscore}</span>
          </b>
        </p>
      )}
      <span
        className={`bar..
          ${cn(
            'flex items-center gap-x-1 px-3 justify-end rounded-full relative',
            ''
          )}
        `}
        data-averege={average}
        style={
          disabled
            ? { width: '2.4%', backgroundColor: color[0] }
            : {
              width,
              backgroundColor:
                type === 'type_1'
                  ? '#FEDA62'
                  : type === 'type_2'
                  ? '#84DCCA'
                  : color[0],
            }
        }
      >
        {!disabled && (
          <span
            className={`${cn('absolute top-1/2 -translate-y-1/2 right-3 ', '', {
              'right-auto left-auto min-w-[2.5rem]': average <= min + 50,
            })}`}
            style={average <= min + 6 ? { right: '-3rem' } : {}}
          >
            평균 <b>{average}</b>
          </span>
        )}
      </span>
      <span className="absolute guideBox -bottom-[1.5rem] left-0 right-0 flex justify-between text-s md:text-md text-[#272727]">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </div>
  );
};

