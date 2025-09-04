// import { code } from "@hijinhak-front/common"
import { ResultFlag } from "@/sharedUI/Flag/ResultFlag";
import { ResultFlagSummary } from "@/sharedUI/Flag/ResultFlagSummary";
import Table from "../../sharedUI/Table/Table"

interface BeforePassResultTableProps {
  years: string[];
  rows: {
    title?: string;
    datas: (string | { type: string; label: string }[])[];
  }[];
}

export const BeforePassResultTable = ({years, rows} : BeforePassResultTableProps) => {
  return (
    <div className='w-full mt-5 md:px-5'>
      <Table addClass='w-full !border-t-0 text-center'>
        <Table.Colgroup>
          {years.map((_, idx) => (
            <col key={idx} className="w-1/4" />
          ))}
        </Table.Colgroup>
        <Table.Thead>
          <tr>
            <th scope='col' className='py-2 text-sm border-b-0'><b>칸수구분</b></th>
            {years.map((y, idx) => (
              <th key={idx} scope="col" className="py-2 text-sm border-b-0">
                {y}
              </th>
            ))}
          </tr>
        </Table.Thead>
        <Table.Tbody tdW="w-full">
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="py-2 !border-t-[#d9d9d9]">
                <b>{row.title}</b>
              </td>
              {row.datas.map((data, dIdx) => (
                <td key={dIdx} className="py-2">
                  {typeof data === "string" ? (
                    data
                  ) : (
                    <span className="flex items-center justify-center w-full gap-x-2">
                      {data.map((f, fIdx) => (
                        <ResultFlag
                          key={fIdx}
                          mode="badge"
                          type={f.type}
                          label={f.label}
                        />
                      ))}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </Table.Tbody>
      </Table>

      <ResultFlagSummary />
    </div>
  )
}