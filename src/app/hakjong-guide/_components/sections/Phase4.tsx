import { PhaseHeader, StepCard, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase4() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={4} />

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
  결과 데이터 수신
           ↓
[확인 페이지 이동]
  router.push('/hakjong/apply/confirm?applyId=...&...')`}</FlowDiagram>
        <Callout variant="info">
          <strong>React Query 전체 흐름으로 다시 보면:</strong> 조회는 <IC>useQuery</IC>로 읽고 캐시에 저장하고,
          변경은 <IC>useMutation</IC>으로 처리한 뒤 필요한 경우 <IC>invalidateQueries()</IC>로 관련 조회를 다시 불러와 화면을 최신 상태로 맞춥니다.
        </Callout>
      </div>

      <StepCard phase={4} num={14} title="타입 정의 — 서버에 보낼 데이터 형태 설계">
        <p>API 연동 전, 서버와 주고받을 데이터 구조를 TypeScript interface로 먼저 정의합니다.</p>
        <CodeBlock
          lang="typescript"
          path="apps/early/src/entities/hakjong/model/hakjong.types.ts"
          code={`// 서버로 보낼 요청 데이터
export interface HakjongApplyRequest {
  universityId:           string  // "101"
  universityName:         string  // "서울대학교"
  majorType:              string  // "HUM" (계열 코드)
  majorTypeName:          string  // "인문" (계열명)
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
          <strong>왜 타입을 먼저 정의하나요?</strong> 서버와 협의한 API 스펙(Swagger)을 TypeScript interface로 먼저 옮겨두면,
          이후 API 함수, mutation 훅, 컴포넌트를 만들 때 타입 연결 오류를 개발 단계에서 바로 확인할 수 있습니다.
        </Callout>
      </StepCard>

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
    .post('hakjong/apply', { json: requestData })
    .json<HakjongApplyResponse>()
  return data
}`}
        />
        <DataTable
          headers={['코드', '의미']}
          rows={[
            [<IC key="a">apiClient()</IC>, '공통 HTTP 클라이언트 반환. 기본 URL, 인증 헤더 자동 설정'],
            [<IC key="b">.post(\'hakjong/apply\', ...)</IC>, 'POST {API_URL}/hakjong/apply 요청 전송'],
            [<IC key="c">{'{ json: requestData }'}</IC>, 'requestData를 JSON 직렬화. Content-Type: application/json 자동 추가'],
            [<IC key="d">.json&lt;HakjongApplyResponse&gt;()</IC>, '응답 body를 JSON 파싱 + 타입으로 반환'],
          ]}
        />
        <Callout variant="tip">
          <strong>ky HTTP 클라이언트란?</strong> <IC>fetch</IC>를 기반으로 만들어진 경량 HTTP 라이브러리입니다.
          axios와 유사하지만 더 가볍고, 환경에 따라 baseURL이 자동 설정됩니다.
        </Callout>
        <CodeBlock
          lang="http"
          code={`POST https://api.jinhak.com/jh/high3/early/hakjong/apply
Content-Type: application/json

{
  "universityId": "101",
  "universityName": "서울대학교",
  "majorType": "인문",
  "majorTypeName": "인문계",
  "minorMajorCategoryCode": "C12",
  "minorMajorCategoryName": "경영학과",
  "selfIntroduction": "...",
  "activityReport": "..."
}`}
        />
        <Callout variant="info">
          브라우저 Network 탭에서는 위와 같은 형태로 실제 POST 요청이 보입니다.
          즉 이 단계는 단순 함수 호출이 아니라, 서버에 JSON body를 실어 보내는 HTTP 통신입니다.
        </Callout>
      </StepCard>

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

const {
  mutateAsync,
  isPending,
  isSuccess,
  isError,
  data,
  error,
} = useHakjongApplyMutation()`}
        />
        <DataTable
          headers={['구분', 'useQuery', 'useMutation']}
          rows={[
            ['HTTP 메서드', 'GET (데이터 조회)', 'POST / PUT / DELETE (변경)'],
            ['실행 시점', '컴포넌트 마운트 시 자동', '명시적으로 mutate() 호출 시'],
            ['자동 재실행', '있음 (캐시 만료 시)', '없음'],
            ['사용 예', '목록 조회, 사용자 정보', '저장, 수정, 삭제'],
          ]}
        />
        <Callout variant="key">
          <strong>한 줄 정리:</strong> <IC>useQuery</IC>는 서버 상태를 읽는 훅이고, <IC>useMutation</IC>은 서버 상태를 바꾸는 훅입니다.
        </Callout>
        <Callout variant="info">
          퍼블리셔 관점에서 비유하면 <IC>useQuery</IC>는 화면에 보여줄 데이터를 읽어오는 단계이고,
          <IC>useMutation</IC>은 사용자의 클릭을 서버 저장 요청으로 바꾸는 단계입니다.
        </Callout>
        <DataTable
          headers={['항목', 'useQuery', 'useMutation']}
          rows={[
            ['목적', '서버 데이터 조회', '서버 데이터 변경'],
            ['자동 실행', '있음', '없음'],
            ['캐시 재사용', '같은 queryKey면 캐시 재사용', '직접 캐시 갱신 필요'],
            ['queryKey', '필수', '없음'],
            ['SSR/초기 데이터', '잘 맞음', '거의 사용하지 않음'],
            ['잘 어울리는 트리거', '페이지 진입, 탭 진입', '버튼 클릭, 폼 제출, 삭제 액션'],
          ]}
        />
        <Callout variant="warn">
          <strong>실무 포인트:</strong> mutation이 성공한 뒤 관련 목록이나 상세 화면이 이미 <IC>useQuery</IC>로 렌더링되고 있다면,
          <IC>invalidateQueries()</IC>를 호출해 다시 조회시켜야 화면이 최신 상태로 바뀝니다.
        </Callout>
        <CodeBlock
          lang="typescript"
          code={`const queryClient = useQueryClient()

const deleteMutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] })
  },
})`}
        />
        <Callout variant="warn">
          <strong>흔한 실수:</strong> 조회 API를 <IC>useMutation</IC>으로 감싸거나, 저장 API를 <IC>useQuery</IC>로 자동 실행시키거나,
          mutation 성공 후 관련 query를 갱신하지 않는 경우입니다.
        </Callout>
        <DataTable
          headers={['반환값', '설명']}
          rows={[
            ['mutateAsync', '호출하면 API 요청 실행. async/await 가능'],
            ['isPending', '요청 진행 중 여부. 버튼 비활성화와 중복 클릭 방지에 활용'],
            ['isSuccess', '요청 성공 시 true'],
            ['isError', '요청 실패 시 true'],
            ['data', '성공 시 응답 데이터'],
            ['error', '실패 시 에러 객체'],
          ]}
        />
      </StepCard>

      <StepCard phase={4} num={17} title="컴포넌트에서 조립 — handleSubmit 작성">
        <CodeBlock
          lang="typescript"
          code={`const { mutateAsync: submitApply, isPending } = useHakjongApplyMutation()
const [selfIntroduction, setSelfIntroduction] = useState('')
const [activityReport, setActivityReport] = useState('')

const handleSubmit = async () => {
  const { drop1, drop2, drop3 } = selectedOption

  if (!drop1.value || !drop2.value || !drop3.value) {
    alert('대학, 계열, 학과를 모두 선택해주세요.')
    return
  }
  if (!selfIntroduction.trim() || !activityReport.trim()) {
    alert('모든 입력 항목을 작성해주세요.')
    return
  }

  // 에러 발생 시 이후 코드(페이지 이동) 실행을 방지
  let response
  try {
    response = await submitApply({
      universityId: drop1.value,
      universityName: drop1.label,
      majorType: drop2.value,
      majorTypeName: drop2.label,
      minorMajorCategoryCode: drop3.value,
      minorMajorCategoryName: drop3.label,
      selfIntroduction,
      activityReport,
    })
  } catch {
    // onError 콜백에서 alert 처리됨. 여기서는 이후 로직 실행만 막음
    return
  }

  const params = new URLSearchParams({
    applyId: response.applyId,
    universityName: drop1.label,
    majorTypeName: drop2.label,
    minorMajorCategoryName: drop3.label,
  })
  router.push('/hakjong/apply/confirm?' + params.toString())
}`}
        />
        <DataTable
          headers={['항목', 'mutate', 'mutateAsync']}
          rows={[
            ['반환값', '없음 (void)', 'Promise 반환'],
            ['결과 처리', 'onSuccess / onError 콜백', 'await / try-catch'],
            ['어울리는 상황', '토스트 표시, 단순 후처리', '페이지 이동, 후속 API 호출, 조건 분기'],
            ['코드 흐름', '콜백 중심', '위에서 아래로 순차적'],
          ]}
        />
        <Callout variant="info">
          <strong>비유하면:</strong> <IC>mutate</IC>는 저장 버튼만 누르고 결과를 콜백으로 받는 방식이고,
          <IC>mutateAsync</IC>는 저장이 끝날 때까지 기다렸다가 응답값을 손에 들고 다음 행동으로 넘어가는 방식입니다.
        </Callout>
        <CodeBlock
          lang="typescript"
          code={`try {
  const response = await mutateAsync(formData)
  alert('저장 완료')
  router.push('/confirm?id=' + response.applyId)
} catch (error) {
  alert('저장 실패')
}`}
        />
        <Callout variant="tip">
          <strong>URLSearchParams:</strong> URL의 쿼리스트링을 안전하게 만드는 내장 Web API입니다.
          한글 등 특수문자가 자동으로 URL 인코딩됩니다.
        </Callout>
        <CodeBlock
          lang="typescript"
          code={`const params = new URLSearchParams({
  applyId: 'HAKJONG-2026-001',
  universityName: '서울대학교',
})

params.toString()
// applyId=HAKJONG-2026-001&universityName=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90`}
        />
        <CodeBlock
          lang="tsx"
          code={`// 비제어 컴포넌트 (before)
<TextInput addId="intro" label="자기소개서" />

// 제어 컴포넌트 (after)
<TextInput
  addId="intro"
  label="자기소개서"
  value={selfIntroduction}
  onChange={(e) => setSelfIntroduction(e.target.value)}
/>`}
        />
        <Callout variant="tip">
          <strong>제어 컴포넌트:</strong> <IC>value</IC>와 <IC>onChange</IC>를 연결해 React state가 항상 최신 입력값을 추적하는 패턴입니다.
          그래서 <IC>handleSubmit</IC>에서 DOM을 다시 읽지 않고 state만 바로 사용하면 됩니다.
        </Callout>
        <Callout variant="key">
          이 프로젝트에서 <IC>mutateAsync</IC>를 쓴 이유는 신청 성공 후 받은 <IC>applyId</IC>를 바로 URL에 담아 다음 화면으로 이동해야 했기 때문입니다.
        </Callout>
        <Callout variant="info">
          <strong>isPending 활용:</strong> 제출 버튼이나 확인 버튼에 로딩 상태를 연결하면 네트워크가 느릴 때 중복 클릭을 막고
          사용자에게 지금 처리 중이라는 피드백을 줄 수 있습니다.
        </Callout>
      </StepCard>

      <StepCard phase={4} num={18} title="확인 페이지 — URL 파라미터로 데이터 전달">
        <p>확인 페이지는 서버 재요청 없이, URL 쿼리스트링에서 값을 읽어 표시합니다.</p>
        <CodeBlock
          lang="typescript"
          path="EarlyHakjongConfirm.tsx"
          code={`'use client'
import { useSearchParams } from 'next/navigation'

const searchParams = useSearchParams()
const applyId = searchParams.get('applyId') ?? ''
const universityName = searchParams.get('universityName') ?? ''`}
        />
        <Callout variant="warn">
          <strong>useSearchParams()는 반드시 Suspense 안에서 사용하세요.</strong> <IC>Suspense</IC> 없이 렌더링하면 빌드/런타임 오류가 발생합니다.
          <IC>page.tsx</IC>에서 <IC>{'<Suspense>'}</IC>로 감싸는 것이 기본 패턴입니다.
        </Callout>
      </StepCard>

      <StepCard phase={4} num={19} title="MSW로 로컬 임시 목 API 만들기">
        <p>
          Swagger(실제 API)가 준비되기 전, <strong>MSW(Mock Service Worker)</strong>를 사용해 브라우저가 실제 서버 없이도 <IC>POST /hakjong/apply</IC>를 처리하게 만듭니다.
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

      <StepCard phase={4} num="19-1" title="MSW와 Next.js Route Handler — 두 가지 Mock 방식의 차이">
        <p>
          이 프로젝트에서는 MSW(Step 19)와 Next.js Route Handler(Step 28)를 <strong>상황에 따라 선택적으로</strong> 사용합니다.
          혼동하기 쉬우므로 차이를 정리합니다.
        </p>
        <DataTable
          headers={['항목', 'MSW (Mock Service Worker)', 'Next.js Route Handler']}
          rows={[
            ['동작 위치', '브라우저 Service Worker가 요청 가로챔', 'Next.js 서버(Node.js)에서 실행'],
            ['설정 방법', 'handlers.ts에 정규식 패턴 등록', 'app/api/.../route.ts 파일 생성'],
            ['적합한 상황', '팀 전체 공유 Mock, Swagger 스펙 기반', '개인 로컬 테스트, 빠른 프로토타이핑'],
            ['실제 서버 전환', '핸들러 주석/제거 → 자동 연결', 'API 함수의 URL을 apiClient()로 교체'],
            ['SSR 지원', 'O (server.ts 핸들러 제공)', 'O (서버에서 직접 실행)'],
          ]}
        />
        <Callout variant="key">
          <strong>선택 기준 한 줄 정리:</strong> API 스펙이 확정되어 팀 전체가 사용할 Mock → <strong>MSW</strong>,
          아직 스펙이 불확실하고 혼자 빠르게 테스트 → <strong>Route Handler</strong>
        </Callout>
      </StepCard>
    </section>
  )
}
