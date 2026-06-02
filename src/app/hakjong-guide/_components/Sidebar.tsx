'use client'
import { cn } from '@/sharedUI/common/cn'

/* ── 네비게이션 데이터 ────────────────────────── */
type NavItem =
  | { id: string; label: string; icon: string }
  | { id: string; label: string; num: number }

interface NavGroup {
  id: string
  label: string
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | null
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    id: 'general',
    label: '개요',
    phase: null,
    items: [
      { id: 'overview',   label: '서비스 개요',    icon: '📋' },
      { id: 'libraries',  label: '주요 라이브러리', icon: '📦' },
    ],
  },
  {
    id: 'phase1',
    label: 'Phase 1 — 페이지 구조',
    phase: 1,
    items: [
      { id: 'step1', label: '탭 네비게이터 생성',  num: 1 },
      { id: 'step2', label: '해시 → 실제 라우팅', num: 2 },
      { id: 'step3', label: '라우트 구조 생성',   num: 3 },
      { id: 'step4', label: '공통 레이아웃 배치',  num: 4 },
      { id: 'step5', label: '활성 탭 자동 감지',  num: 5 },
    ],
  },
  {
    id: 'phase2',
    label: 'Phase 2 — 접근 제어',
    phase: 2,
    items: [
      { id: 'step6', label: '로그인 체크 & 가드',   num: 6 },
      { id: 'step7', label: '데모 데이터 상태 관리', num: 7 },
    ],
  },
  {
    id: 'phase3',
    label: 'Phase 3 — 신청 페이지',
    phase: 3,
    items: [
      { id: 'step8',  label: 'TypeScript 타입 정의',  num: 8  },
      { id: 'step9',  label: 'API 데이터 조회',       num: 9  },
      { id: 'step10', label: 'useMemo 데이터 변환',   num: 10 },
      { id: 'step11', label: 'useState 상태 관리',    num: 11 },
      { id: 'step12', label: '이벤트 핸들러 작성',    num: 12 },
      { id: 'step13', label: 'UI 렌더링 & 조립',      num: 13 },
    ],
  },
  {
    id: 'phase4',
    label: 'Phase 4 — 서버 전송',
    phase: 4,
    items: [
      { id: 'step14', label: '서버 타입 정의',     num: 14 },
      { id: 'step15', label: 'API 함수 작성',      num: 15 },
      { id: 'step16', label: 'useMutation 훅',     num: 16 },
      { id: 'step17', label: 'handleSubmit 조립', num: 17 },
      { id: 'step18', label: '확인 페이지',        num: 18 },
      { id: 'step19', label: 'MSW 목 API',         num: 19 },
    ],
  },
  {
    id: 'phase5',
    label: 'Phase 5 — 수정하기',
    phase: 5,
    items: [
      { id: 'step20', label: 'URLSearchParams 방식',      num: 20 },
      { id: 'step21', label: 'URL 읽기와 값 복원',        num: 21 },
      { id: 'step22', label: 'sessionStorage 전환',       num: 22 },
      { id: 'step23', label: 'Hydration 안전 복원',       num: 23 },
      { id: 'step24', label: '두 방식 비교와 선택 기준',  num: 24 },
    ],
  },
  {
    id: 'phase6',
    label: 'Phase 6 — 최종 제출',
    phase: 6,
    items: [
      { id: 'step25', label: 'ConfirmModal 사용',      num: 25 },
      { id: 'step26', label: '모달 상태 관리',         num: 26 },
      { id: 'step27', label: '현재 제출 흐름',         num: 27 },
      { id: 'step28', label: '확정 API 연동 패턴',     num: 28 },
    ],
  },
  {
    id: 'phase7',
    label: 'Phase 7 — 탭 접근 제어',
    phase: 7,
    items: [
      { id: 'step29', label: '탭 내비게이션 구조',           num: 29 },
      { id: 'step30', label: '제출 시 저장, 탭 클릭 시 읽기', num: 30 },
      { id: 'step31', label: 'sessionStorage 선택 이유',      num: 31 },
      { id: 'step32', label: '핸들러 안에서 읽어야 하는 이유', num: 32 },
      { id: 'step33', label: 'API 연동 후 구조',             num: 33 },
    ],
  },
  {
    id: 'phase8',
    label: 'Phase 8 — 커스텀 훅 분리',
    phase: 8,
    items: [
      { id: 'step34', label: '분리 대상 식별',                num: 34 },
      { id: 'step35', label: 'useApplyDropOptions',           num: 35 },
      { id: 'step36', label: 'useHakjongNavigation',          num: 36 },
      { id: 'step37', label: '분리의 장단점',                 num: 37 },
      { id: 'step38', label: 'SSR × sessionStorage 함정',     num: 38 },
      { id: 'step39', label: '향후 구조 개선 방향',           num: 39 },
    ],
  },
  {
    id: 'phase9',
    label: 'Phase 9 — throwOnError 우회',
    phase: 9,
    items: [
      { id: 'step40', label: '글로벌 정책과 문제',         num: 40 },
      { id: 'step41', label: '호출부 fallback 설계',       num: 41 },
      { id: 'step42', label: '옵트아웃 판단 기준',         num: 42 },
      { id: 'step43', label: '백엔드 완료 후 제거 체크',   num: 43 },
    ],
  },
  {
    id: 'phase10',
    label: 'Phase 10 — 실 API 연동 전환',
    phase: 10,
    items: [
      { id: 'step44', label: 'mock 제거 → 실 엔드포인트', num: 44 },
      { id: 'step45', label: '요청 타입 재정의',          num: 45 },
      { id: 'step46', label: '스냅샷 extends 정렬',       num: 46 },
      { id: 'step47', label: 'handleSubmit 재작성',       num: 47 },
      { id: 'step48', label: 'simpleQuestion 입력란',     num: 48 },
    ],
  },
  {
    id: 'phase11',
    label: 'Phase 11 — 트러블슈팅',
    phase: 11,
    items: [
      { id: 'phase11-symptom',  label: '증상',            icon: '🩺' },
      { id: 'phase11-cause',    label: '원인',            icon: '🔍' },
      { id: 'phase11-fix',      label: '해결 — 서버 DTO', icon: '🖥️' },
      { id: 'phase11-followup', label: '프론트 후속 개선', icon: '➕' },
    ],
  },
  {
    id: 'phase12',
    label: 'Phase 12 — 쓰기 vs 읽기',
    phase: 12,
    items: [
      { id: 'phase12-write-vs-read', label: '전송 vs 조회',       icon: '↔️' },
      { id: 'phase12-report-source', label: '리포트 = 분석 결과', icon: '📊' },
      { id: 'phase12-applyid',       label: 'applyId 번호표',      icon: '🎟️' },
      { id: 'phase12-flow',          label: '전체 흐름',           icon: '🗺️' },
      { id: 'phase12-conclusion',    label: '후속: applyId 제거',  icon: '🧹' },
    ],
  },
  {
    id: 'phase13',
    label: 'Phase 13 — 컴포넌트 분리/FSD',
    phase: 13,
    items: [
      { id: 'step49', label: '조합 로직 컴포넌트로',  num: 49 },
      { id: 'step50', label: '반복 UI 서브컴포넌트',  num: 50 },
      { id: 'step51', label: 'FSD 상향 import 금지',  num: 51 },
      { id: 'step52', label: 'dead code 제거',        num: 52 },
    ],
  },
  {
    id: 'phase14',
    label: 'Phase 14 — Invalid hook call',
    phase: 14,
    items: [
      { id: 'phase14-symptom', label: '증상',                 icon: '🩺' },
      { id: 'phase14-cause',   label: '원인: 일반 함수서 호출', icon: '🔍' },
      { id: 'phase14-fix',     label: '해결: 값은 인자로',     icon: '🛠' },
    ],
  },
  {
    id: 'phase15',
    label: 'Phase 15 — 타 호스트 API',
    phase: 15,
    items: [
      { id: 'phase15-bg',    label: '배경',              icon: '◎' },
      { id: 'phase15-trap1', label: '함정① prefixUrl',   icon: '①' },
      { id: 'phase15-trap2', label: '함정② CSP',         icon: '②' },
      { id: 'phase15-trap3', label: '함정③ 프록시',      icon: '③' },
    ],
  },
  {
    id: 'phase16',
    label: 'Phase 16 — 오케스트레이션 훅',
    phase: 16,
    items: [
      { id: 'step53',                 label: '합성 상위 훅',    num: 53 },
      { id: 'phase16-split-vs-merge', label: '분리 vs 통합',    icon: '⚖' },
      { id: 'phase16-tradeoff',       label: 'god-hook 경계',   icon: '⚠' },
    ],
  },
  {
    id: 'phase17',
    label: 'Phase 17 — Confirm 패턴',
    phase: 17,
    items: [
      { id: 'step54', label: '읽기 전용 요약 훅',     num: 54 },
      { id: 'step55', label: '함정: 통째 호출',       num: 55 },
      { id: 'step56', label: '해결: 최소 의존',        num: 56 },
      { id: 'step57', label: '그 외 정리 거리',        num: 57 },
    ],
  },
  {
    id: 'phase18',
    label: 'Phase 18 — 복수 데이터 모델링',
    phase: 18,
    items: [
      { id: 'step58',             label: '시도: comma-join',     num: 58 },
      { id: 'step59',             label: '해결: 구조화 배열',     num: 59 },
      { id: 'step60',             label: '보너스: 카드 복원',     num: 60 },
      { id: 'phase18-lifecycle',  label: '카드 라이프사이클',     icon: '🔄' },
    ],
  },
  {
    id: 'phase19',
    label: 'Phase 19 — sessionStorage 제거',
    phase: 19,
    items: [
      { id: 'step61', label: 'prefetch effect',     num: 61 },
      { id: 'step62', label: '데이터 갭',           num: 62 },
      { id: 'step63', label: 'sessionStorage 제거', num: 63 },
      { id: 'step64', label: '첫 신청자 처리',      num: 64 },
    ],
  },
  {
    id: 'phase20',
    label: 'Phase 20 — number vs string',
    phase: 20,
    items: [
      { id: 'phase20-case1', label: '발견 ①: 검증 차단', icon: '①' },
      { id: 'phase20-case2', label: '발견 ②: 조용한 실패', icon: '②' },
      { id: 'step65',        label: '정규화 위치',         num: 65 },
      { id: 'step66',        label: '근본 해결 TODO',      num: 66 },
    ],
  },
  {
    id: 'phase21',
    label: 'Phase 21 — impure updater',
    phase: 21,
    items: [
      { id: 'phase21-symptom',     label: '증상',                icon: '🩺' },
      { id: 'phase21-cause',       label: '원인: StrictMode',    icon: '🔍' },
      { id: 'phase21-fix',         label: '해결: updater 밖으로', icon: '🛠' },
      { id: 'phase21-placeholder', label: '부수: 6슬롯',         icon: '➕' },
    ],
  },
  {
    id: 'phase22',
    label: 'Phase 22 — Confirm 빈값 숨김',
    phase: 22,
    items: [
      { id: 'step67', label: '단일: mode ? hasValue', num: 67 },
      { id: 'step68', label: '다중: filter + map',   num: 68 },
      { id: 'step69', label: '슬롯: N칸 + placeholder', num: 69 },
    ],
  },
  {
    id: 'phase23',
    label: 'Phase 23 — 서버 진실로',
    phase: 23,
    items: [
      { id: 'step70', label: '오해: POST로 상태확인', num: 70 },
      { id: 'step71', label: '임시: GET derivation', num: 71 },
      { id: 'step72', label: '정석: status API',    num: 72 },
      { id: 'step73', label: '의미 다양성',         num: 73 },
      { id: 'step74', label: '응답 대기 트래킹',    num: 74 },
    ],
  },
  {
    id: 'phase24',
    label: 'Phase 24 — 훅 책임 경계',
    phase: 24,
    items: [
      { id: 'step75', label: '책임 경계 정의',      num: 75 },
      { id: 'step76', label: '합치면 Phase 17 재발', num: 76 },
      { id: 'step77', label: '의사결정 A/B/C',      num: 77 },
      { id: 'step78', label: 'mutation UX 4종',     num: 78 },
    ],
  },
  {
    id: 'phase25',
    label: 'Phase 25 — apply vs submit',
    phase: 25,
    items: [
      { id: 'step79', label: '사용자 상태 머신',    num: 79 },
      { id: 'step80', label: '페이지별 흐름',       num: 80 },
      { id: 'step81', label: 'GET 의미 있는 상태',  num: 81 },
      { id: 'step82', label: '네이밍 함정',         num: 82 },
      { id: 'step83', label: '"이미 완료" 에러',    num: 83 },
    ],
  },
  {
    id: 'phase26',
    label: 'Phase 26 — 빈 응답 깊이',
    phase: 26,
    items: [
      { id: 'step84', label: '깊이 3가지',          num: 84 },
      { id: 'step85', label: '실제 함정 ①②③',       num: 85 },
      { id: 'step86', label: '깊이 고르는 기준',    num: 86 },
      { id: 'step87', label: 'hasMeaningful 헬퍼',  num: 87 },
    ],
  },
  {
    id: 'phase27',
    label: 'Phase 27 — 제네릭 + render-prop',
    phase: 27,
    items: [
      { id: 'step88', label: '데이터 비교',         num: 88 },
      { id: 'step89', label: '접근 옵션 셋',        num: 89 },
      { id: 'step90', label: '제네릭 컴포넌트',     num: 90 },
      { id: 'step91', label: '두 호출부',           num: 91 },
      { id: 'step92', label: '디테일 카드 분리',    num: 92 },
      { id: 'step93', label: 'render-prop 비교',    num: 93 },
    ],
  },
  {
    id: 'phase28',
    label: 'Phase 28 — POST 에러 응답',
    phase: 28,
    items: [
      { id: 'step94', label: '사전 vs 사후 처리',   num: 94 },
      { id: 'step95', label: '에러 식별 헬퍼',      num: 95 },
      { id: 'step96', label: '처리 위치 A vs B',    num: 96 },
      { id: 'step97', label: '메시지 매칭 취약',    num: 97 },
      { id: 'step98', label: 'POST body 표준',      num: 98 },
      { id: 'phase25-28-summary', label: '25-28 합쳐서', icon: '🗺' },
    ],
  },
  {
    id: 'phase29',
    label: 'Phase 29 — 서버 가드 + options',
    phase: 29,
    items: [
      { id: 'step99',  label: 'use* 접두사 함정',    num: 99 },
      { id: 'step100', label: '일반 async + fetch',   num: 100 },
      { id: 'step101', label: 'alert는 서버 X',       num: 101 },
      { id: 'step102', label: 'options 패턴',         num: 102 },
      { id: 'step103', label: '옵션 이름↔동작 일치',  num: 103 },
      { id: 'step104', label: '결제 조건부 호출',     num: 104 },
    ],
  },
  {
    id: 'phase30',
    label: 'Phase 30 — Cache Invalidation',
    phase: 30,
    items: [
      { id: 'step105', label: 'stale cache 문제',       num: 105 },
      { id: 'step106', label: 'new QueryClient() 함정', num: 106 },
      { id: 'step107', label: 'useQueryClient() 정답',  num: 107 },
      { id: 'step108', label: 'invalidate 표준 위치',   num: 108 },
      { id: 'step109', label: 'alert 중복 함정',        num: 109 },
      { id: 'step110', label: 'Optimistic Update',      num: 110 },
    ],
  },
  {
    id: 'phase31',
    label: 'Phase 31 — Pointer Events',
    phase: 31,
    items: [
      { id: 'step111', label: 'Pointer Events 통합',    num: 111 },
      { id: 'step112', label: 'setPointerCapture',      num: 112 },
      { id: 'step113', label: '두 레이어 width%',       num: 113 },
      { id: 'step114', label: '0.5 단위 스냅',          num: 114 },
      { id: 'step115', label: 'hoverValue 분리',        num: 115 },
      { id: 'step116', label: '내부 정수 vs 표시',      num: 116 },
      { id: 'step117', label: 'disabled prop',          num: 117 },
    ],
  },
  {
    id: 'phase32',
    label: 'Phase 32 — server-first display',
    phase: 32,
    items: [
      { id: 'step118', label: 'derived display value',  num: 118 },
      { id: 'step119', label: 'derived vs useEffect',   num: 119 },
      { id: 'step120', label: 'invalidate 짝',          num: 120 },
      { id: 'step121', label: '새로고침 잠금',          num: 121 },
      { id: 'step122', label: '다른 적용처',            num: 122 },
      { id: 'phase29-32-summary', label: '29-32 합쳐서', icon: '🗺' },
    ],
  },
  {
    id: 'appendix',
    label: '정리',
    phase: null,
    items: [
      { id: 'concepts',  label: '핵심 개념 정리', icon: '💡' },
      { id: 'cautions',  label: '주의사항',       icon: '⚠️' },
    ],
  },
]

const phaseBadgeColors: Record<number, string> = {
  1: 'bg-sky-100 text-sky-700',
  2: 'bg-emerald-100 text-emerald-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-rose-100 text-rose-700',
  5: 'bg-fuchsia-100 text-fuchsia-700',
  6: 'bg-cyan-100 text-cyan-700',
  7: 'bg-violet-100 text-violet-700',
  8: 'bg-orange-100 text-orange-700',
  9: 'bg-teal-100 text-teal-700',
  10: 'bg-lime-100 text-lime-700',
  11: 'bg-red-100 text-red-700',
  12: 'bg-pink-100 text-pink-700',
  13: 'bg-purple-100 text-purple-700',
  14: 'bg-indigo-100 text-indigo-700',
  15: 'bg-slate-100 text-slate-700',
  16: 'bg-blue-100 text-blue-700',
  17: 'bg-green-100 text-green-700',
  18: 'bg-yellow-100 text-yellow-700',
  19: 'bg-stone-100 text-stone-700',
  20: 'bg-zinc-100 text-zinc-700',
  21: 'bg-neutral-100 text-neutral-700',
  22: 'bg-gray-100 text-gray-700',
  23: 'bg-sky-100 text-sky-800',
  24: 'bg-emerald-100 text-emerald-800',
  25: 'bg-amber-100 text-amber-800',
  26: 'bg-fuchsia-100 text-fuchsia-800',
  27: 'bg-violet-100 text-violet-800',
  28: 'bg-orange-100 text-orange-800',
  29: 'bg-indigo-100 text-indigo-800',
  30: 'bg-rose-100 text-rose-800',
  31: 'bg-teal-100 text-teal-800',
  32: 'bg-pink-100 text-pink-800',
}

/* ── 컴포넌트 ─────────────────────────────────── */
interface SidebarProps {
  isOpen: boolean
  activeSection: string
  onClose: () => void
}

export function Sidebar({ isOpen, activeSection, onClose }: SidebarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose()
  }

  return (
    <>
      {/* Desktop — 항상 고정 */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-gray-200 flex-col z-50">
        <SidebarHeader />
        <SidebarNav activeSection={activeSection} onNavClick={scrollTo} />
      </aside>

      {/* Mobile — 드로어 */}
      <aside
        className={cn(
          'fixed top-0 left-0 w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col z-50 lg:hidden',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-indigo-600">
          <span className="text-[13px] font-bold text-white">학종 개발 가이드</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-indigo-200 hover:text-white hover:bg-indigo-700"
          >
            ✕
          </button>
        </div>
        <SidebarNav activeSection={activeSection} onNavClick={scrollTo} />
      </aside>
    </>
  )
}

function SidebarHeader() {
  return (
    <div className="px-4 py-5 border-b border-gray-100 bg-indigo-600 shrink-0">
      <h1 className="text-[13px] font-bold text-white leading-snug">
        학종(hakjong)<br />프론트엔드 개발 가이드
      </h1>
      <p className="text-[11px] text-indigo-200 mt-1">퍼블리셔 → 프론트 전환 학습</p>
    </div>
  )
}

function SidebarNav({
  activeSection,
  onNavClick,
}: {
  activeSection: string
  onNavClick: (id: string) => void
}) {
  return (
    <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
      {navGroups.map((group) => (
        <div key={group.id} className="mb-1">
          <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {group.label}
          </div>

          {group.items.map((item) => {
            const isActive = activeSection === item.id
            const hasNum = 'num' in item

            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-[7px] text-[12.5px] text-left',
                  'border-l-[3px] transition-all duration-150',
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                {hasNum && group.phase != null ? (
                  <span
                    className={cn(
                      'w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      isActive
                        ? 'bg-indigo-200 text-indigo-700'
                        : phaseBadgeColors[group.phase],
                    )}
                  >
                    {(item as { num: number }).num}
                  </span>
                ) : (
                  <span className="text-sm shrink-0">
                    {(item as { icon: string }).icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
