'use client';
import { ContTable } from "../Layout/ContTable";
import  Table  from "./Table";
import clsx from 'clsx';
import { cn } from "../common/cn";

type ChildrenItem = {
  title?: string | React.ReactNode;
  data?: string | React.ReactNode;
  th?: boolean;
  align?: string;
  width?: string;
  hide?: boolean;
  addThClass?: string;
  addTdClass?: string;
  active?: boolean;
  activeCustom?: [boolean, string];
  disabled?: boolean;
  disabledCustom?: [boolean, string];
};
interface TableTypeProps {
  double?: boolean;
  addStyle?: string;
  addClass?: string;
  thW?: string;
  tdW?: string;
  datas: {
    children: (ChildrenItem | null)[];
  }[];
}

export const TableType: React.FC<TableTypeProps> = ({ double = false, addStyle, addClass, thW = 'w-1/3', tdW = 'w-2/3', datas }) => {
  const verifiedData = datas.map((item) => {
    const verifiedChildren = item.children.filter((item) => Boolean(item));
    return {
      ...item,
      children: verifiedChildren,
    };
  }) as { children: ChildrenItem[] }[];

  const doubleClass = `py-[0.25rem] h-[3rem] sm:py-2 sm:h-[4.0625rem]`;

  return (
    <ContTable addClass={`${cn('', addStyle)}`}>
      <Table addClass={`${cn('tableType1 flex lg:table', addClass, { double })}`}>
        <Table.Colgroup>
          {verifiedData[0].children?.map((_, index) =>
            _.width ? (
              <col key={index} className={`${_.hide ? 'hide' : ''}`} width={_.width} />
            ) : (
              <col key={index} className={`${_.hide ? 'hide' : ''}`} width={`${100 / verifiedData[0].children.length}%`} />
            )
          )}
        </Table.Colgroup>
        <Table.Thead thW={thW}>
          <tr className={`block lg:table-row`}>
            {verifiedData[0].children?.map((obj, i) => (
              <th
                key={i}
                className={`
                ${cn(
                  [
                    `flex flex-wrap items-center justify-center
                    w-full
                    border-t-0 border-b
                    last:border-b border-r-0
                    lg:w-auto lg:table-cell
                    lg:border-b`,
                  ],
                  obj.addThClass,
                  {
                    hide: obj.hide,
                    [`${doubleClass} lg:h-[5.1rem]`]: double,
                    'text-gray-400': obj.disabled,
                  }
                )}`}
              >
                {obj.title}
              </th>
            ))}
          </tr>
        </Table.Thead>
        <Table.Tbody tdW={tdW} addClass="flex lg:table-row-group">
          {verifiedData
            ?.filter((item) => item.children.some((obj) => obj.data !== undefined && obj.data !== null && obj.data !== ''))
            .map((item, index) => (
              <tr key={index} className="block grow lg:table-row">
                {item.children.map((obj, i) =>
                  obj.data !== undefined && obj.data !== null && obj.data !== '' ? (
                    <td
                      key={i}
                      className={`${cn(
                        [
                          `px-0 md:px-1
                      w-full block items-center border-t-0 border-b
                      border-r-0 last:border-b
                      lg:w-auto lg:table-cell
                      lg:border-b`,
                        ],
                        obj.addTdClass,
                        {
                          hide: obj.hide,
                          [`flex justify-center ${doubleClass}`]: double,
                          'bg-blue-50': obj.active,
                          'text-gray-400': obj.disabled,
                          ...(obj.activeCustom?.[0] ? { [obj.activeCustom[1]]: true } : {}),
                          ...(obj.disabledCustom?.[0] ? { [obj.disabledCustom[1]]: true } : {}),
                          'text-left': obj.align === 'left',
                          'text-right': obj.align === 'right',
                        }
                      )}`}
                    >
                      {obj.data}
                    </td>
                  ) : null
                )}
              </tr>
            ))}
        </Table.Tbody>
      </Table>
    </ContTable>
  );
};
