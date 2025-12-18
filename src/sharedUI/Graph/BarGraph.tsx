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

type ScoreType =
  | number
  | {
      score: number;
      label: string;
      gap?: number;
      color?: string;
      lineBreak?: boolean;
    };

interface BarGraphProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof BarGraphVariants> {
  disabled?: boolean;
  children?: React.ReactNode;
  direction?: 'default' | 'right';
  size?: number;
  min?: number;
  max?: number;
  color?: [string, string];
  score?: ScoreType;
  value?: ScoreType;
  addClass?: string;
}

function checkScore(value: ScoreType | undefined) {
  if (typeof value === 'number') {
    return {
      score: value,
    };
  } else if (value && typeof value === 'object') {
    const { score, label, gap, color, lineBreak } = value;
    return { score, label, gap, color, lineBreak };
  }
  return {};
}

export const BarGraph: React.FC<BarGraphProps> = ({
  type,
  direction = 'default',
  size = 20,
  min = 0,
  max = 0,
  value,
  score,
  disabled = false,
  color = ['#A4BEF0', '#dddddd'],
  children,
  addClass,
}) => {
  const [width, setWidth] = useState<string>('0%');
  const [myPos, setMyPos] = useState<string>('0%');
  const height = size / 16 + 'rem';

  // value setting
  const {
    score: valueCheck,
    label: valueLabelCheck,
    gap: valueGap,
    color: valueColor,
  } = checkScore(value);

  // score setting
  const {
    score: scoreCheck,
    label: scoreLabelCheck,
    gap: scoreGap,
    color: scoreColor,
    lineBreak: scoreLineBreak,
  } = checkScore(score);

  useEffect(() => {
    function getLeftPercent(
      score: number,
      min: number,
      max: number,
      direction: 'default' | 'right'
    ) {
      const percent = Math.max(
        0,
        Math.min(100, ((score - min) / (max - min)) * 100)
      );
      return direction === 'right' ? `${100 - percent}%` : `${percent}%`;
    }
    const calcWidth = getLeftPercent(valueCheck ?? 0, min, max, direction);
    const calcMy = getLeftPercent(scoreCheck ?? 0, min, max, 'default');
    setWidth(calcWidth);
    setMyPos(calcMy);
  }, [value, score, min, max, direction, scoreCheck, valueCheck]);

  const className = BarGraphVariants({
    type: type as 'base' | 'type_1' | 'type_2' | undefined,
  });

  const fontSizeClass = `text-3xs sm:text-2xs md:text-sm xl:text-md`;

  // Check if the score label can fit inside the bar
  const textPercent = 36;
  const isInside =
    parseFloat(width.replace(/[^0-9.]/g, '')) > Number(textPercent);
  const result = { isInside };

  return (
    <div
      className={cn(
        className,
        scoreLineBreak
          ? 'mt-[2.5rem] md:mt-[3.2rem] mb-[1.375rem]'
          : 'mt-[2rem] mb-[1.375rem]',
        disabled && '!mt-0',
        addClass
      )}
      data-min={disabled ? undefined : min}
      data-max={disabled ? undefined : max}
      data-value={disabled ? undefined : Number(scoreCheck)}
      style={{
        height: height,
        // fontSize: fontSize,
        backgroundColor: color[1],
      }}
    >
      {/* score */}
      {!disabled && (
        <p
          className={`my.. absolute top-0 bottom-0 w-[0.125rem] z-[2]`}
          style={{
            left: myPos,
            background: scoreColor ?? '#ff0048',
            color: scoreColor ?? '#ff0048',
          }}
        >
          <span
            className={`
            absolute -top-[0.6rem] left-1/2 -translate-x-1/2
            border-t-[0.4375rem] border-l-[0.375rem] border-r-[0.375rem] border-transparent
            `}
            style={{ borderTopColor: scoreColor ?? '#FF0048' }}
          ></span>
          <span
            className={`${cn(
              `${
                scoreLineBreak
                  ? '-top-[2.3rem] md:-top-[3rem]'
                  : '-top-[1.8rem] md:-top-[2rem]'
              }
              absolute left-1/2 -translate-x-1/2 min-w-[4rem] ${fontSizeClass} text-center`,
              'xl:text-base',
              typeof score === 'object' && 'min-w-[10rem]',
              typeof score === 'object' &&
                Number(scoreCheck) <= Number(min) + (scoreGap ?? 5) &&
                'text-left -left-[0.3rem] -translate-x-0',
              typeof score === 'object' &&
                Number(scoreCheck) >= Number(max) - (scoreGap ?? 10) &&
                'text-right left-auto -right-[0.3rem] -translate-x-0',
              Number(score) <= Number(min) + (scoreGap ?? 5) &&
                'text-left -left-[0.3rem] -translate-x-0',
              Number(score) >= Number(max) - (scoreGap ?? 10) &&
                'text-right left-auto -right-[0.3rem] -translate-x-0'
            )}`}
          >
            <span
              className={`${scoreLineBreak ? 'block leading-none' : 'inline'}`}
            >
              {scoreLabelCheck ?? '나'}
            </span>{' '}
            <span className="leading-none score">{scoreCheck}</span>
          </span>
        </p>
      )}
      {/* active bar */}
      <span
        className={`bar..
          ${cn(
            'flex items-center gap-x-1 px-3 justify-end rounded-full relative',
            direction === 'right' && 'absolute right-0 top-0 bottom-0'
          )}
        `}
        data-averege={disabled ? undefined : Number(valueCheck)}
        style={
          disabled
            ? { width: '2.4%', background: color[0] }
            : {
                width,
                background:
                  type === 'type_1'
                    ? '#FEDA62'
                    : type === 'type_2'
                    ? '#84DCCA'
                    : color[0],
              }
        }
      >
        {/* value */}
        {!disabled && (
          <span
            className={`${cn(
              `absolute top-1/2 -translate-y-1/2 right-2 ${fontSizeClass} leading-none`,
              direction === 'right' && 'left-2 right-auto',
              direction === 'right' &&
                // Number(valueCheck) >= max - (valueGap ?? 10) &&
                !result.isInside
                ? 'left-0 text-right'
                : 'right-0'
              // Number(valueCheck) <= min + (valueGap ?? 10) && 'right-0'
            )}`}
            style={{ color: valueColor ?? '#272727' }}
          >
            {direction === 'right' ? (
              !result.isInside ? (
                <span
                  className={`absolute top-1/2 -translate-y-1/2 right-2 min-w-[10rem] `}
                >
                  <span>{Number(valueCheck)}</span> {valueLabelCheck ?? '평균'}
                </span>
              ) : (
                <>
                  <span>{Number(valueCheck)}</span> {valueLabelCheck ?? '평균'}
                </>
              )
            ) : !result.isInside ? (
              <span
                className={`absolute top-1/2 -translate-y-1/2 left-2 min-w-[10rem]`}
              >
                {valueLabelCheck ?? '평균'} <span>{Number(valueCheck)}</span>
              </span>
            ) : (
              <>
                {valueLabelCheck ?? '평균'} <span>{Number(valueCheck)}</span>
              </>
            )}
          </span>
        )}
      </span>

      {/* min, max */}
      <span
        className={`
          ${cn(
            `
            absolute -bottom-[1.5rem] left-0 right-0
            flex justify-between
            ${fontSizeClass}
            text-gray-600
            `
          )}
      `}
      >
        <span>{disabled ? '**.**' : min}</span>
        <span>{disabled ? '**.**' : max}</span>
      </span>
    </div>
  );
};
