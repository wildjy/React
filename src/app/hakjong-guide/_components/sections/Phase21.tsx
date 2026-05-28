import { PhaseHeader } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase21() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={21} />

      {/* 증상 */}
      <div id="phase21-symptom" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-neutral-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🩺
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">증상</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          카드 삭제(X) 버튼을 누르면 "카드는 최대 6개까지 추가할 수 있습니다" alert가 뜨는 것처럼 보였다.
          그런데 코드를 보면 wiring이 멀쩡:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>handleDeleteCard</IC>: <IC>filter</IC>만, alert 없음.</li>
          <li><IC>handleAddCard</IC>: alert가 있긴 한데, <strong><IC>setSelectedCards</IC>의 updater 안</strong>에 있음.</li>
          <li><IC>CloseButton</IC>: <IC>type="button"</IC> + <IC>e.stopPropagation()</IC> — 다른 핸들러로 못 샘.</li>
        </ul>
      </div>

      {/* 원인 */}
      <div id="phase21-cause" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-neutral-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🔍
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">원인: React StrictMode의 의도적 이중 호출 + impure updater</h4>
        </div>
        <Callout variant="info">
          <strong>React 공식 가이드:</strong> State updater functions <strong>MUST be pure</strong>.
          They should only compute and return the next state.
          Don't call setState inside them, don't trigger side effects (alert, fetch, mutation...), don't mutate prev state.
        </Callout>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">문제의 코드는 정확히 이 규칙을 위반.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ updater 안에서 alert (side effect)
setSelectedCards((prevState) => {
  if (prevState.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return prevState;
  }
  return [newCard, ...prevState];
});`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          StrictMode(개발 모드)에서 React는 <strong>updater 함수를 의도적으로 두 번 호출</strong>한다 — pure하지 않은 updater를 잡아내기 위함. 그래서:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>handleAddCard 호출 1회 → updater 2회 실행 → <strong>alert 2회 발사</strong>.</li>
          <li>비동기/배치/concurrent 시나리오에서는 다른 시점에 또 실행될 수도 있어, 사용자에겐 "관련 없는 클릭에서 alert가 뜨는 것처럼" 느껴진다.</li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          여기서 사용자는 X 클릭 후 alert를 보고 "삭제가 alert를 띄운다"고 보고했다.
          실제론 직전 add 시도의 updater가 StrictMode/concurrent 타이밍에 다시 호출되거나, 다른 경로로 leak된 것.
        </p>
      </div>

      {/* 해결 */}
      <div id="phase21-fix" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-neutral-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🛠
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">해결: 검사를 updater 밖으로</h4>
        </div>
        <CodeBlock
          lang="typescript"
          code={`const handleAddCard = () => {
  // ...기존 validation...

  // ✅ updater 밖에서 검사 — 이벤트 핸들러 본문은 한 번만 실행됨
  if (selectedCards.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return;
  }

  setSelectedCards((prevState) => {
    if (prevState.some((card) => card.id === cardId)) return prevState;
    return [newCard, ...prevState];
  });
};`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">이렇게 하면:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>updater는 pure (이전 상태 조회 + 다음 상태 반환만).</li>
          <li>alert는 이벤트 핸들러 본문에서 한 번만 발사.</li>
          <li>StrictMode에서 updater가 두 번 돌아도 alert는 한 번.</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-3">보너스 — 같은 검사로 버튼 disabled까지:</p>
        <CodeBlock
          lang="tsx"
          code={`<Button disabled={selectedCards.length >= 6} onClick={onAddCard}>
  희망 대학 리스트에 추가
</Button>`}
        />
        <p>alert는 사용자가 강제로 시도했을 때의 안전망이고, 정상 흐름에서는 버튼이 비활성화돼 시도조차 안 하게 된다 → UX 명확.</p>
      </div>

      {/* 부수 정리: 6슬롯 placeholder */}
      <div id="phase21-placeholder" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ➕
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Phase 21 짧은 부수 정리: 6슬롯 placeholder</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          확인 페이지의 희망 대학 카드는 항상 6슬롯을 보여주고 싶었다. 카드가 2개면 4개는 "비어 있음" placeholder.
        </p>
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
        <p>
          <IC>MAX_HOPE_CARDS = 6</IC>을 공유 const(<IC>libs/const.ts</IC>)에 두고 handler.handleAddCard의 추가 제한과 의미를 일치시킴 — 한 곳에서 정책 관리.
        </p>
      </div>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-neutral-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>setState의 updater는 pure function이다.</strong> <IC>{'(prev) => next'}</IC> 외 다른 일은 하지 마라.
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>검증/alert/console.log → handler 본문 (updater 밖)</li>
            <li>다른 setState 호출 → handler 본문 또는 useEffect</li>
            <li>외부 API 호출 → handler 본문 또는 useEffect</li>
          </ul>
          <p className="mt-2">
            StrictMode dev에서 updater가 두 번 호출되는 건 <strong>버그가 아니라 기능</strong>이다.
            그 안에서 두 번 일어나면 안 되는 일(alert, fetch 등)을 미리 잡아준다. "왜 알람이 두 번 뜨지?"가 신호다.
          </p>
        </Callout>
        <Callout variant="key">
          <strong>"왜 다른 곳에서 부작용이 발생하지?"라는 미스터리의 절반은 impure updater다.</strong>{' '}
          updater에 side effect를 넣지 않으면, 진단 시간이 절약된다.
        </Callout>
      </div>
    </section>
  )
}
