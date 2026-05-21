import { PhaseHeader, StepCard, FlowDiagram, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase10() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={10} />

      <Callout variant="info">
        이 Phase부터 실제 코드의 이름(<IC>AdmissionEvaluation*</IC>)과 경로를 그대로 사용합니다.
        앞 Phase의 <IC>Hakjong*</IC>는 학습용 추상화 명칭이며, 같은 <IC>apps/early</IC>의 학종 서비스를 가리킵니다.
      </Callout>

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경 — 무엇을, 왜 바꿨나</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          신청 폼을 처음 만들 때는 백엔드가 준비되지 않아, <strong>임시 제출 경로</strong>로 동작을 확인했습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-3">
          <li>신청 데이터를 Next.js Route Handler(로컬 mock, <IC>app/api/admission-evaluation/apply/route.ts</IC>)로 POST → 가짜 <IC>applyId</IC> 발급</li>
          <li>폼 입력값 <strong>전체(코드 + 이름)</strong>를 하나의 요청 타입(<IC>AdmissionEvaluationApplyRequest</IC>)으로 정의</li>
          <li>그 요청 객체를 <strong>그대로</strong> <IC>sessionStorage</IC>에 저장해 확인(confirm) 페이지로 전달</li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          실제 백엔드 API가 준비되면서 이 임시 경로를 실 연동으로 교체했습니다. 이때 단순히 엔드포인트만 바꾼 것이 아니라
          <strong> "서버로 보낼 데이터"와 "화면 표시·복원용 데이터"의 책임을 분리</strong>한 것이 이번 작업의 핵심입니다.
        </p>
        <FlowDiagram>{`[이전 — 임시]                              [이후 — 실 API]
폼 전체(코드+이름)                          서버 페이로드(코드만)
   │ = 하나의 요청 타입                        │ = AdmissionEvaluationApplyRequest
   ▼                                          ▼
mock Route Handler  ──► 가짜 applyId        실 POST /admission-evaluation/apply ──► 실제 applyId
   │                                          │
   ▼                                          ▼
sessionStorage에 요청 객체 그대로 저장       sessionStorage엔 "표시·복원용 스냅샷" 별도 저장
   └─► 확인 페이지가 이름 읽어 표시            └─► 스냅샷 = 요청 + applyId + 이름(라벨)`}</FlowDiagram>
      </div>

      {/* Step 44 */}
      <StepCard phase={10} num="44" id="step44" title="API 함수 — mock Route Handler 제거하고 실 엔드포인트로">
        <p>
          파일: <IC>apps/early/src/entities/admission-evaluation/api/index.ts</IC>
        </p>
        <CompareGrid
          beforeLabel="변경 전 — ky로 로컬 Route Handler 직접 호출"
          afterLabel="변경 후 — 공통 apiClient로 백엔드 엔드포인트 호출"
          before={
            <CodeBlock
              lang="typescript"
              code={`import ky from 'ky';

export const submitAdmissionEvaluationApply = async (
  requestData: AdmissionEvaluationApplyRequest,
): Promise<AdmissionEvaluationApplyResponse> => {
  const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const data = await ky
    .post(\`\${basePath}/api/admission-evaluation/apply\`, { json: requestData })
    .json<AdmissionEvaluationApplyResponse>();
  return data;
};`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              code={`// 학종 신청 제출 API
export const submitAdmissionEvaluationApply = async (
  requestData: AdmissionEvaluationApplyRequest,
): Promise<AdmissionEvaluationApplyResponse> => {
  const data = await apiClient()
    .post('admission-evaluation/apply', { json: requestData })
    .json<AdmissionEvaluationApplyResponse>();
  return data;
};`}
            />
          }
        />
        <DataTable
          headers={['구분', '임시 (mock Route)', '실 API']}
          rows={[
            ['HTTP 클라이언트', <><IC key="a">ky</IC> 직접 import</>, <>공통 <IC key="b">apiClient()</IC> (baseURL/인증 자동)</>],
            ['대상 URL', '{NEXT_PUBLIC_BASE_URL}/api/admission-evaluation/apply (앱 내부)', '{API_URL}/admission-evaluation/apply (백엔드)'],
            ['applyId', 'route.ts가 Date.now()로 만든 가짜 값', '서버가 발급한 실제 값'],
          ]}
        />
        <Callout variant="warn">
          <strong>mock Route Handler 정리:</strong> 실 연동 후 <IC>app/api/admission-evaluation/apply/route.ts</IC>는 더 이상 참조되지 않습니다.
          Phase 9의 "임시 우회는 원인 해소 시 제거" 원칙대로, 확인 후 삭제 대상입니다.
        </Callout>
      </StepCard>

      {/* Step 45 */}
      <StepCard phase={10} num="45" id="step45" title='요청 타입 재정의 — "전송용"과 "표시·복원용"의 분리'>
        <p>가장 큰 변화는 <strong>요청 타입의 의미가 바뀐 것</strong>입니다.</p>
        <CompareGrid
          beforeLabel="변경 전 — 요청 타입 = 폼 전체(코드 + 이름)"
          afterLabel="변경 후 — 요청 타입 = 서버 페이로드(코드만)"
          before={
            <CodeBlock
              lang="typescript"
              code={`export interface AdmissionEvaluationApplyRequest {
  universityId: string;
  universityName: string;        // ← 이름까지 서버로 전송했음
  majorType: string;
  majorTypeName: string;
  minorMajorCategoryCode: string;
  minorMajorCategoryName: string;
  preferMajorCode: string;
  preferMajorName: string;
  // ... preferArea*, selfActivity1~3
}`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              code={`// 서버 전송 페이로드 — 코드/식별자만 전송
export interface AdmissionEvaluationApplyRequest {
  userId: string;
  subjectNot: string;            // 비교과 추가 입력값
  majorIdHsbs: string[];         // 희망 대학 리스트(카드)의 학과 ID 목록
  preferAiPartsCodes: string[];  // 선호 전공 코드 (필수 + 선택)
  preferProvsCodes: string[];    // 선호 지역 코드 (필수 + 선택)
  emphasis1: string;
  emphasis2: string;
  emphasis3: string;
  simpleQuestion: string;        // 입시전문가 간단 질문
}`}
            />
          }
        />
        <p>
          이전 구조는 "화면에 보여줄 이름"과 "서버에 보낼 코드"가 한 타입에 섞여 있었습니다. 임시 제출에서는 같은 객체를
          <IC>sessionStorage</IC>에도 그대로 썼기 때문에 편했지만, 실제 서버는 <strong>코드/식별자만</strong> 필요로 합니다.
        </p>
        <p className="font-semibold text-gray-800 mt-2">폼 입력 → 서버 페이로드 매핑</p>
        <DataTable
          headers={['서버 필드', '폼 입력 출처', '비고']}
          rows={[
            [<IC key="a">userId</IC>, <IC key="a2">currentUser.userId</IC>, '로그인 사용자'],
            [<IC key="b">subjectNot</IC>, <IC key="b2">comparativeExtraInfo</IC>, '비교과 추가 입력 영역'],
            [<IC key="c">majorIdHsbs</IC>, <IC key="c2">selectedCards.map((c) =&gt; c.options.drop3.value)</IC>, '희망 대학 카드들의 학과 ID 배열'],
            [<IC key="d">preferAiPartsCodes</IC>, <IC key="d2">[drop4.value, drop4_1.value].filter(Boolean)</IC>, '전공 필수 + 선택, 빈 값 제거'],
            [<IC key="e">preferProvsCodes</IC>, <IC key="e2">[drop5.value, drop5_1.value].filter(Boolean)</IC>, '지역 필수 + 선택, 빈 값 제거'],
            [<IC key="f">emphasis1~3</IC>, <IC key="f2">selfActivity1~3</IC>, '강조하고 싶은 내용'],
            [<IC key="g">simpleQuestion</IC>, '간단 질문 Textarea', 'Step 48에서 신규 추가'],
          ]}
        />
        <Callout variant="info">
          <strong>단일 값 → 배열의 의미 변화:</strong> 임시 타입은 대학/계열/학과를 단일 값으로만 담았지만,
          실제 신청은 "희망 대학 리스트(카드 N개)"를 보냅니다. 그래서 <IC>majorIdHsbs</IC>가 <strong>배열</strong>입니다.
          카드 추가 UI(Step 12)가 이 배열의 원천입니다.
        </Callout>
      </StepCard>

      {/* Step 46 */}
      <StepCard phase={10} num="46" id="step46" title="스냅샷 타입을 요청 기준으로 정렬 (extends)">
        <p>
          요청에서 이름(라벨)을 빼버리면, 확인 페이지가 보여주던 "대학명/계열명/학과명"을 잃습니다.
          그래서 <strong>표시·복원 전용 타입</strong>을 따로 두되, 요청 타입을 <IC>extends</IC>해서 정렬했습니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`/**
 * 신청 폼 스냅샷 — sessionStorage 저장 전용.
 * 확인(confirm) 페이지의 요약 표시 + '수정하기' 시 폼 복원에 사용한다.
 * 서버 전송 페이로드(AdmissionEvaluationApplyRequest)를 그대로 포함하고,
 * 표시·복원에만 필요한 응답값(applyId)과 라벨/코드를 추가로 보관한다.
 * (emphasis 등 공통 필드는 요청 타입에서 상속받아 중복을 없앤다)
 */
export interface AdmissionEvaluationApplyFormSnapshot
  extends AdmissionEvaluationApplyRequest {
  applyId: string;
  universityId: string;
  universityName: string;
  majorType: string;
  majorTypeName: string;
  minorMajorCategoryCode: string;
  minorMajorCategoryName: string;
  preferMajorCode: string;
  preferMajorName: string;
  preferMajorChoiceCode: string;
  preferMajorChoiceName: string;
  preferAreaCode: string;
  preferAreaName: string;
  preferAreaChoiceCode: string;
  preferAreaChoiceName: string;
}`}
        />
        <p className="font-semibold text-gray-800 mt-2">왜 extends인가? — 단일 출처(Single Source of Truth)</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>스냅샷이 요청 페이로드 전체를 상속하므로, <IC>emphasis1~3</IC> · <IC>simpleQuestion</IC> · <IC>subjectNot</IC> 같은 필드를 <strong>두 타입에 중복 정의하지 않습니다</strong>.</li>
          <li>서버 요청 필드가 바뀌면 스냅샷에도 자동 반영 → 타입 드리프트(불일치) 방지.</li>
          <li>스냅샷 = <IC>요청</IC> + <IC>applyId</IC>(서버 응답) + <IC>이름/라벨</IC>(화면 표시·복원용) 이라는 의미가 타입 정의만 봐도 드러납니다.</li>
        </ul>
        <Callout variant="info">
          이전 임시 타입에는 <IC>selfActivity1~3</IC>가 있었지만, 요청의 <IC>emphasis1~3</IC>와 의미가 같아 중복이었습니다.
          정렬 과정에서 스냅샷의 <IC>selfActivity*</IC>를 제거하고 상속된 <IC>emphasis*</IC>로 통일했습니다. (확인 페이지도 <IC>emphasis*</IC>를 읽도록 함께 수정)
        </Callout>
      </StepCard>

      {/* Step 47 */}
      <StepCard phase={10} num="47" id="step47" title="handleSubmit 재작성 — 요청 1번 만들고 스냅샷에 재사용">
        <p>
          파일: <IC>apps/early/src/window/admission-evaluation/EarlyAdmissionEvaluationApply.tsx</IC>
        </p>
        <CodeBlock
          lang="typescript"
          code={`// ① 서버 전송 페이로드: 카드들의 학과 ID와 선택된 코드만 전송
const requestData: AdmissionEvaluationApplyRequest = {
  userId: currentUser.userId,
  subjectNot: comparativeExtraInfo,
  majorIdHsbs: selectedCards.map((card) => card.options.drop3.value),
  preferAiPartsCodes: [drop4.value, drop4_1.value].filter(Boolean),
  preferProvsCodes: [drop5.value, drop5_1.value].filter(Boolean),
  emphasis1: selfActivity1,
  emphasis2: selfActivity2,
  emphasis3: selfActivity3,
  simpleQuestion,
};
const response = await submitApply(requestData);

// ② 확인 페이지 표시 + '수정하기' 복원용 스냅샷
//    전송 페이로드를 그대로 펼치고(...requestData), applyId·표시용 라벨만 추가
const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  applyId: response.applyId,
  universityId: drop1.value,
  universityName: drop1.label,
  majorType: drop2.value,
  majorTypeName: drop2.label,
  minorMajorCategoryCode: drop3.value,
  minorMajorCategoryName: drop3.label,
  // ... preferMajor*, preferArea* 라벨
};
sessionStorage.setItem(
  ADMISSION_EVALUATION_STORAGE_KEY.applyForm,
  JSON.stringify(snapshot),
);
router.push('/four-year-university/admission-evaluation/confirm');`}
        />
        <p className="font-semibold text-gray-800 mt-2">핵심 포인트</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><IC>submitApply(requestData)</IC> 한 번으로 서버 전송. 디버그 <IC>console.log</IC>는 제거.</li>
          <li>스냅샷은 <IC>{'{ ...requestData, ... }'}</IC>로 <strong>요청을 재사용</strong>합니다. 요청이 스냅샷의 부분집합이라는 <IC>extends</IC> 관계가 코드에도 그대로 나타납니다.</li>
          <li>스냅샷이 요청 전체를 담으므로, '수정하기'로 돌아왔을 때 <IC>subjectNot</IC>(비교과)·<IC>simpleQuestion</IC>까지 복원할 수 있습니다. (복원 <IC>useEffect</IC>는 Step 21 패턴 그대로 — 마운트 후 읽기)</li>
        </ul>
      </StepCard>

      {/* Step 48 */}
      <StepCard phase={10} num="48" id="step48" title="간단 질문 입력란 추가 (simpleQuestion)">
        <p>
          요청에 <IC>simpleQuestion</IC> 필드가 생겼지만 UI에는 입력란이 없었습니다.
          '간단 질문하기' 섹션에 제어형 <IC>Textarea</IC>를 추가했습니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`const [simpleQuestion, setSimpleQuestion] = useState('');

// ... '간단 질문하기' 섹션 내부
<Textarea
  addId="textarea-simple-question"
  label="입시전문가에게 궁금한 점을 작성해주세요."
  mode="base"
  size="base"
  value={simpleQuestion}
  maxLength={200}
  onChange={(e) => setSimpleQuestion(e.target.value)}
/>`}
        />
        <Callout variant="key">
          <strong>타입을 먼저, UI를 나중에:</strong> 요청 타입에 필드가 생기면 <IC>handleSubmit</IC>에서 타입 에러로
          "이 값을 어디서 채울 것인가?"를 강제로 마주하게 됩니다. 타입이 누락된 입력 UI를 잡아준 사례입니다.
        </Callout>
      </StepCard>

      {/* 차이점 정리 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">이전 sessionStorage 방식과의 차이점 (정리)</h4>
        </div>
        <DataTable
          headers={['항목', '이전 (임시)', '이후 (실 API)']}
          rows={[
            ['제출 대상', 'Next.js Route Handler(로컬 mock) → 가짜 applyId', "백엔드 apiClient().post('admission-evaluation/apply')"],
            ['전송 데이터', '폼 전체 (대학/계열/학과 이름까지 포함, 단일 값)', '코드/식별자만 (majorIdHsbs 배열, prefer*Codes 등)'],
            ['요청 타입 의미', '전송 + 저장을 한 타입이 겸함', '전송 전용 (…ApplyRequest)'],
            ['sessionStorage', '요청 객체를 그대로 저장', '표시·복원 전용 스냅샷 별도 저장 (…ApplyFormSnapshot)'],
            ['타입 관계', '단일 평면 타입', '스냅샷이 요청을 extends (요청 ⊂ 스냅샷)'],
            ['이름(라벨) 보관', '요청에 섞여 있음', '스냅샷에만 보관 (서버는 코드, 화면은 이름)'],
          ]}
        />
        <Callout variant="key">
          <strong>핵심 한 줄:</strong> "서버로 보낼 것(코드)"과 "화면이 기억할 것(코드 + 이름)"을 <strong>다른 타입으로 분리</strong>하고,
          sessionStorage는 후자만 담당하도록 역할을 좁혔다.
        </Callout>
      </div>

      {/* Phase 10 정리 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-lime-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Phase 10 정리</h4>
        </div>
        <DataTable
          headers={['새로 배운/적용한 핵심 개념', '설명']}
          rows={[
            [<strong key="a">임시 제출 경로의 교체</strong>, 'mock Route Handler + ky 직접 호출 → 공통 apiClient로 실 엔드포인트 POST'],
            [<strong key="b">전송용/표시용 타입 분리</strong>, '요청은 코드만(…ApplyRequest), 화면 표시·복원은 이름 포함 스냅샷(…ApplyFormSnapshot)'],
            [<><strong key="c">extends로 타입 정렬</strong></>, '스냅샷이 요청을 상속 → 공통 필드 중복 제거, 단일 출처 유지, 드리프트 방지'],
            [<><strong key="d">{'{ ...requestData }'} 재사용</strong></>, '요청을 한 번 만들고 스냅샷에 펼쳐 넣어, 타입 관계를 코드에서도 그대로 표현'],
            [<strong key="e">타입이 누락 UI를 드러냄</strong>, '요청에 추가된 simpleQuestion이 입력 Textarea의 부재를 타입 에러로 노출'],
          ]}
        />
        <Callout variant="key">
          <strong>적용 판단 한 줄:</strong> 같은 객체가 "서버 전송"과 "화면 보관" 두 역할을 동시에 하고 있다면,
          타입을 분리하고 한쪽이 다른 쪽을 <IC>extends</IC>하게 만들어라.
        </Callout>
      </div>
    </section>
  )
}
