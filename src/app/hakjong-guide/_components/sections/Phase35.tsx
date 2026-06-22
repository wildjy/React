import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase35() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={35} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          입시전문가 평가 신청에서 "성적이 다 입력됐는지" 검증할 때, <strong>재학생과 N수생의 필수 입력 범위가 다르다</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7 mb-2">
          <li><strong>재학생(고3)</strong> — 아직 3학년이 안 끝났으니 <strong>2학년까지만</strong> 필수</li>
          <li><strong>N수생</strong> — 졸업했으니 <strong>3학년까지</strong> 필수</li>
        </ul>
        <p>이걸 코드가 알려면 "이 사람이 재학생인지 N수생인지"를 먼저 알아야 한다.</p>
      </div>

      <StepCard phase={35} num={134} id="step134" title="학생 구분 코드 이해 — graduationType">
        <p>
          로그인 토큰(JWT) payload에 <IC>graduationType</IC>이 들어 있고, 의미는 공통코드로 정의돼 있다.
          <IC>libs/shared/config/common-code/common-code-definitions.ts</IC>의 <IC>GRADUATION_TYPE_CODES</IC>:
        </p>
        <DataTable
          headers={['코드', '의미']}
          rows={[
            [<IC key="a">{"'0'"}</IC>, '출신고교 미입력'],
            [<IC key="b">{"'1'"}</IC>, '고1'],
            [<IC key="c">{"'2'"}</IC>, '고2'],
            [<IC key="d">{"'3'"}</IC>, <strong key="d2">고3 (재학생)</strong>],
            [<IC key="e">{"'4'"}</IC>, <strong key="e2">n수</strong>],
            [<IC key="f">{"'5'"}</IC>, '검정고시'],
          ]}
        />
        <p>
          이 서비스는 <strong>고3·N수 전용</strong> (고1·고2는 middleware에서 에러 페이지로 차단).
          그래서 실제로 만나는 값은 <IC>{"'3'"}</IC>(재학생), <IC>{"'4'"}</IC>/<IC>{"'5'"}</IC>(N수 계열) 정도다.
        </p>
      </StepCard>

      <StepCard phase={35} num={135} id="step135" title="단 한 줄로 분기 기준 만들기">
        <CodeBlock
          lang="typescript"
          code={`const isEnrolledStudent = currentUser.payload?.graduationType === '3'; // 고3 재학생`}
        />
        <Callout variant="info">
          <strong>왜 문자열 비교인가?</strong> JWT payload의 값이 문자열(<IC>{"'3'"}</IC>)이라서.
          같은 엔티티의 다른 코드(<IC>useAdmissionEvaluationHandler.ts</IC>)도 <IC>{"=== '5'"}</IC>처럼 직접 문자열 비교를 쓴다 → <strong>컨벤션을 따른다</strong>.
          (코드값이 많아지면 <IC>{"code('GRADUATION_TYPE_CODES', 'THIRD_YEAR')"}</IC> 헬퍼로 바꾸는 게 낫지만, 여기선 한두 곳이라 직접 비교가 단순.)
        </Callout>
      </StepCard>

      <StepCard phase={35} num={136} id="step136" title="이 한 변수로 교과·비교과 범위를 동시에 분기">
        <CodeBlock
          lang="typescript"
          code={`// 학생부 교과(학기)
const requiredSemesters = isEnrolledStudent
  ? ['1-1', '1-2', '2-1', '2-2'] // 재학생: 4학기
  : ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2']; // N수: 6학기

// 학생부 비교과(학년)
const requiredGrades = isEnrolledStudent
  ? ([1, 2] as const) // 재학생: 1~2학년
  : ([1, 2, 3] as const); // N수: 1~3학년`}
        />
        <Callout variant="key">
          <strong>하나의 진실(<IC>isEnrolledStudent</IC>)을 여러 검증이 공유</strong>한다.
          같은 분기 조건을 검증마다 반복하지 말고, 위에서 한 번 계산해 내려쓴다.
        </Callout>
      </StepCard>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>"사용자 유형에 따라 규칙이 다르다"는 요구는, 먼저 유형 판별 값을 한 줄로 만들고, 그 값으로 데이터(목록·범위)를 분기하라.</strong>{' '}
          분기를 <IC>if</IC> 떡칠로 흩뿌리지 말고 "필수 목록"이라는 <strong>데이터</strong>로 표현하면 검증 로직이 짧아진다.
        </Callout>
      </div>
    </section>
  )
}
