import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase31() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={31} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          별점(0.5 단위, 5점 만점) UI를 PC 마우스 드래그 + Mobile 터치로 지원하고 싶다.
          두 입력 방식을 따로 코딩하지 말고 통합하는 게 학습 포인트.
        </p>
      </div>

      <StepCard phase={31} num={111} id="step111" title="Pointer Events — 마우스+터치 통합 인터페이스">
        <p>브라우저에는 두 가지 입력 이벤트 계열이 있다:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-2">
          <li><strong>MouseEvents</strong> (<IC>onMouseDown/Move/Up</IC>): PC 마우스</li>
          <li><strong>TouchEvents</strong> (<IC>onTouchStart/Move/End</IC>): 모바일 터치</li>
        </ul>
        <p>이걸 둘 다 다루면 코드가 두 배. 대신 <strong>Pointer Events</strong>는 둘 다 통합한다:</p>
        <DataTable
          headers={['Pointer 이벤트', '마우스', '터치', '펜']}
          rows={[
            [<IC key="a">onPointerDown</IC>, 'mousedown', 'touchstart', 'pen down'],
            [<IC key="b">onPointerMove</IC>, 'mousemove', 'touchmove', 'pen move'],
            [<IC key="c">onPointerUp</IC>, 'mouseup', 'touchend', 'pen up'],
          ]}
        />
        <CodeBlock
          lang="tsx"
          code={`<div
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
>`}
        />
        <p>
          이 한 세트로 마우스·터치·펜 모두 처리. 추가로 <IC>onPointerCancel</IC>은 시스템이 입력을 끊는 경우(예: 시스템 모달 등장) 처리.
        </p>
      </StepCard>

      <StepCard phase={31} num={112} id="step112" title="setPointerCapture — 영역 밖으로 나가도 추적">
        <p>
          드래그 중 사용자가 컨테이너 밖으로 빠르게 손가락/마우스를 이동시키면 보통 <IC>onPointerMove</IC>/<IC>Up</IC> 이벤트가 끊긴다.
          <IC>setPointerCapture</IC>는 이걸 막아준다:
        </p>
        <CodeBlock
          lang="tsx"
          code={`const handlePointerDown = (e: React.PointerEvent) => {
  e.currentTarget.setPointerCapture(e.pointerId);   // ← 이 pointer는 이 요소가 끝까지 추적
  // ...
};`}
        />
        <p>사용자가 별 영역을 벗어나도 손 뗄 때까지 <IC>onPointerMove</IC>/<IC>Up</IC>이 계속 들어옴.</p>
      </StepCard>

      <StepCard phase={31} num={113} id="step113" title="두 레이어 width% 오버레이 — 시각 패턴">
        <p>
          별 5개를 0.5 단위로 표현하려면 별 하나하나를 분기하기보단
          <strong> 같은 배경을 두 번 깔고 전경의 width%로 채움 비율 표현</strong>:
        </p>
        <CodeBlock
          lang="tsx"
          code={`<div className="relative inline-block">
  {/* 배경: 빈 별 5개 */}
  <div className="flex text-gray-300">★★★★★</div>

  {/* 전경: 채워진 별 5개 — width 로 채움 비율 */}
  <div
    className="absolute top-0 left-0 flex overflow-hidden text-yellow-400 whitespace-nowrap"
    style={{ width: \`\${fillPercentage}%\` }}
  >
    ★★★★★
  </div>
</div>`}
        />
        <p>3.7 별, 1.5 별, 0.5 별 등 <strong>어떤 비율이든 자연스럽게 표현</strong>된다.</p>
        <p>이 패턴은 별점뿐 아니라 다른 진행 표시기에도 응용 가능 (HP 바, 로딩 등).</p>
      </StepCard>

      <StepCard phase={31} num={114} id="step114" title="0.5 단위 스냅 (또는 임의 단위)">
        <CodeBlock
          lang="typescript"
          code={`const calculateValue = (clientX: number) => {
  const rect = containerRef.current!.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(ratio * TOTAL_UNITS);
};`}
        />
        <p className="font-semibold text-gray-800 mt-2"><IC>TOTAL_UNITS</IC>가 곧 단위 해상도:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>TOTAL_UNITS = 5</IC> → 1.0 단위 (1, 2, 3, 4, 5)</li>
          <li><IC>TOTAL_UNITS = 10</IC> → 0.5 단위 (0.5, 1.0, 1.5, ...) — 5 stars × 2</li>
          <li><IC>TOTAL_UNITS = 100</IC> → 0.05 단위 (소수점 두 자리)</li>
        </ul>
        <p><IC>Math.round</IC>만으로 정확한 단위 스냅 가능.</p>
      </StepCard>

      <StepCard phase={31} num={115} id="step115" title="hoverValue vs value 분리 — 드래그 미리보기">
        <CodeBlock
          lang="typescript"
          code={`const [hoverValue, setHoverValue] = useState<number | null>(null);

const handlePointerDown = (e) => {
  // ...
  setHoverValue(calculateValue(e.clientX));   // ← 미리보기만
};

const handlePointerMove = (e) => {
  if (isDragging) setHoverValue(calculateValue(e.clientX));
};

const handlePointerUp = () => {
  if (hoverValue !== null) onChange(hoverValue);   // ← 손 떼는 순간 커밋
  setHoverValue(null);
};

const displayValue = hoverValue ?? value;   // 표시: 드래그 중엔 미리보기, 아니면 확정값`}
        />
        <p>
          이러면 <strong>부모는 손 떼는 순간 한 번만 리렌더</strong>. 드래그 중 매번 onChange 부르면 부모가 매 px마다 리렌더 → 성능 저하.
        </p>
      </StepCard>

      <StepCard phase={31} num={116} id="step116" title="내부 정수 vs 외부 표시 분리">
        <p>서버가 <IC>{'@IsInt()'}</IC>로 정수만 받는 상황. 0.5 단위 UI를 유지하면서 정수로 전송하려면:</p>
        <CodeBlock
          lang="typescript"
          code={`const TOTAL_STARS = 5;
const TOTAL_UNITS = TOTAL_STARS * 2;   // 10 — 반 별 단위로 쪼갠 총 눈금

// 내부 값(컴포넌트 외부 API): 0 ~ 10 정수
const value = 7;   // = 3.5 별

// 시각 표시 (라벨용)
const visualStars = value / 2;          // 3.5
const fillPercentage = (value / TOTAL_UNITS) * 100;   // 70%`}
        />
        <DataTable
          headers={['영역', '단위', '예시']}
          rows={[
            ['외부 (value/onChange)', '0 ~ 10 정수', <IC key="a">7</IC>],
            ['내부 시각', '5점 만점, 0.5 단위', '"3.5 / 5"'],
          ]}
        />
        <p>
          사용자엔 익숙한 5점 만점으로 보이고, 서버엔 정수로 전송.
          <strong> 백엔드 정수 컬럼 그대로 사용 가능</strong> (DB 마이그레이션 불필요).
        </p>
        <Callout variant="warn">
          <strong>단, 컨벤션을 백엔드 DTO 주석에 명시.</strong> "satisfiedRate: 0~10, 1 단위 = 반 별, 만점 10" 처럼.
          그렇지 않으면 평균 계산할 때 "왜 7점이 만점이지?" 같은 혼동 발생.
        </Callout>
      </StepCard>

      <StepCard phase={31} num={117} id="step117" title="disabled prop — 잠금 시 클릭 무시">
        <CodeBlock
          lang="typescript"
          code={`const handlePointerDown = (e) => {
  if (disabled) return;   // ← 가드
  // ...
};`}
        />
        <p>가드 + 시각 변화(<IC>cursor-not-allowed opacity-50</IC>)로 잠금 상태 표현.</p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>Pointer Events가 마우스/터치를 둘 다 처리한다.</strong> 따로 코딩하지 마라.
          <IC>setPointerCapture</IC>까지 곁들이면 드래그 추적이 안정적.
        </Callout>
        <Callout variant="key">
          <strong>시각적 비율 표현은 두 레이어 + width%가 가장 단순하다.</strong> 별 하나하나 분기하지 말고 같은 콘텐츠를 깔고 위 레이어의 width로 채움 비율 조절.
        </Callout>
        <Callout variant="key">
          <strong>드래그 미리보기는 컴포넌트 내부 <IC>hoverValue</IC>로.</strong> 부모 <IC>onChange</IC>는 손 떼는 순간만 호출. 성능 + 부모 코드 단순화.
        </Callout>
        <Callout variant="key">
          <strong>외부 단위와 내부 시각 단위를 분리할 수 있다.</strong> 서버 요구(정수)와 UX(0.5 단위)가 안 맞을 때 유용한 절충안.
        </Callout>
      </div>
    </section>
  )
}
