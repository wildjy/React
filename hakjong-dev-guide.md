# 학종(hakjong) 프론트엔드 개발 가이드

> 퍼블리셔에서 프론트엔드 개발자로 전환하는 과정에서 학습한 내용을 정리한 문서입니다.
> HTML/CSS 마크업 이후, React + Next.js 기반으로 실제 동작하는 페이지를 만들기까지의 전체 흐름을 다룹니다.

---

## 1. 개발 개요

학종 서비스는 `apps/early` Next.js 앱 내에 구현되며, 3개 탭 기반 페이지로 구성됩니다.

| 탭            | 경로              | 접근 조건               | 페이지 컴포넌트      |
| ------------- | ----------------- | ----------------------- | -------------------- |
| 서비스 안내   | `/hakjong`        | 없음 (공개)             | `EarlyHakjongIntro`  |
| 평가 신청하기 | `/hakjong/apply`  | 로그인 필요             | `EarlyHakjongApply`  |
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

### Phase 3: 신청하기 페이지 기능 구현 (EarlyHakjongApply.tsx)

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

**초보자용 비유로 이해하면:**

- `useQuery`는 도서관에서 책을 꺼내 읽는 것과 같습니다.
- 같은 책을 다시 찾으면, 이미 빌려둔 책을 먼저 보여주는 것이 캐시입니다.
- 창을 다시 보거나, 시간이 지나 책 정보가 오래됐다고 판단되면 다시 빌려와 최신 내용을 확인합니다.

즉, React Query는 단순히 "API 호출 함수"가 아니라, **서버에서 읽어온 데이터를 화면에서 어떻게 보관하고 다시 가져올지 관리하는 도구**라고 이해하면 됩니다.

**이 프로젝트의 조회 흐름을 한 줄씩 풀면:**

1. `useUnivMajorListAndMajorTheme()`가 내부에서 `useQuery`를 호출합니다.
2. React Query가 서버에 대학/계열/학과 목록을 요청합니다.
3. 응답 데이터는 캐시에 저장됩니다.
4. 컴포넌트는 `data`, `isLoading`, `error` 같은 상태를 받아 화면을 그립니다.
5. 같은 데이터가 다시 필요하면 캐시를 우선 재사용합니다.

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['hakjong', 'univ-major-list'],
  queryFn: fetchUnivMajorList,
});
```

> 실제 프로젝트에서는 이 로직을 커스텀 훅으로 감싸 두었기 때문에, 컴포넌트에서는 `useUnivMajorListAndMajorTheme()`처럼 더 읽기 쉬운 형태로 사용합니다.

**`useQuery`를 프론트 학습 관점에서 이해하면:**

- `useQuery`는 "서버에서 읽어온 데이터도 상태처럼 관리하자"는 도구입니다.
- `useState`가 브라우저 안의 로컬 상태를 관리한다면, `useQuery`는 서버에서 온 상태를 관리합니다.
- 그래서 단순히 `fetch()` 한 번 호출하는 것이 아니라, 로딩 상태, 에러 상태, 캐시, 재요청 시점까지 같이 다룹니다.

퍼블리셔에서 프론트로 넘어올 때 가장 크게 체감해야 하는 차이는 이것입니다.

- 퍼블리싱: HTML을 그리고 이벤트를 붙인다.
- 프론트: "이 화면이 어떤 서버 데이터에 의존하는가"를 먼저 정의한다.

즉, `useQuery`를 볼 때는 "어떤 API를 호출하나?"보다 먼저 "이 컴포넌트는 어떤 서버 상태를 읽고 있나?"를 생각하는 습관이 중요합니다.

**`queryKey`는 왜 필요한가?**

`queryKey`는 React Query가 각 조회를 구분하는 **고유 이름표**입니다. 더 쉬운 말로 하면, 캐시에 붙이는 **주소**입니다.

- 같은 `queryKey`면 React Query는 "같은 데이터 조회"라고 판단합니다.
- 다른 `queryKey`면 React Query는 "다른 데이터 조회"라고 판단합니다.
- 그래서 캐시 재사용, 재요청, 무효화(invalidate) 여부가 모두 `queryKey`를 기준으로 동작합니다.

예를 들어:

```tsx
useQuery({
  queryKey: ['user', 1],
  queryFn: () => fetchUser(1),
});

useQuery({
  queryKey: ['user', 2],
  queryFn: () => fetchUser(2),
});
```

- `['user', 1]`과 `['user', 2]`는 다른 key이므로 서로 다른 캐시로 저장됩니다.
- 그래서 사용자 1 상세와 사용자 2 상세가 섞이지 않습니다.

반대로 아래처럼 key를 너무 단순하게 잡으면 문제가 생길 수 있습니다.

```tsx
// 좋지 않은 예: 다른 사용자 조회인데 key가 같음
useQuery({
  queryKey: ['user'],
  queryFn: () => fetchUser(userId),
});
```

이 경우 React Query 입장에서는 모두 `['user']`라는 같은 조회처럼 보이기 때문에, 캐시가 꼬이거나 이전 데이터가 재사용될 수 있습니다.

**`queryKey`를 어떻게 지어야 하나요?**

실무에서는 보통 아래 원칙으로 잡습니다.

1. 가장 앞에는 도메인 이름을 둡니다.
2. 뒤에는 리소스 종류를 둡니다.
3. 마지막에는 조회 결과를 바꾸는 조건값을 넣습니다.

예시:

```tsx
['hakjong', 'apply', 'status'][('hakjong', 'report', userId)][('university', 'detail', universityId)][('post', 'list', category, page)];
```

이렇게 하면 key만 보고도 "무슨 데이터인지"와 "무엇이 바뀌면 다른 조회인지"를 파악할 수 있습니다.

**좋은 `queryKey`의 기준:**

- 사람이 읽어도 의미가 분명하다.
- 서버 응답을 바꾸는 값이 빠지지 않는다.
- 너무 넓지도, 너무 잘게 쪼개지도 않는다.

**`queryKey`에 어떤 값을 넣어야 하나요?**

- API 결과를 바꾸는 값은 넣어야 합니다.
- API 결과를 바꾸지 않는 값은 굳이 넣지 않아도 됩니다.

예를 들어 상세 API가 `userId`에 따라 달라진다면:

```tsx
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});
```

목록 API가 `page`, `sort`, `category`에 따라 달라진다면:

```tsx
useQuery({
  queryKey: ['posts', page, sort, category],
  queryFn: () => fetchPosts({ page, sort, category }),
});
```

즉, **서버 응답이 달라질 조건은 `queryKey`에도 같이 들어가야 한다**고 기억하면 됩니다.

**이 프로젝트 기준으로 보면:**

- `['hakjong', 'apply', 'status']` → 학종 신청 완료 상태 조회
- `['hakjong', 'univ-major-list']` → 대학/계열/학과 목록 조회

둘 다 `hakjong` 도메인 아래 있지만, 조회 대상이 다르기 때문에 key를 분리합니다.

**`queryKey`를 잘못 잡으면 생기는 대표 문제:**

- 다른 데이터를 같은 캐시로 취급해서 화면이 꼬인다.
- invalidate할 때 너무 많은 조회가 다시 실행된다.
- 반대로 invalidate를 했는데 원하는 화면이 갱신되지 않는다.

그래서 React Query를 배울 때는 `useQuery` 문법보다도, **"이 조회를 어떤 key로 식별할 것인가"를 설계하는 감각**이 더 중요합니다.

**처음 학습할 때 기억할 핵심 한 문장:**

> `useQuery`는 서버 데이터를 읽는 훅이고, `queryKey`는 그 데이터를 캐시에 저장할 주소입니다.

**`useQuery`와 `useState`는 어떻게 다른가요?**

퍼블리셔에서 프론트로 넘어올 때 이 둘을 헷갈리기 쉽습니다. 하지만 관리 대상이 다릅니다.

| 항목               | `useState`                           | `useQuery`                |
| ------------------ | ------------------------------------ | ------------------------- |
| 관리 대상          | 브라우저 안의 로컬 상태              | 서버에서 읽어온 상태      |
| 데이터 출처        | 사용자 입력, 탭 열림 여부, 모달 상태 | API 응답 데이터           |
| 로딩/에러 관리     | 직접 만들어야 함                     | 기본 제공                 |
| 캐시 재사용        | 직접 구현해야 함                     | `queryKey` 기준 자동 처리 |
| 퍼블리셔 관점 비유 | 현재 화면 메모장                     | 서버에서 가져온 공용 문서 |

예를 들어:

- 드롭다운이 열렸는지 닫혔는지 → `useState`
- 현재 입력창에 적힌 문자열 → `useState`
- 사용자 정보, 목록 데이터, 상세 데이터 → `useQuery`

즉, 화면 내부에서만 잠깐 쓰는 값은 `useState`, 서버에서 읽어와 여러 화면에서 다시 쓸 수 있는 값은 `useQuery`라고 구분하면 이해가 빨라집니다.

**함께 보면 좋은 옵션 1개: `enabled`**

`useQuery`는 기본적으로 바로 실행되지만, 어떤 값이 준비된 뒤에만 실행하고 싶을 때 `enabled`를 사용합니다.

```tsx
const { data } = useQuery({
  queryKey: ['hakjong', 'apply', 'status', currentUser.userId],
  queryFn: fetchApplyStatus,
  enabled: !!currentUser.userId,
});
```

- `currentUser.userId`가 없으면 실행하지 않음
- 로그인 정보가 준비된 뒤에만 조회 시작

즉, `enabled`는 "이 query를 지금 실행해도 되는가"를 제어하는 스위치입니다.

#### Step 9-1: 커스텀 훅 → useQuery 직접 호출로 전환

Step 9에서 `useUnivMajorListAndMajorTheme()` 커스텀 훅을 사용했지만, 학습 목적으로 `useQuery`를 직접 호출하는 방식으로 전환했습니다. 이 과정에서 겪은 내용을 정리합니다.

---

##### 변경 전 (커스텀 훅 방식)

```typescript
import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search';

const { data: univMajorData } = useUnivMajorListAndMajorTheme();
```

한 줄로 간결하지만, 내부에서 무슨 일이 일어나는지 보이지 않습니다.

##### 변경 후 (useQuery 직접 호출)

```typescript
import { fetchUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search/api';
import type { UnivMajorList } from '@libs/entities/university-major-search';
import { useQuery } from '@tanstack/react-query';

const {
  data: univMajorData,
  isLoading,
  error,
} = useQuery<UnivMajorList>({
  queryKey: ['hakjong', 'univ-major-list'],
  queryFn: fetchUnivMajorListAndMajorTheme,
  staleTime: 1000 * 60 * 60,
  refetchOnWindowFocus: false,
});
```

---

##### 커스텀 훅의 정체 — 감싸기(wrapper)에 불과하다

`useUnivMajorListAndMajorTheme()`의 실제 코드는 이렇게 되어 있었습니다:

```
libs/entities/university-major-search/model/university-major-search.queries.ts
```

```typescript
export const useUnivMajorListAndMajorTheme = () => {
  return useQuery<UnivMajorList>({
    ...queryOptions.getUnivMajorListAndMajorTheme(),
  });
};
```

즉, **커스텀 훅은 `useQuery`를 한 번 감싼 래퍼(wrapper)**입니다. 내부에서 하는 일은 우리가 직접 호출하는 것과 동일합니다.

```
[커스텀 훅 방식]
useUnivMajorListAndMajorTheme()
  └→ useQuery({ queryKey: [...], queryFn: fetchUnivMajorListAndMajorTheme })
      └→ GET /university-search/category-list
          └→ 응답 데이터를 캐시에 저장

[직접 호출 방식]
useQuery({ queryKey: [...], queryFn: fetchUnivMajorListAndMajorTheme })
  └→ GET /university-search/category-list
      └→ 응답 데이터를 캐시에 저장
```

**결과는 완전히 동일합니다.** 차이는 "누가 설정(queryKey, staleTime 등)을 관리하느냐"입니다.

> **커스텀 훅을 까보는 습관**: 프론트 개발을 배울 때, 커스텀 훅을 "블랙박스"로 두지 말고 내부 코드를 열어보세요. 대부분은 `useQuery`나 `useMutation`을 감싼 것이며, 감싸는 이유는 queryKey와 옵션을 한 곳에서 관리하기 위함입니다.

---

##### import 경로가 달라진 이유 — barrel export

기존에는 이렇게 한 줄로 import했습니다:

```typescript
import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search';
```

이 경로는 `libs/entities/university-major-search/index.ts`를 가리킵니다:

```typescript
// index.ts (barrel export 파일)
export * from './model/university-major-search.queries'; // ← 훅이 여기에 있음 ✅
export * from './model/university-major-search.types'; // ← 타입이 여기에 있음 ✅
// api/index.ts는 re-export 되어 있지 않음 ❌
```

**barrel export란?** `index.ts`에서 `export * from './...'`으로 여러 파일의 export를 모아두는 패턴입니다. 사용하는 쪽에서 폴더 경로만 적으면 그 안의 export를 모두 쓸 수 있습니다.

하지만 `fetchUnivMajorListAndMajorTheme`은 `api/index.ts`에 정의되어 있고, barrel export에 등록되지 않았습니다. 그래서:

```typescript
// ❌ 에러 발생 — barrel export에 없는 항목
import { fetchUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search';
// → '"@libs/entities/university-major-search"'에 내보낸 멤버 'fetchUnivMajorListAndMajorTheme'이(가) 없습니다.

// ✅ 직접 파일 경로로 import
import { fetchUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search/api';
```

| import 대상                       | 경로                                     | 이유                          |
| --------------------------------- | ---------------------------------------- | ----------------------------- |
| `fetchUnivMajorListAndMajorTheme` | `@libs/.../api` (직접 경로)              | barrel export에 등록 안 됨    |
| `UnivMajorList` (타입)            | `@libs/entities/university-major-search` | barrel export에 등록되어 있음 |

> **실무 팁**: barrel export에 없는 것을 import하면 TypeScript가 친절하게 "xxx이(가) 없습니다. yyy이(가) 아닌지 확인하세요."라는 에러를 보여줍니다. 이때 해당 라이브러리의 `index.ts`를 열어 어떤 것이 export되고 있는지 확인하고, 없으면 직접 파일 경로를 사용하면 됩니다.

---

##### `type` import란?

```typescript
import type { UnivMajorList } from '@libs/entities/university-major-search';
```

`import type`은 **타입 정보만 가져오고 런타임 코드에는 포함하지 않겠다**는 의미입니다.

```typescript
// 일반 import — 런타임에도 코드가 포함됨 (함수, 클래스, 상수 등)
import { fetchUnivMajorListAndMajorTheme } from '...';

// type import — 빌드 시 타입 체크에만 사용되고, 실제 JS 번들에는 사라짐
import type { UnivMajorList } from '...';
```

| 구분           | `import`                 | `import type`         |
| -------------- | ------------------------ | --------------------- |
| 런타임에 존재  | ✅                       | ❌ (컴파일 후 제거됨) |
| 번들 크기 영향 | 있음                     | 없음                  |
| 사용 대상      | 함수, 변수, 클래스, 상수 | interface, type alias |

`UnivMajorList`는 TypeScript interface이므로 런타임에 필요하지 않습니다. `import type`을 사용하면 번들에 불필요한 코드가 포함되지 않아 최적화에 도움이 됩니다.

> **언제 `import type`을 써야 하나요?**
>
> - 가져오는 것이 `interface`나 `type`이면 → `import type`
> - 가져오는 것이 함수, 클래스, 상수면 → 일반 `import`
> - 헷갈리면 일반 `import`을 사용해도 동작은 합니다. TypeScript가 필요 시 알려줍니다.

---

##### useQuery 옵션 각각의 의미

```typescript
useQuery<UnivMajorList>({
  queryKey: ['hakjong', 'univ-major-list'],
  queryFn: fetchUnivMajorListAndMajorTheme,
  staleTime: 1000 * 60 * 60,
  refetchOnWindowFocus: false,
});
```

**① `queryKey` — 캐시 식별자 (주소)**

```typescript
queryKey: ['hakjong', 'univ-major-list'];
```

이 키로 React Query 캐시에 데이터가 저장됩니다. 기존 커스텀 훅은 `['getUnivMajorListAndMajorTheme']`이라는 키를 사용했고, 직접 호출에서는 `['hakjong', 'univ-major-list']`로 지정했습니다. 키가 다르면 **별도의 캐시 항목**으로 관리됩니다.

> 같은 앱에서 기존 훅과 새 `useQuery`를 동시에 사용하면 같은 API를 두 번 호출하게 됩니다. 이 앱(`early`)에서는 기존 훅을 사용하지 않으므로 문제없습니다.

**② `queryFn` — 데이터를 가져오는 함수**

```typescript
queryFn: fetchUnivMajorListAndMajorTheme;
```

이것은 아래 축약형입니다:

```typescript
queryFn: () => fetchUnivMajorListAndMajorTheme();
```

파라미터가 없는 함수이므로 함수 참조를 직접 전달할 수 있습니다. React Query가 적절한 시점에 이 함수를 호출합니다.

**`fetchUnivMajorListAndMajorTheme`의 실제 동작:**

```typescript
// libs/entities/university-major-search/api/index.ts
export const fetchUnivMajorListAndMajorTheme = async (): Promise<UnivMajorList> => {
  const data = await apiClient()
    .get('university-search/category-list') // GET 요청
    .json<UnivMajorList>(); // JSON 파싱 + 타입 지정
  return data;
};
```

이 함수가 반환하는 데이터 구조:

```typescript
interface UnivMajorList {
  universities: UniversityOption[]; // 대학 목록
  minorMajorCategories: MinorMajorCategory[]; // 학과 목록
  majorThemes: MajorTheme[]; // 계열 테마 목록
}
```

**③ `staleTime` — 데이터 신선도 유지 시간**

```typescript
staleTime: 1000 * 60 * 60; // 1시간 = 3,600,000밀리초
```

| staleTime 상태       | 의미                 | React Query 동작                                  |
| -------------------- | -------------------- | ------------------------------------------------- |
| `fresh` (1시간 이내) | 데이터가 아직 신선함 | 캐시에서 즉시 반환, API 재호출 **안 함**          |
| `stale` (1시간 경과) | 데이터가 오래됨      | 캐시에서 우선 반환하되, 백그라운드에서 API 재호출 |

대학/학과 목록은 자주 바뀌지 않으므로 1시간으로 설정했습니다.

```
[0분]  첫 방문 → API 호출 → 데이터 캐시 (fresh)
[30분] 페이지 재방문 → 캐시에서 즉시 반환 (아직 fresh, API 안 부름)
[61분] 페이지 재방문 → 캐시에서 즉시 반환 + 백그라운드 API 재호출 (stale)
```

**④ `refetchOnWindowFocus` — 탭 전환 시 재호출 여부**

```typescript
refetchOnWindowFocus: false;
```

| 값              | 동작                                      |
| --------------- | ----------------------------------------- |
| `true` (기본값) | 다른 탭에서 돌아올 때 자동으로 API 재호출 |
| `false`         | 탭 전환해도 재호출하지 않음               |

대학 목록은 사용자가 탭을 왔다갔다 한다고 바뀌지 않으므로, `false`로 불필요한 요청을 방지합니다.

---

##### 반환값 구조분해 — 기존 vs 변경

**기존 (커스텀 훅):**

```typescript
const { data: univMajorData } = useUnivMajorListAndMajorTheme();
```

`data`만 꺼냈으므로 로딩 중인지, 에러가 났는지 알 수 없었습니다.

**변경 후 (직접 호출):**

```typescript
const {
  data: univMajorData,  // 성공 시 응답 데이터 (UnivMajorList | undefined)
  isLoading,             // 첫 로딩 중이면 true
  error,                 // 에러 발생 시 Error 객체
} = useQuery<UnivMajorList>({ ... });
```

`useQuery`가 반환하는 주요 값들:

| 값           | 타입                         | 설명                                              |
| ------------ | ---------------------------- | ------------------------------------------------- |
| `data`       | `UnivMajorList \| undefined` | API 응답 데이터. 로딩 중이면 `undefined`          |
| `isLoading`  | `boolean`                    | 캐시에 데이터가 없고, 첫 요청 진행 중일 때 `true` |
| `isFetching` | `boolean`                    | 백그라운드 포함 모든 요청 진행 중일 때 `true`     |
| `isError`    | `boolean`                    | 에러 발생 시 `true`                               |
| `error`      | `Error \| null`              | 에러 객체                                         |
| `isSuccess`  | `boolean`                    | 데이터를 성공적으로 받았을 때 `true`              |

**`isLoading` vs `isFetching` 차이:**

```
[첫 방문]
  isLoading: true   ← 캐시 비어있음 + 요청 중
  isFetching: true

[staleTime 경과 후 재방문]
  isLoading: false  ← 캐시에 이전 데이터 있음 (즉시 표시)
  isFetching: true  ← 백그라운드에서 최신 데이터 요청 중
```

`isLoading`은 "화면에 보여줄 데이터가 아예 없는 첫 로딩"이고, `isFetching`은 "백그라운드에서 최신 데이터를 가져오는 중"을 포함합니다. 로딩 스피너를 표시할 때는 보통 `isLoading`을 사용합니다.

---

##### 제네릭 `<UnivMajorList>` — 타입 안전성

```typescript
useQuery<UnivMajorList>({ ... })
```

이 제네릭 덕분에 `data`의 타입이 `UnivMajorList | undefined`로 자동 추론됩니다:

```typescript
univMajorData?.universities; // ✅ UniversityOption[] 자동 추론
univMajorData?.universities[0].universityName; // ✅ string
univMajorData?.foo; // ❌ 타입 에러 — UnivMajorList에 foo 없음
```

제네릭을 생략하면 `data`가 `unknown`이 되어, 데이터를 사용할 때마다 타입 단언(`as`)이 필요해집니다.

---

##### 커스텀 훅 vs 직접 호출 — 언제 어떤 걸 쓸까?

| 항목                | 커스텀 훅                              | useQuery 직접 호출                    |
| ------------------- | -------------------------------------- | ------------------------------------- |
| **코드 양**         | 1줄                                    | 7줄                                   |
| **설정 투명성**     | 내부에 숨겨짐                          | queryKey, staleTime 등 직접 확인 가능 |
| **로딩/에러 접근**  | 별도 구조분해 필요                     | 바로 `isLoading`, `error` 사용 가능   |
| **queryKey 커스텀** | 불가 (훅 내부에 고정)                  | 자유롭게 설정 가능                    |
| **재사용성**        | 여러 곳에서 동일 설정으로 사용 시 유리 | 한 곳에서만 사용 시 적합              |
| **학습 가치**       | React Query 동작 이해 어려움           | 동작 원리를 명시적으로 이해 가능      |

**실무 선택 기준:**

- 같은 API 조회를 여러 컴포넌트에서 사용 → **커스텀 훅** (설정 중복 방지)
- 한 컴포넌트에서만 사용하고 설정을 세밀하게 제어 → **직접 호출**
- 학습 중이라 React Query 동작을 이해하고 싶다 → **직접 호출** (추천)

> 커스텀 훅은 "편의를 위한 래퍼"이지 "필수"가 아닙니다. React Query의 동작 원리를 충분히 이해한 뒤에 커스텀 훅으로 감싸도 늦지 않습니다. 학습 단계에서는 직접 호출을 통해 각 옵션의 역할을 체감하는 것이 더 효과적입니다.

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

## Phase 4: 서버로 데이터 전송하기 (POST 요청)

### 개요: 데이터 전송 전체 흐름

```
[사용자 입력]
  Dropdown 선택 + Textarea(TextInput) 작성
           ↓
[유효성 검사]
  handleSubmit() — 미선택/미입력 시 alert 후 중단
           ↓
[useMutation 호출]
  submitApply(requestData)
           ↓
[API 함수 실행]
  POST /hakjong/apply  ← HTTP 요청 (JSON body)
           ↓
[서버 응답 수신]
  { applyId: 'HAKJONG-2026-001' }
           ↓
[확인 페이지 이동]
  router.push('/hakjong/apply/confirm?applyId=...&...')
```

---

### Step 14: 타입 정의 — 서버에 보낼 데이터 형태 설계

API 연동 전, 서버와 주고받을 데이터 구조를 TypeScript interface로 먼저 정의합니다.

```
apps/early/src/entities/hakjong/model/hakjong.types.ts
```

```typescript
// 서버로 보낼 요청 데이터 형태
export interface HakjongApplyRequest {
  universityId: string; // 대학 ID (예: "101")
  universityName: string; // 대학명 (예: "서울대학교")
  majorType: string; // 계열 코드 (예: "인문")
  majorTypeName: string; // 계열명 (예: "인문계")
  minorMajorCategoryCode: string; // 학과 코드 (예: "C12")
  minorMajorCategoryName: string; // 학과명 (예: "경영학과")
  selfIntroduction: string; // 자기소개서
  activityReport: string; // 활동보고서
}

// 서버에서 받을 응답 데이터 형태
export interface HakjongApplyResponse {
  applyId: string; // 서버가 발급한 신청 번호 (예: "HAKJONG-2026-001")
}
```

> **왜 타입을 먼저 정의하나요?**
> 서버와 협의한 API 스펙(Swagger)이 있다면, 그 스펙을 TypeScript interface로 먼저 옮겨둡니다.
> 이후 API 함수, mutation 훅, 컴포넌트를 만들 때 타입이 잘못 연결되면 개발 단계에서 에러로 알려줍니다.

---

### Step 15: API 함수 — HTTP 요청 작성

```
apps/early/src/entities/hakjong/api/index.ts
```

```typescript
import apiClient from '@/shared/api';
import { HakjongApplyRequest, HakjongApplyResponse } from '../model/hakjong.types';

export const submitHakjongApply = async (requestData: HakjongApplyRequest): Promise<HakjongApplyResponse> => {
  const data = await apiClient()
    .post('hakjong/apply', { json: requestData }) // ① POST 요청 + JSON body
    .json<HakjongApplyResponse>(); // ② 응답을 JSON으로 파싱
  return data;
};
```

**각 줄 상세 설명:**

| 코드                            | 의미                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `apiClient()`                   | 프로젝트 공통 HTTP 클라이언트(ky) 인스턴스를 반환. 기본 URL, 인증 헤더가 자동 설정됨                        |
| `.post('hakjong/apply', ...)`   | `POST {API_URL}/hakjong/apply` 요청 전송                                                                    |
| `{ json: requestData }`         | requestData 객체를 JSON으로 직렬화하여 request body에 담음. `Content-Type: application/json` 헤더 자동 추가 |
| `.json<HakjongApplyResponse>()` | 응답 body를 JSON으로 파싱하고 `HakjongApplyResponse` 타입으로 반환                                          |

> **ky HTTP 클라이언트란?**
> `fetch`를 기반으로 만들어진 경량 HTTP 라이브러리입니다. axios와 유사하지만 더 가볍습니다.
> 프로젝트 내 `@libs/api`에서 `apiClientFor(url)`로 공통 클라이언트를 반환합니다. 환경(로컬/개발/운영)에 따라 baseURL이 자동 설정됩니다.

**브라우저 Network 탭에서 보이는 실제 요청:**

```
POST https://api.jinhak.com/jh/high3/early/hakjong/apply
Content-Type: application/json

{
  "universityId": "101",
  "universityName": "서울대학교",
  "majorType": "인문",
  "majorTypeName": "인문계",
  "minorMajorCategoryCode": "C12",
  "minorMajorCategoryName": "경영학과",
  "selfIntroduction": "...",
  "activityReport": "..."
}
```

---

### Step 16: useMutation 훅 — 서버 요청의 생명주기 관리

```
apps/early/src/entities/hakjong/model/hakjong.queries.ts
```

```typescript
import { useMutation } from '@tanstack/react-query';
import { submitHakjongApply } from '../api';
import { HakjongApplyRequest, HakjongApplyResponse } from './hakjong.types';

export function useHakjongApplyMutation() {
  return useMutation<HakjongApplyResponse, Error, HakjongApplyRequest>({
    mutationFn: (requestData) => submitHakjongApply(requestData),
    onError: (error) => {
      console.error('학종 신청 실패:', error);
      alert('신청에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
```

**useQuery vs useMutation 차이:**

| 구분        | `useQuery`              | `useMutation`                                   |
| ----------- | ----------------------- | ----------------------------------------------- |
| HTTP 메서드 | GET (데이터 조회)       | POST / PUT / DELETE (데이터 변경)               |
| 실행 시점   | 컴포넌트 마운트 시 자동 | 명시적으로 `mutate()` / `mutateAsync()` 호출 시 |
| 자동 재실행 | 있음 (캐시 만료 시 등)  | 없음                                            |
| 사용 예     | 목록 조회, 사용자 정보  | 저장, 수정, 삭제                                |

한 줄로 정리하면 다음과 같습니다.

- `useQuery`는 서버 상태를 **읽는 훅**입니다.
- `useMutation`은 서버 상태를 **바꾸는 훅**입니다.

퍼블리셔 관점에서 비유하면, `useQuery`는 "화면에 보여줄 데이터를 읽어오는 것"이고 `useMutation`은 "사용자 행동으로 서버에 저장/수정/삭제를 요청하는 것"입니다.

**실무에서 더 중요한 차이:**

| 항목               | `useQuery`                           | `useMutation`                 |
| ------------------ | ------------------------------------ | ----------------------------- |
| 목적               | 서버 데이터 조회                     | 서버 데이터 변경              |
| 자동 실행          | O                                    | X                             |
| 캐시 재사용        | O                                    | 직접 캐시 갱신 필요           |
| `queryKey`         | 필수                                 | 없음                          |
| SSR/초기 데이터    | 잘 맞음                              | 거의 사용하지 않음            |
| 잘 어울리는 트리거 | 페이지 진입, 탭 진입, 조건 충족 시점 | 버튼 클릭, 폼 제출, 삭제 액션 |

**왜 `useQuery`는 캐시가 중요하고, `useMutation`은 invalidate가 중요할까?**

- `useQuery`는 같은 `queryKey`로 조회한 데이터를 캐시에 저장해 재사용합니다.
- 그래서 같은 화면을 다시 보거나, 다른 컴포넌트가 같은 데이터를 요청할 때 네트워크 요청을 줄일 수 있습니다.
- 반대로 `useMutation`은 "변경 요청" 자체를 캐시하는 훅이 아닙니다.
- 대신 mutation이 성공한 뒤 관련 `useQuery` 캐시를 다시 조회하도록 `invalidateQueries()`를 호출해 화면 데이터를 최신 상태로 맞춥니다.

```typescript
const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  },
});
```

> 이 과정을 빼먹으면 서버에서는 삭제됐는데 화면 목록에는 그대로 남아 있는 버그가 생길 수 있습니다.

**언제 무엇을 써야 하나요?**

- 페이지가 열리면 자동으로 데이터를 가져와야 한다 → `useQuery`
- 목록, 상세, 사용자 정보처럼 "보여주기용 데이터"다 → `useQuery`
- 버튼 클릭 후 저장/수정/삭제가 일어난다 → `useMutation`
- 폼 제출 결과에 따라 다음 페이지로 이동해야 한다 → `useMutation`

**이 프로젝트에 대입하면:**

- 대학/계열/학과 목록 조회: 페이지 렌더링에 필요한 읽기 작업이므로 `useQuery`
- 학종 신청서 제출: 사용자의 명시적 액션으로 서버 데이터를 생성하므로 `useMutation`

즉, 이 프로젝트에서 `useMutation`을 쓴 이유는 "신청서 제출"이 단순 조회가 아니라 서버 상태를 바꾸는 쓰기 작업이기 때문입니다.

**흔한 실수 3가지:**

- 조회 API인데 `useMutation`으로 감싸는 것
- 저장 API인데 `useQuery`로 자동 실행시키는 것
- mutation 성공 후 관련 query를 갱신하지 않는 것

**`useMutation`이 반환하는 주요 값들:**

```typescript
const {
  mutateAsync, // 호출하면 API 요청 실행 (async/await 가능)
  isPending, // 요청 진행 중이면 true (버튼 비활성화 등에 활용)
  isSuccess, // 요청 성공 시 true
  isError, // 요청 실패 시 true
  data, // 성공 시 응답 데이터
  error, // 실패 시 에러 객체
} = useHakjongApplyMutation();
```

**`mutate` vs `mutateAsync` 선택 기준:**

```typescript
// mutate: 콜백 기반 (응답을 직접 사용하지 않을 때)
mutate(data, {
  onSuccess: (res) => router.push(`/confirm?id=${res.applyId}`),
});

// mutateAsync: 비동기 함수로 반환값 직접 사용 가능 (handleSubmit처럼 try/catch 패턴)
const response = await mutateAsync(data);
router.push(`/confirm?id=${response.applyId}`);
```

> 이 프로젝트에서는 `mutateAsync`를 사용해 응답 값(`applyId`)을 받아 확인 페이지 URL에 포함했습니다.

둘 다 결국 같은 mutation을 실행하지만, **응답을 다루는 방식**이 다릅니다.

| 항목           | `mutate`                     | `mutateAsync`                          |
| -------------- | ---------------------------- | -------------------------------------- |
| 반환값         | 없음 (`void`)                | Promise 반환                           |
| 결과 처리 방식 | `onSuccess`, `onError` 콜백  | `await`, `try/catch`                   |
| 어울리는 상황  | 버튼 클릭 후 토스트만 띄우기 | 제출 후 이동, 후속 API 호출, 조건 분기 |
| 코드 흐름      | 이벤트 안에 콜백 중첩 가능   | 위에서 아래로 순차적으로 읽힘          |

**실무 판단 기준은 단순합니다.**

- 성공 후 할 일이 단순하고, 반환값을 직접 쓸 필요가 없다 → `mutate`
- 성공 응답을 받아 다음 로직을 이어서 실행해야 한다 → `mutateAsync`
- `handleSubmit`처럼 이미 `async` 함수 안에서 흐름을 제어 중이다 → `mutateAsync`

**비유하면:**

- `mutate`는 "저장 버튼만 누르고, 결과가 오면 콜백으로 처리"하는 방식입니다.
- `mutateAsync`는 "저장 끝날 때까지 기다렸다가, 결과를 손에 들고 다음 행동으로 넘어가는" 방식입니다.

```typescript
try {
  const response = await mutateAsync(formData);
  alert('저장 완료');
  router.push(`/confirm?id=${response.applyId}`);
} catch (error) {
  alert('저장 실패');
}
```

> 폼 제출, 결제 요청, 생성 후 상세 페이지 이동처럼 "성공 응답값이 다음 화면 흐름을 결정"하는 경우에는 `mutateAsync`가 더 자연스럽습니다.

---

### Step 16-1: useMutation 더 깊이 — 제네릭 3개, 콜백 순서, "조회인데 useMutation"

> Step 16에서 본 `useMutation` 훅을 한 단계 더 파고드는 보강 노트입니다.
> Step 9-1에서 `useQuery`를 직접 까봤던 것처럼, 여기서는 `useMutation`의 제네릭·콜백·예외적 용법까지 열어봅니다.

#### ① 제네릭 3개의 의미 — `<TData, TError, TVariables>`

Step 16의 훅은 꺾쇠(`<>`) 안에 타입 3개를 **순서대로** 받습니다. 이 순서가 곧 의미입니다.

```typescript
useMutation<
  HakjongApplyResponse,   // ① TData      - 성공 시 mutationFn이 resolve하는 값 → data로 받음
  Error,                  // ② TError     - 실패 시 error 타입
  HakjongApplyRequest     // ③ TVariables - mutate()에 넘길 인자 타입 → mutationFn의 인자
>({
  mutationFn: (requestData) => submitHakjongApply(requestData),
  onError: (error) => {
    console.error('학종 신청 실패:', error);
    alert('신청에 실패했습니다. 다시 시도해주세요.');
  },
});
```

| 제네릭 | 이름         | 무엇을 정하나                          | 어디서 만나나                       |
| ------ | ------------ | -------------------------------------- | ----------------------------------- |
| ①      | `TData`      | 성공 응답 타입                         | `const { data } = ...`              |
| ②      | `TError`     | 실패 시 에러 타입                      | `onError(error)`, `const { error }` |
| ③      | `TVariables` | `mutate()`에 넘기는 인자 타입          | `mutate(③)` → `mutationFn(③)`       |

**핵심 흐름 한 줄:** `mutate(③ TVariables)` → `mutationFn(③)` 실행 → 성공하면 `① TData`, 실패하면 `② TError`.

```
submitApply({ universityId, ... })   ← ③ TVariables 를 넘김
        ↓
mutationFn(requestData)              ← 그대로 mutationFn 인자로 흘러들어감
        ↓
 ┌ 성공 → response: ① TData (HakjongApplyResponse)
 └ 실패 → error: ② TError (Error)
```

> `mutationFn`은 **Promise를 반환하는 함수 하나**만 필수입니다. 나머지(`onError`, `onSuccess` 등)는 전부 옵션입니다.
> 제네릭을 생략하면 타입 추론이 약해져 `data`/`variables`가 모호해지므로, 가능하면 3개를 명시하는 편이 안전합니다.

#### ② 콜백 옵션과 실행 순서

mutation 한 번이 실행되면 콜백들이 **정해진 순서**로 호출됩니다. Step 16의 훅은 `mutationFn` + `onError`만 썼지만, 실무에서는 나머지도 자주 등장합니다.

```typescript
useMutation({
  mutationFn,                      // 1. 실제 비동기 작업 (POST 등)
  onMutate,                        // 2. mutationFn 직전 (낙관적 업데이트 준비)
  onSuccess: (data, vars) => {},   // 3a. 성공 시
  onError:   (err, vars)  => {},   // 3b. 실패 시
  onSettled: () => {},             // 4. 성공/실패 무관하게 마지막
});
```

```
mutate() 호출
   ↓
onMutate            (요청 직전 — 화면을 미리 바꾸는 낙관적 업데이트용)
   ↓
mutationFn          (서버 요청)
   ↓
 ┌ 성공 → onSuccess
 └ 실패 → onError
   ↓
onSettled           (항상 마지막에 실행 — 로딩 정리 등)
```

- 성공 후 관련 `useQuery` 캐시를 새로 고치는 작업은 보통 `onSuccess`에서 `queryClient.invalidateQueries()`로 합니다. (Step 16의 invalidate 설명과 같은 맥락)
- `onMutate`는 "서버 응답이 오기 전에 화면을 먼저 바꿔두고, 실패하면 되돌리는" 낙관적 업데이트에 쓰입니다. 처음에는 몰라도 되고, `mutationFn` + `onSuccess`/`onError`부터 익히면 충분합니다.

#### ③ 반전 포인트 — "조회(GET)인데 useMutation을 쓰는 경우"

`useMutation`은 꼭 "데이터 변경(POST/PUT/DELETE)"일 때만 쓰는 게 아닙니다.
**사용자 액션에 의해 명시적으로 / 순서대로 실행하고 싶을 때**도 선택지가 됩니다.

대표 사례가 바로 **대학 → 계열 → 학과로 이어지는 cascade(연쇄) 드롭다운**입니다. 같은 화면에서도 조회 성격에 따라 훅이 갈립니다.

```typescript
useUniversityList     // useQuery    ← 페이지 진입 시 한 번 자동으로 받으면 됨
useAiBdListMutation   // useMutation ← 대학을 "골랐을 때" 계열을 명령형으로 조회
useMajorListMutation  // useMutation ← 계열을 "골랐을 때" 학과를 명령형으로 조회
```

| 조회 성격                | 어울리는 훅   | 이유                                        |
| ------------------------ | ------------- | ------------------------------------------- |
| 페이지 진입 시 자동      | `useQuery`    | 렌더되면 알아서 돈다 (선언적)               |
| 사용자가 고른 순간에만   | `useMutation` | `mutate()`를 부를 때 돈다 (명령형), 순서 제어가 쉬움 |

> `useQuery`도 `enabled`로 조건 실행이 가능합니다(Step 9의 `enabled` 참고).
> 하지만 "대학 선택 → 계열 → 학과"처럼 **상위 선택에 따라 단계적으로 트리거**되는 흐름은,
> `queryKey` 변경에 반응해 자동으로 도는 `useQuery`보다 "내가 부를 때 도는" `useMutation`이 더 직관적입니다.
> (앞서 만든 `/cascade-dropdown-api` 예시에서 단계마다 fetch를 직접 호출한 것과 같은 맥락입니다.)

#### 한 줄 요약

> `useMutation`은 렌더되면 자동으로 도는 `useQuery`와 달리, 내가 `mutate()`를 불러야 도는 함수 +
> 로딩(`isPending`)·에러 상태를 공짜로 얹어주는 도구입니다.
> POST/PUT/DELETE뿐 아니라 **"명령형으로 순서를 제어해야 하는 조회"**에도 쓴다는 점까지 기억하면 활용 폭이 넓어집니다.

---

### Step 17: 컴포넌트에서 조립 — handleSubmit 작성

`EarlyHakjongApply.tsx`에서 mutation 훅을 연결합니다.

```typescript
// 1. 훅 사용
const { mutateAsync: submitApply, isPending } = useHakjongApplyMutation();

// 2. TextInput 제어 컴포넌트화 (value + onChange 연결)
const [selfIntroduction, setSelfIntroduction] = useState('');
const [activityReport, setActivityReport] = useState('');

// 3. 제출 핸들러
const handleSubmit = async () => {
  const { drop1, drop2, drop3 } = selectedOption;

  // ① 유효성 검사 — 모든 항목이 선택/입력됐는지 확인
  if (!drop1.value || !drop2.value || !drop3.value) {
    alert('대학, 계열, 학과를 모두 선택해주세요.');
    return;
  }
  if (!selfIntroduction.trim() || !activityReport.trim()) {
    alert('모든 입력 항목을 작성해주세요.');
    return;
  }

  // ② 서버로 데이터 전송
  const response = await submitApply({
    universityId: drop1.value,
    universityName: drop1.label,
    majorType: drop2.value,
    majorTypeName: drop2.label,
    minorMajorCategoryCode: drop3.value,
    minorMajorCategoryName: drop3.label,
    selfIntroduction,
    activityReport,
  });

  // ③ 서버 응답값(applyId)과 선택 정보를 URL에 담아 확인 페이지로 이동
  const params = new URLSearchParams({
    applyId: response.applyId,
    universityName: drop1.label,
    majorTypeName: drop2.label,
    minorMajorCategoryName: drop3.label,
  });
  router.push(`/hakjong/apply/confirm?${params.toString()}`);
};
```

**`URLSearchParams`란?**

URL의 쿼리스트링을 안전하게 만드는 내장 Web API입니다.

```typescript
const params = new URLSearchParams({
  applyId: 'HAKJONG-2026-001',
  universityName: '서울대학교',
});
params.toString();
// → "applyId=HAKJONG-2026-001&universityName=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90"
// 한글 등 특수문자가 자동으로 URL 인코딩됨
```

**TextInput 제어 컴포넌트:**

```tsx
// 비제어 컴포넌트 (before) — 값을 직접 읽을 수 없음
<TextInput addId="intro" label="자기소개서" />

// 제어 컴포넌트 (after) — value와 onChange로 React가 값을 추적
<TextInput
  addId="intro"
  label="자기소개서"
  value={selfIntroduction}
  onChange={(e) => setSelfIntroduction(e.target.value)}
/>
```

> **제어 컴포넌트(Controlled Component)**: `value` prop으로 현재 값을 React state에서 가져오고, `onChange`로 state를 업데이트합니다. React가 항상 최신 값을 알고 있어 `handleSubmit` 시 state를 그대로 읽으면 됩니다.

---

### Step 18: 확인 페이지 — URL 파라미터로 데이터 전달

```
apps/early/app/(early)/hakjong/apply/confirm/page.tsx
apps/early/src/window/hakjong/EarlyHakjongConfirm.tsx
```

확인 페이지는 서버 재요청 없이, URL 쿼리스트링에서 값을 읽어 표시합니다.

```typescript
// EarlyHakjongConfirm.tsx
'use client';
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const applyId = searchParams.get('applyId') ?? '';
const universityName = searchParams.get('universityName') ?? '';
```

> **`useSearchParams()`**: 현재 URL의 `?key=value` 쿼리스트링을 읽는 Next.js 훅입니다. `searchParams.get('key')`로 특정 파라미터 값을 가져옵니다.

---

### Step 19: MSW로 로컬 임시 목 API 만들기

Swagger(실제 API)가 준비되기 전, **MSW(Mock Service Worker)**를 사용해 브라우저가 실제 서버 없이도 `POST /hakjong/apply`를 처리하게 만듭니다.

**MSW 동작 원리:**

```
[브라우저]
  fetch POST /hakjong/apply
        ↓
[Service Worker가 가로챔] ← msw가 브라우저에 등록한 워커
        ↓
[handlers.ts 에서 매칭되는 핸들러 실행]
  http.post(/\/hakjong\/apply/, () => HttpResponse.json(...))
        ↓
[목 응답 반환] → 실제 서버로는 요청이 나가지 않음
```

**① 목데이터 추가** (`apps/mock/specs/mocks/mockdata.ts`)

```typescript
export const hakjongApplyResponse = {
  applyId: 'HAKJONG-2026-001',
};
```

**② 핸들러 추가** (`apps/mock/specs/mocks/handlers.ts`)

```typescript
import { hakjongApplyResponse } from './mockdata';

export const handlers = [
  // ...기존 핸들러들...

  // 학종 신청 제출
  http.post(/.*\/hakjong\/apply/, () => {
    return HttpResponse.json(hakjongApplyResponse);
  }),
];
```

**③ early 앱에서 MSW 활성화되는 경로:**

```
apps/early/app/layout.tsx
  → MockProviders (apps/mock/src/app/providers/MockProviders.tsx)
    → process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' 일 때만 MSW 시작
      → specs/mocks/client.ts (브라우저) / server.ts (SSR)
        → handlers.ts (핸들러 목록)
```

**실제 API 연동 시 교체 포인트:**

MSW 핸들러를 제거하거나 주석 처리하면 자동으로 실제 서버에 요청합니다. API 함수(`submitHakjongApply`)는 변경할 필요가 없습니다.

```typescript
// 추후 실제 API 연동 시: 핸들러만 주석 처리
// http.post(/.*\/hakjong\/apply/, () => {
//   return HttpResponse.json(hakjongApplyResponse);
// }),
```

---

### Phase 4 정리: 서버 데이터 전송 레이어 구조

```
[컴포넌트] EarlyHakjongApply.tsx
  → useState로 입력값 관리
  → handleSubmit에서 유효성 검사 후 mutateAsync 호출

[Mutation 훅] entities/hakjong/model/hakjong.queries.ts
  → useMutation 래핑
  → isPending, onError 등 생명주기 제공

[API 함수] entities/hakjong/api/index.ts
  → ky HTTP 클라이언트로 POST 요청
  → 타입 안전한 요청/응답 처리

[MSW 핸들러] apps/mock/specs/mocks/handlers.ts  ← 로컬 개발 시에만 동작
  → 실제 서버 없이 목 응답 반환

[실제 서버]  ← 운영/개발 서버 배포 이후 자동으로 연결됨
```

**React Query 흐름까지 포함해 다시 보면:**

```
[조회]
  useQuery
  → 서버 데이터 읽기
  → 캐시에 저장
  → 화면 렌더링

[변경]
  useMutation
  → 서버 데이터 저장/수정/삭제
  → 성공/실패 상태 반환

[동기화]
  invalidateQueries
  → 관련 useQuery 다시 조회
  → 화면 최신화
```

즉, React Query를 쓸 때 핵심은 `조회(useQuery)`와 `변경(useMutation)`을 나누고, **변경 이후에는 필요한 조회를 다시 동기화하는 것**입니다.

| 새로 배운 핵심 개념 | 설명                                                            |
| ------------------- | --------------------------------------------------------------- |
| `useQuery`          | GET 요청으로 서버 데이터를 읽고 캐시하는 훅                     |
| `useMutation`       | POST/PUT/DELETE 요청의 생명주기(pending, success, error)를 관리 |
| `mutateAsync`       | async/await로 응답값을 직접 사용할 때                           |
| `invalidateQueries` | mutation 이후 관련 query를 다시 조회시켜 화면을 최신화          |
| 제네릭 3개          | `useMutation<TData, TError, TVariables>` — 성공/에러/인자 타입을 순서대로 지정 (Step 16-1) |
| 콜백 실행 순서      | `onMutate → mutationFn → onSuccess/onError → onSettled` (Step 16-1) |
| 명령형 조회         | cascade처럼 순서 제어가 필요한 조회는 GET이라도 `useMutation`으로 (Step 16-1) |
| `isPending`         | 요청 중 버튼 비활성화 등 UX 처리에 활용                         |
| 제어 컴포넌트       | `value` + `onChange`로 React가 입력값 추적                      |
| `URLSearchParams`   | 한글 포함 데이터를 URL 쿼리스트링으로 안전하게 인코딩           |
| `useSearchParams`   | URL 쿼리스트링 값을 읽는 Next.js 훅                             |
| MSW handler         | `http.post(정규식, handler)` 패턴으로 API 목업 등록             |

```
apps/early/src/window/hakjong/
├── EarlyHakjongNavigator.tsx   ← 탭 네비게이터 (접근 제어 포함)
├── EarlyHakjongIntro.tsx       ← 서비스 안내 페이지 컴포넌트
├── EarlyHakjongApply.tsx            ← 평가 신청 페이지 컴포넌트
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

| 구분      | 서버 컴포넌트 (기본)              | 클라이언트 컴포넌트 (`'use client'`)                 |
| --------- | --------------------------------- | ---------------------------------------------------- |
| 실행 위치 | 서버에서만 실행                   | 브라우저에서 실행                                    |
| 사용 가능 | DB 접근, 파일 읽기                | useState, useEffect, onClick 등                      |
| 사용 불가 | useState, onClick 등 브라우저 API | 서버 전용 API (cookies, fs 등)                       |
| 파일 예시 | `layout.tsx`, `page.tsx`          | `EarlyHakjongApply.tsx`, `EarlyHakjongNavigator.tsx` |

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

6. **`useSearchParams()`는 반드시 `Suspense` 안에서 사용**
   - `useSearchParams()`를 사용하는 컴포넌트를 `Suspense` 없이 렌더링하면 빌드/런타임 오류 발생
   - page.tsx에서 `<Suspense>`로 감싸는 것이 기본 패턴

---

## Phase 5: 수정하기 — 페이지 간 데이터 전달 (두 가지 방식 비교)

### 개요: 왜 페이지 간 데이터 전달이 필요한가?

신청 페이지 → 확인 페이지 → 다시 신청 페이지(수정하기)로 이동할 때, **이전에 입력했던 값을 유지**해야 합니다. 하지만 페이지를 이동하면 컴포넌트가 언마운트되고 `useState`의 값이 사라집니다.

```
[신청 페이지] EarlyHakjongApply.tsx
  useState: universityId, selfIntroduction, ...
           ↓ 페이지 이동
           ↓ 컴포넌트 언마운트 → useState 값 사라짐 ❌
           ↓
[확인 페이지] EarlyHakjongConfirm.tsx
  새로운 컴포넌트 마운트
```

이를 해결하는 방법은 크게 두 가지입니다:

| 방법                       | 저장 위치       | 특징                                         |
| -------------------------- | --------------- | -------------------------------------------- |
| **방법 1: URL 쿼리스트링** | URL (주소창)    | 간단, 링크 공유 가능, 데이터 노출            |
| **방법 2: sessionStorage** | 브라우저 저장소 | 데이터 은닉, 길이 제한 없음, 탭 간 공유 불가 |

---

## 방법 1: URL 쿼리스트링 방식

### 개요: URL 쿼리스트링을 사용한 전체 흐름

```
[신청 페이지] EarlyHakjongApply.tsx
  사용자 입력 (Dropdown 3개 + TextInput 2개)
           ↓ "입력완료" 클릭
  handleSubmit() → 서버 전송 성공
           ↓
  URLSearchParams에 전체 입력값 + applyId 담아서 이동
  → /hakjong/apply/confirm?applyId=...&universityId=...&selfIntroduction=...
           ↓
[확인 페이지] EarlyHakjongConfirm.tsx
  useSearchParams()로 URL에서 모든 값 읽기 → 화면 표시
           ↓ "수정하기" 클릭
  기존 입력값을 다시 URLSearchParams로 만들어
  /hakjong/apply?universityId=...&selfIntroduction=... 로 이동
           ↓
[신청 페이지] EarlyHakjongApply.tsx
  useSearchParams()로 URL 파라미터 읽기
  → useState 초기값으로 복원 → 이전 입력값 그대로 표시됨
```

---

### Step 20-A: 확인 페이지로 전체 입력값 전달 (URLSearchParams)

`handleSubmit`에서 서버 전송 성공 후, `URLSearchParams`에 모든 값을 넣어 확인 페이지로 이동합니다.

```typescript
const response = await submitApply({ ... });

// 화면 표시용 + 수정하기 복원용 전체 데이터를 URL에 포함
const params = new URLSearchParams({
  applyId: response.applyId,
  universityId: drop1.value,           // Dropdown 복원용 value
  universityName: drop1.label,         // 화면 표시용 label
  majorType: drop2.value,
  majorTypeName: drop2.label,
  minorMajorCategoryCode: drop3.value,
  minorMajorCategoryName: drop3.label,
  selfIntroduction,
  activityReport,
});
router.push(`/hakjong/apply/confirm?${params.toString()}`);
```

**실제 브라우저 주소창:**

```
/hakjong/apply/confirm?applyId=HAKJONG-001&universityId=101&universityName=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90&selfIntroduction=%EC%A0%80%EB%8A%94...
```

> **왜 `label`뿐 아니라 `value`도 전달하나요?**
>
> Dropdown의 표시 텍스트(`label`)만으로는 화면 표시는 가능하지만, Dropdown의 **선택 상태를 복원**하려면 `value`가 필요합니다.
> 예: `<DropDown value="101" />`처럼 `value`를 prop으로 넘겨야 선택된 상태로 렌더링됩니다.

**`URLSearchParams`란?**

URL 쿼리스트링을 안전하게 만드는 내장 Web API입니다. 한글, 특수문자를 자동으로 URL 인코딩합니다.

```typescript
const params = new URLSearchParams({
  applyId: 'HAKJONG-001',
  universityName: '서울대학교', // 한글 자동 인코딩
});
params.toString();
// → "applyId=HAKJONG-001&universityName=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90"
```

---

### Step 21-A: 확인 페이지에서 URL 파라미터 읽기

```
apps/early/src/window/hakjong/EarlyHakjongConfirm.tsx
```

`useSearchParams()`로 URL에서 모든 값을 읽어 화면에 표시하고, 수정하기 href를 구성합니다.

```typescript
'use client';
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();

// URL에서 모든 값 읽기
const applyId = searchParams.get('applyId') ?? '';
const universityId = searchParams.get('universityId') ?? '';
const universityName = searchParams.get('universityName') ?? '';
const majorType = searchParams.get('majorType') ?? '';
const majorTypeName = searchParams.get('majorTypeName') ?? '';
const minorMajorCategoryCode = searchParams.get('minorMajorCategoryCode') ?? '';
const minorMajorCategoryName = searchParams.get('minorMajorCategoryName') ?? '';
const selfIntroduction = searchParams.get('selfIntroduction') ?? '';
const activityReport = searchParams.get('activityReport') ?? '';

// 수정하기: 신청 페이지로 복원용 데이터 전달
const editParams = new URLSearchParams({
  universityId,
  universityName,
  majorType,
  majorTypeName,
  minorMajorCategoryCode,
  minorMajorCategoryName,
  selfIntroduction,
  activityReport,
  // applyId는 포함하지 않음: 수정 후 재신청 시 새 applyId가 발급됨
});
```

> **`searchParams.get()`의 반환 타입**: 파라미터가 있으면 `string`, 없으면 `null`을 반환합니다. `?? ''`로 `null` 대비 빈 문자열 기본값을 지정합니다. 이렇게 해야 타입이 `string | null`이 아닌 `string`이 되어 타입 오류 없이 사용할 수 있습니다.

**수정하기 버튼:**

```tsx
<ButtonLink mode="secondary" href={`/jh/high3/early/hakjong/apply?${editParams.toString()}`}>
  수정하기
</ButtonLink>
```

---

### Step 22-A: 신청 페이지에서 이전 입력값 복원

```
apps/early/src/window/hakjong/EarlyHakjongApply.tsx
```

`useSearchParams()`로 URL 파라미터를 읽어 `useState`의 **초기값**으로 설정합니다.

```typescript
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();

// Dropdown 3개: URL 파라미터 있으면 복원, 없으면 빈 값(첫 진입)
const [selectedOption, setSelectedOption] = useState<SelectedOptions>({
  drop1: {
    value: searchParams.get('universityId') ?? '',
    label: searchParams.get('universityName') ?? '',
  },
  drop2: {
    value: searchParams.get('majorType') ?? '',
    label: searchParams.get('majorTypeName') ?? '',
  },
  drop3: {
    value: searchParams.get('minorMajorCategoryCode') ?? '',
    label: searchParams.get('minorMajorCategoryName') ?? '',
  },
});

// TextInput 2개: URL 파라미터 있으면 복원
const [selfIntroduction, setSelfIntroduction] = useState(searchParams.get('selfIntroduction') ?? '');
const [activityReport, setActivityReport] = useState(searchParams.get('activityReport') ?? '');
```

**동작 원리:**

| 진입 경로                                             | URL 상태      | 초기 state           |
| ----------------------------------------------------- | ------------- | -------------------- |
| 첫 방문 (`/hakjong/apply`)                            | 파라미터 없음 | 모두 빈 값           |
| 수정하기 클릭 (`/hakjong/apply?universityId=101&...`) | 파라미터 있음 | 이전 입력값으로 복원 |

> **`useState`의 초기값은 최초 렌더링 시 한 번만 사용됩니다.** `searchParams`가 나중에 바뀌어도 state는 자동으로 업데이트되지 않습니다. 이 패턴은 "페이지 진입 시 초기값 복원"에 적합합니다.

---

### Step 23-A: `useSearchParams()`와 Suspense 필수 규칙

`useSearchParams()`를 사용하는 컴포넌트는 **반드시 `<Suspense>`로 감싸야** 합니다. 그렇지 않으면 다음 오류가 발생합니다:

```
Error: useSearchParams() should be wrapped in a suspense boundary
at page "/hakjong/apply"
```

**원인:** Next.js 14+에서 `useSearchParams()`는 동적 렌더링을 유발합니다. 서버가 빌드 타임에 URL 파라미터 값을 알 수 없으므로, React에게 "이 컴포넌트는 클라이언트 준비 후 렌더링해라"고 알리는 Suspense가 필요합니다.

**해결: page.tsx에서 `<Suspense>`로 감싸기:**

```tsx
// app/(early)/hakjong/apply/page.tsx
import { EarlyHakjong } from '@/window/hakjong/EarlyHakjong';
import { Suspense } from 'react';

export default async function HakjongApplyPage() {
  return (
    <Suspense>
      <EarlyHakjong />
    </Suspense>
  );
}
```

```tsx
// app/(early)/hakjong/apply/confirm/page.tsx
import { EarlyHakjongConfirm } from '@/window/hakjong/EarlyHakjongConfirm';
import { Suspense } from 'react';

export default function HakjongApplyConfirmPage() {
  return (
    <Suspense>
      <EarlyHakjongConfirm />
    </Suspense>
  );
}
```

**언제 `Suspense`가 필요한가:**

| 훅/기능                 | Suspense 필요 여부                 |
| ----------------------- | ---------------------------------- |
| `useSearchParams()`     | ✅ 필요                            |
| `usePathname()`         | ❌ 불필요                          |
| `useRouter()`           | ❌ 불필요                          |
| `useState`, `useEffect` | ❌ 불필요                          |
| React Query `useQuery`  | 선택적 (Suspense 모드일 때만 필요) |

---

### 방법 1 정리

```
[입력완료 클릭]
  handleSubmit() → 서버 전송
  → URLSearchParams에 전체 8개 값 → 확인 페이지 이동

[확인 페이지]
  useSearchParams()로 URL에서 값 읽기 → 화면 표시
  editParams에 전체 값 → 수정하기 href에 연결

[수정하기 클릭]
  /hakjong/apply?universityId=...&selfIntroduction=... 이동

[신청 페이지 재진입]
  useSearchParams()로 URL 파라미터 읽기 → useState 초기값 복원
```

| 개념                   | 설명                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `URLSearchParams`      | 한글 포함 데이터를 URL 쿼리스트링으로 안전하게 인코딩         |
| `useSearchParams()`    | URL 쿼리스트링 값을 읽는 Next.js 훅                           |
| `useState` 초기값 복원 | `useState(searchParams.get(...) ?? '')` 패턴으로 초기화       |
| `Suspense` 필수        | `useSearchParams()` 사용 컴포넌트는 반드시 Suspense로 감쌀 것 |
| `?? ''`                | `searchParams.get()`의 `null` 반환값에 빈 문자열 기본값 지정  |

**여기서 React Query와 비교하면:**

- 이 방법은 데이터를 URL에 직접 담아 다음 페이지로 넘기는 방식입니다.
- 반면 React Query는 서버에서 다시 읽어온 데이터를 캐시에 저장해 여러 화면에서 공유하는 방식입니다.
- 즉, `useSearchParams()`는 "URL에서 값 읽기", `useQuery`는 "서버에서 값 읽기"라고 구분하면 헷갈리지 않습니다.

---

## 방법 2: sessionStorage 방식

### 배경: URL 쿼리스트링 방식의 한계

방법 1의 URL 쿼리스트링 방식은 구현이 간단하지만, 다음 상황에서는 적합하지 않습니다:

| 문제              | 설명                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| **보안/개인정보** | 자기소개서, 활동보고서 등 민감한 내용이 브라우저 주소창에 노출됨            |
| **URL 길이 제한** | 브라우저마다 URL 최대 길이 제한(약 2,048자)이 있어 긴 텍스트는 잘릴 수 있음 |
| **가독성**        | URL이 지저분해져 공유 시 혼란 야기                                          |
| **히스토리 오염** | 브라우저 뒤로가기 시 민감 데이터가 담긴 URL이 히스토리에 남음               |

**해결책: `sessionStorage`로 데이터를 저장하고, URL에는 아무것도 노출하지 않습니다.**

### 개요: sessionStorage를 사용한 전체 흐름

```
[신청 페이지] EarlyHakjongApply.tsx
  사용자 입력 (Dropdown 3개 + TextInput 2개)
           ↓ "입력완료" 클릭
  handleSubmit() → submitApply() → 서버 전송
           ↓ 성공
  sessionStorage에 전체 입력값 + applyId 저장
           ↓
  router.push('/hakjong/apply/confirm')  ← URL에 아무것도 없음
           ↓
[확인 페이지] EarlyHakjongConfirm.tsx
  sessionStorage에서 모든 값 읽기 → 화면 표시
           ↓ "수정하기" 클릭
  /hakjong/apply 로 단순 이동 (쿼리 없음)
           ↓
[신청 페이지] EarlyHakjongApply.tsx
  sessionStorage에서 이전 입력값 읽기
  → useState 초기값으로 복원 → 이전 입력값 그대로 표시됨
```

---

### 핵심 개념: sessionStorage란?

`sessionStorage`는 브라우저가 제공하는 **클라이언트 측 임시 저장소**입니다.

```
[브라우저 저장소 종류]

localStorage       → 브라우저 탭 닫아도 영구 보존
sessionStorage     → 탭/브라우저 닫으면 자동 삭제
cookie             → 서버와 함께 사용, 만료 시간 설정 가능
```

**sessionStorage의 특징:**

| 특징               | 설명                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| **탭 단위 격리**   | 같은 사이트라도 탭이 다르면 별도 저장 공간 사용                                |
| **탭 닫으면 삭제** | 브라우저 탭을 닫거나 세션이 끝나면 자동 삭제됨                                 |
| **문자열만 저장**  | 객체/배열은 `JSON.stringify()`로 직렬화 후 저장, 읽을 때 `JSON.parse()`로 복원 |
| **동기 API**       | `localStorage`와 동일하게 동기 방식(await 불필요)                              |
| **브라우저 전용**  | 서버(Node.js)에는 `window`/`sessionStorage`가 없음 → SSR 안전 처리 필요        |

**기본 사용법:**

```typescript
// 저장 (객체는 JSON으로 직렬화)
sessionStorage.setItem('key', JSON.stringify({ name: '서울대', id: '101' }));

// 읽기 (JSON으로 파싱)
const raw = sessionStorage.getItem('key'); // 없으면 null 반환
const data = JSON.parse(raw ?? '{}'); // null 대비 빈 객체 기본값

// 삭제
sessionStorage.removeItem('key');

// 전체 삭제
sessionStorage.clear();
```

---

### Step 20: sessionStorage에 입력값 저장 후 확인 페이지 이동

```
apps/early/src/window/hakjong/EarlyHakjongApply.tsx
```

`handleSubmit`의 서버 전송 성공 후, URL 파라미터 대신 `sessionStorage`에 저장합니다.

**변경 전 (URL 쿼리스트링 방식):**

```typescript
const params = new URLSearchParams({
  applyId: response.applyId,
  universityId: drop1.value,
  universityName: drop1.label,
  // ... (8개 모두 URL에 노출)
  selfIntroduction,
  activityReport,
});
router.push(`/hakjong/apply/confirm?${params.toString()}`);
```

**변경 후 (sessionStorage 방식):**

```typescript
// ① 모든 데이터를 sessionStorage에 저장
sessionStorage.setItem(
  'hakjong_apply_form',
  JSON.stringify({
    applyId: response.applyId, // 서버가 발급한 신청 번호
    universityId: drop1.value,
    universityName: drop1.label,
    majorType: drop2.value,
    majorTypeName: drop2.label,
    minorMajorCategoryCode: drop3.value,
    minorMajorCategoryName: drop3.label,
    selfIntroduction,
    activityReport,
  }),
);

// ② URL에 아무것도 없이 단순 이동
router.push('/hakjong/apply/confirm');
```

**`JSON.stringify()` 가 필요한 이유:**

`sessionStorage`는 문자열만 저장할 수 있습니다. 객체를 그대로 저장하면 `[object Object]`라는 문자열로 변환되어 의미를 잃습니다.

```typescript
// 잘못된 방식
sessionStorage.setItem('data', { name: '서울대' });
sessionStorage.getItem('data'); // → "[object Object]" ❌

// 올바른 방식
sessionStorage.setItem('data', JSON.stringify({ name: '서울대' }));
sessionStorage.getItem('data'); // → '{"name":"서울대"}' ✅
JSON.parse(sessionStorage.getItem('data')!); // → { name: '서울대' } ✅
```

---

### Step 21: 신청 페이지에서 이전 입력값 복원 (sessionStorage 읽기)

```
apps/early/src/window/hakjong/EarlyHakjongApply.tsx
```

`useSearchParams()` 대신 `sessionStorage`에서 초기값을 읽습니다. 하지만 이 과정에서 **Hydration mismatch** 오류를 만나게 됩니다. 실제로 3가지 방법을 시도한 과정을 순서대로 설명합니다.

---

#### ❌ 시도 1: 렌더링 중 `typeof window` 분기 (Hydration 오류 발생)

```typescript
// 렌더링 중에 직접 계산
const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('hakjong_apply_form') ?? '{}') : {};

const [selectedOption, setSelectedOption] = useState<SelectedOptions>({
  drop1: {
    value: saved.universityId ?? '', // 서버: '' / 브라우저: '1019'
    label: saved.universityName ?? '', // 서버: '' / 브라우저: '가천대'
  },
  // ...
});
```

**오류 발생:**

```
Uncaught Error: Hydration failed because the server rendered text didn't match the client.
```

에러 트리에서 불일치가 명확히 보입니다:

```diff
<button
-  data-value={null}      ← 서버 렌더링 결과
+  data-value="1019"      ← 클라이언트 렌더링 결과
>
<strong>
-                          ← 서버: 빈 문자열
+  가천대                  ← 클라이언트: sessionStorage 값
```

**왜 안 되나?**

`typeof window !== 'undefined'`는 렌더링 중에 실행되는 **서버/클라이언트 분기(branch)**입니다. React의 Hydration 과정에서 서버와 클라이언트의 렌더링 결과가 반드시 동일해야 하는데, 이 분기는 서로 다른 결과를 만듭니다.

```
서버 렌더링:  typeof window → 'undefined' → saved = {}     → value = ''
클라이언트:   typeof window → 'object'    → saved = 실제값  → value = '1019'
                                                              ↑ 불일치 발생!
```

**Hydration이란?**

Next.js가 서버에서 HTML을 생성(SSR) → 브라우저가 이 HTML을 받아서 화면에 표시 → React가 이 HTML에 이벤트 핸들러 등을 '연결(attach)'하는 과정입니다. 이 연결 과정에서 React는 서버 HTML과 클라이언트의 첫 렌더링 결과를 **비교**합니다. 내용이 다르면 오류가 발생합니다.

```
[서버]
  컴포넌트 실행 → HTML 생성: <button data-value="">...</button>
                                    ↓ HTML을 브라우저로 전송
[브라우저]
  HTML 화면에 표시 (아직 React 없이 정적 HTML)
                                    ↓ React JS 로드 완료
[Hydration]
  React가 같은 컴포넌트를 브라우저에서 다시 실행
  → <button data-value="1019">가천대</button>
  → 서버 HTML과 비교 → 다르다! → ❌ Hydration mismatch 에러
```

---

#### ❌ 시도 2: `useState` lazy initializer (여전히 Hydration 오류)

"렌더링 중 직접 계산이 문제라면, `useState`의 초기화 함수로 넘기면 브라우저에서만 실행되지 않을까?" → **아닙니다.**

```typescript
const [selectedOption, setSelectedOption] = useState<SelectedOptions>(() => {
  const s = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('hakjong_apply_form') ?? '{}') : {};
  return {
    drop1: { value: s.universityId ?? '', label: s.universityName ?? '' },
    // ...
  };
});
```

**왜 안 되나?**

`useState(() => ...)`의 초기화 함수(lazy initializer)는 **SSR에서도 실행됩니다.** React는 서버에서 컴포넌트를 렌더링할 때 `useState`의 초기값을 결정해야 하기 때문에, 함수든 값이든 무조건 실행합니다.

```
[서버] useState(() => { typeof window → 'undefined' → return { value: '' } })
[브라우저] useState(() => { typeof window → 'object' → return { value: '1019' } })
                                                         ↑ 역시 불일치!
```

> **오해하기 쉬운 포인트**: `useState(() => ...)` 형태의 "lazy init"이 "지연 실행"이라고 해서 브라우저에서만 실행된다고 착각할 수 있습니다. 실제로는 "매 렌더링마다 재실행되지 않고, 최초 1회만 실행된다"는 의미의 lazy입니다. SSR에서의 그 "최초 1회"도 포함됩니다.

---

#### ✅ 시도 3 (최종): `useEffect`로 마운트 후 복원 (Hydration 안전)

`useEffect`는 **브라우저에서만, Hydration이 완료된 후에만** 실행됩니다. SSR에서는 절대 실행되지 않습니다.

```typescript
import { useEffect, useState } from 'react';

// ① 초기값은 빈 값 (서버와 클라이언트 모두 동일)
const [selectedOption, setSelectedOption] = useState<SelectedOptions>({
  drop1: { value: '', label: '' },
  drop2: { value: '', label: '' },
  drop3: { value: '', label: '' },
});
const [selfIntroduction, setSelfIntroduction] = useState('');
const [activityReport, setActivityReport] = useState('');

// ② 마운트 후 sessionStorage에서 복원 (브라우저에서만 실행)
useEffect(() => {
  const raw = sessionStorage.getItem('hakjong_apply_form');
  if (!raw) return; // 저장된 값이 없으면 (첫 방문) 아무것도 안 함
  const saved = JSON.parse(raw) as Partial<{
    universityId: string;
    universityName: string;
    majorType: string;
    majorTypeName: string;
    minorMajorCategoryCode: string;
    minorMajorCategoryName: string;
    selfIntroduction: string;
    activityReport: string;
  }>;
  setSelectedOption({
    drop1: { value: saved.universityId ?? '', label: saved.universityName ?? '' },
    drop2: { value: saved.majorType ?? '', label: saved.majorTypeName ?? '' },
    drop3: {
      value: saved.minorMajorCategoryCode ?? '',
      label: saved.minorMajorCategoryName ?? '',
    },
  });
  setSelfIntroduction(saved.selfIntroduction ?? '');
  setActivityReport(saved.activityReport ?? '');
}, []); // 빈 배열 = 마운트 시 1회만 실행
```

**이것이 작동하는 이유:**

```
[서버 렌더링]
  useState('') → 빈 값으로 HTML 생성
  useEffect → 실행 안 됨 (서버에는 useEffect 없음)
  결과: <button data-value="">...</button>

[브라우저 Hydration]
  useState('') → 빈 값 (서버와 동일 ✅ 불일치 없음)
  useEffect → 아직 실행 안 됨

[Hydration 완료 후]
  useEffect 실행 → sessionStorage 읽기 → setState
  → React가 정상적으로 리렌더링 → 값 채워짐
```

서버와 클라이언트가 모두 "빈 값"으로 동일한 HTML을 만들기 때문에 Hydration mismatch가 발생하지 않습니다. 값은 Hydration 완료 후 `useEffect`에서 안전하게 채워집니다.

---

#### 3가지 방법 비교 정리

| 방법                            | SSR에서 실행?     | Hydration 안전?              | 설명                                |
| ------------------------------- | ----------------- | ---------------------------- | ----------------------------------- |
| 렌더링 중 `typeof window` 분기  | ✅ 실행           | ❌ 서버/클라이언트 결과 다름 | 가장 직관적이지만 Hydration 깨짐    |
| `useState(() => ...)` lazy init | ✅ 실행           | ❌ 동일 문제                 | "lazy"는 "브라우저 전용"이 아님     |
| **`useEffect(() => ...)`**      | **❌ 실행 안 됨** | **✅ 안전**                  | 브라우저에서만 실행되는 유일한 방법 |

> **핵심 규칙**: 브라우저 전용 API(`sessionStorage`, `localStorage`, `window.innerWidth` 등)를 읽어서 **렌더링 결과에 영향을 주려면** 반드시 `useEffect` 안에서 `setState`를 통해 업데이트해야 합니다. 렌더링 중에 직접 분기하면 Hydration mismatch가 발생합니다.

#### `useEffect`의 실행 시점과 `[]` (의존성 배열)

```typescript
useEffect(() => {
  // 이 코드는 언제 실행되는가?
  console.log('마운트 완료!');
}, []); // ← 빈 배열
```

| 의존성 배열    | 실행 시점               | 비유                           |
| -------------- | ----------------------- | ------------------------------ |
| `[]` (빈 배열) | 마운트 시 1번만         | jQuery의 `$(document).ready()` |
| `[value]`      | `value`가 변경될 때마다 | jQuery의 `.on('change', ...)`  |
| 생략           | 매 렌더링마다           | (거의 사용 안 함)              |

이 프로젝트에서는 `[]`를 사용합니다. 페이지 진입 시 **한 번만** sessionStorage를 읽으면 되기 때문입니다.

#### `Partial<T>` 타입이란?

`JSON.parse()`의 반환 타입은 `any`입니다. 빈 객체 `{}`를 파싱하면 아무 키도 없는데, 타입스크립트가 모든 필드가 있다고 믿으면 런타임 오류가 날 수 있습니다.

`Partial<T>`는 인터페이스 `T`의 모든 필드를 **선택적(optional)**으로 만듭니다:

```typescript
interface FormData {
  universityId: string; // 필수
  universityName: string; // 필수
}

Partial<FormData>; // → { universityId?: string; universityName?: string; }
```

이렇게 하면 `saved.universityId`가 없을 수 있음을 타입 수준에서 명시하고, `?? ''`로 안전하게 처리할 수 있습니다.

**동작 원리:**

| 진입 경로                        | sessionStorage 상태   | 초기 state | useEffect 후             |
| -------------------------------- | --------------------- | ---------- | ------------------------ |
| 첫 방문 (`/hakjong/apply`)       | 없음                  | 모두 빈 값 | 변화 없음 (early return) |
| 수정하기 클릭 (`/hakjong/apply`) | 이전에 저장된 값 있음 | 모두 빈 값 | 이전 입력값으로 복원     |

---

### Step 22: 확인 페이지에서 sessionStorage 읽기

```
apps/early/src/window/hakjong/EarlyHakjongConfirm.tsx
```

확인 페이지도 동일한 `useEffect` 패턴을 적용합니다. `useSearchParams()`를 완전히 제거하고, 마운트 후 sessionStorage에서 읽습니다.

**변경 전 (URL 방식):**

```typescript
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const applyId = searchParams.get('applyId') ?? '';
const universityName = searchParams.get('universityName') ?? '';
// ... URL에서 값 읽기
```

**변경 후 (useEffect + sessionStorage):**

```typescript
import { useEffect, useState } from 'react';

// ① 초기값: 모두 빈 문자열 (SSR과 동일 = Hydration 안전)
const [applyId, setApplyId] = useState('');
const [universityName, setUniversityName] = useState('');
const [majorTypeName, setMajorTypeName] = useState('');
const [minorMajorCategoryName, setMinorMajorCategoryName] = useState('');
const [selfIntroduction, setSelfIntroduction] = useState('');
const [activityReport, setActivityReport] = useState('');

// ② Hydration 완료 후 sessionStorage에서 값 채우기
useEffect(() => {
  const raw = sessionStorage.getItem('hakjong_apply_form');
  if (!raw) return;
  const saved = JSON.parse(raw) as Partial<{
    applyId: string;
    universityName: string;
    majorTypeName: string;
    minorMajorCategoryName: string;
    selfIntroduction: string;
    activityReport: string;
  }>;
  setApplyId(saved.applyId ?? '');
  setUniversityName(saved.universityName ?? '');
  setMajorTypeName(saved.majorTypeName ?? '');
  setMinorMajorCategoryName(saved.minorMajorCategoryName ?? '');
  setSelfIntroduction(saved.selfIntroduction ?? '');
  setActivityReport(saved.activityReport ?? '');
}, []);
```

> **이전 Step 21과 동일한 패턴입니다.** 확인 페이지에서도 "초기에는 빈 값 → useEffect에서 실제 값 채우기"로 Hydration mismatch를 방지합니다.

---

### Step 23: 수정하기 버튼 — 쿼리 없이 단순 이동

확인 페이지의 "수정하기" 버튼이 이전에는 URL에 모든 입력값을 실어 보냈지만, 이제는 `sessionStorage`에 값이 이미 있으므로 단순 URL 이동만 하면 됩니다.

**변경 전:**

```typescript
// 입력값을 다시 URL에 담아야 했음
const editParams = new URLSearchParams({
  universityId,
  universityName,
  // ... 8개
  selfIntroduction,
  activityReport,
});

<ButtonLink href={`/hakjong/apply?${editParams.toString()}`}>
  수정하기
</ButtonLink>
```

**변경 후:**

```tsx
// sessionStorage에 이미 값이 있으므로 단순 이동
<ButtonLink mode="secondary" href="/jh/high3/early/hakjong/apply">
  수정하기
</ButtonLink>
```

신청 페이지(`EarlyHakjongApply.tsx`)는 마운트 시 항상 sessionStorage를 읽어 초기값을 복원하므로, URL에 쿼리스트링 없이 이동해도 이전 입력값이 그대로 표시됩니다.

---

### Step 24: `useSearchParams()` 제거와 Suspense

`useSearchParams()`를 사용하는 컴포넌트는 반드시 `<Suspense>`로 감싸야 합니다. 이번 변경으로 두 컴포넌트 모두 `useSearchParams()`를 제거했지만, page.tsx의 `<Suspense>`는 그대로 유지합니다.

> **왜 Suspense를 제거하지 않나요?**
> `useSearchParams()`가 없더라도 `<Suspense>`는 다른 비동기 작업(React Query, lazy 컴포넌트 등)의 로딩 경계로 활용될 수 있습니다. 불필요하게 제거하는 것보다 유지하는 것이 안전합니다.

`EarlyHakjongConfirm` 컴포넌트는 이제 `useSearchParams()`를 사용하지 않으므로 Suspense 의무 대상에서 벗어났습니다. 하지만 page.tsx의 Suspense는 그대로 둡니다:

```tsx
// app/(early)/hakjong/apply/confirm/page.tsx
export default function HakjongApplyConfirmPage() {
  return (
    <Suspense>
      <EarlyHakjongConfirm />
    </Suspense>
  );
}
```

---

### 방법 2 정리

#### 변경된 파일 요약

| 파일                      | 변경 내용                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `EarlyHakjongApply.tsx`   | `useSearchParams` 제거, `sessionStorage`에서 초기값 복원, `handleSubmit`에서 sessionStorage 저장 |
| `EarlyHakjongConfirm.tsx` | `useSearchParams` 완전 제거, sessionStorage에서 모든 값 읽기, 수정하기 버튼 단순 href로 변경     |

#### 전체 동작 흐름

```
[신청 페이지] /hakjong/apply
  ① sessionStorage('hakjong_apply_form') 읽어 초기값 복원
     └─ 첫 방문: 빈 값 / 수정하기로 재진입: 이전 입력값 복원
  ② 사용자 입력 (Dropdown 3개 + TextInput 2개)
  ③ "입력완료" 클릭 → 유효성 검사 → 서버 전송
  ④ 서버 응답 성공 → sessionStorage에 전체 데이터 저장
  ⑤ router.push('/hakjong/apply/confirm')  ← 쿼리 없음

[확인 페이지] /hakjong/apply/confirm
  ① sessionStorage('hakjong_apply_form') 읽어 화면 표시
  ② "수정하기" 클릭 → /hakjong/apply 로 단순 이동

[신청 페이지 재진입] /hakjong/apply
  ① sessionStorage에 저장된 값 읽어 이전 입력값 복원
```

#### 핵심 개념 정리

| 개념                         | 설명                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `sessionStorage`             | 탭 닫으면 삭제되는 브라우저 저장소. 페이지 간 임시 데이터 전달에 적합                        |
| `JSON.stringify()`           | 객체 → 문자열 변환. sessionStorage에 저장 전 필수                                            |
| `JSON.parse()`               | 문자열 → 객체 변환. sessionStorage에서 읽은 후 필수                                          |
| `useEffect`                  | 브라우저에서만, Hydration 이후에만 실행. sessionStorage 읽기를 여기서 해야 Hydration 안전    |
| **Hydration mismatch**       | 서버 HTML과 클라이언트 첫 렌더링이 다를 때 발생하는 React 오류                               |
| `useState` lazy init         | `useState(() => ...)` — "최초 1회만 실행"이지 "브라우저에서만 실행"이 아님. SSR에서도 실행됨 |
| `Partial<T>`                 | 인터페이스의 모든 필드를 선택적으로 만드는 TypeScript 유틸리티 타입                          |
| `?? ''` (Nullish Coalescing) | `null`/`undefined`일 때 기본값 지정                                                          |

#### URL 쿼리스트링 vs sessionStorage 비교

| 항목        | URL 쿼리스트링                    | sessionStorage                   |
| ----------- | --------------------------------- | -------------------------------- |
| 데이터 노출 | 브라우저 주소창에 노출            | 노출 없음                        |
| 길이 제한   | ~2,048자 (브라우저마다 다름)      | ~5MB                             |
| 탭 공유     | 링크 복사로 공유 가능             | 탭 간 공유 불가                  |
| 새로고침    | URL 그대로라 데이터 유지          | 탭 닫으면 삭제                   |
| 적합한 용도 | 페이지 공유, 필터/검색 조건       | 민감 데이터, 긴 텍스트 임시 전달 |
| SSR 처리    | 불필요 (URL은 서버에서 읽기 가능) | `typeof window` 체크 필요        |

---

## Phase 5 종합 비교 — 어떤 방법을 언제 써야 하나?

### 두 방법의 전체 구현 차이

| 구현 포인트       | 방법 1: URL 쿼리스트링                   | 방법 2: sessionStorage                                        |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------- |
| **데이터 저장**   | `new URLSearchParams({...})`             | `sessionStorage.setItem(key, JSON.stringify(...))`            |
| **페이지 이동**   | `router.push('/confirm?' + params)`      | `router.push('/confirm')`                                     |
| **데이터 읽기**   | `useSearchParams()` + `.get('key')`      | `useEffect` 내에서 `sessionStorage.getItem(key)` → `setState` |
| **복원 초기값**   | `useState(searchParams.get(...) ?? '')`  | `useState('')` + `useEffect`에서 복원                         |
| **수정하기 버튼** | `href={'/apply?' + editParams}`          | `href="/apply"` (그대로 이동)                                 |
| **Suspense 필요** | ✅ 필요 (`useSearchParams` 때문)         | ❌ 불필요                                                     |
| **SSR 안전 처리** | ❌ 불필요                                | ✅ `useEffect` 사용 필수 (Hydration 안전)                     |
| **추가 import**   | `useSearchParams` from `next/navigation` | `useEffect` from `react`                                      |

### 상황별 선택 기준

```
페이지 공유 링크가 필요한가? (ex. 필터, 검색 조건)
  → YES → 방법 1: URL 쿼리스트링

민감한 데이터인가? (ex. 자기소개서, 개인정보)
  → YES → 방법 2: sessionStorage

데이터 길이가 긴가? (수백 자 이상 텍스트)
  → YES → 방법 2: sessionStorage

단순 숫자/코드값만 전달하는가? (ex. id, 페이지 번호)
  → YES → 방법 1: URL 쿼리스트링
```

### 이 프로젝트의 선택

- **초기 구현**: 방법 1 (URL 쿼리스트링) — 빠르게 동작 확인
- **최종 구현**: 방법 2 (sessionStorage) — 자기소개서/활동보고서가 민감 데이터이고 길이가 길어 URL 방식의 한계에 부딪혀 전환

---

## Phase 6: 확인 페이지 — 컨펌 모달과 최종 제출

### 개요: 확인 페이지의 역할

확인 페이지(`EarlyHakjongConfirm.tsx`)는 신청 데이터를 사용자에게 보여주고, "정말 제출하시겠습니까?"라는 **최종 확인 단계**를 제공합니다.

```
[신청 페이지] EarlyHakjongApply.tsx
  사용자 입력 → "입력완료" 클릭 → 서버 전송 (임시 저장)
           ↓
[확인 페이지] EarlyHakjongConfirm.tsx ← 지금 만드는 부분
  sessionStorage에서 데이터 표시
  → "신청완료 (제출)" 클릭
  → 컨펌 모달 표시: "입시전문가 평가를 신청하시겠습니까?"
  → "신청" 클릭
  → [현재] 바로 리포트 페이지로 이동
  → [추후] 확정 API 호출 → 성공 시 리포트 페이지로 이동
           ↓
[리포트 페이지] EarlyHakjongReport.tsx
  입시전문가 분석 결과 표시
```

---

### Step 25: 공통 ConfirmModal 컴포넌트 사용법

프로젝트에는 이미 만들어진 `ConfirmModal` 컴포넌트가 있습니다. 직접 모달을 만들지 않고 공통 컴포넌트를 가져다 씁니다.

**ConfirmModal 위치와 import:**

```typescript
// ✅ 올바른 import (파일 경로 직접 지정)
import { ConfirmModal } from '@libs/ui/Modal/ConfirmModal';

// ❌ 잘못된 import (barrel export에 등록되지 않아 오류 발생)
import { ConfirmModal } from '@libs/ui/Modal';
```

> **barrel export란?** `index.ts`에서 `export * from './Component'`로 내보내는 패턴입니다.
> `@libs/ui/Modal/index.ts`에 `ConfirmModal`이 등록되어 있지 않기 때문에 직접 파일 경로를 사용합니다.
> barrel export에 없는 컴포넌트를 import할 때는 **파일 경로를 직접 지정**하면 됩니다.

**ConfirmModal의 props:**

```typescript
interface ConfirmModalProps {
  message: React.ReactNode; // 모달 본문 메시지 (문자열 또는 JSX)
  buttonText?: string; // 확인 버튼 텍스트 (기본값: '확인')
  cancelText?: string; // 취소 버튼 텍스트 (기본값: '취소')
  isOpen?: boolean; // 모달 표시 여부
  isLoading?: boolean; // 확인 버튼 로딩 스피너 표시
  onClick?: () => void; // 확인 버튼 클릭 핸들러
  onClose?: () => void; // 취소 버튼 / 닫기 핸들러
  cancelButtonMode?: 'secondary' | 'tertiary';
}
```

---

### Step 26: 모달 열기/닫기 상태 관리 패턴

모달의 열림/닫힘은 `useState<boolean>`으로 관리합니다. 이것은 프로젝트 전반에서 사용되는 표준 패턴입니다.

```typescript
const [isConfirmOpen, setIsConfirmOpen] = useState(false);

// 열기: 버튼 클릭 시
<Button onClick={() => setIsConfirmOpen(true)}>신청완료 (제출)</Button>

// 닫기: 취소 클릭 또는 확인 처리 후
<ConfirmModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}    // 취소 시 닫기
  onClick={() => {                            // 확인 시 처리 후 닫기
    setIsConfirmOpen(false);
    // ...추가 로직
  }}
/>
```

**동작 흐름:**

```
isConfirmOpen: false → 모달 숨김
       ↓ "신청완료 (제출)" 클릭
isConfirmOpen: true  → 모달 표시
       ↓ "취소" 클릭           ↓ "신청" 클릭
isConfirmOpen: false           처리 로직 실행 + isConfirmOpen: false
```

> **패턴 포인트**: `isOpen` prop에 state 변수를 연결하고, `onClose`와 `onClick`에서 해당 state를 `false`로 변경합니다. React가 state 변경을 감지하면 ConfirmModal이 자동으로 사라집니다.

---

### Step 27: 현재 구현 — 바로 리포트 페이지로 이동

현재는 확정 API가 없으므로, "신청" 클릭 시 바로 리포트 페이지로 이동합니다.

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

<ConfirmModal
  isOpen={isConfirmOpen}
  message={
    '입시전문가 평가를 신청하시겠습니까?\n상담신청을 완료하면 내용 변경이 불가하며,\n입시전문가가 분석을 시작합니다.'
  }
  buttonText="신청"
  cancelText="취소"
  onClick={() => {
    setIsConfirmOpen(false);
    sessionStorage.removeItem('hakjong_apply_form');  // 임시 데이터 정리
    router.push('/hakjong/report');                    // 리포트 페이지로 이동
  }}
  onClose={() => setIsConfirmOpen(false)}
/>
```

**`sessionStorage.removeItem()` 호출 이유:**

확인 페이지에서 "신청"을 눌러 최종 제출하면, 더 이상 수정할 필요가 없습니다. sessionStorage에 남아있는 임시 데이터를 정리하여:

- 다음 신청 시 이전 데이터가 남아있지 않도록 방지
- 불필요한 데이터가 브라우저 메모리에 잔류하지 않도록 정리

**`\n` (개행 문자)과 `whitespace-pre-line`:**

ConfirmModal 내부에서 `whitespace-pre-line` CSS가 적용되어 있어, 문자열 안의 `\n`이 실제 줄바꿈으로 표시됩니다.

```
'입시전문가 평가를 신청하시겠습니까?\n상담신청을 완료하면...'
```

화면에는 이렇게 보입니다:

```
입시전문가 평가를 신청하시겠습니까?
상담신청을 완료하면 내용 변경이 불가하며,
입시전문가가 분석을 시작합니다.
```

---

### Step 28: 확정 API 연동 시 변경 방법 (추후 작업)

확정 API(`POST /hakjong/apply/confirm`)가 준비되면, **4개 파일**을 순서대로 변경합니다.

#### 변경 순서와 파일 목록

```
① hakjong.types.ts      → 타입 정의 추가
② api/index.ts           → API 함수 추가
③ hakjong.queries.ts     → useMutation 훅 추가
④ EarlyHakjongConfirm.tsx → 컴포넌트에서 훅 연결
```

> 이 순서는 Phase 4에서 `submitHakjongApply`를 만들 때와 **완전히 동일한 패턴**입니다.
> **타입 → API 함수 → mutation 훅 → 컴포넌트** 순서를 기억하세요. 새로운 API를 연동할 때마다 이 순서를 반복합니다.

---

#### ① 타입 정의 추가

```
apps/early/src/entities/hakjong/model/hakjong.types.ts
```

현재 파일에 주석 처리된 타입이 있습니다. 주석을 해제하면 됩니다:

```typescript
// 주석 해제할 부분:
export interface HakjongConfirmRequest {
  applyId: string;
}

export interface HakjongConfirmResponse {
  status: string; // 예: 'CONFIRMED'
}
```

> **왜 타입을 먼저 정의하나요?**
> 이후 API 함수, mutation 훅에서 이 타입을 import하기 때문입니다. 타입이 없으면 나머지 코드에서 빨간 줄(타입 오류)이 표시됩니다.

---

#### ② API 함수 추가

```
apps/early/src/entities/hakjong/api/index.ts
```

현재 파일에 주석 처리된 함수가 있습니다. 주석을 해제하고 실제 API 엔드포인트로 교체합니다:

```typescript
import { HakjongConfirmRequest, HakjongConfirmResponse } from '../model/hakjong.types';

export const confirmHakjongApply = async (requestData: HakjongConfirmRequest): Promise<HakjongConfirmResponse> => {
  // 로컬 개발 시 (Next.js Route Handler)
  const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const data = await ky.post(`${basePath}/api/hakjong/apply/confirm`, { json: requestData }).json<HakjongConfirmResponse>();
  return data;

  // 실제 서버 연동 시: 위 코드를 아래로 교체
  // const data = await apiClient()
  //   .post('hakjong/apply/confirm', { json: requestData })
  //   .json<HakjongConfirmResponse>();
  // return data;
};
```

> **로컬 → 실제 서버 전환 시**: `ky.post(basePath + '/api/...')` → `apiClient().post('hakjong/apply/confirm', ...)` 로 교체합니다. 이 패턴은 `submitHakjongApply`에도 동일하게 주석으로 안내되어 있습니다.

---

#### ③ useMutation 훅 추가

```
apps/early/src/entities/hakjong/model/hakjong.queries.ts
```

현재 파일에 주석 처리된 훅이 있습니다. 주석을 해제합니다:

```typescript
import { confirmHakjongApply } from '../api';
import { HakjongConfirmRequest, HakjongConfirmResponse } from './hakjong.types';

export function useHakjongConfirmMutation() {
  return useMutation<HakjongConfirmResponse, Error, HakjongConfirmRequest>({
    mutationFn: (requestData) => confirmHakjongApply(requestData),
    onError: (error) => {
      console.error('학종 최종 제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
```

**`useMutation`의 제네릭 타입 파라미터 복습:**

```typescript
useMutation<
  HakjongConfirmResponse, // TData: 성공 시 반환 타입
  Error, // TError: 에러 타입
  HakjongConfirmRequest // TVariables: mutate()에 전달하는 인자 타입
>;
```

이 제네릭 덕분에:

- `mutateAsync(request)` 호출 시 `request`가 `HakjongConfirmRequest` 타입인지 자동 검사
- `onSuccess`의 `data`가 `HakjongConfirmResponse` 타입으로 자동 추론
- `onError`의 `error`가 `Error` 타입으로 자동 추론

---

#### ④ 컴포넌트에서 훅 연결

```
apps/early/src/window/hakjong/EarlyHakjongConfirm.tsx
```

현재 파일 상단에 변경 안내 주석이 있습니다. 핵심 변경 사항:

**변경 전 (현재):**

```typescript
onClick={() => {
  setIsConfirmOpen(false);
  sessionStorage.removeItem('hakjong_apply_form');
  router.push('/hakjong/report');
}}
```

**변경 후 (확정 API 연동 시):**

```typescript
import { useHakjongConfirmMutation } from '@/entities/hakjong/model/hakjong.queries';

// 컴포넌트 내부에서:
const { mutateAsync: confirmApply, isPending } = useHakjongConfirmMutation();

// ConfirmModal의 onClick을 async로 변경:
onClick={async () => {
  await confirmApply({ applyId });        // ← 서버에 최종 확정 요청
  setIsConfirmOpen(false);
  sessionStorage.removeItem('hakjong_apply_form');
  router.push('/hakjong/report');
}}

// ConfirmModal에 isLoading prop 추가:
isLoading={isPending}
```

**각 변경의 의미:**

| 변경 사항                         | 역할                                                                  |
| --------------------------------- | --------------------------------------------------------------------- |
| `useHakjongConfirmMutation()`     | 확정 API를 호출하는 mutation 훅                                       |
| `mutateAsync: confirmApply`       | `mutateAsync`를 `confirmApply`로 이름을 바꿔 사용 (가독성 향상)       |
| `await confirmApply({ applyId })` | 서버에 최종 확정 요청. 실패하면 `onError` 핸들러가 동작               |
| `isPending`                       | API 호출 중 `true`. 모달의 확인 버튼에 로딩 스피너를 표시하는 데 사용 |
| `isLoading={isPending}`           | 네트워크 지연 시 사용자에게 "처리 중"임을 시각적으로 안내             |

> **`isPending`으로 UX 개선하는 이유:**
> API 호출은 네트워크 상태에 따라 수 초가 걸릴 수 있습니다. `isPending` 없이 구현하면:
>
> - 사용자가 "신청" 버튼을 반복 클릭할 수 있음 (중복 요청)
> - 아무 반응이 없어 "고장났나?" 하고 페이지를 떠날 수 있음
>
> `isLoading={isPending}`을 전달하면 ConfirmModal이 자동으로 확인 버튼에 스피너를 표시하여 "처리 중"임을 알립니다.

---

#### 로컬 개발 시 Mock Route Handler 추가 (선택)

확정 API를 로컬에서 테스트하려면 Next.js Route Handler를 추가합니다:

```
apps/early/app/api/hakjong/apply/confirm/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[로컬 Mock] POST /api/hakjong/apply/confirm — 수신 데이터:', body);

  return NextResponse.json({ status: 'CONFIRMED' });
}
```

> 이 파일은 로컬 개발 전용이며, 실제 서버 API 연동 시 삭제합니다. Phase 4의 `apps/early/app/api/hakjong/apply/route.ts`와 동일한 패턴입니다.

---

### Phase 6 정리: 확정 API 연동 체크리스트

확정 API가 준비되면 아래 순서로 진행합니다:

| 순서 | 파일                      | 작업                                          |
| ---- | ------------------------- | --------------------------------------------- |
| 1    | `hakjong.types.ts`        | `HakjongConfirmRequest/Response` 주석 해제    |
| 2    | `api/index.ts`            | `confirmHakjongApply` 함수 주석 해제          |
| 3    | `hakjong.queries.ts`      | `useHakjongConfirmMutation` 훅 주석 해제      |
| 4    | `EarlyHakjongConfirm.tsx` | mutation 훅 연결 + `onClick`을 `async`로 변경 |
| 5    | (선택) `confirm/route.ts` | 로컬 테스트용 Route Handler 추가              |

**핵심 패턴**: 새로운 API를 연동할 때마다 **타입 → API 함수 → mutation 훅 → 컴포넌트** 4단계를 반복합니다. 이 패턴은 프로젝트 전체에서 동일하게 사용되는 표준 구조입니다.

| 새로 배운 핵심 개념           | 설명                                                                  |
| ----------------------------- | --------------------------------------------------------------------- |
| `ConfirmModal`                | 프로젝트 공통 확인 모달 컴포넌트. `isOpen`, `onClick`, `onClose` 필수 |
| `useState<boolean>` 모달 제어 | `true`로 열기, `false`로 닫기. React가 자동으로 렌더링/숨김 처리      |
| barrel export                 | `index.ts`에서 `export *` 하는 패턴. 등록 안 된 건 직접 경로 사용     |
| `isPending`                   | `useMutation`이 반환하는 로딩 상태. 중복 클릭 방지와 UX 개선에 활용   |
| `sessionStorage.removeItem()` | 제출 완료 후 임시 데이터 정리. 메모리 위생 관리                       |
| 4단계 API 연동 패턴           | 타입 → API 함수 → mutation 훅 → 컴포넌트 (모든 API에 동일 적용)       |

---

## Phase 7: 탭 접근 제어 — sessionStorage로 신청 완료 상태 관리

### 배경: 왜 이 작업이 필요한가?

학종 서비스는 3개 탭으로 구성되어 있습니다:

```
[서비스 안내] ─ [평가 신청하기] ─ [평가 리포트]
     탭 0             탭 1             탭 2
```

문제: 사용자가 "평가 신청하기"에서 신청을 완료하고 리포트 페이지로 이동했지만, 이후 "평가 리포트" 탭을 직접 클릭하면 **"평가 신청을 먼저 완료해주세요"** 경고가 뜨며 접근이 차단되었습니다. 신청을 완료했는데도 탭이 열리지 않는 상황이었습니다.

**원인**: Navigator 컴포넌트에서 `isApplyCompleted`가 항상 `false`로 하드코딩되어 있었기 때문입니다.

### Step 29: 전체 흐름 이해 — 탭 내비게이션 구조

#### 라우트 구조

```
apps/early/app/(early)/hakjong/
├── layout.tsx          → EarlyHakjongNavigator (탭 내비게이션)
├── page.tsx            → EarlyHakjongIntro (서비스 안내)
├── apply/
│   ├── page.tsx        → EarlyHakjong (신청 폼)
│   └── confirm/
│       └── page.tsx    → EarlyHakjongConfirm (확인/제출)
└── report/
    └── page.tsx        → EarlyHakjongReport (리포트)
```

`layout.tsx`에 `EarlyHakjongNavigator`가 있으므로, hakjong 하위의 모든 페이지에서 탭이 공통으로 표시됩니다. 탭을 클릭하면 Next.js 라우트가 변경되면서 해당 페이지 컴포넌트가 렌더링됩니다.

#### 탭 전환 흐름

```
사용자가 "평가 리포트" 탭 클릭
  └→ Tab.Button의 onBeforeChange 호출
      └→ handleBeforeReport() 실행
          ├→ 로그인 체크 (currentUser.userId)
          ├→ 신청 완료 체크 (isApplyCompleted)
          ├→ 결제 체크 (isPaid)
          └→ 모두 통과 시 router.push('/hakjong/report')
```

`onBeforeChange`는 `@libs/ui/Tab` 컴포넌트가 제공하는 prop으로, `false`를 반환하면 탭 전환을 차단합니다.

### Step 30: 변경 내용 — 2개 파일

#### 파일 1: `EarlyHakjongConfirm.tsx` (제출 시 상태 저장)

**변경 전:**

```typescript
onClick={() => {
  setIsConfirmOpen(false);
  sessionStorage.removeItem('hakjong_apply_form');
  router.push('/hakjong/report');
}}
```

**변경 후:**

```typescript
onClick={() => {
  setIsConfirmOpen(false);
  sessionStorage.removeItem('hakjong_apply_form');
  sessionStorage.setItem('hakjong_apply_completed', 'true');  // ← 추가
  router.push('/hakjong/report');
}}
```

추가된 한 줄의 역할:

- `sessionStorage.setItem('hakjong_apply_completed', 'true')` — 신청 완료 상태를 브라우저에 저장
- 이 값은 브라우저 탭이 열려 있는 동안 유지됩니다 (탭을 닫으면 사라짐)

#### 파일 2: `EarlyHakjongNavigator.tsx` (탭 접근 시 상태 확인)

**변경 전 (항상 false):**

```typescript
// 하드코딩된 stub — 항상 미완료 상태
const useDemoApplyCompleted = () => {
  const [isApplyCompleted] = useState(false);
  return { isApplyCompleted };
};

const useIsPaid = () => {
  const [isPaid] = useState(false);
  return { isPaid };
};

// 컴포넌트 내부
const { isPaid } = useIsPaid();
const { isApplyCompleted } = useDemoApplyCompleted();
```

**변경 후 (sessionStorage에서 읽기):**

```typescript
// 결제 플로우 미구현으로 true 고정
const isPaid = true;

// 컴포넌트 내부 — handleBeforeReport에서 직접 읽기
const handleBeforeReport = () => {
  if (!currentUser.userId) {
    alert('로그인이 필요한 서비스입니다.');
    return false;
  }
  const isApplyCompleted = sessionStorage.getItem('hakjong_apply_completed') === 'true';
  if (!isApplyCompleted) {
    alert('평가 신청을 먼저 완료해주세요.');
    return false;
  }
  if (!isPaid) {
    alert('서비스 결제가 필요한 서비스입니다.');
    return false;
  }
  router.push('/hakjong/report');
  return true;
};
```

### Step 31: sessionStorage를 선택한 이유

상태를 저장하는 여러 방법이 있지만, 현재 상황에서 sessionStorage가 적합한 이유를 비교합니다:

| 방법                | 장점                                | 단점                               | 적합 여부    |
| ------------------- | ----------------------------------- | ---------------------------------- | ------------ |
| **sessionStorage**  | 같은 탭 내에서 페이지 이동해도 유지 | 탭을 닫으면 사라짐                 | ✅ 현재 최적 |
| `useState`          | 가장 간단                           | 페이지 이동(라우트 변경) 시 사라짐 | ❌           |
| `localStorage`      | 브라우저를 닫아도 유지              | 수동 삭제 필요, 다른 탭에도 영향   | △ 과도함     |
| Redux store         | 전역 상태로 어디서든 접근           | 새로고침 시 사라짐, 설정이 복잡    | △ 과도함     |
| URL params          | 공유 가능, 서버에서도 접근          | 민감 정보 노출 위험                | ❌           |
| **서버 API (추후)** | 가장 신뢰할 수 있는 방법            | API 구현 필요                      | ✅ 최종 목표 |

**현재 선택**: API가 없으므로 sessionStorage로 임시 관리합니다. 같은 브라우저 탭 내에서 "신청 → 확인 → 리포트 → 탭 클릭"의 흐름이 자연스럽게 동작합니다.

**한계**: 새 탭을 열거나 브라우저를 닫으면 상태가 사라집니다. 이는 API 연동 시 해결됩니다.

### Step 32: `onBeforeChange`에서 sessionStorage를 읽는 위치가 중요한 이유

```typescript
// ⚠️ 잘못된 방법 — 컴포넌트 최상위에서 한 번만 읽기
const isApplyCompleted =
  sessionStorage.getItem('hakjong_apply_completed') === 'true';

const handleBeforeReport = () => {
  if (!isApplyCompleted) { ... }  // ← 항상 처음 읽은 값 사용
};
```

```typescript
// ✅ 올바른 방법 — 핸들러 함수 안에서 읽기
const handleBeforeReport = () => {
  const isApplyCompleted =
    sessionStorage.getItem('hakjong_apply_completed') === 'true';
  if (!isApplyCompleted) { ... }  // ← 클릭할 때마다 최신 값 확인
};
```

**이유**: React 컴포넌트는 렌더링 시점에 최상위 코드를 실행합니다. 만약 `isApplyCompleted`를 컴포넌트 최상위에서 읽으면, **컴포넌트가 마운트된 시점**의 값이 고정됩니다. 이후 다른 페이지에서 sessionStorage 값이 바뀌어도, Navigator 컴포넌트가 리렌더링되지 않는 한 이전 값을 계속 사용합니다.

핸들러 함수 안에서 읽으면, **탭을 클릭하는 시점**에 항상 최신 값을 확인합니다.

```
[컴포넌트 마운트 시점]
  sessionStorage: hakjong_apply_completed = 없음
  최상위에서 읽으면: isApplyCompleted = false (고정됨)

[사용자가 신청 완료 후 돌아옴]
  sessionStorage: hakjong_apply_completed = 'true'
  최상위 값: 여전히 false ❌ (리렌더링 안 됨)
  핸들러에서 읽으면: true ✅ (클릭 시점에 읽음)
```

> **핵심**: `sessionStorage`는 React 상태가 아니므로 값이 바뀌어도 리렌더링을 트리거하지 않습니다. 따라서 이벤트 핸들러 안에서 읽어야 항상 최신 값을 사용할 수 있습니다.

### Step 33: `isPaid`를 `true`로 고정한 이유

```typescript
// TODO: 결제 API 연동 시 실제 결제 상태로 대체
const isPaid = true;
```

현재 결제 플로우가 구현되지 않았습니다. `isPaid`가 `false`이면 신청을 완료해도 리포트 탭이 열리지 않습니다. 개발 중에 불필요한 차단을 피하기 위해 `true`로 고정했습니다.

탭 접근 체크 순서:

```
"평가 리포트" 탭 클릭
  ├→ 1. 로그인 확인 → 실패 시 "로그인이 필요합니다"
  ├→ 2. 신청 완료 확인 → 실패 시 "신청을 먼저 완료해주세요"
  ├→ 3. 결제 확인 → 실패 시 "결제가 필요합니다"
  └→ 모두 통과 → router.push('/hakjong/report')
```

가드(guard) 패턴에서 순서가 중요합니다. 가장 기본적인 조건(로그인)부터 체크하고, 점점 구체적인 조건(결제)으로 넘어갑니다. 이를 **가드 절(guard clause)** 또는 **early return 패턴**이라 합니다.

---

### Phase 7 정리: API 연동 시 변경해야 할 내용

API가 확정되면 아래 내용을 순서대로 변경합니다:

#### 변경 1: 신청 완료 상태 — sessionStorage → API 조회

**현재 (sessionStorage):**

```typescript
// EarlyHakjongConfirm.tsx — 저장
sessionStorage.setItem('hakjong_apply_completed', 'true');

// EarlyHakjongNavigator.tsx — 읽기
const isApplyCompleted = sessionStorage.getItem('hakjong_apply_completed') === 'true';
```

**API 연동 후:**

```typescript
// EarlyHakjongNavigator.tsx
import { useQuery } from '@tanstack/react-query';

// 컴포넌트 내부
const { data: applyStatus } = useQuery({
  queryKey: ['hakjong', 'apply', 'status'],
  queryFn: () => fetchHakjongApplyStatus(), // GET /hakjong/apply/status
  enabled: !!currentUser.userId,
});
const isApplyCompleted = applyStatus?.isApplyCompleted ?? false;
```

- `sessionStorage.setItem` 제거 (EarlyHakjongConfirm.tsx)
- `sessionStorage.getItem` 제거 (EarlyHakjongNavigator.tsx의 handleBeforeReport)
- `useQuery`로 서버에서 상태 조회
- `enabled: !!currentUser.userId` — 로그인한 경우에만 API 호출

#### 변경 2: 결제 상태 — 하드코딩 → API 조회

**현재:**

```typescript
const isPaid = true;
```

**API 연동 후:**

```typescript
const { data: paymentStatus } = useQuery({
  queryKey: ['hakjong', 'payment', 'status'],
  queryFn: () => fetchHakjongPaymentStatus(), // GET /hakjong/payment/status
  enabled: !!currentUser.userId,
});
const isPaid = paymentStatus?.isPaid ?? false;
```

#### 변경 3: handleBeforeReport 가드 로직 재구성

API 조회는 비동기이므로 데이터 로딩 중 상태도 처리해야 합니다:

```typescript
const handleBeforeReport = () => {
  if (!currentUser.userId) {
    alert('로그인이 필요한 서비스입니다.');
    return false;
  }
  // isApplyCompleted는 이제 useQuery의 data에서 가져옴 (컴포넌트 레벨)
  if (!isApplyCompleted) {
    alert('평가 신청을 먼저 완료해주세요.');
    return false;
  }
  if (!isPaid) {
    alert('서비스 결제가 필요한 서비스입니다.');
    return false;
  }
  router.push('/hakjong/report');
  return true;
};
```

> `useQuery`는 React 상태로 관리되므로, 데이터가 바뀌면 자동으로 리렌더링됩니다. sessionStorage와 달리 핸들러 안에서 읽을 필요 없이 컴포넌트 최상위에서 사용해도 항상 최신 값입니다.

#### 변경 파일 요약

| 순서 | 파일                        | 현재 (임시)                        | API 연동 후                                                      |
| ---- | --------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| 1    | `EarlyHakjongConfirm.tsx`   | `sessionStorage.setItem(...)` 저장 | 해당 줄 **삭제** (서버가 상태 관리)                              |
| 2    | `EarlyHakjongNavigator.tsx` | `sessionStorage.getItem(...)` 읽기 | `useQuery`로 서버 조회                                           |
| 3    | `EarlyHakjongNavigator.tsx` | `const isPaid = true` 하드코딩     | `useQuery`로 결제 상태 조회                                      |
| 4    | `hakjong.types.ts` (신규)   | —                                  | `HakjongApplyStatus`, `HakjongPaymentStatus` 타입 추가           |
| 5    | `api/index.ts` (신규)       | —                                  | `fetchHakjongApplyStatus`, `fetchHakjongPaymentStatus` 함수 추가 |

| 새로 배운 핵심 개념              | 설명                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- |
| `sessionStorage.setItem/getItem` | 같은 브라우저 탭 내에서 페이지 간 상태 공유. API 없이 임시 상태 관리에 활용 |
| `onBeforeChange`                 | Tab 컴포넌트의 탭 전환 전 검증 hook. `false` 반환 시 전환 차단              |
| 가드 절(guard clause)            | 조건 불충족 시 `return false`로 빠르게 탈출. 중첩 if문 대신 사용            |
| 핸들러 내부에서 외부 값 읽기     | sessionStorage는 React 상태가 아니므로 이벤트 시점에 읽어야 최신 값 보장    |

---

## Phase 8: 컴포넌트 로직 정리 — 커스텀 훅으로 분리하기

### 배경: 왜 컴포넌트에서 로직을 분리해야 하는가?

`EarlyHakjongApply.tsx`와 `EarlyHakjongNavigator.tsx`를 만들면서 컴포넌트 안에 점점 많은 로직이 쌓였습니다.

- **Apply**: 드롭다운 옵션 변환(`useMemo` 4개) + 선택 상태(`useState` 2개) + 카드 추가/삭제 핸들러 + JSX 렌더링
- **Navigator**: 탭 이동 가드(로그인/결제/신청완료 검사) + 라우팅 + JSX 렌더링

이렇게 한 컴포넌트가 **데이터 변환 + 상태 관리 + 비즈니스 규칙 + 화면 렌더링**을 모두 담당하면 다음 문제가 생깁니다.

1. **읽기 어려움** — JSX 사이사이에 `useState`, `useMemo`, 핸들러 함수가 섞여 화면 구조를 파악하기 어렵습니다.
2. **재사용 불가** — 같은 로직이 다른 컴포넌트에 필요하면 복사·붙여넣기 해야 합니다.
3. **테스트 불편** — 컴포넌트 전체를 렌더링해야 로직을 검증할 수 있습니다.
4. **변경 영향 범위가 큼** — 가드 로직 하나 바꾸려고 신청 폼 컴포넌트 전체를 열어야 합니다.

### 핵심 개념: 커스텀 훅(custom hook)이란?

**`use`로 시작하는 함수**를 만들어 컴포넌트 안의 로직을 떼어낸 것입니다. 내부에서 `useState`, `useEffect`, `useMemo` 같은 React 훅을 자유롭게 사용할 수 있습니다.

```typescript
// 일반 함수 — useState 같은 React 훅 사용 불가
function getApplyOptions() {
  const [state, setState] = useState(...); // ❌ 에러
}

// 커스텀 훅 — use로 시작하므로 내부에서 React 훅 사용 가능
function useApplyOptions() {
  const [state, setState] = useState(...); // ✅ 가능
  return { state, setState };
}
```

> **퍼블리싱 비유로 이해하면:**
> CSS에서 자주 쓰는 스타일을 `mixin`이나 `class`로 빼서 재사용하는 것과 비슷합니다. 컴포넌트의 "행동(로직)" 버전이라고 생각하면 됩니다.

---

### Step 34: 분리 대상 식별 — 무엇을 훅으로 빼야 하나?

**판단 기준 3가지:**

1. **여러 컴포넌트에서 쓰이는가?** → 재사용 가치 있음
2. **한 가지 책임으로 묶이는가?** → 응집도 높은 단위
3. **컴포넌트 외부에서도 의미가 있는가?** → 비즈니스 규칙으로 추출 가능

`EarlyHakjongApply`와 `EarlyHakjongNavigator`를 분석하면:

| 로직 종류                 | Apply 사용 | Navigator 사용 | 분리 단위                  |
| ------------------------- | ---------- | -------------- | -------------------------- |
| 대학·학과 옵션 변환       | ✅         | ❌             | `useApplyDropOptions`      |
| 드롭다운 선택 상태        | ✅         | ❌             | `useHakjongApplyForm`      |
| 카드 추가/삭제            | ✅         | ❌             | `useHakjongApplyForm`      |
| 탭 초기 인덱스 계산       | ❌         | ✅             | `useHakjongNavigation`     |
| 탭 이동 전 로그인/결제 검사 | ❌         | ✅             | `useHakjongNavigation`     |

→ **3개 훅으로 분리** 가능합니다.

---

### Step 35: `useApplyDropOptions` — 데이터 변환 훅

#### 분리 전 (컴포넌트 내부)

```tsx
export const EarlyHakjongApply = () => {
  const { data: univMajorData } = useUnivMajorListAndMajorTheme();

  const universityOptions = useMemo(
    () =>
      univMajorData?.universities.map((univ) => ({
        label: univ.universityName,
        value: String(univ.universityId),
      })) ?? [],
    [univMajorData?.universities],
  );

  const majorCategoryOptions = useMemo(
    () =>
      univMajorData?.minorMajorCategories.map((major) => ({
        label: major.minorMajorCategoryName,
        value: major.minorMajorCategoryCode,
      })) ?? [],
    [univMajorData?.minorMajorCategories],
  );

  // ... 다른 로직과 JSX
};
```

#### 분리 후 (`entities/hakjong/model/useApplyDropOptions.ts`)

```typescript
import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search/model/university-major-search.queries';
import { useMemo } from 'react';
import { StringDropDownOption } from './hakjong.types';

export const useApplyDropOptions = () => {
  const { data: univMajorData } = useUnivMajorListAndMajorTheme();

  // DropDown 컴포넌트가 받는 형태로 변환
  const universityOptions = useMemo<StringDropDownOption[]>(
    () =>
      univMajorData?.universities.map((univ) => ({
        label: univ.universityName,
        value: String(univ.universityId),
      })) ?? [],
    [univMajorData?.universities],
  );

  const majorCategoryOptions = useMemo<StringDropDownOption[]>(
    () =>
      univMajorData?.minorMajorCategories.map((major) => ({
        label: major.minorMajorCategoryName,
        value: major.minorMajorCategoryCode,
      })) ?? [],
    [univMajorData?.minorMajorCategories],
  );

  return {
    universityOptions,
    majorCategoryOptions,
  };
};
```

#### 컴포넌트에서 사용

```tsx
export const EarlyHakjongApply = () => {
  const { universityOptions, majorCategoryOptions } = useApplyDropOptions();
  // 이제 컴포넌트는 변환 로직을 모릅니다 — 결과만 받아서 씁니다
};
```

#### 핵심 학습 포인트

- **`useMemo`의 역할**: 의존성(`univMajorData?.universities`)이 바뀌지 않으면 같은 결과를 재사용합니다. 컴포넌트가 다시 렌더링될 때마다 `map`을 다시 실행하지 않게 하는 최적화입니다.
- **`?? []` (null 병합 연산자)**: API 응답이 아직 오지 않았을 때(`undefined`) 빈 배열을 반환합니다. `DropDown`이 `options.map(...)`을 호출할 때 에러나지 않도록 하는 안전장치입니다.
- **`useMemo<StringDropDownOption[]>`**: 반환 타입을 명시해 다른 곳에서 잘못 사용하면 즉시 컴파일 에러가 나도록 합니다.

---

### Step 36: `useHakjongNavigation` — 탭 이동 가드 훅

#### 분리 전 (Navigator 컴포넌트 내부)

탭 이동 시 로그인/결제/신청완료 검사 로직이 컴포넌트 안에 직접 작성되어 있었습니다.

#### 분리 후 (`entities/hakjong/model/useHakjongNavigation.ts`)

```typescript
import { LOGIN_URL, PAYMENT_URL } from '@libs/config';
import { useCurrentUser } from '@libs/entities/user';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HAKJONG_STORAGE_KEY } from '../libs/const';

const isPaid = true; // TODO: 결제 API 연동 시 대체

export const useHakjongNavigation = () => {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : '';

  // 현재 경로 기반 초기 탭 인덱스
  const getInitTab = () => {
    if (pathname.endsWith('/apply') || pathname.endsWith('/confirm')) return 1;
    if (pathname.endsWith('/report')) return 2;
    return 0;
  };

  // 신청 탭 클릭 시 가드
  const handleTabBeforeApply = () => {
    if (!currentUser.userId) {
      alert('로그인이 필요한 서비스입니다.');
      return false;
    }
    if (!isPaid) {
      alert('서비스 결제가 필요한 서비스입니다.');
      return false;
    }
    // ⚠️ 핸들러 내부에서 sessionStorage 읽기 (이유는 Step 38 참고)
    const isApplyCompleted =
      sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true';
    if (isApplyCompleted) {
      router.push('/hakjong/report');
    } else {
      router.push('/hakjong/apply');
    }
    return true;
  };

  // 리포트 탭 클릭 시 가드
  const handleTabBeforeReport = () => {
    if (!currentUser.userId) {
      alert('로그인이 필요한 서비스입니다.');
      return false;
    }
    const isApplyCompleted =
      sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true';
    if (!isApplyCompleted) {
      alert('평가 신청을 먼저 완료해주세요.');
      return false;
    }
    if (!isPaid) {
      alert('서비스 결제가 필요한 서비스입니다.');
      return false;
    }
    router.push('/hakjong/report');
    return true;
  };

  // 인트로의 "평가 신청하기" 버튼 클릭
  const handleServiceClick = () => {
    if (!currentUser.userId) {
      alert('로그인이 필요한 서비스입니다.');
      const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? '';
      window.location.href = LOGIN_URL(basePath + (pathname || ''), queryString);
      return;
    }
    if (!isPaid) {
      window.location.href = PAYMENT_URL;
      return;
    }
    router.push('/hakjong/apply');
  };

  return {
    currentUser,
    getInitTab,
    handleTabBeforeApply,
    handleTabBeforeReport,
    handleServiceClick,
  };
};
```

#### 컴포넌트에서 사용 (필요한 함수만 구조분해)

```tsx
// EarlyHakjongNavigator.tsx
export const EarlyHakjongNavigator = () => {
  const { getInitTab, handleTabBeforeApply, handleTabBeforeReport } =
    useHakjongNavigation();

  return (
    <Tab initTab={getInitTab()} modeType="type4">
      <Tab.List>
        <Tab.Button link href="/hakjong">서비스 안내</Tab.Button>
        <Tab.Button onBeforeChange={handleTabBeforeApply}>평가 신청하기</Tab.Button>
        <Tab.Button onBeforeChange={handleTabBeforeReport}>평가 리포트</Tab.Button>
      </Tab.List>
    </Tab>
  );
};

// EarlyHakjongIntro.tsx — 같은 훅에서 다른 함수만 사용
export const EarlyHakjongIntro = () => {
  const { currentUser, handleServiceClick } = useHakjongNavigation();
  // ...
};
```

#### 핵심 학습 포인트

- **하나의 훅이 여러 컴포넌트에서 부분적으로 사용됨** — Navigator는 `handleTabBeforeApply` 등을, Intro는 `handleServiceClick`만 가져갑니다.
- **각 컴포넌트가 자기 훅 인스턴스를 가짐** — Navigator의 `useHakjongNavigation()`과 Intro의 `useHakjongNavigation()`은 **별개의 인스턴스**입니다. 상태가 공유되지 않습니다. (상태 공유가 필요하면 Redux 또는 Context API를 써야 합니다.)
- **가드 절(guard clause) 패턴** — 조건 실패 시 `return false`로 즉시 탈출. 중첩 `if` 대신 평탄한 구조를 만듭니다.

---

### Step 37: 분리의 장단점 정리

#### 장점

**1. 컴포넌트 코드가 단순해짐**

`EarlyHakjongApply`에서 옵션 변환 `useMemo` 4개와 카드 상태 관리 코드가 사라져 JSX에 집중할 수 있게 됩니다.

**2. 비즈니스 로직의 테스트 가능성 향상**

훅은 단독으로 단위 테스트가 가능합니다 (`@testing-library/react`의 `renderHook` 사용). 컴포넌트 렌더링 없이 `handleTabBeforeApply` 로직만 검증할 수 있습니다.

**3. 의존성이 명확해짐**

Navigator를 보면 `useHakjongNavigation`만 import되어 있어, 이 컴포넌트가 무엇에 의존하는지 한눈에 보입니다.

**4. 변경 영향 범위 축소**

가드 로직을 수정할 때 Navigator JSX는 건드리지 않아도 됩니다. 반대로 Tab UI를 수정할 때 가드 로직은 보지 않아도 됩니다.

#### 단점

**1. 같은 훅을 여러 컴포넌트가 호출하면 상태가 공유되지 않음**

```typescript
Navigator → useHakjongNavigation()  // 인스턴스 A
Intro    → useHakjongNavigation()  // 인스턴스 B (별개)
```

상태 공유가 필요하면 Redux/Context로 올려야 합니다. 현재는 이 훅이 **함수만 반환**(상태 없음)하므로 문제 없지만, 만약 `useState`를 추가하면 컴포넌트마다 별개 상태가 됩니다.

**2. 파일 수가 늘어남**

훅을 만들 때마다 파일이 추가되어, 작은 프로젝트에서는 오히려 탐색이 번거로울 수 있습니다.

**3. 추상화의 비용**

훅 내부를 보려면 별도 파일을 열어야 합니다. 한 컴포넌트에서만 쓰는 짧은 로직을 굳이 훅으로 빼면 오히려 가독성이 떨어집니다.

> **분리 판단 기준:**
> "이 로직이 다른 컴포넌트에서도 필요하거나, 50줄 이상으로 커지거나, 단독 테스트가 필요할 때만" 분리합니다. 작은 로직 무조건 분리하는 것은 과한 추상화(over-engineering)입니다.

---

### Step 38: 실전 함정 — SSR 환경에서 sessionStorage 호출 시 500 에러

#### 발생한 문제

`useHakjongNavigation`을 처음 작성했을 때 다음과 같이 훅 본문 최상단에서 `sessionStorage`를 호출했습니다.

```typescript
export const useHakjongNavigation = () => {
  // ...
  const isApplyCompleted =
    sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true';
  // ↑ 훅이 실행될 때마다 즉시 호출됨

  const handleTabBeforeApply = () => {
    if (isApplyCompleted) { ... }
  };
};
```

→ 페이지 접속 시 **500 Internal Server Error** 발생.

#### 원인 분석

Next.js의 `'use client'` 컴포넌트도 **첫 화면 표시 속도를 위해 서버에서 미리 한 번 렌더링(SSR)**합니다. 이때 Node.js 환경에는 `sessionStorage`(브라우저 전용 API)가 존재하지 않기 때문에 다음 에러가 납니다.

```
ReferenceError: sessionStorage is not defined
```

서버 렌더링이 실패하면 HTTP 500이 응답됩니다.

#### 컴포넌트 생명주기 관점에서 이해하기

```
[1] 사용자 페이지 접속
     ↓
[2] Next.js 서버에서 컴포넌트 렌더링 (SSR)
     ↓ ← 이 시점에 useHakjongNavigation() 실행됨
     ↓ ← sessionStorage 호출 → 💥 ReferenceError
     ↓
[3] HTML을 브라우저로 전송
     ↓
[4] 브라우저에서 hydration (다시 렌더링)
     ↓ ← 이 시점부터는 sessionStorage 사용 가능
     ↓
[5] 사용자가 탭 클릭 → 핸들러 실행
```

→ `[2]` 단계에서 실행되는 코드는 **브라우저 API를 쓸 수 없습니다**.
→ `[5]` 단계에서만 실행되는 코드(이벤트 핸들러 내부)는 **항상 브라우저에서 실행되므로 안전**합니다.

#### 해결 방법: sessionStorage 호출을 핸들러 내부로 이동

```typescript
// ✅ 수정 후
export const useHakjongNavigation = () => {
  const handleTabBeforeApply = () => {
    if (!currentUser.userId) { ... }
    if (!isPaid) { ... }

    // 이벤트 핸들러 내부 → 클릭 시점(브라우저)에만 실행됨
    const isApplyCompleted =
      sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true';

    if (isApplyCompleted) { ... }
  };
};
```

#### 다른 해결 방법들

| 방법                                                       | 장점                          | 단점                                                |
| ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------- |
| **(A) 핸들러 내부로 이동** ✅ 채택                          | 가장 단순, 항상 최신 값       | 핸들러가 여러 번이면 코드 중복                      |
| (B) `typeof window !== 'undefined'` 체크                    | 훅 본문에서도 호출 가능        | SSR 시점엔 항상 `false`로 평가되어 의미 흐려짐      |
| (C) `useEffect` + `useState`로 클라이언트 마운트 후 읽기    | React 상태로 관리, 자동 리렌더링 | 첫 렌더링에 잠깐 `false` 노출(깜빡임 가능성)        |
| (D) `useSyncExternalStore`                                  | React 18 공식 패턴            | 학습 곡선 있음, 보일러플레이트 많음                 |

이 프로젝트는 **(A) 핸들러 내부 호출**이 적합한 이유:

- `isApplyCompleted` 값이 화면 렌더링에 영향을 주지 않음 (탭 클릭 시점에만 필요)
- React 상태로 관리할 필요가 없음 (자동 리렌더링 불필요)
- 코드가 가장 단순함

#### 핵심 학습 포인트

| 개념                              | 설명                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| **SSR (Server-Side Rendering)**   | Next.js가 첫 화면을 서버에서 미리 렌더링하는 것. 브라우저 API(`window`, `sessionStorage`, `localStorage`, `document`)는 사용 불가 |
| **Hydration**                     | 서버가 만든 HTML에 브라우저가 이벤트 핸들러를 다시 붙이는 과정                      |
| **`'use client'`도 SSR 대상**     | 클라이언트 컴포넌트도 **첫 렌더링은 서버에서** 실행됨. 완전히 클라이언트 전용이 아님 |
| **이벤트 핸들러는 SSR 안 됨**     | 핸들러 내부 코드는 사용자 상호작용 시점에만 실행되므로 브라우저 API 안전           |

> **체크리스트:** 코드를 작성할 때 `window`, `sessionStorage`, `localStorage`, `document`를 쓴다면 다음 중 하나여야 합니다.
> 1. 이벤트 핸들러 내부
> 2. `useEffect` 내부
> 3. `typeof window !== 'undefined'` 가드 뒤

---

### Step 39: 향후 구조 개선 방향

현재 분리된 구조도 충분히 좋지만, 프로젝트가 더 커지면 다음과 같이 개선할 여지가 있습니다.

#### 개선 1: 한 훅이 두 가지 책임을 가질 때 분리

만약 `useHakjongNavigation`이 탭 가드 로직과 폼 상태 관리를 모두 담는다면 **단일 책임 원칙(SRP)**을 위반합니다. 다음과 같이 나눌 수 있습니다.

```
useHakjongHandler (가상의 통합 훅)
    ├── useHakjongNavigation  ← 라우팅 가드만
    └── useHakjongApplyForm   ← 드롭다운/카드 상태만
```

판단 기준: **"이 두 로직이 서로 다른 이유로 변경되는가?"**
- 가드 로직은 결제/로그인 정책 변경 시 수정 → A 이유
- 폼 상태는 입력 항목 추가 시 수정 → B 이유
- 서로 다른 이유로 변경됨 → 분리 권장

#### 개선 2: sessionStorage 키를 한 곳에 응집

이미 `HAKJONG_STORAGE_KEY` 상수로 관리하고 있어 좋은 패턴입니다. 추가로 다음을 고려:

```typescript
// ❌ 키 직접 호출이 여러 곳에 흩어짐
sessionStorage.setItem('hakjong_apply_complete', 'true');
sessionStorage.getItem('hakjong_apply_complete');

// ✅ 헬퍼 함수로 한 번 더 감싸기
// libs/hakjongStorage.ts
export const hakjongStorage = {
  setApplyComplete: (value: boolean) =>
    sessionStorage.setItem(HAKJONG_STORAGE_KEY.applyComplete, String(value)),
  getApplyComplete: () =>
    sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true',
};
```

장점:
- `String(value) === 'true'` 변환을 매번 안 써도 됨
- 키 이름과 값 직렬화 방식이 한 곳에 응집
- 테스트 시 이 객체만 모킹(mocking)하면 됨

#### 개선 3: API 연동 시 React Query로 이전

[Phase 7 정리](#phase-7-정리-api-연동-시-변경해야-할-내용)에서 다룬 것처럼, sessionStorage 의존을 제거하고 `useQuery`로 서버 상태를 관리하면:

- SSR 호환성 자동 확보 (React Query는 서버에서도 동작)
- 자동 캐싱 및 백그라운드 갱신
- 로딩/에러 상태 자동 처리

```typescript
// 최종 목표 형태
export const useHakjongNavigation = () => {
  const { data: applyStatus } = useApplyStatusQuery();
  const isApplyCompleted = applyStatus?.isApplyCompleted ?? false;

  const handleTabBeforeReport = () => {
    if (!isApplyCompleted) { ... } // sessionStorage 호출 사라짐
  };
};
```

---

### Phase 8 정리

| 새로 배운 핵심 개념              | 설명                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| **커스텀 훅 (custom hook)**       | `use`로 시작하는 함수. 컴포넌트의 로직(상태/효과/계산)을 떼어내 재사용·테스트 가능하게 만든 패턴      |
| **단일 책임 원칙 (SRP)**          | 하나의 훅/모듈은 하나의 변경 이유만 가져야 함. 서로 다른 이유로 변경되면 분리 신호                  |
| **`useMemo` 의존성 배열**         | 의존성 값이 바뀔 때만 재계산. 불필요한 `map` 반복을 방지                                            |
| **훅 인스턴스의 독립성**          | 같은 훅을 여러 컴포넌트에서 호출하면 각각 별개 인스턴스. 상태 공유 안 됨                            |
| **SSR과 브라우저 API의 충돌**     | `'use client'`도 첫 렌더링은 서버에서 실행. `sessionStorage` 등 브라우저 API는 SSR 시점에 사용 불가 |
| **Hydration**                     | 서버 HTML에 브라우저가 이벤트 핸들러를 붙이는 과정                                                  |
| **이벤트 핸들러 내부의 안전성**   | 사용자 상호작용 시점에만 실행되므로 `sessionStorage` 등 브라우저 API 호출 가능                      |
| **분리 판단 기준**                | 재사용성, 단일 책임, 테스트 필요성 — 셋 중 하나 이상 충족할 때만 분리. 무조건 분리는 과한 추상화    |

**파일 구조 결과:**

```
apps/early/src/entities/hakjong/
├── api/
│   └── index.ts
├── libs/
│   └── const.ts                      ← HAKJONG_STORAGE_KEY, periodDate, majorTypeOptions
├── model/
│   ├── hakjong.types.ts
│   ├── hakjong.queries.ts
│   ├── useApplyDropOptions.ts        ← 데이터 변환 훅
│   ├── useHakjongNavigation.ts       ← 라우팅 가드 훅
│   └── useHakjongHandler.ts          ← (드롭다운/카드 상태 훅 — 추후 useHakjongApplyForm으로 리네임 권장)
└── ui/
```

**컴포넌트별 사용 훅:**

| 컴포넌트                  | 사용 훅                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `EarlyHakjongIntro`       | `useHakjongNavigation` (handleServiceClick)                      |
| `EarlyHakjongNavigator`   | `useHakjongNavigation` (getInitTab, handleTabBefore*)            |
| `EarlyHakjongApply`       | `useApplyDropOptions` + `useHakjongHandler` (드롭다운/카드 상태) |
| `EarlyHakjongConfirm`     | (페이지별 자체 로직)                                             |
| 임시 구현 → API 전환 패턴        | 하드코딩/sessionStorage로 먼저 동작 확인 후, API 확정 시 `useQuery`로 교체  |

---

## Phase 9: 백엔드 미구현 엔드포인트 안전 호출 — `throwOnError` 우회 패턴

### 배경: 왜 이 패턴이 필요한가?

학종 서비스를 개발하다 보면, 프론트 코드는 먼저 작성되었지만 **서버 측 엔드포인트가 아직 구현되지 않은 시점**이 자주 발생합니다.

예: stepbar의 사용자 진행 상태를 보여주는 `/user-status` 엔드포인트가 백엔드에서 아직 구현되지 않았다고 가정합시다. 프론트에서는 이미 `useUserStatusQuery`를 호출하고 있고, 그 결과로 stepbar 각 단계의 완료 여부를 표시하는 UI도 짜여 있습니다.

이 상태에서 페이지를 열면 다음과 같은 에러가 발생하며 **stepbar뿐 아니라 페이지 전체가 깨집니다**:

```
Uncaught Error: Cannot GET /jh/api/high3/user-status
    at throwOnError (ReactQueryProvider.tsx:29)
    at useUserStatusQuery (user-status.queries.ts:13)
    at useStepBar (useStepBar.ts:22)
    at EarlyStepbar (EarlyStepbar.tsx:18)
```

API 한 개가 미구현인데, 왜 페이지 전체가 흰 화면이 되는지 — 그 원리와 정공법이 이번 Phase의 주제입니다.

---

### 핵심 개념 ①: 글로벌 `throwOnError` 정책

이 프로젝트의 React Query는 [libs/app/provider/ReactQueryProvider.tsx](../libs/app/provider/ReactQueryProvider.tsx)에서 다음과 같이 설정되어 있습니다.

```tsx
// libs/app/provider/ReactQueryProvider.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2500,
      gcTime: 2500,
      retry: 1,
      throwOnError(error, query) {
        // Next.js의 전역 `error.js`에서 감지하도록 던짐
        throw new Error(APIError.message(error));
      },
    },
  },
});
```

**`throwOnError`의 동작:**

- 기본 React Query: 쿼리가 실패하면 `useQuery({ data, error, isError })`에 `error`가 담겨 옵니다. 컴포넌트는 `if (isError) return <Fallback />` 같은 분기로 직접 처리합니다.
- **이 프로젝트의 설정**: 쿼리 실패 시 **렌더링 도중에 `throw`** 합니다. 즉 에러가 React 트리를 타고 위로 올라가 가장 가까운 Error Boundary(`error.js`)에서 잡힙니다.

이 설계의 의도는 "API 에러는 전역으로 일관되게 처리한다"입니다. 모든 컴포넌트가 일일이 에러 처리 코드를 쓰지 않아도 되니까요.

**하지만 부작용:**

- 한 쿼리가 실패하면, 그 쿼리를 부른 컴포넌트가 throw → 그 위 컴포넌트도 함께 unmount → 페이지 전체가 Error Boundary로 대체됩니다.
- 따라서 **선택적으로 빠질 수 있는 데이터**(예: stepbar의 진행률 — 없어도 페이지가 동작해야 함)에도 이 정책이 적용되면, "있어도 좋고 없어도 되는" 데이터가 페이지를 통째로 무너뜨립니다.

ReactQueryProvider 자체에 이미 안내 주석이 있습니다.

```tsx
/**
 * @memo
 * `throwOnError` 옵션을 사용하면, 쿼리에서 에러가 발생하면 해당 쿼리를 사용하는 컴포넌트에서 에러를 핸들링할 수 없음.
 * 개별 컴포넌트에서 에러처리가 필요한 경우, useQuery 옵션에 throwOnError: false 설정하세요.
 */
```

이 안내가 이번 Phase의 정답입니다.

---

### 핵심 개념 ②: 옵트아웃(opt-out)

글로벌 정책을 **유지하면서**, 특정 쿼리만 정책에서 빠지게 만드는 방식을 옵트아웃이라고 합니다. React Query는 `useQuery`의 옵션에서 `throwOnError: false`를 지정하면 해당 쿼리만 글로벌 정책을 덮어씁니다.

```tsx
useQuery({
  queryKey: [...],
  queryFn: ...,
  throwOnError: false, // ← 이 쿼리만 글로벌 정책에서 빠짐
});
```

옵트아웃된 쿼리는 실패해도 throw하지 않고, `data`가 `undefined`인 상태로 컴포넌트에 전달됩니다. 즉 **호출부가 `undefined`를 안전하게 처리할 수만 있다면**, 백엔드 미구현 상태에서도 페이지가 정상 렌더됩니다.

---

### Step 40: 옵트아웃 적용 — `useUserStatusQuery` 예시

**파일: [apps/early/src/entities/user-status/model/user-status.queries.ts](../apps/early/src/entities/user-status/model/user-status.queries.ts)**

```tsx
export function useUserStatusQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userStatusQueries.status(userId).queryKey,
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId && enabled,
    // 서버 `/user-status` 엔드포인트 구현 완료 후 이 옵션 제거 — 호출부 fallback(`?? 0`, `?? false`)으로 안전하게 degrade
    throwOnError: false,
  });
}
```

추가된 부분은 단 두 줄(주석 + 옵션)입니다. 이 한 줄로 stepbar가 더 이상 페이지를 깨뜨리지 않습니다.

**왜 코멘트를 다는가?**

이 코드를 처음 보는 사람은 "왜 이 쿼리만 글로벌 정책을 빠져나가지?"라는 의문을 가집니다. 의도를 명시해야 백엔드 구현 완료 시점에 누군가 이 옵션을 제거하는 것을 잊지 않습니다. 일반적으로 코드 코멘트는 최소화하지만, **글로벌 정책을 덮어쓰는 경우에는 그 이유를 적어두는 것이 옳습니다**.

---

### Step 41: 호출부 fallback 설계

옵트아웃 자체는 단순합니다. 하지만 **그것만으로는 충분하지 않습니다**. 옵트아웃된 쿼리는 실패 시 `data`가 `undefined`로 전달되므로, 호출부가 그 `undefined`를 처리하지 못하면 다른 종류의 런타임 에러가 납니다.

**나쁜 예 (호출부에 fallback 없음):**

```tsx
const { data: userStatus } = useUserStatusQuery(userId);
const count = userStatus.mockApplicationCount; // ❌ TypeError: Cannot read property 'mockApplicationCount' of undefined
```

**좋은 예 ([useStepBar.ts](../apps/early/src/shared/model/hooks/useStepBar.ts)):**

```tsx
const { data: userStatus } = useUserStatusQuery(currentUser?.userId, !currentUser?.isLoading);

const mockApplicationCount = userStatus?.mockApplicationCount ?? 0;   // ← Optional chaining + Nullish coalescing
const scoreDisclosureCount = userStatus?.scoreDisclosureCount ?? 0;

const step = [
  // ...
  {
    id: 2,
    label: '교과성적',
    result: {
      active: userStatus?.isNesinGradeInput ?? false,                  // ← undefined → false
      value: userStatus?.isNesinGradeInput ? '입력완료' : '입력하기',
    },
  },
  // ...
];
```

**두 연산자의 조합 패턴:**

| 연산자                              | 동작                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| Optional chaining `?.`              | 왼쪽이 `undefined`/`null`이면 평가를 멈추고 `undefined` 반환 |
| Nullish coalescing `??`             | 왼쪽이 `undefined`/`null`이면 오른쪽 값 사용                  |
| 조합 `userStatus?.field ?? default` | `userStatus`가 없으면 → `undefined ?? default` → `default` |

이 조합으로 모든 사용처에서 안전한 기본값(빈 상태, `false`, `0`)을 보장하면, 백엔드 미구현 상태에서도 stepbar는 "아무것도 완료되지 않은 초기 상태"로 자연스럽게 표시됩니다.

---

### Step 42: 옵트아웃을 써도 되는 쿼리 vs 쓰면 안 되는 쿼리

모든 미구현 API에 `throwOnError: false`를 남발해서는 안 됩니다. 판단 기준:

| 상황                                              | 적용 여부 | 이유                                                                                    |
| ------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| stepbar 진행 상태 (`/user-status`)                | ✅ 적용    | 없어도 페이지의 핵심 기능은 동작. 그저 진행률이 초기값으로 보일 뿐                       |
| 평가 신청 페이지의 사용자 정보 조회               | ❌ 부적합  | 사용자 정보 없이는 신청 자체가 불가능. 에러를 던져서 사용자에게 알리는 것이 맞음           |
| 리포트 페이지의 평가 결과 데이터                  | ❌ 부적합  | 데이터 자체가 페이지의 존재 이유. 에러면 페이지를 닫는 것이 맞음                          |
| 우상단 알림 뱃지 개수                             | ✅ 적용    | 부수적 정보. 실패 시 뱃지를 안 보이는 것이 페이지 전체를 막는 것보다 나음                |

**판단 한 줄 요약**: 이 데이터가 없으면 페이지를 보여주는 의미가 사라지는가? **그렇다면 throw가 맞고, 아니면 옵트아웃이 맞습니다.**

---

### Step 43: 백엔드 구현 완료 후 제거 체크리스트

`throwOnError: false`는 **임시 우회**입니다. 백엔드 엔드포인트가 준비되면 다음을 수행합니다.

1. **쿼리 옵션 제거**

   ```diff
   useQuery({
     queryKey: userStatusQueries.status(userId).queryKey,
     queryFn: () => fetchUserStatus(userId),
     enabled: !!userId && enabled,
  -  // 서버 `/user-status` 엔드포인트 구현 완료 후 이 옵션 제거 — 호출부 fallback(`?? 0`, `?? false`)으로 안전하게 degrade
  -  throwOnError: false,
   });
   ```

2. **fallback은 그대로 유지**

   호출부의 `?? 0`, `?? false`는 옵트아웃이 사라져도 그대로 둡니다. 이유:
   - 쿼리는 항상 로딩 상태로 시작하므로 `data`가 `undefined`인 시점이 존재합니다.
   - 네트워크 일시 장애나 인증 만료 등으로 일시적으로 `undefined`가 들어올 수 있습니다.
   - fallback은 옵트아웃과 별개로, **모든 쿼리 호출부에 두는 것이 일반적인 좋은 습관**입니다.

3. **실제 동작 확인**

   - 정상 응답: 쿼리 성공 → stepbar에 실제 진행률이 표시되는지
   - 의도적 실패: 백엔드에서 500을 반환했을 때 Error Boundary가 잡는지 (이때는 옵트아웃이 빠졌으니 throw 정책이 다시 적용됨)

---

### Phase 9 정리

| 새로 배운 핵심 개념                | 설명                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| **글로벌 `throwOnError` 정책**     | React Query 에러를 Error Boundary로 던지는 프로젝트 표준 동작. 일관된 에러 UX의 장점, 페이지 전체 차단의 단점 |
| **옵트아웃 (`throwOnError: false`)** | 글로벌 정책을 유지한 채 특정 쿼리만 정책에서 빼는 방식                                            |
| **Optional chaining + Nullish coalescing** | `data?.field ?? default` 패턴으로 `undefined` 안전 처리                                          |
| **degrade 가능 vs 필수 데이터**    | 없어도 페이지가 의미 있는 데이터는 옵트아웃 대상, 페이지의 존재 이유가 되는 데이터는 throw 유지   |
| **임시 우회의 정리 책임**          | 우회 코드에는 의도 코멘트를 남기고, 원인이 해소되면 제거. fallback은 그대로 유지                |

**적용 판단 한 줄:**

> 이 쿼리가 실패해도 페이지가 의미 있게 동작하는가? → 그렇다면 `throwOnError: false`, 아니면 글로벌 정책 그대로.

---

## Phase 10: 임시 제출(mock Route + sessionStorage) → 실 API 연동 전환

> 이 Phase부터 실제 코드의 이름(`AdmissionEvaluation*`)과 경로를 그대로 사용합니다. (앞 Phase의 `Hakjong*`는 학습용 추상화 명칭이며, 같은 `apps/early`의 학종 서비스를 가리킵니다.)

### 배경: 무엇을, 왜 바꿨나

신청 폼을 처음 만들 때는 백엔드가 준비되지 않아, **임시 제출 경로**로 동작을 확인했습니다.

- 신청 데이터를 Next.js Route Handler(로컬 mock, `apps/early/app/api/admission-evaluation/apply/route.ts`)로 POST → 가짜 `applyId` 발급
- 폼 입력값 **전체(코드 + 이름)**를 하나의 요청 타입(`AdmissionEvaluationApplyRequest`)으로 정의
- 그 요청 객체를 **그대로** `sessionStorage`에 저장해 확인(confirm) 페이지로 전달

실제 백엔드 API가 준비되면서, 이 임시 경로를 실 연동으로 교체했습니다. 이때 단순히 엔드포인트만 바꾼 것이 아니라 **"서버로 보낼 데이터"와 "화면 표시·복원용 데이터"의 책임을 분리**한 것이 이번 작업의 핵심입니다.

```
[이전 — 임시]                              [이후 — 실 API]
폼 전체(코드+이름)                          서버 페이로드(코드만)
   │ = 하나의 요청 타입                        │ = AdmissionEvaluationApplyRequest
   ▼                                          ▼
mock Route Handler  ──► 가짜 applyId        실 POST /admission-evaluation/apply ──► 실제 applyId
   │                                          │
   ▼                                          ▼
sessionStorage에 요청 객체 그대로 저장       sessionStorage엔 "표시·복원용 스냅샷" 별도 저장
   └─► 확인 페이지가 이름 읽어 표시            └─► 스냅샷 = 요청 + applyId + 이름(라벨)
```

---

### Step 44: API 함수 — mock Route Handler 제거하고 실 엔드포인트로

**파일: [apps/early/src/entities/admission-evaluation/api/index.ts](../apps/early/src/entities/admission-evaluation/api/index.ts)**

**변경 전 (임시 — ky로 로컬 Route Handler 직접 호출):**

```typescript
import ky from 'ky';

export const submitAdmissionEvaluationApply = async (
  requestData: AdmissionEvaluationApplyRequest,
): Promise<AdmissionEvaluationApplyResponse> => {
  const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const data = await ky
    .post(`${basePath}/api/admission-evaluation/apply`, { json: requestData })
    .json<AdmissionEvaluationApplyResponse>();
  return data;
};
```

**변경 후 (실 API — 공통 `apiClient`로 백엔드 엔드포인트 호출):**

```typescript
// 학종 신청 제출 API
export const submitAdmissionEvaluationApply = async (
  requestData: AdmissionEvaluationApplyRequest,
): Promise<AdmissionEvaluationApplyResponse> => {
  const data = await apiClient()
    .post('admission-evaluation/apply', { json: requestData })
    .json<AdmissionEvaluationApplyResponse>();
  return data;
};
```

| 구분        | 임시 (mock Route)                              | 실 API                                  |
| ----------- | ---------------------------------------------- | --------------------------------------- |
| HTTP 클라이언트 | `ky` 직접 import                               | 공통 `apiClient()` (baseURL/인증 자동)  |
| 대상 URL    | `{NEXT_PUBLIC_BASE_URL}/api/admission-evaluation/apply` (앱 내부) | `{API_URL}/admission-evaluation/apply` (백엔드) |
| `applyId`   | `route.ts`가 `Date.now()`로 생성한 가짜 값     | 서버가 발급한 실제 값                   |

> **mock Route Handler 정리**: 실 연동 후 `apps/early/app/api/admission-evaluation/apply/route.ts`는 더 이상 참조되지 않습니다. [Phase 9](#phase-9-백엔드-미구현-엔드포인트-안전-호출--throwonerror-우회-패턴)의 "임시 우회는 원인 해소 시 제거" 원칙대로, 확인 후 삭제 대상입니다.

---

### Step 45: 요청 타입 재정의 — "전송용"과 "표시·복원용"의 분리

가장 큰 변화는 **요청 타입의 의미가 바뀐 것**입니다.

**변경 전 — 요청 타입 = 폼 전체(코드 + 이름)**

```typescript
export interface AdmissionEvaluationApplyRequest {
  universityId: string;
  universityName: string;        // ← 이름까지 서버로 전송했음
  majorType: string;
  majorTypeName: string;
  minorMajorCategoryCode: string;
  minorMajorCategoryName: string;
  preferMajorCode: string;
  preferMajorName: string;
  // ... preferArea*, selfActivity1~3
}
```

이 구조는 "화면에 보여줄 이름"과 "서버에 보낼 코드"가 한 타입에 섞여 있었습니다. 임시 제출에서는 같은 객체를 sessionStorage에도 그대로 썼기 때문에 편했지만, 실제 서버는 **코드/식별자만** 필요로 합니다.

**변경 후 — 요청 타입 = 서버 페이로드(코드만)**

```typescript
// 학종 신청 제출 요청 (서버 전송 페이로드 — 코드/식별자만 전송)
export interface AdmissionEvaluationApplyRequest {
  userId: string;
  subjectNot: string;            // 비교과 추가 입력값
  majorIdHsbs: string[];         // 희망 대학 리스트(카드)의 학과 ID 목록
  preferAiPartsCodes: string[];  // 선호 전공 코드 (필수 + 선택)
  preferProvsCodes: string[];    // 선호 지역 코드 (필수 + 선택)
  emphasis1: string;
  emphasis2: string;
  emphasis3: string;
  simpleQuestion: string;        // 입시전문가 간단 질문
}
```

**폼 입력 → 서버 페이로드 매핑:**

| 서버 필드            | 폼 입력 출처                                        | 비고                                  |
| -------------------- | --------------------------------------------------- | ------------------------------------- |
| `userId`             | `currentUser.userId`                                | 로그인 사용자                         |
| `subjectNot`         | `comparativeExtraInfo` (비교과 추가 입력 영역)      |                                       |
| `majorIdHsbs`        | `selectedCards.map((c) => c.options.drop3.value)`   | 희망 대학 카드들의 학과 ID **배열**   |
| `preferAiPartsCodes` | `[drop4.value, drop4_1.value].filter(Boolean)`      | 전공 필수 + 선택, 빈 값 제거          |
| `preferProvsCodes`   | `[drop5.value, drop5_1.value].filter(Boolean)`      | 지역 필수 + 선택, 빈 값 제거          |
| `emphasis1~3`        | `selfActivity1~3` (강조하고 싶은 내용)              |                                       |
| `simpleQuestion`     | 간단 질문 Textarea (Step 48에서 신규 추가)          |                                       |

> **단일 값 → 배열의 의미 변화**: 임시 타입은 대학/계열/학과를 단일 값으로만 담았지만, 실제 신청은 "희망 대학 리스트(카드 N개)"를 보냅니다. 그래서 `majorIdHsbs`가 **배열**입니다. 카드 추가 UI([Step 12](#step-12-이벤트-핸들러-작성--사용자-동작-처리))가 이 배열의 원천입니다.

---

### Step 46: 스냅샷 타입을 요청 기준으로 정렬 (`extends`)

요청에서 이름(라벨)을 빼버리면, 확인 페이지가 보여주던 "대학명/계열명/학과명"을 잃습니다. 그래서 **표시·복원 전용 타입**을 따로 두되, 요청 타입을 `extends`해서 정렬했습니다.

```typescript
/**
 * 신청 폼 스냅샷 — sessionStorage 저장 전용.
 * 확인(confirm) 페이지의 요약 표시 + '수정하기' 시 폼 복원에 사용한다.
 * 서버 전송 페이로드(AdmissionEvaluationApplyRequest)를 그대로 포함하고,
 * 표시·복원에만 필요한 응답값(applyId)과 라벨/코드를 추가로 보관한다.
 * (emphasis 등 공통 필드는 요청 타입에서 상속받아 중복을 없앤다)
 */
export interface AdmissionEvaluationApplyFormSnapshot
  extends AdmissionEvaluationApplyRequest {
  applyId: string;
  universityId: string;
  universityName: string;
  majorType: string;
  majorTypeName: string;
  minorMajorCategoryCode: string;
  minorMajorCategoryName: string;
  preferMajorCode: string;
  preferMajorName: string;
  preferMajorChoiceCode: string;
  preferMajorChoiceName: string;
  preferAreaCode: string;
  preferAreaName: string;
  preferAreaChoiceCode: string;
  preferAreaChoiceName: string;
}
```

**왜 `extends`인가? — 단일 출처(Single Source of Truth)**

- 스냅샷이 요청 페이로드 전체를 상속하므로, `emphasis1~3` · `simpleQuestion` · `subjectNot` 같은 필드를 **두 타입에 중복 정의하지 않습니다**.
- 서버 요청 필드가 바뀌면 스냅샷에도 자동 반영 → 타입 드리프트(불일치) 방지.
- 스냅샷 = `요청` + `applyId`(서버 응답) + `이름/라벨`(화면 표시·복원용) 이라는 의미가 타입 정의만 봐도 드러납니다.

> **이전 임시 타입에는 `selfActivity1~3`가 있었지만**, 요청의 `emphasis1~3`와 의미가 같아 중복이었습니다. 정렬 과정에서 스냅샷의 `selfActivity*`를 제거하고 상속된 `emphasis*`로 통일했습니다. (확인 페이지도 `emphasis*`를 읽도록 함께 수정)

---

### Step 47: handleSubmit 재작성 — 요청 1번 만들고 스냅샷에 재사용

**파일: [apps/early/src/window/admission-evaluation/EarlyAdmissionEvaluationApply.tsx](../apps/early/src/window/admission-evaluation/EarlyAdmissionEvaluationApply.tsx)**

```typescript
// ① 서버 전송 페이로드: 카드들의 학과 ID와 선택된 코드만 전송
const requestData: AdmissionEvaluationApplyRequest = {
  userId: currentUser.userId,
  subjectNot: comparativeExtraInfo,
  majorIdHsbs: selectedCards.map((card) => card.options.drop3.value),
  preferAiPartsCodes: [drop4.value, drop4_1.value].filter(Boolean),
  preferProvsCodes: [drop5.value, drop5_1.value].filter(Boolean),
  emphasis1: selfActivity1,
  emphasis2: selfActivity2,
  emphasis3: selfActivity3,
  simpleQuestion,
};
const response = await submitApply(requestData);

// ② 확인 페이지 표시 + '수정하기' 복원용 스냅샷
//    전송 페이로드를 그대로 펼치고(...requestData), applyId·표시용 라벨만 추가
const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  applyId: response.applyId,
  universityId: drop1.value,
  universityName: drop1.label,
  majorType: drop2.value,
  majorTypeName: drop2.label,
  minorMajorCategoryCode: drop3.value,
  minorMajorCategoryName: drop3.label,
  // ... preferMajor*, preferArea* 라벨
};
sessionStorage.setItem(
  ADMISSION_EVALUATION_STORAGE_KEY.applyForm,
  JSON.stringify(snapshot),
);
router.push('/four-year-university/admission-evaluation/confirm');
```

**핵심 포인트:**

- `submitApply(requestData)` 한 번으로 서버 전송. 디버그 `console.log`는 제거.
- 스냅샷은 `{ ...requestData, ... }`로 **요청을 재사용**합니다. 요청이 스냅샷의 부분집합이라는 `extends` 관계가 코드에도 그대로 나타납니다.
- 스냅샷이 요청 전체를 담으므로, '수정하기'로 돌아왔을 때 `subjectNot`(비교과)·`simpleQuestion`까지 복원할 수 있습니다. (복원 useEffect는 [Step 21](#step-21-신청-페이지에서-이전-입력값-복원-sessionstorage-읽기) 패턴 그대로 — 마운트 후 `useEffect`에서 읽기)

---

### Step 48: 간단 질문 입력란 추가 (`simpleQuestion`)

요청에 `simpleQuestion` 필드가 생겼지만 UI에는 입력란이 없었습니다. '간단 질문하기' 섹션에 제어형 `Textarea`를 추가했습니다.

```tsx
const [simpleQuestion, setSimpleQuestion] = useState('');

// ... '간단 질문하기' 섹션 내부
<Textarea
  addId="textarea-simple-question"
  label="입시전문가에게 궁금한 점을 작성해주세요."
  mode="base"
  size="base"
  value={simpleQuestion}
  maxLength={200}
  onChange={(e) => setSimpleQuestion(e.target.value)}
/>
```

> **타입을 먼저, UI를 나중에**: 요청 타입에 필드가 생기면 `handleSubmit`에서 타입 에러로 "이 값을 어디서 채울 것인가?"를 강제로 마주하게 됩니다. 타입이 누락된 입력 UI를 잡아준 사례입니다.

---

### 이전 sessionStorage 방식과의 차이점 (정리)

| 항목            | 이전 (임시)                                          | 이후 (실 API)                                              |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| 제출 대상       | Next.js Route Handler(로컬 mock) → 가짜 `applyId`    | 백엔드 `apiClient().post('admission-evaluation/apply')`    |
| 전송 데이터     | 폼 전체 (대학/계열/학과 **이름까지** 포함, 단일 값)  | 코드/식별자만 (`majorIdHsbs` 배열, `prefer*Codes` 등)      |
| 요청 타입 의미  | 전송 + 저장을 한 타입이 겸함                          | **전송 전용** (`…ApplyRequest`)                            |
| sessionStorage  | 요청 객체를 **그대로** 저장                          | **표시·복원 전용 스냅샷** 별도 저장 (`…ApplyFormSnapshot`) |
| 타입 관계       | 단일 평면 타입                                        | 스냅샷이 요청을 `extends` (요청 ⊂ 스냅샷)                  |
| 이름(라벨) 보관 | 요청에 섞여 있음                                      | 스냅샷에만 보관 (서버는 코드, 화면은 이름)                 |

**핵심 한 줄:**

> "서버로 보낼 것(코드)"과 "화면이 기억할 것(코드 + 이름)"을 **다른 타입으로 분리**하고, sessionStorage는 후자만 담당하도록 역할을 좁혔다.

---

### Phase 10 정리

| 새로 배운/적용한 핵심 개념        | 설명                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **임시 제출 경로의 교체**          | mock Route Handler + `ky` 직접 호출 → 공통 `apiClient`로 실 엔드포인트 POST                    |
| **전송용/표시용 타입 분리**        | 요청은 코드만(`…ApplyRequest`), 화면 표시·복원은 이름 포함 스냅샷(`…ApplyFormSnapshot`)        |
| **`extends`로 타입 정렬**          | 스냅샷이 요청을 상속 → 공통 필드 중복 제거, 단일 출처 유지, 드리프트 방지                      |
| **`{ ...requestData }` 재사용**    | 요청을 한 번 만들고 스냅샷에 펼쳐 넣어, 타입 관계를 코드에서도 그대로 표현                     |
| **타입이 누락 UI를 드러냄**        | 요청에 추가된 `simpleQuestion`이 입력 Textarea의 부재를 타입 에러로 노출                       |

**적용 판단 한 줄:**

> 같은 객체가 "서버 전송"과 "화면 보관" 두 역할을 동시에 하고 있다면, 타입을 분리하고 한쪽이 다른 쪽을 `extends`하게 만들어라.

---

## Phase 11: 트러블슈팅 — 학종 신청 빈 값 거부 오류

> 기록일: 2026-05-22
> 관련 파일: `apps/early/src/window/admission-evaluation/EarlyAdmissionEvaluationApply.tsx`, `apps/early/src/entities/admission-evaluation/api/index.ts`

### 증상

학종 신청 화면에서 **선택 입력 필드를 비워둔 채** [입력완료]를 누르면 신청이 실패하고 `alert("신청에 실패했습니다. 다시 시도해주세요.")`가 뜬다.

콘솔에 찍힌 실제 서버 에러:

```
학종 신청 실패: VALIDATION_PIPE_ERROR: subjectNot should not be empty
    at async submitAdmissionEvaluationApply (index.ts:102:16)
Uncaught (in promise) VALIDATION_PIPE_ERROR: subjectNot should not be empty
```

### 원인

`"... should not be empty"`는 **NestJS class-validator의 `@IsNotEmpty()` 기본 메시지**다. 즉, 서버의 신청 요청 DTO에서 `subjectNot` 필드에 `@IsNotEmpty()`(빈 값 금지)가 걸려 있어, 프론트가 보낸 `subjectNot: ''`(빈 문자열)을 검증 단계에서 거부한 것이다.

- 기획상 `subjectNot`(비교과 추가 입력)은 **선택** 필드인데, 서버는 **필수**로 검증하고 있어 발생한 프론트–서버 계약 불일치.
- 프론트 payload 자체는 정상이다.

```json
{
  "userId": "mynesin24",
  "subjectNot": "",
  "majorIdHsbs": ["16383761"],
  "preferAiPartsCodes": ["Z04F"],
  "preferProvsCodes": ["2"],
  "emphasis1": "",
  "emphasis2": "",
  "emphasis3": "",
  "simpleQuestion": ""
}
```

#### 요청 경로

- API 함수: `submitAdmissionEvaluationApply` (`api/index.ts`)
- 호출: `apiClientFor(API_URL).post('admission-evaluation/apply', ...)`
- `API_URL` (local env 기준): `http://www-dev.jinhak.com/jh/api/early`
- 최종: `POST http://www-dev.jinhak.com/jh/api/early/admission-evaluation/apply`

> `apps/early/app/api/admission-evaluation/apply/route.ts`의 로컬 Mock 라우트는 **현재 사용되지 않는다.** API 함수가 이미 실제 백엔드(`apiClient`)로 직접 호출하기 때문. 따라서 오류는 **dev 서버에 배포된 코드**에서 발생한다.

### 해결 위치 — 서버 (프론트 변경 없음)

프론트는 이미 빈 값을 정상적으로 전송 중이라 손댈 부분이 없다. (빈 값을 억지로 통과시키려 더미 문자열을 넣는 것은 임시/플레이스홀더 코드 금지 원칙 위반 + 데이터 오염이라 금지.)

**서버 신청 요청 DTO에서 아래 선택 필드들의 검증을 `@IsNotEmpty()` → `@IsOptional()`로 변경해야 한다.**

| 필드            | UI 표기              | 구분 |
| --------------- | -------------------- | ---- |
| `subjectNot`    | 비교과 추가 입력     | 선택 |
| `emphasis1`     | 강조하고 싶은 내용 1 | 선택 |
| `emphasis2`     | 강조하고 싶은 내용 2 | 선택 |
| `emphasis3`     | 강조하고 싶은 내용 3 | 선택 |
| `simpleQuestion`| 간단 질문하기        | 선택 |

```ts
// 변경 전
@IsNotEmpty()
subjectNot: string;

// 변경 후 (선택 필드)
@IsOptional()
subjectNot?: string;
```

**필수로 유지할 필드 (변경 금지):** `userId`, `majorIdHsbs`, `preferAiPartsCodes`, `preferProvsCodes`

> ⚠️ class-validator는 첫 에러에서 막히므로, `subjectNot`만 풀면 다음 빈 필드(`emphasis1` …)에서 동일하게 막힐 수 있다. **선택 필드 5개를 한 번에** 처리할 것.

> 참고: 로컬 서버 체크아웃(`D:\hijinhak-server`)에는 이 `admission-evaluation/apply` 엔드포인트가 존재하지 않았다. 검증 로직은 dev 서버에 배포된(아직 미반영/별도 브랜치) 코드에만 있는 것으로 추정된다.

### (선택) 프론트 후속 개선 거리

지금 mutation `onError`는 서버 메시지를 버리고 고정 문구만 띄운다 (`admission-evaluation.queries.ts`):

```ts
onError: (error) => {
  console.error('학종 신청 실패:', error);
  alert('신청에 실패했습니다. 다시 시도해주세요.');
},
```

`ky`의 `beforeError` 훅이 서버 응답 `message`를 `error.message`에 넣어주므로(`APIError.enrichKyError`), 필요 시 서버 메시지를 사용자/콘솔에 노출하도록 개선 가능하다.

또한 `handleSubmit`에서 `await submitApply(...)`를 try/catch 없이 호출해 실패 시 **Uncaught (in promise)**가 발생한다. 에러를 잡아 이후 `router.push`가 실행되지 않도록 정리하는 것도 후속 개선 거리다.

---

## Phase 12: 개념 정리 — "입력값 전송"과 "화면 구성"은 다른 동작이다 (쓰기 vs 읽기)

> 학습 메모: 신청 → 확인 → 리포트로 이어지는 흐름에서, "내가 입력한 값"과 "화면에 그릴 데이터"가 같은 것이라는 착각을 바로잡는 노트.
> 관련 파일: `EarlyAdmissionEvaluationApply.tsx`, `EarlyAdmissionEvaluationConfirm.tsx`, `EarlyAdmissionEvaluationReport.tsx`

### 가장 중요한 구분: 전송(쓰기) vs 조회(읽기)

서버와 데이터를 주고받는 동작은 방향에 따라 **완전히 다른 두 가지**다.

| 구분        | 전송 (쓰기)                       | 조회 (읽기)                  |
| ----------- | --------------------------------- | ---------------------------- |
| 무엇        | 내가 입력한 값을 **서버에 보냄**   | 서버에 있는 값을 **받아옴**  |
| HTTP        | POST / PUT                        | GET                          |
| React Query | `useMutation`                     | `useQuery`                   |
| 이 프로젝트 | `submitAdmissionEvaluationApply`  | (리포트 조회 API — 미구현)   |
| 비유        | 우체통에 편지를 **넣는다**        | 우편함에서 답장을 **꺼낸다** |

현재 `apply` API는 "넣는" 동작 하나만 한다. 리포트 페이지는 "꺼내는" 동작이 필요한데 그 API가 아직 없는 상태다.

### 핵심: 리포트는 "입력값"이 아니라 "서버 분석 결과"로 그린다

직관적으로는 "내가 입력한 값(대학·학과·활동)을 갖고 있으니 그걸로 리포트를 그리면 되지 않나?"라고 생각하기 쉽다. **아니다.**

```
[내가 보낸 것]            [리포트에 그려야 할 것]
대학: 가천대        →     합격 가능성 78%
학과: 컴퓨터공학    →     추천 대학 5곳
활동: "..."         →     생기부 분석 코멘트 / 전문가 총평
```

왼쪽(입력값)만으로는 오른쪽을 만들 수 없다. 오른쪽은 **서버가 입력값을 받아 계산·분석한 뒤 새로 만들어내는 데이터**다. 그래서 리포트 페이지는 반드시 서버에서 GET으로 받아와야 한다.

확인 페이지와 리포트 페이지는 성격이 완전히 다르다:

| 페이지        | 무엇을 보여주나                 | 데이터 출처              |
| ------------- | ------------------------------- | ------------------------ |
| 확인(Confirm) | "내가 이렇게 신청한 게 맞나요?" | 내 입력값 (sessionStorage) |
| 리포트(Report)| "전문가가 분석한 결과는?"       | 서버가 만든 결과 (GET API) |

### `applyId` — 전송과 조회를 잇는 번호표

`apply` API가 돌려주는 `applyId`가 둘을 연결한다.

```
[전송] POST /admission-evaluation/apply
       내 입력값 보냄
        ↓
       서버: "접수 완료" → { applyId: "ADMISSION-123" }
        ↓
[조회] GET /admission-evaluation/report?applyId=ADMISSION-123   ← (이런 API가 나와야 함)
       서버: "그 신청 건의 분석 결과" → { 합격률, 추천대학, 총평... }
        ↓
       리포트 페이지가 이 데이터로 화면을 그림
```

`applyId`는 "내가 방금 넣은 신청서"를 나중에 다시 찾기 위한 번호표다. 전송할 때 받아두고, 조회할 때 그 번호로 결과를 요청한다.

### 예상되는 API 두 종류 (용어 정리)

"완료 API"라는 말은 보통 아래 두 가지가 섞여 쓰인다. 역할이 다르다.

1. **확정(완료) API** — `POST .../apply/confirm` (쓰기)
   "이대로 최종 제출할게요, 분석 시작해주세요." 현재 `EarlyAdmissionEvaluationConfirm.tsx` 상단 주석에 연동 예정으로 적혀 있는 것.
2. **리포트 조회 API** — `GET .../report?applyId=...` (읽기)
   "분석 결과 데이터 주세요." 리포트 페이지가 마운트되면 `useQuery`로 호출해 그 결과로 화면을 그린다.

### 리포트 페이지가 채워질 모습 (개념 예시)

현재 `EarlyAdmissionEvaluationReport.tsx`는 `<h1>학종 리포트</h1>`만 있는 골격이다. 조회 API가 나오면 이렇게 채워진다.

```tsx
export const EarlyAdmissionEvaluationReport = () => {
  // 1. 서버에서 분석 결과를 "읽어온다" (useQuery)
  const { data: report, isLoading } = useReportQuery(applyId);

  // 2. 로딩 / 없음 처리
  if (isLoading) return <로딩스피너 />;
  if (!report) return <p>분석 결과가 아직 없습니다</p>;

  // 3. 받아온 데이터로 화면을 그린다 (입력값이 아니라 "분석 결과")
  return (
    <div>
      <합격가능성그래프 value={report.passRate} />
      <추천대학목록 list={report.recommendedUniversities} />
      <전문가총평 text={report.expertComment} />
    </div>
  );
};
```

### 전체 흐름 한 그림

```
신청 페이지 (Apply)
  사용자 입력
     │  [쓰기] useMutation → POST /apply
     ▼
  서버가 applyId 발급 ──────────────┐
     │                              │ applyId 기억
     ▼ (sessionStorage에 스냅샷 저장) │
확인 페이지 (Confirm)               │
  내 입력값 그대로 표시               │
     │  [쓰기] useMutation → POST /apply/confirm  ("분석 시작해주세요")
     ▼                              │
리포트 페이지 (Report)  ◄───────────┘
  [읽기] useQuery → GET /report?applyId=...   ("분석 결과 주세요")
  받아온 "분석 결과"로 화면 구성  ← 입력값이 아님!
```

### 다음 단계로 가기 위해 백엔드에 확인할 것

리포트 조회 API 스펙이 확정돼야 리포트 페이지 작업을 시작할 수 있다. 백엔드에 물어볼 두 가지:

1. 리포트 데이터를 주는 **조회 API 엔드포인트와 응답 JSON 구조**는?
2. 그 API는 **무엇으로 신청 건을 식별**하나? (`applyId`? 아니면 로그인 `userId`만으로 최신 신청을 찾아주나?)

### Phase 12 정리

| 핵심 개념                  | 설명                                                                       |
| -------------------------- | -------------------------------------------------------------------------- |
| 쓰기 vs 읽기               | 전송(POST·`useMutation`)과 조회(GET·`useQuery`)는 방향도 훅도 다른 동작     |
| 리포트 = 분석 결과         | 리포트는 내 입력값이 아니라 서버가 입력을 분석해 만든 새 데이터로 그린다    |
| 확인 페이지 ≠ 리포트 페이지 | 확인은 내 입력값(sessionStorage), 리포트는 서버 결과(GET API)              |
| `applyId`의 역할           | 전송 때 발급받아 조회 때 신청 건을 다시 찾는 "번호표"                       |
| 확정 API vs 조회 API       | `POST /confirm`(분석 시작 요청, 쓰기)와 `GET /report`(결과 조회, 읽기)는 별개 |

**적용 판단 한 줄:**

> "이 화면에 그릴 데이터를 내가 이미 갖고 있나, 아니면 서버가 만들어 줘야 하나?"
> 서버가 만들어 줘야 하면 — 입력값으로 그리지 말고 GET으로 받아와서 그려라.

---

### 후속 결론 — 이 프로젝트는 `applyId`가 아니라 토큰의 `userId`로 식별한다

위 설명에서 "전송과 조회를 잇는 번호표"로 `applyId`를 들었다. 이는 **일반적으로 흔한 패턴**(신청 건마다 ID를 발급받아 그 ID로 결과를 조회)이라 개념 이해용으로 유효하다. 다만 **이 프로젝트의 백엔드는 다른 방식을 택했다.**

#### 확인된 사실

백엔드에 문의한 결과, 학종 관련 조회·확정 API는 **요청 파라미터가 아니라 로그인 토큰(쿠키)에서 `userId`를 꺼내 신청 건을 식별**한다. 이는 이미 `grade-status` 조회에서 관찰된 패턴과 동일하다.

- `apiClient()`가 `credentials: 'include'`로 쿠키를 자동 전송 → 서버가 토큰에서 `userId`를 읽음
- Swagger에 `userId`가 `required`로 보여도, 실제로는 토큰에서 식별 (문서 표기와 구현의 흔한 불일치)
- 따라서 프론트가 `userId`/`applyId`를 명시적으로 안 보내도 조회가 동작

#### 그래서 `applyId`를 제거했다

서버가 토큰으로 식별하므로, 서버가 발급하던 `applyId`는 프론트에서 **식별 용도로 쓸 일이 없어졌다.** 유일한 잔존 용도였던 확인 페이지의 "신청 번호" 표시도, 본질적으로 신청서 번호가 아니라 불필요한 식별자 노출이라 정리했다.

| 파일 | 변경 |
| --- | --- |
| `admission-evaluation.types.ts` | `AdmissionEvaluationApplyResponse` 인터페이스 삭제, `…ApplyFormSnapshot`에서 `applyId` 필드 제거 |
| `api/index.ts` | `submitAdmissionEvaluationApply` 반환 타입을 `Promise<void>`로 (응답 파싱 불필요) |
| `admission-evaluation.queries.ts` | mutation 제네릭을 `useMutation<void, Error, …Request>`로 |
| `EarlyAdmissionEvaluationApply.tsx` | `response` 캡처·디버그 로그·`snapshot.applyId` 제거 |
| `EarlyAdmissionEvaluationConfirm.tsx` | 표시를 `userId` 기준으로, 라벨을 "신청자 ID"로 정정 |
| `app/api/admission-evaluation/apply/route.ts` | **삭제** (안 쓰이던 로컬 mock 라우트) |

> **신청 성공 판정은?** `applyId`를 안 받아도 된다. `ky`는 비-2xx 응답에서 throw하므로(`beforeError` → `APIError`), `await submitApply(requestData)`가 예외 없이 끝나면 성공이다. 굳이 응답 바디를 파싱·검사할 필요가 없어 반환 타입을 `void`로 좁혔다.

#### `userId` ≠ `applyId` — 이름을 합치면 안 되는 이유 (함께 정리)

논의 중 "두 값을 `userId`로 이름 통일하면 깔끔하지 않냐"는 아이디어가 있었으나, **둘은 이름만 다른 같은 값이 아니라 의미·값이 다른 별개**다.

| | `userId` | `applyId` |
| --- | --- | --- |
| 식별 대상 | 사람(로그인 사용자) | 신청서 한 건 |
| 출처 | 로그인 정보 (보내는 값) | 서버 응답 (받는 값) |
| 예시 | `'mynesin24'` | `'ADMISSION-EVALUATION-1716…'` |

특히 snapshot은 `{ ...requestData, applyId: response.applyId }` 형태였는데, `applyId`를 `userId`로 개명하면 스프레드로 들어온 `userId`('mynesin24')를 신청번호로 **덮어쓰는 버그**가 난다 (JS 객체는 같은 key 중 뒤의 값이 이김). 이름이 다른 건 혼동이 아니라 "정확히 구분 중"이라는 신호다.

#### 정리 한 줄

> 결과 조회를 **무엇으로 식별하는가**는 백엔드 설계에 달려 있다 — `applyId`(신청서별 ID)일 수도, **토큰의 `userId`**(사용자별 최신 건)일 수도 있다. 이 프로젝트는 후자라서 `applyId`를 제거했다. 식별 방식은 **추측하지 말고 백엔드 스펙으로 확인**하라.

---

## Phase 13: 컴포넌트 분리와 FSD 레이어 — 페이지에서 "끌어올린" prop 정리하기

### 배경: 페이지가 너무 많은 일을 알고 있었다

신청 페이지(`EarlyAdmissionEvaluationApply.tsx`)가 `UnivMajorSelector`에 11개의 prop을 내려주고 있었는데, 그중 가장 큰 문제는 **JSX 안에 인라인으로 박힌 핸들러 조합 로직**이었습니다.

```tsx
// ❌ 페이지가 selector의 내부 동작 규칙까지 직접 조립
<UnivMajorSelector
  universityHandler={(option) => {
    handleSelectedChange('drop1', option);
    handleSelectedChange('drop2', { value: '', label: '' }); // 하위 초기화
    handleSelectedChange('drop3', { value: '', label: '' });
    onUnivChangeFetch(option.value);                         // cascade 재조회
  }}
  aibdPartsHandler={(option) => { ... }}
  // ...
/>
```

"대학을 바꾸면 계열·학과를 비우고 그 대학의 계열을 다시 받아온다"는 규칙은 **selector 고유의 내부 규칙**입니다. 페이지(window 레이어)가 이걸 알고 조립하는 건 책임이 잘못 놓인 것입니다.

### Step 49: 조합 로직을 컴포넌트 내부로 — 페이지는 "원시 도구"만 전달

페이지는 setter와 cascade 함수 같은 **원시 도구**만 넘기고, 그것을 조합하는 일은 컴포넌트가 합니다.

```tsx
// ✅ 페이지: 원시 도구만 전달
<UnivMajorSelector
  selectedOption={selectedOption}
  onSelectedChange={handleSelectedChange}   // 단순 setter
  onUnivChangeFetch={onUnivChangeFetch}     // cascade 함수
  onMajorTypeChange={onMajorTypeChange}
  selectedCards={selectedCards}
  onAddCard={handleAddCard}
  onDeleteCard={handleDeleteCard}
/>
```

```tsx
// ✅ UnivMajorSelector 내부: 조합 규칙이 여기에 산다
const handleUniversityChange = (option: StringDropDownOption) => {
  onSelectedChange('drop1', option);
  onSelectedChange('drop2', EMPTY_OPTION);
  onSelectedChange('drop3', EMPTY_OPTION);
  onUnivChangeFetch(option.value);
};
```

> **핵심 원칙**: "이 규칙을 아는 게 누구의 책임인가?"를 물어보세요. 화면 한 조각의 내부 동작 규칙은 그 컴포넌트가 알아야 하고, 페이지는 데이터와 단순 setter만 내려주면 됩니다.

### Step 50: 반복되는 UI는 서브컴포넌트로

"선호 정보 입력"은 `라벨 + DropDown + 선택값` 블록이 4번(전공 1·2지망, 지역 1·2지망) 복붙돼 있었습니다. 차이가 (제목, 필수/선택, 옵션, 바인딩 키)뿐이라, 그 차이만 prop으로 받는 내부 서브컴포넌트로 묶습니다.

```
PreferInfoSelector (컨테이너)
  └─ PreferSection (전공/지역 한 줄)
       └─ PreferDropDown (단일 드롭다운 + 라벨)  ← 4번 재사용
```

같은 방식으로 "강조하고 싶은 내용"의 3개 Textarea도 `EmphasisActivityInput` + 재사용 가능한 `ActivityTextarea`로 분리했습니다(간단 질문 입력란도 같은 서브컴포넌트 재사용).

> **언제 서브컴포넌트로 빼나?** 동일한 마크업이 2~3번 이상 반복되고, 차이가 몇 개의 값으로 표현될 때. 차이를 prop으로 받는 작은 컴포넌트 하나가 복붙 4개보다 안전합니다.

### Step 51: FSD 상향 import 금지 — 컴포넌트의 올바른 레이어

`UnivMajorSelector`는 `entities/`에 있으면서 `modules/`의 `UnivMajorDropDownGroup`을 import하고 있었습니다. 이는 FSD 규칙 위반입니다.

> **FSD 레이어 방향**: `app → entities → modules → window`. 위에서 아래로만 import할 수 있고, **아래(entities)가 위(modules)를 import하면 안 됩니다(상향 의존 금지).**

해결: `UnivMajorSelector`를 `modules/`로 옮겨 같은 레이어에서 조합하게 했습니다. import 흐름이 정방향(`entities`의 타입/훅 → `modules`의 컴포넌트 → `window`의 페이지)으로만 흐릅니다.

**연쇄로 발견된 문제 — 공유 컴포넌트의 위치**: `RequiredBadge`가 페이지(window) 파일에 정의돼 있어서, modules 컴포넌트가 쓰면 또 상향 import가 됩니다. 그래서 공유 UI(`@libs/ui/Flag`)로 끌어내려 양쪽이 정방향으로 import하게 했습니다.

> **교훈**: 한 컴포넌트를 옮기면 그게 의존하던 작은 조각(여기선 배지)도 같이 레이어를 재검토해야 합니다. "누가 import하는가"가 그 조각이 어디 있어야 하는지를 알려줍니다.

### Step 52: 분리하면서 dead code도 함께 제거

리팩토링 중 페이지가 `useAdmissionEvaluationHandler`에서 `setSelectedCards`를 구조분해하지만 **어디서도 안 쓰는** 걸 발견했습니다(카드 추가/삭제는 핸들러가 내부에서 처리). 즉시 제거했습니다.

> **리팩토링은 dead code를 드러낸다**: prop과 구조분해를 정리하다 보면 "받기만 하고 안 쓰는 값"이 보입니다. 이때 바로 지우는 게 CLAUDE.md의 "dead code 즉시 삭제" 원칙입니다.

### 무엇을 옮기지 *못하는가* — 공유 상태는 페이지에 남는다

selector로 다 내리고 싶어도, `selectedOption`·`selectedCards`·`onUnivChangeFetch`는 **handleSubmit과 복원 로직도 함께 쓰는 공유 상태**라 페이지(또는 상위 훅)가 들고 있어야 합니다. 자식에게 내려주는 건 "상태 끌어올리기(lifting state up)"라는 정상 패턴이지, 군더더기가 아닙니다.

---

## Phase 14: "Invalid hook call" — 훅은 아무 데서나 부를 수 없다

### 증상

```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

### 원인: 일반 함수 안에서 훅 호출

API 파일에서 `useCurrentUser()`를 **모듈 최상단/일반 async 함수 안**에서 부르고 있었습니다.

```ts
// ❌ api/index.ts — 컴포넌트도 커스텀 훅도 아닌 곳에서 훅 호출
const { currentUser } = useCurrentUser();           // 모듈 최상단
export const fetchStudentRecordComparativeStatus = async () => {
  // 또는 이렇게 async 함수 안에서도 ❌
  const { currentUser } = useCurrentUser();
  ...
};
```

> **React의 훅 규칙(Rules of Hooks)**: 훅은 오직 **① React 함수 컴포넌트 본문**과 **② 다른 커스텀 훅 본문**에서만 호출할 수 있습니다. 일반 함수, 클래스, 조건문/반복문 안에서는 안 됩니다. React가 훅 호출 순서로 상태를 추적하기 때문입니다.

### 해결: 값은 인자로, 훅 호출은 훅 안에서

API 함수는 훅을 부르지 말고 **필요한 값(`userId`)을 인자로 받습니다.** 훅 호출은 이 함수를 감싸는 **query 훅 안**에서 합니다(거긴 합법).

```ts
// ✅ api/index.ts — 순수 함수, userId는 파라미터
export const fetchStudentRecordComparativeStatus = async (userId: string) => { ... };
```

```ts
// ✅ queries.ts — 커스텀 훅 안이라 useCurrentUser 호출 가능
export const useStudentRecordComparativeStatusQuery = () => {
  const { currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ['studentRecordComparativeStatus', currentUser.userId],
    queryFn: () => fetchStudentRecordComparativeStatus(currentUser.userId),
    enabled: !!currentUser.userId,   // userId 준비 전엔 실행 안 함
  });
};
```

> **한 줄 요약**: "이 코드는 컴포넌트/커스텀 훅 본문인가?"를 먼저 물어보세요. 아니라면 훅을 부르지 말고, 그 값을 **인자로 받도록** 함수 시그니처를 바꾸세요.

---

## Phase 15: 다른 호스트의 API 호출 — 전용 클라이언트 · CSP · 프록시

> ⚠️ **이 Phase의 작업은 최종적으로 원복**했습니다(백엔드에서 호스트·엔드포인트·정책 확정 후 재진행 예정). 하지만 그 과정에서 배운 함정들은 그대로 가치가 있어 기록합니다.

### 배경

비교과 입력 현황을 메인 백엔드(`API_URL`)가 아닌 **다른 호스트**(`http://www.evaluationbygpt.com/api/v1`)에서 가져와야 했습니다. "별도 호스트니 따로 부르자"는 단순해 보였지만 함정이 셋이었습니다.

### 함정 ①: `apiClientFor`에 절대 URL을 넣으면 깨진다 (ky `prefixUrl`)

```ts
// ❌ 메인 클라이언트(prefixUrl=API_URL)에 절대 URL을 넘김
apiClient().get('http://www.evaluationbygpt.com/api/v1/...');
```

`apiClientFor(API_URL)`은 ky의 `prefixUrl`을 설정합니다. ky는 `prefixUrl + input`을 단순 결합하므로 절대 URL을 넣으면 `API_URL + "http://..."`가 되어 깨집니다.

```ts
// ✅ 호스트별 전용 클라이언트를 따로 만들고, 상대경로로 호출
const evaluationApiClient = () => apiClientFor(EVALUATION_API_URL);
evaluationApiClient().get('extra-curricular/origin/${userId}/valid');
```

> **교훈**: 호스트가 다르면 **클라이언트를 분리**하세요(각자 자기 base에 상대경로). 하나의 클라이언트에 절대 URL을 섞지 마세요.

### 함정 ②: CSP `connect-src` 차단 + http mixed-content

브라우저 콘솔에 이런 에러가 떴습니다.

```
Connecting to 'http://www.evaluationbygpt.com/...' violates the following
Content Security Policy directive: "connect-src 'self' https://*.jinhak.com ..."
```

CSP(`next.config.js`의 `connect-src`)에 그 호스트가 없어서 브라우저가 막은 것입니다. 게다가 호스트가 `http://`라서, **production(https)에선 CSP를 열어줘도 mixed-content로 또 막힙니다.**

| 해결책 | 로컬/dev(http) | production(https) |
| --- | --- | --- |
| CSP에 호스트 추가 | 뚫림 | ❌ mixed-content로 막힘 |
| **Next 프록시 라우트** | ✅ | ✅ |

### 함정 ③ + 해결: Next.js 프록시 라우트 (그리고 ENOTFOUND)

브라우저가 외부 호스트를 직접 못 부르면, **서버가 대신 부르게** 합니다. 클라이언트는 same-origin(`'self'`)인 route handler만 호출하므로 CSP·mixed-content를 모두 피합니다.

```
브라우저 → fetch {basePath}/api/.../comparative-status  ('self' → CSP 통과)
  → route.ts (서버) → http://www.evaluationbygpt.com/...  (서버라 CSP/mixed-content 무관)
```

```ts
// app/api/.../comparative-status/route.ts (서버 측 프록시)
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const res = await fetch(`${EVALUATION_API_URL}/extra-curricular/origin/${userId}/valid`);
  const data = await res.json();
  return NextResponse.json(data ?? []);
}
```

클라이언트는 `useCurrentUser`가 쓰는 것과 같은 패턴으로 self 라우트를 부릅니다:

```ts
await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/.../comparative-status?userId=${userId}`,
  { credentials: 'include' });
```

그런데 프록시를 깔아도 데이터가 비었고, 서버 콘솔에 결정적 단서가 있었습니다.

```
[cause]: Error: getaddrinfo ENOTFOUND www.evaluationbygpt.com
```

`ENOTFOUND` = **서버(개발 머신)에서 그 호스트를 DNS로 해석조차 못 함.** 즉 코드 구조 문제가 아니라 **호스트가 틀렸거나 사내망 전용**이라는 환경 문제였습니다. 여기서 "백엔드 확인 후 진행"으로 결론 내고 관련 코드를 전부 원복했습니다.

> **디버깅 교훈**: 프록시 라우트에 `try/catch` + 로그를 넣자 원인이 한 줄로 드러났습니다. "데이터가 빈다"는 증상에서 멈추지 말고, **서버 콘솔의 실제 에러**(상태코드/ENOTFOUND/빈 바디)를 확인하면 (네트워크 불가 / 데이터 없음 / 인증·경로 오류)를 즉시 구분할 수 있습니다.
>
> **추측하지 말고 확인하라**: 외부 호스트·엔드포인트·CSP·DNS는 프론트 코드만으로 결정되지 않습니다. 동작하지 않으면 백엔드/인프라 스펙을 먼저 확정하세요.

---

## Phase 16: 페이지 로직을 단일 오케스트레이션 훅으로 통합

### 배경

Phase 8에서 로직을 여러 작은 훅(`useApplyDropOptions`, `useAdmissionEvaluationHandler`)으로 **분리**했습니다. 하지만 페이지에는 여전히 그 훅들의 호출 + 폼 입력 상태(`useState` 5개) + sessionStorage 복원 `useEffect` + `handleSubmit`이 ~180줄 남아 있었습니다.

`handleSubmit`(폼 → 스냅샷 저장)과 복원 `useEffect`(스냅샷 → 폼)는 사실 **같은 스냅샷의 쓰기/읽기 양면**이라, 함께 묶을 명분이 강했습니다.

### Step 53: 작은 훅들을 "합성(composition)"한 상위 훅

기존 훅을 지우지 않고, 새 훅이 **내부에서 호출해 합칩니다.** 페이지는 이 훅 하나만 부릅니다.

```ts
// entities/admission-evaluation/model/useAdmissionEvaluationApplyForm.ts
export const useAdmissionEvaluationApplyForm = () => {
  // 1) 데이터/인프라 훅 내부 호출
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { mutateAsync: submitApply, isPending } = useAdmissionEvaluationApplyMutation();

  // 2) 기존 작은 훅을 합성
  const dropOptions = useApplyDropOptions();
  const handler = useAdmissionEvaluationHandler();

  // 3) 폼 입력 상태 소유 + 복원 useEffect + handleSubmit ...

  return {
    ...dropOptions,   // 옵션 + cascade
    ...handler,       // 선택 상태 + 카드 + 모달
    /* 폼 상태, handleSubmit, isPending ... */
  };
};
```

결과적으로 페이지는 **훅 1개 호출 + JSX**만 남아 순수 프레젠테이션 컴포넌트가 됩니다.

```tsx
export const EarlyAdmissionEvaluationApply = () => {
  const { selectedOption, handleSubmit, isPending, /* ... */ } =
    useAdmissionEvaluationApplyForm();
  return ( /* JSX */ );
};
```

### "분리(Phase 8)"와 "통합(Phase 16)"은 모순이 아니다

- Phase 8: 컴포넌트에서 **로직 덩어리**를 작은 훅으로 빼냄(관심사 분리).
- Phase 16: 그 작은 훅들을 **합성**해 페이지용 단일 진입점을 만듦.

작은 훅은 building block으로 남아 재사용·테스트가 가능하고, 상위 훅은 그것들을 엮어 페이지가 한 번에 쓰게 합니다. 분리한 걸 다시 합치는 게 아니라, **계층을 쌓는 것**입니다.

### 트레이드오프 — god-hook 경계

`...dropOptions`/`...handler` 스프레드는 간결하지만, 한 훅이 너무 많은 책임을 흡수하면 "god-hook"이 됩니다. 이 프로젝트에선 **소비자가 이 페이지 하나뿐**이라 단일 훅이 합리적이었습니다. 같은 selector/폼이 여러 페이지에서 쓰이기 시작하면, 그때는 합성 훅 대신 Context나 더 작은 훅 단위로 다시 쪼개는 게 맞습니다.

> **판단 기준**: "이 묶음을 쓰는 곳이 하나인가, 여럿인가?" 하나면 합성 훅으로 응집, 여럿이면 공유 메커니즘(Context 등)으로 분산. 규모에 맞는 추상화를 고르세요(CLAUDE.md: premature abstraction 금지).

---

## Phase 17: Confirm 페이지에도 같은 패턴을 — 그리고 "통째 호출"의 함정

### 배경

Apply 페이지를 단일 훅으로 정리한 뒤(Phase 16), 같은 정신을 Confirm(신청 내용 최종 확인) 페이지에도 적용합니다. Confirm은 **읽기 전용 표시**가 핵심입니다 — sessionStorage 스냅샷을 읽어 화면에 보여주고, 제출 모달만 띄웁니다.

복원 `useEffect` + 13개 `useState`(userId, universityName, ... simpleQuestion)가 페이지에 그대로 박혀 있던 걸 `useAdmissionEvaluationConfirmSummary` 훅으로 분리합니다.

### Step 54: 읽기 전용 스냅샷 요약 훅

핵심 아이디어: **스냅샷 → 표시용 상태로의 매핑**만 담당하는 훅을 만듭니다.

```ts
// entities/admission-evaluation/model/useAdmissionEvaluationConfirmSummary.ts
export const useAdmissionEvaluationConfirmSummary = () => {
  const isMobile = useAppSelector((s) => s.common.isMobile);
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();

  // 스냅샷에서 복원되는 표시용 상태들
  const [userId, setUserId] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  // ...

  useEffect(() => {
    const raw = sessionStorage.getItem(ADMISSION_EVALUATION_STORAGE_KEY.applyForm);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<AdmissionEvaluationApplyFormSnapshot>;
    setUserId(saved.userId ?? '');
    setSelectedCards(saved.selectedCards ?? []);
    // ...
  }, []);

  return { userId, isMobile, gradeStatusData, mockStatusData, selectedCards, /* ... */ };
};
```

`Partial<AdmissionEvaluationApplyFormSnapshot>`로 타입을 단언하는 점이 Apply의 복원 effect와 다릅니다 — 외부 storage에서 온 값이라 일부 필드가 없을 수도 있다는 의도를 명시합니다.

### Step 55: 함정 — 단 3개 값 때문에 Apply 폼 훅 전체를 호출

리뷰 중 발견한 실수입니다.

```ts
// ❌ Confirm 요약 훅이 Apply 폼 훅을 통째로 호출
export const useAdmissionEvaluationConfirmSummary = () => {
  const { isMobile, gradeStatusData, mockStatusData } =
    useAdmissionEvaluationApplyForm();
  // ...
};
```

3개 값만 쓰고 싶었던 건데, `useAdmissionEvaluationApplyForm()`을 부르면 그 안에서 **이 페이지엔 전혀 필요 없는 것들이 다 돌아갑니다.**

- `useApplyDropOptions()` → 대학 목록·선호 전공/지역 **쿼리 자동 실행**
- `useAdmissionEvaluationApplyMutation()` → 제출 mutation 셋업
- 그 훅의 **복원 `useEffect` 실행** → `setSelectedOption(...)` + `onUnivChangeFetch(...)` 호출로 **계열·학과 list 네트워크 요청**까지 발사 (Confirm은 이 데이터를 쓰지 않음)

즉, Confirm 페이지 진입만으로 안 쓰는 API가 줄줄이 호출되고, Apply 폼의 부수 효과(복원 effect)까지 의도치 않게 일어납니다.

### Step 56: 해결 — 필요한 만큼만 의존한다

`gradeStatusData`/`mockStatusData`는 React Query 캐시 공유로 비용이 거의 없고(Apply에서 같은 queryKey로 이미 캐싱), `isMobile`은 redux selector 한 줄입니다. **직접 부르면 됩니다.**

```ts
// ✅ 필요한 3개만 직접 가져오기
const isMobile = useAppSelector((state) => state.common.isMobile);
const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();
```

> **교훈 (의존성 최소화)**: "이 훅이 반환하는 값 중 일부만 필요하다"는 신호가 보이면, 그 훅 전체를 부르지 말고 **그 일부의 출처를 직접 부르세요.** 훅은 호출하는 순간 그 안의 모든 side effect(쿼리 자동 실행, useEffect, mutation 셋업)가 함께 따라옵니다. 같은 React Query queryKey는 어디서 불러도 캐시를 공유하므로 중복 호출 걱정은 안 해도 됩니다.

### Step 57: 그 외 정리 거리 (선택)

리뷰에서 함께 발견한 작은 문제들:

- **응집도** — `isConfirmOpen`(제출 모달 토글)이 요약 훅에 있는데, 정작 제출 로직(`sessionStorage` 정리 + `router.push`)은 페이지에 있습니다. 책임이 갈리면 추적이 어려워지므로, 모달 상태는 페이지의 `useState`로 두는 게 더 자연스럽습니다.
- **죽은 주석** — 옛 필드(`setSelfIntroduction` 등) 주석은 즉시 제거(CLAUDE.md: no dead code).
- **`comparativeExtraInfo` 편집 가능 여부** — "최종 확인" 페이지인데 비교과 입력란이 수정 가능합니다. 의도라면 OK, 아니라면 `AdmissionScoreStatus`에 읽기 전용 모드로 전환.

---

## Phase 18: 복수 데이터를 스냅샷에 담는 법 — comma-join vs 구조화 배열

### 배경

희망 대학/학과는 카드 여러 장(`selectedCards: SelectedCard[]`)으로 추가할 수 있는데, **스냅샷에는 단일 필드**(`universityName`, `majorTypeName`, `minorMajorCategoryName`)밖에 없었습니다. 그래서 Confirm 페이지에서 복수로 노출하려면 데이터를 어딘가에 더 담아야 했습니다.

서버 전송 페이로드(`majorIdHsbs`)는 카드의 학과 ID만 배열로 보내므로 표시용 라벨이 사라집니다 → 스냅샷(표시·복원 전용)에 라벨까지 보관해야 합니다.

### Step 58: 시도 — 단일 필드에 comma-join

처음엔 단일 필드에 카드의 값을 `,`로 합쳐 넣고, Confirm에서 `split(',')`으로 분해하는 방식을 시도했습니다.

```ts
// ❌ handleSubmit
universityName: handler.selectedCards.map((c) => c.options.drop1.label).join(','),
majorTypeName:  handler.selectedCards.map((c) => c.options.drop2.label).join(','),
minorMajorCategoryName: handler.selectedCards.map((c) => c.options.drop3.label).join(','),
```

```ts
// ❌ Confirm 훅: split해서 string[] 3개
setUniversityName(saved.universityName?.split(',') ?? []);
setMajorTypeName(saved.majorTypeName?.split(',') ?? []);
setMinorMajorCategoryName(saved.minorMajorCategoryName?.split(',') ?? []);
```

**두 가지 문제가 함께 발생합니다.**

**문제 ①: 카드 단위 짝이 깨진다.**
카드는 `(대학·계열·학과)` 세 값이 한 묶음입니다. 위 방식은 세 필드를 각각 join하고 split하므로, 표시 시 인덱스로 짝을 다시 맞춰야 합니다(`uni[0]+mt[0]+mc[0]`, `uni[1]+mt[1]+mc[1]`…). 라벨에 쉼표가 들어가는 순간(예: "○○대학교, 분교") 인덱스가 어긋나 짝이 영원히 망가집니다.

**문제 ②: 단일 필드의 의미가 오염되어 "수정하기 복원"이 망가진다.**
`universityId`/`universityName` 같은 단일 필드는 원래 **Apply의 드롭다운 복원용**입니다. Apply 복원 effect는 이렇게 동작합니다.

```ts
setSelectedOption({
  drop1: { value: saved.universityId, label: saved.universityName },
  // ...
});
onUnivChangeFetch(saved.universityId);  // ← 단일 코드 기대
```

여기에 `universityId = "101,102,103"`(comma-join) 같은 값이 들어가면 드롭다운 라벨이 "서울대,연세대"가 되고, cascade fetch는 `univCode = "101,102,103"`을 서버에 보내 깨집니다.

### Step 59: 해결 — 구조화 배열로 분리

**표시(복수 카드)와 복원(드롭다운 단일 값)은 목적이 다르므로, 둘을 분리해서 저장합니다.**

스냅샷 타입에 카드 배열을 추가합니다:

```ts
// admission-evaluation.types.ts
export interface AdmissionEvaluationApplyFormSnapshot extends AdmissionEvaluationApplyRequest {
  // 희망 대학 리스트(복수 카드) — Confirm 복수 표시 + 수정하기 복원
  selectedCards: SelectedCard[];
  // 제출 시점의 단일 드롭다운 선택값 — 수정하기 시 드롭다운/cascade 복원용
  universityId: string;
  universityName: string;
  majorType: string;
  majorTypeName: string;
  // ...
}
```

handleSubmit은 **둘 다** 저장합니다:

```ts
const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  selectedCards: handler.selectedCards,   // ← 구조화 배열 (라벨 포함)
  universityId: drop1.value,              // ← 단일 값 (드롭다운 복원용)
  universityName: drop1.label,
  // ...
};
```

Confirm 훅은 `selectedCards`만 복원해서 그대로 렌더에 넘기고, Apply 복원 effect는 단일 필드로 드롭다운을 복원합니다.

```tsx
{/* Confirm 페이지 — 카드를 카드답게 렌더 */}
{selectedCards.map((card) => (
  <div key={card.id} className="p-4 ...">
    <p>대학: <strong>{card.options.drop1.label}</strong></p>
    <p>계열: <strong>{card.options.drop2.label}</strong></p>
    <p>학과: <strong>{card.options.drop3.label}</strong></p>
  </div>
))}
```

### Step 60: 보너스 — 수정하기 시 카드도 복원

기존 Apply 복원 effect는 단일 드롭다운만 복원하고 **카드 리스트는 통째로 잃어버리고** 있었습니다. 스냅샷에 `selectedCards`가 생긴 김에 함께 복원합니다.

```ts
// Apply 복원 effect (한 줄 추가)
handler.setSelectedCards(saved.selectedCards ?? []);
```

이제 사용자가 카드를 6장 추가 → 제출 → Confirm → "수정하기"로 돌아와도 카드 6장이 그대로 살아 있습니다.

### 데이터 모델링 한 줄 교훈

> **표시(structured) 목적과 복원(single) 목적이 다르면, 같은 필드 하나에 둘을 우겨넣지 말고 따로 저장하라.** "단일 필드를 join/split해서 다목적으로 쓰자"는 유혹은 짧게는 동작하지만, 라벨에 쉼표가 들어오는 순간 / 의미가 오염되어 다른 흐름(여기선 복원·cascade)을 망가뜨리는 순간 부러집니다. **필요한 모양 그대로 저장하세요.**

### 정리: 카드 라이프사이클

```
Apply 추가 → handler.selectedCards (구조화 배열)
  ↓ handleSubmit
스냅샷(sessionStorage): selectedCards (구조화) + 단일 드롭다운 값
  ├→ Confirm: selectedCards 복원 → 카드별로 렌더
  └→ Apply 수정하기: selectedCards 복원 → 카드 그대로 + 단일 필드로 드롭다운 복원
```

---

## Phase 19: sessionStorage 의존을 걷어내고 서버를 "진실의 원천"으로

### 배경

Phase 5/10/18에서 sessionStorage로 신청 폼 ↔ 확인 페이지를 잇는 방식을 다뤘다. 동작은 했지만 두 가지가 거슬렸다:

1. 같은 데이터가 sessionStorage와 서버 두 군데에 존재 → **어느 쪽이 최신인가**라는 동기화 책임이 프론트로 떠밀림.
2. 다른 기기/세션에서 수정하기 불가 — sessionStorage는 탭/세션 단위.

서버에 확정 후 조회 API 세 개(`confirmHopeUnivs`, `confirmPreferSelects`, `confirmSimpleQuestions`)가 생기면서, **서버를 단일 진실의 원천(source of truth)**으로 만들 수 있게 됐다. sessionStorage 의존을 모두 걷어내고 서버 데이터로 폼을 채운다.

### Step 61: prefetch effect 설계 — `useRef`로 "한 번만"

Apply 폼 훅 안에서 confirm 쿼리 3개를 호출하고, 데이터가 도착하면 **한 번만** 폼 state에 적용한다.

```ts
const { data: hopeUnivsData } = useConfirmHopeUnivsQuery();
const { data: preferSelectsData } = useConfirmPreferSelectsQuery();
const { data: simpleQuestionData } = useConfirmSimpleQuestionsQuery();
const hasHydrated = useRef(false);

useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;

  // 카드/선호/활동/질문 일괄 적용...

  hasHydrated.current = true;
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
```

세 가지 설계 결정의 의도:

| 결정 | 이유 |
|---|---|
| `useRef` 가드 | `useState`로 플래그 두면 set 시 리렌더가 일어나 무한 루프 위험. ref는 변경해도 리렌더 안 함. |
| **셋 다 도착 후** 일괄 적용 (AND 조건) | 하나만 도착해 부분 적용하고 hydrated=true 처리하면 늦게 온 데이터가 영원히 반영 안 됨. |
| `hasHydrated.current = true` 위치 | 첫 적용 직전/직후 어디든 OK. 핵심은 **이후 데이터 변경(예: refetch)에도 다시 적용하지 않는 것**. 사용자가 이미 입력한 값을 덮어쓰지 않기 위함. |

---

### Step 61의 심층 학습 — prefetch effect 해부

위 코드 한 덩어리에 React의 여러 개념(useRef vs useState, AND-gating, deps, race condition, React Query 캐시, 대안 패턴)이 응축돼 있다. 이 패턴은 한 번 익히면 form hydration 전반에 재사용 가능하니, 8개 측면으로 풀어 설명한다.

#### Step 61-1: 왜 `useRef`인가 — `useState`로 했다면

가드 플래그를 `useState`로 두면 set 시 컴포넌트가 **다시 렌더링**된다.

```ts
// ❌ useState로 가드 — 동작은 하지만 불필요한 비용
const [hasHydrated, setHasHydrated] = useState(false);

useEffect(() => {
  if (hasHydrated) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;
  // ... apply ...
  setHasHydrated(true);  // ← 이 set이 리렌더를 일으킴
}, [hopeUnivsData, preferSelectsData, simpleQuestionData, hasHydrated]);
//                                                       ^^^^^^^^^^^
//   eslint-react-hooks/exhaustive-deps가 강제 — 안 넣으면 경고
```

문제:
1. `setHasHydrated(true)` → 리렌더 한 번 추가.
2. 다음 렌더에서 effect 재실행 → `hasHydrated`가 true니 guard에 걸려 무한 루프는 아님.
3. 그러나 deps에 `hasHydrated` 포함 → effect가 의미 없이 한 번 더 평가됨.

`useRef`는 모두 우회한다:

```ts
// ✅ useRef로 가드 — 깔끔
const hasHydrated = useRef(false);

useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || ...) return;
  // ... apply ...
  hasHydrated.current = true;  // ← 리렌더 안 일으킴
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
//   ref는 deps에 넣지 않음 — 의도된 생략
```

핵심 차이:

| | `useState` | `useRef` |
|---|---|---|
| 값 저장 | ✅ | ✅ |
| 컴포넌트 간/마운트 간 지속 | ✅ | ✅ |
| set 시 리렌더 트리거 | ✅ (필요할 때 — UI 반영) | ❌ |
| deps에 포함해야 함 | ✅ | ❌ |
| 용도 | "UI에 반영되어야 할 값" | "렌더와 무관한 mutable 값" |

> **규칙 한 줄**: 값이 바뀌어도 **화면을 다시 그릴 필요가 없다면** `useRef`를 써라. 플래그 / 타이머 ID / 이전 값 보관 / DOM 노드 참조 등이 대표 용례.

#### Step 61-2: AND-gating — "부분 적용"의 함정

세 쿼리가 비동기로 따로 도착할 때, 응답 하나에 적용하고 hydrated=true 처리하면 어떻게 될까?

```ts
// ❌ 부분 적용 함정
useEffect(() => {
  if (hasHydrated.current) return;
  if (hopeUnivsData) {
    // ... 카드만 적용 ...
  }
  if (preferSelectsData) { /* ... */ }
  if (simpleQuestionData) { /* ... */ }
  hasHydrated.current = true;   // ← 여기가 문제
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
```

시나리오:
1. `t=0.3s`: `hopeUnivsData`만 먼저 도착 → 카드 적용 → `hasHydrated.current = true`.
2. `t=0.5s`: `preferSelectsData` 도착 → effect 재실행 → 가드에 걸려 **return** → 선호 영영 비어 있음.
3. `t=0.7s`: `simpleQuestionData` 도착 → 마찬가지로 **return** → 활동·질문 영영 비어 있음.

결과: 사용자는 카드만 채워진 채 선호/활동이 비어 있는 폼을 보게 됨.

올바른 AND 조건:
```ts
// ✅ 셋 다 모이길 기다린 뒤 한 번에 적용
useEffect(() => {
  if (hasHydrated.current) return;
  if (!hopeUnivsData || !preferSelectsData || !simpleQuestionData) return;
  // 셋 다 있음을 보장한 뒤 일괄 적용
  // ... apply all ...
  hasHydrated.current = true;
}, [...]);
```

이 AND-gating은 "여러 비동기 소스를 단일 트랜잭션으로 묶기"의 React 버전이다.

```
[OR 패턴]                          [AND 패턴]
hopeUnivsData 도착 → 적용+lock      hopeUnivsData 도착 → wait
preferSelectsData 도착 → blocked   preferSelectsData 도착 → wait
simpleQuestionData 도착 → blocked  simpleQuestionData 도착 → 셋 다 적용+lock
```

> **요약**: "한 번만"의 핵심은 **언제 한 번인가**다. 부분 적용 후 한 번이면 다른 부분이 잃어버려진다. **모두 도착한 뒤 한 번**이 정답.

#### Step 61-3: 의존성 배열의 의미 — 가드와 deps의 협업

`useEffect(callback, deps)`에서 deps는 "이 값들이 바뀔 때마다 callback을 다시 실행하라"는 의미.

```ts
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
```

여기에 셋을 넣은 이유:
- React Query의 `data`는 **요청 도착 시 reference가 바뀐다** (`undefined` → 실제 객체).
- 첫 렌더에선 셋 다 `undefined`일 수 있음 → effect 발사되나 가드에 걸려 return.
- 데이터가 하나씩 도착할 때마다 deps 값 변경 → effect 재발사 → AND 통과 시 한 번 적용.

**deps에 무엇을 넣을지의 일반 원칙**:

| 변수 종류 | deps 포함? | 이유 |
|---|---|---|
| 쿼리 data, props, state | ✅ | 값이 바뀌면 effect 재실행 필요 |
| setter (`setX`, `dispatch`) | 선택 — 안 넣어도 OK | React가 stable reference 보장 |
| ref (`hasHydrated`) | ❌ | 변경이 리렌더 안 일으키므로 deps 의미 없음 |
| handler/dropOptions 같은 합성 객체 | 보수적으로 ✅, 안정성 확신 시 ❌ | useMemo/useCallback 없으면 매 렌더 새 ref |

ESLint `react-hooks/exhaustive-deps`는 effect 본문에서 사용한 모든 변수를 deps에 넣길 요구한다. 우리 코드는 handler·dropOptions의 setter들도 본문에서 호출하지만 deps에는 안 넣었다 — setter는 stable이라 안전하다고 판단한 trade-off다. 경고가 거슬리면 `// eslint-disable-next-line react-hooks/exhaustive-deps` 또는 React 19의 `useEffectEvent`(실험적)로 우회.

#### Step 61-4: race condition — 데이터 도착 전 사용자가 입력하면?

이 패턴의 가장 미묘한 결함: **데이터가 늦게 오면 사용자 입력을 덮어쓸 위험**.

```
t=0    페이지 마운트 → 폼 빈 상태 → 쿼리 발사
t=0.1  사용자가 빠르게 활동1 textarea에 "내가 적은 내용..." 입력 시작
t=0.5  쿼리 도착 → effect 발사 → 가드 통과 → setSelfActivity1(server.emphasis1) → 사용자 입력 ❌ 덮어씌워짐
```

발생 확률은 낮다(쿼리는 보통 빠르고, 사용자가 마운트 직후 즉시 입력할 가능성 낮음). 하지만 0은 아님.

세 가지 완화책, 강도순:

**(a) 데이터 도착 전 폼 자체를 disabled / 가림 (가장 안전)**
```tsx
const isLoading = !hopeUnivsData || !preferSelectsData || !simpleQuestionData;

{isLoading ? (
  <FormSkeleton />
) : (
  <ActualForm {...allProps} />
)}
```

**(b) form 전체에 opacity + pointer-events-none**
```tsx
<form className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
```

**(c) 필드별 dirty 추적 → dirty인 필드만 prefetch 스킵 (가장 사용자 친화)**
react-hook-form 등 폼 라이브러리가 자동 제공하는 기능. 직접 구현하려면 각 필드마다 "사용자가 건드렸나" boolean을 관리해야 해 복잡.

이 프로젝트는 단순함을 위해 어떤 완화도 안 적용했다 — 발생 확률이 낮고, 발생해도 사용자가 다시 입력하면 됨. 사용자 보고가 들어오면 **(a)**부터 적용.

#### Step 61-5: React Query 캐시와의 상호작용

React Query는 `staleTime`이 지나면 백그라운드에서 자동 refetch한다. 이때 prefetch effect는 어떻게 동작할까?

시나리오:
```
t=0     페이지 마운트 → 쿼리 fetch → 데이터 도착 → effect 적용 → hasHydrated=true
t=10s   사용자가 폼 일부 편집
t=5min  staleTime 만료 → React Query 백그라운드 refetch
t=5min+ 새 데이터 도착 → data reference 변경 → effect deps 변화 → effect 재발사
        가드 if (hasHydrated.current) return; → 건너뜀 ✅
```

즉 **ref 가드 덕분에 refetch가 사용자 편집 내용을 덮어쓰지 않는다.** 이게 의도된 동작.

다만 알아둘 점:
- **컴포넌트가 unmount/remount되면** ref도 새로 만들어진다. 다시 prefetch 적용.
- Confirm 페이지의 confirm 쿼리들과 **같은 queryKey**라면 React Query 캐시 공유 — 첫 도착이 빠르다. 이건 이득.

> **요약**: `useRef` 가드는 "**한 hook 인스턴스 안에서 한 번**"이다. 컴포넌트가 unmount/remount되면 새 가드 → 다시 적용. 의도한 라이프사이클과 맞는지 검토.

#### Step 61-6: 대안 패턴들 — 언제 다른 걸 쓸까?

prefetch effect는 강력하지만 만능은 아니다. 상황별 다른 옵션:

**(a) 직접 렌더 — 폼 시드가 아니라 표시용**
사용자가 편집하지 않는 데이터(읽기 전용)는 state로 옮길 필요가 없다. 그냥 렌더:
```tsx
<p>{hopeUnivsData?.[0]?.univName}</p>
```
이 프로젝트의 Confirm 페이지가 이 패턴이다. 편집 불가니까 state 동기화가 불필요. **prefetch effect보다 압도적으로 단순**하니, 편집할 일이 없으면 무조건 이 쪽.

**(b) `useQuery`의 `select` 옵션 — 변환만**
```ts
useQuery({
  queryKey,
  queryFn,
  select: (data) => data.map(transform),  // 응답을 변환해서 컴포넌트에 다른 모양으로 노출
});
```
변환 결과를 state로 옮기지 않으니 사용자 편집 시나리오엔 안 맞음. 하지만 "보여주기 전에 한 번 변환"이 필요할 때 깔끔.

**(c) 폼 라이브러리의 `reset(data)`**
react-hook-form, formik 등을 쓴다면 prefetch 후 `reset(serverData)` 한 줄로 끝.
```ts
const { reset } = useForm();
useEffect(() => {
  if (data) reset(data);  // ← 라이브러리가 dirty 추적까지 자동 처리
}, [data, reset]);
```
우리 프로젝트는 `useState` 기반이라 수동 매핑이 필요했다. 폼이 더 커지면 react-hook-form 도입 고려.

**(d) Next.js `initialData` / SSR hydration**
서버 컴포넌트에서 데이터 prefetch → 클라이언트로 hydrate. App Router의 표준 패턴 중 하나.
```ts
// 서버 컴포넌트
const data = await fetchOnServer();
<ClientComponent initialData={data} />
```
이번 케이스는 클라이언트 전용 페이지라 적용 안 함. 하지만 SEO/초기 렌더가 중요한 페이지에선 첫 선택지.

**(e) URL 쿼리스트링** ([Phase 5의 "방법 1"](#phase-5-수정하기--페이지-간-데이터-전달-두-가지-방식-비교))
서버 prefetch가 가능해진 지금은 거의 안 씀.

> **선택 기준 (의사결정 표)**:
>
> | 상황 | 추천 패턴 |
> |---|---|
> | 편집 가능한 폼 시드, 서버 API 있음 | **prefetch effect** (이 패턴) |
> | 읽기 전용 표시 | 직접 렌더 |
> | 응답 변환만 (사용자 편집 없음) | `useQuery({ select })` |
> | 폼 라이브러리 도입한 프로젝트 | 그 라이브러리의 `reset/setValue` |
> | SEO/초기 렌더 중요 | SSR initialData |
> | 서버 API 없음 | sessionStorage (Phase 5/10) |

#### Step 61-7: 흔한 버그와 디버깅 팁

| 증상 | 원인 후보 | 빠른 디버깅 |
|---|---|---|
| 폼이 안 채워짐 | 쿼리 응답이 빈 배열/undefined / 가드 조건 잘못 | `console.log({hope: hopeUnivsData})` / Network 탭 |
| 사용자 입력이 사라짐 | `hasHydrated` 누락 / ref가 매 렌더 새로 만들어짐(잘못된 위치) | `console.log('hydrate?', hasHydrated.current)` |
| effect가 두 번 적용 | StrictMode dev 환경의 의도적 이중 마운트 | dev에서만 그러는 거면 무시 가능. ref 가드로 차단됨 |
| 무한 루프 | deps에 effect 본문에서 set하는 state가 있음 | deps에서 그 state 제거 또는 setter ref 안정화 |
| 한 페이지 진입에 두 번 prefetch | 컴포넌트가 remount되고 있음 (parent key 변경 등) | React DevTools로 mount 횟수 확인 |
| Confirm에서는 되는데 Apply에선 안 됨 | 두 페이지의 hook 인스턴스가 분리됨 — 정상. 다만 prefetch 적용 로직이 한쪽에만 있을 수 있음 | 페이지별로 prefetch 책임 분리 정책 결정 |
| 응답은 OK인데 DropDown 매치 안 됨 | 타입 비대칭 (Phase 20) | `typeof data.x` 로 number vs string 확인 |

자주 쓰는 진단 로그 한 줄:
```ts
useEffect(() => {
  console.log('[prefetch]', {
    hydrated: hasHydrated.current,
    hope: !!hopeUnivsData,
    prefer: !!preferSelectsData,
    simple: !!simpleQuestionData,
  });
}, [hopeUnivsData, preferSelectsData, simpleQuestionData]);
```

#### Step 61-8: sessionStorage 복원 vs 서버 prefetch — 결정적 차이

같은 "초기값 시드" 문제를 두 방법으로 풀 수 있다. 이번 프로젝트는 후자로 옮겨갔다.

| 항목 | sessionStorage (Phase 5/10) | 서버 prefetch (이 Phase 19) |
|---|---|---|
| 데이터 소유 | 클라이언트(브라우저) | 서버 |
| 진실의 원천 | 모호함 — 두 군데 동시 존재 | 서버 단일 |
| 다른 기기/세션 | ❌ (탭/세션 단위) | ✅ (계정 기준) |
| 오프라인 동작 | ✅ 가능 | ❌ 불가 |
| 동기화 책임 | 프론트가 양쪽 챙겨야 함 | 서버에 위임 |
| 데이터 일관성 | 깨질 가능성 (race, stale) | 보장 |
| 코드 복잡도 | 중간 (직렬화/역직렬화 + 키 관리) | 낮음 (React Query 위임) |
| 첫 신청자 처리 | 비어 있음(자연스러움) | 빈 응답 처리 필요 |
| 보안 | 클라이언트에 데이터 노출 | 서버 측 인증 통과해야 접근 |

이 프로젝트가 sessionStorage에서 서버 prefetch로 넘어간 흐름:
1. 서버 API가 없을 땐 sessionStorage 외 선택지가 없었음 (Phase 5/10).
2. 서버에 확정 후 조회 API가 생긴 순간, sessionStorage는 **불필요한 중복**으로 전락.
3. "서버가 진실의 원천" 정책으로 일관성을 보장하면서 클라이언트 코드를 단순화.

```
[과거]                              [현재]
사용자 입력                          사용자 입력
  ↓                                  ↓
sessionStorage 저장 ←┐                서버 POST
  ↓                  │                  ↓
페이지 이동           │                저장됨 (서버)
  ↓                  │                  ↓
sessionStorage 복원 ─┘                페이지 이동
  ↓                                    ↓
폼 채움                              서버 GET (React Query)
                                       ↓
                                     prefetch effect → 폼 채움
```

> **결정 한 줄**: 서버에 같은 데이터를 가진 API가 존재한다면, sessionStorage 의존을 *완전히* 걷어내라. 두 캐시를 유지하면 동기화 책임이 모호해지고, 결국 어디서 어긋난다.

---

### Step 62: 알려진 데이터 갭

서버 응답이 일부 필드를 누락한다. 코드로는 메울 수 없는 부분이라 명시적으로 빈 값으로 두고 백엔드 보완을 추적.

| 폼 필드 | 응답 출처 | 복원 가능? |
|---|---|---|
| 카드의 대학/학과 | `HopeUnivsResponse[].univCode/majorIdHsb` | ✅ |
| **카드의 계열(aiBdPart)** | 응답에 없음 | ❌ 빈 값 |
| 선호 전공/지역 | `PreferSelectsResponse.preferParts/preferAreas` | ✅ |
| 강조 활동/간단 질문 | `SimpleQuestionResponse` | ✅ |
| **비교과 추가 입력(`subjectNot`)** | 응답에 없음 | ❌ 빈 값 |

> 클라이언트에서 역추적도 가능하다 — 예: `(univCode, majorIdHsb)`로 `fetchAiBdCategoryList + fetchMajorListByUnivAndAiBd` 루프를 돌려 aiBdPart 찾기. 그러나 카드당 O(계열 수)의 API 호출이 누적되고, 부분 캐시로도 첫 prefetch 비용이 크다. **백엔드가 응답 필드를 추가하는 게 정답.**

### Step 63: sessionStorage 코드 일괄 제거

서버가 진실의 원천이 됐으므로 더 이상 스냅샷을 저장/복원할 이유가 없다.

- Apply의 복원 useEffect → 제거 (대체: prefetch effect)
- Apply의 handleSubmit 안 스냅샷 setItem → 제거 (서버가 저장하니 중복)
- Confirm의 복원 useEffect → 제거 (대체: confirm 쿼리들)
- `useAdmissionEvaluationConfirmSummary` 같이 sessionStorage 기반이던 훅 → 파일 삭제

**예외**: 신청 완료 상태 플래그(`applyComplete`) 같은 "단순 boolean"은 sessionStorage 유지(전용 API가 없을 때 한정).

### Step 64: 첫 신청자(서버에 데이터 없음) 처리

prefetch는 모든 사용자에게 발사된다. 첫 신청자도 confirm 쿼리들이 호출되는데, 두 가지 경우를 graceful하게 다뤄야 한다.

- **서버가 빈 배열/객체 반환**: `hopeUnivsData = []` → `restoredCards = []` → 빈 폼과 동일. 문제 없음.
- **서버가 404 반환**: `data === undefined` → 가드(`if (!hopeUnivsData) return;`)에 걸려 effect 미실행 → 빈 폼 유지.

다만 404가 콘솔 에러로 찍히는 게 거슬리면 [Phase 9의 `throwOnError: false`](#phase-9-백엔드-미구현-엔드포인트-안전-호출-throwonerror-우회-패턴) 패턴을 confirm 쿼리들에 적용.

### 교훈

> 같은 데이터를 **클라이언트 캐시(sessionStorage)**와 **서버** 두 곳에 두지 마라. 어느 한쪽이 진실의 원천이고, 다른 쪽은 그것의 일시적 뷰여야 한다. 서버 API가 갖춰지는 순간 sessionStorage를 *완전히* 걷어내는 게 단순성과 데이터 일관성 면에서 이득. 동기화 책임이 모호한 두 캐시는 항상 어디서 어긋난다.

---

## Phase 20: 서버 응답의 `number` vs 요청의 `string` — 대칭 깨짐 사냥

### 배경: 같은 ID가 어디서는 string, 어디서는 number

신청 POST는 Swagger에서 모든 코드 필드를 string으로 요구한다.

```json
{ "majorIdHsbs": ["12345", "12346"], "preferProvsCodes": ["1", "2"] }
```

그런데 조회 응답들에서는 같은 코드가 number로 온다.

```json
{ "univCode": 1046, "majorIdHsb": 16219191, "preferProvsCode": 1 }
```

이 **요청 ↔ 응답 비대칭**이 한 세션 안에서 두 가지 서로 다른 사고로 나타났다.

### 발견 경로 ① — 서버 검증이 막은 경우

수정하기로 들어와 prefetch가 카드를 채우고, 사용자가 입력완료를 누르자:

```
VALIDATION_PIPE_ERROR: each value in majorIdHsbs must be a string
```

NestJS `class-validator`의 `@IsString({ each: true })` 검증이 차단한 것. 원인 추적:

1. prefetch가 응답의 `majorIdHsb: 16219191` (number)를 그대로 `drop3.value`에 넣음.
2. 타입은 `StringDropDownOption.value: string`인데 런타임은 number — **silent type drift**.
3. handleSubmit이 `card.options.drop3.value`를 모아 `majorIdHsbs`로 보냄 → `number[]` JSON.
4. 서버 검증 차단.

### 발견 경로 ② — UI가 조용히 비어 있는 경우

선호 지역 드롭다운이 prefetch 후에도 placeholder만 표시. 콘솔 로그는 정상 데이터를 보여줌:

```
preferSelectsData.preferAreas = [{num:1, provCode:'1', provName:'서울'}]
```

원인:
- DropDown은 `selectedValue === option.value`로 라벨을 찾아 표시.
- 옵션 출처(`usePreferProvsList`)는 서버가 `preferProvsCode: 1` (number)로 줘 `option.value = 1` (number).
- 복원값은 `String(provCode) = '1'` (string).
- `'1' === 1` → **false** → 매치 실패 → 빈 드롭다운.

**같은 비대칭이 다른 곳에서 다른 증상으로 발현**됐다. 검증 에러는 "왁자지껄"하게 죽고, 매칭 실패는 "조용히" UI만 비어 있다.

### Step 65: 어디에서 정규화할 것인가

세 가지 위치가 가능. 각각의 트레이드오프:

| 위치 | 장점 | 단점 |
|---|---|---|
| **백엔드** | 단일 해결, 프론트 코드 그대로 | 배포 필요, 협의 필요 |
| **API 함수 boundary** (`fetchXxx`) | 한 번만 normalize, 모든 사용처 안전 | 약간의 boilerplate, raw 타입 분리 |
| **사용처마다** (`String(...)`) | 변경 범위 최소 | 새 사용처 추가 시 빠뜨리기 쉬움 — 함정 |

이 프로젝트는 **사용처별 `String(...)` 정규화**로 둘 다 패치했다(API boundary는 다른 turn에서 시도했다 보류).

```ts
// 1) 카드 복원 (useAdmissionEvaluationApplyForm)
drop1: { value: String(item.univCode), label: item.univName },
drop3: { value: String(item.majorIdHsb), label: item.majorName },

// 2) 선호 복원 (같은 훅)
drop5: { value: String(pa1.provCode), label: pa1.provName },

// 3) 옵션 매핑 (useApplyDropOptions)
{ label: item.preferProvsName, value: String(item.preferProvsCode) }
{ label: item.preferAiPartsName, value: String(item.preferAiPartsCode) }
```

총 네 군데. 패턴이 같아 한꺼번에 보이지만, **각각 빠뜨리면 다른 증상으로 터진다.**

### Step 66: 근본 해결은 백엔드 통일 — TODO로 추적

같은 코드를 사용처마다 정규화하는 건 **새 사용처를 추가할 때 빠뜨릴 위험**이 있다. 진짜 해결은 백엔드가 응답 코드 필드를 모두 string으로 통일하는 것.

다음 필드들이 영향 범위:

| 엔드포인트 | 필드 | 현재 응답 |
|---|---|---|
| `GET /admission-evaluation/univs` | `univCode` | number |
| `GET /admission-evaluation/prefer-aiparts` | `preferAiPartsCode` | number 의심 |
| `GET /admission-evaluation/prefer-provs` | `preferProvsCode` | **number 확인됨** |
| `GET /admission-evaluation/hope-univs` | `univCode`, `majorIdHsb` | number |
| `GET /admission-evaluation/prefer-selections` | `pPartCode`, `provCode` | number 의심 |

요청 메시지(백엔드용):

> 신청 요청 body(`POST /admission-evaluation/apply`)는 모든 코드 필드를 string으로 받습니다. 그런데 조회 응답들이 같은 코드를 number로 반환합니다. 프론트 DropDown은 옵션과 선택값을 `===` 비교해 라벨을 표시하는데, 타입이 다르면 매치가 깨져 선택 상태가 표시되지 않습니다. 모든 응답의 코드 필드를 **string으로 통일**해 주세요(요청 body와 동일 형식).

TODO 마커를 한 곳에 모아두면 잊지 않는다:

```ts
/**
 * TODO(backend): 응답의 코드 필드들을 모두 string으로 통일 요청.
 *   - univCode, majorIdHsb, preferAiPartsCode, preferProvsCode 등
 * 통일 완료 시 useApplyDropOptions / useAdmissionEvaluationApplyForm 의
 * String(...) 정규화 모두 제거 가능.
 */
```

### 교훈

> **`.json<HopeUnivsResponse[]>()` 같은 ky의 json 캐스팅은 타입 단언이지 검증이 아니다.** 서버가 다른 형식을 줘도 TS는 잡지 못한다. 외부 시스템과의 경계에서 명시적으로 정규화하거나, 더 안전하게는 zod 같은 런타임 검증을 둬라.

> **요청 ↔ 응답 비대칭은 가장 흔한 사고 원인이다.** 같은 의미의 필드를 한쪽은 string, 다른 쪽은 number로 받으면 차이만큼 프론트가 어댑터 코드를 떠안는다. 발견하는 즉시 백엔드와 정렬 요청 — 어댑터를 늘리는 건 단기 해결, 정렬이 본 해결.

---

## Phase 21: state updater는 pure해야 한다 — `alert()` 함정

### 증상

카드 삭제(X) 버튼을 누르면 "카드는 최대 6개까지 추가할 수 있습니다" alert가 뜨는 것처럼 보였다. 그런데 코드를 보면 wiring이 멀쩡:

- `handleDeleteCard`: `filter`만, alert 없음.
- `handleAddCard`: alert가 있긴 한데, **`setSelectedCards`의 updater 안**에 있음.
- `CloseButton`: `type="button"` + `e.stopPropagation()` — 다른 핸들러로 못 샘.

### 원인: React StrictMode의 의도적 이중 호출 + impure updater

React 공식 가이드:
> State updater functions **MUST be pure**. They should only compute and return the next state. Don't call setState inside them, don't trigger side effects (alert, fetch, mutation...), don't mutate prev state.

문제의 코드는 정확히 이 규칙을 위반.

```ts
// ❌ updater 안에서 alert (side effect)
setSelectedCards((prevState) => {
  if (prevState.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return prevState;
  }
  return [newCard, ...prevState];
});
```

StrictMode(개발 모드)에서 React는 **updater 함수를 의도적으로 두 번 호출**한다 — pure하지 않은 updater를 잡아내기 위함. 그래서:

- handleAddCard 호출 1회 → updater 2회 실행 → **alert 2회 발사**.
- 비동기/배치/concurrent 시나리오에서는 다른 시점에 또 실행될 수도 있어, 사용자에겐 "관련 없는 클릭에서 alert가 뜨는 것처럼" 느껴진다.

여기서 사용자는 X 클릭 후 alert를 보고 "삭제가 alert를 띄운다"고 보고했다. 실제론 직전 add 시도의 updater가 StrictMode/concurrent 타이밍에 다시 호출되거나, 다른 경로로 leak된 것.

### 해결: 검사를 updater 밖으로

```ts
const handleAddCard = () => {
  // ...기존 validation...

  // ✅ updater 밖에서 검사 — 이벤트 핸들러 본문은 한 번만 실행됨
  if (selectedCards.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return;
  }

  setSelectedCards((prevState) => {
    if (prevState.some((card) => card.id === cardId)) return prevState;
    return [newCard, ...prevState];
  });
};
```

이렇게 하면:
- updater는 pure (이전 상태 조회 + 다음 상태 반환만).
- alert는 이벤트 핸들러 본문에서 한 번만 발사.
- StrictMode에서 updater가 두 번 돌아도 alert는 한 번.

**보너스 — 같은 검사로 버튼 disabled까지**:

```tsx
<Button disabled={selectedCards.length >= 6} onClick={onAddCard}>
  희망 대학 리스트에 추가
</Button>
```

alert는 사용자가 강제로 시도했을 때의 안전망이고, 정상 흐름에서는 버튼이 비활성화돼 시도조차 안 하게 된다 → UX 명확.

### Phase 21 짧은 부수 정리: 6슬롯 placeholder

확인 페이지의 희망 대학 카드는 항상 6슬롯을 보여주고 싶었다. 카드가 2개면 4개는 "비어 있음" placeholder.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
  {Array.from({ length: MAX_HOPE_CARDS }).map((_, idx) => {
    const item = hopeUnivsData?.[idx];
    if (item) {
      return <FilledCard key={item.num} item={item} />;
    }
    return (
      <div
        key={`empty-${idx}`}
        className="... border-dashed bg-gray-50 text-gray-400 ..."
      >
        비어 있음
      </div>
    );
  })}
</div>
```

`MAX_HOPE_CARDS = 6`을 공유 const(`libs/const.ts`)에 두고 handler.handleAddCard의 추가 제한과 의미를 일치시킴 — 한 곳에서 정책 관리.

### 교훈

> **setState의 updater는 pure function이다.** `(prev) => next` 외 다른 일은 하지 마라.
> - 검증/alert/console.log → handler 본문 (updater 밖)
> - 다른 setState 호출 → handler 본문 또는 useEffect
> - 외부 API 호출 → handler 본문 또는 useEffect
>
> StrictMode dev에서 updater가 두 번 호출되는 건 **버그가 아니라 기능**이다. 그 안에서 두 번 일어나면 안 되는 일(alert, fetch 등)을 미리 잡아준다. "왜 알람이 두 번 뜨지?"가 신호다.

> **"왜 다른 곳에서 부작용이 발생하지?"라는 미스터리의 절반은 impure updater다.** updater에 side effect를 넣지 않으면, 진단 시간이 절약된다.

---

## Phase 22: Confirm 모드의 "빈값 숨김" 분기 패턴

### 배경

같은 컴포넌트를 **Apply(편집)** 와 **Confirm(확인)** 두 모드에서 재사용할 때, "확인 모드에선 입력값이 비어 있는 항목 자체를 숨긴다"는 정책이 한 세션 안에서 세 곳에서 발견됐다.

1. `AdmissionScoreStatus`의 **비교과 추가 입력** Textarea
2. `EmphasisActivityInput`의 **활동 1~3** Textarea
3. **희망 대학 카드** 6슬롯 (이건 약간 변형 — 빈 슬롯을 placeholder로)

세 곳 모두 "사용자가 입력한 것만 보여준다"는 같은 원칙을 다른 모양으로 적용한다. 한 번 익히면 새 항목이 추가될 때 자동으로 같은 패턴을 쓰면 된다.

### Step 67: 단일 항목 — `mode ? hasValue : conditionForMode` 패턴

기존엔 `showComparativeExtra` (3-1 미입력일 때만 노출)만으로 게이트했다.

```ts
// before
const showComparativeExtra = studentRecordComparativeStatus.some(...);
{showComparativeExtra && <Textarea ... />}
```

확인 모드에선 추가로 "값이 있을 때만" 조건이 더해진다. 두 조건을 모드별로 가르면 깔끔.

```ts
// after
const showComparativeExtra = studentRecordComparativeStatus.some(...);

// 확인(confirm) 모드에선 입력값이 있을 때만 노출 — 빈 입력은 숨김
// 신청(edit) 모드에선 기존대로 3-1 미입력 조건만 적용
const showComparativeExtraSection = confirmPage
  ? !!comparativeExtraInfo
  : showComparativeExtra;

{showComparativeExtraSection && <Textarea ... />}
```

**패턴의 일반화**:
```
visible = mode === '확인' ? hasValue(value) : modeAgnosticCondition
```

### Step 68: 다중 항목 — 배열 + filter + map

`EmphasisActivityInput`은 활동1/2/3을 `ActivityTextarea`로 3번 그렸다. 거의 동일한 코드 복붙.

```tsx
// ❌ before — 복붙 3번
<ActivityTextarea title="활동1" label="..." value={selfActivity1} onChange={...} />
<ActivityTextarea title="활동2" label="..." value={selfActivity2} onChange={...} />
<ActivityTextarea title="활동3" label="..." value={selfActivity3} onChange={...} />
```

배열로 추상화하면 빈값 필터링이 한 줄로 끝난다.

```tsx
// ✅ after — 배열 + filter + map
const activities = [
  { title: '활동1', value: selfActivity1, onChange: setSelfActivity1 },
  { title: '활동2', value: selfActivity2, onChange: setSelfActivity2 },
  { title: '활동3', value: selfActivity3, onChange: setSelfActivity3 },
];

const visibleActivities = confirmPage
  ? activities.filter(({ value }) => !!value)   // confirm: 값 있는 것만
  : activities;                                  // edit: 전부

return (
  <ContLayout type="sm">
    {visibleActivities.map(({ title, value, onChange }) => (
      <ActivityTextarea
        key={title}
        title={title}
        label={ACTIVITY_PLACEHOLDER}
        value={value}
        maxLength={100}
        readOnly={confirmPage}
        onChange={onChange ?? NOOP}
      />
    ))}
  </ContLayout>
);
```

**얻는 것**:
- 활동 4번째 추가가 한 줄(배열 원소 추가) — JSX 안 건드림.
- 동일한 긴 placeholder 문자열을 `ACTIVITY_PLACEHOLDER` 상수로 단일화 — 문구 수정이 한 곳.
- `NOOP = () => {}` 모듈 상수 — 매 렌더마다 새 함수 생성 회피(메모리/리렌더 최적화).
- 확인 모드 빈값 숨김이 `.filter(...)` 한 줄.

### Step 69: 변형 — 항상 N슬롯, 빈 슬롯은 placeholder

희망 대학 카드는 한 발 더 나간다. "Confirm에서 항상 6슬롯을 보여주되, 채워진 카드 + 빈 placeholder 카드를 grid에 자동 정렬".

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
  {Array.from({ length: MAX_HOPE_CARDS }).map((_, idx) => {
    const item = hopeUnivsData?.[idx];
    if (item) {
      return <FilledCard key={item.num} item={item} />;
    }
    return (
      <div
        key={`empty-${idx}`}
        className="... border-dashed bg-gray-50 text-gray-400 ..."
      >
        비어 있음
      </div>
    );
  })}
</div>
```

**핵심 기법**: `Array.from({ length: N })`로 **항상 N번 순회**하고, 각 슬롯에서 데이터 유무로 분기. "데이터 길이만큼만 그린다"가 아니라 "**항상 N개 슬롯을 그리고 각자 채울지 비울지 결정**".

`MAX_HOPE_CARDS`를 공유 const(`libs/const.ts`)로 두고 `handler.handleAddCard`의 추가 제한과 의미를 일치시킴 — 한 곳에서 정책 관리.

### 세 가지의 공통 골격

```
1) 단일:     visible = mode ? hasValue : otherCond
2) 다중:     visibleItems = mode ? items.filter(hasValue) : items
3) 슬롯형:   N번 순회 + 각 슬롯: data[i] ? <Filled> : <Empty>
```

**모두 "표시할지 결정"이 데이터 + 모드의 함수**라는 점이 같다. 새 항목이 추가되면 어느 패턴인지 먼저 물어보고 적용.

### 디자인 원칙 — 두 줄

> **Confirm은 진실의 거울이다.** 사용자가 입력한 그대로만 보여줘야 한다. 빈 항목은 거울에 없어야 한다.

> **반복 항목은 배열로 추상화하라.** 분기·필터링·정렬이 한 줄로 끝난다. 4번째 항목 추가가 JSX 안 건드리는지 보고 추상화의 성공을 판단.

---

## Phase 23: 로컬 플래그를 서버 진실로 옮기기 — `isApplyCompleted` 사례

### 배경: 같은 정보를 어디에 둘 것인가

Phase 19에서 sessionStorage 의존을 걷어내고 서버를 진실의 원천으로 옮겼다. 그런데 신청 완료 여부(`isApplyCompleted`)는 여전히 sessionStorage 플래그(`applyComplete: 'true'`)로 남아 있었다. 이걸 서버 API로 옮기는 결정을 다루면서 몇 가지 함정과 의미 분리 이슈가 드러났다.

### Step 70: 흔한 오해 — "submit POST 호출로 상태 확인"

> "submit이 성공하면 그게 완료 아닌가? `submitAdmissionEvaluationApply`로 대체하면 되지 않나?"

**❌ 안 됨.** `submitAdmissionEvaluationApply`는 POST — write 동사다. 호출하면 **새 신청이 또 생성**된다. 상태 확인 용도로 호출하면 매번 새 신청이 일어나는 사고가 발생.

> **HTTP 동사를 헷갈리지 마라.** 상태 확인은 read 동사여야 한다. write(POST/PUT/DELETE)는 데이터를 바꾼다. "확인"이라는 단어가 양쪽에 쓰여도, 데이터를 바꾸지 않는 게 진짜 확인.

### Step 71: 임시 우회 — 기존 GET 쿼리로 derivation

이미 존재하는 confirm 조회 쿼리들이 사용자의 저장된 신청 데이터를 돌려준다. **응답이 비어 있지 않으면 = 신청한 적 있음**.

```ts
const { data: hopeUnivsData } = useConfirmHopeUnivsQuery();
const isApplyCompleted = (hopeUnivsData?.length ?? 0) > 0;
```

이러면 sessionStorage 플래그 없이 서버 진실로 가드 가능. **다만 의미가 살짝 바뀐다.**

| 측면 | sessionStorage 플래그 | GET 쿼리 derivation |
|---|---|---|
| true 되는 시점 | Confirm 모달 "신청완료" 버튼 클릭 | Apply 페이지 submit POST 성공 |
| 의미 | "사용자가 최종 확인까지 마침" | "임시저장 포함, 서버에 데이터 있음" |
| 세션 끊기면 | 사라짐 (탭 닫기) | 유지 (서버에 있으니까) |
| 다른 기기 | false | true |

**이게 정책적으로 맞는지** 백엔드/PO와 정렬 필수.

### Step 72: 정석 — dedicated status API

가장 깨끗한 해결은 백엔드에 **신청 상태 전용 엔드포인트**를 추가:

```
GET /admission-evaluation/apply/status
Response: { isApplyCompleted: boolean }
```

프론트 스캐폴드는 미리 준비해 두면 응답 도착 시 swap이 한 줄로 끝난다.

```ts
// types
export interface AdmissionEvaluationApplyStatusResponse {
  isApplyCompleted: boolean;
}

// api
export const fetchAdmissionEvaluationApplyStatus =
  async (): Promise<AdmissionEvaluationApplyStatusResponse> => {
    return apiClient()
      .get('admission-evaluation/apply/status')
      .json<AdmissionEvaluationApplyStatusResponse>();
  };

// query 훅
export function useAdmissionEvaluationApplyStatusQuery() {
  return useQuery({
    queryKey: ['admissionEvaluationApplyStatus'],
    queryFn: () => fetchAdmissionEvaluationApplyStatus(),
  });
}
```

`useAdmissionEvaluationNavigation` 안에서 sessionStorage.getItem 호출을 이 훅의 데이터로 swap. ConfirmModal의 sessionStorage.setItem도 제거(서버가 알아서 갱신).

### Step 73: 의미 다양성 — "완료"가 의미하는 세 가지

"신청 완료"는 모호한 표현이다. 코드를 읽는 사람이 같은 단어로 다른 걸 떠올릴 수 있다. 가능한 후보:

| 정의 | 어떤 동작이 true로 만드는가 |
|---|---|
| A. **임시저장 완료** | Apply 페이지에서 submit POST 성공 |
| B. **확인 완료** | Confirm 페이지의 모달 "신청완료" 버튼 클릭 |
| C. **최종 확정 완료** | 별도 확정 API 호출 (POST /apply/confirm) — 현재 미구현 |

**현재 구현은 B**(sessionStorage만 세팅, 서버는 아직 모름). **GET 쿼리 derivation은 A**. **정석 API는 백엔드 정책에 따라 A·B·C 중 어느 것이라도 될 수 있음**.

같은 변수명 `isApplyCompleted`로 셋 다 가리킬 수 있으니, 코드 옆 주석이나 더 정확한 이름이 필요하다.

```ts
// ❌ 모호
const isApplyCompleted = ...;

// ✅ 구체적
const hasSubmittedDraft = ...;       // A
const hasConfirmedFinal = ...;        // B/C
```

### Step 74: 백엔드 응답 대기 동안의 트래킹

백엔드에 API 추가를 요청한 후 응답까지 시차가 생긴다. 그 사이 작업이 잊혀지지 않도록:

- **프로젝트 메모리**(Claude memory): "백엔드에 GET /apply/status 요청 완료, 응답 대기 중 (YYYY-MM-DD)"
- **코드 내 TODO 주석**: `// TODO: API 연동 시 ... ; 예상 API: GET /apply/status returning { isApplyCompleted: boolean }`
- **변경 체크리스트**: 응답 도착 시 손볼 곳을 미리 정리
  1. types: response interface 추가
  2. api: fetch 함수 추가
  3. queries: query 훅 추가
  4. navigation 가드 — sessionStorage.getItem → 훅 데이터
  5. Confirm 모달 onClick — sessionStorage.setItem 제거
  6. 진입 시 sessionStorage.removeItem 제거
  7. const.ts에서 `applyComplete` 키 제거

### 교훈

> **같은 boolean 변수도 누가 언제 true로 만드는가에 따라 의미가 달라진다.** `isCompleted`라는 이름은 무엇의 완료인지 말해주지 않는다. 정의를 주석으로 박거나, 더 정확한 이름(`hasSubmittedDraft` / `hasConfirmedFinal` 등)으로 분리하라.

> **상태 확인은 read API로.** write API(POST submit)를 read 용도로 쓰지 마라. 매 호출이 데이터를 바꾸는 사고로 이어진다.

> **백엔드 의존 작업은 메모리/TODO로 추적.** 응답 도착 시 swap 체크리스트를 미리 정리해두면 frictionless하게 전환된다.

---

## Phase 24: 훅 책임 경계 — 결합 vs 분리의 판단 기준

### 배경: "기존 handler에 추가해도 되나?"

리포트 페이지의 "전문가에게 질문하기"용 mutation 훅(`useAdmissionQnaMutation`)이 만들어졌다. 질문이 들어왔다:

> "이 mutation을 `useAdmissionEvaluationHandler`에 합쳐도 되나?"

답은 **❌ 합치면 안 된다**. 이유와 판단 기준을 정리.

### Step 75: 책임 경계의 정의

먼저 각 훅이 무엇을 책임지는지 정확히 본다.

`useAdmissionEvaluationHandler`:
- **신청 페이지(Apply)** 폼의 선택 상태
- 드롭다운 (selectedOption, selectedTypeOption)
- 카드 추가/삭제 (selectedCards, handleAddCard, handleDeleteCard)
- 자격 검증 알림 + 모달 상태 (alertMessage, isConfirmOpen)

`useAdmissionQnaMutation`:
- **리포트 페이지(Report)** 의 전문가 질문 제출
- POST /admission-evaluation/qna

→ **두 책임이 향하는 페이지가 다르다.** 도메인은 같지만(admission-evaluation) 사용처가 다르고, 같이 마운트되지 않는다.

### Step 76: 합치면 일어나는 일 — Phase 17의 재발

`useAdmissionEvaluationHandler`는 이미 `useAdmissionEvaluationApplyForm`(Apply 페이지 전용)에 합성돼 있다. 거기에 QnA mutation까지 들어가면:

1. **Apply 페이지가 안 쓰는 QnA mutation 셋업을 매번 들고 다님** — useMutation의 mutationFn/onError 클로저를 매 렌더 생성.
2. **이름의 모호화** — "Evaluation Handler"가 신청 폼 + 리포트 mutation 둘 다 가리키게 되어 무엇을 책임지는지 모호.
3. **Report 페이지가 Apply 폼 훅을 통째로 부르게 됨** — Phase 17의 "통째 호출 함정"이 그대로 재발(드롭다운 쿼리, 카드 핸들러까지 다 발사).

### Step 77: 의사결정 — 어디에 둘 것인가

| 옵션 | 적용 시점 |
|---|---|
| **A. 페이지에서 직접 사용** | 간단하고 한 곳에서만 쓸 때. 가장 가벼움. |
| **B. 페이지 전용 훅으로 분리** | 로직(검증/제출/후속처리/관련 state)이 페이지 안에서 복잡해질 때. |
| **C. 기존 다른 훅에 합침** | **책임이 같을 때만.** "같은 페이지 + 같은 종류의 상태/동작" → 거의 X. |

QnA 사례에선 **A 또는 B**가 정답. 페이지가 단순하면 A, 복잡해지면 B로 진화.

### Step 78: mutation UX 4가지 체크리스트

QnA 제출 사례에서 보였던 빠진 디테일들을 패턴화한다.

```tsx
// ❌ 부족한 mutation 호출
const { mutate: submitQuestion } = useAdmissionQnaMutation();

<Button onClick={() => submitQuestion({
  userId: currentUser.userId ?? '',
  question: question,
})}>
  질문 제출
</Button>
```

빠진 4가지:

#### ① 빈값 가드
서버에 빈 입력을 보내면 검증 실패하거나(서버 부하), 더 나쁘게는 빈 질문이 저장된다.
```ts
if (!question.trim()) {
  alert('질문을 입력해주세요.');
  return;
}
```

#### ② 인증 가드
`userId ?? ''`로 빈 문자열을 그대로 보내는 건 위험. 비로그인 사용자가 페이지에 도달했을 때 가드.
```ts
if (!currentUser.userId) return;
```

#### ③ `isPending`로 중복 제출 차단
mutation은 비동기. 사용자가 버튼을 빨리 두 번 누르면 두 번 제출된다.
```tsx
const { mutate, isPending } = useAdmissionQnaMutation();

<Button disabled={isPending} onClick={...}>
  {isPending ? '질문 제출 중...' : '질문 제출'}
</Button>
```

#### ④ `onSuccess`로 후속 처리
제출 성공 시 form reset + 알림 + 관련 쿼리 invalidate 등. mutate의 두 번째 인자로 callback 전달.

```ts
submitQuestion(
  { userId: currentUser.userId, question },
  {
    onSuccess: () => {
      setQuestion('');               // textarea 비우기
      alert('질문이 제출되었습니다.');
    },
  },
);
```

> **훅 정의의 onSuccess/onError vs 호출 시점의 onSuccess/onError**
> - 훅 정의(`useMutation({ onError: ... })`): 모든 호출에 공통. 에러 로깅, 공통 알림 등 "모든 호출에서 같은 일" 용도.
> - 호출 시점(`mutate(vars, { onSuccess: ... })`): 그 호출만의 후속처리. form reset, 페이지 이동 등.
>
> 두 곳 다 둘 수 있고, 호출 시점이 훅 정의보다 나중에 실행되는 게 아니라 **둘 다 실행**된다. 역할을 분담시켜라.

### 종합 — mutation의 "기본 4종 세트"

```tsx
// 완성형 패턴
const [question, setQuestion] = useState('');
const { mutate: submitQuestion, isPending } = useAdmissionQnaMutation();

const handleSubmit = () => {
  if (!currentUser.userId) return;        // ② 인증 가드
  if (!question.trim()) {                  // ① 빈값 가드
    alert('질문을 입력해주세요.');
    return;
  }
  submitQuestion(
    { userId: currentUser.userId, question },
    {
      onSuccess: () => {                   // ④ 후속 처리
        setQuestion('');
        alert('질문이 제출되었습니다.');
      },
    },
  );
};

<Button disabled={isPending} onClick={handleSubmit}>
  {/* ③ isPending */}
  {isPending ? '질문 제출 중...' : '질문 제출'}
</Button>
```

이 4가지가 빠지면 사용자는 차례로 다음을 경험한다:
1. 빈값 보냄 → 서버 검증 에러 alert ("뭐가 잘못된 거지?")
2. 비로그인 → 401/403 → 에러 alert ("로그인은 됐는데?")
3. 더블 클릭 → 두 번 제출 → 같은 질문 두 번 등록 ("내가 한 번만 눌렀는데?")
4. 제출 후 textarea 그대로 → 같은 질문 또 보냄 ("아까 보낸 거 맞나?")

### 교훈

> **훅은 책임 단위로 자른다.** 같은 도메인이라도 페이지가 다르고 책임이 다르면 별도 훅. "도메인 이름"으로 묶지 말고 "사용처/책임 단위"로 묶어라.

> **mutation은 호출만 한다고 끝이 아니다.** ① 빈값 가드 ② 인증 가드 ③ isPending로 중복 차단 ④ onSuccess로 후속처리 — 4가지가 기본 세트. 빠뜨리면 사용자는 "버튼을 눌렀는데 아무 반응 없네" 또는 "왜 두 번 보내졌지" 같은 경험을 한다.

> **합치고 싶다 vs 분리해야 한다의 판단**:
> - 두 훅이 같은 페이지에서만 함께 마운트되나? → 합쳐도 OK 가능성
> - 다른 페이지에서 한쪽만 쓰나? → 무조건 분리
> - 책임 이름이 자연스럽게 한 줄로 표현되나? → 한 훅. 두 줄 이상이면 분리.

---

## Phase 25: 신청의 두 단계 — `apply`(draft) vs `submit`(confirmed)

### 배경: 왜 POST가 두 개인가

학종 신청은 **두 단계**로 나뉜다.

| POST 엔드포인트 | 의미 | 수정 가능? |
|---|---|---|
| `/admission-evaluation/apply` | **초안 저장**(draft) | ✅ 다시 POST로 덮어쓰기 가능 |
| `/admission-evaluation/submit` | **최종 확정**(final) | ❌ 이후 어떤 변경도 거부 |

쇼핑몰의 "장바구니 → 결제" 또는 은행 이체 confirm 모달 같은 2-step 패턴과 같은 결. 사용자에게 **"확인" 단계**를 제공해 실수를 막고, "신청완료 후 수정 불가" 정책을 강제하기 위함.

### Step 79: 사용자 상태 머신

세 상태로 정리하면 흐름이 또렷해진다.

```
                  POST /apply                  POST /submit
[빈 상태] ─────────────────→ [DRAFT] ─────────────────→ [CONFIRMED]
                                ↑↓
                          POST /apply (수정)
                          (자기 자신으로 재진입 가능)


CONFIRMED 상태에서 POST /apply 또는 /submit 시도
  → 400 { message: "이미 신청이 완료되었습니다." }
```

| 상태 | 사용자 입장 | 서버 측 의미 |
|---|---|---|
| **빈 상태** | 아직 아무것도 안 함 | 사용자별 신청 row 없음 |
| **DRAFT** | "신청은 했지만 아직 확정 전" | 데이터 저장됐고 수정 가능 |
| **CONFIRMED** | "최종 제출 완료" | lock — 어떤 modify도 거부 |

### Step 80: 페이지별 흐름

```
┌─ APPLY 페이지 ─────────────────────────────────────────────────────┐
│ 마운트 → GET /hope-univs, /prefer-selections, /simple-questions   │
│         (prefetch — 이전 DRAFT 가 있으면 폼에 채움)                │
│ [입력완료] → POST /apply → /confirm 로 이동                        │
└────────────────────────┬───────────────────────────────────────────┘
                         ↓
┌─ CONFIRM 페이지 ───────────────────────────────────────────────────┐
│ 마운트 → 같은 GET 3개 (서버 DRAFT 재조회 → 표시)                  │
│ [수정하기] → /apply 로 이동                                       │
│ [신청완료] → 모달 → [신청] → POST /submit → /report 로 이동       │
└────────────────────────┬───────────────────────────────────────────┘
                         ↓
┌─ REPORT 페이지 ────────────────────────────────────────────────────┐
│ 마운트 → GET /report-header, /transcript-evaluation,             │
│         /application-strategy (CONFIRMED 이후 평가 결과)         │
└────────────────────────────────────────────────────────────────────┘
```

### Step 81: GET 엔드포인트가 끼는 위치

각 GET이 **어느 상태에서 의미 있는지**가 학습 포인트.

| GET | 의미 있는 상태 | 사용 페이지 | 역할 |
|---|---|---|---|
| `/hope-univs` | DRAFT, CONFIRMED | Apply, Confirm | 희망 대학 카드 |
| `/prefer-selections` | DRAFT, CONFIRMED | Apply, Confirm | 선호 전공/지역 |
| `/simple-questions` | DRAFT, CONFIRMED | Apply, Confirm | 강조 활동/간단 질문 |
| `/report-header` | CONFIRMED | Report | 평가 진행 상태 |
| `/transcript-evaluation` | CONFIRMED + 평가 완료 | Report | 학생부 평가 |
| `/application-strategy` | CONFIRMED + 평가 완료 | Report | 추천/비추천 |

**GET은 모두 read-only.** 호출해도 상태 전이 없음. 같은 데이터를 어디서 보든 같음.

### Step 82: 코드 네이밍 — 영어 `apply` ≠ 한국어 "신청"

이 부분이 **가장 큰 혼동 포인트**:

| 코드 이름 | 실제 동작 | 사용자 용어 |
|---|---|---|
| `submitAdmissionEvaluationApply` | POST /apply (draft 저장) | "**입력완료**" |
| `submitAdmissionEvaluationSubmit` | POST /submit (최종 확정) | "**신청완료**" |
| `useAdmissionEvaluationApplyMutation` | apply 호출용 mutation | Apply 페이지 [입력완료] |
| `useAdmissionEvaluationConfirmMutation` | submit 호출용 mutation | Confirm 페이지 [신청완료] |

영어 "apply"가 한국어 "신청"으로 직역되지만, **코드의 `apply`는 "draft 저장"**이고 **한국어 "신청완료"는 실제로 `submit`**. 이 어긋남이 코드 읽을 때 가장 헷갈리는 부분.

**장기적 개명 후보** (가독성 개선):
- `submitAdmissionEvaluationApply` → `saveApplicationDraft`
- `useAdmissionEvaluationConfirmMutation` → `useFinalizeApplicationMutation`

### Step 83: "이미 신청 완료" 에러는 언제

**오직 CONFIRMED 상태에서 modify 시도할 때**:
- 사용자가 한 번 [신청완료] → 모달 [신청] 완료 → 서버 CONFIRMED
- 그 후 어떤 경로로든 /apply 또는 /submit 호출 → 400 거부

발생 가능 경로:
- Confirm 페이지에서 [신청완료] 또 누름 (새로고침 후)
- Apply 페이지에서 [입력완료] 누름 (다른 탭에서 confirm한 줄 모르고)
- 직접 URL로 /apply 진입

처리 방법은 [Phase 28](#phase-28-dedicated-status-api-없을-때--400-에러-응답으로-대체)에서.

### 교훈

> **두 단계 신청은 "확인" 의 가치를 강제한다.** 한 번에 완료되는 흐름보다 코드는 복잡해지지만, 사용자가 본인의 입력을 검토한 뒤 lock을 걸 수 있어 "되돌리기 불가" 정책이 자연스럽게 강제된다.

> **API 동사를 직역하지 마라.** 영어 endpoint 명("apply")이 한국어 UX 단어("신청")와 다른 단계를 가리킬 수 있다. 코드 옆에 "어느 단계인지" 명시하거나 함수명을 그 단계의 의미로 바꾸자.

---

## Phase 26: 빈 응답의 깊이별 판정 — `||`/`??`/`.length`/`.some(meaningful)`

### 배경

"비어있을 때 mock으로 대체" 또는 "비어있으면 검증" 같은 정책을 짤 때, **빈 응답을 어떻게 정의하느냐**가 자주 미묘하게 어긋난다. 한 세션 안에서 같은 함정이 세 번 다른 모양으로 나타났다.

### Step 84: "비어있음"의 세 가지 깊이

```
깊이 1: 값 자체 존재 여부          → undefined, null
깊이 2: 컨테이너가 비어있음        → 빈 배열 [], 빈 객체 {}
깊이 3: 컨테이너에 의미 없는 값만 → [{title:'', content:''}], [0, 0, 0]
```

각 깊이마다 검사 도구가 다르다:

| 깊이 | 도구 | 잡는 것 |
|---|---|---|
| 1 | `??`, `\|\|` | undefined, null (+ falsy 값) |
| 1 + 2 | `.length`, `Object.keys(x).length` | 빈 컨테이너 |
| 1 + 2 + 3 | `.some(predicate)` | 의미 있는 콘텐츠 |

### Step 85: 세 가지 실제 함정 (이 프로젝트)

#### 함정 ① — `||`로 빈 배열 안 잡힘 (깊이 1만 잡음)

```ts
// ❌ 빈 배열은 truthy 라서 mock으로 안 떨어짐
const hopeUnivEvaluations =
  applicationStrategyData?.hopeUnivEvaluations || hopeUnivEvaluationsMOCK;
```

- `undefined` → mock ✓ (의도대로)
- `[]` → **mock 안 됨** ✗ (`[]`은 truthy)

**fix**: `.length` 체크.
```ts
const hopeUnivEvaluations = applicationStrategyData?.hopeUnivEvaluations?.length
  ? applicationStrategyData.hopeUnivEvaluations
  : hopeUnivEvaluationsMOCK;
```

#### 함정 ② — `!data`로 검증 분기 못함 (같은 원리)

```ts
// ❌ 첫 신청자는 hopeUnivsData = [] 라서 검증 블록 진입 못함
if (!hopeUnivsData) {
  // 첫 신청자만 카드/드롭다운 검증
  if (handler.selectedCards.length === 0) alert(...);
}
```

- `undefined`(쿼리 로딩 중) → 검증 ✓
- `[]`(서버가 빈 배열) → **검증 건너뜀** ✗ → 빈 폼 그대로 POST

**fix**: `length` 또는 의미 변수.
```ts
const hasSavedDraft = (hopeUnivsData?.length ?? 0) > 0;
if (!hasSavedDraft) { /* 첫 신청자 검증 */ }
```

#### 함정 ③ — `.length`도 부족, 콘텐츠 깊이까지 봐야 (깊이 3)

```ts
// ❌ 서버가 [{title:'', content:''}] 로 줘도 length 1 이라 통과
const hasAnyData =
  !!datas?.academicAbility?.length ||
  !!datas?.careerCompetency?.length ||
  !!datas?.communityCompetency?.length;
```

서버가 placeholder 객체로 채워서 응답하면 length는 truthy인데 화면엔 빈 카드만 보임.

**fix**: `.some(...)`로 아이템 내부 콘텐츠 확인.
```ts
const hasMeaningfulItems = (items?: CompetencyItem[]) =>
  !!items?.some(({ title, content }) => !!title?.trim() || !!content?.trim());

const hasAnyData =
  hasMeaningfulItems(datas?.academicAbility) ||
  hasMeaningfulItems(datas?.careerCompetency) ||
  hasMeaningfulItems(datas?.communityCompetency);
```

`.trim()`까지 두면 공백/줄바꿈만 있는 케이스도 정리됨.

### Step 86: 정확한 깊이를 고르는 기준

| 데이터 모양 | 필요한 깊이 |
|---|---|
| primitive (string, number) | 1 (`??`, `\|\|`) — 단 빈 문자열 `''`은 falsy주의 |
| 배열/객체 컨테이너 | 1 + 2 (`?.length`, `Object.keys`) |
| 컨테이너 안 아이템 | 1 + 2 + 3 (`.some(predicate)`) — 아이템이 placeholder일 가능성 있을 때 |

**판단법**: "이 데이터가 '비어있다'고 말할 수 있는 경우의 수를 모두 적어보라." 그게 셋이면 깊이 3.

### Step 87: 패턴 — `hasMeaningfulXxx` 헬퍼

`!!arr?.length` 같은 짧은 표현은 깊이 1+2까지 빠르지만 가독성이 낮고 깊이 3은 다루지 못한다. 이름 있는 헬퍼로 빼면:

```ts
const isEmpty = <T>(arr?: T[]) => !arr || arr.length === 0;
const hasMeaningfulItems = <T>(arr: T[] | undefined, predicate: (item: T) => boolean) =>
  !!arr?.some(predicate);
```

호출:
```ts
if (isEmpty(hopeUnivEvaluations)) { /* mock */ }

if (hasMeaningfulItems(data?.academicAbility, ({title, content}) =>
  !!title?.trim() || !!content?.trim())) { /* real */ }
```

코드 의도가 영어 헬퍼 이름으로 표현됨 — `||` 한 줄 대비 의미 명확.

### 교훈

> **"비어있다"는 한 단어가 아니다.** undefined, 빈 배열, 빈 문자열 아이템 — 모두 다른 깊이의 빈. 검사 도구를 데이터 깊이에 맞추지 않으면 함정에 정확히 빠진다.

> **`||`/`??`는 깊이 1까지만 잡는다.** 컨테이너 비교에는 `.length`, 아이템 내부 비교에는 `.some(predicate)`. 같은 fallback 코드가 깊이 1·2·3 어디까지 책임지는지 의식하면서 짜라.

> **헬퍼로 이름 붙이면 의도가 코드에 보인다.** `applicationStrategyData?.hopeUnivEvaluations?.length` 보다 `hasSavedDraft`/`hasMeaningfulItems` 가 다음 작업자에게 친절.

---

## Phase 27: 같은 UI를 두 데이터에 공유 — 제네릭 + render-prop

### 배경

리포트 페이지에 두 섹션이 거의 동일한 UI를 쓴다:
- **희망 대학 평가 결과**: Tab + DropDown 동기화 + 카드 리스트
- **전문가 추천 대학**: Tab + DropDown 동기화 + 카드 리스트

데이터 형태가 다른데 컨테이너 UX는 같다. 그래서 같은 컴포넌트로 묶고 싶다.

### Step 88: 데이터 비교

| | `HopeUnivEvaluation` (희망) | `RecommUnivTab` (추천) |
|---|---|---|
| Tab 키 후보 | `num: number` | `position: number` |
| Tab 라벨 | `univName + typeName + majorName` | `partName + univName` |
| 디테일 배열 | `evaluations: Evaluation[]` | `majors: RecommMajor[]` |
| 디테일 아이템 | `Evaluation` | `RecommMajor` (+ `position`) |

→ **컨테이너 로직(Tab/DropDown 동기화)은 동일**, **콘텐츠 추출과 렌더링은 다름**.

### Step 89: 접근 옵션 셋

| 옵션 | 설명 | 단점 |
|---|---|---|
| **공통 shape 으로 정규화** | 두 데이터를 공통 인터페이스로 변환 후 동일 컴포넌트에 주입 | 약간 다른 필드(예: `position`) 손실되거나 강제 매핑 |
| **제네릭 + render-prop** | 컴포넌트는 컨테이너만 책임, 키/라벨/콘텐츠 추출은 호출자 | 약간의 보일러플레이트 |
| **두 컴포넌트로 분리** | 그냥 두 개로 둠 | UI 변경 시 두 곳 수정 |

**제네릭 + render-prop이 균형이 가장 좋다** — 컨테이너 로직 단일화, 호출자가 자기 데이터 모양 그대로 다룸.

### Step 90: 제네릭 컴포넌트 설계

```tsx
interface EvaluationTabModuleProps<T> {
  items: T[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  getKey: (item: T) => string;          // ← 키 추출
  getLabel: (item: T) => string;         // ← Tab/Dropdown 라벨
  renderContent: (item: T) => React.ReactNode;  // ← 콘텐츠 렌더링
}

export function EvaluationTabModule<T>({
  items,
  selectedValue,
  setSelectedValue,
  getKey,
  getLabel,
  renderContent,
}: EvaluationTabModuleProps<T>) {
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => getKey(item) === selectedValue),
  );

  return (
    <div>
      <DropDown
        options={items.map((item) => ({
          label: getLabel(item),
          value: getKey(item),
        }))}
        addClass="block md:hidden"
        value={selectedValue}
        onChange={(option) => setSelectedValue(option.value)}
      />
      <Tab initTab={selectedIndex}>
        <Tab.List addClass="hidden md:flex">
          {items.map((item) => (
            <Tab.Button
              key={getKey(item)}
              onBeforeChange={() => {
                setSelectedValue(getKey(item));
                return true;
              }}
            >
              {getLabel(item)}
            </Tab.Button>
          ))}
        </Tab.List>
        <Tab.ContentView>
          {items.map((item) => (
            <Tab.Contents key={getKey(item)}>
              {renderContent(item)}
            </Tab.Contents>
          ))}
        </Tab.ContentView>
      </Tab>
    </div>
  );
}
```

**핵심 설계 결정**:
- **제네릭 `<T>`**: 어떤 데이터 모양이든 받음
- **`getKey`/`getLabel`/`renderContent`**: 호출자가 자기 데이터를 어떻게 표현할지 결정
- **`findIndex`로 selectedIndex 계산**: 키 → index 매핑을 컨테이너가 알아서 처리. 기존 `Number(selectedValue) - 1` 같은 인덱스 추정보다 안전

---

### Step 90의 심층 학습 — `<T>` 제네릭 컴포넌트 해부

`function EvaluationTabModule<T>(...)`라는 한 줄에 TypeScript의 핵심 개념이 응축돼 있다. 처음 마주치면 마법 같지만 원리를 알면 가장 강력한 도구 중 하나다. 9개 측면으로 풀어 설명한다.

#### Step 90-1: 왜 제네릭이 필요한가 — `any`/`unknown`/유니온으로 했다면?

같은 컨테이너 UX를 두 데이터 타입(`HopeUnivEvaluation`, `RecommUnivTab`)이 공유해야 하는 상황. 제네릭 없이 푼다면:

**❌ 시도 A: `any`로 받기**
```ts
function EvaluationTabModule({ items }: { items: any[] }) {
  // getLabel: (item: any) => string
}

<EvaluationTabModule
  items={hopeUnivEvaluations}
  getLabel={(item) => item.univNamee}   // ← 오타 — TS가 못 잡음!
/>
```
`any`는 **타입 체크를 꺼버리는** 키워드. 오타·잘못된 필드 접근이 컴파일에서 안 잡히고 런타임에 `undefined`로 잠수.

**❌ 시도 B: `unknown`으로 받기**
```ts
function EvaluationTabModule({ items }: { items: unknown[] }) {
  // ...
}

getLabel={(item) => item.univName}
//                  ^^^^^^^^^^^^^^
//   TS Error: Object is of type 'unknown'.
```
`unknown`은 안전하지만 **너무 안전해서** 아무 필드도 못 씀. 매번 타입 가드/캐스팅 필요 → 사용성 0.

**❌ 시도 C: 유니온 타입**
```ts
function EvaluationTabModule({ items }: {
  items: HopeUnivEvaluation[] | RecommUnivTab[];
}) { ... }
```
문제 2가지:
- 새 데이터 타입(`SomethingElse[]`) 추가할 때마다 컴포넌트 시그니처 수정 필요.
- 내부에서 `item.num`(HopeUniv만 있음) 접근 시 RecommUnivTab에 없어 또 타입 에러.

**✅ 제네릭이 답인 이유**: 컴포넌트는 "어떤 타입이든 다 받을 수 있지만 각 호출에서는 그 타입을 정확히 기억" 한다. 호출자가 자기 데이터 타입에 맞춰 콜백을 작성하면 TS가 그 안에서 `item`을 정확히 추론.

#### Step 90-2: `<T>`의 의미 — "타입 변수"

함수의 일반 매개변수가 "값 변수"인 것처럼, 제네릭의 `<T>`는 **"타입 변수"**.

```ts
// 값 변수 — 함수 호출 시 값이 결정됨
function add(a: number, b: number) { return a + b; }
add(1, 2);   // a=1, b=2

// 타입 변수 — 함수 호출 시 타입이 결정됨
function identity<T>(value: T): T { return value; }
identity<string>('hello');   // T=string (명시)
identity(42);                // T=number  (TS가 추론)
```

`T`는 관례 이름일 뿐 아무 이름이나 가능(`<Item>`, `<DataType>` 등). 보통 한 글자(T, U, K, V)나 의미 있는 PascalCase 이름.

#### Step 90-3: 우리 코드 한 줄씩 풀기

```ts
interface EvaluationTabModuleProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
  // ...
}

export function EvaluationTabModule<T>(
  props: EvaluationTabModuleProps<T>
) { ... }
```

| 줄 | 의미 |
|---|---|
| `interface EvaluationTabModuleProps<T>` | 이 인터페이스는 T라는 타입 변수를 받음. T는 인터페이스 안에서 일관된 의미로 사용 |
| `items: T[]` | items는 T의 배열. T가 `HopeUnivEvaluation`이면 `HopeUnivEvaluation[]` |
| `getKey: (item: T) => string` | item을 받아 string 돌려주는 함수. 호출자가 작성한 함수는 T의 필드를 직접 쓸 수 있음 |
| `function EvaluationTabModule<T>(...)` | 이 함수도 T를 받음 — Props의 T와 **같은** T 임을 컴파일러가 연결 |

호출 시:
```tsx
<EvaluationTabModule
  items={hopeUnivEvaluations}   // ← items 타입이 HopeUnivEvaluation[]
  getKey={(item) => String(item.num)}
  //              ^^^^^^^^^^^^^^^^^
  // item이 HopeUnivEvaluation 으로 자동 추론 → num 필드 사용 가능
/>
```
TS가 `items={...}`를 보고 **T = HopeUnivEvaluation으로 자동 추론**. 이후 모든 콜백 매개변수가 HopeUnivEvaluation으로 좁혀짐.

다른 호출에선 다른 T:
```tsx
<EvaluationTabModule
  items={recommUnivTabs}         // ← T = RecommUnivTab으로 추론
  getKey={(item) => String(item.position)}
  //              ^^^^^^^^^^^^^^^^^^^^^^
  // item이 RecommUnivTab → position 필드 사용 (num은 없음 — RecommUnivTab엔 없으니까)
/>
```

#### Step 90-4: T의 "일관성"이 핵심

```ts
function EvaluationTabModule<T>({
  items,         // T[]
  getKey,        // (T) => string
  renderContent, // (T) => ReactNode
}: EvaluationTabModuleProps<T>) {
  items.map((item) => {
    //         ^^^^ item: T (자동)
    getKey(item);          // OK
    renderContent(item);   // OK
  });
}
```

**한 컴포넌트 호출 안에서 T는 단일 타입.** 만약 items가 `HopeUnivEvaluation[]`인데 getKey가 `(item: RecommUnivTab) => ...`이면 → 컴파일 에러. TS가 "T 일관성"을 강제해서 잘못된 짝을 자동으로 막아준다.

#### Step 90-5: React 컴포넌트 + 제네릭 — JSX 문법 함정

화살표 함수로 작성하면 JSX 파서가 `<T>`를 JSX 태그로 오인:

```tsx
// ❌ 화살표 + 제네릭 — JSX 파서가 깨짐
const EvaluationTabModule = <T>(props: ...) => { ... }
//                          ^^^ 여기서 파싱 오류
```

회피책 3가지:
```tsx
// ✅ 옵션 A: function 선언 (이 프로젝트의 선택)
export function EvaluationTabModule<T>(props: ...) { ... }

// ✅ 옵션 B: trailing comma 트릭
const EvaluationTabModule = <T,>(props: ...) => { ... }

// ✅ 옵션 C: extends 제약
const EvaluationTabModule = <T extends object>(props: ...) => { ... }
```

이 프로젝트는 **A**를 선택. JSX와 가장 깔끔하게 공존하고 가독성도 좋음.

#### Step 90-6: 제약(constraint) — `extends`로 T를 좁히기

T가 "아무거나"가 아니라 "최소한 어떤 필드는 있어야" 한다고 강제 가능:

```ts
// T가 num 필드를 반드시 가져야 함
function Module<T extends { num: number }>(props: { items: T[] }) {
  props.items[0].num;   // ← OK, T가 num을 갖는다고 보장됨
}

Module({ items: hopeUnivEvaluations });   // OK (num 있음)
Module({ items: recommUnivTabs });         // ❌ RecommUnivTab엔 num 없음
```

우리 `EvaluationTabModule`은 T에 **아무 제약이 없다**. 대신 `getKey/getLabel/renderContent`로 호출자가 "T를 어떻게 다룰지"를 통째 위임 → 컴포넌트 자체는 T의 구체 모양을 몰라도 됨. 이게 핵심 설계 결정 중 하나.

#### Step 90-7: render-prop과 제네릭의 궁합

- **제네릭**은 "타입을 매개변수화" 한다.
- **render-prop**은 "렌더링을 매개변수화" 한다.

둘을 결합하면:
```tsx
<EvaluationTabModule
  items={data}                            // 어떤 데이터든
  renderContent={(item) => <Card .../>}   // 어떻게 렌더할지
/>
```

| 역할 | 책임 |
|---|---|
| **컴포넌트** | "Tab + DropDown 동기화"라는 컨테이너 로직만 — 데이터 모양/렌더링 모름 |
| **호출자** | "내 데이터에서 키/라벨/콘텐츠를 어떻게 뽑을지"만 |

책임이 깔끔히 양분된다.

#### Step 90-8: 실전 학습 체크리스트 — 언제 제네릭을 써야 하나

| 신호 | 제네릭이 답일 가능성 |
|---|---|
| 같은 컨테이너 UX를 여러 데이터 타입이 공유 | ✅ |
| 호출자가 "내 데이터로 뭘 할지"를 다 정해줄 수 있음 | ✅ |
| 컴포넌트 안에서 데이터의 특정 필드(`item.num` 등)에 직접 접근 | ⚠️ 제약(`extends`) 필요 |
| 그냥 `any`/`unknown`으로 해도 동작은 함 | ❌ 타입 안전성 잃음 |
| 단일 데이터 타입에서만 쓰일 컴포넌트 | ❌ 불필요한 추상화 |

#### Step 90-9: 짧은 비유

- **일반 함수**: "정수 두 개를 더해주는 계산기" — 정수만 받음
- **제네릭 함수**: "두 개를 합쳐주는 빈 트레이" — 정수도, 문자열도, 객체도 올려놓으면 그 자리에서 그 타입에 맞게 동작

`EvaluationTabModule<T>`는 **빈 트레이**. 호출자가 `HopeUnivEvaluation[]`을 올리면 그 모양으로, `RecommUnivTab[]`을 올리면 그 모양으로 자동 적응. 트레이 자신은 자기가 뭘 들고 있는지 모르지만 **그게 일관되게 같은 종류라는 것**만 보장한다.

#### 정리 한 줄

> **제네릭 컴포넌트는 "데이터 타입을 잠시 비워두고 호출자가 채우게 하는" 패턴이다.** `<T>`는 그 빈자리. 호출 시점에 T가 정해지면 모든 콜백/매개변수가 자동으로 그 타입으로 좁혀져서 **재사용성과 타입 안전성을 동시에** 얻는다.

---

### Step 91: 두 호출부

```tsx
// 희망 대학
<EvaluationTabModule
  items={hopeUnivEvaluations}
  selectedValue={hopeUnivSelectedValue}
  setSelectedValue={setHopeUnivSelectedValue}
  getKey={(item) => String(item.num)}
  getLabel={(item) => `${item.univName} ${item.typeName} ${item.majorName}`}
  renderContent={(item) =>
    item.evaluations.map((ev, idx) => (
      <EvaluationCard key={idx} evaluation={ev} />
    ))
  }
/>

// 전문가 추천 대학
<EvaluationTabModule
  items={recommUnivTabs}
  selectedValue={recommUnivSelectedValue}
  setSelectedValue={setRecommUnivSelectedValue}
  getKey={(item) => String(item.position)}
  getLabel={(item) => `${item.partName} · ${item.univName}`}
  renderContent={(item) =>
    item.majors.map((major, idx) => (
      <RecommMajorCard key={idx} major={major} />
    ))
  }
/>
```

키가 number라 `String(...)` 변환하는 부분은 [Phase 20의 number/string 비대칭](#phase-20-서버-응답의-number-vs-요청의-string--대칭-깨짐-사냥) 패턴과 같음.

### Step 92: 디테일 카드 분리

비슷하지만 다른 필드를 가진 두 디테일 카드는 따로 작은 컴포넌트로:

```tsx
const EvaluationCard = ({ evaluation }: { evaluation: Evaluation }) => (
  <div className="p-4 mb-4 border rounded">
    <p>{evaluation.recomm}</p>
    <p>{evaluation.univName} {evaluation.typeName} {evaluation.majorName}</p>
    <p>{evaluation.refText}</p>
    <p>전년도 경쟁률 : {evaluation.lastCR ?? '-'}</p>
  </div>
);

const RecommMajorCard = ({ major }: { major: RecommMajor }) => (
  <div className="p-4 mb-4 border rounded">
    <p>
      {major.recomm}
      {major.position && <span className="ml-2">· {major.position}</span>}
    </p>
    <p>{major.univName} {major.typeName} {major.majorName}</p>
    <p>{major.refText}</p>
    <p>전년도 경쟁률 : {major.lastCR ?? '-'}</p>
  </div>
);
```

두 카드의 차이는 `RecommMajor`에 `position`이 추가된 것뿐. 거의 같지만 별도로 둬서 각자 디자인 진화 가능.

### Step 93: render-prop vs 다른 패턴

| 패턴 | 언제 적합 |
|---|---|
| **render-prop**(이번 선택) | 콘텐츠 모양이 달라 호출자가 통제해야 할 때 |
| **children prop** | 단일 슬롯만 필요할 때 (이번엔 키/라벨/콘텐츠 3개라 부적합) |
| **컴포넌트 합성**(`<Tabs><Tab.Header/>...`) | 더 큰 구조 자유도 필요할 때. 보일러플레이트 ↑ |
| **공통 shape 정규화** | 데이터 모양이 정말 같아질 수 있을 때 |

### 교훈

> **컨테이너와 콘텐츠를 분리하라.** Tab/DropDown 동기화 같은 "관리" 로직은 컴포넌트로, 데이터에서 키/라벨/콘텐츠를 어떻게 뽑을지는 호출자로 위임. 이러면 새 데이터 타입이 추가돼도 컨테이너는 안 건드림.

> **`Number(selectedValue) - 1` 같은 인덱스 추정은 위험하다.** 데이터 순서가 1, 2, 3 으로 깨끗하지 않을 수도 있고(예: num=1, 5, 7), 키 형태가 달라지면 동작 안 함. `findIndex(getKey)`로 키 매칭이 안전.

---

## Phase 28: dedicated status API 없을 때 — POST 에러 응답으로 대체

### 배경

[Phase 23](#phase-23-로컬-플래그를-서버-진실로-옮기기--isapplycompleted-사례)에서 `isApplyCompleted`를 sessionStorage 플래그에서 서버 진실로 옮기는 방향을 다뤘다. 정석은 `GET /admission-evaluation/apply/status` 같은 상태 전용 API. 하지만:

> 백엔드: "그건 따로 안 줘. POST /apply가 이미 거부 응답을 주잖아 — 그걸로 알 수 있어."

서버는 CONFIRMED 상태에서 POST 시도하면:
```json
HTTP 400
{
  "alias": "UNKNOWN",
  "message": "이미 신청이 완료되었습니다.",
  "code": 400
}
```

이 응답을 **사실상의 status API 대체**로 쓸 수 있다.

### Step 94: 트레이드오프 — 사전 차단 vs 사후 처리

| | dedicated status API | POST 에러 응답 |
|---|---|---|
| 진입 차단 (Navigation guard) | ✅ 페이지 마운트 전 | ❌ 호출 전엔 모름 |
| 버튼 disabled 사전 표시 | ✅ | ❌ |
| **제출 시 거부 + 안내** | ✅ | ✅ — 서버가 항상 최후 방어선 |
| **진실의 원천이 서버** | ✅ | ✅ |
| 백엔드 추가 작업 | 필요 | 불필요 (이미 있음) |

실용 효과는 거의 같다 — 사용자가 confirm 페이지에서 [신청완료] 누르는 순간 서버가 알려주니까. **사전 차단이 절대 필요한 UX가 아니라면 충분**.

### Step 95: 에러 식별 헬퍼

ky의 `HTTPError`를 잡아 메시지로 분기:

```ts
import { HTTPError } from 'ky';

const ALREADY_COMPLETED_MESSAGE = '이미 신청이 완료되었습니다.';

export async function isAlreadyCompletedError(error: unknown): Promise<boolean> {
  if (!(error instanceof HTTPError)) return false;
  if (error.response.status !== 400) return false;
  try {
    const body = await error.response.clone().json<{ message?: string }>();
    return body.message === ALREADY_COMPLETED_MESSAGE;
  } catch {
    return false;
  }
}
```

`response.clone()`을 쓰는 이유: ky의 onError에서 body를 이미 한 번 읽었을 수 있어서 clone으로 안전하게 재읽기.

### Step 96: 처리 위치 — 호출자 vs mutation 훅

**A. 호출자(handler)에서 try/catch**
```ts
const handleSubmit = async () => {
  try {
    await submitApply(requestData);
    router.push('/.../confirm');
  } catch (error) {
    if (await isAlreadyCompletedError(error)) {
      alert('이미 신청이 완료된 상태입니다.');
      router.push('/.../report');
      return;
    }
    throw error;
  }
};
```

**B. mutation 훅의 onError에서 처리** (페이지마다 중복 안 됨)
```ts
export function useAdmissionEvaluationApplyMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: submitAdmissionEvaluationApply,
    onError: async (error) => {
      if (await isAlreadyCompletedError(error)) {
        alert('이미 신청이 완료되었습니다.');
        router.push('/.../report');
        return;
      }
      console.error('학종 신청 실패:', error);
      alert('신청에 실패했습니다.');
    },
  });
}
```

**B가 더 깨끗** — 모든 호출 site에서 동일 처리. 단, 페이지별 UX 분기가 필요하면 A.

### Step 97: 메시지 매칭의 취약성

```ts
return body.message === '이미 신청이 완료되었습니다.';
```

한국어 문자열이 코드의 식별자. **백엔드가 메시지를 바꾸면 프론트가 즉시 깨진다.** 임시 OK지만 장기로는 안 좋다.

**더 안전한 매칭**:
```ts
// 백엔드에 에러 코드 표준화 요청
{ "code": "APPLY_ALREADY_COMPLETED", "message": "..." }
```
프론트는 코드(언어 무관 식별자)로 분기. 다국어 지원 시에도 안전.

**TODO 마커로 추적**:
```ts
// TODO(backend): 에러 응답에 "code" 또는 "alias" 필드 표준화 요청
// 현재는 message 문자열 매칭 (취약) — code 기반으로 전환 예정
```

### Step 98: 부가 — POST body 의 표준 형식

이 작업 중 같이 잡힌 함정: POST body에 **원시값을 그대로 넣지 마라**.

```ts
// ❌ 서버가 JSON 객체 body 기대 → 파싱 깨짐
await apiClient().post('/submit', { json: userId });
// 실제 body: "mynesin24" (JSON 문자열 리터럴)

// ✅ 객체로 감싸기
await apiClient().post('/submit', { json: { userId } });
// 실제 body: {"userId":"mynesin24"}
```

실제 발생 에러:
```
UNKNOWN: Unexpected token '"', ""mynesin24"" is not valid JSON
```

REST API의 POST body는 거의 항상 JSON 객체. 원시값 하나만 보내고 싶어도 객체로 감싸는 게 표준 — DTO 매핑/validation/추후 필드 추가가 모두 객체 전제.

### 교훈

> **dedicated status API가 없어도 서버는 항상 진실을 안다.** POST 시도에 대한 거부 응답으로 충분히 derive 가능. 사전 차단이 절대 필요한 UX가 아니면 추가 API 만드는 것보다 에러 응답 활용이 가성비 좋다.

> **에러 매칭은 메시지 문자열보다 코드/alias로.** 한국어 문구가 식별자가 되면 다국어/리팩토링에 취약. 백엔드와 에러 코드 표준 합의가 장기적으로 안전.

> **POST body는 객체로 감싸라.** 원시값을 `{ json: value }`로 그대로 넣으면 서버가 JSON 객체 기대와 어긋난다. `{ json: { fieldName: value } }`가 표준.

---

## Phase 25-28 합쳐서 — 오늘 한 일의 한 그림

```
사용자 입력
  ↓
Apply: POST /apply (draft)              ─┐
  ↓                                       │
Confirm: 검토                              ├─ Phase 25 (두 단계 흐름)
  ↓                                       │
Confirm 모달: POST /submit (final)      ─┘
  ↓
Report 페이지
  ├─ 학생부 평가 결과
  │    ├─ StudentRecordEvaluation
  │    │    └─ 빈 응답 처리 ── Phase 26 (깊이별 판정)
  │    │         └─ hasMeaningfulItems
  │    └─ Mock fallback
  ├─ 수시 지원 전략
  │    ├─ 희망 대학 ─┐
  │    │            ├─ Phase 27 (같은 UI 공유)
  │    │            │   └─ EvaluationTabModule<T> + render-prop
  │    └─ 추천 대학 ─┘
  └─ 전문가에게 질문 (mutation 4종 세트 — Phase 24)


CONFIRMED 상태에서 POST 재시도
  → 400 "이미 신청이 완료되었습니다."
  → Phase 28 (status API 없을 때 — 에러 응답 활용)
```

---

## Phase 29: Next.js 서버 가드 — 훅 규칙의 경계 + options로 페이지별 정책

### 배경

Apply / Confirm / Report 세 페이지의 **진입 조건**이 모두 다르다:
- `/apply`: 비로그인 차단. 결제+완료된 사용자가 URL 직타로 진입 시 → Report로
- `/confirm`: 비로그인 차단. 결제+완료된 사용자 → Report로
- `/report`: 비로그인 차단. 미완료 사용자 → INTRO로

이걸 클라이언트 useEffect로 처리하면 **페이지 한 번 그려진 후 redirect** 깜빡임 발생. Next.js App Router의 정석은 **서버 컴포넌트 페이지의 진입 가드를 async 함수로** 두는 것.

### Step 99: `use*` 접두사 함정 — 훅 규칙으로 검사됨

처음 시도한 코드:
```ts
// ❌ navigation.server.ts
export async function useAdmissionEvaluationNavigationHandler() {
  const currentUser = await getCurrentUser();
  const { data: applyStatusData } =
    await useAdmissionEvaluationApplyStatusQuery();   // ← 훅 호출
  // ...
}
```

위반 사항이 여러 개:

| 위반 | 설명 |
|---|---|
| `use*` 네이밍 컨벤션 | React 규칙: "use로 시작하는 함수는 반드시 React Hook." ESLint의 `react-hooks/rules-of-hooks`가 즉시 검사 시작 |
| async + 훅 | 훅은 동기 렌더링 컨텍스트에서만 동작 — `async function` 본문에서 훅 호출은 React가 추적 불가 |
| 훅에 `await` | 훅은 Promise 아님. `{ data, isLoading }` 객체를 즉시 리턴. `await`은 의미 없음 |
| 서버에서 클라이언트 훅 | `.server.ts` + `redirect` from `next/navigation` = 서버 컨텍스트. React 렌더 트리 없는 곳에서 훅 호출은 불가 |

> **규칙 한 줄**: `use*` 접두사를 쓰면 **그 함수가 훅이라고 컴파일러·린터가 가정**한다. 훅이 아니면 다른 이름을 써라. `getXxx`, `ensureXxx`, `fetchXxx` 등.

### Step 100: 올바른 형태 — 일반 async 함수 + fetch 직접 호출

```ts
// ✅ 일반 async 함수, 훅 X
export async function ensureAdmissionEvaluationAccess() {
  const currentUser = await getCurrentUser();
  if (!currentUser.userId) {
    redirect(ADMISSION_EVALUATION_PATH.INTRO);
  }
  // React Query 훅 대신 fetch 함수 직접 호출
  const applyStatus = await fetchAdmissionEvaluationApplyStatus();
  return { currentUser, isApplyCompleted: applyStatus?.completed ?? false };
}
```

핵심 변화:
- `use*` → 동사형 일반 함수명 (`ensureXxx`, `getXxx`)
- `useXxxQuery()` (훅) → `fetchXxx()` (api 함수 직접 호출)
- 반환값은 `await Promise` 결과

### Step 101: `alert`는 서버에서 ReferenceError

```ts
// ❌ 서버에서
alert('로그인이 필요합니다.');   // ReferenceError: alert is not defined
redirect(INFO_PATH);
```

`alert`는 브라우저 전용(`window.alert`). 서버 런타임(Node.js)엔 `window` 없음.
- `alert` 라인에서 즉시 `ReferenceError` throw
- redirect 도달 못 함 → 사용자는 500 에러 페이지만 봄

서버에서 사용자에게 안내 전달하려면:
- **옵션 A**: 그냥 redirect (도착 페이지가 알아서 안내)
- **옵션 B**: 쿼리 파라미터에 reason 담아 보냄 → 도착 페이지(client)가 읽어 alert
- **옵션 C**: `cookies().set('flash', 'reason')` → 도착 페이지가 읽고 지움

대부분 A로 충분. 안내가 정말 필요하면 B.

### Step 102: options 패턴 — 페이지별 다른 정책

3개 페이지가 같은 함수를 호출하되 각자 정책이 다르니, **options 객체로 분기**:

```ts
export async function ensureAdmissionEvaluationAccess(options?: {
  /** 신청 완료 안 된 경우 INTRO 로 보냄 (Report 페이지용) */
  redirectIfNotCompleted?: boolean;
  /** 결제 + 신청 모두 완료된 경우 REPORT 로 보냄 (Apply/Confirm 페이지용) */
  redirectIfCompleted?: boolean;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser.userId) redirect(INTRO);

  const applyStatus = await fetchAdmissionEvaluationApplyStatus();
  const isApplyCompleted = applyStatus?.completed ?? false;

  // Report: 미완료 → INTRO
  if (options?.redirectIfNotCompleted && !isApplyCompleted) {
    redirect(INTRO);
  }

  // Apply/Confirm: 결제+완료 → REPORT
  if (options?.redirectIfCompleted && isApplyCompleted) {
    const isPaid = await fetchSusiPaymentStatus();
    if (isPaid) redirect(REPORT);
  }

  return { currentUser, isApplyCompleted };
}
```

호출:
```tsx
// apply/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });

// confirm/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });

// report/page.tsx
await ensureAdmissionEvaluationAccess({ redirectIfNotCompleted: true });
```

### Step 103: 옵션 이름 ↔ 동작 일치의 중요성

한때 시도된 패턴:
```ts
// ❌ 옵션 이름과 동작이 어긋남
if (isApplyCompleted && options?.redirectIfNotCompleted) {
  redirect(REPORT);
}
```

`redirectIfNotCompleted`(미완료면 리다이렉트) 라는 이름이 `isApplyCompleted`(완료) 인 경우에 발동 → 정반대. 한 옵션으로 두 정반대 동작을 처리하려는 충동을 막아야 함.

| 의도 | 옵션 이름 |
|---|---|
| 미완료면 INTRO로 | `redirectIfNotCompleted` |
| 완료면 REPORT로 | `redirectIfCompleted` |

두 정책이 정반대니 **옵션도 정확히 두 개**. 한 옵션으로 묶으면 의미가 모호.

### Step 104: 결제 fetch 위치 — 조건부 호출로 최적화

```ts
// ❌ 모든 진입에서 결제 조회
const isPaid = await fetchSusiPaymentStatus();

// ✅ 필요할 때만 조회 — 결제 완료 안 됐을 사용자는 결제 정보 자체 필요 없음
if (options?.redirectIfCompleted && isApplyCompleted) {
  const isPaid = await fetchSusiPaymentStatus();
  if (isPaid) redirect(REPORT);
}
```

`isApplyCompleted` 가 false 면 결제 여부는 redirect 결정에 영향 없음. 호출 자체를 안 하는 게 빠름. 가장 흔한 케이스(첫 신청자)의 페이지 진입 속도 ↑.

### 교훈

> **`use*` 접두사는 React Hook 한정 예약어다.** 훅이 아니면 동사형 일반 함수명을 써라. ESLint가 그 이름을 본 순간부터 hook rules로 검사한다.

> **서버 함수에서는 클라이언트 훅도, `alert` 도 못 쓴다.** fetch 함수를 직접 호출하고, 사용자 안내는 redirect 경로나 쿼리 파라미터로.

> **옵션 이름과 동작은 정확히 일치해야 한다.** "이 옵션 켜면 무슨 일이 일어나는가"를 이름이 그대로 말해줘야 한다. 두 정반대 동작을 한 옵션에 묶지 마라.

---

## Phase 30: Mutation 후 화면 갱신 — Cache Invalidation 표준 패턴

### 배경

질문을 제출했는데 **화면이 그대로**다. 가드(`remainingQuestions`, `items.length`)도 옛 값. 사용자가 한 번 더 제출 가능. 직전에 보낸 질문은 카운트에 반영 안 됨.

원인은 React Query의 **stale cache**.

### Step 105: stale cache 문제 한 그림

```
t=0  qnaListData = { remainingQuestions: 3, items: [] }   ← 캐시
     사용자: 첫 질문 제출 → POST 성공
t=1  서버에는 items 1개 추가됨, remainingQuestions=2
     하지만 클라이언트 캐시는 그대로 { remainingQuestions: 3, items: [] }
t=2  사용자: 두 번째 질문 시도
     가드: 옛값 사용 → 통과 → 또 제출
     서버는 진짜를 알지만 클라이언트는 모름
```

mutation은 서버 상태를 바꾸지만 **React Query 캐시까지는 자동으로 갱신 안 한다** — 우리가 명시적으로 알려줘야 함.

### Step 106: 결정적 함정 — `new QueryClient()`

처음 시도한 코드:
```ts
// ❌ queries.ts
onSuccess: (_, { userId }) => {
  alert('질문이 성공적으로 제출되었습니다.');
  const queryClient = new QueryClient();   // ← 새 인스턴스!
  queryClient.invalidateQueries({
    queryKey: ['admissionReportQnaList', userId],
  });
},
```

`new QueryClient()` 는 **완전히 새, 독립된** QueryClient 인스턴스를 만든다. 앱이 실제로 쓰는 QueryClient(`<QueryClientProvider>` 가 들고 있는 것)는 건드리지 않는다.

비유:
> "방금 산 빈 노트의 메모를 지웠다" — 진짜 문제의 노트는 그대로.

invalidate가 **실제 캐시엔 아무 영향 없음** → refetch 안 됨 → 화면 안 바뀜.

### Step 107: 정답 — `useQueryClient()` 훅

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient();   // ✅ 앱이 제공한 진짜 인스턴스
  return useMutation({
    mutationFn: submitAdmissionReportQna,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['admissionReportQnaList', userId],
      });
    },
  });
}
```

| | `new QueryClient()` | `useQueryClient()` |
|---|---|---|
| 가져오는 client | 새 빈 인스턴스 | 앱의 `QueryClientProvider`가 제공한 인스턴스 |
| invalidate 효과 | 새 인스턴스 안 캐시만 (사실상 없음) | 앱이 실제 쓰는 캐시 → useQuery 가 refetch |
| 사용 위치 | (이론상) 외부 코드 | React 컴포넌트/훅 본문 |

### Step 108: invalidate 표준 위치 — mutation 정의 안

mutation의 onSuccess를 **두 곳**에 둘 수 있다:
- **mutation 정의의 onSuccess** (queries.ts) — 모든 호출에 공통
- **mutate 호출 시의 onSuccess** (mutate(vars, { onSuccess })) — 그 호출만의 후속

역할 분담:
| 위치 | 담당 |
|---|---|
| **정의 안 onSuccess** | 캐시 invalidate, 공통 로깅 |
| **호출 시 onSuccess** | UI 후속 처리 (form reset, alert, 페이지 이동) |

```ts
// queries.ts — 정의: 캐시 관리
export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAdmissionReportQna,
    onSuccess: (_, { userId }) => {
      // 모든 호출에서 공통으로: 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['admissionReportQnaList', userId],
      });
    },
    onError: (error) => {
      console.error('질문 제출 실패:', error);
      alert('질문 제출에 실패했습니다.');
    },
  });
}

// 호출 site — UI 후속만
submitQuestion(
  { userId, question },
  {
    onSuccess: () => {
      setQuestion('');
      alert('질문이 제출되었습니다.');
    },
  },
);
```

> **두 onSuccess는 둘 다 실행된다.** 정의 쪽이 먼저, 호출 쪽이 그 다음. 역할만 분담하면 충돌 없음.

### Step 109: alert 중복 함정

정의·호출 양쪽에서 alert 띄우면 사용자에게 2번 보임:
```ts
// queries.ts onSuccess
alert('질문이 성공적으로 제출되었습니다.');   // 1번째

// Report.tsx 호출 site onSuccess
alert('질문이 제출되었습니다.');             // 2번째
```

→ 정의에서 alert 제거, 호출 site에서만.

### Step 110: 더 빠른 반응이 필요하면 — Optimistic Update

invalidate는 "서버에서 다시 받아오기" 라 round-trip 1회. 사용자 클릭 즉시 화면 반영하려면 optimistic update 패턴:

```ts
onMutate: async ({ userId, question }) => {
  await queryClient.cancelQueries({ queryKey: ['admissionReportQnaList', userId] });
  const previous = queryClient.getQueryData(['admissionReportQnaList', userId]);
  queryClient.setQueryData(['admissionReportQnaList', userId], (old) => ({
    ...old,
    remainingQuestions: Math.max(0, (old?.remainingQuestions ?? 0) - 1),
    items: [...(old?.items ?? []), { question, ... }],
  }));
  return { previous };
},
onError: (_err, { userId }, context) => {
  // 실패 시 롤백
  if (context?.previous) {
    queryClient.setQueryData(['admissionReportQnaList', userId], context.previous);
  }
},
onSettled: (_data, _err, { userId }) => {
  // 성공/실패 어느 쪽이든 서버 진실로 동기화
  queryClient.invalidateQueries({ queryKey: ['admissionReportQnaList', userId] });
},
```

- 장점: 클릭 즉시 화면 반영 (낙관적 갱신)
- 단점: 코드량 ↑, 실패 시 롤백 로직 필요

흔치 않은 액션(QnA 제출 등)은 invalidate만으로 충분. 자주 일어나는 액션(좋아요 등)에 optimistic 권장.

### 교훈

> **`new QueryClient()` 는 invalidate 의도엔 절대 안 된다.** 새 빈 인스턴스라 실제 캐시 안 건드림. 반드시 `useQueryClient()` 훅으로 진짜 인스턴스 가져와야 함.

> **mutation 정의 onSuccess vs 호출 시 onSuccess — 역할 분담.** 정의는 "캐시 관리" 공통 책임, 호출은 "UI 후속" 개별 책임. 둘 다 실행되니 중복 alert 주의.

> **mutate 후 화면 안 바뀌면 첫 의심은 cache invalidation 누락.** queryKey 가 정확히 일치하는지도 점검.

---

## Phase 31: 인터랙티브 UI 만들기 — Pointer Events + StarRating 사례

### 배경

별점(0.5 단위, 5점 만점) UI를 PC 마우스 드래그 + Mobile 터치로 지원하고 싶다. 두 입력 방식을 따로 코딩하지 말고 통합하는 게 학습 포인트.

### Step 111: Pointer Events — 마우스+터치 통합 인터페이스

브라우저에는 두 가지 입력 이벤트 계열이 있다:
- **MouseEvents** (`onMouseDown/Move/Up`): PC 마우스
- **TouchEvents** (`onTouchStart/Move/End`): 모바일 터치

이걸 둘 다 다루면 코드가 두 배. 대신 **Pointer Events** 는 둘 다 통합한다:

| Pointer 이벤트 | 마우스 | 터치 | 펜 |
|---|---|---|---|
| `onPointerDown` | mousedown | touchstart | pen down |
| `onPointerMove` | mousemove | touchmove | pen move |
| `onPointerUp` | mouseup | touchend | pen up |

```tsx
<div
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
>
```

이 한 세트로 마우스·터치·펜 모두 처리. 추가로 `onPointerCancel` 은 시스템이 입력을 끊는 경우(예: 시스템 모달 등장) 처리.

### Step 112: `setPointerCapture` — 영역 밖으로 나가도 추적

드래그 중 사용자가 컨테이너 밖으로 빠르게 손가락/마우스를 이동시키면 보통 `onPointerMove`/`Up` 이벤트가 끊긴다. `setPointerCapture`는 이걸 막아준다:

```tsx
const handlePointerDown = (e: React.PointerEvent) => {
  e.currentTarget.setPointerCapture(e.pointerId);   // ← 이 pointer는 이 요소가 끝까지 추적
  // ...
};
```

사용자가 별 영역을 벗어나도 손 뗄 때까지 `onPointerMove`/`Up` 이 계속 들어옴.

### Step 113: 두 레이어 width% 오버레이 — 시각 패턴

별 5개를 0.5 단위로 표현하려면 별 하나하나를 분기하기보단 **같은 배경을 두 번 깔고 전경의 width%로 채움 비율 표현**:

```tsx
<div className="relative inline-block">
  {/* 배경: 빈 별 5개 */}
  <div className="flex text-gray-300">★★★★★</div>

  {/* 전경: 채워진 별 5개 — width 로 채움 비율 */}
  <div
    className="absolute top-0 left-0 flex overflow-hidden text-yellow-400 whitespace-nowrap"
    style={{ width: `${fillPercentage}%` }}
  >
    ★★★★★
  </div>
</div>
```

3.7 별, 1.5 별, 0.5 별 등 **어떤 비율이든 자연스럽게 표현**된다.

이 패턴은 별점뿐 아니라 다른 진행 표시기에도 응용 가능 (HP 바, 로딩 등).

### Step 114: 0.5 단위 스냅 (또는 임의 단위)

```ts
const calculateValue = (clientX: number) => {
  const rect = containerRef.current!.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(ratio * TOTAL_UNITS);
};
```

`TOTAL_UNITS`가 곧 단위 해상도:
- `TOTAL_UNITS = 5` → 1.0 단위 (1, 2, 3, 4, 5)
- `TOTAL_UNITS = 10` → 0.5 단위 (0.5, 1.0, 1.5, ...) — 5 stars × 2
- `TOTAL_UNITS = 100` → 0.05 단위 (소수점 두 자리)

`Math.round` 만으로 정확한 단위 스냅 가능.

### Step 115: hoverValue vs value 분리 — 드래그 미리보기

```ts
const [hoverValue, setHoverValue] = useState<number | null>(null);

const handlePointerDown = (e) => {
  // ...
  setHoverValue(calculateValue(e.clientX));   // ← 미리보기만
};

const handlePointerMove = (e) => {
  if (isDragging) setHoverValue(calculateValue(e.clientX));
};

const handlePointerUp = () => {
  if (hoverValue !== null) onChange(hoverValue);   // ← 손 떼는 순간 커밋
  setHoverValue(null);
};

const displayValue = hoverValue ?? value;   // 표시: 드래그 중엔 미리보기, 아니면 확정값
```

이러면 **부모는 손 떼는 순간 한 번만 리렌더**. 드래그 중 매번 onChange 부르면 부모가 매 px 마다 리렌더 → 성능 저하.

### Step 116: 내부 정수 vs 외부 표시 분리

서버가 `@IsInt()` 로 정수만 받는 상황. 0.5 단위 UI를 유지하면서 정수로 전송하려면:

```ts
const TOTAL_STARS = 5;
const TOTAL_UNITS = TOTAL_STARS * 2;   // 10 — 반 별 단위로 쪼갠 총 눈금

// 내부 값(컴포넌트 외부 API): 0 ~ 10 정수
const value = 7;   // = 3.5 별

// 시각 표시 (라벨용)
const visualStars = value / 2;          // 3.5
const fillPercentage = (value / TOTAL_UNITS) * 100;   // 70%
```

| 영역 | 단위 | 예시 |
|---|---|---|
| 외부 (value/onChange) | 0 ~ 10 정수 | `7` |
| 내부 시각 | 5점 만점, 0.5 단위 | "3.5 / 5" |

사용자엔 익숙한 5점 만점으로 보이고, 서버엔 정수로 전송. **백엔드 정수 컬럼 그대로 사용 가능** (DB 마이그레이션 불필요).

> **단, 컨벤션을 백엔드 DTO 주석에 명시.** "satisfiedRate: 0~10, 1 단위 = 반 별, 만점 10" 처럼. 그렇지 않으면 평균 계산할 때 "왜 7점이 만점이지?" 같은 혼동 발생.

### Step 117: `disabled` prop — 잠금 시 클릭 무시

```ts
const handlePointerDown = (e) => {
  if (disabled) return;   // ← 가드
  // ...
};
```

가드 + 시각 변화(`cursor-not-allowed opacity-50`)로 잠금 상태 표현.

### 교훈

> **Pointer Events 가 마우스/터치를 둘 다 처리한다.** 따로 코딩하지 마라. `setPointerCapture` 까지 곁들이면 드래그 추적이 안정적.

> **시각적 비율 표현은 두 레이어 + width% 가 가장 단순하다.** 별 하나하나 분기하지 말고 같은 콘텐츠를 깔고 위 레이어의 width 로 채움 비율 조절.

> **드래그 미리보기는 컴포넌트 내부 hoverValue 로.** 부모 onChange 는 손 떼는 순간만 호출. 성능 + 부모 코드 단순화.

> **외부 단위와 내부 시각 단위를 분리할 수 있다.** 서버 요구(정수)와 UX(0.5 단위)가 안 맞을 때 유용한 절충안.

---

## Phase 32: server-first display, local fallback 패턴

### 배경

별점을 한 번 제출하면 다시 못 바꾸는 정책. 페이지 진입 시 사용자가 이전에 제출한 별점이 있다면 **그 값을 보여주고 잠금** 처리하고 싶다.

순진한 시도:
```ts
const [rating, setRating] = useState(0);
const { data: satisfactionSurveyData } = useSatisfactionSurveyQuery(userId);

useEffect(() => {
  if (satisfactionSurveyData?.satisfiedRate) {
    setRating(satisfactionSurveyData.satisfiedRate);
  }
}, [satisfactionSurveyData?.satisfiedRate]);
```

이게 동작은 하지만 **세 가지 문제**:
1. 페이지 로드 → 빈 별 → useEffect 발동 → 별이 채워짐 (깜빡임)
2. `useEffect`로 sync 코드가 매번 보임 (보일러플레이트)
3. 캐시 변경(invalidate) 시 사용자가 드래그 중이었다면 그 입력을 덮어쓸 위험

### Step 118: 더 깨끗한 패턴 — derived display value

useEffect 없이 **렌더 시점에 어느 값을 보여줄지 결정**:

```ts
const [rating, setRating] = useState(0);   // 사용자가 새로 드래그한 임시 값
const { data: satisfactionSurveyData } = useSatisfactionSurveyQuery(userId);

const isAlreadyRated = (satisfactionSurveyData?.satisfiedRate ?? 0) > 0;

// derived: 이미 제출했으면 서버 값, 아니면 로컬 값
const displayRating = isAlreadyRated
  ? (satisfactionSurveyData?.satisfiedRate ?? 0)
  : rating;

<StarRating value={displayRating} onChange={setRating} disabled={isAlreadyRated} />
```

흐름:

```
[케이스 A: 미제출 사용자]
  satisfactionSurveyData = { satisfiedRate: null }
  isAlreadyRated = false
  displayRating = rating (로컬 0)
  → 별 비어 있음, 드래그 가능

[케이스 B: 이미 제출한 사용자]
  satisfactionSurveyData = { satisfiedRate: 7 }
  isAlreadyRated = true
  displayRating = 7 (서버 값)
  → 별 채워져 있음, disabled
```

**useEffect 없음, sync 코드 없음, 깜빡임 없음.** `displayRating` 은 단순한 ternary로 매 렌더에 결정.

### Step 119: 왜 derived가 useEffect보다 깨끗한가

| | useEffect로 sync | derived value |
|---|---|---|
| 코드 양 | useEffect 본문 5줄+ | 한 줄 ternary |
| race condition | 가능 (data 도착 vs 사용자 입력) | 없음 (선택 명확) |
| 깜빡임 | 있음 (빈 별 → 채워짐) | 없음 (처음부터 올바른 값) |
| 캐시 변경에 따른 자동 갱신 | 가능하지만 setState 사이클 | 자동 (다음 렌더가 새 derived 값) |

> **규칙**: "state로 따로 들고 있어야 하는가, 아니면 props/server 값에서 매번 계산 가능한가?" 후자면 derived value 가 답.

### Step 120: mutation cache invalidation 과의 짝

derived 패턴 단독으론 부족. 제출 직후 서버 값이 캐시에 안 들어오면 `isAlreadyRated` 가 계속 false 다. → mutation 의 onSuccess에서 invalidate (Phase 30):

```ts
export function useSubmitSatisfactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSatisfactionSurvey,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['satisfactionSurvey', userId],
      });
    },
  });
}
```

이러면 흐름:
1. 사용자: 별점 7 드래그 → `rating = 7`
2. [별점 남기기] 클릭 → mutate
3. 서버 성공 → mutation onSuccess → invalidateQueries
4. `useSatisfactionSurveyQuery` 가 refetch → `satisfactionSurveyData.satisfiedRate = 7`
5. `isAlreadyRated = true` → `displayRating = 7` (server 우선)
6. StarRating disabled

**사용자 입장에서: 클릭 → 잠시 후 자동으로 잠금.** 새로고침 안 해도 됨.

### Step 121: 새로고침 후에도 잠금 유지

derived + invalidation 패턴의 보너스: **새로고침해도 잠금 유지**.
- 새로고침 → 컴포넌트 마운트 → `useSatisfactionSurveyQuery` 재실행
- 서버에 이전 제출 값 존재 → `satisfactionSurveyData.satisfiedRate = 7`
- `isAlreadyRated = true` → 처음부터 잠긴 상태로 그려짐

**Phase 19의 "서버가 진실의 원천" 정책의 응용.** 로컬 sessionStorage 같은 임시 저장 없이 서버 데이터가 곧 잠금 상태.

### Step 122: 다른 적용처

이 패턴(`isXxx ? serverValue : localValue`)은 별점 외에 다양한 곳에 응용 가능:
- **읽기 전용 폼 필드**: 이미 확정된 입력은 서버값 표시, 아니면 사용자 입력
- **카운터의 마지막 동기화 값**: 서버 카운트 vs 사용자가 막 누른 클릭
- **공유 cursor 위치**: 다른 사용자가 있으면 그 위치, 아니면 본인 위치

### 교훈

> **server-first / local fallback 은 useEffect로 sync 보다 깔끔하다.** 단순 ternary로 매 렌더에 결정하면 race condition도 깜빡임도 없다.

> **derived value + mutation invalidate는 한 쌍이다.** 한 쪽만 두면 미완성. 서버 변경이 클라이언트 캐시에 반영돼야 derived 값이 새로워진다.

> **"상태로 들고 있어야 하나, props/server에서 계산 가능한가?"** 가 derived 판단 기준. 후자면 state 줄이고 derived 늘리는 게 거의 항상 더 단순.

---

## Phase 29-32 합쳐서 — 오늘 한 일의 한 그림

```
페이지 진입 (서버 컴포넌트)
  ↓
ensureAdmissionEvaluationAccess({ ... })   ── Phase 29
  ├─ 비로그인 → redirect(INTRO)
  ├─ 미완료 + redirectIfNotCompleted → redirect(INTRO)
  └─ 완료+결제 + redirectIfCompleted → redirect(REPORT)

클라이언트 렌더
  ↓
useSatisfactionSurveyQuery(userId)   ── 캐시에 서버 값 확보
  ↓
displayRating = isAlreadyRated ? server : local   ── Phase 32
  ↓ 사용자: 별점 드래그 (PointerEvents)
  ↓
StarRating 컴포넌트                     ── Phase 31
  ├─ Pointer Events (PC + Mobile 통합)
  ├─ 두 레이어 width% 오버레이
  ├─ hoverValue 미리보기 → 손 떼는 순간 onChange
  └─ 0~10 정수 송신 (서버 @IsInt 친화)
  ↓
[별점 남기기] 클릭
  ↓
useSubmitSatisfactionMutation
  ↓ mutationFn
  ↓ onSuccess (정의)
queryClient.invalidateQueries(['satisfactionSurvey', userId])   ── Phase 30
  ↓ React Query 자동 refetch
satisfactionSurveyData.satisfiedRate = 새 값
  ↓
isAlreadyRated = true → displayRating = server 값
  → StarRating 자동 잠금, 새로고침해도 유지
```

---

## Phase 33: Options API 진화 — boolean에서 enum 값으로

### 배경

Phase 29 에서 만든 페이지 가드:
```ts
ensureAdmissionEvaluationAccess(options?: {
  redirectIfNotCompleted?: boolean;   // → INTRO (Report 페이지)
  redirectIfCompleted?: boolean;      // → REPORT (Apply/Confirm)
});
```

여기서 `redirectIfNotCompleted: true` 는 "미완료면 INTRO 로 보낸다" — **destination이 함수 안에 하드코딩**돼 있다.

새 요구사항이 들어왔다:
> "Confirm 페이지로 URL 직타 진입할 때 신청 미완료면 `/apply` 로 보내달라."

문제: 같은 "미완료" 조건이지만 페이지마다 가야 할 곳이 다름.
- Report 페이지: 미완료 → **INTRO** (애초에 보면 안 됨, 도입부로)
- Confirm 페이지: 미완료 → **APPLY** (신청부터 하라고 입력 페이지로)
- Apply 페이지: 미완료 → 통과 (여기서 신청 시작)

### Step 123: 함정 — boolean 옵션을 늘리기

직관적인 시도:
```ts
// ❌ 옵션 폭증
options?: {
  redirectToIntroIfNotCompleted?: boolean;
  redirectToApplyIfNotCompleted?: boolean;
  redirectIfCompleted?: boolean;
}
```

호출:
```ts
// Report 페이지
ensureAdmissionEvaluationAccess({ redirectToIntroIfNotCompleted: true });

// Confirm 페이지
ensureAdmissionEvaluationAccess({
  redirectToApplyIfNotCompleted: true,
  redirectIfCompleted: true,
});
```

문제점:
- destination이 추가될 때마다 옵션 수가 곱빼기로 증가 (INTRO/APPLY/REPORT/SETTINGS...)
- 두 옵션이 동시에 true면 어떻게? — 모호함 → 함수 안에 우선순위 처리 코드 필요
- 옵션 이름이 길어져 자동완성 시 구분 어려움

옵션 폭증은 **함수가 호출자의 분기를 대신 떠안았을 때** 자주 일어난다.

### Step 124: 더 나은 답 — 옵션 값을 destination 자체로

```ts
// ✅ 옵션 1개, 값으로 행선지 표현
options?: {
  redirectIfNotCompleted?: 'INTRO' | 'APPLY';
  redirectIfCompleted?: boolean;
}
```

함수 본문:
```ts
if (options?.redirectIfNotCompleted && !isApplyCompleted) {
  redirect(ADMISSION_EVALUATION_PATH[options.redirectIfNotCompleted]);
  //                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                  옵션 값이 곧 path 키
}
```

호출:
```ts
// Report
ensureAdmissionEvaluationAccess({ redirectIfNotCompleted: 'INTRO' });

// Confirm
ensureAdmissionEvaluationAccess({
  redirectIfNotCompleted: 'APPLY',
  redirectIfCompleted: true,
});

// Apply — 옵션 자체를 안 줌
ensureAdmissionEvaluationAccess({ redirectIfCompleted: true });
```

### Step 125: 이 패턴이 좋은 이유

| 측면 | boolean 여러 개 | 값 enum 하나 |
|---|---|---|
| 옵션 개수 | destination 수만큼 증가 | 1개 고정 |
| destination 추가 비용 | 새 옵션 추가 + 함수 본문 분기 추가 | union에 한 단어 추가 |
| "둘 다 true" 모호함 | 우선순위 정의 필요 | 발생 불가 (값은 하나만 가능) |
| 옵션 이름 길이 | 길어짐 | 짧고 깔끔 |
| TypeScript 자동완성 | 옵션 6개 보임 | 값 2개 보임 |

핵심 통찰: **"옵션 켜고 끄기"가 아니라 "옵션 값을 무엇으로 둘지" 가 의도일 때 enum 값**.

### Step 126: TypeScript 안전 인덱싱

```ts
redirect(ADMISSION_EVALUATION_PATH[options.redirectIfNotCompleted]);
```

`options.redirectIfNotCompleted` 의 타입이 `'INTRO' | 'APPLY'` 로 좁혀져 있어:
- `ADMISSION_EVALUATION_PATH` 에 두 키 모두 있어야 컴파일 통과
- 새 destination 추가 시 path 객체에 키 빼먹으면 컴파일 에러
- 오타 방지

```ts
export const ADMISSION_EVALUATION_PATH = {
  INTRO: '.../admission-evaluation/intro',
  APPLY: '.../admission-evaluation/apply',
  REPORT: '.../admission-evaluation/report',
} as const;
```

`as const` 로 잠가 두면 키 누락이 컴파일 단계에서 잡힘.

### Step 127: 호출자가 destination을 안다 vs 함수가 destination을 안다

이건 더 큰 설계 원칙:

| | 함수가 안다 (boolean) | 호출자가 안다 (enum) |
|---|---|---|
| 호출 코드 | `{ foo: true }` (의도 숨김) | `{ foo: 'APPLY' }` (의도 명시) |
| 함수 본문 | 분기로 destination 결정 | 그냥 받은 값을 사용 |
| 정책 변경 | 함수 본문 수정 | 호출 한 곳만 수정 |
| 결정 위치 | 분산 (함수 + 옵션 이름) | 호출 site 한 곳 |

함수는 "어떻게 redirect 할지" 만 알고, "어디로 갈지" 는 페이지가 결정. **각 페이지가 자기 정책의 책임을 진다.**

### 교훈

> **"옵션 켜고 끄기" → boolean, "옵션 값을 무엇으로" → enum.** 이 구분이 옵션 API 설계의 첫 번째 가지.

> **destination/색상/모드 같은 분기 값은 호출자가 알고 있다.** 함수가 boolean 으로 받아 안에서 분기하면 옵션이 곧 폭증한다. 값으로 받아 그대로 쓰면 옵션 1개로 끝.

> **`as const` + 키 인덱싱 = 컴파일 단계 안전 가드.** path 객체에 키 빼먹으면 컴파일 에러로 즉시 잡힘.

---

## Phase 34: 조건부 렌더링의 흔한 함정 — 모순 조건과 `0` 함정

### 배경

Q&A 섹션 코드에서 발견한 한 줄:

```tsx
{datas?.items?.length && datas?.items?.length === 0 && (
  <div>...첫 회차 질문 카드...</div>
)}
```

화면을 아무리 새로고침해도 첫 회차 카드가 안 나타남. 코드를 한참 들여다본 뒤에야 알아챔 — **조건이 영원히 false**.

### Step 128: 모순 조건 진단

조건을 분해:
- `datas?.items?.length` — truthy 여야 함 (즉, length가 1 이상)
- `&& datas?.items?.length === 0` — length가 정확히 0이어야 함

같은 값이 동시에 `> 0` 이면서 `= 0` 일 수는 없다. **두 조건의 교집합은 ∅**. 따라서 블록 본문은 절대 실행 안 됨.

원인 추측: `=== 0` 부분이 다른 의도(또는 디버깅 코드)였거나, copy-paste 후 수정 누락. 컴파일러는 잡지 못함 — 둘 다 타입은 valid `boolean`.

### Step 129: 의도 복원 — items 있을 때만 렌더

블록 안의 `items.slice(0, 1).map(...)` 가 단서:
- 첫 항목만 잘라서 표시
- → "items 가 1개 이상 있을 때만" 이 의도

올바른 조건:
```tsx
{(datas?.items?.length ?? 0) > 0 && (
  <div>...첫 회차 질문 카드...</div>
)}
```

### Step 130: `length && ...` 의 또 다른 함정 — 화면에 `0` 이 찍힘

위 조건을 단순히 이렇게 줄이고 싶을 수 있다:
```tsx
// ❌ length 자체를 truthy 검사로
{datas?.items?.length && (<div>...</div>)}
```

이건 동작은 하는데 — items 가 빈 배열일 때 **화면에 숫자 `0` 이 그대로 찍힌다**.

이유:
- React: "truthy면 오른쪽 표현식 렌더, falsy면 그 값을 렌더"
- `0 && <div/>` → 단락 평가(short-circuit)로 `0` 반환
- React는 `0` 을 텍스트 노드로 렌더 (`null`, `undefined`, `false` 만 무시함)

```
items.length = 0   → 0 && <div/>   → 0          → 화면에 "0"
items.length = 3   → 3 && <div/>   → <div/>     → 정상
items = undefined  → undefined && <div/> → undefined → 무시
```

이 함정은 **숫자 값을 직접 boolean 으로 쓰는 모든 곳**에 도사림.

### Step 131: 안전한 표현 3가지

```tsx
// ✅ 명시적 비교 — 가장 명확
{(datas?.items?.length ?? 0) > 0 && <div>...</div>}

// ✅ boolean 캐스팅 — 짧음
{!!datas?.items?.length && <div>...</div>}

// ✅ ternary — null 명시
{datas?.items?.length ? <div>...</div> : null}
```

세 패턴 모두 `0` 함정 회피. 코드 컨벤션에 따라 선택. 우리 프로젝트는 명시적 비교(`> 0`)를 선호 — 읽는 사람이 의도(0보다 큰 경우)를 즉시 알 수 있음.

| 패턴 | 장점 | 단점 |
|---|---|---|
| `length > 0` | 의도 명시, IDE/리뷰어 친화 | 길다 |
| `!!length` | 짧음 | `!!` 가 익숙하지 않은 사람엔 noise |
| `length ? … : null` | 거짓 분기 표현 가능 | else 가 필요 없을 때 noise |

### Step 132: React falsy 렌더 규칙 정리

JSX 가 "무시" 하는 값:
| 값 | 렌더 결과 |
|---|---|
| `null` | 무시 |
| `undefined` | 무시 |
| `false` | 무시 |
| `true` | 무시 (의외) |
| `0` | **"0" 텍스트 렌더** ← 함정 |
| `''` (빈 문자열) | 무시 |
| `NaN` | **"NaN" 텍스트 렌더** |

> `0` 과 `NaN` 만 다르다. 숫자 표현식을 `&&` 의 왼쪽에 둘 때 항상 의식해야 함.

### Step 133: 조건문 가독성 체크리스트

코드 리뷰 시 다음을 보면 거의 잡힘:

1. **`&&` 양쪽이 의미적으로 같은 변수의 다른 비교?** → 모순 가능성. 본문에 진입 가능한 케이스가 정말 있는지 확인.
2. **`&&` 왼쪽이 숫자/문자열?** → `0` / `''` / `NaN` 함정 검토.
3. **`?.length`만 단독으로 truthy 검사?** → boolean 캐스팅 또는 명시 비교.
4. **`!` 가 두 번 이상 들어간 조건?** → 드모르간 변환 검토. (`!a && !b` → `!(a || b)`)
5. **조건 안에 옵셔널 체이닝이 깊이 3 이상?** → 가독성 ↓, 변수로 빼내기.

### 교훈

> **`&&` 양쪽이 모순일 수 있다.** 모순 조건은 컴파일도, 린트도 잡지 않는다. 코드 리뷰가 마지막 방어선.

> **숫자를 `&&` 왼쪽에 두지 마라.** `0` 이 그대로 렌더된다. `> 0`, `!!`, ternary 중 하나로 boolean 으로 만들어야 한다.

> **"왜 안 나오지?" 라면 첫 의심은 조건문.** map/slice 가 멀쩡한데 안 보이면, 둘러싼 `&&` 가 거짓이거나 모순일 가능성이 높다.

---

## Phase 33-34 한 그림 — 오늘 한 일

```
Phase 29 가드 (boolean) ────► 새 요구: Confirm 미완료 → /apply
                              ─────────────────────────────────
                              naive: boolean 옵션 추가 (폭증)
                              ✅ 정답: 옵션 값을 enum destination 으로
                              ─────────────────────────────────
                              redirectIfNotCompleted?: 'INTRO' | 'APPLY'

ExpertQuestionSection ────► length && length === 0  (영원히 false)
                            ─────────────────────────────────
                            진단: 두 조건 교집합 ∅
                            ✅ 정답: (length ?? 0) > 0
                            ─────────────────────────────────
                            보너스: `length && ...` 자체도 `0` 함정 회피 위해 명시 비교
```
