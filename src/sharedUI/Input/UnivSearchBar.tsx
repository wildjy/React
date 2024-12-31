"use client";
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";

interface SearchBarProps {
  addClass?: string;
  addId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: string;
  onClick?: () => void;
  onChange?: () => void;
}

const UnivSearchBar: React.FC<SearchBarProps> = ({
  addClass,
  addId = "",
  label,
  placeholder = "search..",
  disabled,
  readonly,
  onClick,
  onChange,
  ...props
}) => {
  const focusRef = useRef<HTMLInputElement | null>(null);
  const [hide, setHide] = useState(false);
  // console.log(focusRef)

  const HiddenButton = () => {
    setHide((prevHide) => !prevHide);
  }

  const openMouseEvent = (event: MouseEvent) => {
    if(focusRef.current && !focusRef.current.contains(event.target as Node)) {
      // console.log(hide)
      setHide(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {
      document.removeEventListener('mousedown', openMouseEvent);
    }
  }, [])
  return (
    <>

    <div className="w-full relative">
      <input
        ref={focusRef}
        onFocus={HiddenButton}
        type="text"
        className="pe-[2.8rem] px-4 py-3 w-full border border-gray-200 placeholder:text-s rounded-lg"
        id={addId}
        onChange={onChange}
        placeholder={placeholder}
        disabled={!!disabled}
        readOnly={!!readonly}
        {...props}
      />
      <label htmlFor={addId} className={cn('sr-only', addClass)}>
        {label}
      </label>
      {!hide && (
        <button type="button" className={`absolute top-0 bottom-0 right-0
          w-[3rem]
          bg-[length:1.25rem_1.25rem]
          bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_searchbar.svg")]
          bg-center
          bg-no-repeat
          transition-all
          duration-300
        `}>
          <span className='sr-only'>검색</span>
        </button>
      )}
    </div>
    </>
  )
}

export default UnivSearchBar;