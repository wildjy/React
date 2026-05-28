import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase20() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={20} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경: 같은 ID가 어디서는 string, 어디서는 number</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">신청 POST는 Swagger에서 모든 코드 필드를 string으로 요구한다.</p>
        <CodeBlock
          lang="json"
          code={`{ "majorIdHsbs": ["12345", "12346"], "preferProvsCodes": ["1", "2"] }`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">그런데 조회 응답들에서는 같은 코드가 number로 온다.</p>
        <CodeBlock
          lang="json"
          code={`{ "univCode": 1046, "majorIdHsb": 16219191, "preferProvsCode": 1 }`}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          이 <strong>요청 ↔ 응답 비대칭</strong>이 한 세션 안에서 두 가지 서로 다른 사고로 나타났다.
        </p>
      </div>

      {/* 발견 경로 ① */}
      <div id="phase20-case1" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-zinc-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ①
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">발견 경로 ① — 서버 검증이 막은 경우</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          수정하기로 들어와 prefetch가 카드를 채우고, 사용자가 입력완료를 누르자:
        </p>
        <CodeBlock
          lang="text"
          code={`VALIDATION_PIPE_ERROR: each value in majorIdHsbs must be a string`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          NestJS <IC>class-validator</IC>의 <IC>{'@IsString({ each: true })'}</IC> 검증이 차단한 것. 원인 추적:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>prefetch가 응답의 <IC>majorIdHsb: 16219191</IC> (number)를 그대로 <IC>drop3.value</IC>에 넣음.</li>
          <li>타입은 <IC>StringDropDownOption.value: string</IC>인데 런타임은 number — <strong>silent type drift</strong>.</li>
          <li>handleSubmit이 <IC>card.options.drop3.value</IC>를 모아 <IC>majorIdHsbs</IC>로 보냄 → <IC>number[]</IC> JSON.</li>
          <li>서버 검증 차단.</li>
        </ol>
      </div>

      {/* 발견 경로 ② */}
      <div id="phase20-case2" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-zinc-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ②
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">발견 경로 ② — UI가 조용히 비어 있는 경우</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          선호 지역 드롭다운이 prefetch 후에도 placeholder만 표시. 콘솔 로그는 정상 데이터를 보여줌:
        </p>
        <CodeBlock
          lang="text"
          code={`preferSelectsData.preferAreas = [{num:1, provCode:'1', provName:'서울'}]`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">원인:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>DropDown은 <IC>selectedValue === option.value</IC>로 라벨을 찾아 표시.</li>
          <li>옵션 출처(<IC>usePreferProvsList</IC>)는 서버가 <IC>preferProvsCode: 1</IC> (number)로 줘 <IC>option.value = 1</IC> (number).</li>
          <li>복원값은 <IC>{"String(provCode) = '1'"}</IC> (string).</li>
          <li><IC>{"'1' === 1"}</IC> → <strong>false</strong> → 매치 실패 → 빈 드롭다운.</li>
        </ul>
        <Callout variant="warn">
          <strong>같은 비대칭이 다른 곳에서 다른 증상으로 발현</strong>됐다. 검증 에러는 "왁자지껄"하게 죽고, 매칭 실패는 "조용히" UI만 비어 있다.
        </Callout>
      </div>

      <StepCard phase={20} num={65} id="step65" title="어디에서 정규화할 것인가">
        <p>세 가지 위치가 가능. 각각의 트레이드오프:</p>
        <DataTable
          headers={['위치', '장점', '단점']}
          rows={[
            [<strong key="a">백엔드</strong>, '단일 해결, 프론트 코드 그대로', '배포 필요, 협의 필요'],
            [<><strong key="b">API 함수 boundary</strong> (<IC key="b2">fetchXxx</IC>)</>, '한 번만 normalize, 모든 사용처 안전', '약간의 boilerplate, raw 타입 분리'],
            [<><strong key="c">사용처마다</strong> (<IC key="c2">String(...)</IC>)</>, '변경 범위 최소', '새 사용처 추가 시 빠뜨리기 쉬움 — 함정'],
          ]}
        />
        <p>이 프로젝트는 <strong>사용처별 <IC>String(...)</IC> 정규화</strong>로 둘 다 패치했다(API boundary는 다른 turn에서 시도했다 보류).</p>
        <CodeBlock
          lang="typescript"
          code={`// 1) 카드 복원 (useAdmissionEvaluationApplyForm)
drop1: { value: String(item.univCode), label: item.univName },
drop3: { value: String(item.majorIdHsb), label: item.majorName },

// 2) 선호 복원 (같은 훅)
drop5: { value: String(pa1.provCode), label: pa1.provName },

// 3) 옵션 매핑 (useApplyDropOptions)
{ label: item.preferProvsName, value: String(item.preferProvsCode) }
{ label: item.preferAiPartsName, value: String(item.preferAiPartsCode) }`}
        />
        <p>총 네 군데. 패턴이 같아 한꺼번에 보이지만, <strong>각각 빠뜨리면 다른 증상으로 터진다.</strong></p>
      </StepCard>

      <StepCard phase={20} num={66} id="step66" title="근본 해결은 백엔드 통일 — TODO로 추적">
        <p>
          같은 코드를 사용처마다 정규화하는 건 <strong>새 사용처를 추가할 때 빠뜨릴 위험</strong>이 있다.
          진짜 해결은 백엔드가 응답 코드 필드를 모두 string으로 통일하는 것.
        </p>
        <p className="font-semibold text-gray-800 mt-2">다음 필드들이 영향 범위:</p>
        <DataTable
          headers={['엔드포인트', '필드', '현재 응답']}
          rows={[
            [<IC key="a">GET /admission-evaluation/univs</IC>, <IC key="a2">univCode</IC>, 'number'],
            [<IC key="b">GET /admission-evaluation/prefer-aiparts</IC>, <IC key="b2">preferAiPartsCode</IC>, 'number 의심'],
            [<IC key="c">GET /admission-evaluation/prefer-provs</IC>, <IC key="c2">preferProvsCode</IC>, <><strong key="c3">number 확인됨</strong></>],
            [<IC key="d">GET /admission-evaluation/hope-univs</IC>, <><IC key="d2">univCode</IC>, <IC key="d3">majorIdHsb</IC></>, 'number'],
            [<IC key="e">GET /admission-evaluation/prefer-selections</IC>, <><IC key="e2">pPartCode</IC>, <IC key="e3">provCode</IC></>, 'number 의심'],
          ]}
        />
        <Callout variant="info">
          <strong>요청 메시지(백엔드용):</strong> 신청 요청 body(<IC>POST /admission-evaluation/apply</IC>)는 모든 코드 필드를 string으로 받습니다.
          그런데 조회 응답들이 같은 코드를 number로 반환합니다. 프론트 DropDown은 옵션과 선택값을 <IC>===</IC> 비교해 라벨을 표시하는데,
          타입이 다르면 매치가 깨져 선택 상태가 표시되지 않습니다.
          모든 응답의 코드 필드를 <strong>string으로 통일</strong>해 주세요(요청 body와 동일 형식).
        </Callout>
        <p>TODO 마커를 한 곳에 모아두면 잊지 않는다:</p>
        <CodeBlock
          lang="typescript"
          code={`/**
 * TODO(backend): 응답의 코드 필드들을 모두 string으로 통일 요청.
 *   - univCode, majorIdHsb, preferAiPartsCode, preferProvsCode 등
 * 통일 완료 시 useApplyDropOptions / useAdmissionEvaluationApplyForm 의
 * String(...) 정규화 모두 제거 가능.
 */`}
        />
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-zinc-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <IC>{'.json<HopeUnivsResponse[]>()'}</IC> 같은 ky의 json 캐스팅은 <strong>타입 단언이지 검증이 아니다.</strong>{' '}
          서버가 다른 형식을 줘도 TS는 잡지 못한다. 외부 시스템과의 경계에서 명시적으로 정규화하거나, 더 안전하게는 zod 같은 런타임 검증을 둬라.
        </Callout>
        <Callout variant="key">
          <strong>요청 ↔ 응답 비대칭은 가장 흔한 사고 원인이다.</strong> 같은 의미의 필드를 한쪽은 string, 다른 쪽은 number로 받으면
          차이만큼 프론트가 어댑터 코드를 떠안는다. 발견하는 즉시 백엔드와 정렬 요청 — 어댑터를 늘리는 건 단기 해결, 정렬이 본 해결.
        </Callout>
      </div>
    </section>
  )
}
