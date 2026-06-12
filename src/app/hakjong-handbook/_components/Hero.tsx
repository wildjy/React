export function Hero() {
  return (
    <div className="bg-gradient-to-br from-rose-600 via-orange-600 to-amber-600 text-white px-6 py-10 md:px-12 md:py-14">
      {/* 뱃지 */}
      <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[11.5px] font-semibold mb-4">
        실무 핸드북 · 30초 안에 답 찾기
      </span>

      {/* 제목 */}
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
        학종(hakjong) 실무 핸드북
      </h1>
      <p className="text-[14px] text-rose-50 max-w-xl leading-7 mb-6">
        막혔을 때 즉시 답 찾고, 깊이 학습이 필요하면 원본 가이드의 Phase로 점프합니다.
        <br />
        <strong>Top 10 막힘 사전 · 9 작업 카테고리 · 5 반복 함정 · 34 Phase 인덱스</strong>
      </p>

      {/* 입구 3개 */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-[12px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-300 shrink-0" />
          🔴 에러 메시지로
        </div>
        <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-[12px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-yellow-300 shrink-0" />
          🟡 작업 키워드로
        </div>
        <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-[12px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-300 shrink-0" />
          🟢 작업 진도로
        </div>
      </div>
    </div>
  )
}
