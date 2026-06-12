'use client'
import { cn } from '@/sharedUI/common/cn'

/* ── 네비게이션 데이터 ────────────────────────── */
type NavItem =
  | { id: string; label: string; icon: string }
  | { id: string; label: string; num: number }

interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    id: 'entry',
    label: '빠른 진입',
    items: [
      { id: 'quick-index',  label: '빠른 검색 인덱스', icon: '🚀' },
      { id: 'categories',   label: '9 카테고리 한눈에', icon: '📂' },
    ],
  },
  {
    id: 'top-ten',
    label: 'Top 10 막힘 사전',
    items: [
      { id: 'item-1',  label: '저장됐는데 화면 그대로',         num: 1 },
      { id: 'item-2',  label: '코드 멀쩡한데 hook 에러 폭발',   num: 2 },
      { id: 'item-3',  label: '빈칸 두고 제출했더니 거부',      num: 3 },
      { id: 'item-4',  label: '드롭다운에 placeholder만',       num: 4 },
      { id: 'item-5',  label: '한 번 눌렀는데 alert 두 번',     num: 5 },
      { id: 'item-6',  label: '빈자리에 "0" 이 찍힘',           num: 6 },
      { id: 'item-7',  label: 'API 1개에 페이지 흰 화면',       num: 7 },
      { id: 'item-8',  label: '안 쓰는 쿼리가 줄줄이 발사',     num: 8 },
      { id: 'item-9',  label: 'apply ≠ "신청완료" 헷갈려요',    num: 9 },
      { id: 'item-10', label: 'prop 11개에 페이지 500줄',       num: 10 },
    ],
  },
  {
    id: 'appendix',
    label: '부록',
    items: [
      { id: 'pitfalls',    label: '5대 반복 함정',          icon: '📌' },
      { id: 'phase-index', label: '원본 Phase 인덱스',       icon: '📚' },
      { id: 'checklist',   label: '사용 체크리스트',         icon: '✅' },
    ],
  },
]

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
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-rose-600">
          <span className="text-[13px] font-bold text-white">학종 실무 핸드북</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-rose-100 hover:text-white hover:bg-rose-700"
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
    <div className="px-4 py-5 border-b border-gray-100 bg-gradient-to-br from-rose-600 to-orange-600 shrink-0">
      <h1 className="text-[13px] font-bold text-white leading-snug">
        학종(hakjong)<br />실무 핸드북
      </h1>
      <p className="text-[11px] text-rose-100 mt-1">막혔을 때 30초 안에 답 찾기</p>
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
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                {hasNum ? (
                  <span
                    className={cn(
                      'w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      isActive
                        ? 'bg-rose-200 text-rose-700'
                        : 'bg-rose-100 text-rose-700',
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
