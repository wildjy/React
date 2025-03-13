'use client';
import { useState, useEffect } from 'react';
import { ContTable } from "../Layout/ContTable";
import  Table  from "./Table";
import clsx from 'clsx';
import { cn } from "../common/cn";

interface TableTypeRowProps {
  addClass?: string;
  datas: {
    children: {
      title?: string | React.ReactNode;
      label?: string | React.ReactNode;
      th?: boolean;
      width?: string;
      active?: boolean;
      disabled?: boolean;
    }[];
  }[];
}
export const TableTypeRow: React.FC<TableTypeRowProps> = ({ addClass, datas }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ContTable>
      <Table addClass={`${cn('tableTypeRow', addClass)}`}>
        <Table.Colgroup>
          {datas[0].children.map((_, index) =>
            _.width ? (
              <col key={index} width={_.width} />
            ) : (
              <col key={index} className="w-full md:w-auto" style={isDesktop ? { width: `${100 / datas[0].children.length}%` } : {}} />
            )
          )}
        </Table.Colgroup>
        <Table.Tbody tdW="w-full">
          {datas?.map((item, index) => (
            <tr key={index}>
              {item.children.map((obj, i) =>
                obj.th ? (
                  <th key={i} className={clsx({ 'text-gray-400': obj.disabled })}>
                    {obj.title || obj.label}
                  </th>
                ) : (
                  <td key={i} className={clsx({ 'bg-blue-50': obj.active, 'text-gray-400': obj.disabled })}>
                    {obj.title || obj.label}
                  </td>
                )
              )}
            </tr>
          ))}
        </Table.Tbody>
      </Table>
    </ContTable>
  );
};
