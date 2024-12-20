import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, HTMLAttributes } from 'react';

const DropDownMoreVariants = cva(`
  w-7 h-8 bg-gray-100 bg-right bg-no-repeat
`, {
    variants: {
      icon: {
        base: 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_drop_more.svg")]',
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

const DropDownMore: React.FC<DropDownMoreType> = ({ children, icon, addClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropRef = useRef(null);

  const className = DropDownMoreVariants ({
    icon: icon as "base" | "plus" | undefined,
  })

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  }
  return (
    <>
      <div ref={dropRef} className="relative">
        <button
          className={`${cn(className, addClass)}`}
          onClick={OpenEvent}
        >
          <span className="sr-only">더보기</span>
        </button>
        { isOpen && (
          <div className={`absolute right-0 z-10`}>
            <div className={`max-h-[10rem] whitespace-pre bg-white border border-gray-300 rounded-lg scroll overflow-hidden overflow-y-auto`}>
              { children }
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DropDownMore;