

"use client";
import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import StudyBlock  from "../../sharedUI/Study/StudyBlock";
import { DropDown_Score } from "../../sharedUI/DropDown/DropDown_Score";
import { DropDown, DropDownOptionType } from "../../sharedUI/DropDown/DropDown";
// import { CheckBox } from "../../sharedUI/Input/CheckBox";

export interface DropOptionType {
  value: string;
  label: string;
}

export default function WaiStudyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropOptionType | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const options: DropOptionType[] = [
    { value: "1", label: "최신순" },
    { value: "2", label: "인기순" },
    { value: "3", label: "리뷰순" },
  ]

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  }

  const closeDrop = () => {
    setIsOpen(false);
    setFocusIndex(null);
  }

  const selectOption = (option: DropOptionType) => {
    setSelected(option)
    closeDrop();
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(!isOpen) return;

    if(e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      closeDrop();
    }
  }

  useEffect(() => {
    if(focusIndex != null && listRef.current) {
      const optionItem = listRef.current.children[focusIndex] as HTMLElement;
      optionItem?.focus();
      console.log(optionItem)
    }
  }, [focusIndex]);

  return (
    <div>
      <div className="mx-auto px-5 py-5 w-auto xl:w-[1200px]">
        <p className="text-2xl"><b>웹접근성..정리..</b></p>

        <StudyBlock title="1. DropDown">
          <StudyBlock.Pre>
            {`
<div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
  <button onClick={toggleOpen}>선택: {selected?.label}</button>
  {isOpen && (
    <ul role="listbox" ref={listRef} >
      {options.map((option, index) => (
        <li
          key={index}
          role="option"
          aria-selected={selected?.value === option.value}
          tabIndex={0}
          onClick={() => selectOption(option)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectOption(option);
            }
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>
            `}
          </StudyBlock.Pre>
        </StudyBlock>

          <div className="w-1/4"  onKeyDown={handleKeyDown}>
            <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox"
              className="">
              <button onClick={toggleOpen}
                className={`
                  w-full px-4 py-2
                  text-left
                  border border-gray-200
                `}
              >선택: {selected?.label}</button>
              {isOpen && (
                <ul role="listbox" ref={listRef} className={`${isOpen ? 'block' : 'hidden'}`}>
                  {options.map((option, index) => (
                    <li
                      key={index}
                      role="option"
                      aria-selected={selected?.value === option.value}
                      tabIndex={0}
                      onClick={() => selectOption(option)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOption(option);
                        }
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        <DropDown options={[
            { value: "1", label: "최신순" },
            { value: "2", label: "인기순" },
          ]}
        />
      </div>
    </div>
  )
}