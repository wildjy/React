"use client";
import React, {} from 'react';
import { cn } from "../common/cn";

interface ContHalfProps {
  children?: React.ReactNode;
  addClass?: string;
  gap?: string;
}

const ContHalf: React.FC<ContHalfProps> = ({ children, addClass, gap }) => {
  const className = `flex flex-wrap md:flex-nowrap ${gap}`;
  const childrenArray = React.Children.toArray(children); // children을 배열로 변환
  const leftSlot = childrenArray[0] || null; // 첫 번째 콘텐츠(왼쪽 영역)
  const centerSlot = childrenArray[1] || null; // 두 번째 콘텐츠(오른쪽 영역)
  const rightSlot = childrenArray[2] || null; // 두 번째 콘텐츠(오른쪽 영역)

  return (
    <>
        <div className={`${cn(className, addClass)}`}>
          {leftSlot && (
            <div className="grow w-full bg-gray-100">
            { leftSlot }
            </div>
          )}
          {centerSlot && (
            <div className="grow w-full bg-gray-100">
            { centerSlot }
            </div>
          )}
          {rightSlot && (
            <div className="grow w-full bg-gray-100">
            { rightSlot }
            </div>
          )}
        </div>
    </>
  )
}

export default ContHalf;