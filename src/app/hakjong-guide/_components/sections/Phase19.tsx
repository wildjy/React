import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase19() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={19} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          Phase 5/10/18에서 sessionStorage로 신청 폼 ↔ 확인 페이지를 잇는 방식을 다뤘다. 동작은 했지만 두 가지가 거슬렸다:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-3">
          <li>같은 데이터가 sessionStorage와 서버 두 군데에 존재 → <strong>어느 쪽이 최신인가</strong>라는 동기화 책임이 프론트로 떠밀림.</li>
          <li>다른 기기/세션에서 수정하기 불가 — sessionStorage는 탭/세션 단위.</li>
        </ol>
        <p className="text-[14px] text-gray-700 leading-7">
          서버에 확정 후 조회 API 세 개(<IC>confirmHopeUnivs</IC>, <IC>confirmPreferSelects</IC>, <IC>confirmSimpleQuestions</IC>)가 생기면서,
          <strong> 서버를 단일 진실의 원천(source of truth)</strong>으로 만들 수 있게 됐다. sessionStorage 의존을 모두 걷어내고 서버 데이터로 폼을 채운다.
        </p>
      </div>

      <StepCard phase={19} num={61} id="step61" title='prefetch effect 설계 — useRef로 "한 번만"'>
        <p>Apply 폼 훅 안에서 confirm 쿼리 3개를 호출하고, 데이터가 도착하면 <strong>한 번만</strong> 폼 state에 적용한다.</p>
        <CodeBlock
          lang="typescript"
          code={`const { data: hopeUnivsData } = useConfirmHopeUnivsQuery();
const { data: preferSelectsData } = useConfirmPreferSelectsQuery();
const { data: simpleQuestionData } = useConfirmSimpleQuestionsQuery();
const hasHydrated = useRef(false);

useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;

  // 카드/선호/활동/질문 일괄 적용...

  hasHydrated.current = true;
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);`}
        />
        <p className="font-semibold text-gray-800 mt-2">세 가지 설계 결정의 의도:</p>
        <DataTable
          headers={['결정', '이유']}
          rows={[
            [<IC key="a">useRef</IC>, <><IC key="a2">useState</IC>로 플래그 두면 set 시 리렌더가 일어나 무한 루프 위험. ref는 변경해도 리렌더 안 함.</>],
            [<><strong key="b">셋 다 도착 후</strong> 일괄 적용 (AND 조건)</>, '하나만 도착해 부분 적용하고 hydrated=true 처리하면 늦게 온 데이터가 영원히 반영 안 됨.'],
            [<><IC key="c">hasHydrated.current = true</IC> 위치</>, <>첫 적용 직전/직후 어디든 OK. 핵심은 <strong>이후 데이터 변경(예: refetch)에도 다시 적용하지 않는 것</strong>. 사용자가 이미 입력한 값을 덮어쓰지 않기 위함.</>],
          ]}
        />
      </StepCard>

      {/* Step 61 심층 학습 인트로 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-stone-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🔬
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Step 61의 심층 학습 — prefetch effect 해부</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          위 코드 한 덩어리에 React의 여러 개념(<IC>useRef</IC> vs <IC>useState</IC>, AND-gating, deps, race condition, React Query 캐시, 대안 패턴)이 응축돼 있다.
          이 패턴은 한 번 익히면 form hydration 전반에 재사용 가능하니, 8개 측면으로 풀어 설명한다.
        </p>
      </div>

      {/* Step 61-1 */}
      <StepCard phase={19} num="61-1" id="step61-1" title="왜 useRef인가 — useState로 했다면">
        <p>가드 플래그를 <IC>useState</IC>로 두면 set 시 컴포넌트가 <strong>다시 렌더링</strong>된다.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ useState로 가드 — 동작은 하지만 불필요한 비용
const [hasHydrated, setHasHydrated] = useState(false);

useEffect(() => {
  if (hasHydrated) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;
  // ... apply ...
  setHasHydrated(true);  // ← 이 set이 리렌더를 일으킴
}, [hopeUnivsData, preferSelectsData, simpleQuestionData, hasHydrated]);
//                                                       ^^^^^^^^^^^
//   eslint-react-hooks/exhaustive-deps가 강제 — 안 넣으면 경고`}
        />
        <p className="font-semibold text-gray-800 mt-2">문제:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>setHasHydrated(true)</IC> → 리렌더 한 번 추가.</li>
          <li>다음 렌더에서 effect 재실행 → <IC>hasHydrated</IC>가 true니 guard에 걸려 무한 루프는 아님.</li>
          <li>그러나 deps에 <IC>hasHydrated</IC> 포함 → effect가 의미 없이 한 번 더 평가됨.</li>
        </ol>
        <p className="mt-2"><IC>useRef</IC>는 모두 우회한다:</p>
        <CodeBlock
          lang="typescript"
          code={`// ✅ useRef로 가드 — 깔끔
const hasHydrated = useRef(false);

useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || ...) return;
  // ... apply ...
  hasHydrated.current = true;  // ← 리렌더 안 일으킴
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
//   ref는 deps에 넣지 않음 — 의도된 생략`}
        />
        <p className="font-semibold text-gray-800 mt-2">핵심 차이:</p>
        <DataTable
          headers={['', 'useState', 'useRef']}
          rows={[
            ['값 저장', '✅', '✅'],
            ['컴포넌트 간/마운트 간 지속', '✅', '✅'],
            ['set 시 리렌더 트리거', '✅ (필요할 때 — UI 반영)', '❌'],
            ['deps에 포함해야 함', '✅', '❌'],
            ['용도', '"UI에 반영되어야 할 값"', '"렌더와 무관한 mutable 값"'],
          ]}
        />
        <Callout variant="key">
          <strong>규칙 한 줄:</strong> 값이 바뀌어도 <strong>화면을 다시 그릴 필요가 없다면</strong> <IC>useRef</IC>를 써라.
          플래그 / 타이머 ID / 이전 값 보관 / DOM 노드 참조 등이 대표 용례.
        </Callout>
      </StepCard>

      {/* Step 61-2 */}
      <StepCard phase={19} num="61-2" id="step61-2" title='AND-gating — "부분 적용"의 함정'>
        <p>세 쿼리가 비동기로 따로 도착할 때, 응답 하나에 적용하고 hydrated=true 처리하면 어떻게 될까?</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 부분 적용 함정
useEffect(() => {
  if (hasHydrated.current) return;
  if (hopeUnivsData) {
    // ... 카드만 적용 ...
  }
  if (preferSelectsData) { /* ... */ }
  if (simpleQuestionData) { /* ... */ }
  hasHydrated.current = true;   // ← 여기가 문제
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);`}
        />
        <p className="font-semibold text-gray-800 mt-2">시나리오:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>t=0.3s</IC>: <IC>hopeUnivsData</IC>만 먼저 도착 → 카드 적용 → <IC>hasHydrated.current = true</IC>.</li>
          <li><IC>t=0.5s</IC>: <IC>preferSelectsData</IC> 도착 → effect 재실행 → 가드에 걸려 <strong>return</strong> → 선호 영영 비어 있음.</li>
          <li><IC>t=0.7s</IC>: <IC>simpleQuestionData</IC> 도착 → 마찬가지로 <strong>return</strong> → 활동·질문 영영 비어 있음.</li>
        </ol>
        <p>결과: 사용자는 카드만 채워진 채 선호/활동이 비어 있는 폼을 보게 됨.</p>
        <p className="font-semibold text-gray-800 mt-2">올바른 AND 조건:</p>
        <CodeBlock
          lang="typescript"
          code={`// ✅ 셋 다 모이길 기다린 뒤 한 번에 적용
useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;
  // 셋 다 있음을 보장한 뒤 일괄 적용
  // ... apply all ...
  hasHydrated.current = true;
}, [...]);`}
        />
        <p>이 AND-gating은 "여러 비동기 소스를 단일 트랜잭션으로 묶기"의 React 버전이다.</p>
        <FlowDiagram>{`[OR 패턴]                          [AND 패턴]
hopeUnivsData 도착 → 적용+lock      hopeUnivsData 도착 → wait
preferSelectsData 도착 → blocked   preferSelectsData 도착 → wait
simpleQuestionData 도착 → blocked  simpleQuestionData 도착 → 셋 다 적용+lock`}</FlowDiagram>
        <Callout variant="key">
          <strong>요약:</strong> "한 번만"의 핵심은 <strong>언제 한 번인가</strong>다. 부분 적용 후 한 번이면 다른 부분이 잃어버려진다.
          <strong> 모두 도착한 뒤 한 번</strong>이 정답.
        </Callout>
      </StepCard>

      {/* Step 61-3 */}
      <StepCard phase={19} num="61-3" id="step61-3" title="의존성 배열의 의미 — 가드와 deps의 협업">
        <p><IC>useEffect(callback, deps)</IC>에서 deps는 "이 값들이 바뀔 때마다 callback을 다시 실행하라"는 의미.</p>
        <CodeBlock
          lang="typescript"
          code={`}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);`}
        />
        <p className="font-semibold text-gray-800 mt-2">여기에 셋을 넣은 이유:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>React Query의 <IC>data</IC>는 <strong>요청 도착 시 reference가 바뀐다</strong> (<IC>undefined</IC> → 실제 객체).</li>
          <li>첫 렌더에선 셋 다 <IC>undefined</IC>일 수 있음 → effect 발사되나 가드에 걸려 return.</li>
          <li>데이터가 하나씩 도착할 때마다 deps 값 변경 → effect 재발사 → AND 통과 시 한 번 적용.</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-3">deps에 무엇을 넣을지의 일반 원칙:</p>
        <DataTable
          headers={['변수 종류', 'deps 포함?', '이유']}
          rows={[
            ['쿼리 data, props, state', '✅', '값이 바뀌면 effect 재실행 필요'],
            [<>setter (<IC key="a">setX</IC>, <IC key="b">dispatch</IC>)</>, '선택 — 안 넣어도 OK', 'React가 stable reference 보장'],
            [<>ref (<IC key="c">hasHydrated</IC>)</>, '❌', '변경이 리렌더 안 일으키므로 deps 의미 없음'],
            ['handler/dropOptions 같은 합성 객체', '보수적으로 ✅, 안정성 확신 시 ❌', 'useMemo/useCallback 없으면 매 렌더 새 ref'],
          ]}
        />
        <p>
          ESLint <IC>react-hooks/exhaustive-deps</IC>는 effect 본문에서 사용한 모든 변수를 deps에 넣길 요구한다.
          우리 코드는 handler·dropOptions의 setter들도 본문에서 호출하지만 deps에는 안 넣었다 — setter는 stable이라 안전하다고 판단한 trade-off다.
          경고가 거슬리면 <IC>{'// eslint-disable-next-line react-hooks/exhaustive-deps'}</IC> 또는 React 19의 <IC>useEffectEvent</IC>(실험적)로 우회.
        </p>
      </StepCard>

      {/* Step 61-4 */}
      <StepCard phase={19} num="61-4" id="step61-4" title="race condition — 데이터 도착 전 사용자가 입력하면?">
        <p>이 패턴의 가장 미묘한 결함: <strong>데이터가 늦게 오면 사용자 입력을 덮어쓸 위험</strong>.</p>
        <FlowDiagram>{`t=0    페이지 마운트 → 폼 빈 상태 → 쿼리 발사
t=0.1  사용자가 빠르게 활동1 textarea에 "내가 적은 내용..." 입력 시작
t=0.5  쿼리 도착 → effect 발사 → 가드 통과 → setSelfActivity1(server.emphasis1) → 사용자 입력 ❌ 덮어씌워짐`}</FlowDiagram>
        <p>발생 확률은 낮다(쿼리는 보통 빠르고, 사용자가 마운트 직후 즉시 입력할 가능성 낮음). 하지만 0은 아님.</p>
        <p className="font-semibold text-gray-800 mt-3">세 가지 완화책, 강도순:</p>
        <p className="font-semibold text-gray-800 mt-2">(a) 데이터 도착 전 폼 자체를 disabled / 가림 (가장 안전)</p>
        <CodeBlock
          lang="tsx"
          code={`const isLoading = !hopeUnivsData || !preferSelectsData || !simpleQuestionData;

{isLoading ? (
  <FormSkeleton />
) : (
  <ActualForm {...allProps} />
)}`}
        />
        <p className="font-semibold text-gray-800 mt-2">(b) form 전체에 opacity + pointer-events-none</p>
        <CodeBlock
          lang="tsx"
          code={`<form className={isLoading ? 'opacity-50 pointer-events-none' : ''}>`}
        />
        <p className="font-semibold text-gray-800 mt-2">(c) 필드별 dirty 추적 → dirty인 필드만 prefetch 스킵 (가장 사용자 친화)</p>
        <p>
          react-hook-form 등 폼 라이브러리가 자동 제공하는 기능. 직접 구현하려면 각 필드마다 "사용자가 건드렸나" boolean을 관리해야 해 복잡.
        </p>
        <Callout variant="info">
          이 프로젝트는 단순함을 위해 어떤 완화도 안 적용했다 — 발생 확률이 낮고, 발생해도 사용자가 다시 입력하면 됨.
          사용자 보고가 들어오면 <strong>(a)</strong>부터 적용.
        </Callout>
      </StepCard>

      {/* Step 61-5 */}
      <StepCard phase={19} num="61-5" id="step61-5" title="React Query 캐시와의 상호작용">
        <p>React Query는 <IC>staleTime</IC>이 지나면 백그라운드에서 자동 refetch한다. 이때 prefetch effect는 어떻게 동작할까?</p>
        <p className="font-semibold text-gray-800 mt-2">시나리오:</p>
        <FlowDiagram>{`t=0     페이지 마운트 → 쿼리 fetch → 데이터 도착 → effect 적용 → hasHydrated=true
t=10s   사용자가 폼 일부 편집
t=5min  staleTime 만료 → React Query 백그라운드 refetch
t=5min+ 새 데이터 도착 → data reference 변경 → effect deps 변화 → effect 재발사
        가드 if (hasHydrated.current) return; → 건너뜀 ✅`}</FlowDiagram>
        <p className="mt-2">즉 <strong>ref 가드 덕분에 refetch가 사용자 편집 내용을 덮어쓰지 않는다.</strong> 이게 의도된 동작.</p>
        <p className="font-semibold text-gray-800 mt-2">다만 알아둘 점:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>컴포넌트가 unmount/remount되면</strong> ref도 새로 만들어진다. 다시 prefetch 적용.</li>
          <li>Confirm 페이지의 confirm 쿼리들과 <strong>같은 queryKey</strong>라면 React Query 캐시 공유 — 첫 도착이 빠르다. 이건 이득.</li>
        </ul>
        <Callout variant="key">
          <strong>요약:</strong> <IC>useRef</IC> 가드는 "<strong>한 hook 인스턴스 안에서 한 번</strong>"이다.
          컴포넌트가 unmount/remount되면 새 가드 → 다시 적용. 의도한 라이프사이클과 맞는지 검토.
        </Callout>
      </StepCard>

      {/* Step 61-6 */}
      <StepCard phase={19} num="61-6" id="step61-6" title="대안 패턴들 — 언제 다른 걸 쓸까?">
        <p>prefetch effect는 강력하지만 만능은 아니다. 상황별 다른 옵션:</p>

        <p className="font-semibold text-gray-800 mt-3">(a) 직접 렌더 — 폼 시드가 아니라 표시용</p>
        <p>사용자가 편집하지 않는 데이터(읽기 전용)는 state로 옮길 필요가 없다. 그냥 렌더:</p>
        <CodeBlock
          lang="tsx"
          code={`<p>{hopeUnivsData?.[0]?.univName}</p>`}
        />
        <p>
          이 프로젝트의 Confirm 페이지가 이 패턴이다. 편집 불가니까 state 동기화가 불필요.
          <strong> prefetch effect보다 압도적으로 단순</strong>하니, 편집할 일이 없으면 무조건 이 쪽.
        </p>

        <p className="font-semibold text-gray-800 mt-3">(b) useQuery의 select 옵션 — 변환만</p>
        <CodeBlock
          lang="typescript"
          code={`useQuery({
  queryKey,
  queryFn,
  select: (data) => data.map(transform),  // 응답을 변환해서 컴포넌트에 다른 모양으로 노출
});`}
        />
        <p>변환 결과를 state로 옮기지 않으니 사용자 편집 시나리오엔 안 맞음. 하지만 "보여주기 전에 한 번 변환"이 필요할 때 깔끔.</p>

        <p className="font-semibold text-gray-800 mt-3">(c) 폼 라이브러리의 reset(data)</p>
        <p>react-hook-form, formik 등을 쓴다면 prefetch 후 <IC>reset(serverData)</IC> 한 줄로 끝.</p>
        <CodeBlock
          lang="typescript"
          code={`const { reset } = useForm();
useEffect(() => {
  if (data) reset(data);  // ← 라이브러리가 dirty 추적까지 자동 처리
}, [data, reset]);`}
        />
        <p>우리 프로젝트는 <IC>useState</IC> 기반이라 수동 매핑이 필요했다. 폼이 더 커지면 react-hook-form 도입 고려.</p>

        <p className="font-semibold text-gray-800 mt-3">(d) Next.js initialData / SSR hydration</p>
        <p>서버 컴포넌트에서 데이터 prefetch → 클라이언트로 hydrate. App Router의 표준 패턴 중 하나.</p>
        <CodeBlock
          lang="typescript"
          code={`// 서버 컴포넌트
const data = await fetchOnServer();
<ClientComponent initialData={data} />`}
        />
        <p>이번 케이스는 클라이언트 전용 페이지라 적용 안 함. 하지만 SEO/초기 렌더가 중요한 페이지에선 첫 선택지.</p>

        <p className="font-semibold text-gray-800 mt-3">(e) URL 쿼리스트링 (Phase 5의 "방법 1")</p>
        <p>서버 prefetch가 가능해진 지금은 거의 안 씀.</p>

        <p className="font-semibold text-gray-800 mt-4">선택 기준 (의사결정 표):</p>
        <DataTable
          headers={['상황', '추천 패턴']}
          rows={[
            ['편집 가능한 폼 시드, 서버 API 있음', <strong key="a">prefetch effect (이 패턴)</strong>],
            ['읽기 전용 표시', '직접 렌더'],
            ['응답 변환만 (사용자 편집 없음)', <IC key="b">{'useQuery({ select })'}</IC>],
            ['폼 라이브러리 도입한 프로젝트', <>그 라이브러리의 <IC key="c">reset/setValue</IC></>],
            ['SEO/초기 렌더 중요', 'SSR initialData'],
            ['서버 API 없음', 'sessionStorage (Phase 5/10)'],
          ]}
        />
      </StepCard>

      {/* Step 61-7 */}
      <StepCard phase={19} num="61-7" id="step61-7" title="흔한 버그와 디버깅 팁">
        <DataTable
          headers={['증상', '원인 후보', '빠른 디버깅']}
          rows={[
            ['폼이 안 채워짐', '쿼리 응답이 빈 배열/undefined / 가드 조건 잘못', <IC key="a">{'console.log({hope: hopeUnivsData})'}</IC>],
            ['사용자 입력이 사라짐', <><IC key="b">hasHydrated</IC> 누락 / ref가 매 렌더 새로 만들어짐(잘못된 위치)</>, <IC key="c">{"console.log('hydrate?', hasHydrated.current)"}</IC>],
            ['effect가 두 번 적용', 'StrictMode dev 환경의 의도적 이중 마운트', 'dev에서만 그러는 거면 무시 가능. ref 가드로 차단됨'],
            ['무한 루프', 'deps에 effect 본문에서 set하는 state가 있음', 'deps에서 그 state 제거 또는 setter ref 안정화'],
            ['한 페이지 진입에 두 번 prefetch', '컴포넌트가 remount되고 있음 (parent key 변경 등)', 'React DevTools로 mount 횟수 확인'],
            ['Confirm에선 되는데 Apply에선 안 됨', '두 페이지의 hook 인스턴스가 분리됨 — 정상. 다만 prefetch 적용 로직이 한쪽에만 있을 수 있음', '페이지별로 prefetch 책임 분리 정책 결정'],
            ['응답은 OK인데 DropDown 매치 안 됨', '타입 비대칭 (Phase 20)', <><IC key="d">typeof data.x</IC> 로 number vs string 확인</>],
          ]}
        />
        <p className="font-semibold text-gray-800 mt-3">자주 쓰는 진단 로그 한 줄:</p>
        <CodeBlock
          lang="typescript"
          code={`useEffect(() => {
  console.log('[prefetch]', {
    hydrated: hasHydrated.current,
    hope: !!hopeUnivsData,
    prefer: !!preferSelectsData,
    simple: !!simpleQuestionData,
  });
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);`}
        />
      </StepCard>

      {/* Step 61-8 */}
      <StepCard phase={19} num="61-8" id="step61-8" title="sessionStorage 복원 vs 서버 prefetch — 결정적 차이">
        <p>같은 "초기값 시드" 문제를 두 방법으로 풀 수 있다. 이번 프로젝트는 후자로 옮겨갔다.</p>
        <DataTable
          headers={['항목', 'sessionStorage (Phase 5/10)', '서버 prefetch (이 Phase 19)']}
          rows={[
            ['데이터 소유', '클라이언트(브라우저)', '서버'],
            ['진실의 원천', '모호함 — 두 군데 동시 존재', '서버 단일'],
            ['다른 기기/세션', '❌ (탭/세션 단위)', '✅ (계정 기준)'],
            ['오프라인 동작', '✅ 가능', '❌ 불가'],
            ['동기화 책임', '프론트가 양쪽 챙겨야 함', '서버에 위임'],
            ['데이터 일관성', '깨질 가능성 (race, stale)', '보장'],
            ['코드 복잡도', '중간 (직렬화/역직렬화 + 키 관리)', '낮음 (React Query 위임)'],
            ['첫 신청자 처리', '비어 있음(자연스러움)', '빈 응답 처리 필요'],
            ['보안', '클라이언트에 데이터 노출', '서버 측 인증 통과해야 접근'],
          ]}
        />
        <p className="font-semibold text-gray-800 mt-3">이 프로젝트가 sessionStorage에서 서버 prefetch로 넘어간 흐름:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>서버 API가 없을 땐 sessionStorage 외 선택지가 없었음 (Phase 5/10).</li>
          <li>서버에 확정 후 조회 API가 생긴 순간, sessionStorage는 <strong>불필요한 중복</strong>으로 전락.</li>
          <li>"서버가 진실의 원천" 정책으로 일관성을 보장하면서 클라이언트 코드를 단순화.</li>
        </ol>
        <FlowDiagram>{`[과거]                              [현재]
사용자 입력                          사용자 입력
  ↓                                  ↓
sessionStorage 저장 ←┐                서버 POST
  ↓                  │                  ↓
페이지 이동           │                저장됨 (서버)
  ↓                  │                  ↓
sessionStorage 복원 ─┘                페이지 이동
  ↓                                    ↓
폼 채움                              서버 GET (React Query)
                                       ↓
                                     prefetch effect → 폼 채움`}</FlowDiagram>
        <Callout variant="key">
          <strong>결정 한 줄:</strong> 서버에 같은 데이터를 가진 API가 존재한다면, sessionStorage 의존을 <em>완전히</em> 걷어내라.
          두 캐시를 유지하면 동기화 책임이 모호해지고, 결국 어디서 어긋난다.
        </Callout>
      </StepCard>

      <StepCard phase={19} num={62} id="step62" title="알려진 데이터 갭">
        <p>서버 응답이 일부 필드를 누락한다. 코드로는 메울 수 없는 부분이라 명시적으로 빈 값으로 두고 백엔드 보완을 추적.</p>
        <DataTable
          headers={['폼 필드', '응답 출처', '복원 가능?']}
          rows={[
            ['카드의 대학/학과', <IC key="a">HopeUnivsResponse[].univCode/majorIdHsb</IC>, '✅'],
            [<><strong key="b">카드의 계열(aiBdPart)</strong></>, '응답에 없음', '❌ 빈 값'],
            ['선호 전공/지역', <IC key="c">PreferSelectsResponse.preferParts/preferAreas</IC>, '✅'],
            ['강조 활동/간단 질문', <IC key="d">SimpleQuestionResponse</IC>, '✅'],
            [<><strong key="e">비교과 추가 입력(<IC key="e2">subjectNot</IC>)</strong></>, '응답에 없음', '❌ 빈 값'],
          ]}
        />
        <Callout variant="info">
          클라이언트에서 역추적도 가능하다 — 예: <IC>(univCode, majorIdHsb)</IC>로 <IC>fetchAiBdCategoryList + fetchMajorListByUnivAndAiBd</IC> 루프를 돌려
          aiBdPart 찾기. 그러나 카드당 O(계열 수)의 API 호출이 누적되고, 부분 캐시로도 첫 prefetch 비용이 크다.
          <strong> 백엔드가 응답 필드를 추가하는 게 정답.</strong>
        </Callout>
      </StepCard>

      <StepCard phase={19} num={63} id="step63" title="sessionStorage 코드 일괄 제거">
        <p>서버가 진실의 원천이 됐으므로 더 이상 스냅샷을 저장/복원할 이유가 없다.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Apply의 복원 useEffect → 제거 (대체: prefetch effect)</li>
          <li>Apply의 handleSubmit 안 스냅샷 setItem → 제거 (서버가 저장하니 중복)</li>
          <li>Confirm의 복원 useEffect → 제거 (대체: confirm 쿼리들)</li>
          <li><IC>useAdmissionEvaluationConfirmSummary</IC> 같이 sessionStorage 기반이던 훅 → 파일 삭제</li>
        </ul>
        <Callout variant="tip">
          <strong>예외:</strong> 신청 완료 상태 플래그(<IC>applyComplete</IC>) 같은 "단순 boolean"은 sessionStorage 유지(전용 API가 없을 때 한정).
        </Callout>
      </StepCard>

      <StepCard phase={19} num={64} id="step64" title="첫 신청자(서버에 데이터 없음) 처리">
        <p>prefetch는 모든 사용자에게 발사된다. 첫 신청자도 confirm 쿼리들이 호출되는데, 두 가지 경우를 graceful하게 다뤄야 한다.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>서버가 빈 배열/객체 반환:</strong> <IC>{'hopeUnivsData = []'}</IC> → <IC>{'restoredCards = []'}</IC> → 빈 폼과 동일. 문제 없음.</li>
          <li><strong>서버가 404 반환:</strong> <IC>data === undefined</IC> → 가드(<IC>{'if (!hopeUnivsData) return;'}</IC>)에 걸려 effect 미실행 → 빈 폼 유지.</li>
        </ul>
        <p>다만 404가 콘솔 에러로 찍히는 게 거슬리면 Phase 9의 <IC>throwOnError: false</IC> 패턴을 confirm 쿼리들에 적용.</p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-stone-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          같은 데이터를 <strong>클라이언트 캐시(sessionStorage)</strong>와 <strong>서버</strong> 두 곳에 두지 마라.
          어느 한쪽이 진실의 원천이고, 다른 쪽은 그것의 일시적 뷰여야 한다.
          서버 API가 갖춰지는 순간 sessionStorage를 <em>완전히</em> 걷어내는 게 단순성과 데이터 일관성 면에서 이득.
          동기화 책임이 모호한 두 캐시는 항상 어디서 어긋난다.
        </Callout>
      </div>
    </section>
  )
}
