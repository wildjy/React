'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Cascade Dropdown 학습 샘플 (대학 → 계열 → 학과)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 핵심 학습 포인트 3가지:
 *   1) IoC (제어의 역전) — 함수를 prop/return 값으로 주입해서 동작을 외부에서 결정
 *   2) Cascade (연쇄 의존) — 상위 선택값이 하위 옵션을 결정
 *   3) 상태 vs 캐시 — 화면에 그릴 옵션은 useState, 내부 계산용 데이터는 useRef
 */

import { useRef, useState } from 'react';

// ───────────────────────── 1. 타입 정의 ─────────────────────────

interface Option {
  label: string;
  value: string;
}

interface University {
  universityId: string;
  universityName: string;
  majors: { majorId: string; majorName: string; majorTypeCode: string }[];
}

type FetchMajorTypesByUniv = (universityId: string) => Promise<Option[]>;

// ───────────────────────── 2. Mock 데이터 + 가짜 서버 ─────────────────────────

const ALL_MAJOR_TYPES: Option[] = [
  { value: 'H', label: '인문' },
  { value: 'N', label: '자연' },
  { value: 'A', label: '예체능' },
  { value: 'Z', label: '자율' },
];

const MOCK_UNIVERSITIES: University[] = [
  {
    universityId: '1',
    universityName: '서울대',
    majors: [
      { majorId: 'm1', majorName: '국문학과', majorTypeCode: 'H' },
      { majorId: 'm2', majorName: '사학과', majorTypeCode: 'H' },
      { majorId: 'm3', majorName: '물리학과', majorTypeCode: 'N' },
      { majorId: 'm4', majorName: '컴퓨터공학과', majorTypeCode: 'N' },
    ],
  },
  {
    universityId: '2',
    universityName: '연세대',
    majors: [
      { majorId: 'm5', majorName: '영문학과', majorTypeCode: 'H' },
      { majorId: 'm6', majorName: '체육학과', majorTypeCode: 'A' },
      { majorId: 'm7', majorName: '자유전공학부', majorTypeCode: 'Z' },
    ],
  },
  {
    universityId: '3',
    universityName: '고려대',
    majors: [
      { majorId: 'm8', majorName: '경제학과', majorTypeCode: 'H' },
      { majorId: 'm9', majorName: '생명과학과', majorTypeCode: 'N' },
      { majorId: 'm10', majorName: '디자인학과', majorTypeCode: 'A' },
    ],
  },
];

async function mockFetchUnivMajors(
  universityId: string,
): Promise<University['majors']> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const found = MOCK_UNIVERSITIES.find((u) => u.universityId === universityId);
  if (!found) throw new Error(`Univ ${universityId} not found`);
  return found.majors;
}

// ───────────────────────── 3. Cascade Hook ─────────────────────────

type LogType = 'event' | 'fetch' | 'state' | 'cache';
interface LogEntry {
  time: string;
  message: string;
  type: LogType;
}

function useCascadeDropdowns() {
  const universityOptions: Option[] = MOCK_UNIVERSITIES.map((u) => ({
    value: u.universityId,
    label: u.universityName,
  }));
  const [majorTypeOptions, setMajorTypeOptions] = useState<Option[]>([]);
  const [majorOptions, setMajorOptions] = useState<Option[]>([]);

  const [selected, setSelected] = useState({
    universityId: '',
    majorTypeCode: '',
    majorId: '',
  });

  // 캐시 — useState 가 아닌 useRef 인 이유: 이 값이 바뀌어도 화면을 다시 그릴 필요 없음
  const cachedMajorsRef = useRef<University['majors']>([]);

  // ─── 학습용 trace ───
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const addLog = (message: string, type: LogType = 'event') => {
    setLogs((prev) =>
      [
        ...prev,
        {
          time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
          message,
          type,
        },
      ].slice(-15),
    );
  };

  // ─── 대학 변경 시 트리거 ───
  const onUniversityChange = async (universityId: string) => {
    addLog(`onUniversityChange("${universityId || '∅'}") 호출`, 'event');

    setSelected({ universityId, majorTypeCode: '', majorId: '' });
    setMajorOptions([]);
    setMajorTypeOptions([]);
    addLog('하위 cascade 리셋 — 계열/학과 옵션 비움', 'state');

    if (!universityId) {
      cachedMajorsRef.current = [];
      addLog('빈 선택 → 캐시도 비움', 'cache');
      return;
    }

    try {
      setLoading(true);
      addLog('mockFetchUnivMajors() 호출 (300ms 지연)', 'fetch');
      const majors = await mockFetchUnivMajors(universityId);
      cachedMajorsRef.current = majors;
      addLog(`cachedMajorsRef ← 학과 ${majors.length}개 저장`, 'cache');

      const availableTypeCodes = new Set(majors.map((m) => m.majorTypeCode));
      const filteredTypes = ALL_MAJOR_TYPES.filter((t) =>
        availableTypeCodes.has(t.value),
      );
      setMajorTypeOptions(filteredTypes);
      addLog(`majorTypeOptions ← 계열 ${filteredTypes.length}개 (set)`, 'state');
    } catch (e) {
      console.error('fetch 실패', e);
      addLog('fetch 실패', 'fetch');
    } finally {
      setLoading(false);
    }
  };

  // ─── 계열 변경 시 트리거 ───
  const onMajorTypeChange = (majorTypeCode: string) => {
    addLog(
      `onMajorTypeChange("${majorTypeCode || '∅'}") — 서버 호출 X`,
      'event',
    );
    setSelected((prev) => ({ ...prev, majorTypeCode, majorId: '' }));

    if (!majorTypeCode) {
      setMajorOptions([]);
      addLog('majorOptions 비움', 'state');
      return;
    }

    const filteredMajors = cachedMajorsRef.current
      .filter((m) => m.majorTypeCode === majorTypeCode)
      .map((m) => ({ value: m.majorId, label: m.majorName }));

    setMajorOptions(filteredMajors);
    addLog(
      `캐시에서 filter → majorOptions ← 학과 ${filteredMajors.length}개`,
      'state',
    );
  };

  // ─── 학과 변경 시 트리거 ───
  const onMajorChange = (majorId: string) => {
    addLog(`onMajorChange("${majorId || '∅'}") — cascade 끝`, 'event');
    setSelected((prev) => ({ ...prev, majorId }));
  };

  const resetAll = () => {
    setSelected({ universityId: '', majorTypeCode: '', majorId: '' });
    setMajorOptions([]);
    setMajorTypeOptions([]);
    cachedMajorsRef.current = [];
    setLogs([]);
  };

  return {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
    logs,
    loading,
    cachedMajors: cachedMajorsRef.current,
    resetAll,
  };
}

// ───────────────────────── 4. UI 컴포넌트 ─────────────────────────

export function CascadeDropdownSample() {
  const {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
    logs,
    loading,
    cachedMajors,
    resetAll,
  } = useCascadeDropdowns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ───── 헤더 ───── */}
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              React Pattern
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              Custom Hook
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              학습용
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cascade Dropdown 학습 샘플
          </h1>
          <p className="text-slate-600 mt-2 leading-relaxed">
            <strong>대학 → 계열 → 학과</strong> 순서로 상위 선택이 하위 옵션을
            결정하는 <span className="text-blue-700 font-semibold">연쇄 의존
            드롭다운</span> 패턴입니다. 왼쪽에서 직접 선택해 보고, 오른쪽에서
            내부 상태와 캐시가 어떻게 변하는지 실시간으로 확인하세요.
          </p>
        </header>

        {/* ───── 3가지 학습 포인트 ───── */}
        <section className="grid md:grid-cols-3 gap-4">
          <PointCard
            num="01"
            title="IoC (제어의 역전)"
            accent="blue"
            desc="함수를 prop / return 값으로 주입해서 hook 의 동작을 외부에서 결정. fetcher 만 갈아끼우면 대학·고교·지역 등 어디든 같은 hook 재사용."
            code='const onUniversityChange = async (id) => {...}'
          />
          <PointCard
            num="02"
            title="Cascade (연쇄 의존)"
            accent="purple"
            desc="상위 선택값이 하위 옵션을 결정. 상위가 바뀌면 하위 선택값·옵션을 반드시 리셋해야 잘못된 조합이 남지 않음."
            code='setSelected({ ..., majorTypeCode: "", majorId: "" })'
          />
          <PointCard
            num="03"
            title="상태 vs 캐시"
            accent="emerald"
            desc="화면에 그릴 옵션은 useState (리렌더 필요), 내부 계산용 raw 데이터는 useRef (리렌더 불필요). 역할이 다름."
            code='useRef<Majors[]>([]) // 화면에 직접 안 그림'
          />
        </section>

        {/* ───── 메인: 좌측 데모 / 우측 시각화 ───── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* === 좌측: 실시간 데모 === */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                ① 실시간 데모
              </h2>
              <button
                onClick={resetAll}
                className="text-xs px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                전체 리셋
              </button>
            </div>

            <DropdownRow
              step="1"
              label="대학"
              hint="서버 fetch 트리거 (mockFetchUnivMajors)"
              accent="blue"
              value={selected.universityId}
              onChange={onUniversityChange}
              options={universityOptions}
            />
            {loading && (
              <div className="text-xs text-blue-600 mt-1 mb-2 flex items-center gap-1 pl-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                서버에서 학과 list fetch 중... (300ms 지연 흉내)
              </div>
            )}

            <DropdownRow
              step="2"
              label="계열"
              hint="서버 호출 X — 캐시에서 client-side filter"
              accent="purple"
              value={selected.majorTypeCode}
              onChange={onMajorTypeChange}
              options={majorTypeOptions}
              disabledMessage="↑ 먼저 대학을 선택하세요"
            />

            <DropdownRow
              step="3"
              label="학과"
              hint="cascade 끝 — 선택값만 저장"
              accent="emerald"
              value={selected.majorId}
              onChange={onMajorChange}
              options={majorOptions}
              disabledMessage="↑ 먼저 계열을 선택하세요"
            />

            <div className="mt-6 bg-slate-900 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                현재 selected (useState)
              </div>
              <pre className="text-xs text-emerald-300 font-mono">
                {JSON.stringify(selected, null, 2)}
              </pre>
            </div>
          </section>

          {/* === 우측: 내부 상태 시각화 === */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              ② 내부 상태 (실시간)
            </h2>

            <div className="space-y-3">
              <StateRow
                label="universityOptions"
                kind="useState (정적)"
                accent="blue"
                items={universityOptions.map((o) => o.label)}
              />
              <StateRow
                label="majorTypeOptions"
                kind="useState · 대학 fetch 후 set"
                accent="purple"
                items={majorTypeOptions.map((o) => o.label)}
              />
              <StateRow
                label="majorOptions"
                kind="useState · 계열 filter 후 set"
                accent="emerald"
                items={majorOptions.map((o) => o.label)}
              />
              <StateRow
                label="cachedMajorsRef.current"
                kind="useRef · 리렌더 안 일으킴"
                accent="amber"
                items={cachedMajors.map(
                  (m) => `${m.majorName} (${m.majorTypeCode})`,
                )}
                footnote="화면에 안 그려도 다음 계열 변경 시 filter 입력으로 사용됨"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700">
                  ③ 동작 로그 (최근 15건)
                </h3>
                <span className="text-xs text-slate-400">{logs.length}건</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 h-64 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 && (
                  <div className="text-slate-500">
                    ↑ 왼쪽에서 대학을 선택하면 hook 내부 동작이 여기에 찍힙니다.
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-500 shrink-0">{log.time}</span>
                    <span className={logColor(log.type)}>
                      {logIcon(log.type)} {log.message}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-2 text-slate-500">
                <span><span className="text-pink-500">●</span> event</span>
                <span><span className="text-cyan-500">●</span> fetch</span>
                <span><span className="text-amber-500">●</span> cache</span>
                <span><span className="text-emerald-500">●</span> state</span>
              </div>
            </div>
          </section>
        </div>

        {/* ───── 동작 흐름 ───── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            ④ 동작 흐름 — 단계별로 무엇이 일어나는가
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            왼쪽 데모를 조작할 때마다 이 순서대로 함수가 실행됩니다. 동작 로그와
            비교해 보세요.
          </p>
          <div className="space-y-3">
            <FlowStep
              num="1"
              title="대학 변경 → onUniversityChange"
              accent="blue"
              steps={[
                'setSelected({ universityId, majorTypeCode: "", majorId: "" }) — 하위 cascade 리셋',
                'setMajorOptions([]) / setMajorTypeOptions([]) — 옵션 비움',
                'await mockFetchUnivMajors(id) — 가짜 서버 호출 (300ms 지연)',
                'cachedMajorsRef.current = majors — 응답을 캐시에 저장 (리렌더 X)',
                'majors → majorTypeCode set 추출 → ALL_MAJOR_TYPES 와 교집합 → setMajorTypeOptions',
              ]}
            />
            <FlowStep
              num="2"
              title="계열 변경 → onMajorTypeChange"
              accent="purple"
              steps={[
                'setSelected(prev → { ...prev, majorTypeCode, majorId: "" }) — 학과만 리셋',
                '서버 호출 없음 — cachedMajorsRef.current 를 majorTypeCode 로 filter',
                'filter 결과를 { value, label } 로 변환 → setMajorOptions',
              ]}
            />
            <FlowStep
              num="3"
              title="학과 변경 → onMajorChange"
              accent="emerald"
              steps={[
                '하위 cascade 없음 — setSelected(prev → { ...prev, majorId }) 만 실행',
                '이후 폼 제출·서버 전송 등에서 selected 객체를 통째로 사용',
              ]}
            />
          </div>
        </section>

        {/* ───── useState vs useRef 비교 ───── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            ⑤ 왜 useState 와 useRef 를 나눠 썼나?
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            같은 "데이터 보관"이라도 화면에 영향을 주는지에 따라 도구가
            달라집니다.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
              <div className="text-xs font-bold text-emerald-700 mb-2">
                useState · majorTypeOptions / majorOptions
              </div>
              <p className="text-sm text-slate-700 mb-2">
                <strong>값이 바뀌면 화면을 다시 그려야</strong> 함.
                <code className="bg-white px-1 rounded mx-1 text-xs">
                  &lt;select&gt;
                </code>
                안의 옵션 목록이 그것.
              </p>
              <p className="text-xs text-slate-600">
                → setState 가 트리거하는 리렌더가 필수.
              </p>
            </div>
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <div className="text-xs font-bold text-amber-700 mb-2">
                useRef · cachedMajorsRef
              </div>
              <p className="text-sm text-slate-700 mb-2">
                <strong>값이 바뀌어도 화면이 바뀌지 않음</strong>. 다음 계열
                변경 때 filter 입력으로만 쓰는 raw 데이터.
              </p>
              <p className="text-xs text-slate-600">
                → useState 로 두면 불필요한 리렌더 1회 추가. useRef 가 더 정확.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
            <strong className="text-slate-900">판단 기준:</strong> "이 값이
            바뀌었을 때 화면 어딘가가 달라져야 하나?" → Yes 면 useState, No 면
            useRef. 캐시·이전값 기록·외부 객체 참조 등은 보통 useRef.
          </div>
        </section>

        {/* ───── IoC 확장 힌트 ───── */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">
            ⑥ 다음 단계 — 실무에서 IoC 로 확장
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            지금은 hook 안에{' '}
            <code className="bg-slate-700 px-1.5 py-0.5 rounded text-amber-300">
              mockFetchUnivMajors
            </code>{' '}
            가 박혀 있습니다. 실무 코드는 fetcher 를 prop 으로 받아서 hook 을
            여러 도메인(대학·고교·지역)에 재사용할 수 있게 분리합니다.
          </p>
          <pre className="bg-slate-950 p-4 rounded-lg text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`// Before — fetcher 가 hook 안에 박혀 있음 (학습용)
function useCascadeDropdowns() {
  const majors = await mockFetchUnivMajors(id);
  ...
}

// After — fetcher 를 prop 으로 주입 (실무용)
function useCascadeDropdowns(fetcher: FetchMajorTypesByUniv) {
  const majors = await fetcher(id);   // 호출부만 바꿔치기 가능
  ...
}

// 사용처: 대학용·고교용·지역용 fetcher 만 갈아끼우면 같은 hook 재사용`}
          </pre>
        </section>
      </div>
    </div>
  );
}

// ───────────────────────── 5. 보조 컴포넌트 (학습 UI) ─────────────────────────

type Accent = 'blue' | 'purple' | 'emerald' | 'amber';

const ACCENT: Record<
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

function PointCard({
  num,
  title,
  desc,
  code,
  accent,
}: {
  num: string;
  title: string;
  desc: string;
  code: string;
  accent: Accent;
}) {
  const c = ACCENT[accent];
  return (
    <div
      className={`bg-white rounded-xl border ${c.border} p-5 shadow-sm hover:shadow-md transition`}
    >
      <div className={`text-xs font-bold ${c.text} mb-1`}>POINT {num}</div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{desc}</p>
      <code className={`text-xs block ${c.bg} ${c.text} p-2 rounded font-mono`}>
        {code}
      </code>
    </div>
  );
}

function DropdownRow({
  step,
  label,
  hint,
  accent,
  value,
  onChange,
  options,
  disabledMessage,
}: {
  step: string;
  label: string;
  hint: string;
  accent: Accent;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  disabledMessage?: string;
}) {
  const c = ACCENT[accent];
  const disabled = options.length === 0 && !!disabledMessage;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full ${c.btnBg} text-white text-xs font-bold flex items-center justify-center`}
          >
            {step}
          </span>
          {label}
        </label>
        <span className="text-xs text-slate-400">{hint}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${c.ring} disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
      >
        <option value="">— 선택 —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {disabled && (
        <div className="text-xs text-slate-400 mt-1 pl-1">
          {disabledMessage}
        </div>
      )}
    </div>
  );
}

function StateRow({
  label,
  kind,
  accent,
  items,
  footnote,
}: {
  label: string;
  kind: string;
  accent: Accent;
  items: string[];
  footnote?: string;
}) {
  const c = ACCENT[accent];
  return (
    <div className={`border ${c.border} ${c.bg} rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${c.dot}`} />
          <code className={`text-sm font-bold ${c.text}`}>{label}</code>
        </div>
        <span className="text-xs text-slate-500">
          {kind} · {items.length}개
        </span>
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-slate-400 italic">비어 있음</div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
      {footnote && (
        <div className={`text-xs ${c.text} mt-2 italic`}>↑ {footnote}</div>
      )}
    </div>
  );
}

function FlowStep({
  num,
  title,
  accent,
  steps,
}: {
  num: string;
  title: string;
  accent: Accent;
  steps: string[];
}) {
  const c = ACCENT[accent];
  return (
    <div className={`flex gap-4 border ${c.border} ${c.bg} rounded-lg p-4`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full ${c.btnBg} text-white font-bold flex items-center justify-center`}
      >
        {num}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
        <ol className="space-y-1">
          {steps.map((step, i) => (
            <li key={i} className="text-sm text-slate-700 flex gap-2">
              <span className="text-slate-400 shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function logColor(type: LogType) {
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

function logIcon(type: LogType) {
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

export type { FetchMajorTypesByUniv };
