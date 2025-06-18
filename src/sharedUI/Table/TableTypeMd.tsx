'use client';
import { ContTable } from "../Layout/ContTable";
import  Table  from "./Table";
import clsx from 'clsx';
import { cn } from "../common/cn";

interface TableTypeMdProps {
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas: {
    children: {
      title?: string | React.ReactNode;
      data?: string | React.ReactNode;
      th?: boolean;
      align?: string;
      width?: string;
      hide?: boolean;
      active?: boolean;
      disabled?: boolean;
    }[];
  }[];
}
export const TableTypeMd: React.FC<TableTypeMdProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  return (
    <ContTable>
      <Table addClass={`${cn('tableTypeMd', addClass)}`}>
        <Table.Colgroup>
          {datas[0].children?.map((_, index) =>
            _.width ? <col key={index} className={`${_.hide && 'hide'}`} width={_.width} /> : <col key={index} className={`${_.hide && 'hide'}`} width={`${100 / datas[0].children.length}%`} />
          )}
        </Table.Colgroup>
        <Table.Thead thW={thW}>
          <tr>
            {datas[0].children?.map((obj, i) => (
              <th key={i} className={clsx(`${obj.hide && 'hide'}`, { 'text-gray-400': obj.disabled })}>
                {obj.title}
              </th>
            ))}
          </tr>
        </Table.Thead>
        <Table.Tbody tdW={tdW}>
          {datas?.map((item, index) => (
            <tr key={index}>
              {item.children.map((obj, i) => (
                <td key={i} className={`${obj.hide && 'hide'} ${cn('text-right md:text-center',  {'bg-blue-50': obj.active, 'text-gray-400': obj.disabled, 'text-left': obj.align === 'left', 'text-right': obj.align === 'right'} )}`}>
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
