import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase6() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={6} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">최종 제출 흐름</h4>
        </div>
        <FlowDiagram>{`[신청 페이지]
  입력완료 → 임시 저장 성공
           ↓
[확인 페이지]
  sessionStorage 값 표시
  → 신청완료(제출) 클릭
           ↓
[ConfirmModal]
  정말 제출할지 한 번 더 확인
           ↓
[현재]
  sessionStorage 정리 후 report 페이지 이동

[추후]
  confirm API 호출
  → 성공 시 report 페이지 이동`}</FlowDiagram>
      </div>

      <StepCard phase={6} num="25" id="step25" title="공통 ConfirmModal 컴포넌트 사용">
        <p>
          Phase 6에서는 직접 모달을 만들지 않고, 프로젝트에 이미 있는 공통 <IC>ConfirmModal</IC>을 사용합니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`// 올바른 import
import { ConfirmModal } from '@libs/ui/Modal/ConfirmModal'

// 잘못된 import
import { ConfirmModal } from '@libs/ui/Modal'`}
        />
        <Callout variant="warn">
          <strong>barrel export 주의:</strong> <IC>@libs/ui/Modal</IC>의 barrel export에 등록되지 않은 컴포넌트는
          파일 경로를 직접 지정해서 import해야 합니다.
        </Callout>
        <DataTable
          headers={['주요 prop', '역할']}
          rows={[
            ['isOpen', '모달 표시 여부'],
            ['message', '문자열 또는 JSX 본문'],
            ['onClick', '확인 버튼 클릭 핸들러'],
            ['onClose', '취소/닫기 핸들러'],
            ['isLoading', '확인 버튼 로딩 상태'],
          ]}
        />
      </StepCard>

      <StepCard phase={6} num="26" id="step26" title="모달 열기/닫기 상태 관리 패턴">
        <p>
          모달의 표시는 <IC>useState&lt;boolean&gt;</IC>으로 관리합니다. 이 패턴은 프로젝트 전반에서 반복됩니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const [isConfirmOpen, setIsConfirmOpen] = useState(false)

<Button onClick={() => setIsConfirmOpen(true)}>
  신청완료 (제출)
</Button>

<ConfirmModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onClick={() => {
    setIsConfirmOpen(false)
    // 추가 처리
  }}
/>`}
        />
        <Callout variant="tip">
          핵심은 <IC>isOpen</IC>에 상태를 연결하고, <IC>onClose</IC>와 <IC>onClick</IC>에서 상태를 다시 <IC>false</IC>로 되돌리는 것입니다.
        </Callout>
      </StepCard>

      <StepCard phase={6} num="27" id="step27" title="현재 구현 — 제출 확인 후 바로 리포트 페이지 이동">
        <p>
          아직 확정 API가 없기 때문에 현재는 확인 모달에서 "신청"을 누르면 sessionStorage를 정리하고 리포트 페이지로 이동합니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`<ConfirmModal
  isOpen={isConfirmOpen}
  message={
    '입시전문가 평가를 신청하시겠습니까?\n상담신청을 완료하면 내용 변경이 불가하며,\n입시전문가가 분석을 시작합니다.'
  }
  buttonText="신청"
  cancelText="취소"
  onClick={() => {
    setIsConfirmOpen(false)
    sessionStorage.removeItem('hakjong_apply_form')
    router.push('/hakjong/report')
  }}
  onClose={() => setIsConfirmOpen(false)}
/>`}
        />
        <DataTable
          headers={['처리', '이유']}
          rows={[
            ['sessionStorage.removeItem()', '임시 저장 데이터를 정리해 다음 신청과 충돌 방지'],
            ['router.push()', '최종 제출 후 리포트 페이지로 이동'],
            ['문자열 안의 \n', 'Modal 내부 줄바꿈 표시용'],
          ]}
        />
      </StepCard>

      <StepCard phase={6} num="28" id="step28" title="추후 확정 API 연동 패턴">
        <p>
          확정 API가 준비되면 Phase 4에서 했던 것과 동일하게 <strong>타입 → API 함수 → mutation 훅 → 컴포넌트</strong> 순서로 연결합니다.
        </p>
        <FlowDiagram>{`1. hakjong.types.ts
   ConfirmRequest / ConfirmResponse 타입 추가

2. api/index.ts
   confirmHakjongApply 함수 추가

3. hakjong.queries.ts
   useHakjongConfirmMutation 추가

4. EarlyHakjongConfirm.tsx
   mutateAsync 연결 + isPending 로딩 처리`}</FlowDiagram>
        <CodeBlock
          lang="typescript"
          code={`const { mutateAsync: confirmApply, isPending } = useHakjongConfirmMutation()

<ConfirmModal
  isOpen={isConfirmOpen}
  isLoading={isPending}
  onClick={async () => {
    await confirmApply({ applyId })
    setIsConfirmOpen(false)
    sessionStorage.removeItem('hakjong_apply_form')
    router.push('/hakjong/report')
  }}
/>`}
        />
        <Callout variant="key">
          <IC>isPending</IC>를 연결하면 네트워크가 느릴 때 중복 클릭을 막고,
          사용자에게 "지금 처리 중"이라는 피드백을 줄 수 있습니다.
        </Callout>
      </StepCard>
    </section>
  )
}
