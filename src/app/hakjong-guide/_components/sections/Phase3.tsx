import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase3() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={3} />

      {/* Step 8 */}
      <StepCard phase={3} num={8} title="TypeScript 인터페이스(타입) 정의">
        <p>
          컴포넌트를 만들기 전, 다룰 데이터의 구조를 TypeScript <IC>interface</IC>로 먼저 정의합니다.
          이것이 퍼블리싱과의 가장 큰 차이점 중 하나입니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// 드롭다운에서 선택한 값의 형태
interface StringDropDownOption {
  label: string  // 화면에 표시되는 텍스트 (예: "서울대학교")
  value: string  // 실제 전달되는 값 (예: "101")
}

// 3개 드롭다운의 선택 상태를 묶어서 관리
interface SelectedOptions {
  drop1: StringDropDownOption  // 대학
  drop2: StringDropDownOption  // 계열
  drop3: StringDropDownOption  // 학과
}

// 추가된 조건 카드 한 장의 형태
interface SelectedCard {
  id:      string           // 고유 식별자 (중복 추가 방지용)
  options: SelectedOptions  // 선택된 3개 조건
}`}
        />
        <Callout variant="info">
          <strong>왜 interface를 쓰나요?</strong> React에서는 데이터를 기반으로 UI를 렌더링합니다.
          interface를 정의하면 잘못된 데이터 사용 시 에디터에서 빨간 줄(타입 에러)로 미리 알려줍니다.
        </Callout>
      </StepCard>

      {/* Step 9 */}
      <StepCard phase={3} num={9} title="API 데이터 조회 (서버 데이터 가져오기)">
        <p>
          React Query 훅을 사용하여 서버에서 데이터를 가져옵니다.
          퍼블리싱에서는 정적 HTML 한 번이지만, 프론트에서는 <strong>API에서 데이터를 받아 동적으로 UI를 구성</strong>합니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search'
import { useCurrentUser } from '@libs/entities/user'

const { currentUser } = useCurrentUser()
const { data: univMajorData } = useUnivMajorListAndMajorTheme()`}
        />
        <Callout variant="key">
          이 훅들은 내부적으로 <strong>React Query</strong>를 사용합니다.
          자동으로 로딩/에러 상태를 관리하고, 캐싱 및 재요청을 처리합니다.
        </Callout>
        <Callout variant="info">
          <strong>초보자용 비유:</strong> <IC>useQuery</IC>는 도서관에서 책을 꺼내 읽는 것과 같습니다.
          같은 책을 다시 찾으면 이미 빌려둔 책(캐시)을 먼저 보여주고,
          오래된 정보라고 판단되면 다시 빌려와 최신 내용을 확인합니다.
        </Callout>
        <p>
          즉 React Query는 단순한 API 호출 도구가 아니라, <strong>서버에서 읽어온 데이터를 화면에서 어떻게 보관하고 다시 가져올지 관리하는 도구</strong>라고 이해하면 됩니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`const {
  data,
  isLoading,
  error,
} = useQuery({
  queryKey: ['hakjong', 'univ-major-list'],
  queryFn: fetchUnivMajorList,
})`}
        />
        <Callout variant="tip">
          이 프로젝트에서는 이 로직을 직접 쓰지 않고 커스텀 훅으로 감싸서
          <IC>useUnivMajorListAndMajorTheme()</IC>처럼 더 읽기 쉬운 형태로 사용합니다.
        </Callout>
        <Callout variant="info">
          <strong>프론트 학습 관점 핵심:</strong> <IC>useQuery</IC>는 서버에서 읽어온 데이터도 상태처럼 관리하자는 도구입니다.
          <IC>useState</IC>가 브라우저 안의 로컬 상태를 관리한다면, <IC>useQuery</IC>는 서버에서 온 상태를 관리합니다.
        </Callout>
        <p>
          퍼블리셔에서 프론트로 넘어올 때는 "어떤 API를 호출하나"보다 먼저,
          <strong>이 화면이 어떤 서버 데이터에 의존하는가</strong>를 먼저 생각하는 습관이 중요합니다.
        </p>
        <Callout variant="key">
          <strong>queryKey는 캐시의 주소입니다.</strong> 같은 <IC>queryKey</IC>면 같은 조회로,
          다른 <IC>queryKey</IC>면 다른 조회로 판단합니다.
        </Callout>
        <CodeBlock
          lang="tsx"
          code={`useQuery({
  queryKey: ['user', 1],
  queryFn: () => fetchUser(1),
})

useQuery({
  queryKey: ['user', 2],
  queryFn: () => fetchUser(2),
})`}
        />
        <p>
          위 두 query는 key가 다르기 때문에 서로 다른 캐시로 저장됩니다.
          반대로 다른 데이터를 조회하면서도 key를 똑같이 쓰면 캐시가 꼬일 수 있습니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// 좋지 않은 예: 다른 사용자 조회인데 key가 같음
useQuery({
  queryKey: ['user'],
  queryFn: () => fetchUser(userId),
})`}
        />
        <DataTable
          headers={['좋은 queryKey 기준', '설명']}
          rows={[
            ['도메인 이름부터 시작', '예: hakjong, user, post'],
            ['리소스 종류를 포함', '예: list, detail, status'],
            ['결과를 바꾸는 조건 포함', '예: userId, page, category'],
          ]}
        />
        <CodeBlock
          lang="tsx"
          code={`const { data } = useQuery({
  queryKey: ['hakjong', 'apply', 'status', currentUser.userId],
  queryFn: fetchApplyStatus,
  enabled: !!currentUser.userId,
})`}
        />
        <Callout variant="tip">
          <strong>enabled:</strong> 지금 이 query를 실행해도 되는가를 제어하는 스위치입니다.
          로그인 정보처럼 선행 조건이 준비된 뒤에만 조회를 시작할 때 자주 사용합니다.
        </Callout>
        <DataTable
          headers={['항목', 'useState', 'useQuery']}
          rows={[
            ['관리 대상', '브라우저 안의 로컬 상태', '서버에서 읽어온 상태'],
            ['데이터 출처', '사용자 입력, UI 내부 값', 'API 응답 데이터'],
            ['로딩/에러 관리', '직접 만들어야 함', '기본 제공'],
            ['캐시 재사용', '직접 구현해야 함', 'queryKey 기준 자동 처리'],
            ['퍼블리셔 관점 비유', '현재 화면 메모장', '서버에서 가져온 공용 문서'],
          ]}
        />
        <Callout variant="tip">
          <strong>📝 참고:</strong> 위 <IC>useQuery</IC> / <IC>queryKey</IC> 상세 설명은 분량이 길어
          별도 부록으로 분리하는 것도 고려해 보세요. 본문에서는 핵심 한 문장과 이 프로젝트 기준 예시만 남기고,
          비교표·오용 사례 등은 &quot;부록 A: useQuery 심화&quot;로 옮기면 Phase 3의 흐름이 더 간결해집니다.
        </Callout>
      </StepCard>

      {/* Step 10 */}
      <StepCard phase={3} num={10} title="API 데이터 → 드롭다운 옵션으로 변환 (useMemo)">
        <p>
          서버에서 받은 데이터를 드롭다운 컴포넌트가 이해하는{' '}
          <IC>{'{ label, value }'}</IC> 형태로 변환합니다.
          <IC>useMemo</IC>로 감싸서 불필요한 재계산을 방지합니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// 대학 목록: API 데이터 → 드롭다운 옵션
const universityOptions = useMemo<StringDropDownOption[]>(
  () =>
    univMajorData?.universities.map((univ) => ({
      label: univ.universityName,          // 화면 표시: "서울대학교"
      value: String(univ.universityId),    // 내부 값: "101"
    })) ?? [],                             // 데이터 없으면 빈 배열
  [univMajorData?.universities],           // 이 값이 바뀔 때만 재계산
)`}
        />
        <Callout variant="tip">
          <strong>useMemo란?</strong> 계산 비용이 있는 값을 기억(메모이제이션)해두고,
          의존성 배열의 값이 바뀔 때만 다시 계산합니다.
          매 렌더링마다 <IC>.map()</IC> 같은 배열 변환을 반복하지 않기 위해 사용합니다.
        </Callout>
        <CodeBlock
          lang="tsx"
          code={`// 계열 같은 고정 데이터는 API 대신 공통 코드 라이브러리 사용
import { code, codeName } from '@libs/common'

const majorTypeOptions: StringDropDownOption[] = [
  {
    label: codeName('MAJOR_TYPE_CODES', 'HUMANITIES'),      // "인문"
    value: code('MAJOR_TYPE_CODES', 'HUMANITIES'),          // "HUM"
  },
  {
    label: codeName('MAJOR_TYPE_CODES', 'NATURAL_SCIENCE'), // "자연계"
    value: code('MAJOR_TYPE_CODES', 'NATURAL_SCIENCE'),     // "NAT"
  },
]`}
        />
      </StepCard>

      {/* Step 11 */}
      <StepCard phase={3} num={11} title="상태(State) 관리 — 사용자 입력 추적">
        <p>
          React에서 사용자의 입력(선택)은 <IC>useState</IC>로 관리합니다.
          상태가 바뀌면 화면이 자동으로 다시 그려집니다.
          이것이 퍼블리싱과의 핵심 차이입니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// 드롭다운 3개의 현재 선택값
const [selectedOption, setSelectedOption] = useState<SelectedOptions>({
  drop1: { value: '', label: '' },
  drop2: { value: '', label: '' },
  drop3: { value: '', label: '' },
})

// 추가된 조건 카드 목록
const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])`}
        />
        <DataTable
          headers={['퍼블리싱 (jQuery 등)', '프론트 (React)']}
          rows={[
            ["$('#select').val() 로 값 읽기",              'selectedOption.drop1.value'],
            ["$('#result').html('<p>...</p>') 로 DOM 수정", '상태 변경 → 자동 재렌더링'],
            ['이벤트마다 DOM 직접 조작',                    'setState → React가 DOM 업데이트'],
          ]}
        />
      </StepCard>

      {/* Step 12 */}
      <StepCard phase={3} num={12} title="이벤트 핸들러 작성 — 사용자 동작 처리">
        <p>드롭다운 변경, 카드 추가/삭제 시의 동작을 함수로 정의합니다.</p>
        <CodeBlock
          lang="tsx"
          code={`// 드롭다운 변경 핸들러
const handleChange = (
  key: keyof SelectedOptions,  // 'drop1' | 'drop2' | 'drop3'
  option: StringDropDownOption,
) => {
  setSelectedOption((prevState) => ({
    ...prevState,  // 기존 상태 유지 (스프레드 연산자)
    [key]: option, // 해당 드롭다운만 업데이트
  }))
}

// 카드 추가 핸들러 (중복 방지 포함)
const handleAddCard = () => {
  const cardId = [drop1.value, drop2.value, drop3.value].join('-')  // "101-HUM-CS01"

  setSelectedCards((prevState) => {
    if (prevState.some((card) => card.id === cardId)) {
      return prevState  // 같은 조합 있으면 추가 안 함
    }
    return [...prevState, { id: cardId, options: selectedOption }]
  })
}

// 카드 삭제 핸들러
const handleDeleteCard = (cardId: string) => {
  setSelectedCards(
    (prevState) => prevState.filter((card) => card.id !== cardId)
  )
}`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            { icon: '📦', title: '스프레드 연산자 (...)', desc: '기존 객체를 복사한 뒤 특정 키만 덮어씁니다. state를 직접 수정하지 않고 새 객체를 만드는 불변성 원칙입니다.' },
            { icon: '🔍', title: '.some() 메서드', desc: '배열 안에 조건을 만족하는 요소가 하나라도 있으면 true를 반환합니다. 중복 체크에 자주 사용됩니다.' },
            { icon: '🧹', title: '.filter() 메서드', desc: '조건에 맞는 요소만 남긴 새 배열을 반환합니다. 원본을 변형하지 않아 React 불변성 원칙에 맞습니다.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xl mb-2">{item.icon}</div>
              <h5 className="text-[13px] font-bold text-gray-900 mb-1">{item.title}</h5>
              <p className="text-[12.5px] text-gray-600 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </StepCard>

      {/* Step 13 */}
      <StepCard phase={3} num={13} title="UI 렌더링 — 컴포넌트 조립">
        <p>데이터와 이벤트 핸들러가 준비되면, 공통 UI 컴포넌트에 연결하여 화면을 구성합니다.</p>
        <CodeBlock
          lang="tsx"
          code={`// 드롭다운 컴포넌트 연결
<DropDown
  label="대학 선택"
  onChange={(option) => handleChange('drop1', toStringDropDownOption(option))}
  options={universityOptions}
  size="sm"
  type="base"
  value={selectedOption.drop1.value || null}
/>

// 조건 카드 리스트 렌더링 (.map)
{selectedCards.map((card) => (
  <div key={card.id} className="p-5 bg-white border rounded-xl">
    <p>조건 1: <strong>{card.options.drop1.label}</strong></p>
    <p>조건 2: <strong>{card.options.drop2.label}</strong></p>
    <p>조건 3: <strong>{card.options.drop3.label}</strong></p>
    <button onClick={() => handleDeleteCard(card.id)}>X</button>
  </div>
))}`}
        />
        <Callout variant="warn">
          <strong>key 속성이 필수인 이유:</strong> React가 리스트의 어떤 항목이
          변경/추가/삭제되었는지 효율적으로 판단하기 위해 사용합니다.
          배열 인덱스보다 고유한 ID를 사용하는 것이 좋습니다.
        </Callout>
      </StepCard>
    </section>
  )
}
