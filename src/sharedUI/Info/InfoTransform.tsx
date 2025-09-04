
'use client';
import React from 'react';
import { Arrow } from '../Flag/Arrow';
import { ToolTip } from "../ToolTip/ToolTip";
import { cn } from "../common/cn";

export interface  InfoTransformItemType {
  title: string | { tit: string; sub?: string } | React.ReactNode;
  score?: string | React.ReactNode | [string, boolean] | [string, string];
  text?: [];
  arrow?:
    | { value: string | number; arrowType: boolean }
    | [
        { value: string | number; arrowType: boolean },
        { value: string | number; arrowType: boolean }
      ];
  subScore?: string | React.ReactNode;
  action?: () => void;
  tooltip?: {
    // show: boolean | number | number[],
    title?: string | React.ReactNode,
    text?: string | React.ReactNode
  }
}

type typeMode = 'col' | 'row' | 'type1' | undefined;

interface InfoTransformProps {
  datas: InfoTransformItemType[],
  type?: typeMode;
  mark?: {
    show?: boolean, //
    label?: string,
    hideIndex?: number | number[]
  };
}

export const InfoTransform: React.FC<InfoTransformProps> = ({
  type = 'col',
  datas ,
  mark = {},
}) => {
  if (!datas) return null;
  const { show = true, label = '점', hideIndex } = mark;

  type TitleType = string | React.ReactNode | { tit: string; sub?: string };

  function isObjectTitle(value: TitleType): value is { tit: string; sub?: string } {
    return typeof value === "object" && value !== null && !React.isValidElement(value);
  }

  return (
    <ul className="md:flex text-2xs sm:text-sm md:text-base xl:text-lg md:justify-between md:items-start">
      {datas.map((item, index) => {
        const isHidden = Array.isArray(mark.hideIndex) ? mark.hideIndex.includes(index) : mark.hideIndex === index;

        const lastIndex = datas.length - 1

        return (
          <li
            key={index}
            className={`
              ${cn(`pt-4 md:pt-0 flex-0 flex flex-wrap md:justify-start md:gap-x-10 items-center text-center`,
              type === 'col' && 'flex-1 justify-between',
              type === 'row' && 'justify-between',
              type === 'type1' && 'flex-1 md:text-center md:justify-center',
              item.subScore && 'items-start justify-between',
            )}`}
          >
            <div
              className={cn(
                `text-gray-500 border-gray-100`,
                type === 'col' && 'md:block md:w-full md:pb-2 md:border-b',
                type === 'type1' && 'flex-1 md:flex-none md:block md:w-full md:pb-2 md:border-b',
                item.action && 'hover:underline cursor-pointer',
              )}
              onClick={() => item.action?.()}
            >

              <span className={`${cn('flex items-start justify-center gap-x-1 ',
                type === 'type1' && 'justify-start md:justify-center',
              )}`}>
                <span className='text-xs sm:text-md lg:text-lg'>
                  {isObjectTitle(item.title) ? (
                    <span className={`${!item.title.sub ? 'md:flex md:items-center md:justify-center md:h-[2.7713rem] lg:h-[3.0381rem]' : ''}`}>
                      <span className=''>{item.title.tit}</span>
                      <span className="block lg:text-base">
                        {item.title.sub}
                      </span>
                    </span>
                  ) : (
                    item.title
                  )}
                </span>

                {item.tooltip && (
                  <div className="ml-1 mt-[0.1rem] md:mt-[0.12rem]">
                    <ToolTip align={index === lastIndex ? 'right' : 'center'}>
                      <div className="w-[15rem] text-left">
                        <p className="text-base"><b>{item.tooltip?.title}</b></p>
                        <div className="mt-2 text-sm">{item.tooltip?.text}</div>
                      </div>
                    </ToolTip>
                  </div>
                )}
              </span>
            </div>

            <div className={`${cn('flex justify-center ',
              type === 'col' && 'md:w-full md:min-h-[4.375rem] md:items-center md:content-center',
              type === 'row' && 'mt-0',
              type === 'type1' && 'flex-1 md:flex-none gap-x-2 md:block md:justify-center ',
            )}`}>
              {Array.isArray(item.score) && item.score ? (
                <>
                  {item.score.map((score, idx) => (
                    <p
                      key={idx}
                      className={`
                        md:flex flex-wrap md:items-center md:content-center
                        grow md:h-[4.375rem]
                        text-right md:text-center
                      `}
                    >
                      <span className={`${cn('md:w-full', item.action && 'underline cursor-pointer',)}`} onClick={() => item.action?.()}>
                        <span className={`${index === 0 ? '' : 'font-semi'}`}>{score}</span>{show && !isHidden && label}
                      </span>

                      {Array.isArray(item.arrow) && item.arrow[idx] && (
                        <span className={`
                          md:w-full flex items-center justify-end md:justify-center
                          gap-x-[0.2rem] text-gray-400 text-2xs lg:text-sm
                        `}>
                          (<Arrow type={item.arrow[idx].arrowType} />{item.arrow[idx].value})
                        </span>
                      )}
                    </p>
                  ))}
                </>
              ) : (
                <span className=''>
                  <b
                    className={`${cn('', item.action && 'underline cursor-pointer',)}`}
                    onClick={() => item.action?.()}
                  >
                    {Array.isArray(item.score) ? item.score[0] : item.score}
                  </b>
                  {show && !isHidden && label}
                  {!Array.isArray(item.arrow) && item.arrow && (
                    <span className={`md:w-full flex items-center justify-end md:justify-center gap-x-[0.2rem] text-gray-400 text-2xs lg:text-sm`}>
                      (<Arrow type={item.arrow?.arrowType} />{item.arrow?.value})
                    </span>
                  )}
                  {item.subScore && (
                    <span className={`py-1 flex flex-col text-2xs sm:text-xs md:text-md text-gray-500 `}>
                      {item.subScore}
                    </span>
                  )}
                </span>

                // index === datas.length - 1 && Array.isArray(item.score) ? (
                //   <>
                //     <b className="flex items-center gap-0.5">
                //       {item.score?.[0] === '-' ? null : (
                //         <Arrow type={item.score?.[1]} />
                //       )}
                //       {item.score?.[0]}
                //     </b>
                //     {show && !isHidden && label}
                //   </>
                // ) : (
                //   <span className=''>
                //     <b>{Array.isArray(item.score) ? item.score[0] : item.score}</b>
                //     {show && !isHidden && label}
                //     {!Array.isArray(item.arrow) && item.arrow && (
                //       <span className={`md:w-full flex items-center justify-end md:justify-center gap-x-[0.2rem] text-gray-400 text-2xs lg:text-sm`}>
                //         (<Arrow type={item.arrow?.arrowType} />{item.arrow?.value})
                //       </span>
                //     )}
                //     {item.subScore && (
                //       <span className={`py-1 flex flex-col text-2xs sm:text-xs md:text-md text-gray-500 `}>
                //         {item.subScore}
                //       </span>
                //     )}
                //   </span>
                // )
              )}
            </div>
          </li>
        )
      })}
    </ul>

  )
}