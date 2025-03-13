'use client';
import { useState, useEffect } from 'react';
import { ContTable } from "../Layout/ContTable";
import  Table  from "./Table";
import clsx from 'clsx';
import { cn } from "../common/cn";

interface TableBaseProps {
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas: {
    children: {
      title?: string | React.ReactNode;
      data?: string | React.ReactNode;
      th?: boolean;
      row?: number;
      width?: string | { pc?: string; m?: string }[];
      align?: string;
      active?: boolean;
      disabled?: boolean;
    }[];
  }[];
}

export const TableBase: React.FC<TableBaseProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (datas.length === 0) return null;
  return (
    <ContTable>
      <Table addClass={`${cn('tableBase', addClass)}`}>
        <Table.Colgroup>
          {datas[0].children?.map((_, index) => {
            let colWidth = 'auto'; // 기본값 설정
            let colPcWidth = 'auto';

            if (Array.isArray(_.width) && _.width.length > 0) {
              colWidth = _.width[0]?.m || 'auto';
              colPcWidth = _.width[0]?.pc || 'auto';
            } else if (typeof _.width === 'string') {
              colWidth = colPcWidth = _.width;
            }

            return _.width ? (
              <col key={index} width={isDesktop ? colPcWidth : colWidth} />
            ) : (
              <col key={index} className="w-full md:w-auto" style={{ width: `${100 / datas[0].children.length}%` }} />
            );
          })}
        </Table.Colgroup>
        <Table.Thead thW={thW}>
          {datas[0].children?.map((obj, i) => (
            <th
              key={i}
              className={clsx({ 'text-gray-400': obj.disabled, 'text-left': obj.align === 'left', 'text-right': obj.align === 'right' })}
            >
              {obj.title}
            </th>
          ))}
        </Table.Thead>
        <Table.Tbody tdW={tdW}>
          {datas.map((item, index) => (
            <tr key={index}>
              {item.children?.map((obj, i) => (
                <td
                  key={i}
                  rowSpan={obj.row}
                  className={clsx({
                    'bg-blue-50': obj.active,
                    'text-gray-400': obj.disabled,
                    'text-left': obj.align === 'left',
                    'border-l first:border-l-0 border-r': obj.row,
                  })}
                >
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
