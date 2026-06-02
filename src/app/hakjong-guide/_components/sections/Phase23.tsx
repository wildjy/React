import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase23() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={23} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경: 같은 정보를 어디에 둘 것인가</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          Phase 19에서 sessionStorage 의존을 걷어내고 서버를 진실의 원천으로 옮겼다.
          그런데 신청 완료 여부(<IC>isApplyCompleted</IC>)는 여전히 sessionStorage 플래그(<IC>{"applyComplete: 'true'"}</IC>)로 남아 있었다.
          이걸 서버 API로 옮기는 결정을 다루면서 몇 가지 함정과 의미 분리 이슈가 드러났다.
        </p>
      </div>

      <StepCard phase={23} num={70} id="step70" title='흔한 오해 — "submit POST 호출로 상태 확인"'>
        <Callout variant="warn">
          "submit이 성공하면 그게 완료 아닌가? <IC>submitAdmissionEvaluationApply</IC>로 대체하면 되지 않나?"
        </Callout>
        <p>
          <strong>❌ 안 됨.</strong> <IC>submitAdmissionEvaluationApply</IC>는 POST — write 동사다.
          호출하면 <strong>새 신청이 또 생성</strong>된다. 상태 확인 용도로 호출하면 매번 새 신청이 일어나는 사고가 발생.
        </p>
        <Callout variant="key">
          <strong>HTTP 동사를 헷갈리지 마라.</strong> 상태 확인은 read 동사여야 한다. write(POST/PUT/DELETE)는 데이터를 바꾼다.
          "확인"이라는 단어가 양쪽에 쓰여도, 데이터를 바꾸지 않는 게 진짜 확인.
        </Callout>
      </StepCard>

      <StepCard phase={23} num={71} id="step71" title="임시 우회 — 기존 GET 쿼리로 derivation">
        <p>이미 존재하는 confirm 조회 쿼리들이 사용자의 저장된 신청 데이터를 돌려준다. <strong>응답이 비어 있지 않으면 = 신청한 적 있음</strong>.</p>
        <CodeBlock
          lang="typescript"
          code={`const { data: hopeUnivsData } = useConfirmHopeUnivsQuery();
const isApplyCompleted = (hopeUnivsData?.length ?? 0) > 0;`}
        />
        <p>이러면 sessionStorage 플래그 없이 서버 진실로 가드 가능. <strong>다만 의미가 살짝 바뀐다.</strong></p>
        <DataTable
          headers={['측면', 'sessionStorage 플래그', 'GET 쿼리 derivation']}
          rows={[
            ['true 되는 시점', 'Confirm 모달 "신청완료" 버튼 클릭', 'Apply 페이지 submit POST 성공'],
            ['의미', '"사용자가 최종 확인까지 마침"', '"임시저장 포함, 서버에 데이터 있음"'],
            ['세션 끊기면', '사라짐 (탭 닫기)', '유지 (서버에 있으니까)'],
            ['다른 기기', 'false', 'true'],
          ]}
        />
        <p><strong>이게 정책적으로 맞는지</strong> 백엔드/PO와 정렬 필수.</p>
      </StepCard>

      <StepCard phase={23} num={72} id="step72" title="정석 — dedicated status API">
        <p>가장 깨끗한 해결은 백엔드에 <strong>신청 상태 전용 엔드포인트</strong>를 추가:</p>
        <CodeBlock
          lang="text"
          code={`GET /admission-evaluation/apply/status
Response: { isApplyCompleted: boolean }`}
        />
        <p>프론트 스캐폴드는 미리 준비해 두면 응답 도착 시 swap이 한 줄로 끝난다.</p>
        <CodeBlock
          lang="typescript"
          code={`// types
export interface AdmissionEvaluationApplyStatusResponse {
  isApplyCompleted: boolean;
}

// api
export const fetchAdmissionEvaluationApplyStatus =
  async (): Promise<AdmissionEvaluationApplyStatusResponse> => {
    return apiClient()
      .get('admission-evaluation/apply/status')
      .json<AdmissionEvaluationApplyStatusResponse>();
  };

// query 훅
export function useAdmissionEvaluationApplyStatusQuery() {
  return useQuery({
    queryKey: ['admissionEvaluationApplyStatus'],
    queryFn: () => fetchAdmissionEvaluationApplyStatus(),
  });
}`}
        />
        <p>
          <IC>useAdmissionEvaluationNavigation</IC> 안에서 <IC>sessionStorage.getItem</IC> 호출을 이 훅의 데이터로 swap.
          ConfirmModal의 <IC>sessionStorage.setItem</IC>도 제거(서버가 알아서 갱신).
        </p>
      </StepCard>

      <StepCard phase={23} num={73} id="step73" title='의미 다양성 — "완료"가 의미하는 세 가지'>
        <p>"신청 완료"는 모호한 표현이다. 코드를 읽는 사람이 같은 단어로 다른 걸 떠올릴 수 있다. 가능한 후보:</p>
        <DataTable
          headers={['정의', '어떤 동작이 true로 만드는가']}
          rows={[
            [<>A. <strong key="a">임시저장 완료</strong></>, 'Apply 페이지에서 submit POST 성공'],
            [<>B. <strong key="b">확인 완료</strong></>, 'Confirm 페이지의 모달 "신청완료" 버튼 클릭'],
            [<>C. <strong key="c">최종 확정 완료</strong></>, '별도 확정 API 호출 (POST /apply/confirm) — 현재 미구현'],
          ]}
        />
        <p>
          <strong>현재 구현은 B</strong>(sessionStorage만 세팅, 서버는 아직 모름).
          <strong> GET 쿼리 derivation은 A</strong>.
          <strong> 정석 API는 백엔드 정책에 따라 A·B·C 중 어느 것이라도 될 수 있음</strong>.
        </p>
        <p>같은 변수명 <IC>isApplyCompleted</IC>로 셋 다 가리킬 수 있으니, 코드 옆 주석이나 더 정확한 이름이 필요하다.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 모호
const isApplyCompleted = ...;

// ✅ 구체적
const hasSubmittedDraft = ...;       // A
const hasConfirmedFinal = ...;        // B/C`}
        />
      </StepCard>

      <StepCard phase={23} num={74} id="step74" title="백엔드 응답 대기 동안의 트래킹">
        <p>백엔드에 API 추가를 요청한 후 응답까지 시차가 생긴다. 그 사이 작업이 잊혀지지 않도록:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>프로젝트 메모리</strong>(Claude memory): "백엔드에 GET /apply/status 요청 완료, 응답 대기 중 (YYYY-MM-DD)"</li>
          <li><strong>코드 내 TODO 주석</strong>: <IC>{'// TODO: API 연동 시 ... ; 예상 API: GET /apply/status returning { isApplyCompleted: boolean }'}</IC></li>
          <li>
            <strong>변경 체크리스트</strong>: 응답 도착 시 손볼 곳을 미리 정리
            <ol className="list-decimal pl-5 mt-1 space-y-0.5">
              <li>types: response interface 추가</li>
              <li>api: fetch 함수 추가</li>
              <li>queries: query 훅 추가</li>
              <li>navigation 가드 — <IC>sessionStorage.getItem</IC> → 훅 데이터</li>
              <li>Confirm 모달 onClick — <IC>sessionStorage.setItem</IC> 제거</li>
              <li>진입 시 <IC>sessionStorage.removeItem</IC> 제거</li>
              <li><IC>const.ts</IC>에서 <IC>applyComplete</IC> 키 제거</li>
            </ol>
          </li>
        </ul>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>같은 boolean 변수도 누가 언제 true로 만드는가에 따라 의미가 달라진다.</strong>{' '}
          <IC>isCompleted</IC>라는 이름은 무엇의 완료인지 말해주지 않는다.
          정의를 주석으로 박거나, 더 정확한 이름(<IC>hasSubmittedDraft</IC> / <IC>hasConfirmedFinal</IC> 등)으로 분리하라.
        </Callout>
        <Callout variant="key">
          <strong>상태 확인은 read API로.</strong> write API(POST submit)를 read 용도로 쓰지 마라.
          매 호출이 데이터를 바꾸는 사고로 이어진다.
        </Callout>
        <Callout variant="key">
          <strong>백엔드 의존 작업은 메모리/TODO로 추적.</strong> 응답 도착 시 swap 체크리스트를 미리 정리해두면 frictionless하게 전환된다.
        </Callout>
      </div>
    </section>
  )
}
