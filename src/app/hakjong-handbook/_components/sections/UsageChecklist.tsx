/**
 * ✅ 핸드북 사용 체크리스트
 *
 * 새 기능 작업 시 / 막혔을 때 이 핸드북을 어떻게 쓸지.
 */
export function UsageChecklist() {
  return (
    <section id="checklist" className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg shrink-0">
          ✅
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">핸드북 사용 체크리스트</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">막혔다 → 30초 → 적용</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-4">
        <ul className="space-y-3 text-[14px] text-gray-700 leading-7">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold mt-0.5">☐</span>
            <span>
              <strong>시작 전</strong> — "9개 카테고리 한눈에" 표를 보고 작업 진도 위치 확인
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold mt-0.5">☐</span>
            <span>
              <strong>막혔다</strong> — 콘솔 에러 → 🔴 에러 메시지 인덱스 / 작업 상황 → 🟡 키워드 인덱스
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold mt-0.5">☐</span>
            <span>
              <strong>30초 안에 답</strong> — Top 10 안이면 즉시 적용
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold mt-0.5">☐</span>
            <span>
              <strong>Top 10 외</strong> — 📚 원본 Phase 인덱스로 점프
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold mt-0.5">☐</span>
            <span>
              <strong>함정 만났다</strong> — 📌 5대 반복 함정 부록 확인 → "이 모양으로 또 나오겠구나" 다음번 30초
            </span>
          </li>
        </ul>
      </div>

      {/* 관련 문서 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 mb-4">
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">관련 문서</h3>
        <ul className="space-y-2 text-[13px] text-slate-700 leading-7">
          <li>
            <strong>원본 시간순 학습 기록</strong> —{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200">
              hakjong-dev-guide.md
            </code>{' '}
            (34 Phase, SSOT)
          </li>
          <li>
            <strong>학습 페이지(시간순 일기)</strong> —{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200">
              /hakjong-guide
            </code>
          </li>
          <li>
            <strong>실무 핸드북 마크다운</strong> —{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200">
              hakjong-practical-handbook.md
            </code>
          </li>
          <li>
            <strong>동기화 절차</strong> —{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-slate-800 border border-slate-200">
              src/app/hakjong-guide/SYNC.md
            </code>{' '}
            (원본 변경 → 학습 페이지 반영)
          </li>
        </ul>
      </div>
    </section>
  )
}
