import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase28() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={28} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          Phase 23에서 <IC>isApplyCompleted</IC>를 sessionStorage 플래그에서 서버 진실로 옮기는 방향을 다뤘다.
          정석은 <IC>GET /admission-evaluation/apply/status</IC> 같은 상태 전용 API. 하지만:
        </p>
        <Callout variant="info">
          백엔드: "그건 따로 안 줘. POST /apply가 이미 거부 응답을 주잖아 — 그걸로 알 수 있어."
        </Callout>
        <p>서버는 CONFIRMED 상태에서 POST 시도하면:</p>
        <CodeBlock
          lang="json"
          code={`HTTP 400
{
  "alias": "UNKNOWN",
  "message": "이미 신청이 완료되었습니다.",
  "code": 400
}`}
        />
        <p>이 응답을 <strong>사실상의 status API 대체</strong>로 쓸 수 있다.</p>
      </div>

      <StepCard phase={28} num={94} id="step94" title="트레이드오프 — 사전 차단 vs 사후 처리">
        <DataTable
          headers={['', 'dedicated status API', 'POST 에러 응답']}
          rows={[
            ['진입 차단 (Navigation guard)', '✅ 페이지 마운트 전', '❌ 호출 전엔 모름'],
            ['버튼 disabled 사전 표시', '✅', '❌'],
            [<strong key="a">제출 시 거부 + 안내</strong>, '✅', '✅ — 서버가 항상 최후 방어선'],
            [<strong key="b">진실의 원천이 서버</strong>, '✅', '✅'],
            ['백엔드 추가 작업', '필요', '불필요 (이미 있음)'],
          ]}
        />
        <p>
          실용 효과는 거의 같다 — 사용자가 confirm 페이지에서 [신청완료] 누르는 순간 서버가 알려주니까.
          <strong> 사전 차단이 절대 필요한 UX가 아니라면 충분</strong>.
        </p>
      </StepCard>

      <StepCard phase={28} num={95} id="step95" title="에러 식별 헬퍼">
        <p>ky의 <IC>HTTPError</IC>를 잡아 메시지로 분기:</p>
        <CodeBlock
          lang="typescript"
          code={`import { HTTPError } from 'ky';

const ALREADY_COMPLETED_MESSAGE = '이미 신청이 완료되었습니다.';

export async function isAlreadyCompletedError(error: unknown): Promise<boolean> {
  if (!(error instanceof HTTPError)) return false;
  if (error.response.status !== 400) return false;
  try {
    const body = await error.response.clone().json<{ message?: string }>();
    return body.message === ALREADY_COMPLETED_MESSAGE;
  } catch {
    return false;
  }
}`}
        />
        <Callout variant="tip">
          <IC>response.clone()</IC>을 쓰는 이유: ky의 onError에서 body를 이미 한 번 읽었을 수 있어서 clone으로 안전하게 재읽기.
        </Callout>
      </StepCard>

      <StepCard phase={28} num={96} id="step96" title="처리 위치 — 호출자 vs mutation 훅">
        <p className="font-semibold text-gray-800 mt-2">A. 호출자(handler)에서 try/catch</p>
        <CodeBlock
          lang="typescript"
          code={`const handleSubmit = async () => {
  try {
    await submitApply(requestData);
    router.push('/.../confirm');
  } catch (error) {
    if (await isAlreadyCompletedError(error)) {
      alert('이미 신청이 완료된 상태입니다.');
      router.push('/.../report');
      return;
    }
    throw error;
  }
};`}
        />
        <p className="font-semibold text-gray-800 mt-2">B. mutation 훅의 onError에서 처리 (페이지마다 중복 안 됨)</p>
        <CodeBlock
          lang="typescript"
          code={`export function useAdmissionEvaluationApplyMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: submitAdmissionEvaluationApply,
    onError: async (error) => {
      if (await isAlreadyCompletedError(error)) {
        alert('이미 신청이 완료되었습니다.');
        router.push('/.../report');
        return;
      }
      console.error('학종 신청 실패:', error);
      alert('신청에 실패했습니다.');
    },
  });
}`}
        />
        <Callout variant="key">
          <strong>B가 더 깨끗</strong> — 모든 호출 site에서 동일 처리. 단, 페이지별 UX 분기가 필요하면 A.
        </Callout>
      </StepCard>

      <StepCard phase={28} num={97} id="step97" title="메시지 매칭의 취약성">
        <CodeBlock
          lang="typescript"
          code={`return body.message === '이미 신청이 완료되었습니다.';`}
        />
        <p>한국어 문자열이 코드의 식별자. <strong>백엔드가 메시지를 바꾸면 프론트가 즉시 깨진다.</strong> 임시 OK지만 장기로는 안 좋다.</p>
        <p className="font-semibold text-gray-800 mt-2">더 안전한 매칭:</p>
        <CodeBlock
          lang="typescript"
          code={`// 백엔드에 에러 코드 표준화 요청
{ "code": "APPLY_ALREADY_COMPLETED", "message": "..." }`}
        />
        <p>프론트는 코드(언어 무관 식별자)로 분기. 다국어 지원 시에도 안전.</p>
        <p className="font-semibold text-gray-800 mt-2">TODO 마커로 추적:</p>
        <CodeBlock
          lang="typescript"
          code={`// TODO(backend): 에러 응답에 "code" 또는 "alias" 필드 표준화 요청
// 현재는 message 문자열 매칭 (취약) — code 기반으로 전환 예정`}
        />
      </StepCard>

      <StepCard phase={28} num={98} id="step98" title="부가 — POST body 의 표준 형식">
        <p>이 작업 중 같이 잡힌 함정: POST body에 <strong>원시값을 그대로 넣지 마라</strong>.</p>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 서버가 JSON 객체 body 기대 → 파싱 깨짐
await apiClient().post('/submit', { json: userId });
// 실제 body: "mynesin24" (JSON 문자열 리터럴)

// ✅ 객체로 감싸기
await apiClient().post('/submit', { json: { userId } });
// 실제 body: {"userId":"mynesin24"}`}
        />
        <p className="font-semibold text-gray-800 mt-2">실제 발생 에러:</p>
        <CodeBlock
          lang="text"
          code={`UNKNOWN: Unexpected token '"', ""mynesin24"" is not valid JSON`}
        />
        <p>
          REST API의 POST body는 거의 항상 JSON 객체. 원시값 하나만 보내고 싶어도 객체로 감싸는 게 표준 — DTO 매핑/validation/추후 필드 추가가 모두 객체 전제.
        </p>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>dedicated status API가 없어도 서버는 항상 진실을 안다.</strong> POST 시도에 대한 거부 응답으로 충분히 derive 가능.
          사전 차단이 절대 필요한 UX가 아니면 추가 API 만드는 것보다 에러 응답 활용이 가성비 좋다.
        </Callout>
        <Callout variant="key">
          <strong>에러 매칭은 메시지 문자열보다 코드/alias로.</strong> 한국어 문구가 식별자가 되면 다국어/리팩토링에 취약.
          백엔드와 에러 코드 표준 합의가 장기적으로 안전.
        </Callout>
        <Callout variant="key">
          <strong>POST body는 객체로 감싸라.</strong> 원시값을 <IC>{'{ json: value }'}</IC>로 그대로 넣으면 서버가 JSON 객체 기대와 어긋난다.
          <IC>{'{ json: { fieldName: value } }'}</IC>가 표준.
        </Callout>
      </div>
    </section>
  )
}
