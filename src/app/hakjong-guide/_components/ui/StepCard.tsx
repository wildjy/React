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
}

const phaseHeaderMap: Record<number, { wrap: string; num: string; text: string; label: string }> = {
  1: { wrap: 'bg-sky-50 border-sky-200',       num: 'bg-sky-500',     text: 'text-sky-800',     label: '페이지 구조 잡기' },
  2: { wrap: 'bg-emerald-50 border-emerald-200', num: 'bg-emerald-500', text: 'text-emerald-800', label: '접근 제어 (가드) 구현' },
  3: { wrap: 'bg-amber-50 border-amber-200',   num: 'bg-amber-500',   text: 'text-amber-800',   label: '신청하기 페이지 기능 구현' },
  4: { wrap: 'bg-rose-50 border-rose-200',     num: 'bg-rose-500',    text: 'text-rose-800',    label: '서버로 데이터 전송하기' },
  5: { wrap: 'bg-fuchsia-50 border-fuchsia-200', num: 'bg-fuchsia-500', text: 'text-fuchsia-800', label: '수정하기와 페이지 간 데이터 전달' },
  6: { wrap: 'bg-cyan-50 border-cyan-200',     num: 'bg-cyan-500',    text: 'text-cyan-800',    label: '확인 페이지와 최종 제출' },
  7: { wrap: 'bg-violet-50 border-violet-200', num: 'bg-violet-500',  text: 'text-violet-800',  label: '탭 접근 제어와 완료 상태 관리' },
}

/* ── StepCard ─────────────────────────────────── */
interface StepCardProps {
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7
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
export function PhaseHeader({ phase }: { phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) {
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
