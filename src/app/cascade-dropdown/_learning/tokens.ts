/**
 * [학습용 화면 코드] 시각화 전용 디자인 토큰 + 작은 헬퍼.
 *   - 패턴(cascade) 로직과 무관한 "보여주기" 용 색상/아이콘 매핑만 모음.
 *   - 핵심 코드를 읽을 때 방해되지 않도록 cascade-dropdown.tsx 에서 분리했다.
 */

import type { LogType } from '../cascade-dropdown';

// 4가지 단계(대학/계열/학과/캐시)를 색으로 구분하기 위한 키.
export type Accent = 'blue' | 'purple' | 'emerald' | 'amber';

// 색상 키 → Tailwind 클래스 묶음.
//   Tailwind 는 문자열을 정적으로 스캔하므로, 동적 조합(`bg-${x}`) 대신 이렇게 완성형으로 적어둔다.
export const ACCENT: Record<
  Accent,
  {
    border: string;
    bg: string;
    text: string;
    dot: string;
    ring: string;
    btnBg: string;
  }
> = {
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    ring: 'focus:ring-blue-400',
    btnBg: 'bg-blue-500',
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    ring: 'focus:ring-purple-400',
    btnBg: 'bg-purple-500',
  },
  emerald: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'focus:ring-emerald-400',
    btnBg: 'bg-emerald-500',
  },
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    ring: 'focus:ring-amber-400',
    btnBg: 'bg-amber-500',
  },
};

// 동작 로그 종류별 글자색.
export function logColor(type: LogType) {
  switch (type) {
    case 'fetch':
      return 'text-cyan-300';
    case 'cache':
      return 'text-amber-300';
    case 'state':
      return 'text-emerald-300';
    case 'event':
    default:
      return 'text-pink-300';
  }
}

// 동작 로그 종류별 앞머리 아이콘.
export function logIcon(type: LogType) {
  switch (type) {
    case 'fetch':
      return '↻';
    case 'cache':
      return '◇';
    case 'state':
      return '▸';
    case 'event':
    default:
      return '●';
  }
}

// 계열 코드(H/N/A/Z) → 배지 색. DataTree 에서 학과 계열을 한눈에 구분하려고 사용.
export function majorTypeBadgeColor(code: string) {
  switch (code) {
    case 'H':
      return 'bg-blue-100 text-blue-700';
    case 'N':
      return 'bg-emerald-100 text-emerald-700';
    case 'A':
      return 'bg-pink-100 text-pink-700';
    case 'Z':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
