'use client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { cn } from "../common/cn";
import { cva, VariantProps } from 'class-variance-authority';
import { DropDown, DropDownOptionType, typeMode } from './DropDown';

const cascadeVariants = cva('flex w-full', {
  variants: {
    direction: {
      row: 'flex-col gap-3 md:flex-row',
      column: 'flex-col gap-4',
    },
  },
  defaultVariants: { direction: 'row' },
});

const levelVariants = cva('flex w-full flex-col gap-1', {
  variants: {
    direction: {
      row: 'md:flex-1 md:min-w-0',
      column: '',
    },
  },
  defaultVariants: { direction: 'row' },
});

export interface CascadeDropDownLevel {
  /** 선택 전 버튼에 보이는 문구 ('대학 선택' 등) */
  label: string;
  /** 이 단계의 옵션. 상위 값에 맞춰 호출 쪽이 채운다 */
  options: DropDownOptionType[];
  /** 드롭다운 위에 붙는 항목명 ('대학' 등). 없으면 그리지 않는다 */
  title?: string;
}

/** 단계별 선택값. null 은 아직 고르지 않음, '' 는 '전체' 같은 정상 선택값이다 */
export type CascadeDropDownValues = (string | null)[];

export interface CascadeDropDownChange {
  /** 바뀐 단계의 순서 (0부터) */
  index: number;
  /** 고른 옵션. 라벨이 필요하면 여기서 꺼낸다 */
  option: DropDownOptionType;
}

interface CascadeDropDownProps extends VariantProps<typeof cascadeVariants> {
  /** 위에서 아래(왼쪽에서 오른쪽) 순서의 단계 목록 */
  levels: CascadeDropDownLevel[];
  /** levels 와 같은 순서의 선택값 */
  values: CascadeDropDownValues;
  /** 바뀐 단계 아래는 모두 null 로 비운 값을 넘긴다 */
  onChange: (
    next: CascadeDropDownValues,
    change: CascadeDropDownChange,
  ) => void;
  size?: 'sm' | 'md' | 'lg';
  type?: typeMode;
  /** 모바일에서 하단 시트로 연다 (DropDown 의 layer) */
  layer?: boolean;
  /** active: 상위를 고를 때까지 하위 잠금 · disabled: 모든 단계 잠금 */
  disabled?: { active?: boolean; disabled?: boolean };
  addClass?: string;
}

/**
 * 상위 선택에 따라 하위 옵션이 바뀌는 연쇄 드롭다운 (drop1 → drop2 → drop3 등).
 *
 * - 어떤 단계를 고르면 그 아래 단계 값을 모두 null 로 비워 onChange 로 넘긴다.
 * - 바로 위 단계가 null 이면 그 단계는 잠긴다.
 * - 옵션은 불러오지 않는다. 호출 쪽이 상위 값을 키로 한 쿼리 등으로 채운다.
 */
export function CascadeDropDown({
  levels,
  values,
  onChange,
  direction,
  size = 'md',
  type = 'base',
  layer = false,
  disabled = { active: false, disabled: false },
  addClass,
}: CascadeDropDownProps) {
  const handleChange = (index: number, option: DropDownOptionType) => {
    const next = levels.map((_, i) => {
      if (i < index) return values[i] ?? null;
      if (i === index) return option.value;
      return null;
    });
    onChange(next, { index, option });
  };

  return (
    <div className={cn(cascadeVariants({ direction }), addClass)}>
      {levels.map((level, index) => (
        <div key={index} className={levelVariants({ direction })}>
          {level.title && (
            <span className="text-xs text-gray-800 font-semi md:text-sm">
              {level.title}
            </span>
          )}
          <DropDown
            label={level.label}
            options={level.options}
            value={values[index] ?? null}
            onChange={(option) => handleChange(index, option)}
            size={size}
            type={type}
            layer={layer}
            disabled={
              !!disabled?.disabled ||
              (!!disabled?.active && index > 0 && values[index - 1] == null)
            }
          />
        </div>
      ))}
    </div>
  );
}
