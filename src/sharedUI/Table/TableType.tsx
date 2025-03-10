'use client';
import { ContTable } from "../Layout/ContTable";
import  Table  from "./Table";
import clsx from 'clsx';
import { cn } from "../common/cn";

interface TableTypeProps {
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas: {
    children: {
      title?: string | React.ReactNode;
      data?: string | React.ReactNode;
      th?: boolean;
      width?: string;
      active?: boolean;
      disabled?: boolean;
    }[];
  }[];
}

export const TableType: React.FC<TableTypeProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  return (
    <ContTable>
      <Table addClass={`${cn('tableType1', addClass)}`}>
        <Table.Colgroup>
          {datas[0].children?.map((_, index) =>
            _.width ? <col key={index} width={_.width} /> : <col key={index} width={`${100 / datas[0].children.length}%`} />
          )}
        </Table.Colgroup>
        <Table.Thead thW={thW}>
          <tr>
            {datas[0].children?.map((obj, i) => (
              <th key={i} className={clsx({ 'text-gray-400': obj.disabled })}>
                {obj.title}
              </th>
            ))}
          </tr>
        </Table.Thead>
        <Table.Tbody tdW={tdW}>
          {datas?.map((item, index) => (
            <tr key={index}>
              {item.children.map((obj, i) => (
                <td key={i} className={clsx({ 'bg-blue-50': obj.active, 'text-gray-400': obj.disabled })}>
                  {obj.data}
                </td>
              ))}
            </tr>
          ))}
        </Table.Tbody>
      </Table>
    </ContTable>
  );
};
