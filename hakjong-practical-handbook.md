# 학종 실무 핸드북 — 막혔을 때 30초 안에 답 찾기

> **이 문서의 위치:** `hakjong-dev-guide.md`(시간순 학습 기록, 7,600줄)의 **실무 발췌본**.
> 막혔을 때 즉시 답을 찾고, 깊이 학습이 필요하면 원본의 Phase N으로 점프합니다.
>
> **사용법:** 본인 상황에 맞춰 세 가지 입구 중 하나 — ① 에러 메시지로 / ② 작업 키워드로 / ③ 지금 작업 단계로 — 클릭 후 30초 요약 + 코드 적용.

---

## 🚀 빠른 검색 인덱스

### 🔴 에러 메시지로 찾기

| 콘솔/화면에 보이는 것 | 점프 |
| --- | --- |
| `Invalid hook call. Hooks can only be called inside…` | [#2 Invalid hook call](#-2-invalid-hook-call-에러) |
| `VALIDATION_PIPE_ERROR: subjectNot should not be empty` | [#3 빈 필드 거부됨](#-3-should-not-be-empty---선택-필드-거부됨) |
| `each value in majorIdHsbs must be a string` | [#4 드롭다운 선택값 매칭 실패](#-4-드롭다운에-선택값이-안-잡혀요) |
| `alert` 가 같은 동작에 **두 번** 발생 | [#5 alert 두 번](#-5-alert-가-두-번-떠요-strictmode) |
| 화면에 숫자 `0` 또는 `NaN` 이 그대로 찍힘 | [#6 0 함정](#-6-화면에-0-이-찍혀요) |
| `Cannot GET …` 등 쿼리 1개 실패 → **페이지 전체 흰 화면** | [#7 쿼리 하나가 페이지 다 깸](#-7-쿼리-하나가-페이지-전체를-깨요) |
| `Uncaught (in promise) …` (mutation 후) | [#1 mutate await/try-catch](#-1-mutation-성공했는데-화면이-그대로예요) |

### 🟡 작업 키워드 / 증상으로 찾기

| 상황 | 점프 |
| --- | --- |
| 제출 후 카운트/리스트가 옛 값 그대로 | [#1 cache invalidation](#-1-mutation-성공했는데-화면이-그대로예요) |
| 같은 동작에 사이드이펙트가 두 번 일어남 | [#5 impure updater](#-5-alert-가-두-번-떠요-strictmode) |
| 카드 N개 같은 복수 데이터를 어디다 저장하지? | [#9 데이터 모델링 + 신청 두 단계](#-9-신청-post가-두-개인데-카드-n개는-어떻게-담죠) |
| 훅에서 값 3개만 필요한데 통째로 부르고 있음 | [#8 통째 호출 함정](#-8-필요한-값-3개인데-훅-통째로-부르고-있어요) |
| `props 10개+` 내려주고 있음 / 컴포넌트 500줄 | [#10 컴포넌트 비대화](#-10-props-11개나-내려주고-있어요) |
| 신청 POST 가 두 개라는데 뭐가 다르지? | [#9 apply vs submit](#-9-신청-post가-두-개인데-카드-n개는-어떻게-담죠) |

### 🟢 작업 진도(단계)로 찾기

```
새 기능 시작
   ↓
①라우팅 → ②가드 → ③조회 → ④UI/입력 → ⑤상태 → ⑥전송 → ⑦이동
                                                              ↘
                                              ⑧디버깅 ←─────── (어느 단계서나)
                                                              ↙
                                              ⑨리팩토링 (다 끝나면)
```

각 단계가 무엇을 다루는지는 다음 장의 **"작업 순서 9 카테고리 한눈에"** 표 참조.

---

## 📂 작업 순서 9 카테고리 한눈에

| # | 카테고리 | 대표 막힘 (Top 10 안의 항목 굵게) | 원본 가이드 Phase |
| --- | --- | --- | --- |
| **①** | **페이지 구조 / 라우팅** | 탭 + Next.js App Router 폴더 구조, 공통 레이아웃, 활성 탭 감지 | 1 |
| **②** | **접근 제어 / 가드** | 비로그인 차단, 신청 완료 가드, 클라이언트 vs Next.js 서버 가드, options enum | 2, 7, 23, **29**, 33 |
| **③** | **데이터 조회 (읽기)** | `useQuery` + `queryKey` 설계, `staleTime`, `enabled`, prefetch effect, **`throwOnError` 우회**, 캐시 공유 | 3, **9**, 19, 27 |
| **④** | **UI 조립 / 입력 받기** | 드롭다운, 카드 추가, 제어 컴포넌트, 모달, 모드별 빈값 숨김, 인터랙티브 UI(Pointer Events) | 3, 6, 22, 31 |
| **⑤** | **상태 설계 / 훅 분리** | `useState` vs `useRef`, derived value, 상태 끌어올리기, **통째 호출 함정**, FSD 레이어 | 8, 13, 16, **17**, 32 |
| **⑥** | **데이터 전송 (쓰기)** | `useMutation` 4종 세트, `mutate` vs `mutateAsync`, **Cache Invalidation**, 두 단계 신청, 에러 응답 활용 | 4, 10, 24, **25**, 28, **30** |
| **⑦** | **페이지 간 데이터 전달** | URL params / sessionStorage / 서버 prefetch 3방식 + 의사결정, "서버 진실의 원천" | 5, **18**, 19 |
| **⑧** | **디버깅 / 에러 사전** | **Invalid hook call** / **VALIDATION_PIPE_ERROR** / **number↔string** / **alert 2회** / **`0` 함정** / 모순 조건 / ENOTFOUND / CSP 차단 | **11**, **14**, 15, **20**, **21**, 26, **34** |
| **⑨** | **리팩토링 / 설계 진화** | **비대 컴포넌트 분리**, 제네릭 + render-prop, options enum, FSD 상향 import 금지 | 12, **13**, 24, 25, 26, 27, 33 |

**굵은 글씨**가 **Top 10 막힘 사전** 항목 — 클릭하면 30초 안에 답.

---

## 🔧 Top 10 막힘 사전

> 각 항목 통일 포맷: **30초 요약 → 문제 → 원인 → 해결(❌/✅) → 반복 등장 알림 → 더 깊이(원본 Phase 링크)**

---

### 🔍 1. "저장은 200으로 떨어졌는데 화면이 옛값 그대로"

> **30초 요약:** `useQueryClient()` 훅(`new QueryClient()` 아님)으로 진짜 인스턴스를 가져와 mutation 의 `onSuccess` 에서 `invalidateQueries({ queryKey })` 호출. 캐시가 안 갱신되면 화면도 안 바뀐다.

**카테고리:** ⑥ 데이터 전송 (쓰기)
**원본:** [Phase 30: Mutation 후 화면 갱신 — Cache Invalidation 표준 패턴](hakjong-dev-guide.md)

#### 문제 (실무 상황)

질문 제출 → 서버 200 OK. 하지만 카운트가 그대로 `3`. 사용자가 한 번 더 누름. 또 보내짐. 직전에 보낸 질문은 어디에도 반영 안 됨.

#### 원인

mutation 은 서버 상태를 바꾸지만 **React Query 캐시는 자동으로 안 건드린다**. 명시적으로 알려줘야 함.

```
t=0  qnaListData = { remainingQuestions: 3, items: [] }   ← 캐시
     사용자: 첫 제출 → POST 성공 → 서버: remainingQuestions=2
t=1  하지만 클라이언트 캐시는 그대로 { remainingQuestions: 3, ... }
     가드: 옛값 사용 → 통과 → 또 제출
```

#### 해결

**❌ 결정적 함정 — `new QueryClient()`**

```ts
onSuccess: () => {
  const queryClient = new QueryClient();   // ← 새 빈 인스턴스!
  queryClient.invalidateQueries({ queryKey });
};
```

`new QueryClient()` 는 **앱이 안 쓰는** 빈 인스턴스. invalidate 가 실제 캐시엔 무영향.

**✅ 정답 — `useQueryClient()` 훅**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdmissionQnaMutation() {
  const queryClient = useQueryClient(); // ✅ 앱의 진짜 인스턴스
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

#### invalidate 표준 위치 — mutation **정의** 안

| 위치                 | 담당                                            |
| ------------------ | --------------------------------------------- |
| **정의 안 onSuccess** | 캐시 invalidate, 공통 로깅 (← invalidate 는 여기에)     |
| **호출 시 onSuccess** | UI 후속 (form reset, alert, 페이지 이동)             |

> 둘 다 실행됨. 정의가 먼저, 호출이 그 다음. 역할만 분담하면 충돌 없음.
> **alert 중복 주의** — 정의/호출 양쪽에 alert 두면 사용자에게 2번 보임.

#### 반복 등장 알림

⚠️ **invalidate 관련 함정 2회차** — Phase 17("통째 호출")도 같은 결: 의도치 않은 effect/쿼리가 함께 발사되어 화면이 어긋남.

#### 더 깊이

- **원본 Phase 30** — 전체 상황·optimistic update까지
- 짝꿍 **Phase 32** — derived value + invalidate는 한 쌍

---

### 🔍 2. "코드 멀쩡한데 콘솔이 `Invalid hook call`로 폭발"

> **30초 요약:** 훅은 오직 **① 함수 컴포넌트 본문** 또는 **② 커스텀 훅 본문**에서만. API 함수·서버 함수·async 함수 안에서 부르면 즉시 폭발. 값이 필요하면 **인자로 받아라.**

**카테고리:** ⑤ 상태 설계 / ⑧ 디버깅
**원본:** [Phase 14: "Invalid hook call"](hakjong-dev-guide.md) · [Phase 29: Next.js 서버 가드 — `use*` 접두사 함정](hakjong-dev-guide.md)

#### 문제

```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

API 파일·서버 함수 안에서 `useCurrentUser()` 같은 훅을 호출한 케이스.

#### 원인 — React 훅 규칙(Rules of Hooks)

훅은 React 가 **호출 순서**로 상태를 추적한다. 그래서:

- 함수 컴포넌트 본문 — OK ✅
- 커스텀 훅 본문 (`useXxx`) — OK ✅
- 일반 함수 / async 함수 안 — ❌
- 조건문 / 반복문 안 — ❌
- 모듈 최상단 — ❌
- 서버 함수 (`.server.ts`, `app/api/.../route.ts`) — ❌ (서버엔 React 렌더 트리 없음)
- `alert` 도 서버에선 `ReferenceError` (`window` 없음)

#### 해결

**❌ 일반 async 함수 안**

```ts
// api/index.ts
export const fetchStudentRecordComparativeStatus = async () => {
  const { currentUser } = useCurrentUser(); // ❌
  return apiClient().get(`status/${currentUser.userId}`).json();
};
```

**✅ 값은 인자로, 훅 호출은 훅 안에서**

```ts
// api/index.ts — 순수 함수
export const fetchStudentRecordComparativeStatus = async (userId: string) => {
  return apiClient().get(`status/${userId}`).json();
};

// queries.ts — 커스텀 훅 본문이라 합법
export const useStudentRecordComparativeStatusQuery = () => {
  const { currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ['studentRecordComparativeStatus', currentUser.userId],
    queryFn: () => fetchStudentRecordComparativeStatus(currentUser.userId),
    enabled: !!currentUser.userId,
  });
};
```

#### `use*` 접두사 함정 (서버 영역)

서버 함수에 `useXxxNavigationHandler` 처럼 이름 붙이면 ESLint `react-hooks/rules-of-hooks` 가 **즉시 검사 시작**. 훅이 아니면 동사형 이름으로 (`getXxx`, `ensureXxx`, `fetchXxx`).

```ts
// ❌
export async function useAdmissionEvaluationNavigationHandler() { ... }

// ✅
export async function ensureAdmissionEvaluationAccess() { ... }
```

#### 반복 등장 알림

⚠️ **훅 잘못 부른 함정 2회차** — Phase 14 (API 파일에서) / Phase 29 (Next.js 서버 함수에서). 같은 규칙, 다른 컨텍스트.

#### 더 깊이

- **Phase 14** — 클라이언트 컨텍스트
- **Phase 29** — 서버 컴포넌트 가드 (`use*` 접두사 + `alert` 함정 + options 패턴)

---

### 🔍 3. "선택 입력란 비우고 제출했더니 `should not be empty`로 거부됨"

> **30초 요약:** NestJS `class-validator` 의 `@IsNotEmpty()` 기본 메시지. **서버 DTO 쪽**을 `@IsOptional()` 로 바꾸면 끝. **프론트 변경 없음** (빈 값 보내는 게 정상). 단, 선택 필드 N개를 **한 번에** 처리해야 함 — 첫 에러에서 막힘.

**카테고리:** ⑥ 데이터 전송 / ⑧ 디버깅
**원본:** [Phase 11: 트러블슈팅 — 학종 신청 빈 값 거부 오류](hakjong-dev-guide.md)

#### 문제

학종 신청 화면에서 **선택 입력 필드를 비워둔 채** [입력완료] → 신청 실패 + alert.

콘솔:

```
학종 신청 실패: VALIDATION_PIPE_ERROR: subjectNot should not be empty
    at async submitAdmissionEvaluationApply (index.ts:102:16)
```

#### 원인

서버 신청 DTO에 `@IsNotEmpty()` 가 걸려 있어 `subjectNot: ''` 빈 문자열을 거부.
**프론트–서버 계약 불일치** — 기획상 선택 필드인데 서버는 필수.

#### 해결 — 서버 (프론트 변경 없음)

**선택 필드 5개를 한 번에** `@IsOptional()` 로 변경:

| 필드               | UI 표기           | 구분 |
| ---------------- | --------------- | -- |
| `subjectNot`     | 비교과 추가 입력       | 선택 |
| `emphasis1~3`    | 강조하고 싶은 내용 1~3 | 선택 |
| `simpleQuestion` | 간단 질문하기         | 선택 |

```ts
// ❌ 변경 전
@IsNotEmpty()
subjectNot: string;

// ✅ 변경 후
@IsOptional()
subjectNot?: string;
```

**필수로 유지 (변경 금지):** `userId`, `majorIdHsbs`, `preferAiPartsCodes`, `preferProvsCodes`

#### 흔한 실수 / 놓치는 부분

- ❌ 빈 값을 통과시키려 프론트에서 더미 문자열 채우기 → **데이터 오염 + 임시/플레이스홀더 코드 금지 원칙 위반**
- ❌ `subjectNot` 만 풀고 끝 → `class-validator` 는 첫 에러에서 막힘 → 다음 빈 필드(`emphasis1` …)에서 동일 증상 재발
- ✅ **선택 필드 전부 한 번에** 처리

#### 프론트 후속 개선 거리 (선택)

`onError` 가 서버 메시지를 버리고 고정 문구만 띄움. ky 의 `beforeError` 훅이 서버 응답 `message` 를 `error.message` 에 넣어주므로 활용 가능.

`handleSubmit` 에서 `await submitApply(...)` 를 try/catch 없이 호출해 실패 시 **Uncaught (in promise)** 발생 → try/catch 추가하면 이후 `router.push` 차단 가능. (Phase 4 Step 17 try/catch 패턴 참고)

#### 더 깊이

- **Phase 11** — 전체 진단·확인 경로
- **Phase 4 Step 17** — try/catch 패턴

---

### 🔍 4. "수정하기 들어왔는데 드롭다운에 placeholder만 떠요"

> **30초 요약:** 서버 응답의 코드 필드는 `number`, 옵션 `value` 는 `string`. DropDown 은 `===` 로 매치 → `'1' === 1` = **false** → 라벨 안 보임. **사용처마다 `String(...)`** 으로 정규화. 진짜 해결은 **백엔드가 응답을 string 으로 통일**.

**카테고리:** ⑧ 디버깅 / ④ UI 조립
**원본:** [Phase 20: 서버 응답의 `number` vs 요청의 `string`](hakjong-dev-guide.md)

#### 문제 — 두 가지 증상

**증상 ① — 서버 검증이 막은 경우** (왁자지껄하게 죽음)

수정하기로 들어와 prefetch 후 입력완료:

```
VALIDATION_PIPE_ERROR: each value in majorIdHsbs must be a string
```

**증상 ② — UI가 조용히 비어 있음** (소리 없이 죽음)

선호 지역 드롭다운이 prefetch 후에도 placeholder만. 콘솔 로그는 정상 데이터.

#### 원인 — 요청 ↔ 응답 비대칭

```jsonc
// 신청 POST 요청 — Swagger: string 필수
{ "majorIdHsbs": ["12345", "12346"], "preferProvsCodes": ["1", "2"] }

// 조회 응답 — number 로 옴
{ "univCode": 1046, "majorIdHsb": 16219191, "preferProvsCode": 1 }
```

타입 단언(`.json<HopeUnivsResponse[]>()`)은 **검증이 아니다**. 서버가 다른 형식 줘도 TS는 안 잡음.

**증상 ① 추적:**
1. prefetch 가 응답의 `majorIdHsb: 16219191` (number) 를 `drop3.value` 에 그대로 넣음
2. 타입은 `StringDropDownOption.value: string` 인데 런타임은 number — **silent type drift**
3. `handleSubmit` 이 `card.options.drop3.value` 를 모아 `majorIdHsbs` 로 보냄 → `number[]` JSON
4. 서버 `@IsString({ each: true })` 차단

**증상 ② 추적:**
- DropDown: `selectedValue === option.value` 로 라벨 표시
- 옵션 출처: 서버가 `preferProvsCode: 1` (number) → `option.value = 1` (number)
- 복원값: `String(provCode) = '1'` (string)
- `'1' === 1` → **false** → 빈 드롭다운

#### 해결 — 사용처별 `String(...)` 정규화

```ts
// 1) 카드 복원
drop1: { value: String(item.univCode), label: item.univName },
drop3: { value: String(item.majorIdHsb), label: item.majorName },

// 2) 선호 복원
drop5: { value: String(pa1.provCode), label: pa1.provName },

// 3) 옵션 매핑
{ label: item.preferProvsName, value: String(item.preferProvsCode) }
{ label: item.preferAiPartsName, value: String(item.preferAiPartsCode) }
```

#### 정규화 위치 트레이드오프

| 위치 | 장점 | 단점 |
| --- | --- | --- |
| **백엔드 통일** | 단일 해결, 프론트 코드 그대로 | 배포·협의 필요 |
| **API boundary** (`fetchXxx`) | 한 번 normalize, 모든 사용처 안전 | 약간의 boilerplate |
| **사용처마다** (`String(...)`) | 변경 범위 최소 | **새 사용처 추가 시 빠뜨리기 쉬움 — 함정** |

#### 진짜 해결 — 백엔드 통일 + TODO 추적

```ts
/**
 * TODO(backend): 응답 코드 필드를 모두 string으로 통일 요청.
 *   - univCode, majorIdHsb, preferAiPartsCode, preferProvsCode 등
 * 통일 완료 시 String(...) 정규화 모두 제거 가능.
 */
```

#### 반복 등장 알림

⚠️ **타입은 맞는데 런타임 어긋남** 패턴 — Phase 20 (number/string) / Phase 34 (length=0 vs length>0 모순) 모두 컴파일러는 못 잡고 코드 리뷰가 마지막 방어선.

#### 더 깊이

- **Phase 20** — 모든 영향 엔드포인트 매트릭스

---

### 🔍 5. "버튼 한 번 눌렀는데 `alert`가 두 번 떠요"

> **30초 요약:** `setState` updater는 **pure function** 이어야 한다. 검증·`alert`·`console.log` 등 side effect는 updater **밖**(이벤트 핸들러 본문)으로. StrictMode dev는 의도적으로 updater를 두 번 호출해서 잡아낸다 — 버그가 아니라 기능.

**카테고리:** ⑤ 상태 설계 / ⑧ 디버깅
**원본:** [Phase 21: state updater는 pure해야 한다 — `alert()` 함정](hakjong-dev-guide.md)

#### 문제

카드 삭제 X 버튼 → "카드는 최대 6개까지 추가할 수 있습니다" alert. 하지만 코드는 멀쩡:

- `handleDeleteCard`: `filter` 만, alert 없음
- `handleAddCard`: alert 있긴 한데 **`setSelectedCards` 의 updater 안**
- `CloseButton`: `type="button"` + `e.stopPropagation()` — 다른 핸들러로 못 샘

#### 원인 — Impure updater + StrictMode 이중 호출

React 공식: **State updater functions MUST be pure.** 다음 state 계산·반환만 해야 함. setState 호출·side effect·prev state 변형 X.

StrictMode(개발 모드)는 updater 를 **의도적으로 두 번 호출** — pure 하지 않은 updater 잡아내려고. 그래서:

- `handleAddCard` 한 번 호출 → updater 두 번 실행 → **`alert` 두 번 발사**
- 비동기·배치·concurrent 시나리오에서는 사용자에게 "관련 없는 클릭에서 alert 가 뜨는 것처럼" 느껴짐

#### 해결 — 검사를 updater **밖**으로

**❌ updater 안에서 `alert`**

```ts
setSelectedCards((prevState) => {
  if (prevState.length >= 6) {
    alert('카드는 최대 6개까지 추가할 수 있습니다.'); // side effect
    return prevState;
  }
  return [newCard, ...prevState];
});
```

**✅ updater 밖에서 검사**

```ts
const handleAddCard = () => {
  if (selectedCards.length >= 6) {
    // ← 이벤트 핸들러 본문 (한 번만 실행)
    alert('카드는 최대 6개까지 추가할 수 있습니다.');
    return;
  }

  setSelectedCards((prevState) => {
    if (prevState.some((card) => card.id === cardId)) return prevState;
    return [newCard, ...prevState];
  });
};
```

#### 보너스 — 같은 검사로 버튼 `disabled` 까지

```tsx
<Button disabled={selectedCards.length >= 6} onClick={onAddCard}>
  희망 대학 리스트에 추가
</Button>
```

`alert` 는 사용자가 강제 시도한 안전망, 정상 흐름은 버튼이 비활성 → UX 명확.

#### 한 줄로 외우기

> setState updater 는 `(prev) => next` **외 다른 일은 하지 마라.**
> - 검증/alert/console.log → handler 본문 (updater 밖)
> - 다른 setState → handler 또는 useEffect
> - 외부 API 호출 → handler 또는 useEffect

#### 더 깊이

- **Phase 21** — StrictMode 이중 호출 메커니즘 + 6슬롯 placeholder 보너스

---

### 🔍 6. "빈자리에 카드가 떠야 하는데 `0`이 찍혀 있음"

> **30초 요약:** `{ items.length && <div/> }` → length=0 일 때 `0` 텍스트 렌더. React 가 무시하는 falsy 는 `null`/`undefined`/`false`/`''` 뿐, **`0` 과 `NaN` 은 텍스트로 찍힘**. 안전 표현 3가지: `> 0`, `!!`, ternary.

**카테고리:** ⑧ 디버깅
**원본:** [Phase 34: 조건부 렌더링의 흔한 함정](hakjong-dev-guide.md)

#### 문제

Q&A 섹션 코드:

```tsx
{datas?.items?.length && datas?.items?.length === 0 && (
  <div>...첫 회차 질문 카드...</div>
)}
```

화면을 새로고침해도 카드 안 나타남. 두 가지 함정이 한 줄에:

1. **모순 조건** — `length`가 truthy(>0)이면서 동시에 `=== 0`일 수 없음 → 본문 절대 실행 안 됨
2. 고쳐서 `length && <div/>` 로 줄이면 length=0일 때 **화면에 `0`** 찍힘

#### 원인

**모순 조건:** 두 조건의 교집합 ∅. 컴파일러도 린트도 못 잡음 (둘 다 valid `boolean`).

**`0` 함정:**
- React: "truthy면 오른쪽 표현식 렌더, falsy면 **그 값을 렌더**"
- `0 && <div/>` → 단락 평가로 `0` 반환
- React 는 `0` 을 텍스트 노드로 렌더 (`null`/`undefined`/`false` 만 무시)

```
items.length = 0   → 0 && <div/>          → 0          → 화면에 "0"
items.length = 3   → 3 && <div/>          → <div/>     → 정상
items = undefined  → undefined && <div/>  → undefined  → 무시
```

#### 해결 — 안전한 표현 3가지

```tsx
// ✅ 명시적 비교 — 가장 명확 (이 프로젝트 컨벤션)
{(datas?.items?.length ?? 0) > 0 && <div>...</div>}

// ✅ boolean 캐스팅 — 짧음
{!!datas?.items?.length && <div>...</div>}

// ✅ ternary — null 명시
{datas?.items?.length ? <div>...</div> : null}
```

| 패턴               | 장점              | 단점                  |
| ---------------- | --------------- | ------------------- |
| `length > 0`     | 의도 명시, IDE/리뷰어  | 길다                  |
| `!!length`       | 짧음              | `!!` 가 익숙하지 않은 사람엔  |
| `length ? : null` | 거짓 분기 표현 가능     | else 가 필요 없을 땐 noise |

#### React falsy 렌더 규칙 표

| 값                | 렌더 결과            |
| ---------------- | ---------------- |
| `null`           | 무시               |
| `undefined`      | 무시               |
| `false`          | 무시               |
| `true`           | 무시 (의외)          |
| `0`              | **"0" 텍스트 렌더 ← 함정** |
| `''` (빈 문자열)     | 무시               |
| `NaN`            | **"NaN" 텍스트 렌더 ← 함정** |

> 숫자/표현식을 `&&` 의 **왼쪽**에 둘 때 항상 의식.

#### 조건문 가독성 체크리스트

1. **`&&` 양쪽이 의미적으로 같은 변수의 다른 비교?** → 모순 가능성
2. **`&&` 왼쪽이 숫자/문자열?** → `0`/`''`/`NaN` 함정 검토
3. **`?.length` 만 단독으로 truthy 검사?** → boolean 캐스팅 또는 명시 비교
4. **`!` 가 두 번 이상?** → 드모르간 변환 검토 (`!a && !b` → `!(a || b)`)
5. **옵셔널 체이닝 깊이 3 이상?** → 변수로 빼내기

#### 반복 등장 알림

⚠️ **"빈 값"은 한 단어가 아니다** 패턴 — Phase 26 (`||` 깊이 1 / `.length` 깊이 1+2 / `.some(meaningful)` 깊이 3) 도 같은 결.

#### 더 깊이

- **Phase 34** — 모순 조건 진단 + 가독성 체크리스트
- **Phase 26** — "비어있음"의 세 가지 깊이 (`undefined` vs `[]` vs `[빈객체]`)

---

### 🔍 7. "API 한 개 미구현인데 페이지 전체가 흰 화면"

> **30초 요약:** 이 프로젝트 React Query 는 글로벌 `throwOnError` → 한 쿼리 실패 시 Error Boundary 가 페이지 전체 대체. **선택적 데이터**(stepbar 진행률 등)는 쿼리 옵션에 `throwOnError: false` + 호출부 fallback(`?? 0`, `?? false`) 로 옵트아웃.

**카테고리:** ③ 데이터 조회 / ⑧ 디버깅
**원본:** [Phase 9: 백엔드 미구현 엔드포인트 안전 호출 — `throwOnError` 우회 패턴](hakjong-dev-guide.md)

#### 문제

stepbar 진행률용 `/user-status` 가 백엔드 미구현. 페이지 열면:

```
Uncaught Error: Cannot GET /jh/api/high3/user-status
    at throwOnError (ReactQueryProvider.tsx:29)
    at useUserStatusQuery (user-status.queries.ts:13)
    at useStepBar (useStepBar.ts:22)
    at EarlyStepbar (EarlyStepbar.tsx:18)
```

**stepbar 뿐 아니라 페이지 전체가 흰 화면.**

#### 원인 — 글로벌 정책의 부작용

`ReactQueryProvider` 에:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError(error, query) {
        throw new Error(APIError.message(error));
      },
    },
  },
});
```

한 쿼리 실패 → 컴포넌트 throw → React 트리 위로 → 가장 가까운 Error Boundary 가 페이지 통째 대체. **"있어도 좋고 없어도 되는" 데이터**가 페이지 전체를 무너뜨림.

#### 해결 — 옵트아웃 + 호출부 fallback (두 짝)

**① 쿼리 옵션에 `throwOnError: false`**

```ts
export function useUserStatusQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userStatusQueries.status(userId).queryKey,
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId && enabled,
    // 서버 /user-status 구현 완료 후 이 옵션 제거 — 호출부 fallback 으로 안전 degrade
    throwOnError: false,
  });
}
```

**② 호출부 fallback (Optional chaining + Nullish coalescing)**

```ts
// ❌ fallback 없음 — TypeError 폭발
const count = userStatus.mockApplicationCount;

// ✅ Optional chaining + ?? 기본값
const mockApplicationCount = userStatus?.mockApplicationCount ?? 0;
const isNesinGradeInput = userStatus?.isNesinGradeInput ?? false;
```

옵트아웃된 쿼리는 실패해도 throw 안 함 → `data === undefined` 상태로 컴포넌트에 옴 → fallback 으로 안전한 기본값.

#### 옵트아웃을 써도 되는 쿼리 vs 쓰면 안 되는 쿼리

| 상황                                | 적용 여부 | 이유                          |
| --------------------------------- | ----- | --------------------------- |
| stepbar 진행 상태                     | ✅     | 없어도 페이지 핵심 동작. 진행률만 초기값     |
| 평가 신청 페이지의 사용자 정보                 | ❌     | 사용자 정보 없이는 신청 자체 불가         |
| 리포트 페이지의 평가 결과                    | ❌     | 데이터가 페이지의 존재 이유             |
| 우상단 알림 뱃지 개수                      | ✅     | 부수 정보. 뱃지 안 보이는 게 페이지 막는 것보다 |

**판단 한 줄:** 이 데이터가 없으면 페이지를 보여주는 의미가 사라지는가? Yes 면 throw, No 면 옵트아웃.

#### 백엔드 구현 후 제거 체크리스트

1. `throwOnError: false` 옵션 **제거**
2. 호출부의 `?? 0`/`?? false` 는 **그대로 유지** (로딩 중 안전 처리)
3. 실제 동작 확인 — 의도적 500 응답 시 Error Boundary 가 다시 잡는지

#### 흔한 실수

- ❌ 옵트아웃만 하고 fallback 안 둠 → `data?.x` 가 undefined 인데 그냥 `data.x` 접근 → 다른 TypeError
- ❌ 페이지 핵심 데이터까지 옵트아웃 → 사용자가 "아무것도 없는 페이지" 보게 됨

#### 더 깊이

- **Phase 9** — 글로벌 정책 메커니즘 + 임시 우회 정리 책임

---

### 🔍 8. "이 페이지에 안 쓰는 쿼리가 줄줄이 발사돼요"

> **30초 요약:** 합성 훅(`useAdmissionEvaluationApplyForm`) 통째로 부르면 그 안의 **모든 useQuery·useEffect·mutation 셋업이 함께 발사**. 필요한 3개만 쓰려면 **그 출처를 직접 호출**해라. 같은 queryKey는 어디서 부르든 캐시 공유라 중복 호출 걱정 X.

**카테고리:** ⑤ 상태 설계
**원본:** [Phase 17: Confirm 페이지에도 같은 패턴을 — "통째 호출"의 함정](hakjong-dev-guide.md)

#### 문제

Confirm 페이지 요약 훅 작성 중. `isMobile`, `gradeStatusData`, `mockStatusData` 3개만 필요.

```ts
// ❌ Confirm 요약 훅이 Apply 폼 훅을 통째로 호출
export const useAdmissionEvaluationConfirmSummary = () => {
  const { isMobile, gradeStatusData, mockStatusData } =
    useAdmissionEvaluationApplyForm();
  // ...
};
```

코드는 동작하지만 Confirm 페이지 진입만으로:

- `useApplyDropOptions()` → 대학 목록·선호 전공/지역 **쿼리 자동 실행**
- `useAdmissionEvaluationApplyMutation()` → 제출 mutation **셋업**
- Apply 폼의 **복원 `useEffect` 실행** → `setSelectedOption(...)` + `onUnivChangeFetch(...)` 호출로 **계열·학과 list 네트워크 요청까지** 발사 (Confirm은 이 데이터 안 씀)

#### 원인

훅은 호출하는 순간 그 안의 **모든 side effect가 함께 따라옴**:
- 모든 `useQuery` → 자동 실행
- 모든 `useEffect` → 즉시 발사
- 모든 `useMutation` → 셋업

설계 자체는 좋은데(Apply 페이지 전용 합성 훅), 다른 페이지가 일부만 가져가려고 부르면 **의도치 않은 부수 효과** 폭발.

#### 해결 — 필요한 만큼만 의존

```ts
// ✅ 필요한 3개만 직접 가져오기
const isMobile = useAppSelector((state) => state.common.isMobile);
const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
const { data: mockStatusData } = useAdmissionEvaluationMockStatusQuery();
```

**비용?** 거의 0:
- React Query 캐시 공유 — Apply에서 같은 queryKey로 캐싱했다면 즉시 반환
- `isMobile` 은 redux selector 한 줄
- 새 네트워크 호출 없음

#### 의존성 최소화 한 줄

> "이 훅이 반환하는 값 중 일부만 필요하다"는 신호가 보이면, **그 훅 전체를 부르지 말고 그 일부의 출처를 직접 부르세요.**
> 훅은 호출하는 순간 그 안의 모든 side effect 가 함께 따라옵니다. 같은 React Query queryKey 는 캐시 공유라 중복 호출 걱정 X.

#### 반복 등장 알림

⚠️ **"같이 묶지 마라" 패턴** — Phase 24 ("훅 책임 경계 — QnA mutation 을 Apply 훅에 합칠까") 도 같은 결. **다른 페이지에서 쓰면 무조건 분리.**

#### 더 깊이

- **Phase 17** — 통째 호출의 효과 추적
- **Phase 24** — 합칠까 분리할까 판단 기준

---

### 🔍 9. "코드는 `apply` API인데 UX는 \"신청완료\" — 의미가 안 맞아요"

> **30초 요약:** 두 단계 패턴 — `apply`(draft, 수정 가능) vs `submit`(confirmed, lock). 영어 `apply` ≠ 한국어 "신청". 카드 복수 데이터는 **comma-join 금지**, 구조화 배열(`selectedCards: SelectedCard[]`)로 스냅샷에 따로 저장.

**카테고리:** ⑥ 데이터 전송 / ⑦ 페이지 간 데이터 전달
**원본:** [Phase 25: 신청의 두 단계 — `apply`(draft) vs `submit`(confirmed)](hakjong-dev-guide.md) · [Phase 18: 복수 데이터를 스냅샷에 담는 법](hakjong-dev-guide.md)

#### 문제 ① — POST가 왜 두 개?

| 엔드포인트                              | 의미              | 수정 가능?            |
| ---------------------------------- | --------------- | ----------------- |
| `/admission-evaluation/apply`      | **초안 저장**(draft) | ✅ 다시 POST로 덮어쓰기 가능 |
| `/admission-evaluation/submit`     | **최종 확정**(final) | ❌ 이후 어떤 변경도 거부    |

상태 머신:

```
[빈]  ──POST /apply──►  [DRAFT]  ──POST /submit──►  [CONFIRMED]
                          ↑↓
                    POST /apply (수정)
```

CONFIRMED 상태에서 `/apply` 또는 `/submit` 시도 → 400 `"이미 신청이 완료되었습니다."`

#### 함정 — 코드 네이밍 ≠ 사용자 용어

| 코드 이름                                     | 실제 동작               | 사용자 용어     |
| ----------------------------------------- | ------------------- | ---------- |
| `submitAdmissionEvaluationApply`          | POST /apply (draft 저장) | **"입력완료"** |
| `submitAdmissionEvaluationSubmit`         | POST /submit (최종 확정)  | **"신청완료"** |
| `useAdmissionEvaluationApplyMutation`     | apply 호출             | [입력완료] 버튼  |
| `useAdmissionEvaluationConfirmMutation`   | submit 호출            | [신청완료] 버튼  |

영어 "apply"는 한국어 "신청"으로 직역되지만 **코드의 `apply`는 "draft 저장"**, **한국어 "신청완료"는 실제로 `submit`**. 코드 읽을 때 가장 헷갈리는 부분.

#### 문제 ② — 카드 N개 저장

`selectedCards: SelectedCard[]` 6개를 sessionStorage 스냅샷에 어떻게?

#### ❌ comma-join 시도 (망함)

```ts
// handleSubmit
universityName: handler.selectedCards.map((c) => c.options.drop1.label).join(','),
majorTypeName:  handler.selectedCards.map((c) => c.options.drop2.label).join(','),
minorMajorCategoryName: handler.selectedCards.map((c) => c.options.drop3.label).join(','),
```

**두 가지 문제 동시:**

**문제 ①: 카드 단위 짝이 깨짐**
세 필드 각각 join/split → 표시 시 인덱스로 짝 재구성. 라벨에 쉼표 들어가는 순간(예: "○○대학교, 분교") 인덱스 어긋남 → 짝 영원히 망가짐.

**문제 ②: 단일 필드 의미 오염 → 복원 망가짐**
`universityId` 는 Apply 복원용:

```ts
setSelectedOption({
  drop1: { value: saved.universityId, label: saved.universityName },
});
onUnivChangeFetch(saved.universityId); // ← 단일 코드 기대
```

여기에 `universityId = "101,102,103"` 들어가면 라벨이 "서울대,연세대" 가 되고, cascade fetch가 `univCode = "101,102,103"` 을 서버에 보내 깨짐.

#### ✅ 해결 — 구조화 배열로 분리

표시(복수 카드) 와 복원(드롭다운 단일 값) **둘을 분리해서 저장**:

```ts
export interface AdmissionEvaluationApplyFormSnapshot
  extends AdmissionEvaluationApplyRequest {
  // 희망 대학 리스트(복수 카드) — Confirm 표시 + 수정하기 복원
  selectedCards: SelectedCard[];
  // 제출 시점의 단일 드롭다운 선택값 — 수정하기 시 cascade 복원
  universityId: string;
  universityName: string;
  // ...
}
```

```ts
const snapshot: AdmissionEvaluationApplyFormSnapshot = {
  ...requestData,
  selectedCards: handler.selectedCards, // ← 구조화 배열 (라벨 포함)
  universityId: drop1.value, // ← 단일 값 (드롭다운 복원)
  universityName: drop1.label,
};
```

#### 한 줄 교훈

> **표시(structured) 목적과 복원(single) 목적이 다르면, 같은 필드 하나에 둘을 우겨넣지 말고 따로 저장하라.**
> "단일 필드를 join/split해서 다목적으로 쓰자"는 유혹은 짧게 동작하지만, 라벨에 쉼표 / 의미 오염되어 다른 흐름을 망가뜨리는 순간 부러진다.

#### 더 깊이

- **Phase 25** — apply/submit 두 단계 흐름, 페이지별 GET 의미
- **Phase 18** — 카드 라이프사이클 (추가 → 저장 → 표시/복원)
- **Phase 28** — CONFIRMED 상태 거부 응답을 status API 대용으로 활용

---

### 🔍 10. "selector에 prop 11개 + 페이지 500줄이 됐어요"

> **30초 요약:** 페이지 → 컴포넌트로 prop 폭증은 두 가지 신호. (1) **조합 로직을 페이지가 떠안음** → 내부로 옮겨라. (2) **페이지에 useState/useEffect 가 쌓임** → 합성 훅으로 모아라. + FSD 레이어 방향 점검(`app → entities → modules → window`, **상향 import 금지**).

**카테고리:** ⑨ 리팩토링 / 설계 진화
**원본:** [Phase 13: 컴포넌트 분리와 FSD 레이어](hakjong-dev-guide.md) · [Phase 16: 페이지 로직을 단일 오케스트레이션 훅으로 통합](hakjong-dev-guide.md)

#### 증상 (둘 중 하나라도면 적용)

- `UnivMajorSelector` 에 prop 11개 내려주고 있음
- 페이지 컴포넌트가 ~500줄, `useState` 5개 + `useEffect` 3개 + `handleSubmit` 100줄
- selector 의 onChange 에 인라인 핸들러 4줄짜리

#### 원인 ① — 조합 로직이 페이지에 박힘

```tsx
// ❌ 페이지가 selector 내부 동작 규칙까지 직접 조립
<UnivMajorSelector
  universityHandler={(option) => {
    handleSelectedChange('drop1', option);
    handleSelectedChange('drop2', { value: '', label: '' }); // 하위 초기화
    handleSelectedChange('drop3', { value: '', label: '' });
    onUnivChangeFetch(option.value); // cascade 재조회
  }}
  aibdPartsHandler={(option) => { ... }}
  // ... +9개 prop
/>
```

"대학 바뀌면 계열·학과 비우고 cascade 재조회" 는 **selector 내부 규칙**. 페이지가 알 일 아님.

#### 해결 ① — 페이지는 "원시 도구" 만 전달

```tsx
// ✅ 페이지
<UnivMajorSelector
  selectedOption={selectedOption}
  onSelectedChange={handleSelectedChange} // 단순 setter
  onUnivChangeFetch={onUnivChangeFetch}   // cascade 함수
  onMajorTypeChange={onMajorTypeChange}
  selectedCards={selectedCards}
  onAddCard={handleAddCard}
  onDeleteCard={handleDeleteCard}
/>

// ✅ UnivMajorSelector 내부 — 조합 규칙은 여기에
const handleUniversityChange = (option: StringDropDownOption) => {
  onSelectedChange('drop1', option);
  onSelectedChange('drop2', EMPTY_OPTION);
  onSelectedChange('drop3', EMPTY_OPTION);
  onUnivChangeFetch(option.value);
};
```

> 핵심 질문: **"이 규칙을 아는 게 누구의 책임인가?"**

#### 원인 ② — 페이지에 로직 덩어리가 쌓임

페이지 훅 + 폼 입력 `useState` 5개 + 복원 `useEffect` + `handleSubmit` 등 ~180줄.

#### 해결 ② — 합성 훅으로 통합

```ts
// entities/admission-evaluation/model/useAdmissionEvaluationApplyForm.ts
export const useAdmissionEvaluationApplyForm = () => {
  // 1) 데이터/인프라 훅
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: gradeStatusData } = useAdmissionEvaluationGradeStatusQuery();
  const { mutateAsync: submitApply, isPending } = useAdmissionEvaluationApplyMutation();

  // 2) 작은 훅을 합성
  const dropOptions = useApplyDropOptions();
  const handler = useAdmissionEvaluationHandler();

  // 3) 폼 상태 + 복원 useEffect + handleSubmit ...

  return {
    ...dropOptions,
    ...handler,
    /* 폼 상태, handleSubmit, isPending */
  };
};
```

페이지는 **훅 1개 호출 + JSX** 만:

```tsx
export const EarlyAdmissionEvaluationApply = () => {
  const { selectedOption, handleSubmit, isPending, /* ... */ } =
    useAdmissionEvaluationApplyForm();
  return (/* JSX */);
};
```

#### "분리(Phase 8) vs 통합(Phase 16)" — 모순 아님

- Phase 8: 컴포넌트에서 로직 덩어리를 **작은 훅으로 분리** (관심사 분리)
- Phase 16: 그 작은 훅들을 **합성해 페이지용 단일 진입점** 마련

작은 훅 = building block, 합성 훅 = 페이지 facade. **계층 쌓기**.

#### FSD 레이어 방향 — 상향 import 금지

```
app → entities → modules → window
   위에서 아래로만 import 허용
```

흔한 실수: `entities` 가 `modules` 컴포넌트 import. 컴포넌트를 옮기면 그게 의존하던 작은 조각(배지 등)도 함께 레이어 재검토.

#### 트레이드오프 — god-hook 경계

`...dropOptions`/`...handler` 스프레드는 간결하지만, 한 훅이 너무 많은 책임 흡수 → "god-hook". 이 프로젝트는 **소비자가 페이지 하나뿐**이라 단일 훅이 합리적. 같은 selector/폼이 여러 페이지에서 쓰이기 시작하면 Context 나 더 작은 훅 단위로 다시 쪼개기.

> **판단 기준:** 이 묶음을 쓰는 곳이 하나? 여럿? — 하나면 합성 훅으로 응집, 여럿이면 공유 메커니즘(Context 등) 으로 분산.

#### 옮기지 *못하는* 것 — 공유 상태는 페이지에 남는다

`selectedOption`·`selectedCards`·`onUnivChangeFetch` 는 `handleSubmit`·복원 로직과 **함께 쓰는 공유 상태**라 페이지(또는 상위 훅)가 들고 있어야 함. 자식에 내려주는 건 "상태 끌어올리기(lifting state up)" 라는 정상 패턴.

#### 더 깊이

- **Phase 13** — 4개 Step (조합 로직 / 반복 UI / FSD / dead code)
- **Phase 16** — 합성 훅 (god-hook 경계 + Phase 8 과의 관계)

---

## 📌 부록 — 5대 반복 함정

> 같은 원리가 다른 모양으로 또 나옵니다. 한 번 만났으면 다음번엔 30초 안에 알아채세요.

### ① "빈 값" 은 한 단어가 아니다 — 깊이 1·2·3

| 깊이 | 잡는 것                       | 도구                                                      |
| -- | -------------------------- | ------------------------------------------------------- |
| 1  | `undefined`, `null`        | `??`, `\|\|`                                            |
| 2  | 빈 컨테이너 (`[]`, `{}`)        | `.length`, `Object.keys(x).length`                      |
| 3  | 의미 없는 값만 (`[{title:''}]`)  | `.some(predicate)`                                      |

**같은 함정 만난 곳:** Phase 19 (첫 신청자 검증) · Phase 26 (mock fallback) · Phase 34 (모순 조건) · Top 10 #6.

**판단법:** "이 데이터가 '비어있다' 고 말할 수 있는 경우의 수를 모두 적어보라." 그게 셋이면 깊이 3.

---

### ② 훅을 잘못된 자리에서 부름

**금지 위치:** 일반 함수 / async 함수 / 모듈 최상단 / 조건문·반복문 / 서버 함수 / `use*` 접두사 일반 함수

**허용 위치:** 함수 컴포넌트 본문 / 커스텀 훅 본문

**같은 함정 만난 곳:** Phase 14 (API 파일) · Phase 29 (Next.js 서버 함수) · Top 10 #2.

**해법:** 값이 필요하면 인자로 받아라. 훅 호출은 훅 안으로.

---

### ③ 옵션 폭증 — 호출자 책임 미위임

**증상:** 옵션이 6개 되고 두 옵션 동시 `true` 시 모호한 상황 발생.

**원인:** 함수가 호출자의 분기를 대신 떠안음.

**해법:**
- "켜고 끄기" → `boolean`
- "값을 무엇으로" → enum 값 (`'INTRO' | 'APPLY'`)
- 통째로 가져가지 말고 필요한 출처를 직접 호출

**같은 함정 만난 곳:** Phase 17 (통째 호출) · Phase 24 (훅 합치기) · Phase 33 (boolean 옵션 폭증) · Top 10 #8.

---

### ④ 타입은 OK 인데 런타임 어긋남 (silent drift)

**증상:** TS 에러도 없고 린트도 안 잡는데 런타임에 깨짐.

**대표 케이스:**
- 응답 `number` ↔ 요청 `string` → `===` 매칭 실패 (Phase 20)
- `&&` 양쪽 조건 모순 → 본문 영원히 실행 안 됨 (Phase 34)
- ky `.json<T>()` 는 검증이 아닌 **타입 단언** — 서버가 다른 형식 줘도 못 잡음

**같은 함정 만난 곳:** Phase 20 · Phase 34 · Top 10 #4, #6.

**해법:** 외부 시스템 경계에서 명시적 정규화 (`String(...)`) 또는 zod 같은 런타임 검증.

---

### ⑤ "서버에 같은 데이터 있으면 클라이언트는 임시 뷰일 뿐"

**원칙:** 같은 데이터를 클라이언트 캐시(sessionStorage)와 서버 두 곳에 두지 마라. 어느 한쪽이 진실의 원천, 다른 쪽은 일시적 뷰.

**같은 함정 만난 곳:**
- Phase 5 (수정하기를 URL params로 시도 → sessionStorage 전환)
- Phase 10 (mock Route → 실 API 연동)
- Phase 18 (sessionStorage 스냅샷 모양)
- Phase 19 (서버 prefetch로 sessionStorage 걷어내기)
- Phase 23 (sessionStorage 플래그 → 서버 진실)
- Phase 32 (server-first display)

**해법:** 서버 API 가 갖춰지는 순간 sessionStorage 의존을 **완전히** 걷어내라. 동기화 책임이 모호한 두 캐시는 항상 어디서 어긋난다.

---

## 📚 더 깊이 학습 — 원본 가이드 Phase 인덱스 (작업순 카테고리별)

> Top 10 외 항목은 [`hakjong-dev-guide.md`](hakjong-dev-guide.md) 의 해당 Phase 직접 참조.

### ① 페이지 구조 / 라우팅
- **Phase 1** — 탭 + Next.js App Router 폴더 구조, 공통 레이아웃, 활성 탭 감지 (Steps 1~5)

### ② 접근 제어 / 가드
- **Phase 2** — 비로그인 가드 (`useCurrentUser`)
- **Phase 7** — 탭 접근 제어 + sessionStorage 완료 상태
- **Phase 23** — sessionStorage 플래그 → 서버 진실 (`isApplyCompleted`)
- **Phase 29** — Next.js 서버 컴포넌트 가드 (`ensureAdmissionEvaluationAccess` + options)
- **Phase 33** — options API 진화 (boolean → enum destination)

### ③ 데이터 조회 (읽기)
- **Phase 3 Step 9** — useQuery 직접 호출 + queryKey 설계 + 옵션 상세
- **Phase 9** — throwOnError 우회 패턴 ← Top 10 #7
- **Phase 19** — sessionStorage 의존 걷어내고 서버 prefetch (Step 61 심층 학습 8개 sub-step)
- **Phase 27** — 제네릭 + render-prop으로 같은 UI를 두 데이터에 공유 (Step 90-1~90-9 sub-steps)

### ④ UI 조립 / 입력 받기
- **Phase 3 Steps 10~13** — useMemo 옵션 변환 + useState + 이벤트 + UI 렌더링
- **Phase 6** — 확인 모달 + 최종 제출
- **Phase 22** — Confirm 모드 빈값 숨김 (단일/다중/슬롯형 3패턴)
- **Phase 31** — Pointer Events + StarRating (마우스+터치 통합)

### ⑤ 상태 설계 / 훅 분리
- **Phase 8** — 커스텀 훅 분리 + SSR × sessionStorage 함정
- **Phase 13** — 컴포넌트 분리 + FSD 레이어 ← Top 10 #10
- **Phase 16** — 페이지 로직을 단일 오케스트레이션 훅으로 통합 ← Top 10 #10
- **Phase 17** — Confirm 패턴 + 통째 호출 함정 ← Top 10 #8
- **Phase 32** — server-first display, local fallback

### ⑥ 데이터 전송 (쓰기)
- **Phase 4** — useMutation 기초 + handleSubmit 조립 + MSW
- **Phase 10** — mock Route 제거, 실 API 연동, 요청/스냅샷 타입 분리, `extends`
- **Phase 24** — 훅 책임 경계 + mutation UX 4종 세트
- **Phase 25** — apply vs submit 두 단계 ← Top 10 #9
- **Phase 28** — POST 에러 응답으로 status API 대체
- **Phase 30** — Cache Invalidation 표준 패턴 ← Top 10 #1

### ⑦ 페이지 간 데이터 전달
- **Phase 5** — URL params vs sessionStorage 비교
- **Phase 18** — 복수 데이터(카드 N개) 스냅샷 모델링 ← Top 10 #9
- **Phase 19** — sessionStorage 걷어내고 서버 prefetch (의사결정 표)

### ⑧ 디버깅 / 에러 사전
- **Phase 11** — VALIDATION_PIPE_ERROR ← Top 10 #3
- **Phase 14** — Invalid hook call ← Top 10 #2
- **Phase 15** — 다른 호스트 API (apiClientFor 절대 URL / CSP / ENOTFOUND)
- **Phase 20** — number vs string 비대칭 ← Top 10 #4
- **Phase 21** — impure updater alert 2회 ← Top 10 #5
- **Phase 26** — 빈 응답 깊이별 판정 (||, ??, .length, .some)
- **Phase 34** — 모순 조건 + `0` 함정 ← Top 10 #6

### ⑨ 리팩토링 / 설계 진화
- **Phase 12** — 쓰기 vs 읽기 개념 정리 (+ applyId 제거 후속 결론)
- **Phase 13** — 컴포넌트 분리 / FSD (또 등장)
- **Phase 24** — 훅 책임 경계
- **Phase 25-28 한 그림** — 신청 두 단계 + 빈 응답 깊이 + 같은 UI 공유 + 에러 응답 활용
- **Phase 27** — 제네릭 + render-prop
- **Phase 29-32 한 그림** — 서버 가드 + 캐시 invalidation + Pointer Events + server-first display
- **Phase 33-34 한 그림** — options enum + 0 함정

---

## ✅ 핸드북 사용 체크리스트

새 기능 작업 시 / 막혔을 때 이 핸드북을 어떻게 쓸지:

- [ ] **시작 전** — "9개 카테고리 한눈에" 표를 보고 작업 진도 위치 확인
- [ ] **막혔다** — 콘솔 에러 → 🔴 에러 메시지 인덱스 / 작업 상황 → 🟡 키워드 인덱스
- [ ] **30초 안에 답** — Top 10 안이면 즉시 적용
- [ ] **Top 10 외** — "더 깊이 학습" 인덱스로 원본 Phase 점프
- [ ] **함정 만났다** — 5대 반복 함정 부록 확인 → "이 모양으로 또 나오겠구나" 다음번 30초

---

**관련 문서**
- [`hakjong-dev-guide.md`](hakjong-dev-guide.md) — 시간순 학습 기록 (원본 SSOT, 34 Phase)
- [`src/app/hakjong-guide/SYNC.md`](src/app/hakjong-guide/SYNC.md) — 원본 ↔ React 컴포넌트 동기화 절차
- [`src/app/hakjong-guide/`](src/app/hakjong-guide/) — React 컴포넌트 거울(mirror)
