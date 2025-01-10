"use client";
import React, { useState, useRef, useEffect } from "react";
import { SearchBar } from "../../sharedUI/Input/SearchBar"
import UnivSearchBar from "../../sharedUI/Input/UnivSearchBar"
import { DropDown } from "../../sharedUI/DropDown/DropDown"
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const SearchBarPage = () => {

  const dropOptions = {
    dropOption1: [
      { value: "1", label: "옵션옵션옵1-1" },
      { value: "2", label: "옵션 1-2" },
      { value: "3", label: "옵션 1-3" },
    ],
  }

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: false,
  });

  const OpenEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  }

  const focusRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const passRef = useRef<HTMLDivElement | null>(null);

  const focusEvent = () => {
    setFocus((prev) => !prev);
    OpenEventPopup('popup1')
  }

  const openMouseEvent = (event: MouseEvent) => {
    if(passRef.current && !passRef.current.contains(event.target as Node)) {
      setFocus(false)
    }
  }

  // useEffect(() => {
  //   document.addEventListener('mousedown', openMouseEvent);
  //   return () => {
  //     document.removeEventListener('mousedown', openMouseEvent);
  //   }
  // }, [])

  const handleSearch = (result: string) => {
    console.log("검색어:", result); // 검색어를 출력
  };
  return (
    <>
    <div className="bg-gray-100 relative">
      <div className="p-5 gap-3 flex">
        <DropDown options={dropOptions.dropOption1} type="shadow" width='w-[8rem]' label='선택' addClass="bg-white" />
        <SearchBar placeholder="검색해주세요." onSearch={handleSearch} />
      </div>

      <div className="md:w-[43.75rem] relative">
        <SearchBar placeholder="대학명 혹은 학과명을 2글자 이상 검색해주세요." onSearch={handleSearch} />

        <SearchBar ref={focusRef} focus={focus} onClick={focusEvent} placeholder="대학명 혹은 학과명을 2글자 이상 검색해주세요." onSearch={handleSearch} />

      </div>
    </div>

    </>
  )
}

export default SearchBarPage;