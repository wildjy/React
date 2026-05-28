import { PhaseHeader, StepCard } from '../ui/StepCard'
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
