interface CodeBlockProps {
  code: string
  lang?: string
  path?: string
}

export function CodeBlock({ code, lang, path }: CodeBlockProps) {
  return (
    <div className="rounded-lg overflow-hidden my-3 text-[12.5px]">
      {path && (
        <div className="bg-[#181825] px-4 py-1.5 font-mono text-[11px] text-[#6c7086] border-b border-white/10">
          📁 {path}
        </div>
      )}
      <div className="relative bg-[#1e1e2e] overflow-x-auto">
        {lang && (
          <span className="absolute top-2.5 right-3 text-[10px] text-[#6c7086] uppercase font-semibold font-mono z-10">
            {lang}
          </span>
        )}
        <pre className="text-[#cdd6f4] font-mono text-[12.5px] leading-7 whitespace-pre px-4 py-4 overflow-x-auto">
          {code}
        </pre>
      </div>
    </div>
  )
}
