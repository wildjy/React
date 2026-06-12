import { FlowDiagram } from '../../../hakjong-guide/_components/ui/StepCard'
import { IC } from '../../../hakjong-guide/_components/ui/Callout'
import { DataTable } from '../../../hakjong-guide/_components/ui/DataTable'

/**
 * 🚀 빠른 검색 인덱스
 *
 * 세 가지 입구로 30초 안에 진입:
 *   🔴 에러 메시지로 / 🟡 작업 키워드로 / 🟢 작업 진도로
 */
export function QuickIndex() {
  return (
    <section id="quick-index" className="mb-12 scroll-mt-20">
      <SectionHeader
        icon="🚀"
        title="빠른 검색 인덱스"
        sub="본인 상황에 맞춰 세 가지 입구 중 하나 — 30초 안에 답으로 직행"
      />

      {/* 🔴 에러 메시지로 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3">🔴 에러 메시지로 찾기</h4>
        <DataTable
          headers={['콘솔/화면에 보이는 것', '점프']}
          rows={[
            [<IC key="a">{'Invalid hook call. Hooks can only be called inside…'}</IC>, '#2'],
            [<IC key="b">{'VALIDATION_PIPE_ERROR: subjectNot should not be empty'}</IC>, '#3'],
            [<IC key="c">{'each value in majorIdHsbs must be a string'}</IC>, '#4'],
            [<><IC key="d">alert</IC>가 같은 동작에 <strong>두 번</strong> 발생</>, '#5'],
            [<>화면에 숫자 <IC key="e">0</IC> 또는 <IC key="e2">NaN</IC>이 그대로 찍힘</>, '#6'],
            [<><IC key="f">{'Cannot GET …'}</IC> 등 쿼리 1개 실패 → <strong>페이지 전체 흰 화면</strong></>, '#7'],
            [<IC key="g">{'Uncaught (in promise) …'}</IC>, '#1'],
          ]}
        />
      </div>

      {/* 🟡 작업 키워드로 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3">🟡 작업 키워드 / 증상으로 찾기</h4>
        <DataTable
          headers={['상황', '점프']}
          rows={[
            ['제출 후 카운트/리스트가 옛 값 그대로', '#1 cache invalidation'],
            ['같은 동작에 사이드이펙트가 두 번 일어남', '#5 impure updater'],
            ['카드 N개 같은 복수 데이터를 어디다 저장하지?', '#9 데이터 모델링'],
            ['훅에서 값 3개만 필요한데 통째로 부르고 있음', '#8 통째 호출 함정'],
            [<>props 10개+ 내려주고 있음 / 컴포넌트 500줄</>, '#10 컴포넌트 비대화'],
            ['신청 POST가 두 개라는데 뭐가 다르지?', '#9 apply vs submit'],
          ]}
        />
      </div>

      {/* 🟢 작업 진도로 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3">🟢 작업 진도(단계)로 찾기</h4>
        <FlowDiagram>{`새 기능 시작
   ↓
①라우팅 → ②가드 → ③조회 → ④UI/입력 → ⑤상태 → ⑥전송 → ⑦이동
                                                              ↘
                                              ⑧디버깅 ←─────── (어느 단계서나)
                                                              ↙
                                              ⑨리팩토링 (다 끝나면)`}</FlowDiagram>
        <p className="text-[13px] text-gray-600 mt-2 leading-7">
          각 단계가 무엇을 다루는지는 다음 섹션 <strong>"9 카테고리 한눈에"</strong> 표 참조.
        </p>
      </div>
    </section>
  )
}

/* 작은 섹션 헤더 헬퍼 */
function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        {sub && <p className="text-[13px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
