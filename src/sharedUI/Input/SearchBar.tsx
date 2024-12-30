"use client";
import React, {} from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";

interface SearchBarProps {
  addClass?: string;
  addId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: string;
  onChange?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ addClass, addId = "", label, onChange, placeholder = "search..", disabled, readonly, ...props }) => {
  return (
    <>

    <div className="w-full relative">
      <input
        type="text"
        className="pe-[2.8rem] px-4 py-3 w-full border border-gray-200 placeholder:text-s rounded-lg"
        id={addId}
        onChange={onChange}
        placeholder={label}
        disabled={!!disabled}
        readOnly={!!readonly}
        {...props}
      />
      <label htmlFor={addId} className={cn('sr-only', addClass)}>
        {label}
      </label>
      <button type="button" className={`absolute top-0 bottom-0 right-0
        w-[3rem]
        bg-[length:1.5rem_1.5rem]
        bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_searchbar.svg")]
        bg-center
        bg-no-repeat
        transition-all
        duration-300
      `}>
      <span className='sr-only'>검색</span>
      </button>
    </div>
    </>
  )
}

export default SearchBar;