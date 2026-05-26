import { PhaseHeader, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase11() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={11} />

      <Callout variant="info">
        <strong>기록일:</strong> 2026-05-22 ·{' '}
        <strong>관련 파일:</strong>{' '}
        <IC>EarlyAdmissionEvaluationApply.tsx</IC>,{' '}
        <IC>entities/admission-evaluation/api/index.ts</IC>
      </Callout>

      {/* 증상 */}
      <div id="phase11-symptom" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🩺
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">증상</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          학종 신청 화면에서 <strong>선택 입력 필드를 비워둔 채</strong> [입력완료]를 누르면 신청이 실패하고
          <IC>{'alert("신청에 실패했습니다. 다시 시도해주세요.")'}</IC>가 뜬다.
        </p>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">콘솔에 찍힌 실제 서버 에러:</p>
        <CodeBlock
          lang="text"
          code={`학종 신청 실패: VALIDATION_PIPE_ERROR: subjectNot should not be empty
    at async submitAdmissionEvaluationApply (index.ts:102:16)
Uncaught (in promise) VALIDATION_PIPE_ERROR: subjectNot should not be empty`}
        />
      </div>

      {/* 원인 */}
      <div id="phase11-cause" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🔍
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">원인</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          <IC>... should not be empty</IC>는 <strong>NestJS class-validator의 <IC>@IsNotEmpty()</IC> 기본 메시지</strong>다.
          즉, 서버의 신청 요청 DTO에서 <IC>subjectNot</IC> 필드에 <IC>@IsNotEmpty()</IC>(빈 값 금지)가 걸려 있어,
          프론트가 보낸 <IC>{"subjectNot: ''"}</IC>(빈 문자열)을 검증 단계에서 거부한 것이다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-3">
          <li>기획상 <IC>subjectNot</IC>(비교과 추가 입력)은 <strong>선택</strong> 필드인데, 서버는 <strong>필수</strong>로 검증하고 있어 발생한 프론트–서버 계약 불일치.</li>
          <li>프론트 payload 자체는 정상이다.</li>
        </ul>
        <CodeBlock
          lang="json"
          code={`{
  "userId": "mynesin24",
  "subjectNot": "",
  "majorIdHsbs": ["16383761"],
  "preferAiPartsCodes": ["Z04F"],
  "preferProvsCodes": ["2"],
  "emphasis1": "",
  "emphasis2": "",
  "emphasis3": "",
  "simpleQuestion": ""
}`}
        />
        <p className="text-[14px] font-semibold text-gray-800 mt-3 mb-1">요청 경로</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>API 함수: <IC>submitAdmissionEvaluationApply</IC> (<IC>api/index.ts</IC>)</li>
          <li>호출: <IC>{"apiClientFor(API_URL).post('admission-evaluation/apply', ...)"}</IC></li>
          <li><IC>API_URL</IC> (local env 기준): <IC>http://www-dev.jinhak.com/jh/api/early</IC></li>
          <li>최종: <IC>POST .../admission-evaluation/apply</IC></li>
        </ul>
        <Callout variant="warn">
          <IC>app/api/admission-evaluation/apply/route.ts</IC>의 로컬 Mock 라우트는 <strong>현재 사용되지 않는다.</strong>
          API 함수가 이미 실제 백엔드(<IC>apiClient</IC>)로 직접 호출하기 때문. 따라서 오류는 <strong>dev 서버에 배포된 코드</strong>에서 발생한다.
        </Callout>
      </div>

      {/* 해결 위치 — 서버 */}
      <div id="phase11-fix" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🖥️
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">해결 위치 — 서버 (프론트 변경 없음)</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          프론트는 이미 빈 값을 정상적으로 전송 중이라 손댈 부분이 없다.
          (빈 값을 억지로 통과시키려 더미 문자열을 넣는 것은 임시/플레이스홀더 코드 금지 원칙 위반 + 데이터 오염이라 금지.)
        </p>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          <strong>서버 신청 요청 DTO에서 아래 선택 필드들의 검증을 <IC>@IsNotEmpty()</IC> → <IC>@IsOptional()</IC>로 변경해야 한다.</strong>
        </p>
        <DataTable
          headers={['필드', 'UI 표기', '구분']}
          rows={[
            [<IC key="a">subjectNot</IC>, '비교과 추가 입력', '선택'],
            [<IC key="b">emphasis1</IC>, '강조하고 싶은 내용 1', '선택'],
            [<IC key="c">emphasis2</IC>, '강조하고 싶은 내용 2', '선택'],
            [<IC key="d">emphasis3</IC>, '강조하고 싶은 내용 3', '선택'],
            [<IC key="e">simpleQuestion</IC>, '간단 질문하기', '선택'],
          ]}
        />
        <CodeBlock
          lang="typescript"
          code={`// 변경 전
@IsNotEmpty()
subjectNot: string;

// 변경 후 (선택 필드)
@IsOptional()
subjectNot?: string;`}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          <strong>필수로 유지할 필드 (변경 금지):</strong>{' '}
          <IC>userId</IC>, <IC>majorIdHsbs</IC>, <IC>preferAiPartsCodes</IC>, <IC>preferProvsCodes</IC>
        </p>
        <Callout variant="warn">
          class-validator는 첫 에러에서 막히므로, <IC>subjectNot</IC>만 풀면 다음 빈 필드(<IC>emphasis1</IC> …)에서 동일하게 막힐 수 있다.
          <strong> 선택 필드 5개를 한 번에</strong> 처리할 것.
        </Callout>
        <Callout variant="info">
          참고: 로컬 서버 체크아웃(<IC>D:\hijinhak-server</IC>)에는 이 <IC>admission-evaluation/apply</IC> 엔드포인트가 존재하지 않았다.
          검증 로직은 dev 서버에 배포된(아직 미반영/별도 브랜치) 코드에만 있는 것으로 추정된다.
        </Callout>
      </div>

      {/* (선택) 프론트 후속 개선 거리 */}
      <div id="phase11-followup" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ➕
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">(선택) 프론트 후속 개선 거리</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          지금 mutation <IC>onError</IC>는 서버 메시지를 버리고 고정 문구만 띄운다 (<IC>admission-evaluation.queries.ts</IC>):
        </p>
        <CodeBlock
          lang="typescript"
          code={`onError: (error) => {
  console.error('학종 신청 실패:', error);
  alert('신청에 실패했습니다. 다시 시도해주세요.');
},`}
        />
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mt-2">
          <li>
            <IC>ky</IC>의 <IC>beforeError</IC> 훅이 서버 응답 <IC>message</IC>를 <IC>error.message</IC>에 넣어주므로
            (<IC>APIError.enrichKyError</IC>), 필요 시 서버 메시지를 사용자/콘솔에 노출하도록 개선 가능하다.
          </li>
          <li>
            <IC>handleSubmit</IC>에서 <IC>await submitApply(...)</IC>를 try/catch 없이 호출해 실패 시 <strong>Uncaught (in promise)</strong>가 발생한다.
            에러를 잡아 이후 <IC>router.push</IC>가 실행되지 않도록 정리하는 것도 후속 개선 거리다. (Phase 4 Step 17의 try/catch 패턴 참고)
          </li>
        </ul>
      </div>
    </section>
  )
}
