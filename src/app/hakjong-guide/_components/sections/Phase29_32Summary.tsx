import { FlowDiagram } from '../ui/StepCard'

/* Phase 29-32 합쳐서 — 전체 흐름 한 그림 */
export function Phase29_32Summary() {
  return (
    <section className="mb-16">
      <div
        id="phase29-32-summary"
        className="bg-gradient-to-br from-indigo-50 via-rose-50 to-teal-50 border border-indigo-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🗺
          </div>
          <h3 className="text-base font-bold text-gray-900">Phase 29-32 합쳐서 — 오늘 한 일의 한 그림</h3>
        </div>
        <FlowDiagram>{`페이지 진입 (서버 컴포넌트)
  ↓
ensureAdmissionEvaluationAccess({ ... })   ── Phase 29
  ├─ 비로그인 → redirect(INTRO)
  ├─ 미완료 + redirectIfNotCompleted → redirect(INTRO)
  └─ 완료+결제 + redirectIfCompleted → redirect(REPORT)

클라이언트 렌더
  ↓
useSatisfactionSurveyQuery(userId)   ── 캐시에 서버 값 확보
  ↓
displayRating = isAlreadyRated ? server : local   ── Phase 32
  ↓ 사용자: 별점 드래그 (PointerEvents)
  ↓
StarRating 컴포넌트                     ── Phase 31
  ├─ Pointer Events (PC + Mobile 통합)
  ├─ 두 레이어 width% 오버레이
  ├─ hoverValue 미리보기 → 손 떼는 순간 onChange
  └─ 0~10 정수 송신 (서버 @IsInt 친화)
  ↓
[별점 남기기] 클릭
  ↓
useSubmitSatisfactionMutation
  ↓ mutationFn
  ↓ onSuccess (정의)
queryClient.invalidateQueries(['satisfactionSurvey', userId])   ── Phase 30
  ↓ React Query 자동 refetch
satisfactionSurveyData.satisfiedRate = 새 값
  ↓
isAlreadyRated = true → displayRating = server 값
  → StarRating 자동 잠금, 새로고침해도 유지`}</FlowDiagram>
      </div>
    </section>
  )
}
