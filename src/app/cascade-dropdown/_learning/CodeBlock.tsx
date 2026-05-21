/**
 * [학습용 화면 코드] 코드 문자열을 줄번호 + 주석 색상으로 보여주는 뷰어.
 *   주석 줄(//)은 회색, 실행 줄은 초록색으로 칠해 가독성을 높인다.
 */

export function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
      <code>
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const isDivider =
            trimmed.startsWith('// ─') || trimmed.startsWith('// ==');
          const isComment = trimmed.startsWith('//');
          const cls = isDivider
            ? 'text-slate-400'
            : isComment
              ? 'text-slate-500'
              : 'text-emerald-300';
          return (
            <div key={i} className="flex">
              <span className="text-slate-600 w-8 shrink-0 text-right pr-3 select-none">
                {i + 1}
              </span>
              <span className={`${cls} whitespace-pre`}>{line || ' '}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}
