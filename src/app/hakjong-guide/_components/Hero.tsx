const phases = [
  { color: 'bg-sky-400',     label: 'Phase 1 · 페이지 구조', steps: '5 steps' },
  { color: 'bg-emerald-400', label: 'Phase 2 · 접근 제어',   steps: '2 steps' },
  { color: 'bg-amber-400',   label: 'Phase 3 · 신청 기능',   steps: '6 steps' },
  { color: 'bg-rose-400',    label: 'Phase 4 · 서버 전송',   steps: '6 steps' },
  { color: 'bg-fuchsia-400', label: 'Phase 5 · 수정하기',   steps: '5 steps' },
  { color: 'bg-cyan-400',    label: 'Phase 6 · 최종 제출', steps: '4 steps' },
  { color: 'bg-violet-400',  label: 'Phase 7 · 탭 접근 제어', steps: '5 steps' },
  { color: 'bg-orange-400',  label: 'Phase 8 · 커스텀 훅 분리', steps: '6 steps' },
]

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-6 py-10 md:px-12 md:py-14">
      {/* 뱃지 */}
      <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[11.5px] font-semibold mb-4">
        퍼블리셔 → 프론트엔드 전환 가이드
      </span>

      {/* 제목 */}
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
        학종(hakjong)<br className="sm:hidden" /> 프론트엔드 개발 가이드
      </h1>
      <p className="text-[14px] text-indigo-100 max-w-xl leading-7 mb-6">
        HTML/CSS 마크업 이후, React + Next.js 기반으로 실제 동작하는 페이지를 만들기까지의
        전체 흐름을 <strong>39 Steps · 8 Phases</strong>로 단계별 정리합니다.
      </p>

      {/* Phase 뱃지 목록 */}
      <div className="flex flex-wrap gap-2">
        {phases.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-[12px] font-semibold"
          >
            <span className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
            {p.label}
            <span className="text-white/60 font-normal text-[11px]">({p.steps})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
