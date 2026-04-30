'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'

const SECTION_IDS = [
  'overview',
  'libraries',
  ...Array.from({ length: 39 }, (_, i) => `step${i + 1}`),
  'concepts',
  'cautions',
]

interface GuideLayoutProps {
  children: React.ReactNode
}

export function GuideLayout({ children }: GuideLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  /* 스크롤 위치에 따라 활성 섹션 감지 */
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id)
          })
        },
        { rootMargin: '-10% 0px -80% 0px' },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 메인 영역 */}
      <div className="flex-1 lg:ml-[260px] min-w-0">
        {/* Mobile 상단 바 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 shrink-0"
            aria-label="메뉴 열기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-sm font-bold text-gray-800 truncate">학종 프론트엔드 개발 가이드</span>
        </div>

        {/* Desktop 상단 바 */}
        <div className="hidden lg:flex sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-12 py-2.5 text-[12px] text-gray-500 items-center justify-between">
          <div className="flex items-center gap-2">
            <span>학종 프론트엔드 개발 가이드</span>
            <span>›</span>
            <span>총 39 Steps · 8 Phases</span>
          </div>
          <span className="font-semibold text-indigo-600">apps/early · Next.js App Router</span>
        </div>

        <main>{children}</main>
      </div>
    </div>
  )
}
