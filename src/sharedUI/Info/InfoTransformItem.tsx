import React from 'react';
import Link from "next/link";
import { cn } from "../common/cn";
import { useInfoTransformContext } from "./Provider/InfoTransformProvider";
import { ToolTip } from "../ToolTip/ToolTip";
import { Arrow } from '../Flag/Arrow';

/*
  InfoTransformItem 컴포넌트는 개별 정보 항목을 표시하는 UI 컴포넌트입니다.
  제목, 값, 부가 정보, 화살표 표시, 링크, 툴팁 등을 포함할 수 있습니다.
*/
interface InfoTransformItemProps {
  title: string | { tit: string; sub?: string } | React.ReactNode;
  value: string | React.ReactNode;
  text?: string | React.ReactNode;
  contents?: React.ReactNode;
  arrow?: { value: string | number, arrowType: boolean}
  url?: string;
  index?: number;
  lastIndex?: number | boolean;
  tooltip?: {
    show: boolean | number | number[],
    data?: {title?: string | React.ReactNode, text?: string | React.ReactNode}
  }
  addClass?: string;
}

export const InfoTransformItem: React.FC<InfoTransformItemProps> = ({
  title,
  value,
  text,
  contents,
  arrow,
  url,
  index,
  lastIndex,
  tooltip = {show: false, data: {title: '', text: ''} },
  addClass,
}) => {
  const { type } = useInfoTransformContext();

  const shouldShow = typeof tooltip.show === "boolean"
    ? tooltip.show
    : typeof tooltip.show === "number" && typeof index === "number"
    ? tooltip.show === index
    : Array.isArray(tooltip.show) && typeof index === "number"
    ? tooltip.show.includes(index)
    : lastIndex || false;

  type TitleType = string | React.ReactNode | { tit: string; sub?: string };

  function isObjectTitle(value: TitleType): value is { tit: string; sub?: string } {
    return typeof value === "object" && value !== null && !React.isValidElement(value);
  }

  return (
    <div
      className={`
        ${cn(`flex md:flex-col flex-wrap md:flex-nowrap
          text-xs sm:text-sm text-left md:text-center md:text-base`,
          (type === "rec" || type === 'recBg' || type === 'recLine') && "w-full items-start md:items-center justify-between md:justify-center",
          type === 'rec1' && 'rec1... items-start md:items-center justify-center',
        )}
      `}
    >
      {/* title */}
      <div className={`
        ${cn('md:text-sm lg:text-lg',
          type === "rec" && 'text-gray-500',
          type === "rec1" && 'w-[6.25rem] md:w-auto '
        )}
      `}>
        {url ? <Link href={url} passHref>
          {isObjectTitle(title) ? (
            <span className=''>
              <span>{title.tit}</span>
              <span className='block lg:text-base'>{title.sub}</span>
            </span>
          ): title}
        </Link> : (
        <span className={`flex items-start gap-x-1 text-xs sm:text-md lg:text-lg`}>
          {isObjectTitle(title) ? (
            <span className=''>
              <span>{title.tit}</span>
              <span className='block lg:text-base'>{title.sub}</span>
            </span>
          ) : title}

          {shouldShow && tooltip?.data && (
            <div className="mt-[0.1rem] md:mt-[0.12rem] ml-1">
              <ToolTip align={lastIndex ? 'right' : 'center'}>
                <div className="w-[15rem] text-left">
                  <p className="text-base"><b>{tooltip.data?.title}</b></p>
                  <div className="mt-2 text-sm">{tooltip.data?.text}</div>
                </div>
              </ToolTip>
            </div>
          )}
        </span>
        )}
      </div>

      {/* value */}
      {value && (
        <div className={`
          ${cn('text-right md:text-center',
            type === 'rec1' && 'text-left md:text-center'
          )}
        `}>
          <div className={`
            ${cn('md:mt-3 lg:mt-4 lg:text-xl',
              type === 'rec1' && 'md:mt-4 lg:mt-5 md:mb-3 lg:text-xl'
            )}
          `}>
            <b>
              {url ? (
                <Link href={url} passHref className="underline">
                  {value}
                </Link>
              ) : (
                value
              )}
            </b>
          </div>
          {text && <div className={`${cn('text-gray-400 text-2xs lg:text-sm', type === 'recCustom' && 'w-full')}`}>{text}</div>}
          {arrow && (
            <span className={`
            flex items-center justify-end md:justify-center gap-x-[0.2rem]
            text-2xs lg:text-sm text-gray-400`}>
              (<Arrow type={arrow.arrowType} />{arrow.value})
            </span>
          )}
        </div>
      )}
      {contents && (
        <div className='flex items-center justify-center w-full'>
          {contents}
        </div>
      )}
    </div>
  );
};
