import { PhaseHeader, StepCard, FlowDiagram, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase9() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={9} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경 — 왜 이 패턴이 필요한가?</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          학종 서비스를 개발하다 보면, 프론트 코드는 먼저 작성되었지만{' '}
          <strong>서버 측 엔드포인트가 아직 구현되지 않은 시점</strong>이 자주 발생합니다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          예: stepbar의 사용자 진행 상태를 보여주는 <IC>/user-status</IC> 엔드포인트가 백엔드에서 아직 구현되지 않았다고 가정합시다.
          프론트에서는 이미 <IC>useUserStatusQuery</IC>를 호출하고 있고, 그 결과로 stepbar 각 단계의 완료 여부를 표시하는 UI도 짜여 있습니다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          이 상태에서 페이지를 열면 다음과 같은 에러가 발생하며 <strong>stepbar뿐 아니라 페이지 전체가 깨집니다</strong>:
        </p>
        <CodeBlock
          lang="text"
          code={`Uncaught Error: Cannot GET /jh/api/high3/user-status
    at throwOnError (ReactQueryProvider.tsx:29)
    at useUserStatusQuery (user-status.queries.ts:13)
    at useStepBar (useStepBar.ts:22)
    at EarlyStepbar (EarlyStepbar.tsx:18)`}
        />
        <Callout variant="key">
          API 한 개가 미구현인데, 왜 페이지 전체가 흰 화면이 되는지 — 그 원리와 정공법이 이번 Phase의 주제입니다.
        </Callout>
      </div>

      {/* 핵심 개념 ① */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ①
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">핵심 개념 — 글로벌 <IC>throwOnError</IC> 정책</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          이 프로젝트의 React Query는 <IC>libs/app/provider/ReactQueryProvider.tsx</IC>에서 다음과 같이 설정되어 있습니다.
        </p>
        <CodeBlock
          lang="tsx"
          path="libs/app/provider/ReactQueryProvider.tsx"
          code={`new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2500,
      gcTime: 2500,
      retry: 1,
      throwOnError(error, query) {
        // Next.js의 전역 error.js에서 감지하도록 던짐
        throw new Error(APIError.message(error));
      },
    },
  },
});`}
        />
        <p className="text-[14px] font-semibold text-gray-800 mt-3 mb-2">
          <IC>throwOnError</IC>의 동작 차이:
        </p>
        <DataTable
          headers={['방식', '쿼리 실패 시 동작']}
          rows={[
            ['기본 React Query', <>에러가 <IC key="a">useQuery</IC>의 <IC key="b">error</IC> 필드에 담겨 옴. 컴포넌트가 <IC key="c">{'if (isError)'}</IC>로 직접 처리</>],
            ['이 프로젝트 설정', '렌더링 도중에 throw → React 트리를 타고 위로 올라가 가장 가까운 Error Boundary(error.js)에서 잡힘'],
          ]}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-3 mb-2">
          이 설계의 의도는 <strong>"API 에러는 전역으로 일관되게 처리한다"</strong>입니다.
          모든 컴포넌트가 일일이 에러 처리 코드를 쓰지 않아도 됩니다.
        </p>
        <Callout variant="warn">
          <strong>부작용:</strong> 한 쿼리가 실패하면, 그 쿼리를 부른 컴포넌트가 throw → 그 위 컴포넌트도 함께 unmount →
          페이지 전체가 Error Boundary로 대체됩니다.
          <strong>선택적으로 빠질 수 있는 데이터</strong>(예: stepbar 진행률)에도 이 정책이 적용되면,
          "있어도 좋고 없어도 되는" 데이터가 페이지를 통째로 무너뜨립니다.
        </Callout>
        <p className="text-[14px] text-gray-700 leading-7 mt-3">
          <IC>ReactQueryProvider</IC> 자체에 이미 안내 주석이 있습니다:
        </p>
        <CodeBlock
          lang="tsx"
          code={`/**
 * @memo
 * throwOnError 옵션을 사용하면, 쿼리에서 에러가 발생하면 해당 쿼리를 사용하는 컴포넌트에서 에러를 핸들링할 수 없음.
 * 개별 컴포넌트에서 에러처리가 필요한 경우, useQuery 옵션에 throwOnError: false 설정하세요.
 */`}
        />
        <Callout variant="key">이 안내가 이번 Phase의 정답입니다.</Callout>
      </div>

      {/* 핵심 개념 ② */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ②
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">핵심 개념 — 옵트아웃(opt-out)</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          글로벌 정책을 <strong>유지하면서</strong>, 특정 쿼리만 정책에서 빠지게 만드는 방식을 옵트아웃이라고 합니다.
          React Query는 <IC>useQuery</IC>의 옵션에서 <IC>throwOnError: false</IC>를 지정하면 해당 쿼리만 글로벌 정책을 덮어씁니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`useQuery({
  queryKey: [...],
  queryFn: ...,
  throwOnError: false, // ← 이 쿼리만 글로벌 정책에서 빠짐
});`}
        />
        <Callout variant="tip">
          옵트아웃된 쿼리는 실패해도 throw하지 않고, <IC>data</IC>가 <IC>undefined</IC>인 상태로 컴포넌트에 전달됩니다.
          <strong>호출부가 <IC>undefined</IC>를 안전하게 처리할 수만 있다면</strong>, 백엔드 미구현 상태에서도 페이지가 정상 렌더됩니다.
        </Callout>
      </div>

      {/* Step 40 */}
      <StepCard phase={9} num="40" id="step40" title="옵트아웃 적용 — useUserStatusQuery 예시">
        <CodeBlock
          lang="tsx"
          path="apps/early/src/entities/user-status/model/user-status.queries.ts"
          code={`export function useUserStatusQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userStatusQueries.status(userId).queryKey,
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId && enabled,
    // 서버 /user-status 엔드포인트 구현 완료 후 이 옵션 제거 — 호출부 fallback(?? 0, ?? false)으로 안전하게 degrade
    throwOnError: false,
  });
}`}
        />
        <p>추가된 부분은 단 두 줄(주석 + 옵션)입니다. 이 한 줄로 stepbar가 더 이상 페이지를 깨뜨리지 않습니다.</p>
        <Callout variant="info">
          <strong>왜 코멘트를 다는가?</strong>
          이 코드를 처음 보는 사람은 "왜 이 쿼리만 글로벌 정책을 빠져나가지?"라는 의문을 가집니다.
          의도를 명시해야 백엔드 구현 완료 시점에 누군가 이 옵션을 제거하는 것을 잊지 않습니다.
          일반적으로 코드 코멘트는 최소화하지만,{' '}
          <strong>글로벌 정책을 덮어쓰는 경우에는 그 이유를 적어두는 것이 옳습니다</strong>.
        </Callout>
      </StepCard>

      {/* Step 41 */}
      <StepCard phase={9} num="41" id="step41" title="호출부 fallback 설계">
        <p>
          옵트아웃 자체는 단순합니다. 하지만 <strong>그것만으로는 충분하지 않습니다</strong>.
          옵트아웃된 쿼리는 실패 시 <IC>data</IC>가 <IC>undefined</IC>로 전달되므로,
          호출부가 그 <IC>undefined</IC>를 처리하지 못하면 다른 종류의 런타임 에러가 납니다.
        </p>
        <CompareGrid
          beforeLabel="나쁜 예 — fallback 없음"
          afterLabel="좋은 예 — Optional chaining + ?? 기본값"
          before={
            <CodeBlock
              lang="tsx"
              code={`const { data: userStatus } = useUserStatusQuery(userId);

// ❌ TypeError: Cannot read property
//    'mockApplicationCount' of undefined
const count = userStatus.mockApplicationCount;`}
            />
          }
          after={
            <CodeBlock
              lang="tsx"
              path="apps/early/src/shared/model/hooks/useStepBar.ts"
              code={`const { data: userStatus } = useUserStatusQuery(
  currentUser?.userId,
  !currentUser?.isLoading,
);

// Optional chaining + Nullish coalescing
const mockApplicationCount =
  userStatus?.mockApplicationCount ?? 0;
const scoreDisclosureCount =
  userStatus?.scoreDisclosureCount ?? 0;

const step = [
  {
    id: 2,
    label: '교과성적',
    result: {
      active: userStatus?.isNesinGradeInput ?? false,
      value: userStatus?.isNesinGradeInput
        ? '입력완료'
        : '입력하기',
    },
  },
  // ...
];`}
            />
          }
        />
        <p className="font-semibold text-gray-800 mt-2">두 연산자의 조합 패턴</p>
        <DataTable
          headers={['연산자', '동작']}
          rows={[
            [<>Optional chaining <IC key="a">?.</IC></>, <>왼쪽이 <IC key="b">undefined</IC>/<IC key="c">null</IC>이면 평가를 멈추고 <IC key="d">undefined</IC> 반환</>],
            [<>Nullish coalescing <IC key="e">??</IC></>, <>왼쪽이 <IC key="f">undefined</IC>/<IC key="g">null</IC>이면 오른쪽 값 사용</>],
            [<>조합 <IC key="h">{'userStatus?.field ?? default'}</IC></>, <><IC key="i">userStatus</IC>가 없으면 → <IC key="j">{'undefined ?? default'}</IC> → <IC key="k">default</IC></>],
          ]}
        />
        <Callout variant="key">
          이 조합으로 모든 사용처에서 안전한 기본값(빈 상태, <IC>false</IC>, <IC>0</IC>)을 보장하면,
          백엔드 미구현 상태에서도 stepbar는 "아무것도 완료되지 않은 초기 상태"로 자연스럽게 표시됩니다.
        </Callout>
      </StepCard>

      {/* Step 42 */}
      <StepCard phase={9} num="42" id="step42" title="옵트아웃을 써도 되는 쿼리 vs 쓰면 안 되는 쿼리">
        <p>
          모든 미구현 API에 <IC>throwOnError: false</IC>를 남발해서는 안 됩니다. 판단 기준:
        </p>
        <DataTable
          headers={['상황', '적용 여부', '이유']}
          rows={[
            ['stepbar 진행 상태 (/user-status)', '✅ 적용', '없어도 페이지의 핵심 기능은 동작. 그저 진행률이 초기값으로 보일 뿐'],
            ['평가 신청 페이지의 사용자 정보 조회', '❌ 부적합', '사용자 정보 없이는 신청 자체가 불가능. 에러를 던져서 사용자에게 알리는 것이 맞음'],
            ['리포트 페이지의 평가 결과 데이터', '❌ 부적합', '데이터 자체가 페이지의 존재 이유. 에러면 페이지를 닫는 것이 맞음'],
            ['우상단 알림 뱃지 개수', '✅ 적용', '부수적 정보. 실패 시 뱃지를 안 보이는 것이 페이지 전체를 막는 것보다 나음'],
          ]}
        />
        <Callout variant="key">
          <strong>판단 한 줄 요약:</strong> 이 데이터가 없으면 페이지를 보여주는 의미가 사라지는가?
          그렇다면 <IC>throw</IC>가 맞고, 아니면 <IC>throwOnError: false</IC> 옵트아웃이 맞습니다.
        </Callout>
      </StepCard>

      {/* Step 43 */}
      <StepCard phase={9} num="43" id="step43" title="백엔드 구현 완료 후 제거 체크리스트">
        <p>
          <IC>throwOnError: false</IC>는 <strong>임시 우회</strong>입니다.
          백엔드 엔드포인트가 준비되면 다음을 수행합니다.
        </p>

        <p className="font-semibold text-gray-800 mt-3">1. 쿼리 옵션 제거</p>
        <CodeBlock
          lang="diff"
          code={` useQuery({
   queryKey: userStatusQueries.status(userId).queryKey,
   queryFn: () => fetchUserStatus(userId),
   enabled: !!userId && enabled,
-  // 서버 /user-status 엔드포인트 구현 완료 후 이 옵션 제거 — 호출부 fallback(?? 0, ?? false)으로 안전하게 degrade
-  throwOnError: false,
 });`}
        />

        <p className="font-semibold text-gray-800 mt-3">2. fallback은 그대로 유지</p>
        <p>
          호출부의 <IC>?? 0</IC>, <IC>?? false</IC>는 옵트아웃이 사라져도 그대로 둡니다. 이유:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>쿼리는 항상 로딩 상태로 시작하므로 <IC>data</IC>가 <IC>undefined</IC>인 시점이 존재합니다.</li>
          <li>네트워크 일시 장애나 인증 만료 등으로 일시적으로 <IC>undefined</IC>가 들어올 수 있습니다.</li>
          <li>fallback은 옵트아웃과 별개로, <strong>모든 쿼리 호출부에 두는 것이 일반적인 좋은 습관</strong>입니다.</li>
        </ul>

        <p className="font-semibold text-gray-800 mt-3">3. 실제 동작 확인</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>정상 응답: 쿼리 성공 → stepbar에 실제 진행률이 표시되는지</li>
          <li>의도적 실패: 백엔드에서 500을 반환했을 때 Error Boundary가 잡는지 (이때는 옵트아웃이 빠졌으니 throw 정책이 다시 적용됨)</li>
        </ul>

        <FlowDiagram>{`[임시 단계] throwOnError: false
  → API 미구현 상태에서도 페이지 정상 동작
  → data는 undefined → fallback 값으로 표시

[API 구현 완료 후]
  1. throwOnError: false 제거
  2. 쿼리 실패 시 글로벌 Error Boundary가 다시 작동
  3. fallback(?? 0, ?? false)은 로딩 중 안전 처리를 위해 유지`}</FlowDiagram>
      </StepCard>

      {/* Phase 9 정리 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Phase 9 정리</h4>
        </div>
        <DataTable
          headers={['새로 배운 핵심 개념', '설명']}
          rows={[
            [<strong key="a">글로벌 <IC>throwOnError</IC> 정책</strong>, 'React Query 에러를 Error Boundary로 던지는 프로젝트 표준 동작. 일관된 에러 UX의 장점, 페이지 전체 차단의 단점'],
            [<><strong key="b">옵트아웃</strong> (<IC>throwOnError: false</IC>)</>, '글로벌 정책을 유지한 채 특정 쿼리만 정책에서 빼는 방식'],
            [<><strong key="c">Optional chaining + Nullish coalescing</strong></>, <><IC key="d">{'data?.field ?? default'}</IC> 패턴으로 <IC key="e">undefined</IC> 안전 처리</>],
            [<strong key="f">degrade 가능 vs 필수 데이터</strong>, '없어도 페이지가 의미 있는 데이터는 옵트아웃 대상, 페이지의 존재 이유가 되는 데이터는 throw 유지'],
            [<strong key="g">임시 우회의 정리 책임</strong>, '우회 코드에는 의도 코멘트를 남기고, 원인이 해소되면 제거. fallback은 그대로 유지'],
          ]}
        />
        <Callout variant="key">
          <strong>적용 판단 한 줄:</strong>{' '}
          이 쿼리가 실패해도 페이지가 의미 있게 동작하는가? → 그렇다면 <IC>throwOnError: false</IC>, 아니면 글로벌 정책 그대로.
        </Callout>
      </div>
    </section>
  )
}
