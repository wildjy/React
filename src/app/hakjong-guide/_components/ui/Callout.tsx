import { cn } from '@/sharedUI/common/cn'

export type CalloutVariant = 'tip' | 'warn' | 'key' | 'info'

const styles: Record<CalloutVariant, { wrap: string; icon: string }> = {
  tip:  { wrap: 'bg-blue-50 border-blue-200 text-blue-900',     icon: '💡' },
  warn: { wrap: 'bg-amber-50 border-amber-200 text-amber-900',  icon: '⚠️' },
  key:  { wrap: 'bg-green-50 border-green-200 text-green-900',  icon: '🔑' },
  info: { wrap: 'bg-purple-50 border-purple-200 text-purple-900', icon: '📌' },
}

interface CalloutProps {
  variant: CalloutVariant
  children: React.ReactNode
}

export function Callout({ variant, children }: CalloutProps) {
  const { wrap, icon } = styles[variant]
  return (
    <div className={cn('flex gap-3 rounded-lg px-4 py-3 my-3 border text-[13px] leading-7', wrap)}>
      <span className="text-[15px] shrink-0 mt-0.5">{icon}</span>
      <div>{children}</div>
    </div>
  )
}

/** 텍스트 내 인라인 코드 */
export function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-red-50 text-red-700 border border-red-100 rounded px-1.5 py-0.5 text-[12.5px] font-mono">
      {children}
    </code>
  )
}
