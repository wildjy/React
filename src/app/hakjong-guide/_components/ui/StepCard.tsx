import { cn } from '@/sharedUI/common/cn'

/* ── Phase 색상 맵 ────────────────────────────── */
const phaseStepBg: Record<number, string> = {
  1: 'bg-sky-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
  4: 'bg-rose-500',
  5: 'bg-fuchsia-500',
  6: 'bg-cyan-500',
  7: 'bg-violet-500',
  8: 'bg-orange-500',
  9: 'bg-teal-500',
  10: 'bg-lime-500',
  11: 'bg-red-500',
  12: 'bg-pink-500',
  13: 'bg-purple-500',
  14: 'bg-indigo-500',
  15: 'bg-slate-500',
  16: 'bg-blue-500',
  17: 'bg-green-500',
  18: 'bg-yellow-500',
  19: 'bg-stone-500',
  20: 'bg-zinc-500',
  21: 'bg-neutral-500',
  22: 'bg-gray-500',
  23: 'bg-sky-600',
  24: 'bg-emerald-600',
  25: 'bg-amber-600',
  26: 'bg-fuchsia-600',
  27: 'bg-violet-600',
  28: 'bg-orange-600',
  29: 'bg-indigo-700',
  30: 'bg-rose-700',
  31: 'bg-teal-700',
  32: 'bg-pink-700',
  33: 'bg-cyan-700',
  34: 'bg-violet-700',
  35: 'bg-emerald-700',
  36: 'bg-orange-700',
  37: 'bg-rose-800',
  38: 'bg-blue-700',
}

const phaseHeaderMap: Record<number, { wrap: string; num: string; text: string; label: string }> = {
  1: { wrap: 'bg-sky-50 border-sky-200',       num: 'bg-sky-500',     text: 'text-sky-800',     label: '페이지 구조 잡기' },
  2: { wrap: 'bg-emerald-50 border-emerald-200', num: 'bg-emerald-500', text: 'text-emerald-800', label: '접근 제어 (가드) 구현' },
  3: { wrap: 'bg-amber-50 border-amber-200',   num: 'bg-amber-500',   text: 'text-amber-800',   label: '신청하기 페이지 기능 구현' },
  4: { wrap: 'bg-rose-50 border-rose-200',     num: 'bg-rose-500',    text: 'text-rose-800',    label: '서버로 데이터 전송하기' },
  5: { wrap: 'bg-fuchsia-50 border-fuchsia-200', num: 'bg-fuchsia-500', text: 'text-fuchsia-800', label: '수정하기와 페이지 간 데이터 전달' },
  6: { wrap: 'bg-cyan-50 border-cyan-200',     num: 'bg-cyan-500',    text: 'text-cyan-800',    label: '확인 페이지와 최종 제출' },
  7: { wrap: 'bg-violet-50 border-violet-200', num: 'bg-violet-500',  text: 'text-violet-800',  label: '탭 접근 제어와 완료 상태 관리' },
  8: { wrap: 'bg-orange-50 border-orange-200', num: 'bg-orange-500',  text: 'text-orange-800',  label: '컴포넌트 로직 정리 — 커스텀 훅으로 분리하기' },
  9: { wrap: 'bg-teal-50 border-teal-200',   num: 'bg-teal-500',    text: 'text-teal-800',    label: '백엔드 미구현 엔드포인트 안전 호출 — throwOnError 우회 패턴' },
  10: { wrap: 'bg-lime-50 border-lime-200', num: 'bg-lime-500',  text: 'text-lime-800',  label: '임시 제출(mock Route + sessionStorage) → 실 API 연동 전환' },
  11: { wrap: 'bg-red-50 border-red-200',  num: 'bg-red-500',   text: 'text-red-800',   label: '트러블슈팅 — 학종 신청 빈 값 거부 오류' },
  12: { wrap: 'bg-pink-50 border-pink-200', num: 'bg-pink-500', text: 'text-pink-800', label: '개념 정리 — 입력값 전송(쓰기) vs 화면 구성(읽기)' },
  13: { wrap: 'bg-purple-50 border-purple-200', num: 'bg-purple-500', text: 'text-purple-800', label: '컴포넌트 분리와 FSD 레이어 — 페이지에서 끌어올린 prop 정리' },
  14: { wrap: 'bg-indigo-50 border-indigo-200', num: 'bg-indigo-500', text: 'text-indigo-800', label: 'Invalid hook call — 훅은 아무 데서나 부를 수 없다' },
  15: { wrap: 'bg-slate-50 border-slate-200', num: 'bg-slate-500', text: 'text-slate-800', label: '다른 호스트의 API 호출 — 전용 클라이언트 · CSP · 프록시' },
  16: { wrap: 'bg-blue-50 border-blue-200', num: 'bg-blue-500', text: 'text-blue-800', label: '페이지 로직을 단일 오케스트레이션 훅으로 통합' },
  17: { wrap: 'bg-green-50 border-green-200', num: 'bg-green-500', text: 'text-green-800', label: 'Confirm 페이지에도 같은 패턴을 — 통째 호출의 함정' },
  18: { wrap: 'bg-yellow-50 border-yellow-200', num: 'bg-yellow-500', text: 'text-yellow-800', label: '복수 데이터를 스냅샷에 담는 법 — comma-join vs 구조화 배열' },
  19: { wrap: 'bg-stone-50 border-stone-200', num: 'bg-stone-500', text: 'text-stone-800', label: 'sessionStorage 의존을 걷어내고 서버를 진실의 원천으로' },
  20: { wrap: 'bg-zinc-50 border-zinc-200', num: 'bg-zinc-500', text: 'text-zinc-800', label: '서버 응답의 number vs 요청의 string — 대칭 깨짐 사냥' },
  21: { wrap: 'bg-neutral-50 border-neutral-200', num: 'bg-neutral-500', text: 'text-neutral-800', label: 'state updater는 pure해야 한다 — alert() 함정' },
  22: { wrap: 'bg-gray-50 border-gray-200', num: 'bg-gray-500', text: 'text-gray-800', label: 'Confirm 모드의 빈값 숨김 분기 패턴' },
  23: { wrap: 'bg-sky-50 border-sky-300', num: 'bg-sky-600', text: 'text-sky-900', label: '로컬 플래그를 서버 진실로 — isApplyCompleted 사례' },
  24: { wrap: 'bg-emerald-50 border-emerald-300', num: 'bg-emerald-600', text: 'text-emerald-900', label: '훅 책임 경계 — 결합 vs 분리의 판단 기준' },
  25: { wrap: 'bg-amber-50 border-amber-300', num: 'bg-amber-600', text: 'text-amber-900', label: '신청의 두 단계 — apply(draft) vs submit(confirmed)' },
  26: { wrap: 'bg-fuchsia-50 border-fuchsia-300', num: 'bg-fuchsia-600', text: 'text-fuchsia-900', label: '빈 응답의 깊이별 판정 — ||/??/length/some' },
  27: { wrap: 'bg-violet-50 border-violet-300', num: 'bg-violet-600', text: 'text-violet-900', label: '같은 UI를 두 데이터에 공유 — 제네릭 + render-prop' },
  28: { wrap: 'bg-orange-50 border-orange-300', num: 'bg-orange-600', text: 'text-orange-900', label: 'dedicated status API 없을 때 — POST 에러 응답으로 대체' },
  29: { wrap: 'bg-indigo-50 border-indigo-300', num: 'bg-indigo-700', text: 'text-indigo-900', label: 'Next.js 서버 가드 — 훅 규칙 경계 + options 페이지별 정책' },
  30: { wrap: 'bg-rose-50 border-rose-300', num: 'bg-rose-700', text: 'text-rose-900', label: 'Mutation 후 화면 갱신 — Cache Invalidation 표준 패턴' },
  31: { wrap: 'bg-teal-50 border-teal-300', num: 'bg-teal-700', text: 'text-teal-900', label: '인터랙티브 UI — Pointer Events + StarRating 사례' },
  32: { wrap: 'bg-pink-50 border-pink-300', num: 'bg-pink-700', text: 'text-pink-900', label: 'server-first display, local fallback 패턴' },
  33: { wrap: 'bg-cyan-50 border-cyan-300', num: 'bg-cyan-700', text: 'text-cyan-900', label: 'Options API 진화 — boolean에서 enum 값으로' },
  34: { wrap: 'bg-violet-50 border-violet-300', num: 'bg-violet-700', text: 'text-violet-900', label: '조건부 렌더링의 흔한 함정 — 모순 조건과 0 함정' },
  35: { wrap: 'bg-emerald-50 border-emerald-300', num: 'bg-emerald-700', text: 'text-emerald-900', label: '제출 검증 ① — 학생 구분(graduationType)으로 필수 범위' },
  36: { wrap: 'bg-orange-50 border-orange-300', num: 'bg-orange-700', text: 'text-orange-900', label: '제출 검증 ② — "완료 판정"은 화면(UI)과 똑같은 기준으로' },
  37: { wrap: 'bg-rose-50 border-rose-300', num: 'bg-rose-800', text: 'text-rose-900', label: '수정하기 복원의 함정 — 빈 문자열 트랩과 단일 복원 경로 ★' },
  38: { wrap: 'bg-blue-50 border-blue-300', num: 'bg-blue-700', text: 'text-blue-900', label: '제출 에러·인터랙션 — confirm 반환값, 서버 메시지, mutateAsync try/catch' },
}

/* ── StepCard ─────────────────────────────────── */
interface StepCardProps {
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38
  num: number | string
  id?: string
  title: string
  children: React.ReactNode
}

export function StepCard({ phase, num, id, title, children }: StepCardProps) {
  return (
    <div
      id={id ?? `step${num}`}
      className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0',
            phaseStepBg[phase],
          )}
        >
          {num}
        </div>
        <h4 className="text-[15px] font-bold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-3 text-[14px] text-gray-700 leading-7">{children}</div>
    </div>
  )
}

/* ── PhaseHeader ──────────────────────────────── */
export function PhaseHeader({ phase }: { phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 }) {
  const s = phaseHeaderMap[phase]
  return (
    <div className={cn('flex items-center gap-3 rounded-xl px-5 py-4 border mb-4', s.wrap)}>
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-extrabold shrink-0',
          s.num,
        )}
      >
        P{phase}
      </div>
      <h3 className={cn('text-base font-bold', s.text)}>
        Phase {phase} — {s.label}
      </h3>
    </div>
  )
}

/* ── SectionHeader ────────────────────────────── */
interface SectionHeaderProps {
  icon: string
  title: string
  sub?: string
}

export function SectionHeader({ icon, title, sub }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        {sub && <p className="text-[13px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

/* ── CompareGrid (Before/After) ───────────────── */
interface CompareGridProps {
  beforeLabel?: string
  afterLabel?: string
  before: React.ReactNode
  after: React.ReactNode
}

export function CompareGrid({
  beforeLabel = '변경 전',
  afterLabel = '변경 후',
  before,
  after,
}: CompareGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-2">
          {beforeLabel}
        </div>
        {before}
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-green-700 mb-2">
          {afterLabel}
        </div>
        {after}
      </div>
    </div>
  )
}

/* ── FlowDiagram ──────────────────────────────── */
export function FlowDiagram({ children }: { children: string }) {
  return (
    <div className="bg-[#1e1e2e] rounded-lg px-5 py-5 my-3 overflow-x-auto">
      <pre className="text-[#cdd6f4] font-mono text-[12.5px] leading-7 whitespace-pre">
        {children}
      </pre>
    </div>
  )
}
