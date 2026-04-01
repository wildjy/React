# WrButton 컴포넌트 분석

## 개요
Withremit 디자인 시스템의 핵심 버튼 컴포넌트로, `class-variance-authority`를 활용한 타입 안전한 variant 시스템을 구현합니다.

## 기술 스택
- **React**: Client Component
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **class-variance-authority (CVA)**: Variant 관리
- **cn 유틸리티**: 클래스 병합

## Variant 종류 (7종)

### 1. primary (기본)
- **배경색**: `#00a0dc` → Hover: `#3f87b9` → Disabled: `#c8d5da`
- **텍스트**: 흰색
- **용도**: 메인 액션 버튼

### 2. secondary
- **배경색**: 흰색 → Hover: `#f5f8fc` → Disabled: `#f5f8fc`
- **텍스트**: `#4a5c64` → Disabled: `#c8d5da`
- **테두리**: `#e3e8ea` → Hover: `#a4b7c0`
- **용도**: 보조 액션 버튼

### 3. utility
- **배경색**: `#7a8e96` → Hover: `#4a5c64` → Disabled: `#c8d5da`
- **텍스트**: 흰색
- **용도**: 유틸리티 기능 버튼

### 4. confirm
- **배경색**: `#1b5e9e` → Hover: `#264a78` → Disabled: `#1b5e9e/20`
- **텍스트**: 흰색
- **특징**: Disabled 시 20% 투명도 적용
- **용도**: 확인 액션

### 5. warning
- **배경색**: `#f59e0b` → Hover: `#d97706` → Disabled: `#f59e0b/20`
- **텍스트**: 흰색
- **특징**: Disabled 시 20% 투명도 적용
- **용도**: 경고/주의 액션

### 6. delete
- **배경색**: 흰색 → Hover: `#fbeded` → Disabled: `#f5f8fc`
- **텍스트**: `#ef4444` → Disabled: `#c8d5da`
- **테두리**: `#ef4444` → Disabled: `#e3e8ea`
- **용도**: 삭제 액션

### 7. text
- **배경색**: 투명
- **텍스트**: `#1b5e9e` → Hover: `#00a0dc` → Disabled: `#c8d5da`
- **용도**: 텍스트 링크형 버튼

## Size 종류 (4종)

| Size | Height | Padding | Font Size | Border Radius |
|------|--------|---------|-----------|---------------|
| lg   | 48px   | 20px    | 16px      | 8px           |
| md   | 40px   | 16px    | 14px      | 8px (기본값)   |
| sm   | 32px   | 12px    | 14px      | 4px           |
| text | auto   | 0       | 14px      | -             |

## Props 인터페이스

```typescript
interface WrButtonProps extends 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
  VariantProps<typeof WrButtonVariants> {
  
  type?: 'button' | 'submit';      // 버튼 타입 (기본값: 'button')
  startIcon?: React.ReactNode;     // 시작 아이콘
  endIcon?: React.ReactNode;       // 끝 아이콘
  children?: React.ReactNode;      // 버튼 텍스트/내용
  variant?: VariantType;           // 버튼 스타일 variant
  size?: SizeType;                 // 버튼 크기
  className?: string;              // 추가 클래스명
  disabled?: boolean;              // 비활성화 상태
  // ... 기타 모든 HTML button 속성
}
```

## 주요 기능

### 1. 아이콘 지원
- `startIcon`: 텍스트 앞에 아이콘 배치
- `endIcon`: 텍스트 뒤에 아이콘 배치
- `inline-flex shrink-0`로 아이콘 크기 고정

### 2. 상태 관리
- **Hover**: 각 variant별 hover 색상 정의
- **Disabled**: `cursor-not-allowed` + 색상 변경
- **Transition**: 150ms duration으로 부드러운 색상 전환

### 3. 접근성
- `select-none`: 텍스트 드래그 선택 방지
- `disabled:cursor-not-allowed`: 비활성 상태 시각적 피드백

### 4. 유연한 확장성
- `className` prop으로 커스텀 스타일 추가 가능
- `cn` 유틸리티로 클래스 안전하게 병합
- 모든 HTML button 속성 지원

## 사용 예시

```tsx
// 기본 사용
<WrButton>확인</WrButton>

// Variant 변경
<WrButton variant="secondary">취소</WrButton>
<WrButton variant="warning">경고</WrButton>
<WrButton variant="delete">삭제</WrButton>

// Size 변경
<WrButton size="lg">큰 버튼</WrButton>
<WrButton size="sm">작은 버튼</WrButton>

// 아이콘 추가
<WrButton startIcon={<Icon />}>시작 아이콘</WrButton>
<WrButton endIcon={<Icon />}>끝 아이콘</WrButton>

// Disabled 상태
<WrButton disabled>비활성</WrButton>

// 커스텀 클래스
<WrButton className="w-full">전체 너비</WrButton>

// Submit 타입
<WrButton type="submit">제출</WrButton>
```

## 디자인 시스템 관리

### 색상 변경 방법
파일 내 각 variant의 클래스만 수정하면 전체 시스템에 일관되게 적용됩니다.

```tsx
variant: {
  primary: [
    'bg-[#새로운색상] text-white border-transparent',
    'hover:bg-[#호버색상]',
    'disabled:bg-[#비활성색상]',
  ],
  // ...
}
```

### 장점
- ✅ 타입 안전성: CVA + TypeScript로 오타 방지
- ✅ 유지보수성: 한 곳에서 모든 variant 관리
- ✅ 일관성: 디자인 시스템 전체에 통일된 스타일
- ✅ 확장성: 새로운 variant/size 추가 용이
- ✅ 접근성: 기본 HTML 속성 + 시각적 피드백

## 파일 위치
`/src/sharedUI/Button/WrButton.tsx`

## 의존성
- `class-variance-authority`: Variant 관리
- `../common/cn`: 클래스 병합 유틸리티
- `react`: React 18+
