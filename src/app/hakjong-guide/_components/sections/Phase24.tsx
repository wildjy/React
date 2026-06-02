import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase24() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={24} />

      {/* 배경 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경: "기존 handler에 추가해도 되나?"</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          리포트 페이지의 "전문가에게 질문하기"용 mutation 훅(<IC>useAdmissionQnaMutation</IC>)이 만들어졌다. 질문이 들어왔다:
        </p>
        <Callout variant="warn">
          "이 mutation을 <IC>useAdmissionEvaluationHandler</IC>에 합쳐도 되나?"
        </Callout>
        <p>답은 <strong>❌ 합치면 안 된다</strong>. 이유와 판단 기준을 정리.</p>
      </div>

      <StepCard phase={24} num={75} id="step75" title="책임 경계의 정의">
        <p>먼저 각 훅이 무엇을 책임지는지 정확히 본다.</p>
        <p className="font-semibold text-gray-800 mt-2"><IC>useAdmissionEvaluationHandler</IC>:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>신청 페이지(Apply)</strong> 폼의 선택 상태</li>
          <li>드롭다운 (selectedOption, selectedTypeOption)</li>
          <li>카드 추가/삭제 (selectedCards, handleAddCard, handleDeleteCard)</li>
          <li>자격 검증 알림 + 모달 상태 (alertMessage, isConfirmOpen)</li>
        </ul>
        <p className="font-semibold text-gray-800 mt-2"><IC>useAdmissionQnaMutation</IC>:</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>리포트 페이지(Report)</strong>의 전문가 질문 제출</li>
          <li>POST /admission-evaluation/qna</li>
        </ul>
        <Callout variant="key">
          <strong>두 책임이 향하는 페이지가 다르다.</strong> 도메인은 같지만(admission-evaluation) 사용처가 다르고, 같이 마운트되지 않는다.
        </Callout>
      </StepCard>

      <StepCard phase={24} num={76} id="step76" title="합치면 일어나는 일 — Phase 17의 재발">
        <p>
          <IC>useAdmissionEvaluationHandler</IC>는 이미 <IC>useAdmissionEvaluationApplyForm</IC>(Apply 페이지 전용)에 합성돼 있다.
          거기에 QnA mutation까지 들어가면:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li><strong>Apply 페이지가 안 쓰는 QnA mutation 셋업을 매번 들고 다님</strong> — useMutation의 mutationFn/onError 클로저를 매 렌더 생성.</li>
          <li><strong>이름의 모호화</strong> — "Evaluation Handler"가 신청 폼 + 리포트 mutation 둘 다 가리키게 되어 무엇을 책임지는지 모호.</li>
          <li><strong>Report 페이지가 Apply 폼 훅을 통째로 부르게 됨</strong> — Phase 17의 "통째 호출 함정"이 그대로 재발(드롭다운 쿼리, 카드 핸들러까지 다 발사).</li>
        </ol>
      </StepCard>

      <StepCard phase={24} num={77} id="step77" title="의사결정 — 어디에 둘 것인가">
        <DataTable
          headers={['옵션', '적용 시점']}
          rows={[
            [<><strong key="a">A. 페이지에서 직접 사용</strong></>, '간단하고 한 곳에서만 쓸 때. 가장 가벼움.'],
            [<><strong key="b">B. 페이지 전용 훅으로 분리</strong></>, '로직(검증/제출/후속처리/관련 state)이 페이지 안에서 복잡해질 때.'],
            [<><strong key="c">C. 기존 다른 훅에 합침</strong></>, <><strong>책임이 같을 때만.</strong> "같은 페이지 + 같은 종류의 상태/동작" → 거의 X.</>],
          ]}
        />
        <p>QnA 사례에선 <strong>A 또는 B</strong>가 정답. 페이지가 단순하면 A, 복잡해지면 B로 진화.</p>
      </StepCard>

      <StepCard phase={24} num={78} id="step78" title="mutation UX 4가지 체크리스트">
        <p>QnA 제출 사례에서 보였던 빠진 디테일들을 패턴화한다.</p>
        <CodeBlock
          lang="tsx"
          code={`// ❌ 부족한 mutation 호출
const { mutate: submitQuestion } = useAdmissionQnaMutation();

<Button onClick={() => submitQuestion({
  userId: currentUser.userId ?? '',
  question: question,
})}>
  질문 제출
</Button>`}
        />
        <p className="font-semibold text-gray-800 mt-2">빠진 4가지:</p>

        <p className="font-semibold text-gray-800 mt-3">① 빈값 가드</p>
        <p>서버에 빈 입력을 보내면 검증 실패하거나(서버 부하), 더 나쁘게는 빈 질문이 저장된다.</p>
        <CodeBlock
          lang="typescript"
          code={`if (!question.trim()) {
  alert('질문을 입력해주세요.');
  return;
}`}
        />

        <p className="font-semibold text-gray-800 mt-3">② 인증 가드</p>
        <p><IC>{"userId ?? ''"}</IC>로 빈 문자열을 그대로 보내는 건 위험. 비로그인 사용자가 페이지에 도달했을 때 가드.</p>
        <CodeBlock
          lang="typescript"
          code={`if (!currentUser.userId) return;`}
        />

        <p className="font-semibold text-gray-800 mt-3">③ isPending로 중복 제출 차단</p>
        <p>mutation은 비동기. 사용자가 버튼을 빨리 두 번 누르면 두 번 제출된다.</p>
        <CodeBlock
          lang="tsx"
          code={`const { mutate, isPending } = useAdmissionQnaMutation();

<Button disabled={isPending} onClick={...}>
  {isPending ? '질문 제출 중...' : '질문 제출'}
</Button>`}
        />

        <p className="font-semibold text-gray-800 mt-3">④ onSuccess로 후속 처리</p>
        <p>제출 성공 시 form reset + 알림 + 관련 쿼리 invalidate 등. mutate의 두 번째 인자로 callback 전달.</p>
        <CodeBlock
          lang="typescript"
          code={`submitQuestion(
  { userId: currentUser.userId, question },
  {
    onSuccess: () => {
      setQuestion('');               // textarea 비우기
      alert('질문이 제출되었습니다.');
    },
  },
);`}
        />
        <Callout variant="info">
          <strong>훅 정의의 onSuccess/onError vs 호출 시점의 onSuccess/onError</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>훅 정의(<IC>{'useMutation({ onError: ... })'}</IC>): 모든 호출에 공통. 에러 로깅, 공통 알림 등 "모든 호출에서 같은 일" 용도.</li>
            <li>호출 시점(<IC>{'mutate(vars, { onSuccess: ... })'}</IC>): 그 호출만의 후속처리. form reset, 페이지 이동 등.</li>
          </ul>
          <p className="mt-2">
            두 곳 다 둘 수 있고, 호출 시점이 훅 정의보다 나중에 실행되는 게 아니라 <strong>둘 다 실행</strong>된다. 역할을 분담시켜라.
          </p>
        </Callout>
      </StepCard>

      {/* 종합 — 기본 4종 세트 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            🧰
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">종합 — mutation의 "기본 4종 세트"</h4>
        </div>
        <CodeBlock
          lang="tsx"
          code={`// 완성형 패턴
const [question, setQuestion] = useState('');
const { mutate: submitQuestion, isPending } = useAdmissionQnaMutation();

const handleSubmit = () => {
  if (!currentUser.userId) return;        // ② 인증 가드
  if (!question.trim()) {                  // ① 빈값 가드
    alert('질문을 입력해주세요.');
    return;
  }
  submitQuestion(
    { userId: currentUser.userId, question },
    {
      onSuccess: () => {                   // ④ 후속 처리
        setQuestion('');
        alert('질문이 제출되었습니다.');
      },
    },
  );
};

<Button disabled={isPending} onClick={handleSubmit}>
  {/* ③ isPending */}
  {isPending ? '질문 제출 중...' : '질문 제출'}
</Button>`}
        />
        <p className="text-[14px] text-gray-700 leading-7 mt-3">이 4가지가 빠지면 사용자는 차례로 다음을 경험한다:</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px] text-gray-700 leading-7">
          <li>빈값 보냄 → 서버 검증 에러 alert ("뭐가 잘못된 거지?")</li>
          <li>비로그인 → 401/403 → 에러 alert ("로그인은 됐는데?")</li>
          <li>더블 클릭 → 두 번 제출 → 같은 질문 두 번 등록 ("내가 한 번만 눌렀는데?")</li>
          <li>제출 후 textarea 그대로 → 같은 질문 또 보냄 ("아까 보낸 거 맞나?")</li>
        </ol>
      </div>

      {/* 교훈 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">교훈</h4>
        </div>
        <Callout variant="key">
          <strong>훅은 책임 단위로 자른다.</strong> 같은 도메인이라도 페이지가 다르고 책임이 다르면 별도 훅.
          "도메인 이름"으로 묶지 말고 "사용처/책임 단위"로 묶어라.
        </Callout>
        <Callout variant="key">
          <strong>mutation은 호출만 한다고 끝이 아니다.</strong> ① 빈값 가드 ② 인증 가드 ③ <IC>isPending</IC>로 중복 차단 ④ <IC>onSuccess</IC>로 후속처리 — 4가지가 기본 세트.
          빠뜨리면 사용자는 "버튼을 눌렀는데 아무 반응 없네" 또는 "왜 두 번 보내졌지" 같은 경험을 한다.
        </Callout>
        <Callout variant="key">
          <strong>합치고 싶다 vs 분리해야 한다의 판단</strong>:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>두 훅이 같은 페이지에서만 함께 마운트되나? → 합쳐도 OK 가능성</li>
            <li>다른 페이지에서 한쪽만 쓰나? → 무조건 분리</li>
            <li>책임 이름이 자연스럽게 한 줄로 표현되나? → 한 훅. 두 줄 이상이면 분리.</li>
          </ul>
        </Callout>
      </div>
    </section>
  )
}
