'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Cascade Dropdown 학습 샘플 (대학 → 계열 → 학과)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 핵심 학습 포인트 3가지:
 *   1) IoC (제어의 역전) — 함수를 prop/return 값으로 주입해서 동작을 외부에서 결정
 *   2) Cascade (연쇄 의존) — 상위 선택값이 하위 옵션을 결정
 *   3) 상태 vs 캐시 — 화면에 그릴 옵션은 useState, 내부 계산용 데이터는 useRef
 *
 * 이 파일에는 "배워야 할 핵심" 만 둔다 → 타입 / Mock 데이터 / 가짜 서버 / hook / 조합.
 * 화면을 꾸미는 코드(카드·로그뷰·코드뷰어 등)는 ./_learning 폴더로 분리했다.
 *   → 이 파일을 위에서 아래로 읽으면 cascade 패턴의 흐름만 깔끔하게 따라갈 수 있다.
 */

import { useRef, useState } from 'react';
import {
  CodeAnatomySection,
  DemoSection,
  FlowSection,
  InternalStateSection,
  IocHintSection,
  KeyPointsSection,
  LearningHeader,
  StateVsRefSection,
} from './_learning/sections';

// ───────────────────────── 1. 타입 정의 ─────────────────────────
// [학습] 패턴의 출발점은 "데이터가 어떤 모양으로 흐를지" 를 타입으로 먼저 못박는 것.
//        타입이 곧 설계도라서, 아래 로직은 이 모양을 그대로 따라가게 된다.

// 드롭다운 한 칸이 다루는 최소 단위 = { 화면에 보일 글자(label), 내부 식별값(value) }
// 대학/계열/학과 3개 드롭다운 모두 이 동일한 모양을 재사용한다 → 코드 통일.
export interface Option {
  label: string; // 사용자에게 보이는 텍스트 (예: "서울대")
  value: string; // 코드가 식별에 쓰는 값 (예: "1")
}

// 가짜 서버가 대학 1건에 대해 돌려주는 응답 모양.
// 핵심: 대학 안에 majors 배열이 "중첩"되어 있다 → 한 번의 fetch 로 그 대학의
//       모든 학과 정보를 통째로 받아온다. (그래서 계열 변경 시 재요청이 필요 없음 → 캐시 가능)
export interface University {
  universityId: string;
  universityName: string;
  // 각 학과는 자신이 어떤 "계열(majorTypeCode)" 에 속하는지를 들고 있다.
  // 이 코드값(H/N/A/Z)이 2단(계열) ↔ 3단(학과)을 잇는 연결고리.
  majors: { majorId: string; majorName: string; majorTypeCode: string }[];
}

// [학습 / IoC] "대학 ID 를 받아 → 계열 옵션 목록을 비동기로 돌려준다" 는 함수의 계약서(시그니처).
//   - 실제 구현이 무엇이든(mock 이든 진짜 axios 든) 이 모양만 지키면 hook 이 그대로 동작.
//   - 나중에 이 타입의 함수를 hook 에 prop 으로 주입하면 = 제어의 역전(IoC).
export type FetchMajorTypesByUniv = (
  universityId: string,
) => Promise<Option[]>;

// 동작 로그 1건의 타입 (학습용 시각화 전용).
export type LogType = 'event' | 'fetch' | 'state' | 'cache';
export interface LogEntry {
  time: string;
  message: string;
  type: LogType;
}

// ───────────────────────── 2. Mock 데이터 + 가짜 서버 ─────────────────────────

// [학습] 전역 코드 테이블 — "계열" 의 전체 후보 목록 (모든 대학 공통).
//   실무에선 보통 서버/공통 상수로 내려오는 마스터 코드.
//   주의: 이건 "전체 후보" 일 뿐, 화면에 다 보여주지 않는다.
//        실제 옵션은 "선택한 대학에 존재하는 계열" 만 골라낸 부분집합 (아래 hook 참고).
const ALL_MAJOR_TYPES: Option[] = [
  { value: 'H', label: '인문' },
  { value: 'N', label: '자연' },
  { value: 'A', label: '예체능' },
  { value: 'Z', label: '자율' },
];

// [학습] 가짜 서버 DB. 실제로는 백엔드가 들고 있어서 클라이언트엔 안 보이는 정보.
//   여기선 학습을 위해 메모리에 박아두고, 아래 mockFetchUnivMajors 가 이걸 조회하는 척한다.
const MOCK_UNIVERSITIES: University[] = [
  {
    universityId: '1',
    universityName: '서울대',
    majors: [
      { majorId: 'm1', majorName: '국문학과', majorTypeCode: 'H' },
      { majorId: 'm2', majorName: '사학과', majorTypeCode: 'H' },
      { majorId: 'm3', majorName: '물리학과', majorTypeCode: 'N' },
      { majorId: 'm4', majorName: '컴퓨터공학과', majorTypeCode: 'N' },
    ],
  },
  {
    universityId: '2',
    universityName: '연세대',
    majors: [
      { majorId: 'm5', majorName: '영문학과', majorTypeCode: 'H' },
      { majorId: 'm6', majorName: '체육학과', majorTypeCode: 'A' },
      { majorId: 'm7', majorName: '자유전공학부', majorTypeCode: 'Z' },
    ],
  },
  {
    universityId: '3',
    universityName: '고려대',
    majors: [
      { majorId: 'm8', majorName: '경제학과', majorTypeCode: 'H' },
      { majorId: 'm9', majorName: '생명과학과', majorTypeCode: 'N' },
      { majorId: 'm10', majorName: '디자인학과', majorTypeCode: 'A' },
    ],
  },
];

// [학습] 가짜 서버 호출 함수.
//   실무에선 이 자리에 ky/axios 같은 HTTP 호출이 들어간다.
//   여기선 데이터를 즉시 알지만, 일부러 비동기(async)로 만들어 "네트워크 대기" 상황을 재현한다.
//   → 비동기라서 hook 쪽에서 await / 로딩 처리 / 경합(race) 고려가 필요해진다.
async function mockFetchUnivMajors(
  universityId: string,
): Promise<University['majors']> {
  // setTimeout(300ms) 로 네트워크 지연을 흉내. 이 지연이 있어야 로딩 인디케이터가 의미를 가진다.
  await new Promise((resolve) => setTimeout(resolve, 300));
  // 대학 ID 로 DB 에서 한 건 조회 (실제 서버의 WHERE 절에 해당).
  const found = MOCK_UNIVERSITIES.find((u) => u.universityId === universityId);
  // 없는 ID 면 에러 throw → 호출부(hook)의 try/catch 가 받아 처리.
  if (!found) throw new Error(`Univ ${universityId} not found`);
  // 그 대학의 학과 배열을 통째로 반환 (계열까지 포함되어 있음 → 이후 캐시·필터의 재료).
  return found.majors;
}

// ───────────────────────── 3. Cascade Hook ─────────────────────────

// [학습] 이 hook 이 패턴의 심장. 모든 상태와 로직을 여기 모으고,
//        UI 컴포넌트는 "받아서 그리기만" 하도록 얇게 유지한다 (관심사 분리).
function useCascadeDropdowns() {
  // 1단(대학) 옵션은 고정 목록이라 state 가 필요 없다 → 매 렌더 그냥 계산.
  //   (대학 목록은 사용자 조작으로 바뀌지 않으므로 useState/useMemo 둘 다 과함)
  const universityOptions: Option[] = MOCK_UNIVERSITIES.map((u) => ({
    value: u.universityId,
    label: u.universityName,
  }));

  // [상태] 화면에 그려야 하므로 useState. 상위 선택에 따라 내용이 통째로 갈린다.
  const [majorTypeOptions, setMajorTypeOptions] = useState<Option[]>([]); // 2단(계열) 옵션
  const [majorOptions, setMajorOptions] = useState<Option[]>([]); // 3단(학과) 옵션

  // [상태] 현재 사용자가 고른 값 3종을 하나의 객체로 묶어 관리.
  //   한 객체로 묶으면 "대학 바뀌면 하위 둘을 동시에 비운다" 같은 리셋이 한 번에 끝난다.
  const [selected, setSelected] = useState({
    universityId: '',
    majorTypeCode: '',
    majorId: '',
  });

  // [캐시] 대학 fetch 응답(학과 raw 데이터)을 보관.
  //   ★ useState 가 아니라 useRef 인 이유:
  //     - 이 값 자체는 화면에 직접 안 그린다 (계열 변경 때 "필터 입력"으로만 쓰임)
  //     - 그래서 바뀌어도 리렌더가 필요 없음 → useRef 가 정확. (useState 면 불필요한 렌더 1회 발생)
  //   즉 "이 값이 바뀌면 화면이 바뀌어야 하나?" → 아니오 → useRef.
  const cachedMajorsRef = useRef<University['majors']>([]);

  // ─── 학습용 trace ───
  // [주의] logs / loading / addLog 는 "학습용 계측" 일 뿐, 패턴의 필수 요소가 아니다.
  //   화면 우측에 hook 내부 동작을 눈으로 보여주려고 끼워 넣은 것. 실무 코드엔 보통 없다.
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false); // fetch 진행 여부 (스피너 표시용)
  const addLog = (message: string, type: LogType = 'event') => {
    setLogs((prev) =>
      [
        ...prev,
        {
          time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
          message,
          type,
        },
      ].slice(-15),
    );
  };

  // ─── 대학 변경 시 트리거 (1단 → 2단) ───
  // [학습] 가장 무거운 핸들러. 비동기(fetch)가 있어 async.
  //   순서가 중요: ①리셋 → ②fetch → ③옵션 채우기. 리셋이 fetch 보다 먼저인 이유는 아래 주석 참고.
  const onUniversityChange = async (universityId: string) => {
    addLog(`onUniversityChange("${universityId || '∅'}") 호출`, 'event');

    // ① 선택값 갱신 + 하위 cascade 리셋.
    //    대학이 바뀌면 이전에 고른 계열/학과는 무효 → 즉시 비워야 "서울대인데 연세대 학과" 같은
    //    잘못된 조합이 화면에 한순간도 남지 않는다. (fetch 응답을 기다리는 300ms 동안에도)
    setSelected({ universityId, majorTypeCode: '', majorId: '' });
    setMajorOptions([]);
    setMajorTypeOptions([]);
    addLog('하위 cascade 리셋 — 계열/학과 옵션 비움', 'state');

    // 빈 값(선택 해제)이면 fetch 할 게 없으니 캐시까지 비우고 종료.
    if (!universityId) {
      cachedMajorsRef.current = [];
      addLog('빈 선택 → 캐시도 비움', 'cache');
      return;
    }

    try {
      setLoading(true); // 로딩 on → UI 에 스피너 표시
      addLog('mockFetchUnivMajors() 호출 (300ms 지연)', 'fetch');

      // ② 서버에서 그 대학의 학과 전체를 fetch.
      const majors = await mockFetchUnivMajors(universityId);

      // ③ 받은 raw 데이터를 캐시에 저장 (화면에 안 그림 → ref).
      //    이후 계열 변경 때 서버 재호출 없이 이 캐시만 필터하면 됨.
      cachedMajorsRef.current = majors;
      addLog(`cachedMajorsRef ← 학과 ${majors.length}개 저장`, 'cache');

      // ④ "이 대학에 실제로 존재하는 계열" 만 추려 2단 옵션으로 변환.
      //    Set 으로 중복 제거(예: 인문 학과가 2개여도 '인문'은 1번만) → 전체 후보와 교집합.
      const availableTypeCodes = new Set(majors.map((m) => m.majorTypeCode));
      const filteredTypes = ALL_MAJOR_TYPES.filter((t) =>
        availableTypeCodes.has(t.value),
      );
      setMajorTypeOptions(filteredTypes); // 화면에 그려야 하므로 setState
      addLog(`majorTypeOptions ← 계열 ${filteredTypes.length}개 (set)`, 'state');
    } catch (e) {
      // fetch 실패 시 옵션은 이미 비워진 상태 → 사용자는 다시 선택만 하면 됨.
      console.error('fetch 실패', e);
      addLog('fetch 실패', 'fetch');
    } finally {
      setLoading(false); // 성공/실패와 무관하게 로딩 off
    }
  };

  // ─── 계열 변경 시 트리거 (2단 → 3단) ───
  // [학습] ★ 여기엔 서버 호출이 없다. 이게 캐시를 두는 가장 큰 이유.
  //   같은 대학 안에서 계열을 이리저리 바꿔도 네트워크 왕복 0회 → client 에서 즉시 필터.
  const onMajorTypeChange = (majorTypeCode: string) => {
    addLog(
      `onMajorTypeChange("${majorTypeCode || '∅'}") — 서버 호출 X`,
      'event',
    );
    // 계열이 바뀌면 그 아래 학과 선택은 무효 → majorId 만 리셋 (대학은 그대로 유지).
    setSelected((prev) => ({ ...prev, majorTypeCode, majorId: '' }));

    if (!majorTypeCode) {
      setMajorOptions([]);
      addLog('majorOptions 비움', 'state');
      return;
    }

    // 캐시(cachedMajorsRef)를 선택한 계열로 필터 → 3단(학과) 옵션 모양으로 변환.
    //   majorTypeCode(H/N/A/Z) 가 2단과 3단을 잇는 연결고리임을 여기서 확인할 수 있다.
    const filteredMajors = cachedMajorsRef.current
      .filter((m) => m.majorTypeCode === majorTypeCode)
      .map((m) => ({ value: m.majorId, label: m.majorName }));

    setMajorOptions(filteredMajors);
    addLog(
      `캐시에서 filter → majorOptions ← 학과 ${filteredMajors.length}개`,
      'state',
    );
  };

  // ─── 학과 변경 시 트리거 (3단 = 마지막) ───
  // [학습] 가장 단순. 더 이상 하위 cascade 가 없으니 선택값만 저장하고 끝.
  //   최종 제출은 보통 별도 버튼에서 selected 객체를 통째로 서버에 보낸다.
  const onMajorChange = (majorId: string) => {
    addLog(`onMajorChange("${majorId || '∅'}") — cascade 끝`, 'event');
    setSelected((prev) => ({ ...prev, majorId }));
  };

  const resetAll = () => {
    setSelected({ universityId: '', majorTypeCode: '', majorId: '' });
    setMajorOptions([]);
    setMajorTypeOptions([]);
    cachedMajorsRef.current = [];
    setLogs([]);
  };

  // [학습] hook 의 "공개 API". 컴포넌트는 여기서 받은 것만 쓰면 된다.
  //   - 옵션 3종 + 현재 선택값 → <DropDown> 에 그대로 전달
  //   - 핸들러 3종 → 각 <DropDown> 의 onChange 에 연결
  //   - logs/loading/cachedMajors/resetAll → 학습용 시각화에만 사용
  return {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
    logs,
    loading,
    cachedMajors: cachedMajorsRef.current, // ref 의 현재 내용을 읽기 전용으로 노출 (시각화용)
    resetAll,
  };
}

// ───────────────────────── 4. 화면 조합 ─────────────────────────
// [학습] 컴포넌트가 하는 일은 단 둘:
//   1) hook 호출해서 데이터/핸들러 받기
//   2) 학습용 섹션들(./_learning)에 그 값을 props 로 내려주기
// 화면을 꾸미는 JSX 는 전부 섹션 컴포넌트 안에 있어, 여기선 "흐름" 만 보인다.
export function CascadeDropdownSample() {
  const {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
    logs,
    loading,
    cachedMajors,
    resetAll,
  } = useCascadeDropdowns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <LearningHeader />
        <KeyPointsSection />

        {/* ① 데모 / ② 내부 상태 — 좌우 2단 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DemoSection
            selected={selected}
            universityOptions={universityOptions}
            majorTypeOptions={majorTypeOptions}
            majorOptions={majorOptions}
            onUniversityChange={onUniversityChange}
            onMajorTypeChange={onMajorTypeChange}
            onMajorChange={onMajorChange}
            loading={loading}
            resetAll={resetAll}
          />
          <InternalStateSection
            universityOptions={universityOptions}
            majorTypeOptions={majorTypeOptions}
            majorOptions={majorOptions}
            cachedMajors={cachedMajors}
            logs={logs}
          />
        </div>

        <CodeAnatomySection
          universities={MOCK_UNIVERSITIES}
          majorTypes={ALL_MAJOR_TYPES}
        />
        <FlowSection />
        <StateVsRefSection />
        <IocHintSection />
      </div>
    </div>
  );
}
