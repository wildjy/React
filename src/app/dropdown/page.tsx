
"use client";
import React, { useState, ChangeEvent } from "react";
import DropDown_Score from '../../sharedUI/DropDown/DropDown_Score';
import DropDown from '../../sharedUI/DropDown/DropDown';
import DropDownMore from '../../sharedUI/DropDown/DropDownMore';
import CheckBox from "../../sharedUI/Input/CheckBox";


const DropDownPage = () => {
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({
    checkbox_1: true,
    checkbox_2: false,
    checkbox_3: false,
  });

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [value]: checked,
    }));
  };

  const dropOptions = {
    dropOption1: [
      { value: "1", label: "옵션옵션옵1-1" },
      { value: "2", label: "옵션 1-2" },
      { value: "3", label: "옵션 1-3" },
    ],
    dropOption2: [
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "5", label: "화법과 작문" },
      { value: "6", label: "확률과 통계통계" },
      { value: "7", label: "미적분" },
      { value: "8", label: "가하" },
    ],
  }

  return(
    <>
      <div>
        <div className="flex gap-3 flex-wrap">
          <DropDown options={dropOptions.dropOption2} layer />
          <DropDown options={dropOptions.dropOption2} type="shadow" size="sm" width='w-[13rem]' label='선택 shadow' />
          <DropDown options={dropOptions.dropOption2} type="ghost" label='선택2' />
          <DropDown options={dropOptions.dropOption1} width='min-w-[12rem]' label='선택2' />

          <DropDown_Score options={dropOptions.dropOption1} options1={dropOptions.dropOption2} layer width='min-w-[10rem]' label='사과탐' />
          <DropDown_Score options={dropOptions.dropOption1} options1={dropOptions.dropOption2} layer type="shadow" width='min-w-[10rem]' label='사과탐' />
          <DropDown_Score options={dropOptions.dropOption1} options1={dropOptions.dropOption2} layer type="ghost" width='min-w-[10rem]' label='사과탐' />

          <DropDown custom width='min-w-[10rem]' label='옵션 선택'>
            <div className="p-5">
              <ul>
                <li>
                  <CheckBox
                    size="sm"
                    value="checkbox_1"
                    checked={isChecked["checkbox_1"] || false}
                    onChange={handleCheckChange}
                    label="체크박스"
                  />
                </li>
                <li>
                  <CheckBox
                    size="sm"
                    value="checkbox_2"
                    checked={isChecked["checkbox_2"] || false}
                    onChange={handleCheckChange}
                    label="체크박스"
                  />
                </li>
                <li>
                  <CheckBox
                    size="sm"
                    value="checkbox_3"
                    checked={isChecked["checkbox_3"] || false}
                    onChange={handleCheckChange}
                    label="체크박스"
                  />
                </li>
              </ul>
              <ul>
                <li><a href="https://www.naver.com/">NAVER Go!</a></li>
                <li><a href="https://www.google.com">Google Go!</a></li>
                <li><a href="https://www.nate.com">Nate Go!</a></li>
              </ul>
            </div>
          </DropDown>

          <div className="w-full relative">
            <DropDownMore>
              <ul className="p-5">
                <li><a href="https://www.naver.com/" className="px-4 py-2 text-s hover:bg-gray-200 rounded">NAVERNAVERNAVERGoGoGo !</a></li>
                <li><a href="https://www.google.com" className="px-4 py-2 text-s hover:bg-gray-200 rounded">Google Go!</a></li>
                <li><a href="https://www.nate.com" className="px-4 py-2 text-s hover:bg-gray-200 rounded">Nate Go!</a></li>
              </ul>
            </DropDownMore>
          </div>
        </div>
      </div>
    </>
  )
}

export default DropDownPage;