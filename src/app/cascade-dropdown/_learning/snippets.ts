/**
 * [학습용 화면 코드] "④ 코드 해부" 섹션이 화면에 글자로 보여주는 코드 문자열들.
 *   - 실제 실행 코드가 아니라, 학습자가 읽도록 정리한 발췌본(주석 포함)이다.
 *   - 실행 코드와 자연스럽게 닮게 유지하되, 핵심만 보이도록 군더더기(로그 등)는 뺐다.
 */

export const TYPES_CODE = `// 모든 드롭다운이 공통으로 쓰는 옵션 모양
interface Option {
  label: string;
  value: string;
}

// 서버가 대학 ID 로 돌려주는 응답 모양
interface University {
  universityId: string;
  universityName: string;
  majors: {
    majorId: string;
    majorName: string;
    majorTypeCode: string;
  }[];
}

// IoC 의 핵심 — fetcher 의 함수 시그니처 계약
// 대학 ID 받아 → 계열 옵션 list 를 비동기 반환
type FetchMajorTypesByUniv =
  (universityId: string) => Promise<Option[]>;`;

export const MOCK_FETCH_CODE = `// 실제로는 ky/axios 로 서버 호출
// 여기선 setTimeout 으로 네트워크 지연 흉내만 냄
async function mockFetchUnivMajors(universityId: string) {
  await new Promise(r => setTimeout(r, 300));  // 300ms 지연
  const found = MOCK_UNIVERSITIES.find(
    u => u.universityId === universityId,
  );
  if (!found) throw new Error(\`Univ \${universityId} not found\`);
  return found.majors;
}`;

export const HOOK_SKELETON_CODE = `function useCascadeDropdowns() {
  // ─── 상태 (useState) — 바뀌면 화면 다시 그려야 함 ───
  const [majorTypeOptions, setMajorTypeOptions] = useState<Option[]>([]);
  const [majorOptions,     setMajorOptions]     = useState<Option[]>([]);
  const [selected,         setSelected]         = useState({
    universityId: '', majorTypeCode: '', majorId: '',
  });

  // ─── 캐시 (useRef) — 바뀌어도 화면 안 그려도 됨 ───
  const cachedMajorsRef = useRef<University['majors']>([]);

  // ─── 핸들러 3종 (D 섹션에서 본문 자세히) ───
  const onUniversityChange = async (id: string) => { /* D-1 */ };
  const onMajorTypeChange  = (code: string)     => { /* D-2 */ };
  const onMajorChange      = (id: string)       => { /* D-3 */ };

  return {
    selected,
    universityOptions, majorTypeOptions, majorOptions,
    onUniversityChange, onMajorTypeChange, onMajorChange,
  };
}`;

export const HANDLER_UNIV_CODE = `const onUniversityChange = async (universityId: string) => {
  // 1. 선택값 업데이트 + 하위 cascade 리셋 (이전 선택 무효)
  setSelected({ universityId, majorTypeCode: '', majorId: '' });
  setMajorOptions([]);
  setMajorTypeOptions([]);

  if (!universityId) {
    cachedMajorsRef.current = [];
    return;
  }

  // 2. 서버에서 그 대학의 학과 list fetch
  const majors = await mockFetchUnivMajors(universityId);
  cachedMajorsRef.current = majors;  // ← 캐시 저장 (리렌더 X)

  // 3. 가져온 학과들의 majorTypeCode set 으로
  //    → 그 대학에 존재하는 계열만 옵션화
  const availableTypeCodes = new Set(majors.map(m => m.majorTypeCode));
  const filteredTypes = ALL_MAJOR_TYPES.filter(t =>
    availableTypeCodes.has(t.value),
  );
  setMajorTypeOptions(filteredTypes);
};`;

export const HANDLER_TYPE_CODE = `const onMajorTypeChange = (majorTypeCode: string) => {
  setSelected(prev => ({ ...prev, majorTypeCode, majorId: '' }));

  if (!majorTypeCode) {
    setMajorOptions([]);
    return;
  }

  // 서버 호출 없이 cachedMajorsRef 만 filter ← 캐시의 핵심 가치
  const filteredMajors = cachedMajorsRef.current
    .filter(m => m.majorTypeCode === majorTypeCode)
    .map(m => ({ value: m.majorId, label: m.majorName }));

  setMajorOptions(filteredMajors);
};`;

export const HANDLER_MAJOR_CODE = `const onMajorChange = (majorId: string) => {
  // 하위 cascade 가 없으니 선택값만 저장
  setSelected(prev => ({ ...prev, majorId }));
};`;
