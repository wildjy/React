import { FlowDiagram } from '../../../hakjong-guide/_components/ui/StepCard'
import { Callout, IC } from '../../../hakjong-guide/_components/ui/Callout'
import { CodeBlock } from '../../../hakjong-guide/_components/ui/CodeBlock'
import { DataTable } from '../../../hakjong-guide/_components/ui/DataTable'

/**
 * 🔧 Top 10 막힘 사전
 *
 * 통일 포맷:
 *   30초 요약 → 문제 → 원인 → 해결 (❌ Before / ✅ After) → 반복 등장 → 더 깊이(원본 Phase)
 */
export function TopTen() {
  return (
    <section id="top-ten" className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-lg shrink-0">
          🔧
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Top 10 막힘 사전</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">자주 막힘 + 다른 모양으로 반복되는 함정 10가지</p>
        </div>
      </div>

      <Item01 />
      <Item02 />
      <Item03 />
      <Item04 />
      <Item05 />
      <Item06 />
      <Item07 />
      <Item08 />
      <Item09 />
      <Item10 />
    </section>
  )
}

/* ───────────── 공통 헬퍼 ───────────── */

function ItemCard({
  num,
  symptom,
  summary,
  category,
  originalPhase,
  children,
}: {
  num: number
  symptom: string
  summary: React.ReactNode
  category: string
  originalPhase: string
  children: React.ReactNode
}) {
  return (
    <div
      id={`item-${num}`}
      className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5 scroll-mt-20"
    >
      {/* 헤더: 번호 + 증상 */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shrink-0">
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-gray-900 leading-snug">
            🔍 &quot;{symptom}&quot;
          </h3>
          <div className="flex flex-wrap gap-2 mt-1.5 text-[11px]">
            <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5">{category}</span>
            <span className="bg-indigo-50 text-indigo-700 rounded px-2 py-0.5">
              원본: {originalPhase}
            </span>
          </div>
        </div>
      </div>

      {/* 30초 요약 */}
      <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r px-4 py-3 mb-4 text-[13px] text-gray-800 leading-7">
        <strong className="text-rose-700">30초 요약:</strong> {summary}
      </div>

      {/* 본문 */}
      <div className="space-y-3 text-[14px] text-gray-700 leading-7">{children}</div>
    </div>
  )
}

function SubHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h4 className="text-[14px] font-bold text-gray-900 mt-4 mb-1 flex items-center gap-1.5">
      <span>{icon}</span>
      {children}
    </h4>
  )
}

function RecurAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 text-[13px] text-amber-900 leading-7">
      <span className="font-bold">⚠️ 반복 등장 알림 — </span>
      {children}
    </div>
  )
}

function DeepLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mt-3 text-[13px] text-slate-700 leading-7">
      <span className="font-bold">📚 더 깊이 — </span>
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────
   Top 10 항목들
   ──────────────────────────────────────────── */

function Item01() {
  return (
    <ItemCard
      num={1}
      symptom="저장은 200으로 떨어졌는데 화면이 옛값 그대로"
      summary={
        <>
          <IC>useQueryClient()</IC> 훅(<IC>new QueryClient()</IC> 아님)으로 진짜 인스턴스를 가져와
          mutation의 <IC>onSuccess</IC>에서 <IC>{'invalidateQueries({ queryKey })'}</IC> 호출.
          캐시가 안 갱신되면 화면도 안 바뀐다.
        </>
      }
      category="⑥ 데이터 전송 (쓰기)"
      originalPhase="Phase 30"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>
        질문 제출 → 서버 200 OK. 하지만 카운트가 그대로 <IC>3</IC>. 사용자가 한 번 더 누름. 또 보내짐.
        직전에 보낸 질문은 어디에도 반영 안 됨.
      </p>

      <SubHeading icon="🔍">원인</SubHeading>
      <p>
        mutation은 서버 상태를 바꾸지만 <strong>React Query 캐시는 자동으로 안 건드린다</strong>. 명시적으로 알려줘야 함.
      </p>
      <FlowDiagram>{`t=0  qnaListData = { remainingQuestions: 3, items: [] }   ← 캐시
     사용자: 첫 제출 → POST 성공 → 서버: remainingQuestions=2
t=1  하지만 클라이언트 캐시는 그대로 { remainingQuestions: 3, ... }
     가드: 옛값 사용 → 통과 → 또 제출`}</FlowDiagram>

      <SubHeading icon="🛠">해결</SubHeading>
      <p className="font-semibold text-gray-800 mt-2">❌ 결정적 함정 — new QueryClient()</p>
      <CodeBlock
        lang="typescript"
        code={`onSuccess: () => {
  const queryClient = new QueryClient();   // ← 새 빈 인스턴스!
  queryClient.invalidateQueries({ queryKey });
};`}
      />
      <p>
        <IC>new QueryClient()</IC>는 <strong>앱이 안 쓰는</strong> 빈 인스턴스. invalidate가 실제 캐시엔 무영향.
      </p>

      <p className="font-semibold text-gray-800 mt-2">✅ 정답 — useQueryClient() 훅</p>
      <CodeBlock
        lang="typescript"
        code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient(); // ✅ 앱의 진짜 인스턴스
  return useMutation({
    mutationFn: submitAdmissionReportQna,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['admissionReportQnaList', userId],
      });
    },
  });
}`}
      />

      <SubHeading icon="📍">invalidate 표준 위치 — mutation 정의 안</SubHeading>
      <DataTable
        headers={['위치', '담당']}
        rows={[
          [<strong key="a">정의 안 onSuccess</strong>, '캐시 invalidate, 공통 로깅 (← invalidate 는 여기에)'],
          [<strong key="b">호출 시 onSuccess</strong>, 'UI 후속 (form reset, alert, 페이지 이동)'],
        ]}
      />
      <Callout variant="info">
        둘 다 실행됨. 정의가 먼저, 호출이 그 다음. 역할만 분담하면 충돌 없음. <strong>alert 중복 주의</strong> — 정의/호출 양쪽에 alert 두면 사용자에게 2번 보임.
      </Callout>

      <RecurAlert>
        invalidate 관련 함정 2회차 — Phase 17(통째 호출)도 같은 결: 의도치 않은 effect/쿼리가 함께 발사되어 화면이 어긋남.
      </RecurAlert>

      <DeepLink>
        <strong>원본 Phase 30</strong> — 전체 상황 · optimistic update까지 / 짝꿍 <strong>Phase 32</strong> — derived value + invalidate는 한 쌍
      </DeepLink>
    </ItemCard>
  )
}

function Item02() {
  return (
    <ItemCard
      num={2}
      symptom="코드 멀쩡한데 콘솔이 'Invalid hook call'로 폭발"
      summary={
        <>
          훅은 오직 <strong>① 함수 컴포넌트 본문</strong> 또는 <strong>② 커스텀 훅 본문</strong>에서만.
          API 함수 · 서버 함수 · async 함수 안에서 부르면 즉시 폭발. 값이 필요하면 <strong>인자로 받아라.</strong>
        </>
      }
      category="⑤ 상태 설계 / ⑧ 디버깅"
      originalPhase="Phase 14 · Phase 29"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <CodeBlock
        lang="text"
        code={`Invalid hook call. Hooks can only be called inside of the body of a function component.`}
      />
      <p>
        API 파일 · 서버 함수 안에서 <IC>useCurrentUser()</IC> 같은 훅을 호출한 케이스.
      </p>

      <SubHeading icon="🔍">원인 — React 훅 규칙 (Rules of Hooks)</SubHeading>
      <p>훅은 React가 <strong>호출 순서</strong>로 상태를 추적한다. 그래서:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>함수 컴포넌트 본문 — OK ✅</li>
        <li>커스텀 훅 본문 (<IC>useXxx</IC>) — OK ✅</li>
        <li>일반 함수 / async 함수 안 — ❌</li>
        <li>조건문 / 반복문 안 — ❌</li>
        <li>모듈 최상단 — ❌</li>
        <li>서버 함수 (<IC>.server.ts</IC>, <IC>app/api/.../route.ts</IC>) — ❌ (서버엔 React 렌더 트리 없음)</li>
        <li><IC>alert</IC>도 서버에선 <IC>ReferenceError</IC> (<IC>window</IC> 없음)</li>
      </ul>

      <SubHeading icon="🛠">해결</SubHeading>
      <p className="font-semibold text-gray-800 mt-2">❌ 일반 async 함수 안</p>
      <CodeBlock
        lang="typescript"
        path="api/index.ts"
        code={`export const fetchStudentRecordComparativeStatus = async () => {
  const { currentUser } = useCurrentUser(); // ❌
  return apiClient().get(\`status/\${currentUser.userId}\`).json();
};`}
      />

      <p className="font-semibold text-gray-800 mt-2">✅ 값은 인자로, 훅 호출은 훅 안에서</p>
      <CodeBlock
        lang="typescript"
        path="api/index.ts"
        code={`// 순수 함수 — userId는 파라미터
export const fetchStudentRecordComparativeStatus = async (userId: string) => {
  return apiClient().get(\`status/\${userId}\`).json();
};`}
      />
      <CodeBlock
        lang="typescript"
        path="queries.ts"
        code={`// 커스텀 훅 본문이라 합법
export const useStudentRecordComparativeStatusQuery = () => {
  const { currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ['studentRecordComparativeStatus', currentUser.userId],
    queryFn: () => fetchStudentRecordComparativeStatus(currentUser.userId),
    enabled: !!currentUser.userId,
  });
};`}
      />

      <SubHeading icon="⚠">use* 접두사 함정 (서버 영역)</SubHeading>
      <p>
        서버 함수에 <IC>useXxxNavigationHandler</IC>처럼 이름 붙이면 ESLint <IC>react-hooks/rules-of-hooks</IC>가
        <strong> 즉시 검사 시작</strong>. 훅이 아니면 동사형 이름으로 (<IC>getXxx</IC>, <IC>ensureXxx</IC>, <IC>fetchXxx</IC>).
      </p>
      <CodeBlock
        lang="typescript"
        code={`// ❌
export async function useAdmissionEvaluationNavigationHandler() { ... }

// ✅
export async function ensureAdmissionEvaluationAccess() { ... }`}
      />

      <RecurAlert>
        훅 잘못 부른 함정 2회차 — Phase 14(API 파일에서) / Phase 29(Next.js 서버 함수에서). 같은 규칙, 다른 컨텍스트.
      </RecurAlert>

      <DeepLink>
        <strong>Phase 14</strong> — 클라이언트 컨텍스트 / <strong>Phase 29</strong> — 서버 컴포넌트 가드 (<IC>use*</IC> 접두사 + <IC>alert</IC> 함정 + options 패턴)
      </DeepLink>
    </ItemCard>
  )
}

function Item03() {
  return (
    <ItemCard
      num={3}
      symptom="선택 입력란 비우고 제출했더니 'should not be empty'로 거부됨"
      summary={
        <>
          NestJS <IC>class-validator</IC>의 <IC>@IsNotEmpty()</IC> 기본 메시지. <strong>서버 DTO 쪽</strong>을
          <IC>@IsOptional()</IC>로 바꾸면 끝. <strong>프론트 변경 없음</strong>(빈 값 보내는 게 정상).
          단, 선택 필드 N개를 <strong>한 번에</strong> 처리 — 첫 에러에서 막힘.
        </>
      }
      category="⑥ 데이터 전송 / ⑧ 디버깅"
      originalPhase="Phase 11"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>학종 신청 화면에서 <strong>선택 입력 필드를 비워둔 채</strong> [입력완료] → 신청 실패 + alert.</p>
      <p>콘솔:</p>
      <CodeBlock
        lang="text"
        code={`학종 신청 실패: VALIDATION_PIPE_ERROR: subjectNot should not be empty
    at async submitAdmissionEvaluationApply (index.ts:102:16)`}
      />

      <SubHeading icon="🔍">원인</SubHeading>
      <p>
        서버 신청 DTO에 <IC>@IsNotEmpty()</IC>가 걸려 있어 <IC>{"subjectNot: ''"}</IC> 빈 문자열을 거부.
        <strong> 프론트–서버 계약 불일치</strong> — 기획상 선택 필드인데 서버는 필수.
      </p>

      <SubHeading icon="🛠">해결 — 서버 (프론트 변경 없음)</SubHeading>
      <p>
        <strong>선택 필드 5개를 한 번에</strong> <IC>@IsOptional()</IC>로 변경:
      </p>
      <DataTable
        headers={['필드', 'UI 표기', '구분']}
        rows={[
          [<IC key="a">subjectNot</IC>, '비교과 추가 입력', '선택'],
          [<IC key="b">emphasis1~3</IC>, '강조하고 싶은 내용 1~3', '선택'],
          [<IC key="c">simpleQuestion</IC>, '간단 질문하기', '선택'],
        ]}
      />
      <CodeBlock
        lang="typescript"
        code={`// ❌ 변경 전
@IsNotEmpty()
subjectNot: string;

// ✅ 변경 후
@IsOptional()
subjectNot?: string;`}
      />
      <p>
        <strong>필수로 유지 (변경 금지):</strong> <IC>userId</IC>, <IC>majorIdHsbs</IC>, <IC>preferAiPartsCodes</IC>, <IC>preferProvsCodes</IC>
      </p>

      <SubHeading icon="⚠">흔한 실수 / 놓치는 부분</SubHeading>
      <ul className="list-disc pl-5 space-y-1">
        <li>❌ 빈 값을 통과시키려 프론트에서 더미 문자열 채우기 → <strong>데이터 오염 + 임시/플레이스홀더 코드 금지 원칙 위반</strong></li>
        <li>❌ <IC>subjectNot</IC>만 풀고 끝 → <IC>class-validator</IC>는 첫 에러에서 막힘 → 다음 빈 필드(<IC>emphasis1</IC> …)에서 동일 증상 재발</li>
        <li>✅ <strong>선택 필드 전부 한 번에</strong> 처리</li>
      </ul>

      <DeepLink>
        <strong>Phase 11</strong> — 전체 진단 · 확인 경로 / <strong>Phase 4 Step 17</strong> — try/catch 패턴 (<IC>Uncaught (in promise)</IC> 방지)
      </DeepLink>
    </ItemCard>
  )
}

function Item04() {
  return (
    <ItemCard
      num={4}
      symptom="수정하기 들어왔는데 드롭다운에 placeholder만 떠요"
      summary={
        <>
          서버 응답의 코드 필드는 <IC>number</IC>, 옵션 <IC>value</IC>는 <IC>string</IC>. DropDown은 <IC>===</IC>로 매치
          → <IC>{"'1' === 1"}</IC> = <strong>false</strong> → 라벨 안 보임.
          <strong> 사용처마다 <IC>String(...)</IC></strong>으로 정규화. 진짜 해결은 <strong>백엔드가 응답을 string으로 통일</strong>.
        </>
      }
      category="⑧ 디버깅 / ④ UI 조립"
      originalPhase="Phase 20"
    >
      <SubHeading icon="🩺">문제 — 두 가지 증상</SubHeading>
      <p className="font-semibold text-gray-800 mt-2">증상 ① — 서버 검증이 막은 경우 (왁자지껄하게 죽음)</p>
      <p>수정하기로 들어와 prefetch 후 입력완료:</p>
      <CodeBlock lang="text" code={`VALIDATION_PIPE_ERROR: each value in majorIdHsbs must be a string`} />

      <p className="font-semibold text-gray-800 mt-2">증상 ② — UI가 조용히 비어 있음 (소리 없이 죽음)</p>
      <p>선호 지역 드롭다운이 prefetch 후에도 placeholder만. 콘솔 로그는 정상 데이터.</p>

      <SubHeading icon="🔍">원인 — 요청 ↔ 응답 비대칭</SubHeading>
      <CodeBlock
        lang="json"
        code={`// 신청 POST 요청 — Swagger: string 필수
{ "majorIdHsbs": ["12345", "12346"], "preferProvsCodes": ["1", "2"] }

// 조회 응답 — number 로 옴
{ "univCode": 1046, "majorIdHsb": 16219191, "preferProvsCode": 1 }`}
      />
      <p>
        타입 단언(<IC>{'.json<HopeUnivsResponse[]>()'}</IC>)은 <strong>검증이 아니다</strong>. 서버가 다른 형식 줘도 TS는 안 잡음.
      </p>

      <p className="font-semibold text-gray-800 mt-2">증상 ① 추적:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>prefetch가 응답의 <IC>majorIdHsb: 16219191</IC>(number)를 <IC>drop3.value</IC>에 그대로 넣음</li>
        <li>타입은 <IC>StringDropDownOption.value: string</IC>인데 런타임은 number — <strong>silent type drift</strong></li>
        <li><IC>handleSubmit</IC>이 <IC>card.options.drop3.value</IC>를 모아 <IC>majorIdHsbs</IC>로 보냄 → <IC>number[]</IC> JSON</li>
        <li>서버 <IC>{'@IsString({ each: true })'}</IC> 차단</li>
      </ol>

      <p className="font-semibold text-gray-800 mt-2">증상 ② 추적:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>DropDown: <IC>selectedValue === option.value</IC>로 라벨 표시</li>
        <li>옵션 출처: 서버가 <IC>preferProvsCode: 1</IC>(number) → <IC>option.value = 1</IC>(number)</li>
        <li>복원값: <IC>{"String(provCode) = '1'"}</IC>(string)</li>
        <li><IC>{"'1' === 1"}</IC> → <strong>false</strong> → 빈 드롭다운</li>
      </ul>

      <SubHeading icon="🛠">해결 — 사용처별 String(...) 정규화</SubHeading>
      <CodeBlock
        lang="typescript"
        code={`// 1) 카드 복원
drop1: { value: String(item.univCode), label: item.univName },
drop3: { value: String(item.majorIdHsb), label: item.majorName },

// 2) 선호 복원
drop5: { value: String(pa1.provCode), label: pa1.provName },

// 3) 옵션 매핑
{ label: item.preferProvsName, value: String(item.preferProvsCode) }
{ label: item.preferAiPartsName, value: String(item.preferAiPartsCode) }`}
      />

      <SubHeading icon="🎯">정규화 위치 트레이드오프</SubHeading>
      <DataTable
        headers={['위치', '장점', '단점']}
        rows={[
          [<strong key="a">백엔드 통일</strong>, '단일 해결, 프론트 코드 그대로', '배포·협의 필요'],
          [<><strong key="b">API boundary</strong> (<IC key="b2">fetchXxx</IC>)</>, '한 번 normalize, 모든 사용처 안전', '약간의 boilerplate'],
          [<><strong key="c">사용처마다</strong> (<IC key="c2">String(...)</IC>)</>, '변경 범위 최소', <><strong>새 사용처 추가 시 빠뜨리기 쉬움</strong> — 함정</>],
        ]}
      />

      <SubHeading icon="✅">진짜 해결 — 백엔드 통일 + TODO 추적</SubHeading>
      <CodeBlock
        lang="typescript"
        code={`/**
 * TODO(backend): 응답 코드 필드를 모두 string으로 통일 요청.
 *   - univCode, majorIdHsb, preferAiPartsCode, preferProvsCode 등
 * 통일 완료 시 String(...) 정규화 모두 제거 가능.
 */`}
      />

      <RecurAlert>
        타입은 맞는데 런타임 어긋남 패턴 — Phase 20(number/string) / Phase 34(length=0 vs length&gt;0 모순) 모두 컴파일러는 못 잡고 코드 리뷰가 마지막 방어선.
      </RecurAlert>

      <DeepLink>
        <strong>Phase 20</strong> — 모든 영향 엔드포인트 매트릭스
      </DeepLink>
    </ItemCard>
  )
}

function Item05() {
  return (
    <ItemCard
      num={5}
      symptom="버튼 한 번 눌렀는데 alert가 두 번 떠요"
      summary={
        <>
          <IC>setState</IC> updater는 <strong>pure function</strong>이어야 한다. 검증 · <IC>alert</IC> · <IC>console.log</IC> 등 side effect는 updater <strong>밖</strong>(이벤트 핸들러 본문)으로.
          StrictMode dev는 의도적으로 updater를 두 번 호출해서 잡아낸다 — 버그가 아니라 기능.
        </>
      }
      category="⑤ 상태 설계 / ⑧ 디버깅"
      originalPhase="Phase 21"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>카드 삭제 X 버튼 → "카드는 최대 6개까지 추가할 수 있습니다" alert. 하지만 코드는 멀쩡:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><IC>handleDeleteCard</IC>: <IC>filter</IC>만, alert 없음</li>
        <li><IC>handleAddCard</IC>: alert 있긴 한데 <strong><IC>setSelectedCards</IC>의 updater 안</strong></li>
        <li><IC>CloseButton</IC>: <IC>type="button"</IC> + <IC>e.stopPropagation()</IC> — 다른 핸들러로 못 샘</li>
      </ul>

      <SubHeading icon="🔍">원인 — Impure updater + StrictMode 이중 호출</SubHeading>
      <Callout variant="info">
        React 공식: <strong>State updater functions MUST be pure.</strong> 다음 state 계산 · 반환만. setState 호출 · side effect · prev state 변형 X.
      </Callout>
      <p>
        StrictMode(개발 모드)는 updater를 <strong>의도적으로 두 번 호출</strong> — pure하지 않은 updater 잡아내려고. 그래서:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><IC>handleAddCard</IC> 한 번 호출 → updater 두 번 실행 → <strong><IC>alert</IC> 두 번 발사</strong></li>
        <li>비동기 · 배치 · concurrent 시나리오에선 사용자에게 "관련 없는 클릭에서 alert가 뜨는 것처럼" 느껴짐</li>
      </ul>

      <SubHeading icon="🛠">해결 — 검사를 updater 밖으로</SubHeading>
      <p className="font-semibold text-gray-800 mt-2">❌ updater 안에서 alert</p>
      <CodeBlock
        lang="typescript"
        code={`setSelectedCards((prevState) => {
  if (prevState.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.'); // side effect
    return prevState;
  }
  return [newCard, ...prevState];
});`}
      />

      <p className="font-semibold text-gray-800 mt-2">✅ updater 밖에서 검사</p>
      <CodeBlock
        lang="typescript"
        code={`const handleAddCard = () => {
  if (selectedCards.length >= 6) {
    // ← 이벤트 핸들러 본문 (한 번만 실행)
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return;
  }
  setSelectedCards((prevState) => {
    if (prevState.some((card) => card.id === cardId)) return prevState;
    return [newCard, ...prevState];
  });
};`}
      />

      <SubHeading icon="🎁">보너스 — 같은 검사로 버튼 disabled까지</SubHeading>
      <CodeBlock
        lang="tsx"
        code={`<Button disabled={selectedCards.length >= 6} onClick={onAddCard}>
  희망 대학 리스트에 추가
</Button>`}
      />
      <p>
        <IC>alert</IC>는 사용자가 강제 시도한 안전망, 정상 흐름은 버튼이 비활성 → UX 명확.
      </p>

      <Callout variant="key">
        <strong>한 줄로 외우기:</strong> setState updater는 <IC>{'(prev) => next'}</IC> <strong>외 다른 일은 하지 마라.</strong>
        <ul className="list-disc pl-5 mt-1 space-y-0.5">
          <li>검증/alert/console.log → handler 본문 (updater 밖)</li>
          <li>다른 setState → handler 또는 useEffect</li>
          <li>외부 API 호출 → handler 또는 useEffect</li>
        </ul>
      </Callout>

      <DeepLink>
        <strong>Phase 21</strong> — StrictMode 이중 호출 메커니즘 + 6슬롯 placeholder 보너스
      </DeepLink>
    </ItemCard>
  )
}

function Item06() {
  return (
    <ItemCard
      num={6}
      symptom='빈자리에 카드가 떠야 하는데 "0" 이 찍혀 있음'
      summary={
        <>
          <IC>{'{ items.length && <div/> }'}</IC> → length=0일 때 <IC>0</IC> 텍스트 렌더.
          React가 무시하는 falsy는 <IC>null</IC>/<IC>undefined</IC>/<IC>false</IC>/<IC>{"''"}</IC>뿐,
          <strong> <IC>0</IC>과 <IC>NaN</IC>은 텍스트로 찍힘</strong>. 안전 표현 3가지: <IC>{'> 0'}</IC>, <IC>!!</IC>, ternary.
        </>
      }
      category="⑧ 디버깅"
      originalPhase="Phase 34"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>Q&A 섹션 코드:</p>
      <CodeBlock
        lang="tsx"
        code={`{datas?.items?.length && datas?.items?.length === 0 && (
  <div>...첫 회차 질문 카드...</div>
)}`}
      />
      <p>화면을 새로고침해도 카드 안 나타남. 두 가지 함정이 한 줄에:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li><strong>모순 조건</strong> — <IC>length</IC>가 truthy(&gt;0)이면서 동시에 <IC>=== 0</IC>일 수 없음 → 본문 절대 실행 안 됨</li>
        <li>고쳐서 <IC>{'length && <div/>'}</IC>로 줄이면 length=0일 때 <strong>화면에 <IC>0</IC></strong> 찍힘</li>
      </ol>

      <SubHeading icon="🔍">원인</SubHeading>
      <p>
        <strong>모순 조건:</strong> 두 조건의 교집합 ∅. 컴파일러도 린트도 못 잡음 (둘 다 valid <IC>boolean</IC>).
      </p>
      <p>
        <strong><IC>0</IC> 함정:</strong>
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>React: "truthy면 오른쪽 표현식 렌더, falsy면 <strong>그 값을 렌더</strong>"</li>
        <li><IC>{'0 && <div/>'}</IC> → 단락 평가로 <IC>0</IC> 반환</li>
        <li>React는 <IC>0</IC>을 텍스트 노드로 렌더 (<IC>null</IC>/<IC>undefined</IC>/<IC>false</IC>만 무시)</li>
      </ul>
      <FlowDiagram>{`items.length = 0   → 0 && <div/>          → 0          → 화면에 "0"
items.length = 3   → 3 && <div/>          → <div/>     → 정상
items = undefined  → undefined && <div/>  → undefined  → 무시`}</FlowDiagram>

      <SubHeading icon="🛠">해결 — 안전한 표현 3가지</SubHeading>
      <CodeBlock
        lang="tsx"
        code={`// ✅ 명시적 비교 — 가장 명확 (이 프로젝트 컨벤션)
{(datas?.items?.length ?? 0) > 0 && <div>...</div>}

// ✅ boolean 캐스팅 — 짧음
{!!datas?.items?.length && <div>...</div>}

// ✅ ternary — null 명시
{datas?.items?.length ? <div>...</div> : null}`}
      />
      <DataTable
        headers={['패턴', '장점', '단점']}
        rows={[
          [<IC key="a">{'length > 0'}</IC>, '의도 명시, IDE/리뷰어 친화', '길다'],
          [<IC key="b">!!length</IC>, '짧음', <><IC key="b2">!!</IC>가 익숙하지 않은 사람엔 noise</>],
          [<IC key="c">{'length ? : null'}</IC>, '거짓 분기 표현 가능', 'else가 필요 없을 땐 noise'],
        ]}
      />

      <SubHeading icon="📋">React falsy 렌더 규칙 표</SubHeading>
      <DataTable
        headers={['값', '렌더 결과']}
        rows={[
          [<IC key="a">null</IC>, '무시'],
          [<IC key="b">undefined</IC>, '무시'],
          [<IC key="c">false</IC>, '무시'],
          [<IC key="d">true</IC>, '무시 (의외)'],
          [<IC key="e">0</IC>, <><strong>"0" 텍스트 렌더 ← 함정</strong></>],
          [<IC key="f">{"'' (빈 문자열)"}</IC>, '무시'],
          [<IC key="g">NaN</IC>, <><strong>"NaN" 텍스트 렌더 ← 함정</strong></>],
        ]}
      />
      <Callout variant="warn">
        숫자/표현식을 <IC>&&</IC>의 <strong>왼쪽</strong>에 둘 때 항상 의식.
      </Callout>

      <SubHeading icon="🧪">조건문 가독성 체크리스트</SubHeading>
      <ol className="list-decimal pl-5 space-y-1">
        <li><strong><IC>&&</IC> 양쪽이 의미적으로 같은 변수의 다른 비교?</strong> → 모순 가능성</li>
        <li><strong><IC>&&</IC> 왼쪽이 숫자/문자열?</strong> → <IC>0</IC>/<IC>{"''"}</IC>/<IC>NaN</IC> 함정 검토</li>
        <li><strong><IC>?.length</IC>만 단독으로 truthy 검사?</strong> → boolean 캐스팅 또는 명시 비교</li>
        <li><strong><IC>!</IC>가 두 번 이상?</strong> → 드모르간 변환 검토 (<IC>!a && !b</IC> → <IC>{'!(a || b)'}</IC>)</li>
        <li><strong>옵셔널 체이닝 깊이 3 이상?</strong> → 변수로 빼내기</li>
      </ol>

      <RecurAlert>
        "빈 값"은 한 단어가 아니다 패턴 — Phase 26(<IC>{'||'}</IC> 깊이 1 / <IC>.length</IC> 깊이 1+2 / <IC>.some(meaningful)</IC> 깊이 3)도 같은 결.
      </RecurAlert>

      <DeepLink>
        <strong>Phase 34</strong> — 모순 조건 진단 + 가독성 체크리스트 / <strong>Phase 26</strong> — "비어있음"의 세 가지 깊이
      </DeepLink>
    </ItemCard>
  )
}

function Item07() {
  return (
    <ItemCard
      num={7}
      symptom="API 한 개 미구현인데 페이지 전체가 흰 화면"
      summary={
        <>
          이 프로젝트 React Query는 글로벌 <IC>throwOnError</IC> → 한 쿼리 실패 시 Error Boundary가 페이지 전체 대체.
          <strong> 선택적 데이터</strong>(stepbar 진행률 등)는 쿼리 옵션에 <IC>{'throwOnError: false'}</IC> + 호출부 fallback(<IC>?? 0</IC>, <IC>?? false</IC>)로 옵트아웃.
        </>
      }
      category="③ 데이터 조회 / ⑧ 디버깅"
      originalPhase="Phase 9"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>stepbar 진행률용 <IC>/user-status</IC>가 백엔드 미구현. 페이지 열면:</p>
      <CodeBlock
        lang="text"
        code={`Uncaught Error: Cannot GET /jh/api/high3/user-status
    at throwOnError (ReactQueryProvider.tsx:29)
    at useUserStatusQuery (user-status.queries.ts:13)
    at useStepBar (useStepBar.ts:22)
    at EarlyStepbar (EarlyStepbar.tsx:18)`}
      />
      <p><strong>stepbar뿐 아니라 페이지 전체가 흰 화면.</strong></p>

      <SubHeading icon="🔍">원인 — 글로벌 정책의 부작용</SubHeading>
      <p><IC>ReactQueryProvider</IC>에:</p>
      <CodeBlock
        lang="typescript"
        code={`new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError(error, query) {
        throw new Error(APIError.message(error));
      },
    },
  },
});`}
      />
      <p>
        한 쿼리 실패 → 컴포넌트 throw → React 트리 위로 → 가장 가까운 Error Boundary가 페이지 통째 대체.
        <strong> "있어도 좋고 없어도 되는" 데이터</strong>가 페이지 전체를 무너뜨림.
      </p>

      <SubHeading icon="🛠">해결 — 옵트아웃 + 호출부 fallback (두 짝)</SubHeading>
      <p className="font-semibold text-gray-800 mt-2">① 쿼리 옵션에 throwOnError: false</p>
      <CodeBlock
        lang="typescript"
        code={`export function useUserStatusQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userStatusQueries.status(userId).queryKey,
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId && enabled,
    // 서버 /user-status 구현 완료 후 이 옵션 제거 — 호출부 fallback 으로 안전 degrade
    throwOnError: false,
  });
}`}
      />

      <p className="font-semibold text-gray-800 mt-2">② 호출부 fallback (Optional chaining + Nullish coalescing)</p>
      <CodeBlock
        lang="typescript"
        code={`// ❌ fallback 없음 — TypeError 폭발
const count = userStatus.mockApplicationCount;

// ✅ Optional chaining + ?? 기본값
const mockApplicationCount = userStatus?.mockApplicationCount ?? 0;
const isNesinGradeInput = userStatus?.isNesinGradeInput ?? false;`}
      />

      <SubHeading icon="🎯">옵트아웃을 써도 되는 쿼리 vs 쓰면 안 되는 쿼리</SubHeading>
      <DataTable
        headers={['상황', '적용 여부', '이유']}
        rows={[
          ['stepbar 진행 상태', '✅', '없어도 페이지 핵심 동작. 진행률만 초기값'],
          ['평가 신청 페이지의 사용자 정보', '❌', '사용자 정보 없이는 신청 자체 불가'],
          ['리포트 페이지의 평가 결과', '❌', '데이터가 페이지의 존재 이유'],
          ['우상단 알림 뱃지 개수', '✅', '부수 정보. 뱃지 안 보이는 게 페이지 막는 것보다'],
        ]}
      />
      <Callout variant="key">
        <strong>판단 한 줄:</strong> 이 데이터가 없으면 페이지를 보여주는 의미가 사라지는가? Yes면 throw, No면 옵트아웃.
      </Callout>

      <SubHeading icon="✅">백엔드 구현 후 제거 체크리스트</SubHeading>
      <ol className="list-decimal pl-5 space-y-1">
        <li><IC>throwOnError: false</IC> 옵션 <strong>제거</strong></li>
        <li>호출부의 <IC>?? 0</IC>/<IC>?? false</IC>는 <strong>그대로 유지</strong> (로딩 중 안전 처리)</li>
        <li>실제 동작 확인 — 의도적 500 응답 시 Error Boundary가 다시 잡는지</li>
      </ol>

      <DeepLink>
        <strong>Phase 9</strong> — 글로벌 정책 메커니즘 + 임시 우회 정리 책임
      </DeepLink>
    </ItemCard>
  )
}

function Item08() {
  return (
    <ItemCard
      num={8}
      symptom="이 페이지에 안 쓰는 쿼리가 줄줄이 발사돼요"
      summary={
        <>
          합성 훅(<IC>useAdmissionEvaluationApplyForm</IC>) 통째로 부르면 그 안의
          <strong> 모든 useQuery · useEffect · mutation 셋업이 함께 발사</strong>.
          필요한 3개만 쓰려면 <strong>그 출처를 직접 호출</strong>해라. 같은 queryKey는 어디서 부르든 캐시 공유라 중복 호출 걱정 X.
        </>
      }
      category="⑤ 상태 설계"
      originalPhase="Phase 17"
    >
      <SubHeading icon="🩺">문제</SubHeading>
      <p>Confirm 페이지 요약 훅 작성 중. <IC>isMobile</IC>, <IC>gradeStatusData</IC>, <IC>mockStatusData</IC> 3개만 필요.</p>
      <CodeBlock
        lang="typescript"
        code={`// ❌ Confirm 요약 훅이 Apply 폼 훅을 통째로 호출
export const useAdmissionEvaluationConfirmSummary = () => {
  const { isMobile, gradeStatusData, mockStatusData } =
    useAdmissionEvaluationApplyForm();
  // ...
};`}
      />
      <p>코드는 동작하지만 Confirm 페이지 진입만으로:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><IC>useApplyDropOptions()</IC> → 대학 목록 · 선호 전공/지역 <strong>쿼리 자동 실행</strong></li>
        <li><IC>useAdmissionEvaluationApplyMutation()</IC> → 제출 mutation <strong>셋업</strong></li>
        <li>Apply 폼의 <strong>복원 <IC>useEffect</IC> 실행</strong> → <IC>setSelectedOption(...)</IC> + <IC>onUnivChangeFetch(...)</IC> 호출로 <strong>계열 · 학과 list 네트워크 요청까지</strong> 발사 (Confirm은 이 데이터 안 씀)</li>
      </ul>

      <SubHeading icon="🔍">원인</SubHeading>
      <p>훅은 호출하는 순간 그 안의 <strong>모든 side effect가 함께 따라옴</strong>:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>모든 <IC>useQuery</IC> → 자동 실행</li>
        <li>모든 <IC>useEffect</IC> → 즉시 발사</li>
        <li>모든 <IC>useMutation</IC> → 셋업</li>
      </ul>
      <p>
        설계 자체는 좋은데(Apply 페이지 전용 합성 훅), 다른 페이지가 일부만 가져가려고 부르면 <strong>의도치 않은 부수 효과</strong> 폭발.
      </p>

      <SubHeading icon="🛠">해결 — 필요한 만큼만 의존</SubHeading>
      <CodeBlock
        lang="typescript"
        code={`// ✅ 필요한 3개만 직접 가져오기
const isMobile = useAppSelector((state) => state.common.isMobile);
const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();`}
      />
      <p><strong>비용?</strong> 거의 0:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>React Query 캐시 공유 — Apply에서 같은 queryKey로 캐싱했다면 즉시 반환</li>
        <li><IC>isMobile</IC>은 redux selector 한 줄</li>
        <li>새 네트워크 호출 없음</li>
      </ul>

      <Callout variant="key">
        <strong>의존성 최소화 한 줄:</strong> "이 훅이 반환하는 값 중 일부만 필요하다"는 신호가 보이면, <strong>그 훅 전체를 부르지 말고 그 일부의 출처를 직접 부르세요.</strong> 훅은 호출하는 순간 그 안의 모든 side effect가 함께 따라옵니다. 같은 React Query queryKey는 캐시 공유라 중복 호출 걱정 X.
      </Callout>

      <RecurAlert>
        "같이 묶지 마라" 패턴 — Phase 24("훅 책임 경계 — QnA mutation을 Apply 훅에 합칠까")도 같은 결. <strong>다른 페이지에서 쓰면 무조건 분리.</strong>
      </RecurAlert>

      <DeepLink>
        <strong>Phase 17</strong> — 통째 호출의 효과 추적 / <strong>Phase 24</strong> — 합칠까 분리할까 판단 기준
      </DeepLink>
    </ItemCard>
  )
}

function Item09() {
  return (
    <ItemCard
      num={9}
      symptom='코드는 apply API인데 UX는 "신청완료" — 의미가 안 맞아요'
      summary={
        <>
          두 단계 패턴 — <IC>apply</IC>(draft, 수정 가능) vs <IC>submit</IC>(confirmed, lock). 영어 <IC>apply</IC> ≠ 한국어 "신청".
          카드 복수 데이터는 <strong>comma-join 금지</strong>, 구조화 배열(<IC>{'selectedCards: SelectedCard[]'}</IC>)로 스냅샷에 따로 저장.
        </>
      }
      category="⑥ 데이터 전송 / ⑦ 페이지 간 데이터 전달"
      originalPhase="Phase 25 · Phase 18"
    >
      <SubHeading icon="🩺">문제 ① — POST가 왜 두 개?</SubHeading>
      <DataTable
        headers={['엔드포인트', '의미', '수정 가능?']}
        rows={[
          [<IC key="a">/admission-evaluation/apply</IC>, <><strong>초안 저장</strong>(draft)</>, '✅ 다시 POST로 덮어쓰기 가능'],
          [<IC key="b">/admission-evaluation/submit</IC>, <><strong>최종 확정</strong>(final)</>, '❌ 이후 어떤 변경도 거부'],
        ]}
      />
      <p>상태 머신:</p>
      <FlowDiagram>{`[빈]  ──POST /apply──►  [DRAFT]  ──POST /submit──►  [CONFIRMED]
                          ↑↓
                    POST /apply (수정)`}</FlowDiagram>
      <p>
        CONFIRMED 상태에서 <IC>/apply</IC> 또는 <IC>/submit</IC> 시도 → 400 "이미 신청이 완료되었습니다."
      </p>

      <SubHeading icon="⚠">함정 — 코드 네이밍 ≠ 사용자 용어</SubHeading>
      <DataTable
        headers={['코드 이름', '실제 동작', '사용자 용어']}
        rows={[
          [<IC key="a">submitAdmissionEvaluationApply</IC>, 'POST /apply (draft 저장)', <strong key="a2">"입력완료"</strong>],
          [<IC key="b">submitAdmissionEvaluationSubmit</IC>, 'POST /submit (최종 확정)', <strong key="b2">"신청완료"</strong>],
          [<IC key="c">useAdmissionEvaluationApplyMutation</IC>, 'apply 호출', '[입력완료] 버튼'],
          [<IC key="d">useAdmissionEvaluationConfirmMutation</IC>, 'submit 호출', '[신청완료] 버튼'],
        ]}
      />
      <p>
        영어 "apply"는 한국어 "신청"으로 직역되지만 <strong>코드의 <IC>apply</IC>는 "draft 저장"</strong>,
        <strong> 한국어 "신청완료"는 실제로 <IC>submit</IC></strong>. 코드 읽을 때 가장 헷갈리는 부분.
      </p>

      <SubHeading icon="🩺">문제 ② — 카드 N개 저장</SubHeading>
      <p><IC>{'selectedCards: SelectedCard[]'}</IC> 6개를 sessionStorage 스냅샷에 어떻게?</p>

      <SubHeading icon="❌">comma-join 시도 (망함)</SubHeading>
      <CodeBlock
        lang="typescript"
        code={`// handleSubmit
universityName: handler.selectedCards.map((c) => c.options.drop1.label).join(','),
majorTypeName:  handler.selectedCards.map((c) => c.options.drop2.label).join(','),
minorMajorCategoryName: handler.selectedCards.map((c) => c.options.drop3.label).join(','),`}
      />
      <Callout variant="warn">
        <strong>두 가지 문제 동시:</strong>
        <p className="mt-1"><strong>문제 ①: 카드 단위 짝이 깨짐</strong> — 세 필드 각각 join/split → 표시 시 인덱스로 짝 재구성. 라벨에 쉼표 들어가는 순간(예: "○○대학교, 분교") 인덱스 어긋남 → 짝 영원히 망가짐.</p>
        <p className="mt-1"><strong>문제 ②: 단일 필드 의미 오염 → 복원 망가짐</strong> — <IC>universityId</IC>는 Apply 복원용. 거기에 <IC>{'"101,102,103"'}</IC> 들어가면 cascade fetch가 깨짐.</p>
      </Callout>

      <SubHeading icon="✅">해결 — 구조화 배열로 분리</SubHeading>
      <p>표시(복수 카드)와 복원(드롭다운 단일 값) <strong>둘을 분리해서 저장</strong>:</p>
      <CodeBlock
        lang="typescript"
        code={`export interface AdmissionEvaluationApplyFormSnapshot
  extends AdmissionEvaluationApplyRequest {
  // 희망 대학 리스트(복수 카드) — Confirm 표시 + 수정하기 복원
  selectedCards: SelectedCard[];
  // 제출 시점의 단일 드롭다운 선택값 — 수정하기 시 cascade 복원
  universityId: string;
  universityName: string;
  // ...
}`}
      />
      <CodeBlock
        lang="typescript"
        code={`const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  selectedCards: handler.selectedCards, // ← 구조화 배열 (라벨 포함)
  universityId: drop1.value, // ← 단일 값 (드롭다운 복원)
  universityName: drop1.label,
};`}
      />

      <Callout variant="key">
        <strong>한 줄 교훈:</strong> 표시(structured) 목적과 복원(single) 목적이 다르면, 같은 필드 하나에 둘을 우겨넣지 말고 따로 저장하라. "단일 필드를 join/split해서 다목적으로 쓰자"는 유혹은 짧게 동작하지만, 라벨에 쉼표 / 의미 오염되어 다른 흐름을 망가뜨리는 순간 부러진다.
      </Callout>

      <DeepLink>
        <strong>Phase 25</strong> — apply/submit 두 단계 흐름, 페이지별 GET 의미 / <strong>Phase 18</strong> — 카드 라이프사이클 / <strong>Phase 28</strong> — CONFIRMED 거부 응답을 status API 대용으로
      </DeepLink>
    </ItemCard>
  )
}

function Item10() {
  return (
    <ItemCard
      num={10}
      symptom="selector에 prop 11개 + 페이지 500줄이 됐어요"
      summary={
        <>
          페이지 → 컴포넌트로 prop 폭증은 두 가지 신호. (1) <strong>조합 로직을 페이지가 떠안음</strong> → 내부로 옮겨라.
          (2) <strong>페이지에 useState/useEffect가 쌓임</strong> → 합성 훅으로 모아라.
          + FSD 레이어 방향 점검(<IC>app → entities → modules → window</IC>, <strong>상향 import 금지</strong>).
        </>
      }
      category="⑨ 리팩토링 / 설계 진화"
      originalPhase="Phase 13 · Phase 16"
    >
      <SubHeading icon="🩺">증상 (둘 중 하나라도면 적용)</SubHeading>
      <ul className="list-disc pl-5 space-y-1">
        <li><IC>UnivMajorSelector</IC>에 prop 11개 내려주고 있음</li>
        <li>페이지 컴포넌트가 ~500줄, <IC>useState</IC> 5개 + <IC>useEffect</IC> 3개 + <IC>handleSubmit</IC> 100줄</li>
        <li>selector의 onChange에 인라인 핸들러 4줄짜리</li>
      </ul>

      <SubHeading icon="🔍">원인 ① — 조합 로직이 페이지에 박힘</SubHeading>
      <CodeBlock
        lang="tsx"
        code={`// ❌ 페이지가 selector 내부 동작 규칙까지 직접 조립
<UnivMajorSelector
  universityHandler={(option) => {
    handleSelectedChange('drop1', option);
    handleSelectedChange('drop2', { value: '', label: '' }); // 하위 초기화
    handleSelectedChange('drop3', { value: '', label: '' });
    onUnivChangeFetch(option.value); // cascade 재조회
  }}
  aibdPartsHandler={(option) => { /* ... */ }}
  // ... +9개 prop
/>`}
      />
      <p>"대학 바뀌면 계열 · 학과 비우고 cascade 재조회"는 <strong>selector 내부 규칙</strong>. 페이지가 알 일 아님.</p>

      <SubHeading icon="🛠">해결 ① — 페이지는 "원시 도구"만 전달</SubHeading>
      <CodeBlock
        lang="tsx"
        code={`// ✅ 페이지
<UnivMajorSelector
  selectedOption={selectedOption}
  onSelectedChange={handleSelectedChange} // 단순 setter
  onUnivChangeFetch={onUnivChangeFetch}   // cascade 함수
  onMajorTypeChange={onMajorTypeChange}
  selectedCards={selectedCards}
  onAddCard={handleAddCard}
  onDeleteCard={handleDeleteCard}
/>

// ✅ UnivMajorSelector 내부 — 조합 규칙은 여기에
const handleUniversityChange = (option: StringDropDownOption) => {
  onSelectedChange('drop1', option);
  onSelectedChange('drop2', EMPTY_OPTION);
  onSelectedChange('drop3', EMPTY_OPTION);
  onUnivChangeFetch(option.value);
};`}
      />
      <Callout variant="key">
        핵심 질문: <strong>"이 규칙을 아는 게 누구의 책임인가?"</strong>
      </Callout>

      <SubHeading icon="🔍">원인 ② — 페이지에 로직 덩어리가 쌓임</SubHeading>
      <p>페이지 훅 + 폼 입력 <IC>useState</IC> 5개 + 복원 <IC>useEffect</IC> + <IC>handleSubmit</IC> 등 ~180줄.</p>

      <SubHeading icon="🛠">해결 ② — 합성 훅으로 통합</SubHeading>
      <CodeBlock
        lang="typescript"
        path="entities/admission-evaluation/model/useAdmissionEvaluationApplyForm.ts"
        code={`export const useAdmissionEvaluationApplyForm = () => {
  // 1) 데이터/인프라 훅
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { mutateAsync: submitApply, isPending } = useAdmissionEvaluationApplyMutation();

  // 2) 작은 훅을 합성
  const dropOptions = useApplyDropOptions();
  const handler = useAdmissionEvaluationHandler();

  // 3) 폼 상태 + 복원 useEffect + handleSubmit ...

  return {
    ...dropOptions,
    ...handler,
    /* 폼 상태, handleSubmit, isPending */
  };
};`}
      />
      <p>페이지는 <strong>훅 1개 호출 + JSX</strong>만:</p>
      <CodeBlock
        lang="tsx"
        code={`export const EarlyAdmissionEvaluationApply = () => {
  const { selectedOption, handleSubmit, isPending, /* ... */ } =
    useAdmissionEvaluationApplyForm();
  return (/* JSX */);
};`}
      />

      <SubHeading icon="⚖">"분리(Phase 8) vs 통합(Phase 16)" — 모순 아님</SubHeading>
      <ul className="list-disc pl-5 space-y-1">
        <li>Phase 8: 컴포넌트에서 로직 덩어리를 <strong>작은 훅으로 분리</strong> (관심사 분리)</li>
        <li>Phase 16: 그 작은 훅들을 <strong>합성해 페이지용 단일 진입점</strong> 마련</li>
      </ul>
      <p>작은 훅 = building block, 합성 훅 = 페이지 facade. <strong>계층 쌓기</strong>.</p>

      <SubHeading icon="🏗">FSD 레이어 방향 — 상향 import 금지</SubHeading>
      <FlowDiagram>{`app → entities → modules → window
   위에서 아래로만 import 허용`}</FlowDiagram>
      <p>흔한 실수: <IC>entities</IC>가 <IC>modules</IC> 컴포넌트 import. 컴포넌트를 옮기면 그게 의존하던 작은 조각(배지 등)도 함께 레이어 재검토.</p>

      <SubHeading icon="⚠">트레이드오프 — god-hook 경계</SubHeading>
      <p>
        <IC>...dropOptions</IC>/<IC>...handler</IC> 스프레드는 간결하지만, 한 훅이 너무 많은 책임 흡수 → "god-hook".
        이 프로젝트는 <strong>소비자가 페이지 하나뿐</strong>이라 단일 훅이 합리적.
        같은 selector/폼이 여러 페이지에서 쓰이기 시작하면 Context나 더 작은 훅 단위로 다시 쪼개기.
      </p>
      <Callout variant="key">
        <strong>판단 기준:</strong> 이 묶음을 쓰는 곳이 하나? 여럿? — 하나면 합성 훅으로 응집, 여럿이면 공유 메커니즘(Context 등)으로 분산.
      </Callout>

      <SubHeading icon="📌">옮기지 못하는 것 — 공유 상태는 페이지에 남는다</SubHeading>
      <p>
        <IC>selectedOption</IC> · <IC>selectedCards</IC> · <IC>onUnivChangeFetch</IC>는 <IC>handleSubmit</IC> · 복원 로직과 <strong>함께 쓰는 공유 상태</strong>라 페이지(또는 상위 훅)가 들고 있어야 함. 자식에 내려주는 건 "상태 끌어올리기(lifting state up)"라는 정상 패턴.
      </p>

      <DeepLink>
        <strong>Phase 13</strong> — 4개 Step (조합 로직 / 반복 UI / FSD / dead code) / <strong>Phase 16</strong> — 합성 훅 (god-hook 경계 + Phase 8과의 관계)
      </DeepLink>
    </ItemCard>
  )
}
