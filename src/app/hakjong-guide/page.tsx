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
import { Phase8 }       from './_components/sections/Phase8'
import { Phase9 }       from './_components/sections/Phase9'
import { Phase10 }      from './_components/sections/Phase10'
import { Phase11 }      from './_components/sections/Phase11'
import { Phase12 }      from './_components/sections/Phase12'
import { Phase13 }      from './_components/sections/Phase13'
import { Phase14 }      from './_components/sections/Phase14'
import { Phase15 }      from './_components/sections/Phase15'
import { Phase16 }      from './_components/sections/Phase16'
import { Phase17 }      from './_components/sections/Phase17'
import { Phase18 }      from './_components/sections/Phase18'
import { Phase19 }      from './_components/sections/Phase19'
import { Phase20 }      from './_components/sections/Phase20'
import { Phase21 }      from './_components/sections/Phase21'
import { Phase22 }      from './_components/sections/Phase22'
import { Phase23 }      from './_components/sections/Phase23'
import { Phase24 }      from './_components/sections/Phase24'
import { Phase25 }      from './_components/sections/Phase25'
import { Phase26 }      from './_components/sections/Phase26'
import { Phase27 }      from './_components/sections/Phase27'
import { Phase28 }      from './_components/sections/Phase28'
import { Phase25_28Summary } from './_components/sections/Phase25_28Summary'
import { Phase29 }      from './_components/sections/Phase29'
import { Phase30 }      from './_components/sections/Phase30'
import { Phase31 }      from './_components/sections/Phase31'
import { Phase32 }      from './_components/sections/Phase32'
import { Phase29_32Summary } from './_components/sections/Phase29_32Summary'
import { Phase33 }      from './_components/sections/Phase33'
import { Phase34 }      from './_components/sections/Phase34'
import { Phase33_34Summary } from './_components/sections/Phase33_34Summary'
import { Phase35 }      from './_components/sections/Phase35'
import { Phase36 }      from './_components/sections/Phase36'
import { Phase37 }      from './_components/sections/Phase37'
import { Phase38 }      from './_components/sections/Phase38'
import { Phase35_38Summary } from './_components/sections/Phase35_38Summary'
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
        <Phase8    />
        <Phase9    />
        <Phase10   />
        <Phase11   />
        <Phase12   />
        <Phase13   />
        <Phase14   />
        <Phase15   />
        <Phase16   />
        <Phase17   />
        <Phase18   />
        <Phase19   />
        <Phase20   />
        <Phase21   />
        <Phase22   />
        <Phase23   />
        <Phase24   />
        <Phase25   />
        <Phase26   />
        <Phase27   />
        <Phase28   />
        <Phase25_28Summary />
        <Phase29   />
        <Phase30   />
        <Phase31   />
        <Phase32   />
        <Phase29_32Summary />
        <Phase33   />
        <Phase34   />
        <Phase33_34Summary />
        <Phase35   />
        <Phase36   />
        <Phase37   />
        <Phase38   />
        <Phase35_38Summary />
        <Libraries />
        <Concepts  />
        <Cautions  />
      </div>
    </GuideLayout>
  )
}
