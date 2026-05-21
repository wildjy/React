'use client';

/**
 * [학습용 화면 코드] 페이지를 이루는 작은 프레젠테이션 블록들.
 *   - 모두 "props 받아서 그리기만" 하는 순수 표시용 컴포넌트.
 *   - cascade 패턴 로직과 무관 → 핵심 코드(cascade-dropdown.tsx)에서 빼냈다.
 *   - 데이터가 필요한 컴포넌트(DropdownRow / DataTree)는 import 대신 props 로 받아
 *     core ↔ learning 사이 순환 의존을 피한다.
 */

import { DropDown } from '../../../sharedUI/DropDown/DropDown';
import type { Option, University } from '../cascade-dropdown';
import { ACCENT, Accent, majorTypeBadgeColor } from './tokens';

// 상단 "핵심 학습 포인트" 카드 1장.
export function PointCard({
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

// 단계 번호 뱃지 + 힌트가 붙은 드롭다운 한 줄 (대학/계열/학과 공용).
export function DropdownRow({
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
      <DropDown
        options={options}
        value={value || null}
        onChange={(option) => onChange(option.value)}
        disabled={disabled}
        label="— 선택 —"
      />
      {disabled && (
        <div className="text-xs text-slate-400 mt-1 pl-1">{disabledMessage}</div>
      )}
    </div>
  );
}

// 내부 상태(useState/useRef) 한 줄을 칩 목록으로 시각화.
export function StateRow({
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

// "동작 흐름" 섹션의 단계 카드 1장.
export function FlowStep({
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

// 코드 해부 섹션의 소제목(A/B/C/D).
export function SectionHeading({
  letter,
  title,
  accent,
}: {
  letter: string;
  title: string;
  accent: Accent;
}) {
  const c = ACCENT[accent];
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        className={`w-7 h-7 rounded-md ${c.btnBg} text-white text-sm font-bold flex items-center justify-center`}
      >
        {letter}
      </span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
    </div>
  );
}

// 타입 1개에 대한 한 줄 설명 카드.
export function TypeNote({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-2 text-xs">
      <code className="text-blue-700 font-bold">{name}</code>
      <div className="text-slate-600 mt-1 leading-relaxed">{desc}</div>
    </div>
  );
}

// 핸들러 코드 블록 위의 라벨(D-1/D-2/D-3).
export function HandlerLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
        {num}
      </span>
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    </div>
  );
}

// Mock 데이터(대학 → 학과)를 트리 + 계열 배지로 시각화.
//   데이터는 props 로 받는다 (core 의 MOCK_UNIVERSITIES/ALL_MAJOR_TYPES 를 직접 import 하지 않음).
export function DataTree({
  universities,
  majorTypes,
}: {
  universities: University[];
  majorTypes: Option[];
}) {
  const majorTypeLabel = (code: string) =>
    majorTypes.find((t) => t.value === code)?.label ?? '?';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
          MOCK_UNIVERSITIES
        </code>
        <span>— 가짜 서버 DB (실제론 backend 가 가진 정보)</span>
      </div>
      {universities.map((u) => (
        <div
          key={u.universityId}
          className="border border-slate-200 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 text-sm">
            <span className="text-xs font-mono text-slate-500">
              id={u.universityId}
            </span>
            <span className="font-bold text-slate-900">{u.universityName}</span>
            <span className="ml-auto text-xs text-slate-500">
              학과 {u.majors.length}개
            </span>
          </div>
          <div className="p-2 space-y-1 bg-white">
            {u.majors.map((m) => (
              <div key={m.majorId} className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">└</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-mono ${majorTypeBadgeColor(m.majorTypeCode)}`}
                >
                  {m.majorTypeCode} {majorTypeLabel(m.majorTypeCode)}
                </span>
                <span className="text-slate-700">{m.majorName}</span>
                <span className="text-slate-400 font-mono ml-auto">
                  {m.majorId}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 text-xs text-slate-500 mt-3 mb-1 flex-wrap">
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
          ALL_MAJOR_TYPES
        </code>
        <span>— 전역 코드 테이블 (모든 대학 공통)</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {majorTypes.map((t) => (
          <span
            key={t.value}
            className={`text-xs px-2 py-0.5 rounded font-mono ${majorTypeBadgeColor(t.value)}`}
          >
            {t.value} {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
