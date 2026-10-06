import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import {
  CascadeDropDown,
  CascadeDropDownLevel,
  CascadeDropDownValues,
} from '../CascadeDropDown';

// cva 의 variant 키 — argTypes.options 에서 쓴다
const CASCADE_DIRECTIONS = ['row', 'column'] as const;
const CASCADE_SIZES = ['sm', 'md', 'lg'] as const;
const CASCADE_TYPES = [
  'base',
  'shadow',
  'ghost',
  'ghostShadow',
  'check',
] as const;

// 대학 → 계열 → 학과 픽스처. 실제 화면에선 상위 값을 키로 한 쿼리가 채운다
const UNIVERSITIES = [
  { value: '1132', label: '중앙대' },
  { value: '1164', label: '한양대(서울)' },
  { value: '1022', label: '경희대' },
];

const AI_BD_PARTS: Record<string, { value: string; label: string }[]> = {
  '1132': [
    { value: 'H', label: '인문' },
    { value: 'N', label: '자연' },
  ],
  '1164': [
    { value: 'H', label: '인문' },
    { value: 'N', label: '자연' },
    { value: 'A', label: '예체능' },
  ],
  '1022': [{ value: 'N', label: '자연' }],
};

const MAJORS: Record<string, { value: string; label: string }[]> = {
  '1132-H': [
    { value: '11320101', label: '경영학부' },
    { value: '11320102', label: '국어국문학과' },
  ],
  '1132-N': [
    { value: '11320201', label: '소프트웨어학부' },
    { value: '11320202', label: '기계공학부' },
  ],
  '1164-H': [{ value: '11640101', label: '정책학과' }],
  '1164-N': [
    { value: '11640201', label: '컴퓨터소프트웨어학부' },
    { value: '11640202', label: '전기공학전공' },
  ],
  '1164-A': [{ value: '11640301', label: '스포츠산업학과' }],
  '1022-N': [{ value: '10220201', label: '한의예과' }],
};

function univMajorLevels(
  values: CascadeDropDownValues,
  withTitle: boolean,
): CascadeDropDownLevel[] {
  const [univ, part] = values;
  return [
    {
      label: '대학 선택',
      title: withTitle ? '대학' : undefined,
      options: UNIVERSITIES,
    },
    {
      label: '계열 선택',
      title: withTitle ? '계열' : undefined,
      options: univ ? (AI_BD_PARTS[univ] ?? []) : [],
    },
    {
      label: '학과 선택',
      title: withTitle ? '학과' : undefined,
      options: univ && part ? (MAJORS[`${univ}-${part}`] ?? []) : [],
    },
  ];
}

const meta: Meta<typeof CascadeDropDown> = {
  title: 'UI/DropDown/CascadeDropDown',
  component: CascadeDropDown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '상위 선택에 따라 하위 옵션이 바뀌는 연쇄 드롭다운(대학 → 계열 → 학과 등). 단계마다 `DropDown` 을 하나씩 그리고, 단계 사이의 초기화·잠금 규칙만 맡는다.',
          '',
          '#### 동작',
          '| 상황 | 결과 |',
          '| --- | --- |',
          '| n 번째 단계 선택 | n 보다 아래 단계 값을 모두 `null` 로 비운 배열을 `onChange(next, { index, option })` 로 넘긴다 |',
          '| 바로 위 단계 값이 `null` | 그 단계는 `disabled` |',
          "| 값이 `''` | 고른 값으로 본다 — `''` 를 \"전체\" 옵션 값으로 쓸 수 있다 |",
          '',
          '#### 배치 (`direction`) — 기본값 `row`',
          '| 값 | 동작 |',
          '| --- | --- |',
          '| `row` (기본값) | `<768` 세로, `≥768` 가로로 같은 폭씩 |',
          '| `column` | 항상 세로 (모달·카드 안) |',
          '',
          '#### 알아둘 것',
          '- **controlled 컴포넌트다.** 받은 `next` 를 `values` 로 되돌려 줘야 화면에 반영된다.',
          '- **옵션을 불러오지 않는다.** 상위 값이 바뀌면 호출 쪽이 하위 `options` 를 새로 채운다. 상위 값을 queryKey 에 넣은 `useQuery`(`enabled: 상위 !== null`) 를 권장한다 — 대학을 빠르게 바꿔도 늦게 온 이전 응답이 덮어쓰지 않는다.',
          '- `size`·`type`·`layer` 는 모든 단계의 `DropDown` 에 그대로 전달된다.',
          '',
          '#### 적용 페이지',
          '- 수시 학종 평가 신청 대학·계열·학과 선택 — `apps/early/src/modules/admission-evaluation/ui/UnivMajorSelector.tsx`',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    levels: {
      control: false,
      description:
        '단계 목록. 각 단계는 `label`(선택 전 문구) · `options` · `title`(위에 붙는 항목명, 선택)',
    },
    values: {
      control: false,
      description: '`levels` 와 같은 순서의 선택값. `null` 은 아직 안 고름',
    },
    onChange: {
      control: false,
      description: '`(next, { index, option })` — 바뀐 단계 아래를 비운 값',
    },
    direction: {
      control: 'select',
      options: [...CASCADE_DIRECTIONS],
      description: '단계 배치',
      table: { defaultValue: { summary: "'row'" } },
    },
    size: {
      control: 'select',
      options: [...CASCADE_SIZES],
      description: '각 `DropDown` 의 size',
      table: { defaultValue: { summary: "'md'" } },
    },
    type: {
      control: 'select',
      options: [...CASCADE_TYPES],
      description: '각 `DropDown` 의 type',
      table: { defaultValue: { summary: "'base'" } },
    },
    layer: {
      control: 'boolean',
      description: '모바일(<768)에서 하단 시트로 연다',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: '모든 단계를 잠근다',
      table: { defaultValue: { summary: 'false' } },
    },
    addClass: { control: 'text', description: '바깥 래퍼에 더할 클래스' },
  },
};
export default meta;

export const Default: StoryFn<typeof CascadeDropDown> = (args) => {
  const [values, setValues] = useState<CascadeDropDownValues>([
    null,
    null,
    null,
  ]);
  return (
    <div className="w-full">
      <CascadeDropDown
        {...args}
        levels={univMajorLevels(values, false)}
        values={values}
        onChange={setValues}
      />
      <p className="mt-4 text-xs text-gray-500">
        values: {JSON.stringify(values)}
      </p>
    </div>
  );
};
Default.args = { direction: 'row', size: 'md', type: 'base' };

export const ColumnWithTitle: StoryFn<typeof CascadeDropDown> = () => {
  const [values, setValues] = useState<CascadeDropDownValues>([
    null,
    null,
    null,
  ]);
  return (
    <div className="w-full max-w-sm">
      <CascadeDropDown
        direction="column"
        layer
        levels={univMajorLevels(values, true)}
        values={values}
        onChange={setValues}
      />
    </div>
  );
};
ColumnWithTitle.parameters = {
  docs: {
    description: {
      story:
        '모달·카드 안처럼 좁은 곳. `direction="column"` 에 단계마다 `title` 을 붙인다. 화면 폭을 768 아래로 줄이면 `layer` 라 하단 시트로 열린다.',
    },
  },
};

const ENTRANCE_YEARS = [
  { value: '2026', label: '2026학년도' },
  { value: '2025', label: '2025학년도' },
];
const ADMISSION_TYPES = [
  { value: '', label: '전체 전형' },
  { value: '일반전형', label: '일반전형' },
  { value: '특성화고교졸업자전형', label: '특성화고교졸업자전형' },
];
const COLLEGE_MAJORS: Record<string, { value: string; label: string }[]> = {
  '': [
    { value: '', label: '전체 모집단위' },
    { value: '301', label: '간호학과' },
    { value: '302', label: '물리치료과' },
    { value: '303', label: '컴퓨터정보과' },
  ],
  일반전형: [
    { value: '', label: '전체 모집단위' },
    { value: '301', label: '간호학과' },
    { value: '302', label: '물리치료과' },
  ],
  특성화고교졸업자전형: [
    { value: '', label: '전체 모집단위' },
    { value: '303', label: '컴퓨터정보과' },
  ],
};

export const WithAllOption: StoryFn<typeof CascadeDropDown> = () => {
  const [values, setValues] = useState<CascadeDropDownValues>(['2026', '', '']);
  // 상위를 바꾸면 하위가 null 로 비워지는데, 이 화면은 "전체"('') 로 되돌린다
  const handleChange = (next: CascadeDropDownValues) =>
    setValues(next.map((value) => value ?? ''));
  const [, type] = values;
  return (
    <div className="w-full">
      <CascadeDropDown
        type="ghost"
        levels={[
          { label: '학년도 선택', options: ENTRANCE_YEARS },
          { label: '전체 전형', options: ADMISSION_TYPES },
          {
            label: '전체 모집단위',
            options: COLLEGE_MAJORS[type ?? ''] ?? [],
          },
        ]}
        values={values}
        onChange={handleChange}
      />
      <p className="mt-4 text-xs text-gray-500">
        values: {JSON.stringify(values)}
      </p>
    </div>
  );
};
WithAllOption.parameters = {
  docs: {
    description: {
      story: [
        '`\'\'` 를 "전체" 옵션 값으로 쓰는 필터형 화면(전문대 입결 등).',
        '1. 처음엔 2026학년도 · 전체 전형 · 전체 모집단위가 선택돼 있다.',
        '2. 전형을 일반전형으로 바꾸면 모집단위 목록이 줄고 "전체 모집단위" 로 돌아간다.',
        "3. 하위 단계는 상위가 `null` 일 때만 잠기므로 `''` 인 동안에도 열린다.",
      ].join('\n'),
    },
  },
};
