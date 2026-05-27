import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase16() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={16} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          Phase 8에서 로직을 여러 작은 훅(<IC>useApplyDropOptions</IC>, <IC>useAdmissionEvaluationHandler</IC>)으로 <strong>분리</strong>했습니다.
          하지만 페이지에는 여전히 그 훅들의 호출 + 폼 입력 상태(<IC>useState</IC> 5개) + sessionStorage 복원 <IC>useEffect</IC> + <IC>handleSubmit</IC>이 ~180줄 남아 있었습니다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7">
          <IC>handleSubmit</IC>(폼 → 스냅샷 저장)과 복원 <IC>useEffect</IC>(스냅샷 → 폼)는 사실 <strong>같은 스냅샷의 쓰기/읽기 양면</strong>이라,
          함께 묶을 명분이 강했습니다.
        </p>
      </div>

      {/* Step 53 */}
      <StepCard phase={16} num={53} id="step53" title='작은 훅들을 "합성(composition)"한 상위 훅'>
        <p>기존 훅을 지우지 않고, 새 훅이 <strong>내부에서 호출해 합칩니다.</strong> 페이지는 이 훅 하나만 부릅니다.</p>
        <CodeBlock
          lang="typescript"
          path="entities/admission-evaluation/model/useAdmissionEvaluationApplyForm.ts"
          code={`export const useAdmissionEvaluationApplyForm = () => {
  // 1) 데이터/인프라 훅 내부 호출
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { mutateAsync: submitApply, isPending } = useAdmissionEvaluationApplyMutation();

  // 2) 기존 작은 훅을 합성
  const dropOptions = useApplyDropOptions();
  const handler = useAdmissionEvaluationHandler();

  // 3) 폼 입력 상태 소유 + 복원 useEffect + handleSubmit ...

  return {
    ...dropOptions,   // 옵션 + cascade
    ...handler,       // 선택 상태 + 카드 + 모달
    /* 폼 상태, handleSubmit, isPending ... */
  };
};`}
        />
        <p>결과적으로 페이지는 <strong>훅 1개 호출 + JSX</strong>만 남아 순수 프레젠테이션 컴포넌트가 됩니다.</p>
        <CodeBlock
          lang="tsx"
          code={`export const EarlyAdmissionEvaluationApply = () => {
  const { selectedOption, handleSubmit, isPending, /* ... */ } =
    useAdmissionEvaluationApplyForm();
  return ( /* JSX */ );
};`}
        />
      </StepCard>

      {/* 분리 vs 통합 */}
      <div id="phase16-split-vs-merge" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ⚖
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">"분리(Phase 8)"와 "통합(Phase 16)"은 모순이 아니다</h4>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-3">
          <li><strong>Phase 8:</strong> 컴포넌트에서 <strong>로직 덩어리</strong>를 작은 훅으로 빼냄(관심사 분리).</li>
          <li><strong>Phase 16:</strong> 그 작은 훅들을 <strong>합성</strong>해 페이지용 단일 진입점을 만듦.</li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7">
          작은 훅은 building block으로 남아 재사용·테스트가 가능하고, 상위 훅은 그것들을 엮어 페이지가 한 번에 쓰게 합니다.
          분리한 걸 다시 합치는 게 아니라, <strong>계층을 쌓는 것</strong>입니다.
        </p>
      </div>

      {/* 트레이드오프 */}
      <div id="phase16-tradeoff" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ⚠
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">트레이드오프 — god-hook 경계</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          <IC>...dropOptions</IC>/<IC>...handler</IC> 스프레드는 간결하지만, 한 훅이 너무 많은 책임을 흡수하면 "god-hook"이 됩니다.
          이 프로젝트에선 <strong>소비자가 이 페이지 하나뿐</strong>이라 단일 훅이 합리적이었습니다.
          같은 selector/폼이 여러 페이지에서 쓰이기 시작하면, 그때는 합성 훅 대신 Context나 더 작은 훅 단위로 다시 쪼개는 게 맞습니다.
        </p>
        <Callout variant="key">
          <strong>판단 기준:</strong> "이 묶음을 쓰는 곳이 하나인가, 여럿인가?" 하나면 합성 훅으로 응집, 여럿이면 공유 메커니즘(Context 등)으로 분산.
          규모에 맞는 추상화를 고르세요(CLAUDE.md: premature abstraction 금지).
        </Callout>
      </div>
    </section>
  )
}
