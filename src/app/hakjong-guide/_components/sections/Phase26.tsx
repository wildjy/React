import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase26() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={26} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          "비어있을 때 mock으로 대체" 또는 "비어있으면 검증" 같은 정책을 짤 때, <strong>빈 응답을 어떻게 정의하느냐</strong>가 자주 미묘하게 어긋난다.
          한 세션 안에서 같은 함정이 세 번 다른 모양으로 나타났다.
        </p>
      </div>

      <StepCard phase={26} num={84} id="step84" title='"비어있음"의 세 가지 깊이'>
        <FlowDiagram>{`깊이 1: 값 자체 존재 여부          → undefined, null
깊이 2: 컨테이너가 비어있음        → 빈 배열 [], 빈 객체 {}
깊이 3: 컨테이너에 의미 없는 값만 → [{title:'', content:''}], [0, 0, 0]`}</FlowDiagram>
        <p className="font-semibold text-gray-800 mt-2">각 깊이마다 검사 도구가 다르다:</p>
        <DataTable
          headers={['깊이', '도구', '잡는 것']}
          rows={[
            ['1', <><IC key="a">??</IC>, <IC key="b">{'||'}</IC></>, 'undefined, null (+ falsy 값)'],
            ['1 + 2', <><IC key="c">.length</IC>, <IC key="d">Object.keys(x).length</IC></>, '빈 컨테이너'],
            ['1 + 2 + 3', <IC key="e">.some(predicate)</IC>, '의미 있는 콘텐츠'],
          ]}
        />
      </StepCard>

      <StepCard phase={26} num={85} id="step85" title="세 가지 실제 함정 (이 프로젝트)">
        <p className="font-semibold text-gray-800 mt-2">함정 ① — || 로 빈 배열 안 잡힘 (깊이 1만 잡음)</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 빈 배열은 truthy 라서 mock으로 안 떨어짐
const hopeUnivEvaluations =
  applicationStrategyData?.hopeUnivEvaluations || hopeUnivEvaluationsMOCK;`}
        />
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>undefined</IC> → mock ✓ (의도대로)</li>
          <li><IC>{'[]'}</IC> → <strong>mock 안 됨</strong> ✗ (<IC>{'[]'}</IC>은 truthy)</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">fix: .length 체크.</p>
        <CodeBlock
          lang="typescript"
          code={`const hopeUnivEvaluations = applicationStrategyData?.hopeUnivEvaluations?.length
  ? applicationStrategyData.hopeUnivEvaluations
  : hopeUnivEvaluationsMOCK;`}
        />

        <p className="font-semibold text-gray-800 mt-4">함정 ② — !data 로 검증 분기 못함 (같은 원리)</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 첫 신청자는 hopeUnivsData = [] 라서 검증 블록 진입 못함
if (!hopeUnivsData) {
  // 첫 신청자만 카드/드롭다운 검증
  if (handler.selectedCards.length === 0) alert(...);
}`}
        />
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>undefined</IC>(쿼리 로딩 중) → 검증 ✓</li>
          <li><IC>{'[]'}</IC>(서버가 빈 배열) → <strong>검증 건너뜀</strong> ✗ → 빈 폼 그대로 POST</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">fix: length 또는 의미 변수.</p>
        <CodeBlock
          lang="typescript"
          code={`const hasSavedDraft = (hopeUnivsData?.length ?? 0) > 0;
if (!hasSavedDraft) { /* 첫 신청자 검증 */ }`}
        />

        <p className="font-semibold text-gray-800 mt-4">함정 ③ — .length 도 부족, 콘텐츠 깊이까지 봐야 (깊이 3)</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 서버가 [{title:'', content:''}] 로 줘도 length 1 이라 통과
const hasAnyData =
  !!datas?.academicAbility?.length ||
  !!datas?.careerCompetency?.length ||
  !!datas?.communityCompetency?.length;`}
        />
        <p>서버가 placeholder 객체로 채워서 응답하면 length는 truthy인데 화면엔 빈 카드만 보임.</p>
        <p className="font-semibold text-gray-800 mt-2">fix: .some(...) 로 아이템 내부 콘텐츠 확인.</p>
        <CodeBlock
          lang="typescript"
          code={`const hasMeaningfulItems = (items?: CompetencyItem[]) =>
  !!items?.some(({ title, content }) => !!title?.trim() || !!content?.trim());

const hasAnyData =
  hasMeaningfulItems(datas?.academicAbility) ||
  hasMeaningfulItems(datas?.careerCompetency) ||
  hasMeaningfulItems(datas?.communityCompetency);`}
        />
        <p><IC>.trim()</IC>까지 두면 공백/줄바꿈만 있는 케이스도 정리됨.</p>
      </StepCard>

      <StepCard phase={26} num={86} id="step86" title="정확한 깊이를 고르는 기준">
        <DataTable
          headers={['데이터 모양', '필요한 깊이']}
          rows={[
            ['primitive (string, number)', <>1 (<IC key="a">??</IC>, <IC key="b">{'||'}</IC>) — 단 빈 문자열 <IC key="c">{"''"}</IC>은 falsy주의</>],
            ['배열/객체 컨테이너', <>1 + 2 (<IC key="d">?.length</IC>, <IC key="e">Object.keys</IC>)</>],
            ['컨테이너 안 아이템', <>1 + 2 + 3 (<IC key="f">.some(predicate)</IC>) — 아이템이 placeholder일 가능성 있을 때</>],
          ]}
        />
        <Callout variant="tip">
          <strong>판단법:</strong> "이 데이터가 '비어있다'고 말할 수 있는 경우의 수를 모두 적어보라." 그게 셋이면 깊이 3.
        </Callout>
      </StepCard>

      <StepCard phase={26} num={87} id="step87" title="패턴 — hasMeaningfulXxx 헬퍼">
        <p>
          <IC>{'!!arr?.length'}</IC> 같은 짧은 표현은 깊이 1+2까지 빠르지만 가독성이 낮고 깊이 3은 다루지 못한다. 이름 있는 헬퍼로 빼면:
        </p>
        <CodeBlock
          lang="typescript"
          code={`const isEmpty = <T>(arr?: T[]) => !arr || arr.length === 0;
const hasMeaningfulItems = <T>(arr: T[] | undefined, predicate: (item: T) => boolean) =>
  !!arr?.some(predicate);`}
        />
        <p className="font-semibold text-gray-800 mt-2">호출:</p>
        <CodeBlock
          lang="typescript"
          code={`if (isEmpty(hopeUnivEvaluations)) { /* mock */ }

if (hasMeaningfulItems(data?.academicAbility, ({title, content}) =>
  !!title?.trim() || !!content?.trim())) { /* real */ }`}
        />
        <p>코드 의도가 영어 헬퍼 이름으로 표현됨 — <IC>{'||'}</IC> 한 줄 대비 의미 명확.</p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>"비어있다"는 한 단어가 아니다.</strong> undefined, 빈 배열, 빈 문자열 아이템 — 모두 다른 깊이의 빈.
          검사 도구를 데이터 깊이에 맞추지 않으면 함정에 정확히 빠진다.
        </Callout>
        <Callout variant="key">
          <strong><IC>{'||'}</IC>/<IC>??</IC>는 깊이 1까지만 잡는다.</strong> 컨테이너 비교에는 <IC>.length</IC>, 아이템 내부 비교에는 <IC>.some(predicate)</IC>.
          같은 fallback 코드가 깊이 1·2·3 어디까지 책임지는지 의식하면서 짜라.
        </Callout>
        <Callout variant="key">
          <strong>헬퍼로 이름 붙이면 의도가 코드에 보인다.</strong>{' '}
          <IC>applicationStrategyData?.hopeUnivEvaluations?.length</IC> 보다 <IC>hasSavedDraft</IC>/<IC>hasMeaningfulItems</IC>가 다음 작업자에게 친절.
        </Callout>
      </div>
    </section>
  )
}
