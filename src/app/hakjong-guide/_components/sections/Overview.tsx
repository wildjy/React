import { SectionHeader } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'

const tabs = [
  {
    icon: '🏠',
    name: '서비스 안내',
    path: '/hakjong',
    guard: '🔓 공개 (접근 제한 없음)',
    comp: 'EarlyHakjongIntro',
  },
  {
    icon: '📝',
    name: '평가 신청하기',
    path: '/hakjong/apply',
    guard: '🔒 로그인 필요',
    comp: 'EarlyHakjong',
  },
  {
    icon: '📊',
    name: '평가 리포트',
    path: '/hakjong/report',
    guard: '🔒 로그인 + 신청 완료',
    comp: 'EarlyHakjongReport',
  },
]

export function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <SectionHeader
        icon="📋"
        title="1. 서비스 개요"
        sub="학종 서비스는 apps/early Next.js 앱 내 3개 탭 기반 페이지로 구성됩니다"
      />

      {/* 탭 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {tabs.map((tab) => (
          <div
            key={tab.path}
            className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-sm transition-shadow"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">
              {tab.icon}
            </div>
            <h4 className="text-[13px] font-bold text-gray-900 mb-2">{tab.name}</h4>
            <span className="font-mono text-[11.5px] text-indigo-600 bg-indigo-50 rounded px-2 py-0.5 inline-block mb-2">
              {tab.path}
            </span>
            <p className="text-[11.5px] text-gray-500 mb-1">{tab.guard}</p>
            <p className="text-[11px] text-gray-400 font-mono">{tab.comp}</p>
          </div>
        ))}
      </div>

      <Callout variant="tip">
        <strong>파일 구조 미리 보기:</strong>{' '}
        <IC>apps/early/src/window/hakjong/</IC> 아래에 페이지 단위 컴포넌트가,{' '}
        <IC>app/(early)/hakjong/</IC> 아래에 Next.js App Router 라우팅 정의가 위치합니다.
      </Callout>
    </section>
  )
}
