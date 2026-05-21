'use client';

/**
 * [학습용 화면 코드] 페이지의 큰 단락(섹션)들.
 *   - cascade-dropdown.tsx 의 <CascadeDropdownSample> 이 이 섹션들을 위→아래로 조립한다.
 *   - hook 이 만든 데이터가 필요한 섹션은 props 로 받는다 (로직은 전부 hook 안에 있음).
 */

import type { LogEntry, Option, University } from '../cascade-dropdown';
import { CodeBlock } from './CodeBlock';
import {
  DataTree,
  DropdownRow,
  FlowStep,
  HandlerLabel,
  PointCard,
  SectionHeading,
  StateRow,
  TypeNote,
} from './components';
import {
  HANDLER_MAJOR_CODE,
  HANDLER_TYPE_CODE,
  HANDLER_UNIV_CODE,
  HOOK_SKELETON_CODE,
  MOCK_FETCH_CODE,
  TYPES_CODE,
} from './snippets';
import { logColor, logIcon } from './tokens';

interface Selected {
  universityId: string;
  majorTypeCode: string;
  majorId: string;
}

// ───────────────────────── 헤더 ─────────────────────────
export function LearningHeader() {
  return (
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
        결정하는{' '}
        <span className="text-blue-700 font-semibold">연쇄 의존 드롭다운</span>{' '}
        패턴입니다. 왼쪽에서 직접 선택해 보고, 오른쪽에서 내부 상태와 캐시가
        어떻게 변하는지 실시간으로 확인하세요.
      </p>
    </header>
  );
}

// ───────────────────────── 3가지 학습 포인트 ─────────────────────────
export function KeyPointsSection() {
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <PointCard
        num="01"
        title="IoC (제어의 역전)"
        accent="blue"
        desc="함수를 prop / return 값으로 주입해서 hook 의 동작을 외부에서 결정. fetcher 만 갈아끼우면 대학·고교·지역 등 어디든 같은 hook 재사용."
        code="const onUniversityChange = async (id) => {...}"
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
        code="useRef<Majors[]>([]) // 화면에 직접 안 그림"
      />
    </section>
  );
}

// ───────────────────────── ① 실시간 데모 ─────────────────────────
export function DemoSection({
  selected,
  universityOptions,
  majorTypeOptions,
  majorOptions,
  onUniversityChange,
  onMajorTypeChange,
  onMajorChange,
  loading,
  resetAll,
}: {
  selected: Selected;
  universityOptions: Option[];
  majorTypeOptions: Option[];
  majorOptions: Option[];
  onUniversityChange: (v: string) => void;
  onMajorTypeChange: (v: string) => void;
  onMajorChange: (v: string) => void;
  loading: boolean;
  resetAll: () => void;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">① 실시간 데모</h2>
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
  );
}

// ───────────────────────── ② 내부 상태 + ③ 동작 로그 ─────────────────────────
export function InternalStateSection({
  universityOptions,
  majorTypeOptions,
  majorOptions,
  cachedMajors,
  logs,
}: {
  universityOptions: Option[];
  majorTypeOptions: Option[];
  majorOptions: Option[];
  cachedMajors: University['majors'];
  logs: LogEntry[];
}) {
  return (
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
          items={cachedMajors.map((m) => `${m.majorName} (${m.majorTypeCode})`)}
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
          <span>
            <span className="text-pink-500">●</span> event
          </span>
          <span>
            <span className="text-cyan-500">●</span> fetch
          </span>
          <span>
            <span className="text-amber-500">●</span> cache
          </span>
          <span>
            <span className="text-emerald-500">●</span> state
          </span>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── ④ 코드 해부 ─────────────────────────
export function CodeAnatomySection({
  universities,
  majorTypes,
}: {
  universities: University[];
  majorTypes: Option[];
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          ④ 코드 해부 — 위 데모를 구성하는 모든 코드
        </h2>
        <p className="text-sm text-slate-500">
          위에서 동작을 봤다면, 이제 그 동작이 어떤 코드로 구현됐는지 그대로
          봅니다. 코드 블록에서 회색 줄은 주석, 초록색 줄은 실행 코드입니다.
        </p>
      </div>

      {/* A. 타입 정의 */}
      <div>
        <SectionHeading letter="A" title="타입 정의 — 데이터 모양 계약" accent="blue" />
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
          패턴의 첫 단계는{' '}
          <strong>&quot;데이터가 어떤 모양으로 흐를 것인가&quot;</strong> 를 먼저
          합의하는 것. TypeScript 타입이 곧 그 합의서입니다.
        </p>
        <CodeBlock code={TYPES_CODE} />
        <div className="mt-3 grid md:grid-cols-3 gap-2">
          <TypeNote
            name="Option"
            desc="모든 드롭다운이 공통으로 쓰는 { value, label } 형태. <select> 와 1:1 대응."
          />
          <TypeNote
            name="University"
            desc="가짜 서버 응답 모양 — 대학 1개 + 그 대학이 운영하는 학과 list."
          />
          <TypeNote
            name="FetchMajorTypesByUniv"
            desc="IoC 의 핵심 — fetcher 함수의 시그니처 계약. 이걸 prop 으로 주입하면 hook 재사용 가능."
          />
        </div>
      </div>

      {/* B. Mock 데이터 + 가짜 서버 */}
      <div>
        <SectionHeading letter="B" title="Mock 데이터 + 가짜 서버" accent="purple" />
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
          실무에선 backend DB 가 가진 정보입니다. 학습용으로 메모리에 미리
          넣어두고 setTimeout 으로 네트워크 지연만 흉내냈습니다.
        </p>
        <DataTree universities={universities} majorTypes={majorTypes} />
        <p className="text-sm text-slate-600 mt-4 mb-3 leading-relaxed">
          그리고 그 DB 를 조회하는 가짜 서버 함수 — 실무에선 이 자리에 ky/axios
          호출이 들어갑니다:
        </p>
        <CodeBlock code={MOCK_FETCH_CODE} />
      </div>

      {/* C. Cascade Hook 구조 */}
      <div>
        <SectionHeading letter="C" title="Cascade Hook — 전체 구조" accent="emerald" />
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
          이 hook 이 패턴의 핵심. 컴포넌트는 얇게 두고 모든 로직을 여기로 모읍니다.
          핸들러 본문은 D 섹션에서 따로 봅니다.
        </p>
        <CodeBlock code={HOOK_SKELETON_CODE} />
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900">관찰 포인트:</strong> useState 3개
          (옵션 2개 + 선택값 1개) + useRef 1개 (캐시). useRef 는 화면에 직접
          그리지 않는 데이터로, 다음 계열 변경 때 filter 입력으로만 쓰입니다.
        </div>
      </div>

      {/* D. 핸들러 3종 */}
      <div>
        <SectionHeading
          letter="D"
          title="이벤트 핸들러 3종 — 실제 트리거 함수"
          accent="amber"
        />
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          각 핸들러는{' '}
          <code className="text-xs bg-slate-100 px-1 rounded">
            {'<DropDown onChange>'}
          </code>{' '}
          에 연결됩니다. 위 데모를 조작하면 정확히 이 함수가 실행되고, 동작
          로그(③)에 한 줄씩 찍힙니다.
        </p>

        <div className="mb-5">
          <HandlerLabel
            num="D-1"
            title="대학 변경 → onUniversityChange (가장 무거운 핸들러)"
          />
          <CodeBlock code={HANDLER_UNIV_CODE} />
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <strong className="text-amber-800">
              왜 cascade 리셋이 fetch 보다 먼저인가?
            </strong>{' '}
            사용자가 fetch 응답 대기 중에 다른 대학을 누를 수 있기 때문. 이전
            계열/학과 옵션을 즉시 비워서 잘못된 조합이 화면에 잠시도 안 남게 합니다.
          </div>
        </div>

        <div className="mb-5">
          <HandlerLabel
            num="D-2"
            title="계열 변경 → onMajorTypeChange (서버 호출 없음)"
          />
          <CodeBlock code={HANDLER_TYPE_CODE} />
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <strong className="text-amber-800">캐시의 핵심 가치:</strong> 같은
            대학 안에서 계열을 이리저리 바꿔도 서버를 다시 두드리지 않습니다.
            cachedMajorsRef 에 학과 raw 데이터가 있기 때문에 client 에서 즉시 filter.
          </div>
        </div>

        <div>
          <HandlerLabel num="D-3" title="학과 변경 → onMajorChange (cascade 끝)" />
          <CodeBlock code={HANDLER_MAJOR_CODE} />
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <strong className="text-amber-800">가장 단순한 핸들러:</strong> 더
            이상 하위 cascade 가 없으니 선택값만 저장. 폼 제출은 보통 별도 버튼에서
            selected 객체를 통째로 전송합니다.
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── ⑤ 동작 흐름 ─────────────────────────
export function FlowSection() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        ⑤ 동작 흐름 — 단계별로 무엇이 일어나는가
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        왼쪽 데모를 조작할 때마다 이 순서대로 함수가 실행됩니다. 동작 로그와 비교해
        보세요.
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
  );
}

// ───────────────────────── ⑥ useState vs useRef ─────────────────────────
export function StateVsRefSection() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        ⑥ 왜 useState 와 useRef 를 나눠 썼나?
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        같은 &quot;데이터 보관&quot;이라도 화면에 영향을 주는지에 따라 도구가
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
            <strong>값이 바뀌어도 화면이 바뀌지 않음</strong>. 다음 계열 변경 때
            filter 입력으로만 쓰는 raw 데이터.
          </p>
          <p className="text-xs text-slate-600">
            → useState 로 두면 불필요한 리렌더 1회 추가. useRef 가 더 정확.
          </p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
        <strong className="text-slate-900">판단 기준:</strong> &quot;이 값이
        바뀌었을 때 화면 어딘가가 달라져야 하나?&quot; → Yes 면 useState, No 면
        useRef. 캐시·이전값 기록·외부 객체 참조 등은 보통 useRef.
      </div>
    </section>
  );
}

// ───────────────────────── ⑦ IoC 확장 힌트 ─────────────────────────
export function IocHintSection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-2">
        ⑦ 다음 단계 — 실무에서 IoC 로 확장
      </h2>
      <p className="text-sm text-slate-300 mb-4">
        지금은 hook 안에{' '}
        <code className="bg-slate-700 px-1.5 py-0.5 rounded text-amber-300">
          mockFetchUnivMajors
        </code>{' '}
        가 박혀 있습니다. 실무 코드는 fetcher 를 prop 으로 받아서 hook 을 여러
        도메인(대학·고교·지역)에 재사용할 수 있게 분리합니다.
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
  );
}
