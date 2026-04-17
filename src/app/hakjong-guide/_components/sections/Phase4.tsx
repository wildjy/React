import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase4() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={4} />

      {/* 전체 흐름 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">데이터 전송 전체 흐름</h4>
        </div>
        <FlowDiagram>{`[사용자 입력]
  Dropdown 선택 + TextInput 작성
           ↓
[유효성 검사]
  handleSubmit() — 미선택/미입력 시 alert 후 중단
           ↓
[useMutation 호출]
  submitApply(requestData)
           ↓
[API 함수 실행]
  POST /hakjong/apply  ← HTTP 요청 (JSON body)
           ↓
[서버 응답 수신]
  { applyId: 'HAKJONG-2026-001' }
           ↓
[확인 페이지 이동]
  router.push('/hakjong/apply/confirm?applyId=...&...')`}</FlowDiagram>
      </div>

      {/* Step 14 */}
      <StepCard phase={4} num={14} title="타입 정의 — 서버에 보낼 데이터 형태 설계">
        <p>API 연동 전, 서버와 주고받을 데이터 구조를 TypeScript interface로 먼저 정의합니다.</p>
        <CodeBlock
          lang="typescript"
          path="apps/early/src/entities/hakjong/model/hakjong.types.ts"
          code={`// 서버로 보낼 요청 데이터
export interface HakjongApplyRequest {
  universityId:           string  // "101"
  universityName:         string  // "서울대학교"
  majorType:              string  // "인문"
  majorTypeName:          string  // "인문계"
  minorMajorCategoryCode: string  // "C12"
  minorMajorCategoryName: string  // "경영학과"
  selfIntroduction:       string  // 자기소개서
  activityReport:         string  // 활동보고서
}

// 서버에서 받을 응답 데이터
export interface HakjongApplyResponse {
  applyId: string  // "HAKJONG-2026-001"
}`}
        />
        <Callout variant="info">
          <strong>왜 타입을 먼저 정의하나요?</strong> 서버와 협의한 API 스펙(Swagger)을
          TypeScript interface로 먼저 옮겨두면, 이후 API 함수·mutation 훅·컴포넌트를 만들 때
          타입이 잘못 연결되면 개발 단계에서 에러로 알려줍니다.
        </Callout>
      </StepCard>

      {/* Step 15 */}
      <StepCard phase={4} num={15} title="API 함수 — HTTP 요청 작성">
        <CodeBlock
          lang="typescript"
          path="apps/early/src/entities/hakjong/api/index.ts"
          code={`import apiClient from '@/shared/api'
import { HakjongApplyRequest, HakjongApplyResponse } from '../model/hakjong.types'

export const submitHakjongApply = async (
  requestData: HakjongApplyRequest,
): Promise<HakjongApplyResponse> => {
  const data = await apiClient()
    .post('hakjong/apply', { json: requestData })  // ① POST + JSON body
    .json<HakjongApplyResponse>()                  // ② 응답을 JSON으로 파싱
  return data
}`}
        />
        <DataTable
          headers={['코드', '의미']}
          rows={[
            [<IC key="a">apiClient()</IC>,                 '공통 HTTP 클라이언트 반환. 기본 URL, 인증 헤더 자동 설정'],
            [<IC key="b">.post(\'hakjong/apply\', ...)</IC>, 'POST {API_URL}/hakjong/apply 요청 전송'],
            [<IC key="c">{'{ json: requestData }'}</IC>,  'requestData를 JSON 직렬화. Content-Type: application/json 자동 추가'],
            [<IC key="d">.json&lt;HakjongApplyResponse&gt;()</IC>, '응답 body를 JSON 파싱 + 타입으로 반환'],
          ]}
        />
        <Callout variant="tip">
          <strong>ky HTTP 클라이언트란?</strong> <IC>fetch</IC>를 기반으로 만들어진 경량 HTTP 라이브러리입니다.
          axios와 유사하지만 더 가볍습니다. 환경(로컬/개발/운영)에 따라 baseURL이 자동 설정됩니다.
        </Callout>
      </StepCard>

      {/* Step 16 */}
      <StepCard phase={4} num={16} title="useMutation 훅 — 서버 요청의 생명주기 관리">
        <CodeBlock
          lang="typescript"
          path="apps/early/src/entities/hakjong/model/hakjong.queries.ts"
          code={`import { useMutation } from '@tanstack/react-query'
import { submitHakjongApply } from '../api'

export function useHakjongApplyMutation() {
  return useMutation<HakjongApplyResponse, Error, HakjongApplyRequest>({
    mutationFn: (requestData) => submitHakjongApply(requestData),
    onError: (error) => {
      console.error('학종 신청 실패:', error)
      alert('신청에 실패했습니다. 다시 시도해주세요.')
    },
  })
}

// 사용 시 반환되는 주요 값들
const {
  mutateAsync,  // API 요청 실행 (async/await 가능)
  isPending,    // 요청 진행 중 (버튼 비활성화 등)
  isSuccess,    // 요청 성공 여부
  isError,      // 요청 실패 여부
  data,         // 성공 시 응답 데이터
  error,        // 실패 시 에러 객체
} = useHakjongApplyMutation()`}
        />
        <DataTable
          headers={['구분', 'useQuery', 'useMutation']}
          rows={[
            ['HTTP 메서드',  'GET (데이터 조회)',         'POST / PUT / DELETE (변경)'],
            ['실행 시점',    '컴포넌트 마운트 시 자동',   <>명시적으로 <IC>mutate()</IC> 호출 시</>],
            ['자동 재실행',  '있음 (캐시 만료 시)',        '없음'],
            ['사용 예',      '목록 조회, 사용자 정보',    '저장, 수정, 삭제'],
          ]}
        />
      </StepCard>

      {/* Step 17 */}
      <StepCard phase={4} num={17} title="컴포넌트에서 조립 — handleSubmit 작성">
        <CodeBlock
          lang="typescript"
          code={`const { mutateAsync: submitApply, isPending } = useHakjongApplyMutation()
const [selfIntroduction, setSelfIntroduction] = useState('')
const [activityReport,   setActivityReport]   = useState('')

const handleSubmit = async () => {
  const { drop1, drop2, drop3 } = selectedOption

  // ① 유효성 검사
  if (!drop1.value || !drop2.value || !drop3.value) {
    alert('대학, 계열, 학과를 모두 선택해주세요.')
    return
  }
  if (!selfIntroduction.trim() || !activityReport.trim()) {
    alert('모든 입력 항목을 작성해주세요.')
    return
  }

  // ② 서버로 데이터 전송
  const response = await submitApply({
    universityId: drop1.value, universityName: drop1.label,
    majorType: drop2.value,    majorTypeName: drop2.label,
    minorMajorCategoryCode: drop3.value,
    minorMajorCategoryName: drop3.label,
    selfIntroduction, activityReport,
  })

  // ③ 확인 페이지로 이동
  const params = new URLSearchParams({
    applyId: response.applyId,
    universityName: drop1.label,
    majorTypeName: drop2.label,
    minorMajorCategoryName: drop3.label,
  })
  router.push(\`/hakjong/apply/confirm?\${params.toString()}\`)
}`}
        />
        <Callout variant="tip">
          <strong>URLSearchParams:</strong> URL의 쿼리스트링을 안전하게 만드는 내장 Web API입니다.
          한글 등 특수문자가 자동으로 URL 인코딩됩니다.
        </Callout>
      </StepCard>

      {/* Step 18 */}
      <StepCard phase={4} num={18} title="확인 페이지 — URL 파라미터로 데이터 전달">
        <p>확인 페이지는 서버 재요청 없이, URL 쿼리스트링에서 값을 읽어 표시합니다.</p>
        <CodeBlock
          lang="typescript"
          path="EarlyHakjongConfirm.tsx"
          code={`'use client'
import { useSearchParams } from 'next/navigation'

const searchParams   = useSearchParams()
const applyId        = searchParams.get('applyId')        ?? ''
const universityName = searchParams.get('universityName') ?? ''`}
        />
        <Callout variant="warn">
          <strong>useSearchParams()는 반드시 Suspense 안에서 사용하세요.</strong>{' '}
          <IC>Suspense</IC> 없이 렌더링하면 빌드/런타임 오류가 발생합니다.
          <IC>page.tsx</IC>에서 <IC>{'<Suspense>'}</IC>로 감싸는 것이 기본 패턴입니다.
        </Callout>
      </StepCard>

      {/* Step 19 */}
      <StepCard phase={4} num={19} title="MSW로 로컬 임시 목 API 만들기">
        <p>
          Swagger(실제 API)가 준비되기 전,{' '}
          <strong>MSW(Mock Service Worker)</strong>를 사용해 브라우저가 실제 서버 없이도{' '}
          <IC>POST /hakjong/apply</IC>를 처리하게 만듭니다.
        </p>
        <FlowDiagram>{`[브라우저]
  fetch POST /hakjong/apply
        ↓
[Service Worker가 가로챔] ← msw가 브라우저에 등록한 워커
        ↓
[handlers.ts 에서 매칭되는 핸들러 실행]
  http.post(/\\/hakjong\\/apply/, () => HttpResponse.json(...))
        ↓
[목 응답 반환] → 실제 서버로는 요청이 나가지 않음`}</FlowDiagram>
        <CodeBlock
          lang="typescript"
          path="apps/mock/specs/mocks/handlers.ts"
          code={`import { hakjongApplyResponse } from './mockdata'

export const handlers = [
  // ...기존 핸들러들...

  // 학종 신청 제출 목 핸들러
  http.post(/.*\\/hakjong\\/apply/, () => {
    return HttpResponse.json(hakjongApplyResponse)
  }),
]

// 실제 API 연동 시: 핸들러만 주석 처리하면 자동으로 실제 서버에 요청됨
// http.post(/.*\\/hakjong\\/apply/, () => { ... }),`}
        />
      </StepCard>
    </section>
  )
}
