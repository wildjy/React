interface DataTableProps {
  headers: string[]
  rows: React.ReactNode[][]
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 my-3 text-[13px]">
      <table className="w-full border-collapse min-w-max">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-center text-xs font-bold text-gray-700 border-b border-gray-200 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-700 border-b border-gray-100 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
