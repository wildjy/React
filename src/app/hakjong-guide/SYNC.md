# hakjong-guide 동기화 가이드

> **목적:** 루트의 [`hakjong-dev-guide.md`](../../../hakjong-dev-guide.md)가 변경되면, 그 내용을 이 폴더(`src/app/hakjong-guide`)의 React 컴포넌트에 반영하는 절차와 규칙을 정의한다.
>
> **단일 출처(SSOT):** 학습 내용의 원본은 **언제나 마크다운(`hakjong-dev-guide.md`)**이다. 컴포넌트는 그 내용을 화면용으로 옮긴 **거울(mirror)**이다. 컴포넌트에서 먼저 고치고 마크다운을 나중에 맞추지 말 것. (반대 방향만 허용)

---

## 0. 한눈에 보는 작업 흐름

```
1) 무엇이 바뀌었나 확인     →  git diff hakjong-dev-guide.md
2) 변경 유형 분류           →  (A)새 Phase  (B)기존 Phase에 Step 추가
                               (C)하위 Step(N-1)  (D)본문/표/코드 수정
3) 유형별 매핑 규칙대로 반영 →  아래 3~4장
4) 마크다운 요소 → 컴포넌트  →  아래 5장 변환표
5) 이스케이프 함정 점검      →  아래 6장
6) 타입 체크                →  npx tsc --noEmit -p .
7) 체크리스트 확인          →  아래 7장
8) 배포                     →  pnpm run deploy   (predeploy=build → gh-pages 자동)
```

변경 확인 명령:

```bash
git diff hakjong-dev-guide.md | grep -E "^\+" | grep -E "^\+#{2,3} |Phase|Step [0-9]"
```

---

## 1. 폴더 / 파일 구조

```
src/app/hakjong-guide/
├── page.tsx                      ← 모든 Phase 컴포넌트를 위→아래로 조립
├── SYNC.md                       ← (이 문서)
└── _components/
    ├── GuideLayout.tsx
    ├── Hero.tsx
    ├── Sidebar.tsx               ← 좌측 목차(네비게이션)
    ├── sections/
    │   ├── Overview.tsx
    │   ├── Phase1.tsx ~ Phase11.tsx   ← 마크다운 ## Phase N 1:1 대응
    │   └── Appendix.tsx          ← Libraries / Concepts / Cautions
    └── ui/                       ← 재사용 표시 컴포넌트 (아래 2장)
        ├── StepCard.tsx          ← StepCard, PhaseHeader, FlowDiagram, CompareGrid, SectionHeader
        ├── Callout.tsx           ← Callout, IC
        ├── CodeBlock.tsx
        └── DataTable.tsx
```

**대응 관계**

| 마크다운                | 컴포넌트                                  |
| ----------------------- | ----------------------------------------- |
| `## Phase N — …`        | `_components/sections/PhaseN.tsx`         |
| `### Step M: …`         | `<StepCard phase={N} num={M} …>`          |
| `### Step M-1: …`(하위) | `<StepCard phase={N} num="M-1" …>`        |
| `### 배경` / `### 정리` 등 비-Step 소제목 | 흰 카드(`<div className="bg-white …">`) |

---

## 2. UI 컴포넌트 API (변환 시 사용할 도구)

| 컴포넌트       | import 위치        | 주요 props / 용도 |
| -------------- | ------------------ | ----------------- |
| `PhaseHeader`  | `../ui/StepCard`   | `phase={N}` — Phase 머리말. 라벨/색은 `StepCard.tsx`의 `phaseHeaderMap`에서 가져옴 |
| `StepCard`     | `../ui/StepCard`   | `phase`, `num`(number\|string), `id?`, `title` — Step 카드 |
| `FlowDiagram`  | `../ui/StepCard`   | children: **문자열**. ASCII 흐름도/다이어그램(공백 보존) |
| `CompareGrid`  | `../ui/StepCard`   | `beforeLabel?`, `afterLabel?`, `before`, `after` — 변경 전/후 2열 |
| `Callout`      | `../ui/Callout`    | `variant`: `tip`(💡) \| `warn`(⚠️) \| `key`(🔑) \| `info`(📌) — 인용/강조 박스 |
| `IC`           | `../ui/Callout`    | 본문 속 인라인 코드(빨간 배지). 마크다운의 `` `코드` ``에 해당 |
| `CodeBlock`    | `../ui/CodeBlock`  | `code`(문자열), `lang?`, `path?` — 코드 펜스. 주석/줄번호 표시 |
| `DataTable`    | `../ui/DataTable`  | `headers: string[]`, `rows: React.ReactNode[][]` — 표 |

> 색상은 **동적 조합 금지**(Tailwind purge). `phaseStepBg` / `phaseHeaderMap` / `phaseBadgeColors`처럼 **완성형 클래스 문자열**로만 추가한다.

---

## 3. 유형별 반영 절차

### (A) 새 Phase가 추가됐다 — 가장 손이 많이 감 (파일 4곳)

1. **`_components/sections/PhaseN.tsx` 생성**
   - 맨 위 `<PhaseHeader phase={N} />`
   - 마크다운 본문을 5장 변환표대로 컴포넌트로 옮김
2. **`_components/ui/StepCard.tsx` 수정 (4군데)**
   - `phaseStepBg`에 `N: 'bg-<color>-500'` 추가
   - `phaseHeaderMap`에 `N: { wrap, num, text, label }` 추가 (label = 마크다운 Phase 제목)
   - `StepCardProps.phase` 유니온에 `| N` 추가
   - `PhaseHeader`의 `phase` 파라미터 유니온에 `| N` 추가
     - (위 두 유니온은 동일 문자열이라 `replace_all`로 한 번에 가능)
3. **`page.tsx` 수정**
   - `import { PhaseN } from './_components/sections/PhaseN'`
   - 직전 Phase 다음에 `<PhaseN />` 렌더
4. **`_components/Sidebar.tsx` 수정**
   - `NavGroup.phase` 유니온에 `| N` 추가
   - `navGroups`에 그룹 1개 추가 (직전 Phase 다음, `appendix` 앞)
   - 번호 있는 Step이면 `phaseBadgeColors`에 `N: 'bg-<color>-100 text-<color>-700'` 추가

**현재 Phase 색상 배정** (다음 Phase는 미사용 색을 고를 것):

| Phase | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| ----- |---|---|---|---|---|---|---|---|---|----|----|
| color | sky | emerald | amber | rose | fuchsia | cyan | violet | orange | teal | lime | red |

### (B) 기존 Phase에 일반 Step이 추가됐다 (예: Step 49)

1. 해당 `PhaseN.tsx`에 `<StepCard phase={N} num={49} id="step49" title="…">…</StepCard>` 추가 (순서 위치 맞춰)
2. `Sidebar.tsx`의 해당 phase 그룹 `items`에 `{ id: 'step49', label: '…', num: 49 }` 추가

### (C) 하위 Step(N-1)이 추가됐다 (예: Step 16-1, 19-1)

1. 해당 `PhaseN.tsx`에 `<StepCard phase={N} num="16-1" …>` 추가 (문자열 num)
2. **사이드바에는 넣지 않는다.** (기존 `9-1`, `16-1`, `19-1` 관례 — 본문에서만 노출)

### (D) 비-Step 소제목/표/코드/문구가 추가·수정됐다

- `### 배경`, `### 정리`, `### 증상` 등 **Step 번호 없는 소제목**은 흰 카드로 표현:
  ```tsx
  <div id="phaseN-something" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4 scroll-mt-20">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">◎</div>
      <h4 className="text-[15px] font-bold text-gray-900">소제목</h4>
    </div>
    {/* 본문 */}
  </div>
  ```
- 이런 카드를 사이드바에 넣고 싶으면 **아이콘 기반** nav 아이템으로 (`{ id: 'phaseN-something', label: '…', icon: '🩺' }`) 추가하고, 카드 `id`와 맞춘다. (Phase 11이 이 방식)
- 기존 카드/표/코드의 단순 수정은 해당 컴포넌트의 해당 부분만 고친다.

---

## 4. 비-Step Phase 통째(예: Phase 11 트러블슈팅)

Step 번호가 없는 Phase는 `StepCard` 대신 **흰 카드 여러 장 + `PhaseHeader`**로 구성하고,
각 카드에 `id` 앵커(`phaseN-xxx`)를 달아 사이드바 아이콘 아이템과 연결한다. (A)의 2~4단계(StepCard 맵·page·Sidebar)는 동일하게 수행한다.

---

## 5. 마크다운 → 컴포넌트 변환표

| 마크다운 요소                          | 컴포넌트 변환                                              |
| -------------------------------------- | --------------------------------------------------------- |
| `## Phase N — 제목`                    | `<PhaseHeader phase={N} />` + `phaseHeaderMap[N].label`   |
| `### Step M: 제목`                     | `<StepCard phase={N} num={M} id="stepM" title="제목">`    |
| `### 소제목` (비-Step)                 | 흰 카드 (3-(D) 참고)                                       |
| 본문 문단                              | `<p className="text-[14px] text-gray-700 leading-7 …">`   |
| `` `인라인코드` ``                     | `<IC>인라인코드</IC>`                                      |
| ```` ```lang … ``` ````                | `<CodeBlock lang="lang" code={`…`} />`                    |
| 파일 경로 주석 (코드 위 `**파일: …**`) | `<CodeBlock path="경로" … />`                             |
| 표 (`\| … \|`)                         | `<DataTable headers={[…]} rows={[[…]]} />`                |
| `> 인용` (팁/주의/요약)                | `<Callout variant="…">` — 아래 매핑                       |
| ASCII 다이어그램(박스/화살표)          | `<FlowDiagram>{`…`}</FlowDiagram>`                        |
| 변경 전/후 2단 비교                     | `<CompareGrid before={…} after={…} />`                    |
| 목록 `- …`                             | `<ul className="list-disc pl-5 space-y-1">…</ul>`         |

**인용(`>`) → Callout variant 매핑 가이드**

| 인용 성격                | variant | 아이콘 |
| ------------------------ | ------- | ------ |
| 팁 / 부연 / "~란?"       | `tip`   | 💡     |
| 주의 / 함정 / ⚠️         | `warn`  | ⚠️     |
| 핵심 요약 / "한 줄 정리" | `key`   | 🔑     |
| 일반 참고 / 맥락 / 📌    | `info`  | 📌     |

**Phase 정리 표(맨 끝 "Phase N 정리")**는 흰 카드 + `✓` 아이콘(해당 phase 색 `bg-<color>-500`) + `DataTable` + `key` Callout로 표현한다. (Phase 9·10 참고)

---

## 6. 이스케이프 함정 (반드시 점검)

`CodeBlock`/`FlowDiagram`의 `code`/children은 **JS 템플릿 리터럴**(백틱)로 전달하므로:

- 코드 안에 **백틱**이 있으면 → `` \` ``로 이스케이프
- 코드 안에 **`${…}`**(JS 템플릿 표현식 모양)가 있으면 → `\${…}`로 이스케이프
  ```tsx
  // 예: ky 코드의 `${basePath}/...`
  code={`.post(\`\${basePath}/api/...\`, { json })`}
  ```

**JSX 본문/IC 텍스트** 안에서는:

- `<`, `>` → `&lt;`, `&gt;` (또는 `IC`로 감싸기)
- `{`, `}` → JSX 표현식으로 해석됨. 문자열 리터럴로: `<IC>{'{ ...requestData }'}</IC>`
- `DataTable`의 셀이 코드/특수문자면 문자열 대신 `<IC key="…">…</IC>` 사용 (배열 안 요소엔 `key` 부여)

---

## 7. 마무리 체크리스트

- [ ] `git diff hakjong-dev-guide.md`로 변경 범위 파악했다
- [ ] 새 Phase면 **4파일**(PhaseN.tsx · StepCard.tsx · page.tsx · Sidebar.tsx) 모두 손댔다
- [ ] 새 색상은 미사용 Tailwind 팔레트에서 골랐고, 완성형 클래스로 추가했다
- [ ] Step `id`와 Sidebar nav `id`가 일치한다 (스크롤 이동 동작)
- [ ] 하위 Step(N-1)은 사이드바에 넣지 않았다
- [ ] 코드 블록의 백틱/`${}` 이스케이프, JSX의 `<>{}` 처리 확인했다
- [ ] `npx tsc --noEmit -p .` 에러 없음
- [ ] (가능하면) `/hakjong-guide` 화면에서 새 섹션 + 사이드바 이동 육안 확인
- [ ] `pnpm run deploy` 정상 종료 (build → gh-pages 배포까지)

---

## 8. 배포 (GitHub Pages)

타입 체크와 육안 확인이 끝났으면 한 줄로 배포한다:

```bash
pnpm run deploy
```

내부 동작 순서:

1. `predeploy` 훅이 자동으로 `pnpm run build` 실행 → Next.js가 `out/` 디렉터리에 정적 파일 생성
2. `deploy` 스크립트가 `gh-pages -d out` 실행 → `gh-pages` 브랜치에 푸시
3. GitHub Pages가 그 브랜치를 호스팅 (수 분 내 반영)

`package.json` 스크립트 참고:

```json
{
  "scripts": {
    "build": "next build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d out"
  }
}
```

**배포 전 점검**

- 타입 체크 통과(7장 체크리스트)가 선결 조건. 빌드도 같은 TS 컴파일러를 거치므로 미통과 시 `pnpm run deploy`도 실패한다.
- 새 색상/클래스가 **완성형 문자열**로 들어가 있는지 확인 (Tailwind purge 안전).
- `next.config` 가 정적 export(`output: 'export'`)로 잡혀 있어야 `out/`이 생성됨.

**배포 실패 시 점검 순서**

1. `pnpm run build` 단독 실행해 빌드 단계 에러인지 확인
2. 빌드 OK인데 `gh-pages` 단계에서 막힘 → 인증/원격 권한 확인 (`git remote -v`, `gh auth status`)
3. 배포는 됐지만 화면이 안 바뀜 → GitHub Pages 캐시(수 분), 브라우저 강력 새로고침(Ctrl+F5)

---

## 부록: 새 Phase 추가 최소 예시 (스켈레톤)

```tsx
// _components/sections/Phase12.tsx
import { PhaseHeader, StepCard } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase12() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={12} />
      <StepCard phase={12} num={49} id="step49" title="제목">
        <p>본문…</p>
        <CodeBlock lang="typescript" code={`// 코드`} />
        <Callout variant="key">요약…</Callout>
      </StepCard>
    </section>
  )
}
```

```tsx
// StepCard.tsx
phaseStepBg:   { …, 12: 'bg-pink-500' }
phaseHeaderMap:{ …, 12: { wrap: 'bg-pink-50 border-pink-200', num: 'bg-pink-500', text: 'text-pink-800', label: '…' } }
StepCardProps.phase / PhaseHeader phase 유니온: … | 12

// page.tsx
import { Phase12 } from './_components/sections/Phase12'
…<Phase11 /><Phase12 /><Libraries />…

// Sidebar.tsx
NavGroup.phase 유니온: … | 12
phaseBadgeColors: { …, 12: 'bg-pink-100 text-pink-700' }
navGroups: { id: 'phase12', label: 'Phase 12 — …', phase: 12, items: [{ id:'step49', label:'…', num:49 }] }
```
