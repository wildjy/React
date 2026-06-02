import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { DataTable } from '../ui/DataTable'

export function Phase25() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={25} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경: 왜 POST가 두 개인가</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">학종 신청은 <strong>두 단계</strong>로 나뉜다.</p>
        <DataTable
          headers={['POST 엔드포인트', '의미', '수정 가능?']}
          rows={[
            [<IC key="a">/admission-evaluation/apply</IC>, <><strong key="a2">초안 저장</strong>(draft)</>, '✅ 다시 POST로 덮어쓰기 가능'],
            [<IC key="b">/admission-evaluation/submit</IC>, <><strong key="b2">최종 확정</strong>(final)</>, '❌ 이후 어떤 변경도 거부'],
          ]}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          쇼핑몰의 "장바구니 → 결제" 또는 은행 이체 confirm 모달 같은 2-step 패턴과 같은 결. 사용자에게 <strong>"확인" 단계</strong>를 제공해 실수를 막고,
          "신청완료 후 수정 불가" 정책을 강제하기 위함.
        </p>
      </div>

      <StepCard phase={25} num={79} id="step79" title="사용자 상태 머신">
        <p>세 상태로 정리하면 흐름이 또렷해진다.</p>
        <FlowDiagram>{`                  POST /apply                  POST /submit
[빈 상태] ─────────────────→ [DRAFT] ─────────────────→ [CONFIRMED]
                                ↑↓
                          POST /apply (수정)
                          (자기 자신으로 재진입 가능)


CONFIRMED 상태에서 POST /apply 또는 /submit 시도
  → 400 { message: "이미 신청이 완료되었습니다." }`}</FlowDiagram>
        <DataTable
          headers={['상태', '사용자 입장', '서버 측 의미']}
          rows={[
            [<strong key="a">빈 상태</strong>, '아직 아무것도 안 함', '사용자별 신청 row 없음'],
            [<strong key="b">DRAFT</strong>, '"신청은 했지만 아직 확정 전"', '데이터 저장됐고 수정 가능'],
            [<strong key="c">CONFIRMED</strong>, '"최종 제출 완료"', 'lock — 어떤 modify도 거부'],
          ]}
        />
      </StepCard>

      <StepCard phase={25} num={80} id="step80" title="페이지별 흐름">
        <FlowDiagram>{`┌─ APPLY 페이지 ─────────────────────────────────────────────────────┐
│ 마운트 → GET /hope-univs, /prefer-selections, /simple-questions   │
│         (prefetch — 이전 DRAFT 가 있으면 폼에 채움)                │
│ [입력완료] → POST /apply → /confirm 로 이동                        │
└────────────────────────┬───────────────────────────────────────────┘
                         ↓
┌─ CONFIRM 페이지 ───────────────────────────────────────────────────┐
│ 마운트 → 같은 GET 3개 (서버 DRAFT 재조회 → 표시)                  │
│ [수정하기] → /apply 로 이동                                       │
│ [신청완료] → 모달 → [신청] → POST /submit → /report 로 이동       │
└────────────────────────┬───────────────────────────────────────────┘
                         ↓
┌─ REPORT 페이지 ────────────────────────────────────────────────────┐
│ 마운트 → GET /report-header, /transcript-evaluation,             │
│         /application-strategy (CONFIRMED 이후 평가 결과)         │
└────────────────────────────────────────────────────────────────────┘`}</FlowDiagram>
      </StepCard>

      <StepCard phase={25} num={81} id="step81" title="GET 엔드포인트가 끼는 위치">
        <p>각 GET이 <strong>어느 상태에서 의미 있는지</strong>가 학습 포인트.</p>
        <DataTable
          headers={['GET', '의미 있는 상태', '사용 페이지', '역할']}
          rows={[
            [<IC key="a">/hope-univs</IC>, 'DRAFT, CONFIRMED', 'Apply, Confirm', '희망 대학 카드'],
            [<IC key="b">/prefer-selections</IC>, 'DRAFT, CONFIRMED', 'Apply, Confirm', '선호 전공/지역'],
            [<IC key="c">/simple-questions</IC>, 'DRAFT, CONFIRMED', 'Apply, Confirm', '강조 활동/간단 질문'],
            [<IC key="d">/report-header</IC>, 'CONFIRMED', 'Report', '평가 진행 상태'],
            [<IC key="e">/transcript-evaluation</IC>, 'CONFIRMED + 평가 완료', 'Report', '학생부 평가'],
            [<IC key="f">/application-strategy</IC>, 'CONFIRMED + 평가 완료', 'Report', '추천/비추천'],
          ]}
        />
        <Callout variant="info">
          <strong>GET은 모두 read-only.</strong> 호출해도 상태 전이 없음. 같은 데이터를 어디서 보든 같음.
        </Callout>
      </StepCard>

      <StepCard phase={25} num={82} id="step82" title='코드 네이밍 — 영어 apply ≠ 한국어 "신청"'>
        <p>이 부분이 <strong>가장 큰 혼동 포인트</strong>:</p>
        <DataTable
          headers={['코드 이름', '실제 동작', '사용자 용어']}
          rows={[
            [<IC key="a">submitAdmissionEvaluationApply</IC>, 'POST /apply (draft 저장)', <strong key="a2">입력완료</strong>],
            [<IC key="b">submitAdmissionEvaluationSubmit</IC>, 'POST /submit (최종 확정)', <strong key="b2">신청완료</strong>],
            [<IC key="c">useAdmissionEvaluationApplyMutation</IC>, 'apply 호출용 mutation', 'Apply 페이지 [입력완료]'],
            [<IC key="d">useAdmissionEvaluationConfirmMutation</IC>, 'submit 호출용 mutation', 'Confirm 페이지 [신청완료]'],
          ]}
        />
        <p>
          영어 "apply"가 한국어 "신청"으로 직역되지만, <strong>코드의 <IC>apply</IC>는 "draft 저장"</strong>이고
          <strong> 한국어 "신청완료"는 실제로 <IC>submit</IC></strong>. 이 어긋남이 코드 읽을 때 가장 헷갈리는 부분.
        </p>
        <Callout variant="tip">
          <strong>장기적 개명 후보</strong> (가독성 개선):
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><IC>submitAdmissionEvaluationApply</IC> → <IC>saveApplicationDraft</IC></li>
            <li><IC>useAdmissionEvaluationConfirmMutation</IC> → <IC>useFinalizeApplicationMutation</IC></li>
          </ul>
        </Callout>
      </StepCard>

      <StepCard phase={25} num={83} id="step83" title='"이미 신청 완료" 에러는 언제'>
        <p><strong>오직 CONFIRMED 상태에서 modify 시도할 때</strong>:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>사용자가 한 번 [신청완료] → 모달 [신청] 완료 → 서버 CONFIRMED</li>
          <li>그 후 어떤 경로로든 /apply 또는 /submit 호출 → 400 거부</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-3">발생 가능 경로:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>Confirm 페이지에서 [신청완료] 또 누름 (새로고침 후)</li>
          <li>Apply 페이지에서 [입력완료] 누름 (다른 탭에서 confirm한 줄 모르고)</li>
          <li>직접 URL로 /apply 진입</li>
        </ul>
        <p className="mt-2">처리 방법은 Phase 28에서.</p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>두 단계 신청은 "확인" 의 가치를 강제한다.</strong> 한 번에 완료되는 흐름보다 코드는 복잡해지지만,
          사용자가 본인의 입력을 검토한 뒤 lock을 걸 수 있어 "되돌리기 불가" 정책이 자연스럽게 강제된다.
        </Callout>
        <Callout variant="key">
          <strong>API 동사를 직역하지 마라.</strong> 영어 endpoint 명("apply")이 한국어 UX 단어("신청")와 다른 단계를 가리킬 수 있다.
          코드 옆에 "어느 단계인지" 명시하거나 함수명을 그 단계의 의미로 바꾸자.
        </Callout>
      </div>
    </section>
  )
}
