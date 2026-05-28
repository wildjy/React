import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase17() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={17} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          Apply 페이지를 단일 훅으로 정리한 뒤(Phase 16), 같은 정신을 Confirm(신청 내용 최종 확인) 페이지에도 적용합니다.
          Confirm은 <strong>읽기 전용 표시</strong>가 핵심입니다 — sessionStorage 스냅샷을 읽어 화면에 보여주고, 제출 모달만 띄웁니다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7">
          복원 <IC>useEffect</IC> + 13개 <IC>useState</IC>(userId, universityName, ... simpleQuestion)가 페이지에 그대로 박혀 있던 걸
          <IC>useAdmissionEvaluationConfirmSummary</IC> 훅으로 분리합니다.
        </p>
      </div>

      <StepCard phase={17} num={54} id="step54" title="읽기 전용 스냅샷 요약 훅">
        <p>핵심 아이디어: <strong>스냅샷 → 표시용 상태로의 매핑</strong>만 담당하는 훅을 만듭니다.</p>
        <CodeBlock
          lang="typescript"
          path="entities/admission-evaluation/model/useAdmissionEvaluationConfirmSummary.ts"
          code={`export const useAdmissionEvaluationConfirmSummary = () => {
  const isMobile = useAppSelector((s) => s.common.isMobile);
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();

  // 스냅샷에서 복원되는 표시용 상태들
  const [userId, setUserId] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  // ...

  useEffect(() => {
    const raw = sessionStorage.getItem(ADMISSION_EVALUATION_STORAGE_KEY.applyForm);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<AdmissionEvaluationApplyFormSnapshot>;
    setUserId(saved.userId ?? '');
    setSelectedCards(saved.selectedCards ?? []);
    // ...
  }, []);

  return { userId, isMobile, gradeStatusData, mockStatusData, selectedCards, /* ... */ };
};`}
        />
        <p>
          <IC>{'Partial<AdmissionEvaluationApplyFormSnapshot>'}</IC>로 타입을 단언하는 점이 Apply의 복원 effect와 다릅니다 —
          외부 storage에서 온 값이라 일부 필드가 없을 수도 있다는 의도를 명시합니다.
        </p>
      </StepCard>

      <StepCard phase={17} num={55} id="step55" title="함정 — 단 3개 값 때문에 Apply 폼 훅 전체를 호출">
        <p>리뷰 중 발견한 실수입니다.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ Confirm 요약 훅이 Apply 폼 훅을 통째로 호출
export const useAdmissionEvaluationConfirmSummary = () => {
  const { isMobile, gradeStatusData, mockStatusData } =
    useAdmissionEvaluationApplyForm();
  // ...
};`}
        />
        <p>
          3개 값만 쓰고 싶었던 건데, <IC>useAdmissionEvaluationApplyForm()</IC>을 부르면 그 안에서
          <strong> 이 페이지엔 전혀 필요 없는 것들이 다 돌아갑니다.</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><IC>useApplyDropOptions()</IC> → 대학 목록·선호 전공/지역 <strong>쿼리 자동 실행</strong></li>
          <li><IC>useAdmissionEvaluationApplyMutation()</IC> → 제출 mutation 셋업</li>
          <li>그 훅의 <strong>복원 <IC>useEffect</IC> 실행</strong> → <IC>setSelectedOption(...)</IC> + <IC>onUnivChangeFetch(...)</IC> 호출로 <strong>계열·학과 list 네트워크 요청</strong>까지 발사 (Confirm은 이 데이터를 쓰지 않음)</li>
        </ul>
        <p>즉, Confirm 페이지 진입만으로 안 쓰는 API가 줄줄이 호출되고, Apply 폼의 부수 효과(복원 effect)까지 의도치 않게 일어납니다.</p>
      </StepCard>

      <StepCard phase={17} num={56} id="step56" title="해결 — 필요한 만큼만 의존한다">
        <p>
          <IC>gradeStatusData</IC>/<IC>mockStatusData</IC>는 React Query 캐시 공유로 비용이 거의 없고(Apply에서 같은 queryKey로 이미 캐싱),
          <IC>isMobile</IC>은 redux selector 한 줄입니다. <strong>직접 부르면 됩니다.</strong>
        </p>
        <CodeBlock
          lang="typescript"
          code={`// ✅ 필요한 3개만 직접 가져오기
const isMobile = useAppSelector((state) => state.common.isMobile);
const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();`}
        />
        <Callout variant="key">
          <strong>교훈 (의존성 최소화):</strong> "이 훅이 반환하는 값 중 일부만 필요하다"는 신호가 보이면,
          그 훅 전체를 부르지 말고 <strong>그 일부의 출처를 직접 부르세요.</strong>
          훅은 호출하는 순간 그 안의 모든 side effect(쿼리 자동 실행, useEffect, mutation 셋업)가 함께 따라옵니다.
          같은 React Query queryKey는 어디서 불러도 캐시를 공유하므로 중복 호출 걱정은 안 해도 됩니다.
        </Callout>
      </StepCard>

      <StepCard phase={17} num={57} id="step57" title="그 외 정리 거리 (선택)">
        <p>리뷰에서 함께 발견한 작은 문제들:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>응집도</strong> — <IC>isConfirmOpen</IC>(제출 모달 토글)이 요약 훅에 있는데, 정작 제출 로직(<IC>sessionStorage</IC> 정리 + <IC>router.push</IC>)은 페이지에 있습니다.
            책임이 갈리면 추적이 어려워지므로, 모달 상태는 페이지의 <IC>useState</IC>로 두는 게 더 자연스럽습니다.
          </li>
          <li>
            <strong>죽은 주석</strong> — 옛 필드(<IC>setSelfIntroduction</IC> 등) 주석은 즉시 제거(CLAUDE.md: no dead code).
          </li>
          <li>
            <strong><IC>comparativeExtraInfo</IC> 편집 가능 여부</strong> — "최종 확인" 페이지인데 비교과 입력란이 수정 가능합니다.
            의도라면 OK, 아니라면 <IC>AdmissionScoreStatus</IC>에 읽기 전용 모드로 전환.
          </li>
        </ul>
      </StepCard>
    </section>
  )
}
