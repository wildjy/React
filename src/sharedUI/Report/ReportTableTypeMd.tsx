'use client';
import Table from '../Table/Table';
import { cn } from "../common/cn";

interface ReportTableTypeMdProps {
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas: {
    children: {
      title?: string | React.ReactNode;
      data?: string | React.ReactNode;
      th?: boolean;
      width?: string;
    }[];
  }[];
}
export const ReportTableTypeMd: React.FC<ReportTableTypeMdProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  return (
    <Table addClass={`${cn('tableTypeMd', addClass)}`}>
      <Table.Colgroup>
        {datas[0].children?.map((_, index) =>
          _.width ? <col key={index} width={_.width} /> : <col key={index} width={`${100 / datas[0].children.length}%`} />
        )}
      </Table.Colgroup>
      <Table.Thead thW={thW}>
        {datas[0].children?.map((obj, i) => (
          <th key={i}>{obj.title}</th>
        ))}
      </Table.Thead>
      <Table.Tbody tdW={tdW}>
        {datas?.map((item, index) => (
          <tr key={index}>
            {item.children.map((obj, i) => (
              <td key={i}>{obj.data}</td>
            ))}
          </tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
