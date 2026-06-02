import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase22() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={22} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          같은 컴포넌트를 <strong>Apply(편집)</strong> 와 <strong>Confirm(확인)</strong> 두 모드에서 재사용할 때,
          "확인 모드에선 입력값이 비어 있는 항목 자체를 숨긴다"는 정책이 한 세션 안에서 세 곳에서 발견됐다.
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-2">
          <li><IC>AdmissionScoreStatus</IC>의 <strong>비교과 추가 입력</strong> Textarea</li>
          <li><IC>EmphasisActivityInput</IC>의 <strong>활동 1~3</strong> Textarea</li>
          <li><strong>희망 대학 카드</strong> 6슬롯 (이건 약간 변형 — 빈 슬롯을 placeholder로)</li>
        </ol>
        <p className="text-[14px] text-gray-700 leading-7">
          세 곳 모두 "사용자가 입력한 것만 보여준다"는 같은 원칙을 다른 모양으로 적용한다. 한 번 익히면 새 항목이 추가될 때 자동으로 같은 패턴을 쓰면 된다.
        </p>
      </div>

      <StepCard phase={22} num={67} id="step67" title='단일 항목 — mode ? hasValue : conditionForMode 패턴'>
        <p>기존엔 <IC>showComparativeExtra</IC> (3-1 미입력일 때만 노출)만으로 게이트했다.</p>
        <CodeBlock
          lang="typescript"
          code={`// before
const showComparativeExtra = studentRecordComparativeStatus.some(...);
{showComparativeExtra && <Textarea ... />}`}
        />
        <p>확인 모드에선 추가로 "값이 있을 때만" 조건이 더해진다. 두 조건을 모드별로 가르면 깔끔.</p>
        <CodeBlock
          lang="typescript"
          code={`// after
const showComparativeExtra = studentRecordComparativeStatus.some(...);

// 확인(confirm) 모드에선 입력값이 있을 때만 노출 — 빈 입력은 숨김
// 신청(edit) 모드에선 기존대로 3-1 미입력 조건만 적용
const showComparativeExtraSection = confirmPage
  ? !!comparativeExtraInfo
  : showComparativeExtra;

{showComparativeExtraSection && <Textarea ... />}`}
        />
        <p className="font-semibold text-gray-800 mt-2">패턴의 일반화:</p>
        <FlowDiagram>{`visible = mode === '확인' ? hasValue(value) : modeAgnosticCondition`}</FlowDiagram>
      </StepCard>

      <StepCard phase={22} num={68} id="step68" title="다중 항목 — 배열 + filter + map">
        <p><IC>EmphasisActivityInput</IC>은 활동1/2/3을 <IC>ActivityTextarea</IC>로 3번 그렸다. 거의 동일한 코드 복붙.</p>
        <CodeBlock
          lang="tsx"
          code={`// ❌ before — 복붙 3번
<ActivityTextarea title="활동1" label="..." value={selfActivity1} onChange={...} />
<ActivityTextarea title="활동2" label="..." value={selfActivity2} onChange={...} />
<ActivityTextarea title="활동3" label="..." value={selfActivity3} onChange={...} />`}
        />
        <p>배열로 추상화하면 빈값 필터링이 한 줄로 끝난다.</p>
        <CodeBlock
          lang="tsx"
          code={`// ✅ after — 배열 + filter + map
const activities = [
  { title: '활동1', value: selfActivity1, onChange: setSelfActivity1 },
  { title: '활동2', value: selfActivity2, onChange: setSelfActivity2 },
  { title: '활동3', value: selfActivity3, onChange: setSelfActivity3 },
];

const visibleActivities = confirmPage
  ? activities.filter(({ value }) => !!value)   // confirm: 값 있는 것만
  : activities;                                  // edit: 전부

return (
  <ContLayout type="sm">
    {visibleActivities.map(({ title, value, onChange }) => (
      <ActivityTextarea
        key={title}
        title={title}
        label={ACTIVITY_PLACEHOLDER}
        value={value}
        maxLength={100}
        readOnly={confirmPage}
        onChange={onChange ?? NOOP}
      />
    ))}
  </ContLayout>
);`}
        />
        <p className="font-semibold text-gray-800 mt-2">얻는 것:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>활동 4번째 추가가 한 줄(배열 원소 추가) — JSX 안 건드림.</li>
          <li>동일한 긴 placeholder 문자열을 <IC>ACTIVITY_PLACEHOLDER</IC> 상수로 단일화 — 문구 수정이 한 곳.</li>
          <li><IC>{'NOOP = () => {}'}</IC> 모듈 상수 — 매 렌더마다 새 함수 생성 회피(메모리/리렌더 최적화).</li>
          <li>확인 모드 빈값 숨김이 <IC>.filter(...)</IC> 한 줄.</li>
        </ul>
      </StepCard>

      <StepCard phase={22} num={69} id="step69" title="변형 — 항상 N슬롯, 빈 슬롯은 placeholder">
        <p>희망 대학 카드는 한 발 더 나간다. "Confirm에서 항상 6슬롯을 보여주되, 채워진 카드 + 빈 placeholder 카드를 grid에 자동 정렬".</p>
        <CodeBlock
          lang="tsx"
          code={`<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
  {Array.from({ length: MAX_HOPE_CARDS }).map((_, idx) => {
    const item = hopeUnivsData?.[idx];
    if (item) {
      return <FilledCard key={item.num} item={item} />;
    }
    return (
      <div
        key={\`empty-\${idx}\`}
        className="... border-dashed bg-gray-50 text-gray-400 ..."
      >
        비어 있음
      </div>
    );
  })}
</div>`}
        />
        <Callout variant="key">
          <strong>핵심 기법:</strong> <IC>{'Array.from({ length: N })'}</IC>로 <strong>항상 N번 순회</strong>하고, 각 슬롯에서 데이터 유무로 분기.
          "데이터 길이만큼만 그린다"가 아니라 "<strong>항상 N개 슬롯을 그리고 각자 채울지 비울지 결정</strong>".
        </Callout>
        <p><IC>MAX_HOPE_CARDS</IC>를 공유 const(<IC>libs/const.ts</IC>)로 두고 <IC>handler.handleAddCard</IC>의 추가 제한과 의미를 일치시킴 — 한 곳에서 정책 관리.</p>
      </StepCard>

      {/* 세 가지 공통 골격 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">세 가지의 공통 골격</h4>
        </div>
        <FlowDiagram>{`1) 단일:     visible = mode ? hasValue : otherCond
2) 다중:     visibleItems = mode ? items.filter(hasValue) : items
3) 슬롯형:   N번 순회 + 각 슬롯: data[i] ? <Filled> : <Empty>`}</FlowDiagram>
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          <strong>모두 "표시할지 결정"이 데이터 + 모드의 함수</strong>라는 점이 같다. 새 항목이 추가되면 어느 패턴인지 먼저 물어보고 적용.
        </p>
      </div>

      {/* 디자인 원칙 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">디자인 원칙 — 두 줄</h4>
        </div>
        <Callout variant="key">
          <strong>Confirm은 진실의 거울이다.</strong> 사용자가 입력한 그대로만 보여줘야 한다. 빈 항목은 거울에 없어야 한다.
        </Callout>
        <Callout variant="key">
          <strong>반복 항목은 배열로 추상화하라.</strong> 분기·필터링·정렬이 한 줄로 끝난다.
          4번째 항목 추가가 JSX 안 건드리는지 보고 추상화의 성공을 판단.
        </Callout>
      </div>
    </section>
  )
}
