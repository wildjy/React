import { SectionHeader, FlowDiagram } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { DataTable } from '../ui/DataTable'

/* ── 주요 라이브러리 ─────────────────────────── */
export function Libraries() {
  return (
    <section id="libraries" className="mb-16 scroll-mt-20">
      <SectionHeader icon="📦" title="주요 라이브러리 및 훅 정리" sub="각 Phase별 사용된 라이브러리와 역할" />
      <DataTable
        headers={['라이브러리 / 훅', '용도', 'Phase']}
        rows={[
          [<IC key="a">@libs/ui/Tab</IC>,                             '탭 UI 컴포넌트 (Tab, Tab.List, Tab.Button)',      'P1'],
          [<IC key="b">@libs/ui/DropDown</IC>,                        '드롭다운 선택 컴포넌트',                          'P3'],
          [<IC key="c">@libs/ui/Button</IC>,                          '버튼 컴포넌트',                                   'P3'],
          [<IC key="d">useCurrentUser()</IC>,                         '현재 로그인 사용자 정보 조회',                    'P2'],
          [<IC key="e">useUnivMajorListAndMajorTheme()</IC>,          '대학/학과 목록 API 데이터 조회',                  'P3'],
          [<><IC key="f">code()</IC>, ' / ', <IC key="g">codeName()</IC></>,  '공통 코드(상수) 조회',                   'P3'],
          [<IC key="h">usePathname()</IC>,                            '현재 URL 경로 조회 (활성 탭 판별)',               'P1'],
          [<IC key="i">useRouter()</IC>,                              '프로그래밍 방식 페이지 이동',                     'P2'],
          [<IC key="j">useState()</IC>,                               '컴포넌트 내부 상태 관리',                         'P3'],
          [<IC key="k">useMemo()</IC>,                                '계산 결과 메모이제이션 (성능 최적화)',             'P3'],
          [<IC key="l">useMutation()</IC>,                            'POST/PUT/DELETE 요청 생명주기 관리',              'P4'],
          [<IC key="m">URLSearchParams</IC>,                          '객체를 안전하게 URL 쿼리스트링으로 인코딩',        'P4'],
          [<IC key="n">useSearchParams()</IC>,                        'URL 쿼리스트링 값 읽기',                          'P4'],
          [<IC key="o">isPending</IC>,                                'mutation 진행 중 로딩 상태로 UX 처리',             'P4'],
          [<IC key="p">MSW handler</IC>,                              '실제 서버 없이 POST API를 로컬에서 목업',          'P4'],
          [<IC key="q">sessionStorage</IC>,                           '페이지 간 임시 데이터 저장 및 복원',               'P5'],
          [<IC key="r">useEffect()</IC>,                              'Hydration 이후 브라우저 저장소 값을 안전하게 복원', 'P5'],
          [<IC key="s">ConfirmModal</IC>,                             '최종 제출 전 사용자 재확인 모달',                  'P6'],
          [<IC key="t">onBeforeChange</IC>,                           '탭 전환 전 조건을 검사하는 가드 지점',             'P7'],
          [<IC key="u">guard clause</IC>,                             '조건 불충족 시 빠르게 return false로 탈출',        'P7'],
        ]}
      />
    </section>
  )
}

/* ── 핵심 개념 정리 ──────────────────────────── */
export function Concepts() {
  return (
    <section id="concepts" className="mb-16 scroll-mt-20">
      <SectionHeader
        icon="💡"
        title="퍼블리셔 → 프론트 핵심 개념"
        sub="퍼블리싱과 다른 프론트엔드 개발의 핵심 차이점"
      />

      {/* 서버 vs 클라이언트 컴포넌트 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gray-400 flex items-center justify-center text-white text-xs font-bold">①</span>
          서버 컴포넌트 vs 클라이언트 컴포넌트
        </h4>
        <DataTable
          headers={['구분', '서버 컴포넌트 (기본)', "클라이언트 컴포넌트 ('use client')"]}
          rows={[
            ['실행 위치', '서버에서만 실행',          '브라우저에서 실행'],
            ['사용 가능', 'DB 접근, 파일 읽기',        'useState, useEffect, onClick 등'],
            ['사용 불가', 'useState, onClick 등',      '서버 전용 API (cookies, fs 등)'],
            ['파일 예시',
              <><IC key="a">layout.tsx</IC>, ', ', <IC key="b">page.tsx</IC></>,
              <><IC key="c">EarlyHakjong.tsx</IC>, ', ', <IC key="d">EarlyHakjongNavigator.tsx</IC></>,
            ],
          ]}
        />
        <Callout variant="key">
          <IC>&apos;use client&apos;</IC>는 꼭 필요한 컴포넌트에만 붙이세요.
          상태관리, 이벤트 핸들러, 브라우저 API를 사용하는 컴포넌트만 클라이언트로 만듭니다.
        </Callout>
      </div>

      {/* 데이터 흐름 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gray-400 flex items-center justify-center text-white text-xs font-bold">②</span>
          데이터 흐름 요약
        </h4>
        <FlowDiagram>{`API 서버 → React Query 훅 → useMemo 변환 → 컴포넌트 props → UI 렌더링
                                              ↑
                                   useState (사용자 입력)
                                              ↑
                                   이벤트 핸들러 (onClick, onChange)`}</FlowDiagram>
        <Callout variant="tip">
          Phase 5부터는 여기에 <IC>sessionStorage</IC>와 <IC>useEffect</IC>가 추가됩니다.
          즉, 서버 데이터 흐름뿐 아니라 "페이지를 오가며 임시 입력값을 안전하게 복원하는 흐름"도 함께 설계해야 합니다.
        </Callout>
        <Callout variant="info">
          Phase 7에서는 여기서 한 단계 더 나아가 <IC>sessionStorage</IC>를 렌더링용 state가 아니라
          <strong>탭 접근 제어를 위한 외부 저장소</strong>로 읽습니다. 이 경우에는 이벤트 핸들러 시점에 최신 값을 다시 확인하는 것이 중요합니다.
        </Callout>
      </div>

      {/* 상태 변경 = 화면 자동 업데이트 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <h4 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gray-400 flex items-center justify-center text-white text-xs font-bold">③</span>
          상태 변경 = 화면 자동 업데이트
        </h4>
        <FlowDiagram>{`사용자 클릭 → 이벤트 핸들러 → setState() → React 재렌더링 → 화면 업데이트`}</FlowDiagram>
        <Callout variant="key">
          퍼블리싱처럼 DOM을 직접 조작(<IC>innerHTML</IC>, <IC>appendChild</IC>)하지 않습니다.
          상태(<IC>state</IC>)를 바꾸면 React가 알아서 필요한 부분만 다시 그립니다.
        </Callout>
      </div>
    </section>
  )
}

/* ── 주의사항 ─────────────────────────────────── */
const cautions = [
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'Tab.Button link vs onBeforeChange',
    desc: (
      <>
        접근 제어 없이 바로 이동: <IC>link href</IC> 사용.
        로그인 체크 등 접근 제어 필요: <IC>onBeforeChange</IC> 사용 →{' '}
        <IC>router.push()</IC>로 수동 이동.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: '네비게이터 중복 렌더링 방지',
    desc: (
      <>
        <IC>layout.tsx</IC>에 네비게이터를 배치했으면 각 페이지 컴포넌트에서는 반드시 제거할 것.
      </>
    ),
  },
  {
    icon: '✓',
    iconBg: 'bg-green-100 text-green-700',
    title: '데모 데이터 → API 전환 시',
    desc: (
      <>
        <IC>useDemoApplyCompleted</IC> 훅 제거 → React Query <IC>useQuery</IC>로 교체.{' '}
        <IC>{'enabled: !!currentUser.userId'}</IC> 옵션으로 비로그인 시 불필요한 요청 방지.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: '상태의 불변성',
    desc: (
      <>
        state를 직접 수정하면 안 됩니다 (<IC>selectedOption.drop1 = ...</IC> ❌).
        항상 <IC>setSelectedOption()</IC>으로 새 객체를 만들어서 교체 (
        <IC>{'{ ...prev, drop1: ... }'}</IC> ✅).
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: '리스트 렌더링 시 key 필수',
    desc: (
      <>
        <IC>.map()</IC>으로 리스트를 렌더링할 때 반드시 고유 <IC>key</IC> 속성 지정.
        배열 인덱스(index)보다 실제 고유 ID 사용을 권장합니다.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'useSearchParams()는 반드시 Suspense 안에서 사용',
    desc: (
      <>
        <IC>useSearchParams()</IC>를 사용하는 컴포넌트를 <IC>Suspense</IC> 없이 렌더링하면
        빌드/런타임 오류 발생. <IC>page.tsx</IC>에서 <IC>{'<Suspense>'}</IC>로 감싸는 것이 기본 패턴.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'sessionStorage는 렌더링 중 직접 읽지 말 것',
    desc: (
      <>
        <IC>typeof window</IC> 분기나 <IC>useState(() =&gt; ...)</IC> 안에서 직접 읽으면 Hydration mismatch가 날 수 있습니다.
        브라우저 저장소 복원은 <IC>useEffect</IC>에서 <IC>setState</IC>로 처리하세요.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'barrel export가 없으면 직접 경로 import',
    desc: (
      <>
        <IC>ConfirmModal</IC>처럼 <IC>index.ts</IC>에 등록되지 않은 공통 컴포넌트는
        <IC>@libs/ui/Modal/ConfirmModal</IC>처럼 파일 경로를 직접 지정해 import해야 합니다.
      </>
    ),
  },
  {
    icon: '✓',
    iconBg: 'bg-green-100 text-green-700',
    title: '새 API는 4단계 패턴으로 연동',
    desc: (
      <>
        새로운 API가 생기면 <strong>타입 → API 함수 → mutation 훅 → 컴포넌트</strong> 순서로 붙이세요.
        Phase 4의 신청 API와 Phase 6의 확정 API가 같은 패턴입니다.
      </>
    ),
  },
  {
    icon: '⚠️',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'sessionStorage는 핸들러 안에서 읽어야 최신 값 보장',
    desc: (
      <>
        <IC>sessionStorage</IC>는 React state가 아니므로 값이 바뀌어도 리렌더링되지 않습니다.
        탭 접근 제어처럼 클릭 시점의 최신 값이 중요할 때는 컴포넌트 최상위가 아니라 <IC>handleBeforeReport</IC> 안에서 읽으세요.
      </>
    ),
  },
]

export function Cautions() {
  return (
    <section id="cautions" className="mb-16 scroll-mt-20">
      <SectionHeader icon="⚠️" title="개발 시 주의사항" sub="실수하기 쉬운 포인트 정리" />
      <ul className="space-y-0">
        {cautions.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-b-0 text-[13.5px] text-gray-700 leading-7"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${item.iconBg}`}
            >
              {item.icon}
            </span>
            <div>
              <strong className="block text-gray-900 mb-0.5">{item.title}</strong>
              <span className="text-gray-600">{item.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
