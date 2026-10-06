import { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';
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
          '#### 빠른 시작',
          '```tsx',
          "import { CascadeDropDown, CascadeDropDownValues } from '@/sharedUI/DropDown/CascadeDropDown';",
          '',
          'const [values, setValues] = useState<CascadeDropDownValues>([null, null, null]);',
          'const [univ, part] = values;',
          '',
          '<CascadeDropDown',
          '  disabled={{ active: true }}           // 상위를 고를 때까지 하위 잠금',
          '  levels={[',
          "    { label: '대학 선택', options: univOptions },",
          "    { label: '계열 선택', options: univ ? partOptions[univ] : [] },",
          "    { label: '학과 선택', options: univ && part ? majorOptions[`${univ}-${part}`] : [] },",
          '  ]}',
          '  values={values}',
          '  onChange={(next) => setValues(next)}  // 받은 next 를 그대로 values 로',
          '/>',
          '```',
          '',
          '#### 데이터 구조',
          '| 타입 | 모양 | 설명 |',
          '| --- | --- | --- |',
          '| `CascadeDropDownLevel` | `{ label: string; options: DropDownOptionType[]; title?: string }` | 한 단계. `label` 은 선택 전 버튼 문구이자 값이 옵션에 없을 때 보이는 문구 |',
          "| `DropDownOptionType` | `{ value: string; label: string \\| ReactNode \\| { gun?, univ?, name? }; disabled?: boolean }` | `DropDown` 옵션 그대로. `disabled: true` 인 옵션은 회색이고 고를 수 없다 |",
          "| `CascadeDropDownValues` | `(string \\| null)[]` | `levels` 와 같은 길이·순서. `null` = 안 고름, `''` = \"전체\" 같은 정상 값 |",
          '| `CascadeDropDownChange` | `{ index: number; option: DropDownOptionType }` | `onChange` 두 번째 인자. 어느 단계를 무엇으로 바꿨는지 |',
          '',
          '- 단계 수는 정해져 있지 않다. 2단계든 4단계든 `levels`·`values` 길이만 맞추면 된다.',
          '- `values` 가 `levels` 보다 짧으면 모자란 칸은 `null` 로 본다.',
          '',
          '#### 동작',
          '| 상황 | 결과 |',
          '| --- | --- |',
          '| n 번째 단계 선택 | n 보다 아래 단계 값을 모두 `null` 로 비운 배열을 `onChange(next, { index, option })` 로 넘긴다 |',
          "| 값이 `''` | 고른 값으로 본다 — `''` 를 \"전체\" 옵션 값으로 쓸 수 있다 |",
          '',
          '#### 잠금 (`disabled`) — 기본값 `{ active: false, disabled: false }`',
          '`active` 가 잠금 규칙을 켜고, 켜진 상태에서 `disabled` 가 전체 잠금을 정한다.',
          '',
          '| `active` | `disabled` | 결과 |',
          '| --- | --- | --- |',
          '| `false` (기본값) | 무관 | 아무 단계도 잠그지 않는다 — 상위가 `null` 이어도 하위가 열린다 |',
          '| `true` | `false` | 바로 위 단계 값이 `null` 인 단계만 잠근다 (첫 단계는 항상 열림) |',
          '| `true` | `true` | 모든 단계를 잠근다 |',
          '',
          '#### 배치 (`direction`) — 기본값 `row`',
          '| 값 | 동작 |',
          '| --- | --- |',
          '| `row` (기본값) | `<768` 세로, `≥768` 가로로 같은 폭씩 |',
          '| `column` | 항상 세로 (모달·카드 안) |',
          '',
          '#### 레시피',
          '**선택한 라벨이 필요할 때** — `values` 에는 value 만 있으므로 `change.option` 에서 꺼낸다.',
          '```tsx',
          'onChange={(next, { index, option }) => {',
          '  setValues(next);',
          '  if (index === 2) setMajorName(option.label as string);',
          '}}',
          '```',
          '',
          '**하위 옵션을 서버에서 불러올 때** — 상위 값을 queryKey 에 넣고 `null` 이면 호출하지 않는다.',
          '```tsx',
          'const { data: parts = [] } = useQuery({',
          "  queryKey: ['parts', univ],",
          '  queryFn: () => fetchParts(univ!),',
          '  enabled: univ != null,',
          '});',
          '```',
          '',
          '**상위가 바뀌어도 하위를 "전체"로 두고 싶을 때** — 비워진 `null` 을 `\'\'` 로 바꿔 저장한다 (`WithAllOption` 참고).',
          '```tsx',
          "onChange={(next) => setValues(next.map((v) => v ?? ''))}",
          '```',
          '',
          '**저장된 값으로 복원할 때** — `values` 를 처음부터 채워 주면 된다. 단 하위 `options` 가 아직 없으면 그 칸은 값을 찾지 못해 `label` 이 보이고, 옵션이 도착하면 선택값으로 바뀐다. 상위가 비고 하위만 찬 값(`[null, \'H\', null]`)은 넣지 않는다.',
          '',
          '#### 알아둘 것',
          '- **controlled 컴포넌트다.** 받은 `next` 를 `values` 로 되돌려 줘야 하위가 비워지고 잠금이 갱신된다. 단 `DropDown` 이 내부 state 로 고른 값을 먼저 그리므로, `values` 를 안 바꿔도 클릭한 칸의 글자는 바뀌어 보인다 — 변경을 거부할 땐 이 점을 주의한다.',
          '- **옵션을 불러오지 않는다.** 상위 값이 바뀌면 호출 쪽이 하위 `options` 를 새로 채운다. 상위 값을 queryKey 에 넣은 `useQuery`(`enabled: 상위 !== null`) 를 권장한다 — 대학을 빠르게 바꿔도 늦게 온 이전 응답이 덮어쓰지 않는다.',
          '- `size`·`type`·`layer` 는 모든 단계의 `DropDown` 에 그대로 전달된다.',
          '- `disabled.disabled` 만 `true` 로 주면 **아무 효과가 없다** — `active` 가 `false` 면 잠금 조건 전체가 꺼진다. 전체 잠금도 `{ active: true, disabled: true }` 로 준다.',
          '- 잠금은 `DropDown` 의 `disabled` 를 쓴다 — 회색 배경(`bg-disabled-bg`)과 클릭 차단만 하고 버튼에 HTML `disabled` 속성은 달지 않는다.',
          '- `handleChange` 에 `console.log(index, option)` 이 남아 있어 단계를 고를 때마다 콘솔에 찍힌다.',
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
      control: 'object',
      description:
        '`{ active, disabled }` — `active` 로 잠금 규칙을 켜고, 켜진 상태에서 `disabled: true` 면 모든 단계를 잠근다',
      table: {
        type: { summary: '{ active?: boolean; disabled?: boolean }' },
        defaultValue: { summary: '{ active: false, disabled: false }' },
      },
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
Default.args = {
  direction: 'row',
  size: 'md',
  type: 'base',
  disabled: { active: false, disabled: false },
};
Default.parameters = {
  docs: {
    description: {
      story:
        '기본값은 잠금 규칙이 꺼져 있어 대학을 고르기 전에도 계열·학과가 열린다(빈 목록). Controls 의 `disabled` 를 `{ "active": true }` 로 바꾸면 상위를 고를 때까지 하위가 잠긴다.',
    },
  },
};

/** 잠금 설정별 결과 — DisabledModes 렌더에서 쓴다 */
const DISABLED_MODES = [
  {
    name: '기본값 — 잠금 꺼짐',
    disabled: { active: false, disabled: false },
  },
  {
    name: '상위 선택 전 하위 잠금',
    disabled: { active: true, disabled: false },
  },
  { name: '전체 잠금', disabled: { active: true, disabled: true } },
];

export const DisabledModes: StoryFn<typeof CascadeDropDown> = () => (
  <div className="flex w-full flex-col gap-6">
    {DISABLED_MODES.map((mode) => (
      <DisabledModeRow key={mode.name} {...mode} />
    ))}
  </div>
);
DisabledModes.parameters = {
  docs: {
    description: {
      story: [
        '`disabled` 설정 세 가지를 나란히 놓았다. 모두 아무것도 고르지 않은 상태에서 시작한다.',
        '1. 기본값: 계열·학과도 눌러서 열 수 있다(옵션은 비어 있음).',
        '2. `{ active: true }`: 계열·학과가 회색으로 잠겨 있고, 대학을 고르면 계열이, 계열을 고르면 학과가 열린다.',
        '3. `{ active: true, disabled: true }`: 대학까지 모두 잠긴다 (`{ disabled: true }` 만 줘도 같다).',
      ].join('\n'),
    },
  },
};

interface DisabledModeRowProps {
  name: string;
  disabled: { active: boolean; disabled: boolean };
}

function DisabledModeRow({ name, disabled }: DisabledModeRowProps) {
  const [values, setValues] = useState<CascadeDropDownValues>([
    null,
    null,
    null,
  ]);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semi text-gray-800">
        {name} <code className="text-xs">{JSON.stringify(disabled)}</code>
      </p>
      <CascadeDropDown
        disabled={disabled}
        levels={univMajorLevels(values, false)}
        values={values}
        onChange={setValues}
      />
    </div>
  );
}

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
        disabled={{ active: true }}
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
        '모달·카드 안처럼 좁은 곳. `direction="column"` 에 단계마다 `title` 을 붙이고, `disabled={{ active: true }}` 로 상위를 고를 때까지 하위를 잠근다(score-disclosure 등록 모달과 같은 동작). 화면 폭을 768 아래로 줄이면 `layer` 라 하단 시트로 열린다.',
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
        disabled={{ active: true }}
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
        "3. 잠금 규칙을 켜도(`disabled={{ active: true }}`) 상위가 `''` 인 동안은 고른 값으로 보아 하위가 열린다 — 잠그는 건 `null` 일 때뿐이다.",
      ].join('\n'),
    },
  },
};

/** 서버 호출 흉내. 대학마다 응답 시간이 달라 늦게 온 응답이 생긴다 */
const fakeFetch = <T,>(data: T, ms: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

/** 상위 값이 바뀌면 다시 불러오고, 그 전에 시작한 늦은 응답은 버린다 (useQuery 가 해 주는 일) */
function useChildOptions(key: string | null, source: typeof MAJORS, ms: number) {
  const [state, setState] = useState<{
    key: string | null;
    options: { value: string; label: string }[];
  }>({ key: null, options: [] });

  useEffect(() => {
    if (key == null) return;
    let ignore = false;
    fakeFetch(source[key] ?? [], ms).then((options) => {
      if (!ignore) setState({ key, options });
    });
    return () => {
      ignore = true;
    };
  }, [key, source, ms]);

  // 현재 key 의 응답일 때만 쓴다 — 이전 상위 값의 옵션이 잠깐 보이지 않게
  const loading = key != null && state.key !== key;
  return { options: loading ? [] : state.options, loading };
}

export const AsyncOptions: StoryFn<typeof CascadeDropDown> = () => {
  const [values, setValues] = useState<CascadeDropDownValues>([
    null,
    null,
    null,
  ]);
  const [univ, part] = values;
  const parts = useChildOptions(univ, AI_BD_PARTS, univ === '1164' ? 1500 : 600);
  const majors = useChildOptions(
    univ && part ? `${univ}-${part}` : null,
    MAJORS,
    600,
  );

  return (
    <div className="w-full">
      <CascadeDropDown
        disabled={{ active: true }}
        levels={[
          { label: '대학 선택', options: UNIVERSITIES },
          {
            label: parts.loading ? '불러오는 중…' : '계열 선택',
            options: parts.options,
          },
          {
            label: majors.loading ? '불러오는 중…' : '학과 선택',
            options: majors.options,
          },
        ]}
        values={values}
        onChange={setValues}
      />
      <p className="mt-4 text-xs text-gray-500">
        values: {JSON.stringify(values)}
      </p>
    </div>
  );
};
AsyncOptions.parameters = {
  docs: {
    description: {
      story: [
        '하위 옵션을 서버에서 받아오는 흐름. 실제 화면에선 `useQuery` 로 대신하고, 이 스토리는 그 동작을 `useEffect` 로 흉내 낸다.',
        '1. 대학을 고르면 계열 버튼이 "불러오는 중…" 으로 바뀌고 잠시 뒤 옵션이 채워진다.',
        '2. 한양대(1.5초)를 고르고 곧바로 중앙대(0.6초)로 바꿔도, 늦게 온 한양대 응답이 중앙대 계열을 덮어쓰지 않는다.',
        '3. 로딩 문구는 단계의 `label` 을 바꿔서 보여 준다 — 값이 없는 칸에만 `label` 이 보이므로 따로 처리할 게 없다.',
      ].join('\n'),
    },
  },
};
