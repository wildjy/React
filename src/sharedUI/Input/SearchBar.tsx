"use client";
import React, { useState, useRef, useEffect, forwardRef, ChangeEvent } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";

interface SearchBarProps {
  addClass?: string;
  addId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: string;
  focus?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  onChange?: () => void;
  onSearch: (searchValue: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
    focus,
    addClass,
    addId = "",
    label,
    placeholder = "search..",
    disabled,
    readonly,
    onFocus,
    onChange,
    onSearch,
    ...props
  }, ref) => {

    const [searchValue, setSearchValue] = useState<string>('');

    const SearchChangeEvent = ( e: ChangeEvent<HTMLInputElement> ) => {
      setSearchValue(e.target.value);
    }

    const SearchEvent = () => {
      if(searchValue.trim()) {
        onSearch(searchValue)
      }
    }

    return (
      <>
        <div className="w-full relative">
          <input
            ref={ref}
            onFocus={onFocus}

            type="text"
            className="pe-[2.8rem] px-4 py-3 w-full border border-gray-200 placeholder:text-s rounded-lg"
            id={addId}

            onChange={SearchChangeEvent}

            placeholder={placeholder}
            disabled={!!disabled}
            readOnly={!!readonly}
            {...props}
          />
          <label htmlFor={addId} className={cn('sr-only', addClass)}>
            {label}
          </label>

          {!focus && (
            <button type="button" className={`absolute top-0 bottom-0 right-0
              w-[3rem]
              bg-[length:1.25rem_1.25rem]
              bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_searchbar.svg")]
              bg-center
              bg-no-repeat
              transition-all
              duration-300
            `}
              onClick={SearchEvent}
            >
              <span className='sr-only'>검색</span>
            </button>
          )}
        </div>
      </>
    )
  }
)

export default SearchBar;