import { Callout, IC } from '../../../hakjong-guide/_components/ui/Callout'
import { DataTable } from '../../../hakjong-guide/_components/ui/DataTable'

/**
 * 📌 부록 — 5대 반복 함정
 *
 * 같은 원리가 다른 모양으로 또 나옵니다. 한 번 만났으면 다음번엔 30초 안에 알아채세요.
 */
export function Pitfalls() {
  return (
    <section id="pitfalls" className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg shrink-0">
          📌
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">5대 반복 함정</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">같은 원리, 다른 모양으로 또 나오는 패턴</p>
        </div>
      </div>

      {/* ① 빈 값 깊이 */}
      <PitfallCard num="①" title='"빈 값" 은 한 단어가 아니다 — 깊이 1·2·3'>
        <DataTable
          headers={['깊이', '잡는 것', '도구']}
          rows={[
            ['1', <><IC key="a">undefined</IC>, <IC key="b">null</IC></>, <><IC key="c">??</IC>, <IC key="d">{'||'}</IC></>],
            ['2', <>빈 컨테이너 (<IC key="e">{'[]'}</IC>, <IC key="f">{'{}'}</IC>)</>, <><IC key="g">.length</IC>, <IC key="h">Object.keys(x).length</IC></>],
            ['3', <>의미 없는 값만 (<IC key="i">{"[{title:''}]"}</IC>)</>, <IC key="j">.some(predicate)</IC>],
          ]}
        />
        <p className="text-[13px] text-gray-700 leading-7 mt-2">
          <strong>같은 함정 만난 곳:</strong> Phase 19 (첫 신청자 검증) · Phase 26 (mock fallback) · Phase 34 (모순 조건) · <strong>Top 10 #6</strong>.
        </p>
        <Callout variant="tip">
          <strong>판단법:</strong> "이 데이터가 '비어있다'고 말할 수 있는 경우의 수를 모두 적어보라." 그게 셋이면 깊이 3.
        </Callout>
      </PitfallCard>

      {/* ② 훅 잘못된 자리 */}
      <PitfallCard num="②" title="훅을 잘못된 자리에서 부름">
        <p className="text-[13px] leading-7">
          <strong>금지 위치:</strong> 일반 함수 / async 함수 / 모듈 최상단 / 조건문·반복문 / 서버 함수 / <IC>use*</IC> 접두사 일반 함수
        </p>
        <p className="text-[13px] leading-7">
          <strong>허용 위치:</strong> 함수 컴포넌트 본문 / 커스텀 훅 본문
        </p>
        <p className="text-[13px] leading-7">
          <strong>같은 함정 만난 곳:</strong> Phase 14 (API 파일) · Phase 29 (Next.js 서버 함수) · <strong>Top 10 #2</strong>.
        </p>
        <Callout variant="key">
          <strong>해법:</strong> 값이 필요하면 인자로 받아라. 훅 호출은 훅 안으로.
        </Callout>
      </PitfallCard>

      {/* ③ 옵션 폭증 */}
      <PitfallCard num="③" title="옵션 폭증 — 호출자 책임 미위임">
        <p className="text-[13px] leading-7">
          <strong>증상:</strong> 옵션이 6개 되고 두 옵션 동시 <IC>true</IC> 시 모호한 상황 발생.
        </p>
        <p className="text-[13px] leading-7">
          <strong>원인:</strong> 함수가 호출자의 분기를 대신 떠안음.
        </p>
        <p className="font-semibold text-gray-800 mt-2">해법:</p>
        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-7">
          <li>"켜고 끄기" → <IC>boolean</IC></li>
          <li>"값을 무엇으로" → enum 값 (<IC>{"'INTRO' | 'APPLY'"}</IC>)</li>
          <li>통째로 가져가지 말고 필요한 출처를 직접 호출</li>
        </ul>
        <p className="text-[13px] leading-7 mt-2">
          <strong>같은 함정 만난 곳:</strong> Phase 17 (통째 호출) · Phase 24 (훅 합치기) · Phase 33 (boolean 옵션 폭증) · <strong>Top 10 #8</strong>.
        </p>
      </PitfallCard>

      {/* ④ 타입 OK인데 런타임 어긋남 */}
      <PitfallCard num="④" title="타입은 OK인데 런타임 어긋남 (silent drift)">
        <p className="text-[13px] leading-7">
          <strong>증상:</strong> TS 에러도 없고 린트도 안 잡는데 런타임에 깨짐.
        </p>
        <p className="font-semibold text-gray-800 mt-2">대표 케이스:</p>
        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-7">
          <li>응답 <IC>number</IC> ↔ 요청 <IC>string</IC> → <IC>===</IC> 매칭 실패 (Phase 20)</li>
          <li><IC>&&</IC> 양쪽 조건 모순 → 본문 영원히 실행 안 됨 (Phase 34)</li>
          <li>ky <IC>{'.json<T>()'}</IC>는 검증이 아닌 <strong>타입 단언</strong> — 서버가 다른 형식 줘도 못 잡음</li>
        </ul>
        <p className="text-[13px] leading-7 mt-2">
          <strong>같은 함정 만난 곳:</strong> Phase 20 · Phase 34 · <strong>Top 10 #4, #6</strong>.
        </p>
        <Callout variant="key">
          <strong>해법:</strong> 외부 시스템 경계에서 명시적 정규화 (<IC>String(...)</IC>) 또는 zod 같은 런타임 검증.
        </Callout>
      </PitfallCard>

      {/* ⑤ 두 캐시 */}
      <PitfallCard num="⑤" title='"서버에 같은 데이터 있으면 클라이언트는 임시 뷰일 뿐"'>
        <Callout variant="info">
          <strong>원칙:</strong> 같은 데이터를 클라이언트 캐시(<IC>sessionStorage</IC>)와 서버 두 곳에 두지 마라. 어느 한쪽이 진실의 원천, 다른 쪽은 일시적 뷰.
        </Callout>
        <p className="font-semibold text-gray-800 mt-2">같은 함정 만난 곳:</p>
        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-7">
          <li>Phase 5 (수정하기를 URL params로 시도 → sessionStorage 전환)</li>
          <li>Phase 10 (mock Route → 실 API 연동)</li>
          <li>Phase 18 (sessionStorage 스냅샷 모양)</li>
          <li>Phase 19 (서버 prefetch로 sessionStorage 걷어내기)</li>
          <li>Phase 23 (sessionStorage 플래그 → 서버 진실)</li>
          <li>Phase 32 (server-first display)</li>
        </ul>
        <Callout variant="key">
          <strong>해법:</strong> 서버 API가 갖춰지는 순간 sessionStorage 의존을 <strong>완전히</strong> 걷어내라. 동기화 책임이 모호한 두 캐시는 항상 어디서 어긋난다.
        </Callout>
      </PitfallCard>
    </section>
  )
}

/* 함정 카드 헬퍼 */
function PitfallCard({
  num,
  title,
  children,
}: {
  num: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-5 md:p-6 mb-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
          {num}
        </div>
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2 text-[14px] text-gray-700 leading-7">{children}</div>
    </div>
  )
}
