import { PhaseHeader, StepCard, FlowDiagram, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase7() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={7} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">왜 Phase 7이 필요한가?</h4>
        </div>
        <FlowDiagram>{`[서비스 안내] ─ [평가 신청하기] ─ [평가 리포트]
     탭 0             탭 1             탭 2

문제:
  신청 완료 후 report 페이지로 이동했는데
  이후 탭을 직접 클릭하면 "신청을 먼저 완료해주세요" 경고 발생

원인:
  Navigator의 isApplyCompleted가 항상 false였음

해결:
  제출 시 sessionStorage에 완료 상태 저장
  → 리포트 탭 클릭 시 handleBeforeReport에서 최신 값 확인`}</FlowDiagram>
        <Callout variant="key">
          핵심은 <IC>탭 접근 제어</IC>도 결국 상태 관리 문제라는 점입니다.
          지금은 API가 없으므로 <IC>sessionStorage</IC>를 임시 상태 저장소로 사용합니다.
        </Callout>
      </div>

      <StepCard phase={7} num="29" id="step29" title="전체 흐름 이해 — 탭 내비게이션 구조">
        <FlowDiagram>{`apps/early/app/(early)/hakjong/
├── layout.tsx          → EarlyHakjongNavigator
├── page.tsx            → EarlyHakjongIntro
├── apply/
│   ├── page.tsx        → EarlyHakjong
│   └── confirm/
│       └── page.tsx    → EarlyHakjongConfirm
└── report/
    └── page.tsx        → EarlyHakjongReport`}</FlowDiagram>
        <p>
          <IC>layout.tsx</IC>에 <IC>EarlyHakjongNavigator</IC>가 있기 때문에 hakjong 하위의 모든 페이지에서 탭이 공통으로 표시됩니다.
          사용자가 리포트 탭을 누르면 <IC>Tab.Button</IC>의 <IC>onBeforeChange</IC>가 먼저 실행되고,
          여기서 로그인 여부, 신청 완료 여부, 결제 여부를 순서대로 검사합니다.
        </p>
        <FlowDiagram>{`사용자가 "평가 리포트" 탭 클릭
  └→ Tab.Button의 onBeforeChange 호출
      └→ handleBeforeReport() 실행
          ├→ 로그인 체크
          ├→ 신청 완료 체크
          ├→ 결제 체크
          └→ 모두 통과 시 router.push('/hakjong/report')`}</FlowDiagram>
        <Callout variant="tip">
          <IC>onBeforeChange</IC>는 탭 전환 직전의 가드 지점입니다. 여기서 <IC>false</IC>를 반환하면 탭 이동이 차단됩니다.
        </Callout>
      </StepCard>

      <StepCard phase={7} num="30" id="step30" title="변경 내용 — 제출 시 저장, 탭 클릭 시 읽기">
        <CompareGrid
          beforeLabel="변경 전"
          afterLabel="변경 후"
          before={
            <CodeBlock
              lang="typescript"
              code={`onClick={() => {
  setIsConfirmOpen(false)
  sessionStorage.removeItem('hakjong_apply_form')
  router.push('/hakjong/report')
}}`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              code={`onClick={() => {
  setIsConfirmOpen(false)
  sessionStorage.removeItem('hakjong_apply_form')
  sessionStorage.setItem('hakjong_apply_completed', 'true')
  router.push('/hakjong/report')
}}`}
            />
          }
        />
        <p>
          제출 시점에 <IC>hakjong_apply_completed</IC>를 저장해 두면, 같은 브라우저 탭 안에서는 이후 페이지 이동이 일어나도
          "신청이 완료됐다"는 상태를 다시 확인할 수 있습니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const isPaid = true

const handleBeforeReport = () => {
  if (!currentUser.userId) {
    alert('로그인이 필요한 서비스입니다.')
    return false
  }

  const isApplyCompleted =
    sessionStorage.getItem('hakjong_apply_completed') === 'true'

  if (!isApplyCompleted) {
    alert('평가 신청을 먼저 완료해주세요.')
    return false
  }
  if (!isPaid) {
    alert('서비스 결제가 필요한 서비스입니다.')
    return false
  }
  router.push('/hakjong/report')
  return true
}`}
        />
        <Callout variant="info">
          현재는 결제 플로우가 없으므로 <IC>isPaid</IC>를 <IC>true</IC>로 고정해 불필요한 차단을 막습니다.
        </Callout>
      </StepCard>

      <StepCard phase={7} num="31" id="step31" title="왜 sessionStorage를 선택했는가">
        <DataTable
          headers={['방법', '장점', '단점', '적합 여부']}
          rows={[
            ['sessionStorage', '같은 탭 내 페이지 이동 후에도 유지', '탭을 닫으면 사라짐', '현재 최적'],
            ['useState', '가장 단순함', '라우트 이동 시 상태가 사라짐', '부적합'],
            ['localStorage', '브라우저를 닫아도 유지', '수동 삭제 필요, 다른 탭에도 영향', '과도함'],
            ['Redux store', '전역에서 접근 가능', '설정이 복잡하고 새로고침에 약함', '과도함'],
            ['서버 API', '가장 신뢰할 수 있음', 'API 구현 필요', '최종 목표'],
          ]}
        />
        <Callout variant="key">
          지금 단계의 목표는 완전한 영속 저장이 아니라, <strong>같은 탭 안에서 신청 완료 후 리포트 탭이 정상 동작하게 만드는 것</strong>입니다.
          그래서 <IC>sessionStorage</IC>가 가장 실용적입니다.
        </Callout>
      </StepCard>

      <StepCard phase={7} num="32" id="step32" title="sessionStorage를 핸들러 안에서 읽어야 하는 이유">
        <CompareGrid
          beforeLabel="잘못된 위치"
          afterLabel="올바른 위치"
          before={
            <CodeBlock
              lang="typescript"
              code={`const isApplyCompleted =
  sessionStorage.getItem('hakjong_apply_completed') === 'true'

const handleBeforeReport = () => {
  if (!isApplyCompleted) {
    return false
  }
}`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              code={`const handleBeforeReport = () => {
  const isApplyCompleted =
    sessionStorage.getItem('hakjong_apply_completed') === 'true'

  if (!isApplyCompleted) {
    return false
  }
}`}
            />
          }
        />
        <p>
          <IC>sessionStorage</IC>는 React state가 아니므로 값이 바뀌어도 리렌더링을 일으키지 않습니다.
          컴포넌트 최상위에서 한 번만 읽으면 마운트 시점의 값이 고정되고, 이벤트가 일어나는 나중 시점의 최신 값은 반영되지 않을 수 있습니다.
        </p>
        <FlowDiagram>{`[컴포넌트 마운트 시점]
  sessionStorage 값 없음
  → 최상위에서 읽으면 false로 고정

[사용자 신청 완료 후]
  sessionStorage = 'true'
  → 최상위 값은 그대로 false
  → 핸들러 안에서 읽어야 클릭 시점의 최신 값 확인 가능`}</FlowDiagram>
        <Callout variant="warn">
          핵심 규칙은 간단합니다. <strong>React 상태가 아닌 외부 저장소 값은 이벤트 시점에 다시 읽어라</strong>입니다.
        </Callout>
      </StepCard>

      <StepCard phase={7} num="33" id="step33" title="API 연동 시 바뀌는 구조와 최종 방향">
        <p>
          지금 구현은 임시 단계입니다. API가 생기면 신청 완료 상태와 결제 상태를 모두 <IC>useQuery</IC>로 서버에서 조회하는 구조로 바뀝니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const { data: applyStatus } = useQuery({
  queryKey: ['hakjong', 'apply', 'status'],
  queryFn: () => fetchHakjongApplyStatus(),
  enabled: !!currentUser.userId,
})

const { data: paymentStatus } = useQuery({
  queryKey: ['hakjong', 'payment', 'status'],
  queryFn: () => fetchHakjongPaymentStatus(),
  enabled: !!currentUser.userId,
})

const isApplyCompleted = applyStatus?.isApplyCompleted ?? false
const isPaid = paymentStatus?.isPaid ?? false`}
        />
        <DataTable
          headers={['순서', '파일', '현재 임시 방식', 'API 연동 후']}
          rows={[
            ['1', 'EarlyHakjongConfirm.tsx', 'sessionStorage.setItem(...) 저장', '해당 줄 삭제'],
            ['2', 'EarlyHakjongNavigator.tsx', 'sessionStorage.getItem(...) 읽기', 'useQuery로 서버 조회'],
            ['3', 'EarlyHakjongNavigator.tsx', 'const isPaid = true', 'useQuery로 결제 상태 조회'],
            ['4', 'hakjong.types.ts', '없음', '상태 조회 응답 타입 추가'],
            ['5', 'api/index.ts', '없음', '상태 조회 API 함수 추가'],
          ]}
        />
        <Callout variant="key">
          <strong>임시 구현 → API 전환 패턴:</strong> 먼저 하드코딩이나 <IC>sessionStorage</IC>로 흐름을 검증하고,
          이후 API가 확정되면 <IC>useQuery</IC> 기반의 서버 상태 관리로 교체합니다.
        </Callout>
        <Callout variant="tip">
          이 단계에서 다시 보이는 핵심은 <IC>가드 절(guard clause)</IC>입니다.
          로그인 → 신청 완료 → 결제 여부 순서로 빠르게 탈출하면 조건 검사가 읽기 쉬워집니다.
        </Callout>
      </StepCard>
    </section>
  )
}