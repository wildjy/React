import { IC } from '../../../hakjong-guide/_components/ui/Callout'
import { DataTable } from '../../../hakjong-guide/_components/ui/DataTable'

/**
 * 📚 원본 가이드 Phase 인덱스 (작업순 카테고리별)
 *
 * Top 10 외 항목은 원본 가이드의 해당 Phase 직접 참조.
 */
export function PhaseIndex() {
  return (
    <section id="phase-index" className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg shrink-0">
          📚
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">원본 Phase 인덱스</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Top 10 외 항목은 <IC>hakjong-dev-guide.md</IC>의 해당 Phase 직접 참조
          </p>
        </div>
      </div>

      <CategoryCard num="①" name="페이지 구조 / 라우팅" color="sky">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 1', '탭 + Next.js App Router 폴더 구조, 공통 레이아웃, 활성 탭 감지 (Steps 1~5)'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="②" name="접근 제어 / 가드" color="emerald">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 2', <>비로그인 가드 (<IC key="a">useCurrentUser</IC>)</>],
            ['Phase 7', '탭 접근 제어 + sessionStorage 완료 상태'],
            ['Phase 23', <>sessionStorage 플래그 → 서버 진실 (<IC key="b">isApplyCompleted</IC>)</>],
            ['Phase 29', <>Next.js 서버 컴포넌트 가드 (<IC key="c">ensureAdmissionEvaluationAccess</IC> + options)</>],
            ['Phase 33', 'options API 진화 (boolean → enum destination)'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="③" name="데이터 조회 (읽기)" color="amber">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 3 Step 9', 'useQuery 직접 호출 + queryKey 설계 + 옵션 상세'],
            ['Phase 9', <>throwOnError 우회 패턴 ← <strong>Top 10 #7</strong></>],
            ['Phase 19', 'sessionStorage 의존 걷어내고 서버 prefetch (Step 61 심층 학습 8개 sub-step)'],
            ['Phase 27', '제네릭 + render-prop으로 같은 UI를 두 데이터에 공유 (Step 90 sub-steps)'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="④" name="UI 조립 / 입력 받기" color="rose">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 3 Steps 10~13', 'useMemo 옵션 변환 + useState + 이벤트 + UI 렌더링'],
            ['Phase 6', '확인 모달 + 최종 제출'],
            ['Phase 22', 'Confirm 모드 빈값 숨김 (단일/다중/슬롯형 3패턴)'],
            ['Phase 31', 'Pointer Events + StarRating (마우스+터치 통합)'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="⑤" name="상태 설계 / 훅 분리" color="fuchsia">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 8', '커스텀 훅 분리 + SSR × sessionStorage 함정'],
            ['Phase 13', <>컴포넌트 분리 + FSD 레이어 ← <strong>Top 10 #10</strong></>],
            ['Phase 16', <>페이지 로직을 단일 오케스트레이션 훅으로 통합 ← <strong>Top 10 #10</strong></>],
            ['Phase 17', <>Confirm 패턴 + 통째 호출 함정 ← <strong>Top 10 #8</strong></>],
            ['Phase 32', 'server-first display, local fallback'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="⑥" name="데이터 전송 (쓰기)" color="cyan">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 4', 'useMutation 기초 + handleSubmit 조립 + MSW'],
            ['Phase 10', <>mock Route 제거, 실 API 연동, 요청/스냅샷 타입 분리, <IC key="a">extends</IC></>],
            ['Phase 24', '훅 책임 경계 + mutation UX 4종 세트'],
            ['Phase 25', <>apply vs submit 두 단계 ← <strong>Top 10 #9</strong></>],
            ['Phase 28', 'POST 에러 응답으로 status API 대체'],
            ['Phase 30', <>Cache Invalidation 표준 패턴 ← <strong>Top 10 #1</strong></>],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="⑦" name="페이지 간 데이터 전달" color="violet">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 5', 'URL params vs sessionStorage 비교'],
            ['Phase 18', <>복수 데이터(카드 N개) 스냅샷 모델링 ← <strong>Top 10 #9</strong></>],
            ['Phase 19', 'sessionStorage 걷어내고 서버 prefetch (의사결정 표)'],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="⑧" name="디버깅 / 에러 사전" color="orange">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 11', <>VALIDATION_PIPE_ERROR ← <strong>Top 10 #3</strong></>],
            ['Phase 14', <>Invalid hook call ← <strong>Top 10 #2</strong></>],
            ['Phase 15', '다른 호스트 API (apiClientFor 절대 URL / CSP / ENOTFOUND)'],
            ['Phase 20', <>number vs string 비대칭 ← <strong>Top 10 #4</strong></>],
            ['Phase 21', <>impure updater alert 2회 ← <strong>Top 10 #5</strong></>],
            ['Phase 26', '빈 응답 깊이별 판정 (||, ??, .length, .some)'],
            ['Phase 34', <>모순 조건 + "0" 함정 ← <strong>Top 10 #6</strong></>],
          ]}
        />
      </CategoryCard>

      <CategoryCard num="⑨" name="리팩토링 / 설계 진화" color="teal">
        <DataTable
          headers={['Phase', '내용']}
          rows={[
            ['Phase 12', '쓰기 vs 읽기 개념 정리 (+ applyId 제거 후속 결론)'],
            ['Phase 13', '컴포넌트 분리 / FSD (또 등장)'],
            ['Phase 24', '훅 책임 경계'],
            ['Phase 25-28 한 그림', '신청 두 단계 + 빈 응답 깊이 + 같은 UI 공유 + 에러 응답 활용'],
            ['Phase 27', '제네릭 + render-prop'],
            ['Phase 29-32 한 그림', '서버 가드 + 캐시 invalidation + Pointer Events + server-first display'],
            ['Phase 33-34 한 그림', 'options enum + 0 함정'],
          ]}
        />
      </CategoryCard>
    </section>
  )
}

/* 카테고리 카드 헬퍼 */
const colorMap = {
  sky: 'bg-sky-100 text-sky-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  violet: 'bg-violet-100 text-violet-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
} as const

function CategoryCard({
  num,
  name,
  color,
  children,
}: {
  num: string
  name: string
  color: keyof typeof colorMap
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center font-bold text-base shrink-0`}
        >
          {num}
        </div>
        <h3 className="text-[15px] font-bold text-gray-900">{name}</h3>
      </div>
      <div className="text-[14px] text-gray-700 leading-7">{children}</div>
    </div>
  )
}
