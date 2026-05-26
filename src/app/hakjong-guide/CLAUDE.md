# CLAUDE.md — hakjong-guide

이 폴더(`src/app/hakjong-guide`)는 루트 [`hakjong-dev-guide.md`](../../../hakjong-dev-guide.md)의 학습 내용을 화면용 React 컴포넌트로 옮긴 **거울(mirror)**이다.

## 발동 규칙

- **`hakjong-dev-guide.md`가 변경되어 그 내용을 이 폴더 컴포넌트에 반영해야 할 때**, 아래 동기화 가이드의 절차·매핑·체크리스트를 **반드시 따른다**.
- 원본은 **언제나 마크다운**이다. 컴포넌트에서 먼저 고치고 마크다운을 나중에 맞추지 말 것(역방향 금지).
- 작업 후 항상 `npx tsc --noEmit -p .`로 타입 체크한다.

## 동기화 가이드 (전문)

@SYNC.md
