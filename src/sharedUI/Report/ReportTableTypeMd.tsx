'use client';
import Table from '../Table/Table';
import { cn } from "../common/cn";

interface ReportTableTypeMdProps {
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas?: {
    title?: string | React.ReactNode;
    data?: string | React.ReactNode;
  }[];
}
export const ReportTableTypeMd: React.FC<ReportTableTypeMdProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  return (
    <Table addClass={`${cn('tableTypeMd', addClass)}`}>
      <Table.Colgroup>
        {datas?.map((_, index) => (
          <col key={index} width={`${100 / datas.length}%`} />
        ))}
      </Table.Colgroup>
      <Table.Thead thW={thW}>
        {datas?.map((item, index) => (
          <th key={index}>{item.title}</th>
        ))}
      </Table.Thead>
      <Table.Tbody tdW={tdW}>
        <tr>
          {datas?.map((item, index) => (
            <td key={index}>{item.data}</td>
          ))}
        </tr>
      </Table.Tbody>
    </Table>
  );
};
