"use client";
import React, { useState, useRef, useEffect } from "react";
import { SearchBar } from "../../sharedUI/Input/SearchBar"
import UnivSearchBar from "../../sharedUI/Input/UnivSearchBar"
import DropDown from "../../sharedUI/DropDown/DropDown"
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
    <div ref={passRef} className="bg-gray-100 relative">
      <div className="p-5 gap-3 flex">
        <DropDown options={dropOptions.dropOption1} type="shadow" width='w-[8rem]' label='선택' addClass="" />
        <SearchBar placeholder="검색해주세요." onSearch={handleSearch} />
      </div>

      <div className="md:w-[43.75rem] relative">
        <SearchBar ref={focusRef} placeholder="대학명 혹은 학과명을 2글자 이상 검색해주세요." focus={focus} onClick={focusEvent} onSearch={handleSearch} />

        <LayerPopup type="absolute" align="center" dimm={false} close={false} isOpen={isOpenPopup.popup1}
        parentClass="fixed w-dvw h-dvh md:static md:w-auto md:h-auto"
        addClass={`md:top-[2.625rem] right-0 w-[100dvw]
        max-w-[100dvw] h-[100dvh]
        max-h-dvh md:min-w-[300px]
        md:max-w-[100dvw] md:w-auto md:h-fit md:max-h-[90dvh] top-0 left-0 right-0 z-10`}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className='h-[10rem]'>
              <p className="text-xl">
                Body..
              </p>
              <p>
                컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
              </p>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded'>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>
      </div>
    </div>


    {focus && (
      <>
        {/* <div className="p-10 bg-white border border-gray-1000">
        레이어
        </div>

      <div className="p-5">
        <UnivSearchBar placeholder="대학명 혹은 학과명을 2글자 이상 검색해주세요." addClass="" />
      </div>
        */}
      </>
    )}
    </>
  )
}

export default SearchBarPage;