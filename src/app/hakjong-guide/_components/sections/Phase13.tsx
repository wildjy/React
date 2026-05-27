import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase13() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={13} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경: 페이지가 너무 많은 일을 알고 있었다</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          신청 페이지(<IC>EarlyAdmissionEvaluationApply.tsx</IC>)가 <IC>UnivMajorSelector</IC>에 11개의 prop을 내려주고 있었는데,
          가장 큰 문제는 <strong>JSX 안에 인라인으로 박힌 핸들러 조합 로직</strong>이었습니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// ❌ 페이지가 selector의 내부 동작 규칙까지 직접 조립
<UnivMajorSelector
  universityHandler={(option) => {
    handleSelectedChange('drop1', option);
    handleSelectedChange('drop2', { value: '', label: '' }); // 하위 초기화
    handleSelectedChange('drop3', { value: '', label: '' });
    onUnivChangeFetch(option.value);                         // cascade 재조회
  }}
  aibdPartsHandler={(option) => { ... }}
  // ...
/>`}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-3">
          "대학을 바꾸면 계열·학과를 비우고 그 대학의 계열을 다시 받아온다"는 규칙은 <strong>selector 고유의 내부 규칙</strong>입니다.
          페이지(window 레이어)가 이걸 알고 조립하는 건 책임이 잘못 놓인 것입니다.
        </p>
      </div>

      {/* Step 49 */}
      <StepCard phase={13} num={49} id="step49" title='조합 로직을 컴포넌트 내부로 — 페이지는 "원시 도구"만 전달'>
        <p>페이지는 setter와 cascade 함수 같은 <strong>원시 도구</strong>만 넘기고, 그것을 조합하는 일은 컴포넌트가 합니다.</p>
        <CodeBlock
          lang="tsx"
          code={`// ✅ 페이지: 원시 도구만 전달
<UnivMajorSelector
  selectedOption={selectedOption}
  onSelectedChange={handleSelectedChange}   // 단순 setter
  onUnivChangeFetch={onUnivChangeFetch}     // cascade 함수
  onMajorTypeChange={onMajorTypeChange}
  selectedCards={selectedCards}
  onAddCard={handleAddCard}
  onDeleteCard={handleDeleteCard}
/>`}
        />
        <CodeBlock
          lang="tsx"
          code={`// ✅ UnivMajorSelector 내부: 조합 규칙이 여기에 산다
const handleUniversityChange = (option: StringDropDownOption) => {
  onSelectedChange('drop1', option);
  onSelectedChange('drop2', EMPTY_OPTION);
  onSelectedChange('drop3', EMPTY_OPTION);
  onUnivChangeFetch(option.value);
};`}
        />
        <Callout variant="key">
          <strong>핵심 원칙:</strong> "이 규칙을 아는 게 누구의 책임인가?"를 물어보세요.
          화면 한 조각의 내부 동작 규칙은 그 컴포넌트가 알아야 하고, 페이지는 데이터와 단순 setter만 내려주면 됩니다.
        </Callout>
      </StepCard>

      {/* Step 50 */}
      <StepCard phase={13} num={50} id="step50" title="반복되는 UI는 서브컴포넌트로">
        <p>
          "선호 정보 입력"은 <IC>라벨 + DropDown + 선택값</IC> 블록이 4번(전공 1·2지망, 지역 1·2지망) 복붙돼 있었습니다.
          차이가 (제목, 필수/선택, 옵션, 바인딩 키)뿐이라, 그 차이만 prop으로 받는 내부 서브컴포넌트로 묶습니다.
        </p>
        <FlowDiagram>{`PreferInfoSelector (컨테이너)
  └─ PreferSection (전공/지역 한 줄)
       └─ PreferDropDown (단일 드롭다운 + 라벨)  ← 4번 재사용`}</FlowDiagram>
        <p>
          같은 방식으로 "강조하고 싶은 내용"의 3개 Textarea도 <IC>EmphasisActivityInput</IC> + 재사용 가능한 <IC>ActivityTextarea</IC>로
          분리했습니다(간단 질문 입력란도 같은 서브컴포넌트 재사용).
        </p>
        <Callout variant="tip">
          <strong>언제 서브컴포넌트로 빼나?</strong> 동일한 마크업이 2~3번 이상 반복되고, 차이가 몇 개의 값으로 표현될 때.
          차이를 prop으로 받는 작은 컴포넌트 하나가 복붙 4개보다 안전합니다.
        </Callout>
      </StepCard>

      {/* Step 51 */}
      <StepCard phase={13} num={51} id="step51" title="FSD 상향 import 금지 — 컴포넌트의 올바른 레이어">
        <p>
          <IC>UnivMajorSelector</IC>는 <IC>entities/</IC>에 있으면서 <IC>modules/</IC>의 <IC>UnivMajorDropDownGroup</IC>을 import하고 있었습니다.
          이는 FSD 규칙 위반입니다.
        </p>
        <Callout variant="info">
          <strong>FSD 레이어 방향:</strong> <IC>app → entities → modules → window</IC>. 위에서 아래로만 import할 수 있고,
          <strong> 아래(entities)가 위(modules)를 import하면 안 됩니다(상향 의존 금지).</strong>
        </Callout>
        <p>
          해결: <IC>UnivMajorSelector</IC>를 <IC>modules/</IC>로 옮겨 같은 레이어에서 조합하게 했습니다.
          import 흐름이 정방향(<IC>entities</IC>의 타입/훅 → <IC>modules</IC>의 컴포넌트 → <IC>window</IC>의 페이지)으로만 흐릅니다.
        </p>
        <p>
          <strong>연쇄로 발견된 문제 — 공유 컴포넌트의 위치:</strong> <IC>RequiredBadge</IC>가 페이지(window) 파일에 정의돼 있어서,
          modules 컴포넌트가 쓰면 또 상향 import가 됩니다. 그래서 공유 UI(<IC>@libs/ui/Flag</IC>)로 끌어내려 양쪽이 정방향으로 import하게 했습니다.
        </p>
        <Callout variant="key">
          <strong>교훈:</strong> 한 컴포넌트를 옮기면 그게 의존하던 작은 조각(여기선 배지)도 같이 레이어를 재검토해야 합니다.
          "누가 import하는가"가 그 조각이 어디 있어야 하는지를 알려줍니다.
        </Callout>
      </StepCard>

      {/* Step 52 */}
      <StepCard phase={13} num={52} id="step52" title="분리하면서 dead code도 함께 제거">
        <p>
          리팩토링 중 페이지가 <IC>useAdmissionEvaluationHandler</IC>에서 <IC>setSelectedCards</IC>를 구조분해하지만
          <strong> 어디서도 안 쓰는</strong> 걸 발견했습니다(카드 추가/삭제는 핸들러가 내부에서 처리). 즉시 제거했습니다.
        </p>
        <Callout variant="info">
          <strong>리팩토링은 dead code를 드러낸다:</strong> prop과 구조분해를 정리하다 보면 "받기만 하고 안 쓰는 값"이 보입니다.
          이때 바로 지우는 게 CLAUDE.md의 "dead code 즉시 삭제" 원칙입니다.
        </Callout>
      </StepCard>

      {/* 무엇을 옮기지 못하는가 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">무엇을 옮기지 <em>못하는가</em> — 공유 상태는 페이지에 남는다</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          selector로 다 내리고 싶어도, <IC>selectedOption</IC>·<IC>selectedCards</IC>·<IC>onUnivChangeFetch</IC>는
          <strong> handleSubmit과 복원 로직도 함께 쓰는 공유 상태</strong>라 페이지(또는 상위 훅)가 들고 있어야 합니다.
          자식에게 내려주는 건 "상태 끌어올리기(lifting state up)"라는 정상 패턴이지, 군더더기가 아닙니다.
        </p>
      </div>
    </section>
  )
}
