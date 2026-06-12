import { HandbookLayout } from './_components/HandbookLayout'
import { Hero } from './_components/Hero'
import { QuickIndex } from './_components/sections/QuickIndex'
import { CategoriesOverview } from './_components/sections/CategoriesOverview'
import { TopTen } from './_components/sections/TopTen'
import { Pitfalls } from './_components/sections/Pitfalls'
import { PhaseIndex } from './_components/sections/PhaseIndex'
import { UsageChecklist } from './_components/sections/UsageChecklist'

export default function HakjongHandbookPage() {
  return (
    <HandbookLayout>
      <Hero />
      <div className="px-5 py-8 md:px-10 md:py-12 max-w-[920px] space-y-0">
        <QuickIndex />
        <CategoriesOverview />
        <TopTen />
        <Pitfalls />
        <PhaseIndex />
        <UsageChecklist />
      </div>
    </HandbookLayout>
  )
}
