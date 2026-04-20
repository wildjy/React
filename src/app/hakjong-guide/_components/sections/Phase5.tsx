import { PhaseHeader, StepCard, FlowDiagram, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase5() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={5} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">수정하기 기능의 전체 흐름</h4>
        </div>
        <FlowDiagram>{`방법 1: URLSearchParams
  신청 페이지 → 확인 페이지로 전체 값 전달
           ↓
  수정하기 클릭 → 다시 URL로 값 전달
           ↓
  신청 페이지에서 useSearchParams로 복원

방법 2: sessionStorage
  신청 페이지 → sessionStorage에 임시 저장
           ↓
  확인 페이지에서 sessionStorage 읽기
           ↓
  수정하기 클릭 → 단순 이동
           ↓
  신청 페이지에서 useEffect로 복원`}</FlowDiagram>
      </div>

      <StepCard phase={5} num="20" id="step20" title="방법 1 — URLSearchParams로 전체 입력값 전달">
        <p>
          처음 구현은 <IC>URLSearchParams</IC> 기반이었습니다. 서버 전송 성공 후 확인 페이지로 이동할 때,
          화면 표시용 값과 수정 복원용 값을 모두 URL에 실어 보냅니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const params = new URLSearchParams({
  applyId: response.applyId,
  universityId: drop1.value,
  universityName: drop1.label,
  majorType: drop2.value,
  majorTypeName: drop2.label,
  minorMajorCategoryCode: drop3.value,
  minorMajorCategoryName: drop3.label,
  selfIntroduction,
  activityReport,
})
router.push('/hakjong/apply/confirm?' + params.toString())`}
        />
        <Callout variant="key">
          화면에 글자를 보여주기 위한 <IC>label</IC>만 있으면 표시만 가능하고,
          드롭다운의 실제 선택 상태를 복원하려면 <IC>value</IC>도 같이 전달해야 합니다.
        </Callout>
      </StepCard>

      <StepCard phase={5} num="21" id="step21" title="확인 페이지에서 URL 값 읽기와 신청 페이지 복원">
        <p>
          확인 페이지는 <IC>useSearchParams()</IC>로 값을 읽고, 수정하기 버튼은 다시 신청 페이지에 값을 실어 보냅니다.
          신청 페이지는 그 값을 <IC>useState</IC> 초기값으로 복원합니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const searchParams = useSearchParams()
const universityId = searchParams.get('universityId') ?? ''
const universityName = searchParams.get('universityName') ?? ''

const [selectedOption, setSelectedOption] = useState({
  drop1: {
    value: searchParams.get('universityId') ?? '',
    label: searchParams.get('universityName') ?? '',
  },
})`}
        />
        <DataTable
          headers={['개념', '설명']}
          rows={[
            ['useSearchParams()', 'URL 쿼리스트링 값을 읽는 Next.js 훅'],
            ['useState 초기값 복원', '페이지 진입 시 한 번만 이전 값을 주입'],
            ['Suspense 필요', 'useSearchParams를 쓰는 컴포넌트는 Suspense 경계가 필요'],
          ]}
        />
      </StepCard>

      <StepCard phase={5} num="22" id="step22" title="방법 2 — sessionStorage로 전환한 이유">
        <p>
          자기소개서와 활동보고서처럼 길고 민감한 내용을 URL에 담는 것은 한계가 있습니다.
          그래서 최종 구현은 <IC>sessionStorage</IC> 기반으로 바뀝니다.
        </p>
        <CompareGrid
          beforeLabel="방법 1 — URL 쿼리스트링"
          afterLabel="방법 2 — sessionStorage"
          before={
            <DataTable
              headers={['항목', '설명']}
              rows={[
                ['데이터 노출', '주소창과 히스토리에 노출'],
                ['길이 제한', '브라우저별 URL 길이 제한 존재'],
                ['적합한 데이터', '필터/검색 조건 같은 짧은 값'],
              ]}
            />
          }
          after={
            <DataTable
              headers={['항목', '설명']}
              rows={[
                ['데이터 노출', '주소창에 노출되지 않음'],
                ['길이 제한', '텍스트 저장에 상대적으로 유리'],
                ['적합한 데이터', '임시 작성 내용, 민감한 텍스트'],
              ]}
            />
          }
        />
        <CodeBlock
          lang="typescript"
          code={`sessionStorage.setItem(
  'hakjong_apply_form',
  JSON.stringify({
    applyId: response.applyId,
    universityId: drop1.value,
    universityName: drop1.label,
    selfIntroduction,
    activityReport,
  }),
)

router.push('/hakjong/apply/confirm')`}
        />
        <Callout variant="tip">
          <IC>sessionStorage</IC>는 문자열만 저장하므로 객체를 넣기 전에 반드시 <IC>JSON.stringify()</IC>가 필요합니다.
        </Callout>
      </StepCard>

      <StepCard phase={5} num="23" id="step23" title="Hydration mismatch와 useEffect 복원 패턴">
        <p>
          브라우저 저장소를 렌더링 중에 직접 읽으면 SSR 결과와 클라이언트 첫 렌더링 결과가 달라져
          <strong>Hydration mismatch</strong>가 발생할 수 있습니다. 최종 해법은 <IC>useEffect</IC>에서 마운트 후 복원하는 것입니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`const [selectedOption, setSelectedOption] = useState({
  drop1: { value: '', label: '' },
  drop2: { value: '', label: '' },
  drop3: { value: '', label: '' },
})

useEffect(() => {
  const raw = sessionStorage.getItem('hakjong_apply_form')
  if (!raw) return
  const saved = JSON.parse(raw)

  setSelectedOption({
    drop1: { value: saved.universityId ?? '', label: saved.universityName ?? '' },
    drop2: { value: saved.majorType ?? '', label: saved.majorTypeName ?? '' },
    drop3: {
      value: saved.minorMajorCategoryCode ?? '',
      label: saved.minorMajorCategoryName ?? '',
    },
  })
}, [])`}
        />
        <DataTable
          headers={['방법', 'Hydration 안전?', '설명']}
          rows={[
            ['렌더링 중 typeof window 분기', '아니오', '서버/클라이언트 결과가 달라질 수 있음'],
            ['useState lazy initializer', '아니오', 'SSR에서도 실행되므로 동일 문제'],
            ['useEffect로 마운트 후 복원', '예', 'Hydration 완료 후 브라우저에서만 실행'],
          ]}
        />
        <Callout variant="warn">
          브라우저 전용 API인 <IC>window</IC>, <IC>sessionStorage</IC>, <IC>localStorage</IC>가
          렌더링 결과를 바꾸는 경우에는 <IC>useEffect</IC> 안에서 <IC>setState</IC>로 반영하는 패턴이 가장 안전합니다.
        </Callout>
      </StepCard>

      <StepCard phase={5} num="24" id="step24" title="두 방식의 최종 비교와 선택 기준">
        <DataTable
          headers={['항목', 'URL 쿼리스트링', 'sessionStorage']}
          rows={[
            ['데이터 노출', '주소창에 노출', '노출 없음'],
            ['탭/링크 공유', '가능', '불가'],
            ['긴 텍스트 전달', '부적합', '적합'],
            ['민감 데이터', '부적합', '상대적으로 적합'],
            ['SSR 처리', '간단함', 'Hydration 안전 처리 필요'],
          ]}
        />
        <Callout variant="key">
          이 프로젝트는 초기에는 URL 방식으로 빠르게 검증했고,
          최종적으로는 긴 텍스트와 민감 데이터를 다루기 위해 <IC>sessionStorage</IC> 방식으로 전환했습니다.
        </Callout>
      </StepCard>
    </section>
  )
}
