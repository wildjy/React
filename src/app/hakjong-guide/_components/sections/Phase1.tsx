import { PhaseHeader, StepCard, SectionHeader, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase1() {
  return (
    <section className="mb-16">
      <SectionHeader icon="🏗️" title="2. 개발 순서 및 절차" sub="Phase별 단계적 구현 흐름" />
      <PhaseHeader phase={1} />

      {/* Step 1 */}
      <StepCard phase={1} num={1} title="탭 네비게이터 컴포넌트 생성">
        <p>
          페이지 간 이동을 담당하는 탭 네비게이터를 가장 먼저 만듭니다.
          공통 UI 라이브러리의 <IC>@libs/ui/Tab</IC> 컴포넌트를 가져다 쓰며{' '}
          <IC>modeType=&quot;type4&quot;</IC> 스타일을 적용합니다.
        </p>
        <Callout variant="key">
          <strong>핵심 개념:</strong> 퍼블리싱에서는 탭 UI를 직접 HTML/CSS로 구현하지만,
          프론트에서는 이미 만들어진 디자인 시스템 컴포넌트를 먼저 찾아보세요.
          중복 구현을 줄이고 디자인 일관성을 유지합니다.
        </Callout>
        <CodeBlock
          lang="path"
          code="src/window/hakjong/EarlyHakjongNavigator.tsx"
        />
        <CodeBlock
          lang="tsx"
          code={`// @libs/ui/Tab 컴포넌트 사용, modeType="type4" 스타일 적용
import { Tab } from '@libs/ui/Tab'

export function EarlyHakjongNavigator() {
  return (
    <Tab modeType="type4">
      <Tab.List>
        <Tab.Button link href="/hakjong">서비스 안내</Tab.Button>
        <Tab.Button>평가 신청하기</Tab.Button>
        <Tab.Button>평가 리포트</Tab.Button>
      </Tab.List>
    </Tab>
  )
}`}
        />
      </StepCard>

      {/* Step 2 */}
      <StepCard phase={1} num={2} title="해시 네비게이션 → 실제 라우팅 전환">
        <p>
          초기에는 해시(#) 기반으로 탭 전환을 구현했으나, 각 탭이 독립된 페이지로 동작해야 해서
          Next.js App Router 기반 실제 라우팅으로 전환했습니다.
        </p>
        <p className="text-[13px] text-gray-500">
          실제 라우팅 전환 시 <strong>URL 공유 · 새로고침 상태 유지 · SEO</strong> 이점이 있습니다.
        </p>
        <CompareGrid
          before={
            <CodeBlock
              lang="tsx"
              code={`<Tab.Button link href="#1/">서비스 안내</Tab.Button>
<Tab.Button link href="#2/">평가 신청하기</Tab.Button>
<Tab.Button link href="#3/">평가 리포트</Tab.Button>`}
            />
          }
          after={
            <CodeBlock
              lang="tsx"
              code={`<Tab.Button link href="/hakjong">서비스 안내</Tab.Button>
<Tab.Button onBeforeChange={handleBeforeApply}>
  평가 신청하기
</Tab.Button>
<Tab.Button onBeforeChange={handleBeforeReport}>
  평가 리포트
</Tab.Button>`}
            />
          }
        />
      </StepCard>

      {/* Step 3 */}
      <StepCard phase={1} num={3} title="라우트(경로) 구조 생성">
        <p>
          Next.js App Router에서는 <strong>폴더 구조 = URL 구조</strong>입니다.
          폴더를 만들고 그 안에 <IC>page.tsx</IC>를 넣으면 해당 경로의 페이지가 됩니다.
        </p>
        <CodeBlock
          lang="directory"
          code={`apps/early/app/(early)/hakjong/
├── layout.tsx          ← 공통 레이아웃 (네비게이터 포함)
├── page.tsx            ← /hakjong → 서비스 안내
├── apply/
│   └── page.tsx        ← /hakjong/apply → 평가 신청하기
└── report/
    └── page.tsx        ← /hakjong/report → 평가 리포트`}
        />
        <Callout variant="info">
          <IC>(early)</IC>는 <strong>Route Group</strong>입니다.
          URL에는 나타나지 않고, 레이아웃을 공유하기 위한 폴더입니다.
        </Callout>
      </StepCard>

      {/* Step 4 */}
      <StepCard phase={1} num={4} title="공통 레이아웃에 네비게이터 배치">
        <p>
          <IC>hakjong/layout.tsx</IC>에 네비게이터를 배치하면,
          하위 모든 페이지에서 자동으로 네비게이터가 표시됩니다.
          각 페이지 컴포넌트에서 중복 렌더링하지 않아야 합니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// hakjong/layout.tsx
import { EarlyHakjongNavigator } from '@/window/hakjong/EarlyHakjongNavigator'

export default function HakjongLayout({ children }) {
  return (
    <div className="hakjongLayout">
      <EarlyHakjongNavigator /> {/* 모든 하위 페이지에서 공유 */}
      {children}               {/* 각 page.tsx의 내용이 여기에 들어감 */}
    </div>
  )
}`}
        />
        <DataTable
          headers={['파일', '역할', '특징']}
          rows={[
            [<IC key="l">layout.tsx</IC>, '여러 페이지가 공유하는 껍데기', '페이지 전환 시 유지됨'],
            [<IC key="p">page.tsx</IC>,   '개별 페이지의 고유 콘텐츠',   '페이지 전환 시 새로 렌더링'],
          ]}
        />
      </StepCard>

      {/* Step 5 */}
      <StepCard phase={1} num={5} title="활성 탭 자동 감지">
        <p>
          사용자가 어떤 페이지에 있는지에 따라 해당 탭이 활성화되어야 합니다.{' '}
          <IC>usePathname()</IC> 훅으로 현재 URL을 읽어 활성 탭 인덱스를 결정합니다.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { usePathname } from 'next/navigation'

const pathname = usePathname()

const getInitTab = () => {
  if (pathname.endsWith('/apply'))  return 1  // /apply로 끝나면 → 탭 1
  if (pathname.endsWith('/report')) return 2  // /report로 끝나면 → 탭 2
  return 0                                    // 그 외 → 탭 0 (서비스 안내)
}`}
        />
        <Callout variant="tip">
          <IC>String.endsWith()</IC>: 문자열이 특정 문자열로 끝나는지{' '}
          <IC>true</IC> / <IC>false</IC>로 반환하는 JS 내장 메서드입니다.
        </Callout>
      </StepCard>
    </section>
  )
}
