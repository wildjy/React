import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase29() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={29} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          Apply / Confirm / Report 세 페이지의 <strong>진입 조건</strong>이 모두 다르다:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-2">
          <li><IC>/apply</IC>: 비로그인 차단. 결제+완료된 사용자가 URL 직타로 진입 시 → Report로</li>
          <li><IC>/confirm</IC>: 비로그인 차단. 결제+완료된 사용자 → Report로</li>
          <li><IC>/report</IC>: 비로그인 차단. 미완료 사용자 → INTRO로</li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7">
          이걸 클라이언트 <IC>useEffect</IC>로 처리하면 <strong>페이지 한 번 그려진 후 redirect</strong> 깜빡임 발생.
          Next.js App Router의 정석은 <strong>서버 컴포넌트 페이지의 진입 가드를 async 함수로</strong> 두는 것.
        </p>
      </div>

      <StepCard phase={29} num={99} id="step99" title="use* 접두사 함정 — 훅 규칙으로 검사됨">
        <p>처음 시도한 코드:</p>
        <CodeBlock
          lang="typescript"
          path="navigation.server.ts"
          code={`// ❌
export async function useAdmissionEvaluationNavigationHandler() {
  const currentUser = await getCurrentUser();
  const { data: applyStatusData } =
    await useAdmissionEvaluationApplyStatusQuery();   // ← 훅 호출
  // ...
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">위반 사항이 여러 개:</p>
        <DataTable
          headers={['위반', '설명']}
          rows={[
            [<IC key="a">use*</IC>, <>React 규칙: "use로 시작하는 함수는 반드시 React Hook." ESLint의 <IC key="a2">react-hooks/rules-of-hooks</IC>가 즉시 검사 시작</>],
            ['async + 훅', <>훅은 동기 렌더링 컨텍스트에서만 동작 — <IC key="b">async function</IC> 본문에서 훅 호출은 React가 추적 불가</>],
            [<>훅에 <IC key="c">await</IC></>, <>훅은 Promise 아님. <IC key="c2">{'{ data, isLoading }'}</IC> 객체를 즉시 리턴. <IC key="c3">await</IC>은 의미 없음</>],
            ['서버에서 클라이언트 훅', <><IC key="d">.server.ts</IC> + <IC key="d2">redirect</IC> from <IC key="d3">next/navigation</IC> = 서버 컨텍스트. React 렌더 트리 없는 곳에서 훅 호출은 불가</>],
          ]}
        />
        <Callout variant="key">
          <strong>규칙 한 줄:</strong> <IC>use*</IC> 접두사를 쓰면 <strong>그 함수가 훅이라고 컴파일러·린터가 가정</strong>한다.
          훅이 아니면 다른 이름을 써라. <IC>getXxx</IC>, <IC>ensureXxx</IC>, <IC>fetchXxx</IC> 등.
        </Callout>
      </StepCard>

      <StepCard phase={29} num={100} id="step100" title="올바른 형태 — 일반 async 함수 + fetch 직접 호출">
        <CodeBlock
          lang="typescript"
          code={`// ✅ 일반 async 함수, 훅 X
export async function ensureAdmissionEvaluationAccess() {
  const currentUser = await getCurrentUser();
  if (!currentUser.userId) {
    redirect(ADMISSION_EVALUATION_PATH.INTRO);
  }
  // React Query 훅 대신 fetch 함수 직접 호출
  const applyStatus = await fetchAdmissionEvaluationApplyStatus();
  return { currentUser, isApplyCompleted: applyStatus?.completed ?? false };
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">핵심 변화:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>use*</IC> → 동사형 일반 함수명 (<IC>ensureXxx</IC>, <IC>getXxx</IC>)</li>
          <li><IC>useXxxQuery()</IC> (훅) → <IC>fetchXxx()</IC> (api 함수 직접 호출)</li>
          <li>반환값은 <IC>await Promise</IC> 결과</li>
        </ul>
      </StepCard>

      <StepCard phase={29} num={101} id="step101" title="alert는 서버에서 ReferenceError">
        <CodeBlock
          lang="typescript"
          code={`// ❌ 서버에서
alert('로그인이 필요합니다.');   // ReferenceError: alert is not defined
redirect(INFO_PATH);`}
        />
        <p>
          <IC>alert</IC>는 브라우저 전용(<IC>window.alert</IC>). 서버 런타임(Node.js)엔 <IC>window</IC> 없음.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>alert</IC> 라인에서 즉시 <IC>ReferenceError</IC> throw</li>
          <li>redirect 도달 못 함 → 사용자는 500 에러 페이지만 봄</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">서버에서 사용자에게 안내 전달하려면:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>옵션 A</strong>: 그냥 redirect (도착 페이지가 알아서 안내)</li>
          <li><strong>옵션 B</strong>: 쿼리 파라미터에 reason 담아 보냄 → 도착 페이지(client)가 읽어 alert</li>
          <li><strong>옵션 C</strong>: <IC>{"cookies().set('flash', 'reason')"}</IC> → 도착 페이지가 읽고 지움</li>
        </ul>
        <p>대부분 A로 충분. 안내가 정말 필요하면 B.</p>
      </StepCard>

      <StepCard phase={29} num={102} id="step102" title="options 패턴 — 페이지별 다른 정책">
        <p>3개 페이지가 같은 함수를 호출하되 각자 정책이 다르니, <strong>options 객체로 분기</strong>:</p>
        <CodeBlock
          lang="typescript"
          code={`export async function ensureAdmissionEvaluationAccess(options?: {
  /** 신청 완료 안 된 경우 INTRO 로 보냄 (Report 페이지용) */
  redirectIfNotCompleted?: boolean;
  /** 결제 + 신청 모두 완료된 경우 REPORT 로 보냄 (Apply/Confirm 페이지용) */
  redirectIfCompleted?: boolean;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser.userId) redirect(INTRO);

  const applyStatus = await fetchAdmissionEvaluationApplyStatus();
  const isApplyCompleted = applyStatus?.completed ?? false;

  // Report: 미완료 → INTRO
  if (options?.redirectIfNotCompleted && !isApplyCompleted) {
    redirect(INTRO);
  }

  // Apply/Confirm: 결제+완료 → REPORT
  if (options?.redirectIfCompleted && isApplyCompleted) {
    const isPaid = await fetchSusiPaymentStatus();
    if (isPaid) redirect(REPORT);
  }

  return { currentUser, isApplyCompleted };
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">호출:</p>
        <CodeBlock
          lang="tsx"
          code={`// apply/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });

// confirm/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });

// report/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfNotCompleted: true });`}
        />
      </StepCard>

      <StepCard phase={29} num={103} id="step103" title="옵션 이름 ↔ 동작 일치의 중요성">
        <p>한때 시도된 패턴:</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 옵션 이름과 동작이 어긋남
if (isApplyCompleted && options?.redirectIfNotCompleted) {
  redirect(REPORT);
}`}
        />
        <p>
          <IC>redirectIfNotCompleted</IC>(미완료면 리다이렉트) 라는 이름이 <IC>isApplyCompleted</IC>(완료) 인 경우에 발동 → 정반대.
          한 옵션으로 두 정반대 동작을 처리하려는 충동을 막아야 함.
        </p>
        <DataTable
          headers={['의도', '옵션 이름']}
          rows={[
            ['미완료면 INTRO로', <IC key="a">redirectIfNotCompleted</IC>],
            ['완료면 REPORT로', <IC key="b">redirectIfCompleted</IC>],
          ]}
        />
        <p>두 정책이 정반대니 <strong>옵션도 정확히 두 개</strong>. 한 옵션으로 묶으면 의미가 모호.</p>
      </StepCard>

      <StepCard phase={29} num={104} id="step104" title="결제 fetch 위치 — 조건부 호출로 최적화">
        <CodeBlock
          lang="typescript"
          code={`// ❌ 모든 진입에서 결제 조회
const isPaid = await fetchSusiPaymentStatus();

// ✅ 필요할 때만 조회 — 결제 완료 안 됐을 사용자는 결제 정보 자체 필요 없음
if (options?.redirectIfCompleted && isApplyCompleted) {
  const isPaid = await fetchSusiPaymentStatus();
  if (isPaid) redirect(REPORT);
}`}
        />
        <p>
          <IC>isApplyCompleted</IC>가 false 면 결제 여부는 redirect 결정에 영향 없음. 호출 자체를 안 하는 게 빠름.
          가장 흔한 케이스(첫 신청자)의 페이지 진입 속도 ↑.
        </p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong><IC>use*</IC> 접두사는 React Hook 한정 예약어다.</strong> 훅이 아니면 동사형 일반 함수명을 써라.
          ESLint가 그 이름을 본 순간부터 hook rules로 검사한다.
        </Callout>
        <Callout variant="key">
          <strong>서버 함수에서는 클라이언트 훅도, <IC>alert</IC>도 못 쓴다.</strong> fetch 함수를 직접 호출하고,
          사용자 안내는 redirect 경로나 쿼리 파라미터로.
        </Callout>
        <Callout variant="key">
          <strong>옵션 이름과 동작은 정확히 일치해야 한다.</strong> "이 옵션 켜면 무슨 일이 일어나는가"를 이름이 그대로 말해줘야 한다.
          두 정반대 동작을 한 옵션에 묶지 마라.
        </Callout>
      </div>
    </section>
  )
}
