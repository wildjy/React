'use client'
import { cn } from '@/sharedUI/common/cn'

/* ── 네비게이션 데이터 ────────────────────────── */
type NavItem =
  | { id: string; label: string; icon: string }
  | { id: string; label: string; num: number }

interface NavGroup {
  id: string
  label: string
  phase: 1 | 2 | 3 | 4 | 5 | 6 | null
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
