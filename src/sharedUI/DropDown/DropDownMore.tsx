import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, HTMLAttributes } from 'react';

const iconH = 'h-8';
const PosTop = 'top-8';
const DropDownMoreVariants = cva(`
  w-7 ${iconH} bg-gray-100 bg-right bg-no-repeat
`, {
    variants: {
      icon: {
        base: 'bg-[length:0.25rem] bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_drop_more.svg")]',
        plus: '',
      },
    },
    defaultVariants: {
      icon: 'base',
    }
  }
)

interface DropDownMoreType extends HTMLAttributes<HTMLElement>, VariantProps<typeof DropDownMoreVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

export const DropDownMore: React.FC<DropDownMoreType> = ({ children, icon, addClass, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const className = DropDownMoreVariants ({
    icon: icon as "base" | "plus" | undefined,
  })

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  }

  const OpenMouseEvent = (event: MouseEvent) => {
    if(dropRef.current && !dropRef.current.contains(event.target as Node)) { // true
      /*
      >> 드롭다운이 존재하고, 클릭된 요소가 드롭다운 내부가 아닌 경우에만 조건이 true.

      dropRef.current.contains(event.target as Node)
      DOM 메서드 contains()는 dropRef.current가 event.target을 포함하고 있는지 여부를 반환합니다.
      true : 클릭이 drop 내부에서 발생
      false : 클릭이 drop 외부에서 발생

      console.log(dropRef.current); // true
      console.log(dropRef.current.contains(event.target as Node)); // false
      console.log(!dropRef.current.contains(event.target as Node)); // true
      */
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', OpenMouseEvent);
    return () => {document.removeEventListener('mousedown', OpenMouseEvent)}
  }, []);

  return (
    <>
      <div ref={dropRef} className="flex flex-wrap justify-end relative">
        <button
          className={`${cn(className, addClass)}`}
          onClick={OpenEvent}
          {...props}
        >
          <span className="sr-only">더보기</span>
        </button>
        { isOpen && (
          <div className={`absolute ${PosTop} right-0 z-10`}>
            <div className={`max-h-[10rem] whitespace-pre bg-white border border-gray-300 rounded-lg scroll overflow-hidden overflow-y-auto`}>
              { children }
            </div>
          </div>
        )}
      </div>
    </>
  )
}