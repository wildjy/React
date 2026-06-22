import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'

export function Phase38() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={38} />

      <StepCard phase={38} num={146} id="step146" title="alert 과 confirm 은 다르다 — 반환값을 써야 흐름이 갈린다">
        <p>
          "6개만 평가받으시겠습니까?"는 <strong>예/아니오 질문</strong>이므로 <IC>confirm</IC>을 쓴다.
          그리고 <strong>반환값(OK=true)</strong>으로 흐름을 제어해야 한다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`if (handler.selectedCards.length < 6) {
  const proceed = confirm(\`희망대학을 \${n}개 선택하셨습니다. … 평가 받으시겠습니까?\`);
  if (!proceed) return; // 취소면 제출 중단
}`}
        />
        <p>
          처음엔 <IC>{"confirm(...)"}</IC>만 호출하고 반환값을 무시한 채 항상 <IC>return</IC>해서
          <strong> 확인을 눌러도 진행이 안 되는</strong> 버그가 있었다.
        </p>
      </StepCard>

      <StepCard phase={38} num={147} id="step147" title="서버 검증 메시지를 사용자에게 그대로 보여주기">
        <p>mutation <IC>onError</IC>에서 제네릭 문구 대신 <strong>서버가 준 검증 메시지</strong>를 노출:</p>
        <CodeBlock
          lang="typescript"
          code={`onError: (error) => {
  if (error.message.includes('이미 신청이 완료')) return;
  console.error('학종 신청 실패:', error);
  alert(APIError.message(error)); // 서버 메시지 그대로 (+ timeout/네트워크는 친화 문구로 변환)
};`}
        />
        <p className="font-semibold text-gray-800 mt-2">동작 원리:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>
            ky의 <IC>beforeError</IC> 훅 → <IC>APIError.enrichKyError</IC>가
            <strong> 서버 응답 body의 <IC>message</IC>를 <IC>error.message</IC>에 주입</strong>한다
            (<IC>libs/shared/exception/exception.ts</IC>). 그래서 <IC>error.message</IC>에 백엔드 한글 검증 문구가 담긴다.
          </li>
          <li>
            <IC>APIError.message(error)</IC>는 timeout/네트워크 예외는 사용자 친화 문구로 바꾸고, 그 외엔 그 서버 메시지를 반환.
          </li>
        </ul>
        <Callout variant="info">
          덕분에 "신청에 실패했습니다" 같은 모호한 문구 대신 "○○를 입력해주세요" 같은 <strong>정확한 안내</strong>가 뜬다.
        </Callout>
      </StepCard>

      <StepCard phase={38} num={148} id="step148" title="mutateAsync 의 try/catch 는 없애면 안 된다">
        <CodeBlock
          lang="typescript"
          code={`try {
  await submitApply(requestData);
  router.push('/.../confirm');
} catch (error) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('이미 신청이 완료')) {
    router.push('/.../confirm'); // 이미 완료 → 확인 페이지로 자연스럽게
    return;
  }
}`}
        />
        <p>
          <IC>mutateAsync</IC>는 실패 시 <strong>promise가 reject</strong>된다(= <IC>await</IC> 지점에서 throw).
          <IC>onError</IC>가 돌더라도 이 reject는 별개라서, <IC>try/catch</IC>가 없으면 <strong>unhandled promise rejection</strong>이 된다.
          게다가 "이미 신청 완료 → <IC>/confirm</IC> 이동"은 <IC>router</IC>가 필요해 <strong>컴포넌트 쪽 catch에서만</strong> 처리 가능
          (queries.ts의 <IC>onError</IC>엔 router가 없음).
        </p>
        <Callout variant="key">
          <strong>역할 분담:</strong> 일반 에러 alert = mutation <IC>onError</IC> /
          "이미 완료 → 페이지 이동" + reject 흡수 = <IC>handleSubmit</IC> <IC>try/catch</IC>. 둘 다 필요.
        </Callout>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong><IC>confirm</IC>은 반환값으로 분기하라.</strong>{' '}
          호출만 하고 무시하면 "물어보긴 하는데 결과가 안 먹는" UI가 된다.
        </Callout>
        <Callout variant="key">
          <strong>서버가 주는 검증 메시지를 버리지 마라.</strong>{' '}
          ky <IC>beforeError</IC>로 <IC>error.message</IC>에 실어두면
          <IC>alert(APIError.message(error))</IC> 한 줄로 정확한 안내를 띄울 수 있다.
        </Callout>
        <Callout variant="key">
          <strong><IC>mutateAsync</IC>는 reject한다 → <IC>try/catch</IC> 필수.</strong>{' '}
          <IC>onError</IC>가 있어도 unhandled rejection은 따로 막아야 하고,
          navigation처럼 컴포넌트 컨텍스트가 필요한 후처리는 catch에서 한다.
        </Callout>
      </div>
    </section>
  )
}
