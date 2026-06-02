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

      {/* Step 90 심층 학습 인트로 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🔬
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Step 90의 심층 학습 — &lt;T&gt; 제네릭 컴포넌트 해부</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          <IC>{'function EvaluationTabModule<T>(...)'}</IC>라는 한 줄에 TypeScript의 핵심 개념이 응축돼 있다.
          처음 마주치면 마법 같지만 원리를 알면 가장 강력한 도구 중 하나다. 9개 측면으로 풀어 설명한다.
        </p>
      </div>

      {/* Step 90-1 */}
      <StepCard phase={27} num="90-1" id="step90-1" title="왜 제네릭이 필요한가 — any/unknown/유니온으로 했다면?">
        <p>같은 컨테이너 UX를 두 데이터 타입(<IC>HopeUnivEvaluation</IC>, <IC>RecommUnivTab</IC>)이 공유해야 하는 상황. 제네릭 없이 푼다면:</p>
        <p className="font-semibold text-gray-800 mt-2">❌ 시도 A: any로 받기</p>
        <CodeBlock
          lang="typescript"
          code={`function EvaluationTabModule({ items }: { items: any[] }) {
  // getLabel: (item: any) => string
}

<EvaluationTabModule
  items={hopeUnivEvaluations}
  getLabel={(item) => item.univNamee}   // ← 오타 — TS가 못 잡음!
/>`}
        />
        <p><IC>any</IC>는 <strong>타입 체크를 꺼버리는</strong> 키워드. 오타·잘못된 필드 접근이 컴파일에서 안 잡히고 런타임에 <IC>undefined</IC>로 잠수.</p>

        <p className="font-semibold text-gray-800 mt-3">❌ 시도 B: unknown으로 받기</p>
        <CodeBlock
          lang="typescript"
          code={`function EvaluationTabModule({ items }: { items: unknown[] }) {
  // ...
}

getLabel={(item) => item.univName}
//                  ^^^^^^^^^^^^^^
//   TS Error: Object is of type 'unknown'.`}
        />
        <p><IC>unknown</IC>은 안전하지만 <strong>너무 안전해서</strong> 아무 필드도 못 씀. 매번 타입 가드/캐스팅 필요 → 사용성 0.</p>

        <p className="font-semibold text-gray-800 mt-3">❌ 시도 C: 유니온 타입</p>
        <CodeBlock
          lang="typescript"
          code={`function EvaluationTabModule({ items }: {
  items: HopeUnivEvaluation[] | RecommUnivTab[];
}) { ... }`}
        />
        <p>문제 2가지:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>새 데이터 타입(<IC>{'SomethingElse[]'}</IC>) 추가할 때마다 컴포넌트 시그니처 수정 필요.</li>
          <li>내부에서 <IC>item.num</IC>(HopeUniv만 있음) 접근 시 RecommUnivTab에 없어 또 타입 에러.</li>
        </ul>
        <Callout variant="key">
          <strong>✅ 제네릭이 답인 이유:</strong> 컴포넌트는 "어떤 타입이든 다 받을 수 있지만 각 호출에서는 그 타입을 정확히 기억"한다.
          호출자가 자기 데이터 타입에 맞춰 콜백을 작성하면 TS가 그 안에서 <IC>item</IC>을 정확히 추론.
        </Callout>
      </StepCard>

      {/* Step 90-2 */}
      <StepCard phase={27} num="90-2" id="step90-2" title='<T>의 의미 — "타입 변수"'>
        <p>함수의 일반 매개변수가 "값 변수"인 것처럼, 제네릭의 <IC>{'<T>'}</IC>는 <strong>"타입 변수"</strong>.</p>
        <CodeBlock
          lang="typescript"
          code={`// 값 변수 — 함수 호출 시 값이 결정됨
function add(a: number, b: number) { return a + b; }
add(1, 2);   // a=1, b=2

// 타입 변수 — 함수 호출 시 타입이 결정됨
function identity<T>(value: T): T { return value; }
identity<string>('hello');   // T=string (명시)
identity(42);                // T=number  (TS가 추론)`}
        />
        <p><IC>T</IC>는 관례 이름일 뿐 아무 이름이나 가능(<IC>{'<Item>'}</IC>, <IC>{'<DataType>'}</IC> 등). 보통 한 글자(T, U, K, V)나 의미 있는 PascalCase 이름.</p>
      </StepCard>

      {/* Step 90-3 */}
      <StepCard phase={27} num="90-3" id="step90-3" title="우리 코드 한 줄씩 풀기">
        <CodeBlock
          lang="typescript"
          code={`interface EvaluationTabModuleProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
  // ...
}

export function EvaluationTabModule<T>(
  props: EvaluationTabModuleProps<T>
) { ... }`}
        />
        <DataTable
          headers={['줄', '의미']}
          rows={[
            [<IC key="a">{'interface EvaluationTabModuleProps<T>'}</IC>, '이 인터페이스는 T라는 타입 변수를 받음. T는 인터페이스 안에서 일관된 의미로 사용'],
            [<IC key="b">{'items: T[]'}</IC>, <>items는 T의 배열. T가 <IC key="b2">HopeUnivEvaluation</IC>이면 <IC key="b3">{'HopeUnivEvaluation[]'}</IC></>],
            [<IC key="c">{'getKey: (item: T) => string'}</IC>, 'item을 받아 string 돌려주는 함수. 호출자가 작성한 함수는 T의 필드를 직접 쓸 수 있음'],
            [<IC key="d">{'function EvaluationTabModule<T>(...)'}</IC>, <>이 함수도 T를 받음 — Props의 T와 <strong>같은</strong> T 임을 컴파일러가 연결</>],
          ]}
        />
        <p className="font-semibold text-gray-800 mt-2">호출 시:</p>
        <CodeBlock
          lang="tsx"
          code={`<EvaluationTabModule
  items={hopeUnivEvaluations}   // ← items 타입이 HopeUnivEvaluation[]
  getKey={(item) => String(item.num)}
  //              ^^^^^^^^^^^^^^^^^
  // item이 HopeUnivEvaluation 으로 자동 추론 → num 필드 사용 가능
/>`}
        />
        <p>TS가 <IC>{'items={...}'}</IC>를 보고 <strong>T = HopeUnivEvaluation으로 자동 추론</strong>. 이후 모든 콜백 매개변수가 HopeUnivEvaluation으로 좁혀짐.</p>
        <p className="font-semibold text-gray-800 mt-2">다른 호출에선 다른 T:</p>
        <CodeBlock
          lang="tsx"
          code={`<EvaluationTabModule
  items={recommUnivTabs}         // ← T = RecommUnivTab으로 추론
  getKey={(item) => String(item.position)}
  //              ^^^^^^^^^^^^^^^^^^^^^^
  // item이 RecommUnivTab → position 필드 사용 (num은 없음 — RecommUnivTab엔 없으니까)
/>`}
        />
      </StepCard>

      {/* Step 90-4 */}
      <StepCard phase={27} num="90-4" id="step90-4" title='T의 "일관성"이 핵심'>
        <CodeBlock
          lang="typescript"
          code={`function EvaluationTabModule<T>({
  items,         // T[]
  getKey,        // (T) => string
  renderContent, // (T) => ReactNode
}: EvaluationTabModuleProps<T>) {
  items.map((item) => {
    //         ^^^^ item: T (자동)
    getKey(item);          // OK
    renderContent(item);   // OK
  });
}`}
        />
        <p>
          <strong>한 컴포넌트 호출 안에서 T는 단일 타입.</strong> 만약 items가 <IC>{'HopeUnivEvaluation[]'}</IC>인데
          getKey가 <IC>{'(item: RecommUnivTab) => ...'}</IC>이면 → 컴파일 에러.
          TS가 "T 일관성"을 강제해서 잘못된 짝을 자동으로 막아준다.
        </p>
      </StepCard>

      {/* Step 90-5 */}
      <StepCard phase={27} num="90-5" id="step90-5" title="React 컴포넌트 + 제네릭 — JSX 문법 함정">
        <p>화살표 함수로 작성하면 JSX 파서가 <IC>{'<T>'}</IC>를 JSX 태그로 오인:</p>
        <CodeBlock
          lang="tsx"
          code={`// ❌ 화살표 + 제네릭 — JSX 파서가 깨짐
const EvaluationTabModule = <T>(props: ...) => { ... }
//                          ^^^ 여기서 파싱 오류`}
        />
        <p className="font-semibold text-gray-800 mt-2">회피책 3가지:</p>
        <CodeBlock
          lang="tsx"
          code={`// ✅ 옵션 A: function 선언 (이 프로젝트의 선택)
export function EvaluationTabModule<T>(props: ...) { ... }

// ✅ 옵션 B: trailing comma 트릭
const EvaluationTabModule = <T,>(props: ...) => { ... }

// ✅ 옵션 C: extends 제약
const EvaluationTabModule = <T extends object>(props: ...) => { ... }`}
        />
        <Callout variant="key">
          이 프로젝트는 <strong>A</strong>를 선택. JSX와 가장 깔끔하게 공존하고 가독성도 좋음.
        </Callout>
      </StepCard>

      {/* Step 90-6 */}
      <StepCard phase={27} num="90-6" id="step90-6" title="제약(constraint) — extends로 T를 좁히기">
        <p>T가 "아무거나"가 아니라 "최소한 어떤 필드는 있어야" 한다고 강제 가능:</p>
        <CodeBlock
          lang="typescript"
          code={`// T가 num 필드를 반드시 가져야 함
function Module<T extends { num: number }>(props: { items: T[] }) {
  props.items[0].num;   // ← OK, T가 num을 갖는다고 보장됨
}

Module({ items: hopeUnivEvaluations });   // OK (num 있음)
Module({ items: recommUnivTabs });         // ❌ RecommUnivTab엔 num 없음`}
        />
        <p>
          우리 <IC>EvaluationTabModule</IC>은 T에 <strong>아무 제약이 없다</strong>.
          대신 <IC>getKey/getLabel/renderContent</IC>로 호출자가 "T를 어떻게 다룰지"를 통째 위임 →
          컴포넌트 자체는 T의 구체 모양을 몰라도 됨. 이게 핵심 설계 결정 중 하나.
        </p>
      </StepCard>

      {/* Step 90-7 */}
      <StepCard phase={27} num="90-7" id="step90-7" title="render-prop과 제네릭의 궁합">
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>제네릭</strong>은 "타입을 매개변수화" 한다.</li>
          <li><strong>render-prop</strong>은 "렌더링을 매개변수화" 한다.</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">둘을 결합하면:</p>
        <CodeBlock
          lang="tsx"
          code={`<EvaluationTabModule
  items={data}                            // 어떤 데이터든
  renderContent={(item) => <Card .../>}   // 어떻게 렌더할지
/>`}
        />
        <DataTable
          headers={['역할', '책임']}
          rows={[
            [<strong key="a">컴포넌트</strong>, '"Tab + DropDown 동기화"라는 컨테이너 로직만 — 데이터 모양/렌더링 모름'],
            [<strong key="b">호출자</strong>, '"내 데이터에서 키/라벨/콘텐츠를 어떻게 뽑을지"만'],
          ]}
        />
        <p>책임이 깔끔히 양분된다.</p>
      </StepCard>

      {/* Step 90-8 */}
      <StepCard phase={27} num="90-8" id="step90-8" title="실전 학습 체크리스트 — 언제 제네릭을 써야 하나">
        <DataTable
          headers={['신호', '제네릭이 답일 가능성']}
          rows={[
            ['같은 컨테이너 UX를 여러 데이터 타입이 공유', '✅'],
            ['호출자가 "내 데이터로 뭘 할지"를 다 정해줄 수 있음', '✅'],
            [<>컴포넌트 안에서 데이터의 특정 필드(<IC key="a">item.num</IC> 등)에 직접 접근</>, <>⚠️ 제약(<IC key="b">extends</IC>) 필요</>],
            [<>그냥 <IC key="c">any</IC>/<IC key="d">unknown</IC>으로 해도 동작은 함</>, '❌ 타입 안전성 잃음'],
            ['단일 데이터 타입에서만 쓰일 컴포넌트', '❌ 불필요한 추상화'],
          ]}
        />
      </StepCard>

      {/* Step 90-9 */}
      <StepCard phase={27} num="90-9" id="step90-9" title="짧은 비유">
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>일반 함수</strong>: "정수 두 개를 더해주는 계산기" — 정수만 받음</li>
          <li><strong>제네릭 함수</strong>: "두 개를 합쳐주는 빈 트레이" — 정수도, 문자열도, 객체도 올려놓으면 그 자리에서 그 타입에 맞게 동작</li>
        </ul>
        <p>
          <IC>{'EvaluationTabModule<T>'}</IC>는 <strong>빈 트레이</strong>. 호출자가 <IC>{'HopeUnivEvaluation[]'}</IC>을 올리면 그 모양으로,
          <IC>{'RecommUnivTab[]'}</IC>을 올리면 그 모양으로 자동 적응. 트레이 자신은 자기가 뭘 들고 있는지 모르지만
          <strong> 그게 일관되게 같은 종류라는 것</strong>만 보장한다.
        </p>
      </StepCard>

      {/* Step 90 정리 한 줄 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Step 90 심층 학습 정리 한 줄</h4>
        </div>
        <Callout variant="key">
          <strong>제네릭 컴포넌트는 "데이터 타입을 잠시 비워두고 호출자가 채우게 하는" 패턴이다.</strong>{' '}
          <IC>{'<T>'}</IC>는 그 빈자리. 호출 시점에 T가 정해지면 모든 콜백/매개변수가 자동으로 그 타입으로 좁혀져서
          <strong> 재사용성과 타입 안전성을 동시에</strong> 얻는다.
        </Callout>
      </div>

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
