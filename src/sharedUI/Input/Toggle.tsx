'use client';
import { cva, VariantProps } from 'class-variance-authority';
import { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { cn } from '../common/cn';

// 토글 트랙 (ON/OFF 배경 영역)
const ToggleTrackVariants = cva(
  `flex items-center rounded-full transition-all duration-300`,
  {
    variants: {
      size: {
        sm: `w-8 h-[1.125rem] px-[0.15rem]
          after:content-[""] peer-checked:after:content-[""]`,
        md: `w-10 h-5 md:w-13 md:h-6`,
        lg: `w-14 h-7`,
      },
      color: {
        primary: `bg-gray-200 peer-checked:bg-blue-800`,
        success:  `bg-gray-200 peer-checked:bg-green-500`,
        warning:  `bg-gray-200 peer-checked:bg-yellow-500`,
        danger:   `bg-gray-200 peer-checked:bg-red-500`,
      },
      innerText: {
        show: `
          text-3xs leading-none text-white
          justify-end px-[0.4rem]
          after:content-["OFF"]
          peer-checked:justify-start peer-checked:px-[0.5rem]
          peer-checked:after:content-["ON"]
        `,
        hide: ``,
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
      innerText: 'hide',
    },
  }
);

// 토글 손잡이 (흰 원형 버튼)
const ToggleKnobVariants = cva(
  `absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transform transition-transform duration-300`,
  {
    variants: {
      size: {
        sm: `w-[0.875rem] h-[0.875rem]
          translate-x-[0.15rem]
          peer-checked:translate-x-[1rem]`,
        md: `w-4 h-4 md:w-5 md:h-5
          translate-x-[0.15rem]
          peer-checked:translate-x-[1.32rem]
          md:peer-checked:translate-x-[1.8rem]`,
        lg: `w-[1.375rem] h-[1.375rem]
          translate-x-[0.2rem]
          peer-checked:translate-x-[2.2rem]`,
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type SizeType = 'sm' | 'md' | 'lg';
type ColorType = 'primary' | 'success' | 'warning' | 'danger';
type InnerTextType = 'show' | 'hide';
type LabelPositionType = 'left' | 'right';

interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof ToggleTrackVariants> {
  /** 라벨 텍스트 (LabelToggle 형태) */
  label?: string;
  /** 라벨 위치 */
  labelPosition?: LabelPositionType;
  /** 추가 클래스 */
  addClass?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Toggle: FC<ToggleProps> = ({
  size,
  color,
  innerText,
  label,
  labelPosition = 'right',
  addClass,
  disabled,
  onChange,
  ...props
}) => {
  const trackClass = ToggleTrackVariants({
    size: size as SizeType | undefined,
    color: color as ColorType | undefined,
    innerText: innerText as InnerTextType | undefined,
  });

  const knobClass = ToggleKnobVariants({
    size: size as SizeType | undefined,
  });

  return (
    <label
      className={cn(
        `relative inline-flex items-center gap-2 cursor-pointer
        focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500`,
        { 'flex-row-reverse': labelPosition === 'left' },
        { 'cursor-not-allowed': disabled },
        addClass
      )}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        disabled={!!disabled}
        onChange={onChange}
        role="switch"
        aria-disabled={disabled}
        aria-label={label}
        {...props}
      />

      {/* 트랙 */}
      <div
        className={cn(trackClass, {
          'opacity-50 cursor-not-allowed': disabled,
        })}
      />

      {/* 손잡이 */}
      <div
        className={cn(knobClass, {
          'opacity-50': disabled,
        })}
      />

      {/* 라벨 */}
      {label && (
        <span
          className={cn('text-sm text-gray-900', {
            'text-gray-400': disabled,
          })}
        >
          {label}
        </span>
      )}
    </label>
  );
};
