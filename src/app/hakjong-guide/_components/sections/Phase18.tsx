import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase18() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={18} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          희망 대학/학과는 카드 여러 장(<IC>{'selectedCards: SelectedCard[]'}</IC>)으로 추가할 수 있는데,
          <strong> 스냅샷에는 단일 필드</strong>(<IC>universityName</IC>, <IC>majorTypeName</IC>, <IC>minorMajorCategoryName</IC>)밖에 없었습니다.
          그래서 Confirm 페이지에서 복수로 노출하려면 데이터를 어딘가에 더 담아야 했습니다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7">
          서버 전송 페이로드(<IC>majorIdHsbs</IC>)는 카드의 학과 ID만 배열로 보내므로 표시용 라벨이 사라집니다 →
          스냅샷(표시·복원 전용)에 라벨까지 보관해야 합니다.
        </p>
      </div>

      <StepCard phase={18} num={58} id="step58" title="시도 — 단일 필드에 comma-join">
        <p>처음엔 단일 필드에 카드의 값을 <IC>,</IC>로 합쳐 넣고, Confirm에서 <IC>split(',')</IC>으로 분해하는 방식을 시도했습니다.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ handleSubmit
universityName: handler.selectedCards.map((c) => c.options.drop1.label).join(','),
majorTypeName:  handler.selectedCards.map((c) => c.options.drop2.label).join(','),
minorMajorCategoryName: handler.selectedCards.map((c) => c.options.drop3.label).join(','),`}
        />
        <CodeBlock
          lang="typescript"
          code={`// ❌ Confirm 훅: split해서 string[] 3개
setUniversityName(saved.universityName?.split(',') ?? []);
setMajorTypeName(saved.majorTypeName?.split(',') ?? []);
setMinorMajorCategoryName(saved.minorMajorCategoryName?.split(',') ?? []);`}
        />
        <p className="font-semibold text-gray-800 mt-2">두 가지 문제가 함께 발생합니다.</p>
        <Callout variant="warn">
          <strong>문제 ①: 카드 단위 짝이 깨진다.</strong> 카드는 <IC>(대학·계열·학과)</IC> 세 값이 한 묶음입니다.
          위 방식은 세 필드를 각각 join하고 split하므로, 표시 시 인덱스로 짝을 다시 맞춰야 합니다
          (<IC>uni[0]+mt[0]+mc[0]</IC>, <IC>uni[1]+mt[1]+mc[1]</IC>…). 라벨에 쉼표가 들어가는 순간(예: "○○대학교, 분교")
          인덱스가 어긋나 짝이 영원히 망가집니다.
        </Callout>
        <Callout variant="warn">
          <strong>문제 ②: 단일 필드의 의미가 오염되어 "수정하기 복원"이 망가진다.</strong>{' '}
          <IC>universityId</IC>/<IC>universityName</IC> 같은 단일 필드는 원래 <strong>Apply의 드롭다운 복원용</strong>입니다.
          Apply 복원 effect는 이렇게 동작합니다.
        </Callout>
        <CodeBlock
          lang="typescript"
          code={`setSelectedOption({
  drop1: { value: saved.universityId, label: saved.universityName },
  // ...
});
onUnivChangeFetch(saved.universityId);  // ← 단일 코드 기대`}
        />
        <p>
          여기에 <IC>universityId = "101,102,103"</IC>(comma-join) 같은 값이 들어가면
          드롭다운 라벨이 "서울대,연세대"가 되고, cascade fetch는 <IC>univCode = "101,102,103"</IC>을 서버에 보내 깨집니다.
        </p>
      </StepCard>

      <StepCard phase={18} num={59} id="step59" title="해결 — 구조화 배열로 분리">
        <p><strong>표시(복수 카드)와 복원(드롭다운 단일 값)은 목적이 다르므로, 둘을 분리해서 저장합니다.</strong></p>
        <p>스냅샷 타입에 카드 배열을 추가합니다:</p>
        <CodeBlock
          lang="typescript"
          path="admission-evaluation.types.ts"
          code={`export interface AdmissionEvaluationApplyFormSnapshot extends AdmissionEvaluationApplyRequest {
  // 희망 대학 리스트(복수 카드) — Confirm 복수 표시 + 수정하기 복원
  selectedCards: SelectedCard[];
  // 제출 시점의 단일 드롭다운 선택값 — 수정하기 시 드롭다운/cascade 복원용
  universityId: string;
  universityName: string;
  majorType: string;
  majorTypeName: string;
  // ...
}`}
        />
        <p>handleSubmit은 <strong>둘 다</strong> 저장합니다:</p>
        <CodeBlock
          lang="typescript"
          code={`const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  selectedCards: handler.selectedCards,   // ← 구조화 배열 (라벨 포함)
  universityId: drop1.value,              // ← 단일 값 (드롭다운 복원용)
  universityName: drop1.label,
  // ...
};`}
        />
        <p>Confirm 훅은 <IC>selectedCards</IC>만 복원해서 그대로 렌더에 넘기고, Apply 복원 effect는 단일 필드로 드롭다운을 복원합니다.</p>
        <CodeBlock
          lang="tsx"
          code={`{/* Confirm 페이지 — 카드를 카드답게 렌더 */}
{selectedCards.map((card) => (
  <div key={card.id} className="p-4 ...">
    <p>대학: <strong>{card.options.drop1.label}</strong></p>
    <p>계열: <strong>{card.options.drop2.label}</strong></p>
    <p>학과: <strong>{card.options.drop3.label}</strong></p>
  </div>
))}`}
        />
      </StepCard>

      <StepCard phase={18} num={60} id="step60" title="보너스 — 수정하기 시 카드도 복원">
        <p>
          기존 Apply 복원 effect는 단일 드롭다운만 복원하고 <strong>카드 리스트는 통째로 잃어버리고</strong> 있었습니다.
          스냅샷에 <IC>selectedCards</IC>가 생긴 김에 함께 복원합니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`// Apply 복원 effect (한 줄 추가)
handler.setSelectedCards(saved.selectedCards ?? []);`}
        />
        <p>이제 사용자가 카드를 6장 추가 → 제출 → Confirm → "수정하기"로 돌아와도 카드 6장이 그대로 살아 있습니다.</p>
      </StepCard>

      {/* 데이터 모델링 한 줄 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            💡
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">데이터 모델링 한 줄 교훈</h4>
        </div>
        <Callout variant="key">
          <strong>표시(structured) 목적과 복원(single) 목적이 다르면, 같은 필드 하나에 둘을 우겨넣지 말고 따로 저장하라.</strong>{' '}
          "단일 필드를 join/split해서 다목적으로 쓰자"는 유혹은 짧게는 동작하지만,
          라벨에 쉼표가 들어오는 순간 / 의미가 오염되어 다른 흐름(여기선 복원·cascade)을 망가뜨리는 순간 부러집니다.
          <strong> 필요한 모양 그대로 저장하세요.</strong>
        </Callout>
      </div>

      {/* 정리: 카드 라이프사이클 */}
      <div id="phase18-lifecycle" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">정리: 카드 라이프사이클</h4>
        </div>
        <FlowDiagram>{`Apply 추가 → handler.selectedCards (구조화 배열)
  ↓ handleSubmit
스냅샷(sessionStorage): selectedCards (구조화) + 단일 드롭다운 값
  ├→ Confirm: selectedCards 복원 → 카드별로 렌더
  └→ Apply 수정하기: selectedCards 복원 → 카드 그대로 + 단일 필드로 드롭다운 복원`}</FlowDiagram>
      </div>
    </section>
  )
}
