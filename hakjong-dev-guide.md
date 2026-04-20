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
const {
  data,
  isLoading,
  error,
} = useQuery({
  queryKey: ['hakjong', 'univ-major-list'],
  queryFn: fetchUnivMajorList,
});
```

> 실제 프로젝트에서는 이 로직을 커스텀 훅으로 감싸 두었기 때문에, 컴포넌트에서는 `useUnivMajorListAndMajorTheme()`처럼 더 읽기 쉬운 형태로 사용합니다.

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
  Dropdown 선택 + TextInput 작성
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

| 항목 | `useQuery` | `useMutation` |
| ---- | ---------- | ------------- |
| 목적 | 서버 데이터 조회 | 서버 데이터 변경 |
| 자동 실행 | O | X |
| 캐시 재사용 | O | 직접 캐시 갱신 필요 |
| `queryKey` | 필수 | 없음 |
| SSR/초기 데이터 | 잘 맞음 | 거의 사용하지 않음 |
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

| 항목 | `mutate` | `mutateAsync` |
| ---- | -------- | ------------- |
| 반환값 | 없음 (`void`) | Promise 반환 |
| 결과 처리 방식 | `onSuccess`, `onError` 콜백 | `await`, `try/catch` |
| 어울리는 상황 | 버튼 클릭 후 토스트만 띄우기 | 제출 후 이동, 후속 API 호출, 조건 분기 |
| 코드 흐름 | 이벤트 안에 콜백 중첩 가능 | 위에서 아래로 순차적으로 읽힘 |

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

### Step 17: 컴포넌트에서 조립 — handleSubmit 작성

`EarlyHakjong.tsx`에서 mutation 훅을 연결합니다.

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
[컴포넌트] EarlyHakjong.tsx
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
| `invalidateQueries` | mutation 이후 관련 query를 다시 조회시켜 화면을 최신화         |
| `isPending`         | 요청 중 버튼 비활성화 등 UX 처리에 활용                         |
| 제어 컴포넌트       | `value` + `onChange`로 React가 입력값 추적                      |
| `URLSearchParams`   | 한글 포함 데이터를 URL 쿼리스트링으로 안전하게 인코딩           |
| `useSearchParams`   | URL 쿼리스트링 값을 읽는 Next.js 훅                             |
| MSW handler         | `http.post(정규식, handler)` 패턴으로 API 목업 등록             |

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

6. **`useSearchParams()`는 반드시 `Suspense` 안에서 사용**
   - `useSearchParams()`를 사용하는 컴포넌트를 `Suspense` 없이 렌더링하면 빌드/런타임 오류 발생
   - page.tsx에서 `<Suspense>`로 감싸는 것이 기본 패턴

---

## Phase 5: 수정하기 — 페이지 간 데이터 전달 (두 가지 방식 비교)

### 개요: 왜 페이지 간 데이터 전달이 필요한가?

신청 페이지 → 확인 페이지 → 다시 신청 페이지(수정하기)로 이동할 때, **이전에 입력했던 값을 유지**해야 합니다. 하지만 페이지를 이동하면 컴포넌트가 언마운트되고 `useState`의 값이 사라집니다.

```
[신청 페이지] EarlyHakjong.tsx
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
[신청 페이지] EarlyHakjong.tsx
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
[신청 페이지] EarlyHakjong.tsx
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
apps/early/src/window/hakjong/EarlyHakjong.tsx
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

| 훅/기능                 | Suspense 필요 여부      |
| ----------------------- | ----------------------- |
| `useSearchParams()`     | ✅ 필요                 |
| `usePathname()`         | ❌ 불필요               |
| `useRouter()`           | ❌ 불필요               |
| `useState`, `useEffect` | ❌ 불필요               |
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
[신청 페이지] EarlyHakjong.tsx
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
[신청 페이지] EarlyHakjong.tsx
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
apps/early/src/window/hakjong/EarlyHakjong.tsx
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
apps/early/src/window/hakjong/EarlyHakjong.tsx
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

신청 페이지(`EarlyHakjong.tsx`)는 마운트 시 항상 sessionStorage를 읽어 초기값을 복원하므로, URL에 쿼리스트링 없이 이동해도 이전 입력값이 그대로 표시됩니다.

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
| `EarlyHakjong.tsx`        | `useSearchParams` 제거, `sessionStorage`에서 초기값 복원, `handleSubmit`에서 sessionStorage 저장 |
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
