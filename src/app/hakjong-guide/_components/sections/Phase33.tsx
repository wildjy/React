import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase33() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={33} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">Phase 29에서 만든 페이지 가드:</p>
        <CodeBlock
          lang="typescript"
          code={`ensureAdmissionEvaluationAccess(options?: {
  redirectIfNotCompleted?: boolean;   // → INTRO (Report 페이지)
  redirectIfCompleted?: boolean;      // → REPORT (Apply/Confirm)
});`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          여기서 <IC>{'redirectIfNotCompleted: true'}</IC>는 "미완료면 INTRO로 보낸다" — <strong>destination이 함수 안에 하드코딩</strong>돼 있다.
        </p>
        <p className="font-semibold text-gray-800 mt-2">새 요구사항이 들어왔다:</p>
        <Callout variant="info">
          "Confirm 페이지로 URL 직타 진입할 때 신청 미완료면 <IC>/apply</IC>로 보내달라."
        </Callout>
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          문제: 같은 "미완료" 조건이지만 페이지마다 가야 할 곳이 다름.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>Report 페이지: 미완료 → <strong>INTRO</strong> (애초에 보면 안 됨, 도입부로)</li>
          <li>Confirm 페이지: 미완료 → <strong>APPLY</strong> (신청부터 하라고 입력 페이지로)</li>
          <li>Apply 페이지: 미완료 → 통과 (여기서 신청 시작)</li>
        </ul>
      </div>

      <StepCard phase={33} num={123} id="step123" title="함정 — boolean 옵션을 늘리기">
        <p>직관적인 시도:</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 옵션 폭증
options?: {
  redirectToIntroIfNotCompleted?: boolean;
  redirectToApplyIfNotCompleted?: boolean;
  redirectIfCompleted?: boolean;
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">호출:</p>
        <CodeBlock
          lang="typescript"
          code={`// Report 페이지
ensureAdmissionEvaluationAccess({ redirectToIntroIfNotCompleted: true });

// Confirm 페이지
ensureAdmissionEvaluationAccess({
  redirectToApplyIfNotCompleted: true,
  redirectIfCompleted: true,
});`}
        />
        <p className="font-semibold text-gray-800 mt-2">문제점:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>destination이 추가될 때마다 옵션 수가 곱빼기로 증가 (INTRO/APPLY/REPORT/SETTINGS...)</li>
          <li>두 옵션이 동시에 true면 어떻게? — 모호함 → 함수 안에 우선순위 처리 코드 필요</li>
          <li>옵션 이름이 길어져 자동완성 시 구분 어려움</li>
        </ul>
        <p className="mt-2">옵션 폭증은 <strong>함수가 호출자의 분기를 대신 떠안았을 때</strong> 자주 일어난다.</p>
      </StepCard>

      <StepCard phase={33} num={124} id="step124" title="더 나은 답 — 옵션 값을 destination 자체로">
        <CodeBlock
          lang="typescript"
          code={`// ✅ 옵션 1개, 값으로 행선지 표현
options?: {
  redirectIfNotCompleted?: 'INTRO' | 'APPLY';
  redirectIfCompleted?: boolean;
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">함수 본문:</p>
        <CodeBlock
          lang="typescript"
          code={`if (options?.redirectIfNotCompleted && !isApplyCompleted) {
  redirect(ADMISSION_EVALUATION_PATH[options.redirectIfNotCompleted]);
  //                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                  옵션 값이 곧 path 키
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">호출:</p>
        <CodeBlock
          lang="typescript"
          code={`// Report
ensureAdmissionEvaluationAccess({ redirectIfNotCompleted: 'INTRO' });

// Confirm
ensureAdmissionEvaluationAccess({
  redirectIfNotCompleted: 'APPLY',
  redirectIfCompleted: true,
});

// Apply — 옵션 자체를 안 줌
ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });`}
        />
      </StepCard>

      <StepCard phase={33} num={125} id="step125" title="이 패턴이 좋은 이유">
        <DataTable
          headers={['측면', 'boolean 여러 개', '값 enum 하나']}
          rows={[
            ['옵션 개수', 'destination 수만큼 증가', '1개 고정'],
            ['destination 추가 비용', '새 옵션 추가 + 함수 본문 분기 추가', 'union에 한 단어 추가'],
            ['"둘 다 true" 모호함', '우선순위 정의 필요', '발생 불가 (값은 하나만 가능)'],
            ['옵션 이름 길이', '길어짐', '짧고 깔끔'],
            ['TypeScript 자동완성', '옵션 6개 보임', '값 2개 보임'],
          ]}
        />
        <Callout variant="key">
          핵심 통찰: <strong>"옵션 켜고 끄기"가 아니라 "옵션 값을 무엇으로 둘지"가 의도일 때 enum 값</strong>.
        </Callout>
      </StepCard>

      <StepCard phase={33} num={126} id="step126" title="TypeScript 안전 인덱싱">
        <CodeBlock
          lang="typescript"
          code={`redirect(ADMISSION_EVALUATION_PATH[options.redirectIfNotCompleted]);`}
        />
        <p>
          <IC>options.redirectIfNotCompleted</IC>의 타입이 <IC>{"'INTRO' | 'APPLY'"}</IC>로 좁혀져 있어:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>ADMISSION_EVALUATION_PATH</IC>에 두 키 모두 있어야 컴파일 통과</li>
          <li>새 destination 추가 시 path 객체에 키 빼먹으면 컴파일 에러</li>
          <li>오타 방지</li>
        </ul>
        <CodeBlock
          lang="typescript"
          code={`export const ADMISSION_EVALUATION_PATH = {
  INTRO: '.../admission-evaluation/intro',
  APPLY: '.../admission-evaluation/apply',
  REPORT: '.../admission-evaluation/report',
} as const;`}
        />
        <p><IC>as const</IC>로 잠가 두면 키 누락이 컴파일 단계에서 잡힘.</p>
      </StepCard>

      <StepCard phase={33} num={127} id="step127" title="호출자가 destination을 안다 vs 함수가 destination을 안다">
        <p>이건 더 큰 설계 원칙:</p>
        <DataTable
          headers={['', '함수가 안다 (boolean)', '호출자가 안다 (enum)']}
          rows={[
            ['호출 코드', <IC key="a">{'{ foo: true }'}</IC>, <><IC key="b">{"{ foo: 'APPLY' }"}</IC> (의도 명시)</>],
            ['함수 본문', '분기로 destination 결정', '그냥 받은 값을 사용'],
            ['정책 변경', '함수 본문 수정', '호출 한 곳만 수정'],
            ['결정 위치', '분산 (함수 + 옵션 이름)', '호출 site 한 곳'],
          ]}
        />
        <p>
          함수는 "어떻게 redirect 할지"만 알고, "어디로 갈지"는 페이지가 결정.
          <strong> 각 페이지가 자기 정책의 책임을 진다.</strong>
        </p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-cyan-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>"옵션 켜고 끄기" → boolean, "옵션 값을 무엇으로" → enum.</strong> 이 구분이 옵션 API 설계의 첫 번째 가지.
        </Callout>
        <Callout variant="key">
          <strong>destination/색상/모드 같은 분기 값은 호출자가 알고 있다.</strong>{' '}
          함수가 boolean으로 받아 안에서 분기하면 옵션이 곧 폭증한다. 값으로 받아 그대로 쓰면 옵션 1개로 끝.
        </Callout>
        <Callout variant="key">
          <strong><IC>as const</IC> + 키 인덱싱 = 컴파일 단계 안전 가드.</strong> path 객체에 키 빼먹으면 컴파일 에러로 즉시 잡힘.
        </Callout>
      </div>
    </section>
  )
}
