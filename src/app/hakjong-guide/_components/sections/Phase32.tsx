import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase32() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={32} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          별점을 한 번 제출하면 다시 못 바꾸는 정책. 페이지 진입 시 사용자가 이전에 제출한 별점이 있다면
          <strong> 그 값을 보여주고 잠금</strong> 처리하고 싶다.
        </p>
        <p className="font-semibold text-gray-800 mt-2">순진한 시도:</p>
        <CodeBlock
          lang="typescript"
          code={`const [rating, setRating] = useState(0);
const { data: satisfactionSurveyData } = useSatisfactionSurveyQuery(userId);

useEffect(() => {
  if (satisfactionSurveyData?.satisfiedRate) {
    setRating(satisfactionSurveyData.satisfiedRate);
  }
}, [satisfactionSurveyData?.satisfiedRate]);`}
        />
        <p className="font-semibold text-gray-800 mt-2">이게 동작은 하지만 <strong>세 가지 문제</strong>:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>페이지 로드 → 빈 별 → useEffect 발동 → 별이 채워짐 (깜빡임)</li>
          <li><IC>useEffect</IC>로 sync 코드가 매번 보임 (보일러플레이트)</li>
          <li>캐시 변경(invalidate) 시 사용자가 드래그 중이었다면 그 입력을 덮어쓸 위험</li>
        </ol>
      </div>

      <StepCard phase={32} num={118} id="step118" title="더 깨끗한 패턴 — derived display value">
        <p>useEffect 없이 <strong>렌더 시점에 어느 값을 보여줄지 결정</strong>:</p>
        <CodeBlock
          lang="typescript"
          code={`const [rating, setRating] = useState(0);   // 사용자가 새로 드래그한 임시 값
const { data: satisfactionSurveyData } = useSatisfactionSurveyQuery(userId);

const isAlreadyRated = (satisfactionSurveyData?.satisfiedRate ?? 0) > 0;

// derived: 이미 제출했으면 서버 값, 아니면 로컬 값
const displayRating = isAlreadyRated
  ? (satisfactionSurveyData?.satisfiedRate ?? 0)
  : rating;

<StarRating value={displayRating} onChange={setRating} disabled={isAlreadyRated} />`}
        />
        <p className="font-semibold text-gray-800 mt-2">흐름:</p>
        <FlowDiagram>{`[케이스 A: 미제출 사용자]
  satisfactionSurveyData = { satisfiedRate: null }
  isAlreadyRated = false
  displayRating = rating (로컬 0)
  → 별 비어 있음, 드래그 가능

[케이스 B: 이미 제출한 사용자]
  satisfactionSurveyData = { satisfiedRate: 7 }
  isAlreadyRated = true
  displayRating = 7 (서버 값)
  → 별 채워져 있음, disabled`}</FlowDiagram>
        <p>
          <strong>useEffect 없음, sync 코드 없음, 깜빡임 없음.</strong>{' '}
          <IC>displayRating</IC>은 단순한 ternary로 매 렌더에 결정.
        </p>
      </StepCard>

      <StepCard phase={32} num={119} id="step119" title="왜 derived가 useEffect보다 깨끗한가">
        <DataTable
          headers={['', 'useEffect로 sync', 'derived value']}
          rows={[
            ['코드 양', 'useEffect 본문 5줄+', '한 줄 ternary'],
            ['race condition', '가능 (data 도착 vs 사용자 입력)', '없음 (선택 명확)'],
            ['깜빡임', '있음 (빈 별 → 채워짐)', '없음 (처음부터 올바른 값)'],
            ['캐시 변경에 따른 자동 갱신', '가능하지만 setState 사이클', '자동 (다음 렌더가 새 derived 값)'],
          ]}
        />
        <Callout variant="key">
          <strong>규칙:</strong> "state로 따로 들고 있어야 하는가, 아니면 props/server 값에서 매번 계산 가능한가?"
          후자면 derived value가 답.
        </Callout>
      </StepCard>

      <StepCard phase={32} num={120} id="step120" title="mutation cache invalidation 과의 짝">
        <p>
          derived 패턴 단독으론 부족. 제출 직후 서버 값이 캐시에 안 들어오면 <IC>isAlreadyRated</IC>가 계속 false다.
          → mutation의 onSuccess에서 invalidate (Phase 30):
        </p>
        <CodeBlock
          lang="typescript"
          code={`export function useSubmitSatisfactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSatisfactionSurvey,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['satisfactionSurvey', userId],
      });
    },
  });
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">이러면 흐름:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>사용자: 별점 7 드래그 → <IC>rating = 7</IC></li>
          <li>[별점 남기기] 클릭 → mutate</li>
          <li>서버 성공 → mutation onSuccess → invalidateQueries</li>
          <li><IC>useSatisfactionSurveyQuery</IC>가 refetch → <IC>satisfactionSurveyData.satisfiedRate = 7</IC></li>
          <li><IC>isAlreadyRated = true</IC> → <IC>displayRating = 7</IC> (server 우선)</li>
          <li>StarRating disabled</li>
        </ol>
        <p className="mt-2"><strong>사용자 입장에서: 클릭 → 잠시 후 자동으로 잠금.</strong> 새로고침 안 해도 됨.</p>
      </StepCard>

      <StepCard phase={32} num={121} id="step121" title="새로고침 후에도 잠금 유지">
        <p>derived + invalidation 패턴의 보너스: <strong>새로고침해도 잠금 유지</strong>.</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>새로고침 → 컴포넌트 마운트 → <IC>useSatisfactionSurveyQuery</IC> 재실행</li>
          <li>서버에 이전 제출 값 존재 → <IC>satisfactionSurveyData.satisfiedRate = 7</IC></li>
          <li><IC>isAlreadyRated = true</IC> → 처음부터 잠긴 상태로 그려짐</li>
        </ul>
        <Callout variant="info">
          <strong>Phase 19의 "서버가 진실의 원천" 정책의 응용.</strong> 로컬 sessionStorage 같은 임시 저장 없이 서버 데이터가 곧 잠금 상태.
        </Callout>
      </StepCard>

      <StepCard phase={32} num={122} id="step122" title="다른 적용처">
        <p>이 패턴(<IC>isXxx ? serverValue : localValue</IC>)은 별점 외에 다양한 곳에 응용 가능:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>읽기 전용 폼 필드</strong>: 이미 확정된 입력은 서버값 표시, 아니면 사용자 입력</li>
          <li><strong>카운터의 마지막 동기화 값</strong>: 서버 카운트 vs 사용자가 막 누른 클릭</li>
          <li><strong>공유 cursor 위치</strong>: 다른 사용자가 있으면 그 위치, 아니면 본인 위치</li>
        </ul>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-pink-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>server-first / local fallback은 useEffect로 sync보다 깔끔하다.</strong> 단순 ternary로 매 렌더에 결정하면 race condition도 깜빡임도 없다.
        </Callout>
        <Callout variant="key">
          <strong>derived value + mutation invalidate는 한 쌍이다.</strong> 한 쪽만 두면 미완성.
          서버 변경이 클라이언트 캐시에 반영돼야 derived 값이 새로워진다.
        </Callout>
        <Callout variant="key">
          <strong>"상태로 들고 있어야 하나, props/server에서 계산 가능한가?"</strong>가 derived 판단 기준.
          후자면 state 줄이고 derived 늘리는 게 거의 항상 더 단순.
        </Callout>
      </div>
    </section>
  )
}
