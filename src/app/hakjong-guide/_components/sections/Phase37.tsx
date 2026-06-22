import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase37() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={37} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ★
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          신청 완료 → 확인(confirm) → <strong>수정하기</strong>로 신청 페이지에 돌아오니, 서버에 데이터가 분명히 있는데도
          "희망대학 최소 1개" / "선호 전공·지역" 검증이 걸렸다. 이번 작업에서 <strong>가장 값진 버그</strong>.
        </p>
      </div>

      <StepCard phase={37} num={142} id="step142" title="복원(hydration)이 한 번에 다 일어난다는 사실">
        <p>
          <IC>useAdmissionEvaluationApplyForm</IC>의 복원 effect는 서버 캐시(<IC>useConfirm*Query</IC>)가 준비되면
          폼 state를 <strong>한 번만</strong> 채운다(<IC>hasHydrated</IC> ref).
          여기서 카드·선호전공/지역·강조활동이 <strong>동시에</strong> 복원된다.
        </p>
        <p>
          그리고 <IC>useAdmissionEvaluationHandler</IC>는 sessionStorage 없이 <strong>전부 <IC>useState</IC></strong>다 →
          카드(<IC>selectedCards</IC>)도, 선호전공/지역(<IC>selectedTypeOption</IC>)도 <strong>오직 이 복원 effect로만</strong> 채워진다.
          <strong> 복원 경로가 하나</strong>라는 게 포인트.
        </p>
      </StepCard>

      <StepCard phase={37} num={143} id="step143" title="범인 — !subjectNotData truthy 가드">
        <p>복원 effect 맨 앞 가드가 이랬다:</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌
if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData || !subjectNotData)
  return;`}
        />
        <p>
          <IC>subjectNotData</IC>는 <strong>비교과 추가메모 문자열</strong>이다.
          메모를 안 쓴 사용자는 서버가 <IC>{"''"}</IC>(빈 문자열)을 준다(<IC>fetchConfirmSubjectNot</IC>가 <IC>{"?? ''"}</IC> 폴백).
        </p>
        <FlowDiagram>{`!''  →  true   →  return  →  복원 effect 전체가 중단됨`}</FlowDiagram>
        <p>
          → <IC>setSelectedCards</IC>, <IC>setSelectedTypeOption</IC>이 <strong>아예 실행 안 됨</strong> →
          카드·선호값이 빈 채로 남음 → 제출 시 검증에 걸림.
        </p>
      </StepCard>

      <StepCard phase={37} num={144} id="step144" title="고치기 — '로딩'은 === undefined 로 판별">
        <CodeBlock
          lang="typescript"
          code={`// ✅ 로딩 전(undefined)에는 대기, 로딩된 빈 문자열('')은 통과
if (
  !hopeUnivsData ||
  !preferSelectsData ||
  !simpleQuestionData ||
  subjectNotData === undefined
)
  return;`}
        />
        <p>
          <IC>{"setComparativeExtraInfo(subjectNotData ?? '')"}</IC>가 undefined도 안전하게 처리하므로 부작용 없음.
        </p>
        <Callout variant="key">
          <strong>이게 일반 원칙이다.</strong> React Query에서 "아직 안 옴"은 <IC>undefined</IC>,
          "왔는데 비어있음"은 <IC>{"''"}</IC>/<IC>{'[]'}</IC>/<IC>0</IC>.
          <IC>!x</IC> 가드는 이 둘을 구분 못 한다.
          <strong> 로딩 판별은 <IC>=== undefined</IC> (또는 <IC>isLoading</IC>)</strong>로 해야,
          <IC>{"''"}</IC>/<IC>0</IC>/<IC>false</IC>가 정상값인 필드에서 안 터진다. (Phase 26의 "빈 응답 깊이별 판정"과 한 식구.)
        </Callout>
      </StepCard>

      <StepCard phase={37} num={145} id="step145" title="수정 모드에서 검증을 어디까지 할지 — 드롭다운 분기">
        <p>검증 중 일부는 <strong>첫 신청에서만</strong> 의미가 있다:</p>
        <CodeBlock
          lang="typescript"
          code={`// 카드 추가용 드롭다운(대학/계열/학과)은 첫 신청 때만 검증
// (수정 모드에선 카드가 이미 복원돼 있고, 이 드롭다운은 비어 있는 게 정상)
if (!hopeUnivsData?.length) {
  if (!drop1.value || !drop2.value || !drop3.value) {
    alert('대학, 계열, 학과를 모두 선택해주세요.');
    return;
  }
}`}
        />
        <p>
          반면 "카드 최소 1개"는 <strong>수정 모드에서도</strong> 검증해야 한다
          (수정 화면에서 카드를 0개로 만들고 제출하면 서버가 <IC>{"majorIdHsbs must contain at least 1 elements"}</IC>로 거부).
          그래서 이건 <IC>if (!hopeUnivsData?.length)</IC> <strong>바깥</strong>에 둔다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`if (handler.selectedCards.length === 0) {
  alert('희망대학은 최소 1개를 선택 해주세요.');
  return;
}`}
        />
        <Callout variant="info">
          <strong>판단 기준:</strong> "이 입력은 수정 모드에선 비어 있는 게 정상인가?" → 그렇다면(예: 새 카드 추가용 드롭다운) 첫 신청에서만 검증.
          "수정 모드에서도 비면 안 되는가?" → 그렇다면(예: 카드 자체) 항상 검증.
        </Callout>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-rose-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>truthy 가드 <IC>!x</IC>는 <IC>0</IC>/<IC>{"''"}</IC>/<IC>false</IC>가 정상값인 데이터에 쓰면 버그다.</strong>{' '}
          특히 복원 가드처럼 "한 번 막히면 전부 안 채워지는" 곳에선 치명적. 로딩 판별은 <IC>=== undefined</IC>.
        </Callout>
        <Callout variant="key">
          <strong>상태 복원 경로가 하나라면, 그 경로가 막히는 모든 조건을 의심하라.</strong>{' '}
          카드가 비어 보이는데 원인은 엉뚱한 <IC>subjectNotData</IC> 가드였다.
        </Callout>
        <Callout variant="key">
          <strong>검증마다 "수정 모드에서도 필요한가?"를 따져 위치를 정하라.</strong>{' '}
          첫 신청 전용은 <IC>if (!hopeUnivsData?.length)</IC> 안, 공통은 밖.
        </Callout>
      </div>
    </section>
  )
}
