import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase27() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={27} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">리포트 페이지에 두 섹션이 거의 동일한 UI를 쓴다:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-2">
          <li><strong>희망 대학 평가 결과</strong>: Tab + DropDown 동기화 + 카드 리스트</li>
          <li><strong>전문가 추천 대학</strong>: Tab + DropDown 동기화 + 카드 리스트</li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7">데이터 형태가 다른데 컨테이너 UX는 같다. 그래서 같은 컴포넌트로 묶고 싶다.</p>
      </div>

      <StepCard phase={27} num={88} id="step88" title="데이터 비교">
        <DataTable
          headers={['', 'HopeUnivEvaluation (희망)', 'RecommUnivTab (추천)']}
          rows={[
            ['Tab 키 후보', <IC key="a">num: number</IC>, <IC key="b">position: number</IC>],
            ['Tab 라벨', <IC key="c">univName + typeName + majorName</IC>, <IC key="d">partName + univName</IC>],
            ['디테일 배열', <IC key="e">{'evaluations: Evaluation[]'}</IC>, <IC key="f">{'majors: RecommMajor[]'}</IC>],
            ['디테일 아이템', <IC key="g">Evaluation</IC>, <><IC key="h">RecommMajor</IC> (+ <IC key="h2">position</IC>)</>],
          ]}
        />
        <Callout variant="key">
          <strong>컨테이너 로직(Tab/DropDown 동기화)은 동일</strong>, <strong>콘텐츠 추출과 렌더링은 다름</strong>.
        </Callout>
      </StepCard>

      <StepCard phase={27} num={89} id="step89" title="접근 옵션 셋">
        <DataTable
          headers={['옵션', '설명', '단점']}
          rows={[
            [<strong key="a">공통 shape 으로 정규화</strong>, '두 데이터를 공통 인터페이스로 변환 후 동일 컴포넌트에 주입', <>약간 다른 필드(예: <IC key="a2">position</IC>) 손실되거나 강제 매핑</>],
            [<strong key="b">제네릭 + render-prop</strong>, '컴포넌트는 컨테이너만 책임, 키/라벨/콘텐츠 추출은 호출자', '약간의 보일러플레이트'],
            [<strong key="c">두 컴포넌트로 분리</strong>, '그냥 두 개로 둠', 'UI 변경 시 두 곳 수정'],
          ]}
        />
        <p><strong>제네릭 + render-prop이 균형이 가장 좋다</strong> — 컨테이너 로직 단일화, 호출자가 자기 데이터 모양 그대로 다룸.</p>
      </StepCard>

      <StepCard phase={27} num={90} id="step90" title="제네릭 컴포넌트 설계">
        <CodeBlock
          lang="tsx"
          code={`interface EvaluationTabModuleProps<T> {
  items: T[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  getKey: (item: T) => string;          // ← 키 추출
  getLabel: (item: T) => string;         // ← Tab/Dropdown 라벨
  renderContent: (item: T) => React.ReactNode;  // ← 콘텐츠 렌더링
}

export function EvaluationTabModule<T>({
  items,
  selectedValue,
  setSelectedValue,
  getKey,
  getLabel,
  renderContent,
}: EvaluationTabModuleProps<T>) {
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => getKey(item) === selectedValue),
  );

  return (
    <div>
      <DropDown
        options={items.map((item) => ({
          label: getLabel(item),
          value: getKey(item),
        }))}
        addClass="block md:hidden"
        value={selectedValue}
        onChange={(option) => setSelectedValue(option.value)}
      />
      <Tab initTab={selectedIndex}>
        <Tab.List addClass="hidden md:flex">
          {items.map((item) => (
            <Tab.Button
              key={getKey(item)}
              onBeforeChange={() => {
                setSelectedValue(getKey(item));
                return true;
              }}
            >
              {getLabel(item)}
            </Tab.Button>
          ))}
        </Tab.List>
        <Tab.ContentView>
          {items.map((item) => (
            <Tab.Contents key={getKey(item)}>
              {renderContent(item)}
            </Tab.Contents>
          ))}
        </Tab.ContentView>
      </Tab>
    </div>
  );
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">핵심 설계 결정:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>제네릭 <IC>{'<T>'}</IC></strong>: 어떤 데이터 모양이든 받음</li>
          <li><strong><IC>getKey</IC>/<IC>getLabel</IC>/<IC>renderContent</IC></strong>: 호출자가 자기 데이터를 어떻게 표현할지 결정</li>
          <li><strong><IC>findIndex</IC>로 selectedIndex 계산</strong>: 키 → index 매핑을 컨테이너가 알아서 처리. 기존 <IC>{'Number(selectedValue) - 1'}</IC> 같은 인덱스 추정보다 안전</li>
        </ul>
      </StepCard>

      <StepCard phase={27} num={91} id="step91" title="두 호출부">
        <CodeBlock
          lang="tsx"
          code={`// 희망 대학
<EvaluationTabModule
  items={hopeUnivEvaluations}
  selectedValue={hopeUnivSelectedValue}
  setSelectedValue={setHopeUnivSelectedValue}
  getKey={(item) => String(item.num)}
  getLabel={(item) => \`\${item.univName} \${item.typeName} \${item.majorName}\`}
  renderContent={(item) =>
    item.evaluations.map((ev, idx) => (
      <EvaluationCard key={idx} evaluation={ev} />
    ))
  }
/>

// 전문가 추천 대학
<EvaluationTabModule
  items={recommUnivTabs}
  selectedValue={recommUnivSelectedValue}
  setSelectedValue={setRecommUnivSelectedValue}
  getKey={(item) => String(item.position)}
  getLabel={(item) => \`\${item.partName} · \${item.univName}\`}
  renderContent={(item) =>
    item.majors.map((major, idx) => (
      <RecommMajorCard key={idx} major={major} />
    ))
  }
/>`}
        />
        <p>키가 number라 <IC>String(...)</IC> 변환하는 부분은 Phase 20의 number/string 비대칭 패턴과 같음.</p>
      </StepCard>

      <StepCard phase={27} num={92} id="step92" title="디테일 카드 분리">
        <p>비슷하지만 다른 필드를 가진 두 디테일 카드는 따로 작은 컴포넌트로:</p>
        <CodeBlock
          lang="tsx"
          code={`const EvaluationCard = ({ evaluation }: { evaluation: Evaluation }) => (
  <div className="p-4 mb-4 border rounded">
    <p>{evaluation.recomm}</p>
    <p>{evaluation.univName} {evaluation.typeName} {evaluation.majorName}</p>
    <p>{evaluation.refText}</p>
    <p>전년도 경쟁률 : {evaluation.lastCR ?? '-'}</p>
  </div>
);

const RecommMajorCard = ({ major }: { major: RecommMajor }) => (
  <div className="p-4 mb-4 border rounded">
    <p>
      {major.recomm}
      {major.position && <span className="ml-2">· {major.position}</span>}
    </p>
    <p>{major.univName} {major.typeName} {major.majorName}</p>
    <p>{major.refText}</p>
    <p>전년도 경쟁률 : {major.lastCR ?? '-'}</p>
  </div>
);`}
        />
        <p>두 카드의 차이는 <IC>RecommMajor</IC>에 <IC>position</IC>이 추가된 것뿐. 거의 같지만 별도로 둬서 각자 디자인 진화 가능.</p>
      </StepCard>

      <StepCard phase={27} num={93} id="step93" title="render-prop vs 다른 패턴">
        <DataTable
          headers={['패턴', '언제 적합']}
          rows={[
            [<><strong key="a">render-prop</strong>(이번 선택)</>, '콘텐츠 모양이 달라 호출자가 통제해야 할 때'],
            [<><strong key="b">children prop</strong></>, '단일 슬롯만 필요할 때 (이번엔 키/라벨/콘텐츠 3개라 부적합)'],
            [<><strong key="c">컴포넌트 합성</strong>(<IC key="c2">{'<Tabs><Tab.Header/>...'}</IC>)</>, '더 큰 구조 자유도 필요할 때. 보일러플레이트 ↑'],
            [<strong key="d">공통 shape 정규화</strong>, '데이터 모양이 정말 같아질 수 있을 때'],
          ]}
        />
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>컨테이너와 콘텐츠를 분리하라.</strong> Tab/DropDown 동기화 같은 "관리" 로직은 컴포넌트로,
          데이터에서 키/라벨/콘텐츠를 어떻게 뽑을지는 호출자로 위임. 이러면 새 데이터 타입이 추가돼도 컨테이너는 안 건드림.
        </Callout>
        <Callout variant="key">
          <strong><IC>{'Number(selectedValue) - 1'}</IC> 같은 인덱스 추정은 위험하다.</strong>{' '}
          데이터 순서가 1, 2, 3 으로 깨끗하지 않을 수도 있고(예: num=1, 5, 7), 키 형태가 달라지면 동작 안 함.
          <IC>findIndex(getKey)</IC>로 키 매칭이 안전.
        </Callout>
      </div>
    </section>
  )
}
