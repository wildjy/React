import { PhaseHeader, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase15() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={15} />

      <Callout variant="warn">
        이 Phase의 작업은 <strong>최종적으로 원복</strong>했습니다(백엔드에서 호스트·엔드포인트·정책 확정 후 재진행 예정).
        하지만 그 과정에서 배운 함정들은 그대로 가치가 있어 기록합니다.
      </Callout>

      {/* 배경 */}
      <div id="phase15-bg" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7">
          비교과 입력 현황을 메인 백엔드(<IC>API_URL</IC>)가 아닌 <strong>다른 호스트</strong>(<IC>http://www.evaluationbygpt.com/api/v1</IC>)에서
          가져와야 했습니다. "별도 호스트니 따로 부르자"는 단순해 보였지만 함정이 셋이었습니다.
        </p>
      </div>

      {/* 함정 ① */}
      <div id="phase15-trap1" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ①
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">함정 ①: apiClientFor에 절대 URL을 넣으면 깨진다 (ky prefixUrl)</h4>
        </div>
        <CodeBlock
          lang="typescript"
          code={`// ❌ 메인 클라이언트(prefixUrl=API_URL)에 절대 URL을 넘김
apiClient().get('http://www.evaluationbygpt.com/api/v1/...');`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          <IC>apiClientFor(API_URL)</IC>은 ky의 <IC>prefixUrl</IC>을 설정합니다. ky는 <IC>prefixUrl + input</IC>을 단순 결합하므로
          절대 URL을 넣으면 <IC>API_URL + "http://..."</IC>가 되어 깨집니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`// ✅ 호스트별 전용 클라이언트를 따로 만들고, 상대경로로 호출
const evaluationApiClient = () => apiClientFor(EVALUATION_API_URL);
evaluationApiClient().get('extra-curricular/origin/\${userId}/valid');`}
        />
        <Callout variant="key">
          <strong>교훈:</strong> 호스트가 다르면 <strong>클라이언트를 분리</strong>하세요(각자 자기 base에 상대경로).
          하나의 클라이언트에 절대 URL을 섞지 마세요.
        </Callout>
      </div>

      {/* 함정 ② */}
      <div id="phase15-trap2" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ②
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">함정 ②: CSP connect-src 차단 + http mixed-content</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">브라우저 콘솔에 이런 에러가 떴습니다.</p>
        <CodeBlock
          lang="text"
          code={`Connecting to 'http://www.evaluationbygpt.com/...' violates the following
Content Security Policy directive: "connect-src 'self' https://*.jinhak.com ..."`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          CSP(<IC>next.config.js</IC>의 <IC>connect-src</IC>)에 그 호스트가 없어서 브라우저가 막은 것입니다.
          게다가 호스트가 <IC>http://</IC>라서, <strong>production(https)에선 CSP를 열어줘도 mixed-content로 또 막힙니다.</strong>
        </p>
        <DataTable
          headers={['해결책', '로컬/dev(http)', 'production(https)']}
          rows={[
            ['CSP에 호스트 추가', '뚫림', '❌ mixed-content로 막힘'],
            ['Next 프록시 라우트', '✅', '✅'],
          ]}
        />
      </div>

      {/* 함정 ③ + 해결 */}
      <div id="phase15-trap3" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ③
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">함정 ③ + 해결: Next.js 프록시 라우트 (그리고 ENOTFOUND)</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          브라우저가 외부 호스트를 직접 못 부르면, <strong>서버가 대신 부르게</strong> 합니다.
          클라이언트는 same-origin(<IC>'self'</IC>)인 route handler만 호출하므로 CSP·mixed-content를 모두 피합니다.
        </p>
        <FlowDiagram>{`브라우저 → fetch {basePath}/api/.../comparative-status  ('self' → CSP 통과)
  → route.ts (서버) → http://www.evaluationbygpt.com/...  (서버라 CSP/mixed-content 무관)`}</FlowDiagram>
        <CodeBlock
          lang="typescript"
          path="app/api/.../comparative-status/route.ts"
          code={`export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const res = await fetch(\`\${EVALUATION_API_URL}/extra-curricular/origin/\${userId}/valid\`);
  const data = await res.json();
  return NextResponse.json(data ?? []);
}`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          클라이언트는 <IC>useCurrentUser</IC>가 쓰는 것과 같은 패턴으로 self 라우트를 부릅니다:
        </p>
        <CodeBlock
          lang="typescript"
          code={`await fetch(\`\${process.env.NEXT_PUBLIC_BASE_URL}/api/.../comparative-status?userId=\${userId}\`,
  { credentials: 'include' });`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          그런데 프록시를 깔아도 데이터가 비었고, 서버 콘솔에 결정적 단서가 있었습니다.
        </p>
        <CodeBlock
          lang="text"
          code={`[cause]: Error: getaddrinfo ENOTFOUND www.evaluationbygpt.com`}
        />
        <p className="text-[14px] text-gray-700 leading-7 my-2">
          <IC>ENOTFOUND</IC> = <strong>서버(개발 머신)에서 그 호스트를 DNS로 해석조차 못 함.</strong>
          즉 코드 구조 문제가 아니라 <strong>호스트가 틀렸거나 사내망 전용</strong>이라는 환경 문제였습니다.
          여기서 "백엔드 확인 후 진행"으로 결론 내고 관련 코드를 전부 원복했습니다.
        </p>
        <Callout variant="info">
          <strong>디버깅 교훈:</strong> 프록시 라우트에 <IC>try/catch</IC> + 로그를 넣자 원인이 한 줄로 드러났습니다.
          "데이터가 빈다"는 증상에서 멈추지 말고, <strong>서버 콘솔의 실제 에러</strong>(상태코드/ENOTFOUND/빈 바디)를 확인하면
          (네트워크 불가 / 데이터 없음 / 인증·경로 오류)를 즉시 구분할 수 있습니다.
        </Callout>
        <Callout variant="key">
          <strong>추측하지 말고 확인하라:</strong> 외부 호스트·엔드포인트·CSP·DNS는 프론트 코드만으로 결정되지 않습니다.
          동작하지 않으면 백엔드/인프라 스펙을 먼저 확정하세요.
        </Callout>
      </div>
    </section>
  )
}
