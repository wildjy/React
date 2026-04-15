# 학종(hakjong) 프론트엔드 개발 가이드

> 퍼블리셔에서 프론트엔드 개발자로 전환하는 과정에서 학습한 내용을 정리한 문서입니다.
> HTML/CSS 마크업 이후, React + Next.js 기반으로 실제 동작하는 페이지를 만들기까지의 전체 흐름을 다룹니다.

---

## 1. 개발 개요

학종 서비스는 `apps/early` Next.js 앱 내에 구현되며, 3개 탭 기반 페이지로 구성됩니다.

| 탭            | 경로              | 접근 조건               | 페이지 컴포넌트      |
| ------------- | ----------------- | ----------------------- | -------------------- |
| 서비스 안내   | `/hakjong`        | 없음 (공개)             | `EarlyHakjongIntro`  |
| 평가 신청하기 | `/hakjong/apply`  | 로그인 필요             | `EarlyHakjong`       |
| 평가 리포트   | `/hakjong/report` | 로그인 + 신청 완료 필요 | `EarlyHakjongReport` |

---

## 2. 개발 순서 및 절차

### Phase 1: 페이지 구조 잡기

#### Step 1: 탭 네비게이터 컴포넌트 생성

가장 먼저 페이지 간 이동을 담당하는 탭 네비게이터를 만듭니다.

- 공통 UI 라이브러리의 `Tab` 컴포넌트(`@libs/ui/Tab`) 사용
- `modeType="type4"` 스타일 적용

**핵심 개념: 공통 UI 컴포넌트 활용**

퍼블리싱에서는 탭 UI를 직접 HTML/CSS로 구현하지만, 프론트에서는 이미 만들어진 디자인 시스템 컴포넌트를 가져다 씁니다. `@libs/ui/Tab`처럼 프로젝트 내 공통 라이브러리에서 제공하는 컴포넌트를 먼저 찾아보세요.

```
src/window/hakjong/EarlyHakjongNavigator.tsx
```

#### Step 2: 해시 네비게이션 → 실제 라우팅 전환

**왜 전환했나?**

초기에는 `#1/`, `#2/`, `#3/` 해시 기반으로 탭 전환을 구현했습니다. 이 방식은 하나의 페이지 안에서 콘텐츠만 바꾸는 SPA 방식입니다. 하지만 각 탭이 독립된 페이지로 동작해야 했기 때문에(URL 공유, 새로고침 시 상태 유지, SEO 등) Next.js App Router 기반 실제 라우팅으로 전환했습니다.

**변경 전 (해시 기반):**

```tsx
<Tab.Button link href="#1/">서비스 안내</Tab.Button>
<Tab.Button link href="#2/">평가 신청하기</Tab.Button>
<Tab.Button link href="#3/">평가 리포트</Tab.Button>
```

**변경 후 (실제 라우팅):**

```tsx
<Tab.Button link href="/hakjong">서비스 안내</Tab.Button>
<Tab.Button onBeforeChange={handleBeforeApply}>평가 신청하기</Tab.Button>
<Tab.Button onBeforeChange={handleBeforeReport}>평가 리포트</Tab.Button>
```

#### Step 3: 라우트(경로) 구조 생성

Next.js App Router에서는 **폴더 구조 = URL 구조**입니다. 폴더를 만들고 그 안에 `page.tsx`를 넣으면 해당 경로의 페이지가 됩니다.

```
apps/early/app/(early)/hakjong/
├── layout.tsx          ← 공통 레이아웃 (네비게이터 포함)
├── page.tsx            ← /hakjong → 서비스 안내
├── apply/
│   └── page.tsx        ← /hakjong/apply → 평가 신청하기
└── report/
    └── page.tsx        ← /hakjong/report → 평가 리포트
```

> **`(early)`는 Route Group**: URL에는 나타나지 않고, 레이아웃을 공유하기 위한 폴더입니다.

#### Step 4: 공통 레이아웃에 네비게이터 배치

`hakjong/layout.tsx`에 네비게이터를 배치하면, 하위 모든 페이지(`/hakjong`, `/hakjong/apply`, `/hakjong/report`)에서 자동으로 네비게이터가 표시됩니다. 각 페이지 컴포넌트에서 네비게이터를 중복으로 렌더링하지 않아야 합니다.

```tsx
// hakjong/layout.tsx
import { EarlyHakjongNavigator } from '@/window/hakjong/EarlyHakjongNavigator';

export default function HakjongLayout({ children }) {
  return (
    <div className="hakjongLayout">
      <EarlyHakjongNavigator /> {/* 모든 하위 페이지에서 공유 */}
      {children} {/* 각 page.tsx의 내용이 여기에 들어감 */}
    </div>
  );
}
```

**핵심 개념: layout.tsx vs page.tsx**

| 파일         | 역할                          | 특징                       |
| ------------ | ----------------------------- | -------------------------- |
| `layout.tsx` | 여러 페이지가 공유하는 껍데기 | 페이지 전환 시 유지됨      |
| `page.tsx`   | 개별 페이지의 고유 콘텐츠     | 페이지 전환 시 새로 렌더링 |

#### Step 5: 활성 탭 자동 감지

사용자가 어떤 페이지에 있는지에 따라 해당 탭이 활성화되어야 합니다. `usePathname()` 훅으로 현재 URL을 읽어 활성 탭 인덱스를 결정합니다.

```tsx
import { usePathname } from 'next/navigation';

const pathname = usePathname();

const getInitTab = () => {
  if (pathname.endsWith('/apply')) return 1; // URL이 /apply로 끝나면 → 탭 1
  if (pathname.endsWith('/report')) return 2; // URL이 /report로 끝나면 → 탭 2
  return 0; // 그 외 → 탭 0 (서비스 안내)
};
```

> **`String.endsWith()`**: 문자열이 특정 문자열로 끝나는지 `true`/`false`로 반환하는 JS 내장 메서드입니다.

---

### Phase 2: 접근 제어 (가드) 구현

#### Step 6: 로그인 체크 및 조건부 페이지 이동

**Tab.Button 타입별 동작 이해하기**

공통 Tab 컴포넌트를 사용할 때, 두 가지 모드의 차이를 이해해야 합니다:

| 속성                  | 렌더링             | 클릭 동작                                  |
| --------------------- | ------------------ | ------------------------------------------ |
| `link href="..."`     | `<Link>` (Next.js) | **즉시** 페이지 이동, 중간에 가로채기 불가 |
| `onBeforeChange={fn}` | `<button>`         | `fn()` 실행 → `false` 반환 시 이동 차단    |

접근 제어가 필요한 탭은 `link`를 사용하지 않고 `onBeforeChange`로 처리합니다.

```tsx
import { useCurrentUser } from '@libs/entities/user';
import { useRouter } from 'next/navigation';

const { currentUser } = useCurrentUser();
const router = useRouter();

// 평가 신청하기: 로그인 체크
const handleBeforeApply = () => {
  if (!currentUser.userId) {
    // userId가 빈 문자열이면 비로그인
    alert('로그인이 필요한 서비스입니다.');
    return false; // false 반환 → 탭 전환 차단
  }
  router.push('/hakjong/apply'); // 로그인 상태면 수동으로 페이지 이동
  return true;
};

// 평가 리포트: 로그인 체크 + 신청 완료 체크
const handleBeforeReport = () => {
  if (!currentUser.userId) {
    alert('로그인이 필요한 서비스입니다.');
    return false;
  }
  if (!isApplyCompleted) {
    alert('평가 신청을 먼저 완료해주세요.');
    return false;
  }
  router.push('/hakjong/report');
  return true;
};
```

**핵심 개념: `useCurrentUser()` 훅**

- `currentUser.userId`가 빈 문자열(`''`)이면 비로그인 상태
- `currentUser.userId`에 값이 있으면 로그인 상태
- 내부적으로 `/api/next/auth/current-user` API를 호출하여 쿠키 기반 인증 확인

#### Step 7: 데모 데이터로 상태 관리 (API 연동 전)

API가 아직 없는 경우, 데모 훅을 만들어 임시 상태를 관리합니다. 추후 교체할 수 있도록 예상 API 스펙을 주석으로 남겨둡니다.

```tsx
// TODO: API 연동 시 실제 신청 완료 상태로 대체
// 예상 API:
//   GET /hakjong/apply/status
//   Response: { isApplyCompleted: boolean }
//
// 대체 예시:
//   const { data } = useQuery({
//     queryKey: ['hakjong', 'apply', 'status'],
//     queryFn: () => apiClientFor(process.env.CLIENT_API_URL)()
//       .get('hakjong/apply/status')
//       .json<{ isApplyCompleted: boolean }>(),
//     enabled: !!currentUser.userId,
//   });
//   const isApplyCompleted = data?.isApplyCompleted ?? false;

const useDemoApplyCompleted = () => {
  const [isApplyCompleted] = useState(true);
  return { isApplyCompleted };
};
```

---

### Phase 3: 신청하기 페이지 기능 구현 (EarlyHakjong.tsx)

#### Step 8: TypeScript 인터페이스(타입) 정의

컴포넌트를 만들기 전에, 다룰 데이터의 구조를 TypeScript `interface`로 먼저 정의합니다. 이것이 퍼블리싱과의 가장 큰 차이점 중 하나입니다 — **데이터의 형태를 코드로 먼저 설계**합니다.

```tsx
// 드롭다운에서 선택한 값의 형태
interface StringDropDownOption {
  label: string; // 화면에 표시되는 텍스트 (예: "서울대학교")
  value: string; // 실제 전달되는 값 (예: "101")
}

// 3개 드롭다운의 선택 상태를 묶어서 관리
interface SelectedOptions {
  drop1: StringDropDownOption; // 대학
  drop2: StringDropDownOption; // 계열
  drop3: StringDropDownOption; // 학과
}

// 추가된 조건 카드 한 장의 형태
interface SelectedCard {
  id: string; // 고유 식별자 (중복 추가 방지용)
  options: SelectedOptions; // 선택된 3개 조건
}
```

> **왜 interface를 쓰나요?**
> HTML에서는 데이터 구조를 신경 쓸 필요가 없지만, React에서는 데이터를 기반으로 UI를 렌더링합니다. interface를 정의하면 잘못된 데이터 사용 시 에디터에서 빨간 줄(타입 에러)로 미리 알려줍니다.

#### Step 9: API 데이터 조회 (서버 데이터 가져오기)

React Query 훅을 사용하여 서버에서 데이터를 가져옵니다. 퍼블리싱에서는 정적 HTML 한 번 만들면 끝이지만, 프론트에서는 **API에서 데이터를 받아와서 동적으로 UI를 구성**합니다.

```tsx
import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search';
import { useCurrentUser } from '@libs/entities/user';

const { currentUser } = useCurrentUser();
const { data: univMajorData } = useUnivMajorListAndMajorTheme();
```

- `useCurrentUser()` → 현재 로그인 사용자 정보
- `useUnivMajorListAndMajorTheme()` → 대학/계열/학과 목록 데이터

> **핵심: 이 훅들은 내부적으로 React Query를 사용합니다.**
> 자동으로 로딩/에러 상태를 관리하고, 캐싱 및 재요청을 처리합니다.

#### Step 10: API 데이터 → 드롭다운 옵션으로 변환 (useMemo)

서버에서 받은 데이터를 드롭다운 컴포넌트가 이해하는 `{ label, value }` 형태로 변환합니다. `useMemo`로 감싸서 불필요한 재계산을 방지합니다.

```tsx
// 대학 목록: API 데이터 → 드롭다운 옵션
const universityOptions = useMemo<StringDropDownOption[]>(
  () =>
    univMajorData?.universities.map((univ) => ({
      label: univ.universityName, // 화면 표시: "서울대학교"
      value: String(univ.universityId), // 내부 값: "101"
    })) ?? [], // 데이터 없으면 빈 배열
  [univMajorData?.universities], // 이 값이 바뀔 때만 재계산
);
```

> **`useMemo`란?**
> 계산 비용이 있는 값을 기억(메모이제이션)해두고, 의존성 배열(`[]` 안의 값)이 바뀔 때만 다시 계산합니다. 매 렌더링마다 불필요하게 `.map()` 같은 배열 변환을 반복하지 않기 위해 사용합니다.

**공통 코드(상수) 활용:**

계열 같은 고정 데이터는 API 대신 공통 코드 라이브러리를 사용합니다:

```tsx
import { code, codeName } from '@libs/common';

const majorTypeOptions: StringDropDownOption[] = [
  {
    label: codeName('MAJOR_TYPE_CODES', 'HUMANITIES'), // "인문계"
    value: code('MAJOR_TYPE_CODES', 'HUMANITIES'), // "HUM"
  },
  {
    label: codeName('MAJOR_TYPE_CODES', 'NATURAL_SCIENCE'), // "자연계"
    value: code('MAJOR_TYPE_CODES', 'NATURAL_SCIENCE'), // "NAT"
  },
  // ...
];
```

> **`code()` / `codeName()`**: 전체 프로젝트에서 공유하는 상수값을 가져오는 유틸리티입니다. 하드코딩된 문자열 대신 이 함수들을 사용해 일관성을 유지합니다.

#### Step 11: 상태(State) 관리 — 사용자 입력 추적

React에서 사용자의 입력(선택)은 `useState`로 관리합니다. 상태가 바뀌면 화면이 자동으로 다시 그려집니다. 이것이 퍼블리싱과의 핵심 차이입니다 — **DOM을 직접 조작하지 않고, 상태를 바꾸면 UI가 따라갑니다.**

```tsx
// 드롭다운 3개의 현재 선택값
const [selectedOption, setSelectedOption] = useState<SelectedOptions>({
  drop1: { value: '', label: '' },
  drop2: { value: '', label: '' },
  drop3: { value: '', label: '' },
});

// 추가된 조건 카드 목록
const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
```

> **퍼블리싱 vs 프론트 비교:**
>
> | 퍼블리싱 (jQuery 등)                           | 프론트 (React)                    |
> | ---------------------------------------------- | --------------------------------- |
> | `$('#select').val()` 로 값 읽기                | `selectedOption.drop1.value`      |
> | `$('#result').html('<p>내용</p>')` 로 DOM 수정 | 상태 변경 → 자동 재렌더링         |
> | 이벤트마다 DOM 직접 조작                       | `setState` → React가 DOM 업데이트 |

#### Step 12: 이벤트 핸들러 작성 — 사용자 동작 처리

사용자가 드롭다운을 바꾸거나, 카드를 추가/삭제할 때의 동작을 함수로 정의합니다.

**드롭다운 변경 핸들러:**

```tsx
const handleChange = (
  key: keyof SelectedOptions, // 'drop1' | 'drop2' | 'drop3'
  option: StringDropDownOption,
) => {
  setSelectedOption((prevState) => ({
    ...prevState, // 기존 상태 유지
    [key]: option, // 해당 드롭다운만 업데이트
  }));
};
```

> **`...prevState` (스프레드 연산자)**: 기존 객체를 복사한 뒤 특정 키만 덮어씁니다. React에서는 상태를 직접 수정하면 안 되고, 항상 새 객체를 만들어야 합니다(불변성).

**카드 추가 핸들러 (중복 방지 포함):**

```tsx
const handleAddCard = () => {
  // 3개 선택값을 합쳐서 고유 ID 생성 (예: "101-HUM-CS01")
  const cardId = [selectedOption.drop1.value, selectedOption.drop2.value, selectedOption.drop3.value].join('-');

  setSelectedCards((prevState) => {
    // 같은 조합이 이미 있으면 추가하지 않음
    if (prevState.some((card) => card.id === cardId)) {
      return prevState;
    }

    return [
      ...prevState,
      {
        id: cardId,
        options: {
          drop1: selectedOption.drop1,
          drop2: selectedOption.drop2,
          drop3: selectedOption.drop3,
        },
      },
    ];
  });
};
```

> **`.some()` 메서드**: 배열 안에 조건을 만족하는 요소가 하나라도 있으면 `true`를 반환합니다. 중복 체크에 자주 사용됩니다.

**카드 삭제 핸들러:**

```tsx
const handleDeleteCard = (cardId: string) => {
  setSelectedCards(
    (prevState) => prevState.filter((card) => card.id !== cardId), // 해당 ID를 제외한 새 배열 반환
  );
};
```

> **`.filter()` 메서드**: 조건에 맞는 요소만 남긴 새 배열을 반환합니다. 원본 배열을 변형하지 않아 React의 불변성 원칙에 맞습니다.

#### Step 13: UI 렌더링 — 컴포넌트 조립

데이터와 이벤트 핸들러가 준비되면, 공통 UI 컴포넌트에 연결하여 화면을 구성합니다.

**드롭다운 컴포넌트 연결:**

```tsx
import { DropDown, DropDownOptionType } from '@libs/ui/DropDown';

<DropDown
  label="대학 선택" // 플레이스홀더
  onChange={
    (option) => handleChange('drop1', toStringDropDownOption(option)) // 선택 시 상태 업데이트
  }
  options={universityOptions} // Step 10에서 만든 옵션
  size="sm"
  type="base"
  value={selectedOption.drop1.value || null} // 현재 선택된 값
/>;
```

> **타입 변환 함수 `toStringDropDownOption()`**: 공통 DropDown 컴포넌트의 `DropDownOptionType`과 우리가 정의한 `StringDropDownOption`의 형태가 다를 수 있어 변환 함수를 사용합니다.

**조건 카드 목록 렌더링 (리스트 렌더링):**

```tsx
{
  selectedCards.map((card) => (
    <div key={card.id} className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            조건 1: <strong>{card.options.drop1.label}</strong>
          </p>
          <p>
            조건 2: <strong>{card.options.drop2.label}</strong>
          </p>
          <p>
            조건 3: <strong>{card.options.drop3.label}</strong>
          </p>
        </div>
        <button
          type="button"
          aria-label="카드 삭제"
          onClick={() => handleDeleteCard(card.id)} // 해당 카드 삭제
        >
          X
        </button>
      </div>
    </div>
  ));
}
```

> **`key` 속성이 필수인 이유**: React가 리스트의 어떤 항목이 변경/추가/삭제되었는지 효율적으로 판단하기 위해 사용합니다. 고유한 값(여기서는 `card.id`)을 지정해야 합니다.

---

## 3. FSD 아키텍처 기반 파일 구조

```
apps/early/src/window/hakjong/
├── EarlyHakjongNavigator.tsx   ← 탭 네비게이터 (접근 제어 포함)
├── EarlyHakjongIntro.tsx       ← 서비스 안내 페이지 컴포넌트
├── EarlyHakjong.tsx            ← 평가 신청 페이지 컴포넌트
└── EarlyHakjongReport.tsx      ← 평가 리포트 페이지 컴포넌트
```

- `window/` 디렉토리: 페이지 단위 컴포넌트 (FSD의 pages 레이어)
- `app/(early)/hakjong/`: Next.js App Router 라우팅 정의
- 비즈니스 로직이 복잡해지면 `entities/hakjong/`, `modules/hakjong/`로 분리

---

## 4. 주요 사용 라이브러리 및 훅 정리

| 라이브러리/훅                              | 용도                                       | Phase |
| ------------------------------------------ | ------------------------------------------ | ----- |
| `@libs/ui/Tab`                             | 탭 UI 컴포넌트 (Tab, Tab.List, Tab.Button) | 1     |
| `@libs/ui/DropDown`                        | 드롭다운 선택 컴포넌트                     | 3     |
| `@libs/ui/Button`                          | 버튼 컴포넌트                              | 3     |
| `@libs/entities/user` → `useCurrentUser()` | 현재 로그인 사용자 정보 조회               | 2     |
| `@libs/entities/university-major-search`   | 대학/학과 목록 API 데이터 조회             | 3     |
| `@libs/common` → `code()`, `codeName()`    | 공통 코드(상수) 조회                       | 3     |
| `next/navigation` → `usePathname()`        | 현재 URL 경로 조회 (활성 탭 판별)          | 1     |
| `next/navigation` → `useRouter()`          | 프로그래밍 방식 페이지 이동                | 2     |
| `react` → `useState()`                     | 컴포넌트 내부 상태 관리                    | 3     |
| `react` → `useMemo()`                      | 계산 결과 메모이제이션 (성능 최적화)       | 3     |

---

## 5. 퍼블리셔 → 프론트 개발자 핵심 개념 정리

### 5-1. 서버 컴포넌트 vs 클라이언트 컴포넌트

| 구분      | 서버 컴포넌트 (기본)              | 클라이언트 컴포넌트 (`'use client'`)            |
| --------- | --------------------------------- | ----------------------------------------------- |
| 실행 위치 | 서버에서만 실행                   | 브라우저에서 실행                               |
| 사용 가능 | DB 접근, 파일 읽기                | useState, useEffect, onClick 등                 |
| 사용 불가 | useState, onClick 등 브라우저 API | 서버 전용 API (cookies, fs 등)                  |
| 파일 예시 | `layout.tsx`, `page.tsx`          | `EarlyHakjong.tsx`, `EarlyHakjongNavigator.tsx` |

> **규칙**: `'use client'`는 꼭 필요한 컴포넌트에만 붙이세요. 상태관리, 이벤트 핸들러, 브라우저 API를 사용하는 컴포넌트만 클라이언트로 만듭니다.

### 5-2. 데이터 흐름 요약

```
API 서버 → React Query 훅 → useMemo 변환 → 컴포넌트 props → UI 렌더링
                                               ↑
                                    useState (사용자 입력)
                                               ↑
                                    이벤트 핸들러 (onClick, onChange)
```

### 5-3. 상태 변경 = 화면 자동 업데이트

```
사용자 클릭 → 이벤트 핸들러 호출 → setState() → React 재렌더링 → 화면 업데이트
```

퍼블리싱처럼 DOM을 직접 조작(`innerHTML`, `appendChild`)하지 않습니다.
상태(`state`)를 바꾸면 React가 알아서 필요한 부분만 다시 그립니다.

---

## 6. 개발 시 주의사항

1. **Tab.Button `link` vs `onBeforeChange`**
   - 접근 제어 없이 바로 이동: `link href` 사용
   - 접근 제어(로그인 체크 등) 필요: `onBeforeChange` 사용 → `router.push()`로 수동 이동

2. **네비게이터 중복 렌더링 방지**
   - `layout.tsx`에 네비게이터를 배치했으면 각 페이지 컴포넌트에서는 제거할 것

3. **데모 데이터 → API 전환 시**
   - `useDemoApplyCompleted` 훅 제거
   - React Query `useQuery`로 교체
   - `enabled: !!currentUser.userId` 옵션으로 비로그인 시 불필요한 요청 방지

4. **상태의 불변성**
   - `state`를 직접 수정하면 안 됨 (`selectedOption.drop1 = ...` ❌)
   - 항상 `setSelectedOption()`으로 새 객체를 만들어서 교체 (`{ ...prev, drop1: ... }` ✅)

5. **리스트 렌더링 시 `key` 필수**
   - `.map()`으로 리스트를 렌더링할 때 반드시 고유 `key` 속성 지정
   - 배열 인덱스(`index`)보다 실제 고유 ID를 사용하는 것이 좋음
