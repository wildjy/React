import { PhaseHeader, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

/* 흰 카드 머리말 (Step 번호 없는 개념 카드용) */
function CardHead({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {icon}
      </div>
      <h4 className="text-[15px] font-bold text-gray-900">{title}</h4>
    </div>
  )
}

export function Phase12() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={12} />

      <Callout variant="info">
        <strong>학습 메모:</strong> 신청 → 확인 → 리포트 흐름에서 "내가 입력한 값"과 "화면에 그릴 데이터"가
        같은 것이라는 착각을 바로잡는 노트. ·{' '}
        <strong>관련 파일:</strong>{' '}
        <IC>EarlyAdmissionEvaluationApply / Confirm / Report.tsx</IC>
      </Callout>

      {/* 전송 vs 조회 */}
      <div id="phase12-write-vs-read" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <CardHead icon="↔" title="가장 중요한 구분: 전송(쓰기) vs 조회(읽기)" />
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          서버와 데이터를 주고받는 동작은 방향에 따라 <strong>완전히 다른 두 가지</strong>다.
        </p>
        <DataTable
          headers={['구분', '전송 (쓰기)', '조회 (읽기)']}
          rows={[
            ['무엇', '내가 입력한 값을 서버에 보냄', '서버에 있는 값을 받아옴'],
            ['HTTP', 'POST / PUT', 'GET'],
            ['React Query', <IC key="m">useMutation</IC>, <IC key="q">useQuery</IC>],
            ['이 프로젝트', <IC key="s">submitAdmissionEvaluationApply</IC>, '리포트 조회 API (미구현)'],
            ['비유', '우체통에 편지를 넣는다', '우편함에서 답장을 꺼낸다'],
          ]}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-3">
          현재 <IC>apply</IC> API는 "넣는" 동작 하나만 한다. 리포트 페이지는 "꺼내는" 동작이 필요한데 그 API가 아직 없는 상태다.
        </p>
      </div>

      {/* 리포트 = 분석 결과 */}
      <div id="phase12-report-source" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <CardHead icon="📊" title='핵심: 리포트는 "입력값"이 아니라 "서버 분석 결과"로 그린다' />
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          직관적으로는 "내가 입력한 값으로 리포트를 그리면 되지 않나?"라고 생각하기 쉽다. <strong>아니다.</strong>
        </p>
        <FlowDiagram>{`[내가 보낸 것]            [리포트에 그려야 할 것]
대학: 가천대        →     합격 가능성 78%
학과: 컴퓨터공학    →     추천 대학 5곳
활동: "..."         →     생기부 분석 코멘트 / 전문가 총평`}</FlowDiagram>
        <p className="text-[14px] text-gray-700 leading-7 my-3">
          왼쪽(입력값)만으로는 오른쪽을 만들 수 없다. 오른쪽은 <strong>서버가 입력값을 받아 계산·분석한 뒤 새로 만들어내는 데이터</strong>다.
          그래서 리포트 페이지는 반드시 서버에서 GET으로 받아와야 한다.
        </p>
        <DataTable
          headers={['페이지', '무엇을 보여주나', '데이터 출처']}
          rows={[
            ['확인(Confirm)', '"내가 이렇게 신청한 게 맞나요?"', '내 입력값 (sessionStorage)'],
            ['리포트(Report)', '"전문가가 분석한 결과는?"', '서버가 만든 결과 (GET API)'],
          ]}
        />
      </div>

      {/* applyId 번호표 */}
      <div id="phase12-applyid" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <CardHead icon="🎟" title="applyId — 전송과 조회를 잇는 번호표" />
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          <IC>apply</IC> API가 돌려주는 <IC>applyId</IC>가 둘을 연결한다. (개념 이해용 — 이 프로젝트의 실제 결론은 맨 아래 참고)
        </p>
        <FlowDiagram>{`[전송] POST /admission-evaluation/apply
       내 입력값 보냄
        ↓
       서버: "접수 완료" → { applyId: "ADMISSION-123" }
        ↓
[조회] GET /admission-evaluation/report?applyId=ADMISSION-123   ← (이런 API가 나와야 함)
       서버: "그 신청 건의 분석 결과" → { 합격률, 추천대학, 총평... }
        ↓
       리포트 페이지가 이 데이터로 화면을 그림`}</FlowDiagram>
        <p className="text-[14px] text-gray-700 leading-7 mt-3">
          <IC>applyId</IC>는 "내가 방금 넣은 신청서"를 나중에 다시 찾기 위한 번호표다. 전송할 때 받아두고, 조회할 때 그 번호로 결과를 요청한다.
        </p>
      </div>

      {/* 예상 API 두 종류 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <CardHead icon="🔖" title="예상되는 API 두 종류 (용어 정리)" />
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          "완료 API"라는 말은 보통 아래 두 가지가 섞여 쓰인다. 역할이 다르다.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-[14px] text-gray-700 leading-7">
          <li>
            <strong>확정(완료) API</strong> — <IC>POST .../apply/confirm</IC> (쓰기)<br />
            "이대로 최종 제출할게요, 분석 시작해주세요." <IC>EarlyAdmissionEvaluationConfirm.tsx</IC> 상단 주석에 연동 예정으로 적힌 것.
          </li>
          <li>
            <strong>리포트 조회 API</strong> — <IC>GET .../report?applyId=...</IC> (읽기)<br />
            "분석 결과 데이터 주세요." 리포트 페이지가 마운트되면 <IC>useQuery</IC>로 호출해 그 결과로 화면을 그린다.
          </li>
        </ol>
      </div>

      {/* 리포트 페이지 모습 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <CardHead icon="🧩" title="리포트 페이지가 채워질 모습 (개념 예시)" />
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          현재 <IC>EarlyAdmissionEvaluationReport.tsx</IC>는 골격만 있다. 조회 API가 나오면 이렇게 채워진다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`export const EarlyAdmissionEvaluationReport = () => {
  // 1. 서버에서 분석 결과를 "읽어온다" (useQuery)
  const { data: report, isLoading } = useReportQuery(applyId);

  // 2. 로딩 / 없음 처리
  if (isLoading) return <로딩스피너 />;
  if (!report) return <p>분석 결과가 아직 없습니다</p>;

  // 3. 받아온 데이터로 화면을 그린다 (입력값이 아니라 "분석 결과")
  return (
    <div>
      <합격가능성그래프 value={report.passRate} />
      <추천대학목록 list={report.recommendedUniversities} />
      <전문가총평 text={report.expertComment} />
    </div>
  );
};`}
        />
      </div>

      {/* 전체 흐름 */}
      <div id="phase12-flow" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <CardHead icon="🗺" title="전체 흐름 한 그림" />
        <FlowDiagram>{`신청 페이지 (Apply)
  사용자 입력
     │  [쓰기] useMutation → POST /apply
     ▼
  서버가 applyId 발급 ──────────────┐
     │                              │ applyId 기억
     ▼ (sessionStorage에 스냅샷 저장) │
확인 페이지 (Confirm)               │
  내 입력값 그대로 표시               │
     │  [쓰기] useMutation → POST /apply/confirm  ("분석 시작해주세요")
     ▼                              │
리포트 페이지 (Report)  ◄───────────┘
  [읽기] useQuery → GET /report?applyId=...   ("분석 결과 주세요")
  받아온 "분석 결과"로 화면 구성  ← 입력값이 아님!`}</FlowDiagram>
      </div>

      {/* 백엔드 확인할 것 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <CardHead icon="❓" title="다음 단계로 가기 위해 백엔드에 확인할 것" />
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          리포트 조회 API 스펙이 확정돼야 리포트 페이지 작업을 시작할 수 있다. 백엔드에 물어볼 두 가지:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>리포트 데이터를 주는 <strong>조회 API 엔드포인트와 응답 JSON 구조</strong>는?</li>
          <li>그 API는 <strong>무엇으로 신청 건을 식별</strong>하나? (<IC>applyId</IC>? 아니면 로그인 <IC>userId</IC>만으로 최신 신청을 찾아주나?)</li>
        </ol>
      </div>

      {/* Phase 12 정리 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Phase 12 정리</h4>
        </div>
        <DataTable
          headers={['핵심 개념', '설명']}
          rows={[
            ['쓰기 vs 읽기', '전송(POST·useMutation)과 조회(GET·useQuery)는 방향도 훅도 다른 동작'],
            ['리포트 = 분석 결과', '리포트는 내 입력값이 아니라 서버가 입력을 분석해 만든 새 데이터로 그린다'],
            ['확인 페이지 ≠ 리포트 페이지', '확인은 내 입력값(sessionStorage), 리포트는 서버 결과(GET API)'],
            ['applyId의 역할', '전송 때 발급받아 조회 때 신청 건을 다시 찾는 "번호표"'],
            ['확정 API vs 조회 API', 'POST /confirm(분석 시작 요청, 쓰기)와 GET /report(결과 조회, 읽기)는 별개'],
          ]}
        />
        <Callout variant="key">
          <strong>적용 판단 한 줄:</strong> "이 화면에 그릴 데이터를 내가 이미 갖고 있나, 아니면 서버가 만들어 줘야 하나?"
          서버가 만들어 줘야 하면 — 입력값으로 그리지 말고 GET으로 받아와서 그려라.
        </Callout>
      </div>

      {/* 후속 결론 — applyId 제거 */}
      <div id="phase12-conclusion" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
        <CardHead icon="🧹" title="후속 결론 — 이 프로젝트는 applyId가 아니라 토큰의 userId로 식별한다" />
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          위에서 "전송과 조회를 잇는 번호표"로 <IC>applyId</IC>를 들었다. 이는 <strong>일반적으로 흔한 패턴</strong>이라 개념 이해용으로 유효하다.
          다만 <strong>이 프로젝트의 백엔드는 다른 방식을 택했다.</strong>
        </p>

        <h5 className="text-[14px] font-bold text-gray-900 mt-4 mb-2">확인된 사실</h5>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          백엔드 문의 결과, 학종 조회·확정 API는 <strong>요청 파라미터가 아니라 로그인 토큰(쿠키)에서 <IC>userId</IC>를 꺼내 신청 건을 식별</strong>한다.
          (<IC>grade-status</IC> 조회에서 관찰된 패턴과 동일)
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><IC>apiClient()</IC>가 <IC>credentials: 'include'</IC>로 쿠키 자동 전송 → 서버가 토큰에서 <IC>userId</IC>를 읽음</li>
          <li>Swagger에 <IC>userId</IC>가 <IC>required</IC>로 보여도 실제로는 토큰에서 식별 (문서 표기와 구현의 흔한 불일치)</li>
          <li>따라서 프론트가 <IC>userId</IC>/<IC>applyId</IC>를 명시적으로 안 보내도 조회가 동작</li>
        </ul>

        <h5 className="text-[14px] font-bold text-gray-900 mt-4 mb-2">그래서 applyId를 제거했다</h5>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          서버가 토큰으로 식별하므로, 서버가 발급하던 <IC>applyId</IC>는 프론트에서 <strong>식별 용도로 쓸 일이 없어졌다.</strong>
        </p>
        <DataTable
          headers={['파일', '변경']}
          rows={[
            [<IC key="a">admission-evaluation.types.ts</IC>, <><IC key="a2">AdmissionEvaluationApplyResponse</IC> 삭제, 스냅샷에서 <IC key="a3">applyId</IC> 필드 제거</>],
            [<IC key="b">api/index.ts</IC>, <><IC key="b2">submitAdmissionEvaluationApply</IC> 반환 타입을 <IC key="b3">Promise&lt;void&gt;</IC>로</>],
            [<IC key="c">admission-evaluation.queries.ts</IC>, <>mutation 제네릭을 <IC key="c2">useMutation&lt;void, Error, …Request&gt;</IC>로</>],
            [<IC key="d">EarlyAdmissionEvaluationApply.tsx</IC>, <><IC key="d2">response</IC> 캡처·디버그 로그·<IC key="d3">snapshot.applyId</IC> 제거</>],
            [<IC key="e">EarlyAdmissionEvaluationConfirm.tsx</IC>, <>표시를 <IC key="e2">userId</IC> 기준으로, 라벨을 "신청자 ID"로 정정</>],
            [<IC key="f">app/api/.../apply/route.ts</IC>, <strong key="f2">삭제</strong>],
          ]}
        />
        <Callout variant="info">
          <strong>신청 성공 판정은?</strong> <IC>applyId</IC>를 안 받아도 된다. <IC>ky</IC>는 비-2xx 응답에서 throw하므로,
          <IC>await submitApply(requestData)</IC>가 예외 없이 끝나면 성공이다. 그래서 반환 타입을 <IC>void</IC>로 좁혔다.
        </Callout>

        <h5 className="text-[14px] font-bold text-gray-900 mt-4 mb-2">userId ≠ applyId — 이름을 합치면 안 되는 이유</h5>
        <DataTable
          headers={['', 'userId', 'applyId']}
          rows={[
            ['식별 대상', '사람(로그인 사용자)', '신청서 한 건'],
            ['출처', '로그인 정보 (보내는 값)', '서버 응답 (받는 값)'],
            ['예시', "'mynesin24'", "'ADMISSION-EVALUATION-1716…'"],
          ]}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-2">
          특히 스냅샷이 <IC>{'{ ...requestData, applyId: response.applyId }'}</IC> 형태였는데, <IC>applyId</IC>를 <IC>userId</IC>로 개명하면
          스프레드로 들어온 <IC>userId</IC>를 신청번호로 <strong>덮어쓰는 버그</strong>가 난다 (같은 key는 뒤 값이 이김).
          이름이 다른 건 혼동이 아니라 "정확히 구분 중"이라는 신호다.
        </p>
        <Callout variant="key">
          <strong>정리 한 줄:</strong> 결과 조회를 <strong>무엇으로 식별하는가</strong>는 백엔드 설계에 달려 있다 —
          <IC>applyId</IC>일 수도, 토큰의 <IC>userId</IC>일 수도 있다. 이 프로젝트는 후자라 <IC>applyId</IC>를 제거했다.
          식별 방식은 추측하지 말고 <strong>백엔드 스펙으로 확인</strong>하라.
        </Callout>
      </div>
    </section>
  )
}
