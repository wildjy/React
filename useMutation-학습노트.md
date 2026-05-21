# useMutation 학습 노트

> `admission-evaluation` entity의 실제 코드로 정리한 React Query `useMutation` 가이드.

## 1. useQuery vs useMutation — 핵심 차이

|              | `useQuery`                                | `useMutation`                                                          |
| ------------ | ----------------------------------------- | --------------------------------------------------------------------- |
| 용도         | 데이터 **읽기** (GET)                     | 데이터 **쓰기/변경** (POST/PUT/DELETE) — 또는 "명시적 실행"이 필요할 때 |
| 실행 시점    | 컴포넌트 렌더 시 **자동**, `queryKey` 변경 시 재실행 | 자동 실행 안 됨. `mutate()`를 **호출해야** 실행                         |
| 반환         | `data`, `isLoading`, `error` ...          | `mutate`, `mutateAsync`, `isPending`, `data`, `error` ...             |

핵심은 **"언제 실행되느냐"**. useQuery는 선언적(렌더되면 알아서 돈다), useMutation은 명령형(내가 부르면 돈다).

## 2. 가장 기본 형태 — 학종 신청 제출

`model/admission-evaluation.queries.ts`

```ts
export function useAdmissionEvaluationApplyMutation() {
  return useMutation<
    AdmissionEvaluationApplyResponse,   // ① TData      - 성공 시 반환 타입
    Error,                              // ② TError     - 에러 타입
    AdmissionEvaluationApplyRequest     // ③ TVariables - mutate에 넘길 인자 타입
  >({
    mutationFn: (requestData) => submitAdmissionEvaluationApply(requestData),
    onError: (error) => {
      console.error('학종 신청 실패:', error);
      alert('신청에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
```

제네릭 3개의 의미:

- **① TData**: `mutationFn`이 resolve하는 값 → `data`로 받음
- **② TError**: 실패 시 `error` 타입
- **③ TVariables**: `mutate(여기에_넘기는_값)`의 타입 → `mutationFn`의 인자로 들어감

`mutationFn`은 **Promise를 반환하는 함수** 하나가 필수. 나머지(`onError` 등)는 옵션.

## 3. 컴포넌트에서 호출하는 흐름

`window/admission-evaluation/EarlyAdmissionEvaluationApply.tsx`

### (a) 훅에서 꺼내기

```ts
const { mutateAsync: submitApply, isPending } = useAdmissionEvaluationApplyMutation();
```

- `mutateAsync` → `submitApply`로 이름 바꿔 사용 (실행 함수)
- `isPending` → 요청 진행 중 여부 (true/false)

### (b) 사용자 클릭 → 실행

```ts
const response = await submitApply({ universityId: drop1.value, ... });
```

여기서 넘기는 객체가 ③ TVariables(`AdmissionEvaluationApplyRequest`)이고, 그대로 `mutationFn`의 `requestData`로 흘러 들어간다.

### (c) 진행 상태로 버튼 제어

```tsx
<Button onClick={handleSubmit} disabled={isPending}>
  {isPending ? '처리중...' : '입력완료'}
</Button>
```

`isPending`이 자동으로 true→false로 바뀌므로 **로딩 표시 / 중복 클릭 방지**를 직접 state로 만들 필요가 없다. useMutation을 쓰는 큰 이유 중 하나.

## 4. mutate vs mutateAsync — 자주 헷갈리는 부분

|             | `mutate(vars)`         | `mutateAsync(vars)`           |
| ----------- | ---------------------- | ----------------------------- |
| 반환        | `void` (Promise 아님)  | `Promise<TData>`              |
| 결과 받기   | `onSuccess` 콜백에서   | `await`로 직접 받음           |
| 에러 처리   | `onError`만 (throw 안 함) | `await` + `try/catch` 필요 (throw 함) |

- **결과를 받아 이어지는 작업을 순서대로** 해야 한다 → `mutateAsync` (`await response` 후 `sessionStorage` 저장 등)
- **실행만 시키고 뒷처리는 콜백에 맡긴다** → `mutate`

> ⚠️ `mutateAsync`는 실패 시 throw하므로 호출부를 `try/catch`로 감싸는 게 안전하다.
> 감싸지 않으면 unhandled rejection이 될 수 있다.

## 5. 콜백 옵션 (실행 순서)

```ts
useMutation({
  mutationFn,                      // 1. 실제 비동기 작업
  onMutate,                        // 2. mutationFn 직전 (낙관적 업데이트용)
  onSuccess: (data, vars) => {},   // 3a. 성공 시
  onError:   (err, vars)  => {},   // 3b. 실패 시  ← 이 entity가 쓰는 부분
  onSettled: () => {},             // 4. 성공/실패 무관하게 마지막
});
```

보통 mutation 성공 후엔 `onSuccess`에서 `queryClient.invalidateQueries()`로 관련 useQuery 캐시를 무효화해 화면을 갱신하는 패턴을 많이 쓴다.

## 6. 이 프로젝트 특유의 포인트 — "조회인데 useMutation"

`useAiBdListMutation`, `useMajorListMutation`은 사실 **GET 조회**인데도 useMutation을 쓴다. 이유:

> 대학 선택 → 계열 목록 → 학과 목록으로 이어지는 **cascade(연쇄) 흐름을 명령형으로** 제어해야 해서,
> queryKey 변경 시 자동 실행되는 useQuery보다 "내가 부를 때 실행"되는 useMutation이 맞다.

즉 useMutation은 "데이터 변경(POST)"일 때만 쓰는 게 아니라, **"사용자 액션에 의해 명시적으로/순서대로 실행하고 싶을 때"**도 선택지가 된다.
같은 파일의 `useUniversityList`는 반대로 처음 한 번 자동으로 받으면 되니 useQuery를 쓴다.

---

**요약**: useMutation은 렌더되면 알아서 도는 useQuery와 달리, 내가 `mutate()`를 불러야 도는 함수 + 로딩/에러 상태를 공짜로 얹어주는 도구다.
