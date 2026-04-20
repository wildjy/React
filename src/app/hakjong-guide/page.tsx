import { GuideLayout }  from './_components/GuideLayout'
import { Hero }         from './_components/Hero'
import { Overview }     from './_components/sections/Overview'
import { Phase1 }       from './_components/sections/Phase1'
import { Phase2 }       from './_components/sections/Phase2'
import { Phase3 }       from './_components/sections/Phase3'
import { Phase4 }       from './_components/sections/Phase4'
import { Phase5 }       from './_components/sections/Phase5'
import { Phase6 }       from './_components/sections/Phase6'
import { Phase7 }       from './_components/sections/Phase7'
import { Libraries, Concepts, Cautions } from './_components/sections/Appendix'

export default function HakjongGuidePage() {
  return (
    <GuideLayout>
      <Hero />
      <div className="px-5 py-8 md:px-10 md:py-12 max-w-[900px] space-y-0">
        <Overview  />
        <Phase1    />
        <Phase2    />
        <Phase3    />
        <Phase4    />
        <Phase5    />
        <Phase6    />
        <Phase7    />
        <Libraries />
        <Concepts  />
        <Cautions  />
      </div>
    </GuideLayout>
  )
}
