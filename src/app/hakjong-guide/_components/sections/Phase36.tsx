import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase36() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={36} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          교과 성적이 다 입력됐는데도 "입력 완료해 주세요" alert이 떴다.
          검증 로직이 화면 뱃지와 <strong>다른 기준</strong>으로 완료를 판정하고 있었기 때문.
        </p>
      </div>

      <StepCard phase={36} num={137} id="step137" title="처음 짠 (틀린) 코드 — !== '입력'">
        <CodeBlock
          lang="typescript"
          code={`// ❌ 완료 = entered 가 정확히 '입력' 일 때만
const isGradeIncomplete = requiredSemesters.some(
  (semester) =>
    gradeStatusData?.find((g) => g.semester === semester)?.entered !== '입력',
);`}
        />
        <p>
          이 코드는 "<IC>entered</IC>가 <IC>{"'입력'"}</IC>이 아니면 미완료"라고 본다.
          그런데 서버는 완료 학기에 <IC>{"'입력'"}</IC>이 아닌 다른 값(예: 과목 수 <IC>{'"4"'}</IC>)을 줄 수도 있다 →
          완료인데도 <IC>{"!== '입력'"}</IC>이 참 → 잘못 막힘.
        </p>
      </StepCard>

      <StepCard phase={36} num={138} id="step138" title="진실의 원천 — 화면 뱃지가 쓰는 규칙">
        <p>
          <IC>ui/common/BadgeButton.tsx</IC>를 보면 완료/미완료를 <strong>단 하나의 기준</strong>으로만 나눈다:
        </p>
        <CodeBlock
          lang="tsx"
          code={`const isNotEntered = entered === '미입력'; // 이것만 본다`}
        />
        <p>
          즉 화면은 <strong>"<IC>{"'미입력'"}</IC>이면 미완료, 그 외 전부 완료"</strong>. 검증도 이 규칙에 맞춰야 화면과 어긋나지 않는다.
        </p>
      </StepCard>

      <StepCard phase={36} num={139} id="step139" title="화면과 일치시킨 (맞는) 코드 — === '미입력'">
        <CodeBlock
          lang="typescript"
          code={`const isGradeIncomplete = requiredSemesters.some((semester) => {
  const item = gradeStatusData?.find((g) => g.semester === semester);
  return !item || item.entered === '미입력'; // 항목이 없거나 '미입력'이면 미완료
});`}
        />
        <p><IC>!item</IC>도 미완료로 본다(필수 학기가 응답에 아예 없으면 입력 안 된 것).</p>
      </StepCard>

      <StepCard phase={36} num={140} id="step140" title='"최소 1개" 조건은 !some(...) 으로'>
        <p>
          모의고사는 "4개 중 1개만 입력돼도 통과". 이건 <IC>some</IC>과 <IC>!</IC>의 조합으로 깔끔하게 표현한다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`// 하나라도 입력됨? → some(입력됨). 앞에 ! → "전부 미입력일 때만 true"
const isMockIncomplete = !mockStatusData?.some((m) => m.entered !== '미입력');`}
        />
        <p>
          처음엔 <IC>entered</IC> 값으로 순회하면서 다시 <IC>entered</IC>로 <IC>find</IC>하는 자기참조 버그가 있었다
          (식별자 <IC>exam</IC>과 상태 <IC>entered</IC>를 혼동).
          <strong> "무엇을 순회하고(목록), 무엇으로 판정하는지(상태)"를 분리</strong>해서 생각하면 안 헷갈린다.
        </p>
      </StepCard>

      <StepCard phase={36} num={141} id="step141" title="비교과 — 빈 객체({})·undefined 방어 + as const 인덱싱">
        <p>
          비교과는 학년별 C/H/S 9개 필드(<IC>Grade_1_C</IC> …).
          처음엔 <IC>=== 0</IC>으로 미완료를 봤는데, <strong>데이터가 비면(<IC>{'{}'}</IC>/<IC>undefined</IC>) 못 막는 구멍</strong>이 있었다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`({})['Grade_1_C'] === 0; // undefined === 0 → false → "완료"로 오판`}
        />
        <p>
          화면(<IC>AdmissionScoreStatus.tsx</IC>)이 완료를 <strong><IC>값 === 4</IC></strong>로 보므로,
          검증도 <IC>!== 4</IC>로 맞추면 빈 데이터도 자동으로 미완료가 된다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`const isExtracurricularIncomplete = requiredGrades.some((grade) =>
  (['C', 'H', 'S'] as const).some(
    (type) => extracurricularStatusData?.[\`Grade_\${grade}_\${type}\`] !== 4,
  ),
);`}
        />
        <Callout variant="key">
          <strong><IC>as const</IC>가 핵심.</strong> <IC>requiredGrades</IC>와 <IC>{"['C','H','S']"}</IC>에 <IC>as const</IC>를 붙이면
          <IC>grade</IC>가 <IC>{"1|2|3"}</IC>, <IC>type</IC>이 <IC>{"'C'|'H'|'S'"}</IC>로 좁혀져,
          템플릿 리터럴 키 <IC>{"`Grade_${grade}_${type}`"}</IC>가 <strong>타입 안전하게 9개 실제 필드로</strong> 해석된다.
          <IC>as const</IC>가 없으면 <IC>any</IC>가 되어 인덱싱 에러(<IC>7053</IC>)가 난다.
        </Callout>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-orange-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>완료/상태 판정 기준은 반드시 "그 데이터를 화면에 그리는 컴포넌트"와 일치시켜라.</strong>{' '}
          화면은 <IC>{"=== '미입력'"}</IC>, 검증은 <IC>{"!== '입력'"}</IC>이면 둘이 어긋나 "화면은 입력됨인데 제출은 막힘" 같은 버그가 난다.
        </Callout>
        <Callout variant="key">
          <strong><IC>=== 0</IC> 같은 "특정 값" 비교는 값이 없는 경우(<IC>undefined</IC>)를 못 잡는다.</strong>{' '}
          "완료값과 같은가?"(<IC>=== 4</IC>)로 뒤집으면 누락·빈 데이터까지 자연스럽게 미완료로 처리된다.
        </Callout>
        <Callout variant="key">
          <strong>규칙적인 반복 키(<IC>{'Grade_{학년}_{유형}'}</IC>)는 <IC>as const</IC> + 템플릿 리터럴로 타입 안전하게 순회</strong>할 수 있다.
        </Callout>
      </div>
    </section>
  )
}
