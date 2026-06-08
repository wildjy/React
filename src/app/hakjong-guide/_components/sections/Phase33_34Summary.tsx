import { FlowDiagram } from '../ui/StepCard'

/* Phase 33-34 한 그림 — 오늘 한 일 */
export function Phase33_34Summary() {
  return (
    <section className="mb-16">
      <div
        id="phase33-34-summary"
        className="bg-gradient-to-br from-cyan-50 to-violet-50 border border-cyan-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🗺
          </div>
          <h3 className="text-base font-bold text-gray-900">Phase 33-34 한 그림 — 오늘 한 일</h3>
        </div>
        <FlowDiagram>{`Phase 29 가드 (boolean) ────► 새 요구: Confirm 미완료 → /apply
                              ─────────────────────────────────
                              naive: boolean 옵션 추가 (폭증)
                              ✅ 정답: 옵션 값을 enum destination 으로
                              ─────────────────────────────────
                              redirectIfNotCompleted?: 'INTRO' | 'APPLY'

ExpertQuestionSection ────► length && length === 0  (영원히 false)
                            ─────────────────────────────────
                            진단: 두 조건 교집합 ∅
                            ✅ 정답: (length ?? 0) > 0
                            ─────────────────────────────────
                            보너스: \`length && ...\` 자체도 \`0\` 함정 회피 위해 명시 비교`}</FlowDiagram>
      </div>
    </section>
  )
}
