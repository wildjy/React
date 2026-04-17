import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase2() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={2} />

      {/* Step 6 */}
      <StepCard phase={2} num={6} title="로그인 체크 및 조건부 페이지 이동">
        <p>
          접근 제어가 필요한 탭은 <IC>link href</IC> 대신 <IC>onBeforeChange</IC>를 사용합니다.
          콜백에서 <IC>false</IC>를 반환하면 탭 전환이 차단됩니다.
        </p>
        <DataTable
          headers={['속성', '렌더링', '클릭 동작']}
          rows={[
            [<IC key="a">link href=&quot;...&quot;</IC>, <><IC key="b">&lt;Link&gt;</IC>{' (Next.js)'}</>, '즉시 이동, 중간 가로채기 불가'],
            [<IC key="c">onBeforeChange={'{fn}'}</IC>, <IC key="d">&lt;button&gt;</IC>, <><IC>fn()</IC> 실행 → <IC>false</IC> 반환 시 이동 차단</>],
          ]}
        />
        <CodeBlock
          lang="tsx"
          code={`import { useCurrentUser } from '@libs/entities/user'
import { useRouter } from 'next/navigation'

const { currentUser } = useCurrentUser()
const router = useRouter()

// 평가 신청하기: 로그인 체크
const handleBeforeApply = () => {
  if (!currentUser.userId) {            // userId 빈 문자열 = 비로그인
    alert('로그인이 필요한 서비스입니다.')
    return false                          // false → 탭 전환 차단
  }
  router.push('/hakjong/apply')         // 로그인 상태면 수동으로 이동
  return true
}

// 평가 리포트: 로그인 체크 + 신청 완료 체크
const handleBeforeReport = () => {
  if (!currentUser.userId) {
    alert('로그인이 필요한 서비스입니다.')
    return false
  }
  if (!isApplyCompleted) {
    alert('평가 신청을 먼저 완료해주세요.')
    return false
  }
  router.push('/hakjong/report')
  return true
}`}
        />
        <Callout variant="key">
          <strong>useCurrentUser() 훅:</strong>{' '}
          <IC>currentUser.userId</IC>가 빈 문자열(<IC>{'\'\''}  </IC>)이면 비로그인,
          값이 있으면 로그인 상태입니다.
          내부적으로 <IC>/api/next/auth/current-user</IC> API를 호출해 쿠키 기반 인증을 확인합니다.
        </Callout>
      </StepCard>

      {/* Step 7 */}
      <StepCard phase={2} num={7} title="데모 데이터로 상태 관리 (API 연동 전)">
        <p>
          API가 아직 없는 경우, 데모 훅을 만들어 임시 상태를 관리합니다.
          추후 교체할 수 있도록 예상 API 스펙을 주석으로 남겨둡니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// TODO: API 연동 시 실제 신청 완료 상태로 대체
// 예상 API:
//   GET /hakjong/apply/status
//   Response: { isApplyCompleted: boolean }
//
// 대체 예시:
//   const { data } = useQuery({
//     queryKey: ['hakjong', 'apply', 'status'],
//     queryFn: () => apiClientFor(process.env.CLIENT_API_URL)()
//       .get('hakjong/apply/status')
//       .json<{ isApplyCompleted: boolean }>(),
//     enabled: !!currentUser.userId,
//   })
//   const isApplyCompleted = data?.isApplyCompleted ?? false

const useDemoApplyCompleted = () => {
  const [isApplyCompleted] = useState(true)
  return { isApplyCompleted }
}`}
        />
        <Callout variant="tip">
          API 연동 시에는 데모 훅만 React Query <IC>useQuery</IC>로 교체하면 됩니다.
          컴포넌트 코드는 변경하지 않아도 됩니다.
        </Callout>
      </StepCard>
    </section>
  )
}
