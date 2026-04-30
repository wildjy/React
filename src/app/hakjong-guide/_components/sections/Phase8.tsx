import { PhaseHeader, StepCard, FlowDiagram, CompareGrid } from '../ui/StepCard'
import { Callout, IC } from '../ui/Callout'
import { CodeBlock } from '../ui/CodeBlock'
import { DataTable } from '../ui/DataTable'

export function Phase8() {
  return (
    <section className="mb-16">
      <PhaseHeader phase={8} />

      {/* 배경: 왜 로직을 분리해야 하는가? */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">배경 — 왜 컴포넌트에서 로직을 분리해야 하는가?</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          <IC>EarlyHakjongApply.tsx</IC>와 <IC>EarlyHakjongNavigator.tsx</IC>를 만들면서 컴포넌트 안에 점점 많은 로직이 쌓였습니다.
        </p>
        <ul className="list-disc pl-5 text-[13.5px] text-gray-700 leading-7 space-y-1 mb-3">
          <li>
            <strong>Apply</strong>: 드롭다운 옵션 변환(<IC>useMemo</IC> 4개) + 선택 상태(<IC>useState</IC> 2개) + 카드 추가/삭제 핸들러 + JSX 렌더링
          </li>
          <li>
            <strong>Navigator</strong>: 탭 이동 가드(로그인/결제/신청완료 검사) + 라우팅 + JSX 렌더링
          </li>
        </ul>
        <p className="text-[14px] text-gray-700 leading-7 mb-2">
          이렇게 한 컴포넌트가 <strong>데이터 변환 + 상태 관리 + 비즈니스 규칙 + 화면 렌더링</strong>을 모두 담당하면 다음 문제가 생깁니다.
        </p>
        <ol className="list-decimal pl-5 text-[13.5px] text-gray-700 leading-7 space-y-1">
          <li>
            <strong>읽기 어려움</strong> — JSX 사이사이에 <IC>useState</IC>, <IC>useMemo</IC>, 핸들러 함수가 섞여 화면 구조를 파악하기 어렵습니다.
          </li>
          <li>
            <strong>재사용 불가</strong> — 같은 로직이 다른 컴포넌트에 필요하면 복사·붙여넣기 해야 합니다.
          </li>
          <li>
            <strong>테스트 불편</strong> — 컴포넌트 전체를 렌더링해야 로직을 검증할 수 있습니다.
          </li>
          <li>
            <strong>변경 영향 범위가 큼</strong> — 가드 로직 하나 바꾸려고 신청 폼 컴포넌트 전체를 열어야 합니다.
          </li>
        </ol>
      </div>

      {/* 핵심 개념: 커스텀 훅 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ◎
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">핵심 개념 — 커스텀 훅(custom hook)이란?</h4>
        </div>
        <p className="text-[14px] text-gray-700 leading-7 mb-3">
          <strong><IC>use</IC>로 시작하는 함수</strong>를 만들어 컴포넌트 안의 로직을 떼어낸 것입니다.
          내부에서 <IC>useState</IC>, <IC>useEffect</IC>, <IC>useMemo</IC> 같은 React 훅을 자유롭게 사용할 수 있습니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`// 일반 함수 — useState 같은 React 훅 사용 불가
function getApplyOptions() {
  const [state, setState] = useState(...); // ❌ 에러
}

// 커스텀 훅 — use로 시작하므로 내부에서 React 훅 사용 가능
function useApplyOptions() {
  const [state, setState] = useState(...); // ✅ 가능
  return { state, setState };
}`}
        />
        <Callout variant="tip">
          <strong>퍼블리싱 비유로 이해하면:</strong> CSS에서 자주 쓰는 스타일을 <IC>mixin</IC>이나 <IC>class</IC>로 빼서 재사용하는 것과 비슷합니다.
          컴포넌트의 "행동(로직)" 버전이라고 생각하면 됩니다.
        </Callout>
      </div>

      {/* Step 34 */}
      <StepCard phase={8} num="34" id="step34" title="분리 대상 식별 — 무엇을 훅으로 빼야 하나?">
        <p>
          <strong>판단 기준 3가지:</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>여러 컴포넌트에서 쓰이는가?</strong> → 재사용 가치 있음</li>
          <li><strong>한 가지 책임으로 묶이는가?</strong> → 응집도 높은 단위</li>
          <li><strong>컴포넌트 외부에서도 의미가 있는가?</strong> → 비즈니스 규칙으로 추출 가능</li>
        </ol>
        <p>
          <IC>EarlyHakjongApply</IC>와 <IC>EarlyHakjongNavigator</IC>를 분석하면:
        </p>
        <DataTable
          headers={['로직 종류', 'Apply 사용', 'Navigator 사용', '분리 단위']}
          rows={[
            ['대학·학과 옵션 변환', '✅', '❌', <IC key="a">useApplyDropOptions</IC>],
            ['드롭다운 선택 상태', '✅', '❌', <IC key="b">useHakjongApplyForm</IC>],
            ['카드 추가/삭제', '✅', '❌', <IC key="c">useHakjongApplyForm</IC>],
            ['탭 초기 인덱스 계산', '❌', '✅', <IC key="d">useHakjongNavigation</IC>],
            ['탭 이동 전 로그인/결제 검사', '❌', '✅', <IC key="e">useHakjongNavigation</IC>],
          ]}
        />
        <Callout variant="key">
          → <strong>3개 훅으로 분리</strong> 가능합니다.
        </Callout>
      </StepCard>

      {/* Step 35 */}
      <StepCard phase={8} num="35" id="step35" title="useApplyDropOptions — 데이터 변환 훅">
        <p className="font-semibold text-gray-800">분리 전 (컴포넌트 내부)</p>
        <CodeBlock
          lang="tsx"
          code={`export const EarlyHakjongApply = () => {
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
};`}
        />
        <p className="font-semibold text-gray-800">분리 후</p>
        <CodeBlock
          lang="typescript"
          path="entities/hakjong/model/useApplyDropOptions.ts"
          code={`import { useUnivMajorListAndMajorTheme } from '@libs/entities/university-major-search/model/university-major-search.queries';
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
};`}
        />
        <p className="font-semibold text-gray-800">컴포넌트에서 사용</p>
        <CodeBlock
          lang="tsx"
          code={`export const EarlyHakjongApply = () => {
  const { universityOptions, majorCategoryOptions } = useApplyDropOptions();
  // 이제 컴포넌트는 변환 로직을 모릅니다 — 결과만 받아서 씁니다
};`}
        />
        <p className="font-semibold text-gray-800 mt-4">핵심 학습 포인트</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong><IC>useMemo</IC>의 역할</strong>: 의존성(<IC>univMajorData?.universities</IC>)이 바뀌지 않으면 같은 결과를 재사용합니다.
            컴포넌트가 다시 렌더링될 때마다 <IC>map</IC>을 다시 실행하지 않게 하는 최적화입니다.
          </li>
          <li>
            <strong><IC>?? []</IC> (null 병합 연산자)</strong>: API 응답이 아직 오지 않았을 때(<IC>undefined</IC>) 빈 배열을 반환합니다.
            <IC>DropDown</IC>이 <IC>options.map(...)</IC>을 호출할 때 에러나지 않도록 하는 안전장치입니다.
          </li>
          <li>
            <strong><IC>{'useMemo<StringDropDownOption[]>'}</IC></strong>: 반환 타입을 명시해 다른 곳에서 잘못 사용하면 즉시 컴파일 에러가 나도록 합니다.
          </li>
        </ul>
      </StepCard>

      {/* Step 36 */}
      <StepCard phase={8} num="36" id="step36" title="useHakjongNavigation — 탭 이동 가드 훅">
        <p className="font-semibold text-gray-800">분리 전 (Navigator 컴포넌트 내부)</p>
        <p>탭 이동 시 로그인/결제/신청완료 검사 로직이 컴포넌트 안에 직접 작성되어 있었습니다.</p>
        <p className="font-semibold text-gray-800">분리 후</p>
        <CodeBlock
          lang="typescript"
          path="entities/hakjong/model/useHakjongNavigation.ts"
          code={`import { LOGIN_URL, PAYMENT_URL } from '@libs/config';
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
    ? \`?\${searchParams.toString()}\`
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
};`}
        />
        <p className="font-semibold text-gray-800">컴포넌트에서 사용 (필요한 함수만 구조분해)</p>
        <CodeBlock
          lang="tsx"
          path="EarlyHakjongNavigator.tsx"
          code={`export const EarlyHakjongNavigator = () => {
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
};`}
        />
        <CodeBlock
          lang="tsx"
          path="EarlyHakjongIntro.tsx"
          code={`// 같은 훅에서 다른 함수만 사용
export const EarlyHakjongIntro = () => {
  const { currentUser, handleServiceClick } = useHakjongNavigation();
  // ...
};`}
        />
        <p className="font-semibold text-gray-800 mt-4">핵심 학습 포인트</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>하나의 훅이 여러 컴포넌트에서 부분적으로 사용됨</strong> — Navigator는 <IC>handleTabBeforeApply</IC> 등을,
            Intro는 <IC>handleServiceClick</IC>만 가져갑니다.
          </li>
          <li>
            <strong>각 컴포넌트가 자기 훅 인스턴스를 가짐</strong> — Navigator의 <IC>useHakjongNavigation()</IC>과 Intro의
            <IC>useHakjongNavigation()</IC>은 <strong>별개의 인스턴스</strong>입니다. 상태가 공유되지 않습니다.
            (상태 공유가 필요하면 Redux 또는 Context API를 써야 합니다.)
          </li>
          <li>
            <strong>가드 절(guard clause) 패턴</strong> — 조건 실패 시 <IC>return false</IC>로 즉시 탈출. 중첩 <IC>if</IC> 대신 평탄한 구조를 만듭니다.
          </li>
        </ul>
      </StepCard>

      {/* Step 37 */}
      <StepCard phase={8} num="37" id="step37" title="분리의 장단점 정리">
        <p className="font-semibold text-gray-800">장점</p>
        <ol className="list-decimal pl-5 space-y-2 text-[13.5px]">
          <li>
            <strong>컴포넌트 코드가 단순해짐</strong> — <IC>EarlyHakjongApply</IC>에서 옵션 변환 <IC>useMemo</IC> 4개와 카드 상태 관리 코드가 사라져
            JSX에 집중할 수 있게 됩니다.
          </li>
          <li>
            <strong>비즈니스 로직의 테스트 가능성 향상</strong> — 훅은 단독으로 단위 테스트가 가능합니다
            (<IC>@testing-library/react</IC>의 <IC>renderHook</IC> 사용). 컴포넌트 렌더링 없이 <IC>handleTabBeforeApply</IC> 로직만 검증할 수 있습니다.
          </li>
          <li>
            <strong>의존성이 명확해짐</strong> — Navigator를 보면 <IC>useHakjongNavigation</IC>만 import되어 있어, 이 컴포넌트가 무엇에 의존하는지
            한눈에 보입니다.
          </li>
          <li>
            <strong>변경 영향 범위 축소</strong> — 가드 로직을 수정할 때 Navigator JSX는 건드리지 않아도 됩니다.
            반대로 Tab UI를 수정할 때 가드 로직은 보지 않아도 됩니다.
          </li>
        </ol>

        <p className="font-semibold text-gray-800 mt-5">단점</p>
        <ol className="list-decimal pl-5 space-y-2 text-[13.5px]">
          <li>
            <strong>같은 훅을 여러 컴포넌트가 호출하면 상태가 공유되지 않음</strong>
            <CodeBlock
              lang="typescript"
              code={`Navigator → useHakjongNavigation()  // 인스턴스 A
Intro    → useHakjongNavigation()  // 인스턴스 B (별개)`}
            />
            <span className="block mt-1">
              상태 공유가 필요하면 Redux/Context로 올려야 합니다. 현재는 이 훅이 <strong>함수만 반환</strong>(상태 없음)하므로 문제 없지만,
              만약 <IC>useState</IC>를 추가하면 컴포넌트마다 별개 상태가 됩니다.
            </span>
          </li>
          <li>
            <strong>파일 수가 늘어남</strong> — 훅을 만들 때마다 파일이 추가되어, 작은 프로젝트에서는 오히려 탐색이 번거로울 수 있습니다.
          </li>
          <li>
            <strong>추상화의 비용</strong> — 훅 내부를 보려면 별도 파일을 열어야 합니다. 한 컴포넌트에서만 쓰는 짧은 로직을 굳이 훅으로 빼면 오히려
            가독성이 떨어집니다.
          </li>
        </ol>

        <Callout variant="key">
          <strong>분리 판단 기준:</strong> "이 로직이 다른 컴포넌트에서도 필요하거나, 50줄 이상으로 커지거나, 단독 테스트가 필요할 때만" 분리합니다.
          작은 로직 무조건 분리하는 것은 과한 추상화(over-engineering)입니다.
        </Callout>
      </StepCard>

      {/* Step 38 */}
      <StepCard phase={8} num="38" id="step38" title="실전 함정 — SSR 환경에서 sessionStorage 호출 시 500 에러">
        <p className="font-semibold text-gray-800">발생한 문제</p>
        <p>
          <IC>useHakjongNavigation</IC>을 처음 작성했을 때 다음과 같이 훅 본문 최상단에서 <IC>sessionStorage</IC>를 호출했습니다.
        </p>
        <CodeBlock
          lang="typescript"
          code={`export const useHakjongNavigation = () => {
  // ...
  const isApplyCompleted =
    sessionStorage.getItem(HAKJONG_STORAGE_KEY.applyComplete) === 'true';
  // ↑ 훅이 실행될 때마다 즉시 호출됨

  const handleTabBeforeApply = () => {
    if (isApplyCompleted) { ... }
  };
};`}
        />
        <Callout variant="warn">
          → 페이지 접속 시 <strong>500 Internal Server Error</strong> 발생.
        </Callout>

        <p className="font-semibold text-gray-800 mt-4">원인 분석</p>
        <p>
          Next.js의 <IC>&apos;use client&apos;</IC> 컴포넌트도 <strong>첫 화면 표시 속도를 위해 서버에서 미리 한 번 렌더링(SSR)</strong>합니다.
          이때 Node.js 환경에는 <IC>sessionStorage</IC>(브라우저 전용 API)가 존재하지 않기 때문에 다음 에러가 납니다.
        </p>
        <CodeBlock
          lang="text"
          code={`ReferenceError: sessionStorage is not defined`}
        />
        <p>서버 렌더링이 실패하면 HTTP 500이 응답됩니다.</p>

        <p className="font-semibold text-gray-800 mt-4">컴포넌트 생명주기 관점에서 이해하기</p>
        <FlowDiagram>{`[1] 사용자 페이지 접속
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
[5] 사용자가 탭 클릭 → 핸들러 실행`}</FlowDiagram>
        <ul className="list-disc pl-5 space-y-1">
          <li>→ <strong>[2]</strong> 단계에서 실행되는 코드는 <strong>브라우저 API를 쓸 수 없습니다</strong>.</li>
          <li>→ <strong>[5]</strong> 단계에서만 실행되는 코드(이벤트 핸들러 내부)는 <strong>항상 브라우저에서 실행되므로 안전</strong>합니다.</li>
        </ul>

        <p className="font-semibold text-gray-800 mt-4">해결 방법 — sessionStorage 호출을 핸들러 내부로 이동</p>
        <CompareGrid
          beforeLabel="잘못된 위치 (SSR에서 실행됨)"
          afterLabel="올바른 위치 (클릭 시점에만 실행됨)"
          before={
            <CodeBlock
              lang="typescript"
              code={`export const useHakjongNavigation = () => {
  const isApplyCompleted =
    sessionStorage.getItem(...) === 'true';
  // 훅이 실행될 때 즉시 호출 → SSR에서 💥

  const handleTabBeforeApply = () => {
    if (isApplyCompleted) { ... }
  };
};`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              code={`export const useHakjongNavigation = () => {
  const handleTabBeforeApply = () => {
    if (!currentUser.userId) { ... }
    if (!isPaid) { ... }

    // 이벤트 핸들러 내부 → 클릭 시점(브라우저)
    const isApplyCompleted =
      sessionStorage.getItem(...) === 'true';

    if (isApplyCompleted) { ... }
  };
};`}
            />
          }
        />

        <p className="font-semibold text-gray-800 mt-4">다른 해결 방법들</p>
        <DataTable
          headers={['방법', '장점', '단점']}
          rows={[
            [<><strong key="a">(A) 핸들러 내부로 이동</strong> — 채택 ✅</>, '가장 단순, 항상 최신 값', '핸들러가 여러 번이면 코드 중복'],
            [<>(B) <IC key="b">{'typeof window !== "undefined"'}</IC> 체크</>, '훅 본문에서도 호출 가능', 'SSR 시점엔 항상 false로 평가되어 의미 흐려짐'],
            [<>(C) <IC key="c">useEffect</IC> + <IC key="c2">useState</IC>로 클라이언트 마운트 후 읽기</>, 'React 상태로 관리, 자동 리렌더링', '첫 렌더링에 잠깐 false 노출(깜빡임 가능성)'],
            [<>(D) <IC key="d">useSyncExternalStore</IC></>, 'React 18 공식 패턴', '학습 곡선 있음, 보일러플레이트 많음'],
          ]}
        />
        <p className="mt-2">이 프로젝트는 <strong>(A) 핸들러 내부 호출</strong>이 적합한 이유:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><IC>isApplyCompleted</IC> 값이 화면 렌더링에 영향을 주지 않음 (탭 클릭 시점에만 필요)</li>
          <li>React 상태로 관리할 필요가 없음 (자동 리렌더링 불필요)</li>
          <li>코드가 가장 단순함</li>
        </ul>

        <p className="font-semibold text-gray-800 mt-4">핵심 학습 포인트</p>
        <DataTable
          headers={['개념', '설명']}
          rows={[
            [
              <strong key="a">SSR (Server-Side Rendering)</strong>,
              <>Next.js가 첫 화면을 서버에서 미리 렌더링하는 것. 브라우저 API(<IC key="w">window</IC>, <IC key="s">sessionStorage</IC>, <IC key="l">localStorage</IC>, <IC key="d">document</IC>)는 사용 불가</>,
            ],
            [<strong key="b">Hydration</strong>, '서버가 만든 HTML에 브라우저가 이벤트 핸들러를 다시 붙이는 과정'],
            [
              <><strong key="c"><IC>&apos;use client&apos;</IC>도 SSR 대상</strong></>,
              '클라이언트 컴포넌트도 첫 렌더링은 서버에서 실행됨. 완전히 클라이언트 전용이 아님',
            ],
            [<strong key="d">이벤트 핸들러는 SSR 안 됨</strong>, '핸들러 내부 코드는 사용자 상호작용 시점에만 실행되므로 브라우저 API 안전'],
          ]}
        />
        <Callout variant="warn">
          <strong>체크리스트:</strong> 코드를 작성할 때 <IC>window</IC>, <IC>sessionStorage</IC>, <IC>localStorage</IC>, <IC>document</IC>를 쓴다면
          다음 중 하나여야 합니다.
          <ol className="list-decimal pl-5 mt-1 space-y-0.5">
            <li>이벤트 핸들러 내부</li>
            <li><IC>useEffect</IC> 내부</li>
            <li><IC>{'typeof window !== "undefined"'}</IC> 가드 뒤</li>
          </ol>
        </Callout>
      </StepCard>

      {/* Step 39 */}
      <StepCard phase={8} num="39" id="step39" title="향후 구조 개선 방향">
        <p>
          현재 분리된 구조도 충분히 좋지만, 프로젝트가 더 커지면 다음과 같이 개선할 여지가 있습니다.
        </p>

        <p className="font-semibold text-gray-800 mt-3">개선 1 — 한 훅이 두 가지 책임을 가질 때 분리</p>
        <p>
          만약 <IC>useHakjongNavigation</IC>이 탭 가드 로직과 폼 상태 관리를 모두 담는다면 <strong>단일 책임 원칙(SRP)</strong>을 위반합니다.
          다음과 같이 나눌 수 있습니다.
        </p>
        <FlowDiagram>{`useHakjongHandler (가상의 통합 훅)
    ├── useHakjongNavigation  ← 라우팅 가드만
    └── useHakjongApplyForm   ← 드롭다운/카드 상태만`}</FlowDiagram>
        <p>판단 기준: <strong>"이 두 로직이 서로 다른 이유로 변경되는가?"</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>가드 로직은 결제/로그인 정책 변경 시 수정 → A 이유</li>
          <li>폼 상태는 입력 항목 추가 시 수정 → B 이유</li>
          <li>서로 다른 이유로 변경됨 → 분리 권장</li>
        </ul>

        <p className="font-semibold text-gray-800 mt-4">개선 2 — sessionStorage 키를 한 곳에 응집</p>
        <p>
          이미 <IC>HAKJONG_STORAGE_KEY</IC> 상수로 관리하고 있어 좋은 패턴입니다. 추가로 다음을 고려:
        </p>
        <CompareGrid
          beforeLabel="키 직접 호출이 여러 곳에 흩어짐"
          afterLabel="헬퍼 함수로 한 번 더 감싸기"
          before={
            <CodeBlock
              lang="typescript"
              code={`sessionStorage.setItem('hakjong_apply_complete', 'true');
sessionStorage.getItem('hakjong_apply_complete');`}
            />
          }
          after={
            <CodeBlock
              lang="typescript"
              path="libs/hakjongStorage.ts"
              code={`export const hakjongStorage = {
  setApplyComplete: (value: boolean) =>
    sessionStorage.setItem(
      HAKJONG_STORAGE_KEY.applyComplete,
      String(value),
    ),
  getApplyComplete: () =>
    sessionStorage.getItem(
      HAKJONG_STORAGE_KEY.applyComplete,
    ) === 'true',
};`}
            />
          }
        />
        <p>장점:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><IC>String(value) === &apos;true&apos;</IC> 변환을 매번 안 써도 됨</li>
          <li>키 이름과 값 직렬화 방식이 한 곳에 응집</li>
          <li>테스트 시 이 객체만 모킹(mocking)하면 됨</li>
        </ul>

        <p className="font-semibold text-gray-800 mt-4">개선 3 — API 연동 시 React Query로 이전</p>
        <p>
          Phase 7에서 다룬 것처럼, sessionStorage 의존을 제거하고 <IC>useQuery</IC>로 서버 상태를 관리하면:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>SSR 호환성 자동 확보 (React Query는 서버에서도 동작)</li>
          <li>자동 캐싱 및 백그라운드 갱신</li>
          <li>로딩/에러 상태 자동 처리</li>
        </ul>
        <CodeBlock
          lang="typescript"
          code={`// 최종 목표 형태
export const useHakjongNavigation = () => {
  const { data: applyStatus } = useApplyStatusQuery();
  const isApplyCompleted = applyStatus?.isApplyCompleted ?? false;

  const handleTabBeforeReport = () => {
    if (!isApplyCompleted) { ... } // sessionStorage 호출 사라짐
  };
};`}
        />
      </StepCard>

      {/* Phase 8 정리 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Phase 8 정리</h4>
        </div>
        <DataTable
          headers={['새로 배운 핵심 개념', '설명']}
          rows={[
            [<strong key="a">커스텀 훅 (custom hook)</strong>, <><IC key="u">use</IC>로 시작하는 함수. 컴포넌트의 로직(상태/효과/계산)을 떼어내 재사용·테스트 가능하게 만든 패턴</>],
            [<strong key="b">단일 책임 원칙 (SRP)</strong>, '하나의 훅/모듈은 하나의 변경 이유만 가져야 함. 서로 다른 이유로 변경되면 분리 신호'],
            [<><strong key="c"><IC>useMemo</IC> 의존성 배열</strong></>, '의존성 값이 바뀔 때만 재계산. 불필요한 map 반복을 방지'],
            [<strong key="d">훅 인스턴스의 독립성</strong>, '같은 훅을 여러 컴포넌트에서 호출하면 각각 별개 인스턴스. 상태 공유 안 됨'],
            [<strong key="e">SSR과 브라우저 API의 충돌</strong>, <><IC key="u2">&apos;use client&apos;</IC>도 첫 렌더링은 서버에서 실행. <IC key="ss">sessionStorage</IC> 등 브라우저 API는 SSR 시점에 사용 불가</>],
            [<strong key="f">Hydration</strong>, '서버 HTML에 브라우저가 이벤트 핸들러를 붙이는 과정'],
            [<strong key="g">이벤트 핸들러 내부의 안전성</strong>, <>사용자 상호작용 시점에만 실행되므로 <IC key="ss2">sessionStorage</IC> 등 브라우저 API 호출 가능</>],
            [<strong key="h">분리 판단 기준</strong>, '재사용성, 단일 책임, 테스트 필요성 — 셋 중 하나 이상 충족할 때만 분리. 무조건 분리는 과한 추상화'],
          ]}
        />

        <p className="font-semibold text-gray-800 mt-5">파일 구조 결과</p>
        <CodeBlock
          lang="directory"
          code={`apps/early/src/entities/hakjong/
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
└── ui/`}
        />

        <p className="font-semibold text-gray-800 mt-4">컴포넌트별 사용 훅</p>
        <DataTable
          headers={['컴포넌트', '사용 훅']}
          rows={[
            [<IC key="a">EarlyHakjongIntro</IC>, <><IC key="h">useHakjongNavigation</IC> (handleServiceClick)</>],
            [<IC key="b">EarlyHakjongNavigator</IC>, <><IC key="h2">useHakjongNavigation</IC> (getInitTab, handleTabBefore*)</>],
            [<IC key="c">EarlyHakjongApply</IC>, <><IC key="d">useApplyDropOptions</IC> + <IC key="hh">useHakjongHandler</IC> (드롭다운/카드 상태)</>],
            [<IC key="d2">EarlyHakjongConfirm</IC>, '(페이지별 자체 로직)'],
          ]}
        />
        <Callout variant="key">
          <strong>임시 구현 → API 전환 패턴:</strong> 하드코딩/<IC>sessionStorage</IC>로 먼저 동작 확인 후, API 확정 시 <IC>useQuery</IC>로 교체합니다.
        </Callout>
      </div>
    </section>
  )
}
