import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase30() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={30} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          질문을 제출했는데 <strong>화면이 그대로</strong>다. 가드(<IC>remainingQuestions</IC>, <IC>items.length</IC>)도 옛 값.
          사용자가 한 번 더 제출 가능. 직전에 보낸 질문은 카운트에 반영 안 됨.
          원인은 React Query의 <strong>stale cache</strong>.
        </p>
      </div>

      <StepCard phase={30} num={105} id="step105" title="stale cache 문제 한 그림">
        <FlowDiagram>{`t=0  qnaListData = { remainingQuestions: 3, items: [] }   ← 캐시
     사용자: 첫 질문 제출 → POST 성공
t=1  서버에는 items 1개 추가됨, remainingQuestions=2
     하지만 클라이언트 캐시는 그대로 { remainingQuestions: 3, items: [] }
t=2  사용자: 두 번째 질문 시도
     가드: 옛값 사용 → 통과 → 또 제출
     서버는 진짜를 알지만 클라이언트는 모름`}</FlowDiagram>
        <p>
          mutation은 서버 상태를 바꾸지만 <strong>React Query 캐시까지는 자동으로 갱신 안 한다</strong> — 우리가 명시적으로 알려줘야 함.
        </p>
      </StepCard>

      <StepCard phase={30} num={106} id="step106" title="결정적 함정 — new QueryClient()">
        <p>처음 시도한 코드:</p>
        <CodeBlock
          lang="typescript"
          path="queries.ts"
          code={`// ❌
onSuccess: (_, { userId }) => {
  alert('질문이 성공적으로 제출되었습니다.');
  const queryClient = new QueryClient();   // ← 새 인스턴스!
  queryClient.invalidateQueries({
    queryKey: ['admissionReportQnaList', userId],
  });
},`}
        />
        <p>
          <IC>new QueryClient()</IC>는 <strong>완전히 새, 독립된</strong> QueryClient 인스턴스를 만든다.
          앱이 실제로 쓰는 QueryClient(<IC>{'<QueryClientProvider>'}</IC>가 들고 있는 것)는 건드리지 않는다.
        </p>
        <Callout variant="info">
          <strong>비유:</strong> "방금 산 빈 노트의 메모를 지웠다" — 진짜 문제의 노트는 그대로.
        </Callout>
        <p>invalidate가 <strong>실제 캐시엔 아무 영향 없음</strong> → refetch 안 됨 → 화면 안 바뀜.</p>
      </StepCard>

      <StepCard phase={30} num={107} id="step107" title="정답 — useQueryClient() 훅">
        <CodeBlock
          lang="typescript"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient();   // ✅ 앱이 제공한 진짜 인스턴스
  return useMutation({
    mutationFn: submitAdmissionReportQna,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['admissionReportQnaList', userId],
      });
    },
  });
}`}
        />
        <DataTable
          headers={['', 'new QueryClient()', 'useQueryClient()']}
          rows={[
            ['가져오는 client', '새 빈 인스턴스', <>앱의 <IC key="a">QueryClientProvider</IC>가 제공한 인스턴스</>],
            ['invalidate 효과', '새 인스턴스 안 캐시만 (사실상 없음)', '앱이 실제 쓰는 캐시 → useQuery가 refetch'],
            ['사용 위치', '(이론상) 외부 코드', 'React 컴포넌트/훅 본문'],
          ]}
        />
      </StepCard>

      <StepCard phase={30} num={108} id="step108" title="invalidate 표준 위치 — mutation 정의 안">
        <p>mutation의 onSuccess를 <strong>두 곳</strong>에 둘 수 있다:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>mutation 정의의 onSuccess</strong> (queries.ts) — 모든 호출에 공통</li>
          <li><strong>mutate 호출 시의 onSuccess</strong> (<IC>{'mutate(vars, { onSuccess })'}</IC>) — 그 호출만의 후속</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">역할 분담:</p>
        <DataTable
          headers={['위치', '담당']}
          rows={[
            [<strong key="a">정의 안 onSuccess</strong>, '캐시 invalidate, 공통 로깅'],
            [<strong key="b">호출 시 onSuccess</strong>, 'UI 후속 처리 (form reset, alert, 페이지 이동)'],
          ]}
        />
        <CodeBlock
          lang="typescript"
          code={`// queries.ts — 정의: 캐시 관리
export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAdmissionReportQna,
    onSuccess: (_, { userId }) => {
      // 모든 호출에서 공통으로: 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['admissionReportQnaList', userId],
      });
    },
    onError: (error) => {
      console.error('질문 제출 실패:', error);
      alert('질문 제출에 실패했습니다.');
    },
  });
}

// 호출 site — UI 후속만
submitQuestion(
  { userId, question },
  {
    onSuccess: () => {
      setQuestion('');
      alert('질문이 제출되었습니다.');
    },
  },
);`}
        />
        <Callout variant="info">
          <strong>두 onSuccess는 둘 다 실행된다.</strong> 정의 쪽이 먼저, 호출 쪽이 그 다음. 역할만 분담하면 충돌 없음.
        </Callout>
      </StepCard>

      <StepCard phase={30} num={109} id="step109" title="alert 중복 함정">
        <p>정의·호출 양쪽에서 alert 띄우면 사용자에게 2번 보임:</p>
        <CodeBlock
          lang="typescript"
          code={`// queries.ts onSuccess
alert('질문이 성공적으로 제출되었습니다.');   // 1번째

// Report.tsx 호출 site onSuccess
alert('질문이 제출되었습니다.');             // 2번째`}
        />
        <p>→ 정의에서 alert 제거, 호출 site에서만.</p>
      </StepCard>

      <StepCard phase={30} num={110} id="step110" title="더 빠른 반응이 필요하면 — Optimistic Update">
        <p>
          invalidate는 "서버에서 다시 받아오기"라 round-trip 1회. 사용자 클릭 즉시 화면 반영하려면 optimistic update 패턴:
        </p>
        <CodeBlock
          lang="typescript"
          code={`onMutate: async ({ userId, question }) => {
  await queryClient.cancelQueries({ queryKey: ['admissionReportQnaList', userId] });
  const previous = queryClient.getQueryData(['admissionReportQnaList', userId]);
  queryClient.setQueryData(['admissionReportQnaList', userId], (old) => ({
    ...old,
    remainingQuestions: Math.max(0, (old?.remainingQuestions ?? 0) - 1),
    items: [...(old?.items ?? []), { question, ... }],
  }));
  return { previous };
},
onError: (_err, { userId }, context) => {
  // 실패 시 롤백
  if (context?.previous) {
    queryClient.setQueryData(['admissionReportQnaList', userId], context.previous);
  }
},
onSettled: (_data, _err, { userId }) => {
  // 성공/실패 어느 쪽이든 서버 진실로 동기화
  queryClient.invalidateQueries({ queryKey: ['admissionReportQnaList', userId] });
},`}
        />
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>장점: 클릭 즉시 화면 반영 (낙관적 갱신)</li>
          <li>단점: 코드량 ↑, 실패 시 롤백 로직 필요</li>
        </ul>
        <p>흔치 않은 액션(QnA 제출 등)은 invalidate만으로 충분. 자주 일어나는 액션(좋아요 등)에 optimistic 권장.</p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-rose-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong><IC>new QueryClient()</IC>는 invalidate 의도엔 절대 안 된다.</strong> 새 빈 인스턴스라 실제 캐시 안 건드림.
          반드시 <IC>useQueryClient()</IC> 훅으로 진짜 인스턴스 가져와야 함.
        </Callout>
        <Callout variant="key">
          <strong>mutation 정의 onSuccess vs 호출 시 onSuccess — 역할 분담.</strong> 정의는 "캐시 관리" 공통 책임,
          호출은 "UI 후속" 개별 책임. 둘 다 실행되니 중복 alert 주의.
        </Callout>
        <Callout variant="key">
          <strong>mutate 후 화면 안 바뀌면 첫 의심은 cache invalidation 누락.</strong> queryKey가 정확히 일치하는지도 점검.
        </Callout>
      </div>
    </section>
  )
}
