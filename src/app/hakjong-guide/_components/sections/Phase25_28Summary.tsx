import { FlowDiagram } from '../ui/StepCard'

/* Phase 25-28 합쳐서 — 전체 흐름 한 그림 */
export function Phase25_28Summary() {
  return (
    <section className="mb-16">
      <div id="phase25-28-summary" className="bg-gradient-to-br from-amber-50 via-fuchsia-50 to-orange-50 border border-amber-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🗺
          </div>
          <h3 className="text-base font-bold text-gray-900">Phase 25-28 합쳐서 — 오늘 한 일의 한 그림</h3>
        </div>
        <FlowDiagram>{`사용자 입력
  ↓
Apply: POST /apply (draft)              ─┐
  ↓                                       │
Confirm: 검토                              ├─ Phase 25 (두 단계 흐름)
  ↓                                       │
Confirm 모달: POST /submit (final)      ─┘
  ↓
Report 페이지
  ├─ 학생부 평가 결과
  │    ├─ StudentRecordEvaluation
  │    │    └─ 빈 응답 처리 ── Phase 26 (깊이별 판정)
  │    │         └─ hasMeaningfulItems
  │    └─ Mock fallback
  ├─ 수시 지원 전략
  │    ├─ 희망 대학 ─┐
  │    │            ├─ Phase 27 (같은 UI 공유)
  │    │            │   └─ EvaluationTabModule<T> + render-prop
  │    └─ 추천 대학 ─┘
  └─ 전문가에게 질문 (mutation 4종 세트 — Phase 24)


CONFIRMED 상태에서 POST 재시도
  → 400 "이미 신청이 완료되었습니다."
  → Phase 28 (status API 없을 때 — 에러 응답 활용)`}</FlowDiagram>
      </div>
    </section>
  )
}
