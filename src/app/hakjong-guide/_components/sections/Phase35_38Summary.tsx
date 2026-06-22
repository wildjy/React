import { FlowDiagram } from '../ui/StepCard'
import { Callout } from '../ui/Callout'

/* Phase 35-38 한 그림 — 입시전문가 평가 "제출 검증·복원" 정리 */
export function Phase35_38Summary() {
  return (
    <section className="mb-16">
      <div
        id="phase35-38-summary"
        className="bg-gradient-to-br from-emerald-50 via-orange-50 to-blue-50 border border-emerald-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🗺
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Phase 35-38 한 그림 — 입시전문가 평가 "제출 검증·복원" 정리
          </h3>
        </div>
        <FlowDiagram>{`[유형 분기]   graduationType === '3' ? 재학생(2학년까지) : N수(3학년까지)
               └─ isEnrolledStudent 한 줄 → requiredSemesters / requiredGrades 데이터로 분기

[완료 판정]   화면(BadgeButton)과 같은 기준으로!
               교과/모의:  entered === '미입력' 이 미완료   (≠ '입력' 으로 짜면 깨짐)
               비교과:     값 !== 4 가 미완료              (=== 0 은 빈 데이터를 놓침)
               최소 1개:   !arr.some(입력됨)
               동적 키:    as const + \`Grade_\${grade}_\${type}\`

[수정 복원]   ❌ if(!subjectNotData) return   ← ''(빈 메모)에서 복원 전체 중단
               ✅ if(subjectNotData === undefined) return   ← 로딩만 대기
               복원 경로가 하나(useState)라 막히면 카드·선호값 전부 빔
               검증 위치: 새 카드 드롭다운=첫 신청만 / 카드 최소1개=항상

[제출/에러]   confirm → 반환값으로 분기 (if(!proceed) return)
               onError → alert(APIError.message(error))  (서버 메시지 노출)
               mutateAsync → try/catch 필수 (reject 흡수 + '이미완료' → /confirm)`}</FlowDiagram>
        <Callout variant="key">
          한 문장 요약: <strong>"유형으로 범위를 나누고, 완료 판정은 화면과 일치시키고, 복원 가드는 <code className="bg-white px-1 rounded">=== undefined</code>로, 제출 에러는 서버 메시지로."</strong>
        </Callout>
      </div>
    </section>
  )
}
