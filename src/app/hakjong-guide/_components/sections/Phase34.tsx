import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase34() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={34} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">Q&A 섹션 코드에서 발견한 한 줄:</p>
        <CodeBlock
          lang="tsx"
          code={`{datas?.items?.length && datas?.items?.length === 0 && (
  <div>...첫 회차 질문 카드...</div>
)}`}
        />
        <p>
          화면을 아무리 새로고침해도 첫 회차 카드가 안 나타남. 코드를 한참 들여다본 뒤에야 알아챔 — <strong>조건이 영원히 false</strong>.
        </p>
      </div>

      <StepCard phase={34} num={128} id="step128" title="모순 조건 진단">
        <p>조건을 분해:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>datas?.items?.length</IC> — truthy여야 함 (즉, length가 1 이상)</li>
          <li><IC>{'&& datas?.items?.length === 0'}</IC> — length가 정확히 0이어야 함</li>
        </ul>
        <Callout variant="warn">
          같은 값이 동시에 <IC>{'> 0'}</IC>이면서 <IC>= 0</IC>일 수는 없다. <strong>두 조건의 교집합은 ∅</strong>.
          따라서 블록 본문은 절대 실행 안 됨.
        </Callout>
        <p>
          원인 추측: <IC>=== 0</IC> 부분이 다른 의도(또는 디버깅 코드)였거나, copy-paste 후 수정 누락.
          컴파일러는 잡지 못함 — 둘 다 타입은 valid <IC>boolean</IC>.
        </p>
      </StepCard>

      <StepCard phase={34} num={129} id="step129" title="의도 복원 — items 있을 때만 렌더">
        <p>블록 안의 <IC>items.slice(0, 1).map(...)</IC>가 단서:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>첫 항목만 잘라서 표시</li>
          <li>→ "items가 1개 이상 있을 때만"이 의도</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2">올바른 조건:</p>
        <CodeBlock
          lang="tsx"
          code={`{(datas?.items?.length ?? 0) > 0 && (
  <div>...첫 회차 질문 카드...</div>
)}`}
        />
      </StepCard>

      <StepCard phase={34} num={130} id="step130" title='length && ... 의 또 다른 함정 — 화면에 "0" 이 찍힘'>
        <p>위 조건을 단순히 이렇게 줄이고 싶을 수 있다:</p>
        <CodeBlock
          lang="tsx"
          code={`// ❌ length 자체를 truthy 검사로
{datas?.items?.length && (<div>...</div>)}`}
        />
        <p>
          이건 동작은 하는데 — items가 빈 배열일 때 <strong>화면에 숫자 <IC>0</IC>이 그대로 찍힌다</strong>.
        </p>
        <p className="font-semibold text-gray-800 mt-2">이유:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>React: "truthy면 오른쪽 표현식 렌더, falsy면 그 값을 렌더"</li>
          <li><IC>{'0 && <div/>'}</IC> → 단락 평가(short-circuit)로 <IC>0</IC> 반환</li>
          <li>React는 <IC>0</IC>을 텍스트 노드로 렌더 (<IC>null</IC>, <IC>undefined</IC>, <IC>false</IC>만 무시함)</li>
        </ul>
        <FlowDiagram>{`items.length = 0   → 0 && <div/>   → 0          → 화면에 "0"
items.length = 3   → 3 && <div/>   → <div/>     → 정상
items = undefined  → undefined && <div/> → undefined → 무시`}</FlowDiagram>
        <p>이 함정은 <strong>숫자 값을 직접 boolean으로 쓰는 모든 곳</strong>에 도사림.</p>
      </StepCard>

      <StepCard phase={34} num={131} id="step131" title="안전한 표현 3가지">
        <CodeBlock
          lang="tsx"
          code={`// ✅ 명시적 비교 — 가장 명확
{(datas?.items?.length ?? 0) > 0 && <div>...</div>}

// ✅ boolean 캐스팅 — 짧음
{!!datas?.items?.length && <div>...</div>}

// ✅ ternary — null 명시
{datas?.items?.length ? <div>...</div> : null}`}
        />
        <p>
          세 패턴 모두 <IC>0</IC> 함정 회피. 코드 컨벤션에 따라 선택.
          우리 프로젝트는 명시적 비교(<IC>{'> 0'}</IC>)를 선호 — 읽는 사람이 의도(0보다 큰 경우)를 즉시 알 수 있음.
        </p>
        <DataTable
          headers={['패턴', '장점', '단점']}
          rows={[
            [<IC key="a">{'length > 0'}</IC>, '의도 명시, IDE/리뷰어 친화', '길다'],
            [<IC key="b">!!length</IC>, '짧음', <><IC key="b2">!!</IC>가 익숙하지 않은 사람엔 noise</>],
            [<IC key="c">{'length ? … : null'}</IC>, '거짓 분기 표현 가능', 'else가 필요 없을 때 noise'],
          ]}
        />
      </StepCard>

      <StepCard phase={34} num={132} id="step132" title="React falsy 렌더 규칙 정리">
        <p>JSX가 "무시"하는 값:</p>
        <DataTable
          headers={['값', '렌더 결과']}
          rows={[
            [<IC key="a">null</IC>, '무시'],
            [<IC key="b">undefined</IC>, '무시'],
            [<IC key="c">false</IC>, '무시'],
            [<IC key="d">true</IC>, '무시 (의외)'],
            [<IC key="e">0</IC>, <><strong>"0" 텍스트 렌더</strong> ← 함정</>],
            [<IC key="f">{"'' (빈 문자열)"}</IC>, '무시'],
            [<IC key="g">NaN</IC>, <><strong>"NaN" 텍스트 렌더</strong></>],
          ]}
        />
        <Callout variant="warn">
          <IC>0</IC>과 <IC>NaN</IC>만 다르다. 숫자 표현식을 <IC>&&</IC>의 왼쪽에 둘 때 항상 의식해야 함.
        </Callout>
      </StepCard>

      <StepCard phase={34} num={133} id="step133" title="조건문 가독성 체크리스트">
        <p>코드 리뷰 시 다음을 보면 거의 잡힘:</p>
        <ol className="list-decimal pl-5 space-y-2 text-[14px] text-gray-700 leading-7">
          <li><strong><IC>&&</IC> 양쪽이 의미적으로 같은 변수의 다른 비교?</strong> → 모순 가능성. 본문에 진입 가능한 케이스가 정말 있는지 확인.</li>
          <li><strong><IC>&&</IC> 왼쪽이 숫자/문자열?</strong> → <IC>0</IC> / <IC>{"''"}</IC> / <IC>NaN</IC> 함정 검토.</li>
          <li><strong><IC>?.length</IC>만 단독으로 truthy 검사?</strong> → boolean 캐스팅 또는 명시 비교.</li>
          <li><strong><IC>!</IC>가 두 번 이상 들어간 조건?</strong> → 드모르간 변환 검토. (<IC>!a && !b</IC> → <IC>{'!(a || b)'}</IC>)</li>
          <li><strong>조건 안에 옵셔널 체이닝이 깊이 3 이상?</strong> → 가독성 ↓, 변수로 빼내기.</li>
        </ol>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong><IC>&&</IC> 양쪽이 모순일 수 있다.</strong> 모순 조건은 컴파일도, 린트도 잡지 않는다. 코드 리뷰가 마지막 방어선.
        </Callout>
        <Callout variant="key">
          <strong>숫자를 <IC>&&</IC> 왼쪽에 두지 마라.</strong> <IC>0</IC>이 그대로 렌더된다.
          <IC>{'> 0'}</IC>, <IC>!!</IC>, ternary 중 하나로 boolean으로 만들어야 한다.
        </Callout>
        <Callout variant="key">
          <strong>"왜 안 나오지?"라면 첫 의심은 조건문.</strong> map/slice가 멀쩡한데 안 보이면, 둘러싼 <IC>&&</IC>가 거짓이거나 모순일 가능성이 높다.
        </Callout>
      </div>
    </section>
  )
}
