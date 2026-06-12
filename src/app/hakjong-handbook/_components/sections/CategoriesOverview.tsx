import { IC } from '../../../hakjong-guide/_components/ui/Callout'
import { DataTable } from '../../../hakjong-guide/_components/ui/DataTable'

/**
 * 📂 작업 순서 9 카테고리 한눈에
 *
 * 새 기능 만들 때 ① → ② → ⑦ 순서로, 막혔을 때 ⑧, 다 끝나면 ⑨로.
 * 굵게 표시된 항목이 Top 10 사전에 포함된 핵심 막힘.
 */
export function CategoriesOverview() {
  return (
    <section id="categories" className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-lg shrink-0">
          📂
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">9 카테고리 한눈에</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">실무 작업 순서대로 정렬 — 위에서 아래로 따라가면 됨</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 text-[13px]">
        <DataTable
          headers={['#', '카테고리', '대표 막힘 (굵게 = Top 10)', '원본 Phase']}
          rows={[
            [
              <strong key="1c">①</strong>,
              <strong key="1n">페이지 구조 / 라우팅</strong>,
              '탭 + Next.js App Router 폴더 구조, 공통 레이아웃, 활성 탭 감지',
              '1',
            ],
            [
              <strong key="2c">②</strong>,
              <strong key="2n">접근 제어 / 가드</strong>,
              <>비로그인 차단, 신청 완료 가드, 클라이언트 vs Next.js 서버 가드, options enum</>,
              '2, 7, 23, 29, 33',
            ],
            [
              <strong key="3c">③</strong>,
              <strong key="3n">데이터 조회 (읽기)</strong>,
              <>useQuery 설계, queryKey, staleTime, enabled, prefetch effect, <strong>throwOnError 우회</strong></>,
              '3, 9, 19, 27',
            ],
            [
              <strong key="4c">④</strong>,
              <strong key="4n">UI 조립 / 입력 받기</strong>,
              '드롭다운, 카드 추가, 제어 컴포넌트, 모달, 모드별 빈값 숨김, Pointer Events',
              '3, 6, 22, 31',
            ],
            [
              <strong key="5c">⑤</strong>,
              <strong key="5n">상태 설계 / 훅 분리</strong>,
              <>useState vs useRef, derived value, 상태 끌어올리기, <strong>통째 호출 함정</strong>, FSD 레이어</>,
              '8, 13, 16, 17, 32',
            ],
            [
              <strong key="6c">⑥</strong>,
              <strong key="6n">데이터 전송 (쓰기)</strong>,
              <>useMutation 4종, mutate vs mutateAsync, <strong>Cache Invalidation</strong>, 두 단계 신청</>,
              '4, 10, 24, 25, 28, 30',
            ],
            [
              <strong key="7c">⑦</strong>,
              <strong key="7n">페이지 간 데이터 전달</strong>,
              'URL params / sessionStorage / 서버 prefetch 3방식 + 의사결정, "서버 진실의 원천"',
              '5, 18, 19',
            ],
            [
              <strong key="8c">⑧</strong>,
              <strong key="8n">디버깅 / 에러 사전</strong>,
              <><strong>Invalid hook call / VALIDATION_PIPE_ERROR / number↔string / alert 2회 / "0" 함정</strong></>,
              '11, 14, 15, 20, 21, 26, 34',
            ],
            [
              <strong key="9c">⑨</strong>,
              <strong key="9n">리팩토링 / 설계 진화</strong>,
              <><strong>비대 컴포넌트 분리</strong>, 제네릭 + render-prop, options enum, FSD 상향 import 금지</>,
              '12, 13, 24, 25, 26, 27, 33',
            ],
          ]}
        />
        <p className="text-[12.5px] text-gray-500 mt-3">
          → 굵은 항목은 <IC>Top 10 막힘 사전</IC> — 클릭하면 30초 안에 답.
        </p>
      </div>
    </section>
  )
}
