import { PhaseHeader } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase14() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={14} />

      {/* 증상 */}
      <div id="phase14-symptom" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🩺
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">증상</h4>
        </div>
        <CodeBlock
          lang="text"
          code={`Invalid hook call. Hooks can only be called inside of the body of a function component.`}
        />
      </div>

      {/* 원인 */}
      <div id="phase14-cause" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🔍
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">원인: 일반 함수 안에서 훅 호출</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          API 파일에서 <IC>useCurrentUser()</IC>를 <strong>모듈 최상단 / 일반 async 함수 안</strong>에서 부르고 있었습니다.
        </p>
        <CodeBlock
          lang="typescript"
          path="api/index.ts"
          code={`// ❌ 컴포넌트도 커스텀 훅도 아닌 곳에서 훅 호출
const { currentUser } = useCurrentUser();           // 모듈 최상단
export const fetchStudentRecordComparativeStatus = async () => {
  // 또는 이렇게 async 함수 안에서도 ❌
  const { currentUser } = useCurrentUser();
  ...
};`}
        />
        <Callout variant="warn">
          <strong>React의 훅 규칙(Rules of Hooks):</strong> 훅은 오직 <strong>① React 함수 컴포넌트 본문</strong>과
          <strong> ② 다른 커스텀 훅 본문</strong>에서만 호출할 수 있습니다. 일반 함수, 클래스, 조건문/반복문 안에서는 안 됩니다.
          React가 훅 호출 순서로 상태를 추적하기 때문입니다.
        </Callout>
      </div>

      {/* 해결 */}
      <div id="phase14-fix" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🛠
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">해결: 값은 인자로, 훅 호출은 훅 안에서</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          API 함수는 훅을 부르지 말고 <strong>필요한 값(<IC>userId</IC>)을 인자로 받습니다.</strong>
          훅 호출은 이 함수를 감싸는 <strong>query 훅 안</strong>에서 합니다(거긴 합법).
        </p>
        <CodeBlock
          lang="typescript"
          path="api/index.ts"
          code={`// ✅ 순수 함수, userId는 파라미터
export const fetchStudentRecordComparativeStatus = async (userId: string) => { ... };`}
        />
        <CodeBlock
          lang="typescript"
          path="queries.ts"
          code={`// ✅ 커스텀 훅 안이라 useCurrentUser 호출 가능
export const useStudentRecordComparativeStatusQuery = () => {
  const { currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ['studentRecordComparativeStatus', currentUser.userId],
    queryFn: () => fetchStudentRecordComparativeStatus(currentUser.userId),
    enabled: !!currentUser.userId,   // userId 준비 전엔 실행 안 함
  });
};`}
        />
        <Callout variant="key">
          <strong>한 줄 요약:</strong> "이 코드는 컴포넌트/커스텀 훅 본문인가?"를 먼저 물어보세요.
          아니라면 훅을 부르지 말고, 그 값을 <strong>인자로 받도록</strong> 함수 시그니처를 바꾸세요.
        </Callout>
      </div>
    </section>
  )
}
