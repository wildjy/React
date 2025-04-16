'use client';
import { useState, useEffect } from 'react';
import { ContTable } from "../Layout/ContTable";
import  TableTr  from "./TableTr";
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
      thCol?: number;
      thRow?: number;
      col?: number;
      row?: number;
      width?: string | { pc?: string; m?: string }[];
      hide?: boolean;
      align?: string;
      active?: boolean;
      activeCustom?: [boolean, string];
      addThClass?: string;
      addTdClass?: string;
      disabled?: boolean;
      disabledCustom?: [boolean, string];
    }[];
  }[];
}

export const TableBaseTr: React.FC<TableBaseProps> = ({ addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (datas.length === 0) return null;

  const hasThRowSpan = datas.some((row) => row.children.some((cell) => typeof cell.thRow === 'number' && cell.thRow > 1));
  const hasRowSpan = datas.some((row) => row.children.some((cell) => typeof cell.row === 'number' && cell.row > 1));

  return (
    <ContTable>
    <TableTr addClass={`${cn('tableBase', addClass)}`}>
      <TableTr.Colgroup>
        {datas[0].children?.map((_, index) => {
          let colWidth = 'auto';
          let colPcWidth = 'auto';

          if (Array.isArray(_.width) && _.width.length > 0) {
            colWidth = _.width[0]?.m || 'auto';
            colPcWidth = _.width[0]?.pc || 'auto';
          } else if (typeof _.width === 'string') {
            colWidth = colPcWidth = _.width;
          }

          return _.width ? (
            <col key={index} className={`${_.hide && 'hide'}`} width={isDesktop ? colPcWidth : colWidth} />
          ) : (
            <col key={index} className={`${_.hide && 'hide'} w-full md:w-auto`} style={{ width: `${100 / datas[0].children.length}%` }} />
          );
        })}
      </TableTr.Colgroup>
      <TableTr.Thead thW={thW}>
        {datas.map((row, rowIndex) => {
          const visibleCells = row.children.filter((cell) => cell.title !== undefined);

          if (visibleCells.length === 0) return null;

          let usedCols = 0;
          const cellsToRender: typeof visibleCells = [];

          for (const cell of visibleCells) {
            const colSpan = cell.thCol ?? 1;
            if (usedCols >= visibleCells.length) break; // 이미 다 찼으면 렌더 중단
            cellsToRender.push(cell);
            usedCols += colSpan;
          }

          return (
            <tr key={rowIndex}>
              {cellsToRender.map((obj, i) => (
                <th
                  key={i}
                  colSpan={obj.thCol ?? 1}
                  rowSpan={obj.thRow ?? 1}
                  className={`${obj.hide ? 'hide' : ''} ${cn(``, obj.addThClass, {
                    'py-2': hasThRowSpan,
                    'text-gray-400': obj.disabled,
                    'text-left': obj.align === 'left',
                    'text-right': obj.align === 'right',
                  })}`}
                >
                  {obj.title}
                </th>
              ))}
            </tr>
          );
        })}
      </TableTr.Thead>
      <TableTr.Tbody tdW={tdW}>
          {datas
            ?.filter((item) => item.children.some((obj) => obj.data !== undefined && obj.data !== null && obj.data !== ''))
            .map((item, index) => {
              const visibleCells = item.children.filter((cell) => {
                return cell.data !== undefined || cell.data !== null;
              });

              if (visibleCells.length === 0) return null;

              let usedCols = 0;
              const cellsToRender: typeof visibleCells = [];

              for (const cell of visibleCells) {
                const colSpan = cell.col ?? 1;
                if (usedCols >= visibleCells.length) break; // 이미 다 찼으면 렌더 중단
                cellsToRender.push(cell);
                usedCols += colSpan;
              }

              return (
                <tr key={index}>
                  {cellsToRender.map((obj, i) => (
                    <td
                      key={i}
                      colSpan={obj.col ?? 1}
                      rowSpan={obj.row ?? 1}
                      className={`${obj.hide ? 'hide' : ''} ${cn('px-0 lg:px-3', obj.addTdClass, {
                        'py-2': hasRowSpan,
                        'bg-blue-50': obj.active,
                        'text-gray-400': obj.disabled,
                        ...(obj.activeCustom?.[0] ? { [obj.activeCustom[1]]: true } : {}),
                        ...(obj.disabledCustom?.[0] ? { [obj.disabledCustom[1]]: true } : {}),
                        'px-1 text-left': obj.align === 'left',
                        'px-1 text-right': obj.align === 'right',
                        'border-l first:border-l-0 border-r last:border-r-0': obj.row,
                      })}`}
                    >
                      {obj.data}
                    </td>
                  ))}
                </tr>
              );
            })}
      </TableTr.Tbody>
    </TableTr>
    </ContTable>
  );
};
