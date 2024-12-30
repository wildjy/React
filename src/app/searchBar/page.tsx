"use client";
import React, { } from "react";
import SearchBar from "../../sharedUI/Input/SearchBar"
import DropDown from "../../sharedUI/DropDown/DropDown"

const SearchBarPage = () => {
  const dropOptions = {
    dropOption1: [
      { value: "1", label: "옵션옵션옵1-1" },
      { value: "2", label: "옵션 1-2" },
      { value: "3", label: "옵션 1-3" },
    ],
  }

  return (
    <>
      <div className="p-5 gap-3 flex justify-start items-stretch">
        <DropDown options={dropOptions.dropOption1} type="shadow" width='w-[8rem]' label='선택' addClass="grow-1" />
        <SearchBar label="대학명 혹은 학과명을 2글자 이상 검색해주세요." addClass="grow-1" />
      </div>
    </>
  )
}

export default SearchBarPage;