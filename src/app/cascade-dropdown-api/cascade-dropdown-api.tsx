'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Cascade Dropdown — "단계마다 독립 API" 버전 (대학 → 계열 → 학과)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 실제 API 응답 스키마를 그대로 반영한 버전.
 *
 *   1) 대학 API           → [{ univCode, univName }]
 *   2) 계열 API(univCode) → [{ aiBdPartCode, aiBdPart }]
 *   3) 학과 API(univCode, aiBdPart) → [{ majorIdHsb, majorName }]
 *
 * ★ 학습 포인트
 *   - API 응답 필드명(univCode, aiBdPart, majorIdHsb…)과 UI 가 원하는 모양({value,label})은 다르다.
 *     → hook 안에서 "DTO → Option 변환" 을 한 번 거친다. 이 변환 지점이 실무에서 늘 생기는 부분.
 *   - 계열을 고르면 학과 API 가 또 호출된다 (캐시 필터가 아님).
 *   - 학과 API 는 univCode + aiBdPart 둘 다 필요 → 직전 univCode 를 selected 에 들고 있어야 한다.
 *   - 빠르게 바꾸면 응답이 뒤섞일 수 있어(race) "마지막 요청만 반영" 가드를 둔다.
 */

import { useEffect, useRef, useState } from 'react';
import { DropDown } from '../../sharedUI/DropDown/DropDown';

// ───────────────────────── 1. 타입 ─────────────────────────

// 드롭다운(UI)이 원하는 모양.
interface Option {
  value: string;
  label: string;
}

// 서버 API 가 실제로 돌려주는 응답(DTO) 모양 — 위 캡처 스키마 그대로.
interface UniversityDto {
  univCode: string;
  univName: string;
}
interface MajorTypeDto {
  aiBdPartCode: string;
  aiBdPart: string;
}
interface MajorDto {
  majorIdHsb: string;
  majorName: string;
}

// ───────────────────────── 2. 가짜 서버 (3개의 독립 엔드포인트) ─────────────────────────
//
// 실제로는 백엔드 DB. 클라이언트는 아래 3개 함수(=3개 API)로만 접근하고,
// 각 함수는 위에서 정의한 DTO 모양 그대로 응답한다.
const SERVER_DB = [
  {
    univCode: '0001',
    univName: '서울대학교',
    majorTypes: [
      {
        aiBdPartCode: '인문',
        aiBdPart: '인문',
        majors: [
          { majorIdHsb: '12345', majorName: '컴퓨터공학과' },
          { majorIdHsb: '12346', majorName: '전자공학과' },
        ],
      },
      {
        aiBdPartCode: '자연',
        aiBdPart: '자연',
        majors: [
          { majorIdHsb: '12347', majorName: '물리학과' },
          { majorIdHsb: '12348', majorName: '생명과학과' },
        ],
      },
    ],
  },
  {
    univCode: '0002',
    univName: '연세대학교',
    majorTypes: [
      {
        aiBdPartCode: '인문',
        aiBdPart: '인문',
        majors: [{ majorIdHsb: '22345', majorName: '영문학과' }],
      },
      {
        aiBdPartCode: '자율',
        aiBdPart: '자율',
        majors: [{ majorIdHsb: '22346', majorName: '자유전공학부' }],
      },
    ],
  },
];

// 네트워크 지연 흉내 (실제론 ky/axios 왕복 시간).
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// [API 1] 대학 목록. 파라미터 없음. → [{ univCode, univName }]
async function apiFetchUniversities(): Promise<UniversityDto[]> {
  await delay(300);
  return SERVER_DB.map((u) => ({ univCode: u.univCode, univName: u.univName }));
}

// [API 2] 계열 목록. univCode 를 받음. → [{ aiBdPartCode, aiBdPart }]
async function apiFetchMajorTypes(univCode: string): Promise<MajorTypeDto[]> {
  await delay(300);
  const univ = SERVER_DB.find((u) => u.univCode === univCode);
  if (!univ) throw new Error(`univ ${univCode} not found`);
  return univ.majorTypes.map((t) => ({
    aiBdPartCode: t.aiBdPartCode,
    aiBdPart: t.aiBdPart,
  }));
}

// [API 3] 학과 목록. univCode + aiBdPart 를 받음. → [{ majorIdHsb, majorName }]
async function apiFetchMajors(
  univCode: string,
  aiBdPart: string,
): Promise<MajorDto[]> {
  await delay(300);
  const univ = SERVER_DB.find((u) => u.univCode === univCode);
  const type = univ?.majorTypes.find((t) => t.aiBdPart === aiBdPart);
  if (!type) throw new Error(`type ${univCode}/${aiBdPart} not found`);
  return type.majors.map((m) => ({
    majorIdHsb: m.majorIdHsb,
    majorName: m.majorName,
  }));
}

// ───────────────────────── 3. Hook ─────────────────────────

function useCascadeApi() {
  // 각 단계의 옵션 목록 (화면에 그리므로 useState). DTO 가 아니라 변환된 Option 을 담는다.
  const [universityOptions, setUniversityOptions] = useState<Option[]>([]);
  const [majorTypeOptions, setMajorTypeOptions] = useState<Option[]>([]);
  const [majorOptions, setMajorOptions] = useState<Option[]>([]);

  // 현재 선택값(=다음 API 에 보낼 코드들). 학과 API 가 univCode 를 다시 쓰므로 보관해 둔다.
  const [selected, setSelected] = useState({
    univCode: '', // 대학 API value
    aiBdPart: '', // 계열 API value (학과 API 의 두 번째 인자)
    majorIdHsb: '', // 학과 API value (최종)
  });

  // 단계별 로딩 — 계열/학과도 fetch 라서 각각 로딩이 생긴다.
  const [loading, setLoading] = useState({
    universities: false,
    majorTypes: false,
    majors: false,
  });

  // [race 가드] 요청마다 번호를 매겨, "내가 마지막 요청일 때만" 결과를 반영한다.
  const typeReqId = useRef(0);
  const majorReqId = useRef(0);

  // 페이지 진입 시 대학 목록 1회 로드 → DTO 를 Option 으로 변환해서 저장.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading((l) => ({ ...l, universities: true }));
      try {
        const dtos = await apiFetchUniversities();
        if (alive) {
          setUniversityOptions(
            dtos.map((u) => ({ value: u.univCode, label: u.univName })),
          );
        }
      } finally {
        if (alive) setLoading((l) => ({ ...l, universities: false }));
      }
    })();
    return () => {
      alive = false; // 언마운트 후 setState 방지
    };
  }, []);

  // ─── 대학 변경 → 계열 API 호출 ───
  const onUniversityChange = async (univCode: string) => {
    // 하위(계열·학과) 전부 리셋. 응답 대기 중에 잘못된 조합이 남지 않게 즉시 비운다.
    setSelected({ univCode, aiBdPart: '', majorIdHsb: '' });
    setMajorTypeOptions([]);
    setMajorOptions([]);

    if (!univCode) return;

    const myReq = ++typeReqId.current;
    setLoading((l) => ({ ...l, majorTypes: true }));
    try {
      const dtos = await apiFetchMajorTypes(univCode);
      if (myReq !== typeReqId.current) return; // 더 최신 요청이 있으면 버림
      // 변환: { aiBdPartCode, aiBdPart } → { value, label }
      //   학과 API 가 aiBdPart 를 받으므로 value = aiBdPart 로 잡는다.
      setMajorTypeOptions(
        dtos.map((t) => ({ value: t.aiBdPart, label: t.aiBdPart })),
      );
    } catch (e) {
      console.error(e);
    } finally {
      if (myReq === typeReqId.current) {
        setLoading((l) => ({ ...l, majorTypes: false }));
      }
    }
  };

  // ─── 계열 변경 → 학과 API 호출 (★ 캐시 버전엔 없던 fetch) ───
  const onMajorTypeChange = async (aiBdPart: string) => {
    // 학과 API 는 univCode 도 필요 → selected 에 보관해 둔 직전 값을 사용.
    const { univCode } = selected;

    setSelected((prev) => ({ ...prev, aiBdPart, majorIdHsb: '' }));
    setMajorOptions([]);

    if (!aiBdPart || !univCode) return;

    const myReq = ++majorReqId.current;
    setLoading((l) => ({ ...l, majors: true }));
    try {
      const dtos = await apiFetchMajors(univCode, aiBdPart); // 두 코드를 함께 전달
      if (myReq !== majorReqId.current) return;
      // 변환: { majorIdHsb, majorName } → { value, label }
      setMajorOptions(
        dtos.map((m) => ({ value: m.majorIdHsb, label: m.majorName })),
      );
    } catch (e) {
      console.error(e);
    } finally {
      if (myReq === majorReqId.current) {
        setLoading((l) => ({ ...l, majors: false }));
      }
    }
  };

  // ─── 학과 변경 → 끝. 선택값(majorIdHsb)만 저장 ───
  const onMajorChange = (majorIdHsb: string) => {
    setSelected((prev) => ({ ...prev, majorIdHsb }));
  };

  return {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    loading,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
  };
}

// ───────────────────────── 4. 화면 ─────────────────────────

export function CascadeDropdownApiSample() {
  const {
    selected,
    universityOptions,
    majorTypeOptions,
    majorOptions,
    loading,
    onUniversityChange,
    onMajorTypeChange,
    onMajorChange,
  } = useCascadeApi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
              3-API Cascade
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-700">
              단계마다 fetch
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cascade Dropdown — 단계별 독립 API 버전
          </h1>
          <p className="text-slate-600 mt-2 leading-relaxed">
            대학을 고르면 <b>계열 API(univCode)</b>, 계열을 고르면{' '}
            <b>학과 API(univCode + aiBdPart)</b> 가 호출됩니다. 응답 DTO 는 hook
            에서 <b>{'{ value, label }'}</b> 로 변환되어 드롭다운에 들어갑니다.
          </p>
        </header>

        {/* API 응답 스키마 안내 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            API 응답 스키마
          </h2>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            <SchemaCard
              title="대학"
              api="GET /universities"
              fields="univCode · univName"
              sample={`[{ "univCode": "0001",\n   "univName": "서울대학교" }]`}
            />
            <SchemaCard
              title="계열"
              api="GET /majorTypes?univCode"
              fields="aiBdPartCode · aiBdPart"
              sample={`[{ "aiBdPartCode": "인문",\n   "aiBdPart": "인문" }]`}
            />
            <SchemaCard
              title="학과"
              api="GET /majors?univCode&aiBdPart"
              fields="majorIdHsb · majorName"
              sample={`[{ "majorIdHsb": "12345",\n   "majorName": "컴퓨터공학과" }]`}
            />
          </div>
        </section>

        {/* 데모 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <Field
            step="1"
            label="대학"
            api="apiFetchUniversities()"
            loading={loading.universities}
          >
            <DropDown
              options={universityOptions}
              value={selected.univCode || null}
              onChange={(o) => onUniversityChange(o.value)}
              label="— 대학 선택 —"
            />
          </Field>

          <Field
            step="2"
            label="계열"
            api="apiFetchMajorTypes(univCode)"
            loading={loading.majorTypes}
          >
            <DropDown
              options={majorTypeOptions}
              value={selected.aiBdPart || null}
              onChange={(o) => onMajorTypeChange(o.value)}
              disabled={majorTypeOptions.length === 0}
              label="— 계열 선택 —"
            />
          </Field>

          <Field
            step="3"
            label="학과"
            api="apiFetchMajors(univCode, aiBdPart)"
            loading={loading.majors}
          >
            <DropDown
              options={majorOptions}
              value={selected.majorIdHsb || null}
              onChange={(o) => onMajorChange(o.value)}
              disabled={majorOptions.length === 0}
              label="— 학과 선택 —"
            />
          </Field>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-2">
              현재 selected (다음 API 로 보낼 코드들)
            </div>
            <pre className="text-xs text-emerald-300 font-mono">
              {JSON.stringify(selected, null, 2)}
            </pre>
          </div>
        </section>

        {/* 캐시 버전과의 차이 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            캐시 버전과 무엇이 다른가
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>
                <b>계열 선택 = 또 한 번의 fetch.</b> 캐시 버전은 받아둔 데이터를
                client 에서 필터했지만, 여기선 학과 목록을 서버에서 새로 받는다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>
                <b>DTO → Option 변환.</b> API 응답 필드(univCode/aiBdPart/
                majorIdHsb)를 드롭다운용{' '}
                <code className="bg-slate-100 px-1 rounded">
                  {'{ value, label }'}
                </code>{' '}
                로 hook 에서 매핑한다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>
                <b>univCode 보관 + 단계별 로딩 + race 가드.</b> 학과 API 가
                univCode 를 다시 요구하고, fetch 가 여러 곳이라 로딩이 단계마다
                필요하며, 빠른 재선택 시 요청 번호(useRef)로 마지막 응답만
                반영한다.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// API 응답 스키마 1개를 보여주는 카드.
function SchemaCard({
  title,
  api,
  fields,
  sample,
}: {
  title: string;
  api: string;
  fields: string;
  sample: string;
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-100 px-3 py-2">
        <div className="font-bold text-slate-900">{title}</div>
        <code className="text-[11px] text-slate-500">{api}</code>
      </div>
      <div className="p-3">
        <div className="text-slate-500 mb-1">{fields}</div>
        <pre className="bg-slate-950 text-emerald-300 rounded p-2 text-[11px] font-mono whitespace-pre overflow-x-auto">
          {sample}
        </pre>
      </div>
    </div>
  );
}

// 단계 번호 + 어떤 API 가 도는지 라벨 + 로딩 표시를 묶은 작은 래퍼.
function Field({
  step,
  label,
  api,
  loading,
  children,
}: {
  step: string;
  label: string;
  api: string;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
            {step}
          </span>
          {label}
        </span>
        <code className="text-xs text-slate-400">{api}</code>
      </div>
      {children}
      {loading && (
        <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1 pl-1">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          API 호출 중...
        </div>
      )}
    </div>
  );
}
