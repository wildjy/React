
"use client";
import React, { useState, ChangeEvent } from "react";
import DropDown_Score from '../../sharedUI/DropDown/DropDown_Score';
import DropDown from '../../sharedUI/DropDown/DropDown';
import CheckBox from "../../sharedUI/Input/CheckBox";


const DropDownPage = () => {

  // const [isOpen, setIsOpen] = useState<{[key: string]: boolean}>({
  //   dropDown1: false,
  //   dropDown2: false,
  // });
  // const [selectValue, setSelectValue] = useState(null);

  // const OpenEvent = (key: string) => {
  //   setIsOpen((prevOpen) => {
  //     console.log(prevOpen);
  //     console.log("Key:", [key]);
  //     console.log("Key:", !prevOpen[key]);
  //     return {
  //       ...prevOpen,
  //       [key]: !prevOpen[key],
  //     }
  //   });
  // }

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
          <DropDown options={dropOptions.dropOption2} layer size="sm" width='w-[7rem]' label='선택1' />
          <DropDown options={dropOptions.dropOption2} type="shadow" size="sm" width='w-[13rem]' label='선택1' />

          <DropDown options={dropOptions.dropOption1} width='min-w-[12rem]' label='선택2' />
          <DropDown_Score options={dropOptions.dropOption1} options1={dropOptions.dropOption2} layer width='min-w-[10rem]' label='사과탐' />

          <DropDown custom width='min-w-[10rem]' label='옵션 선택'>
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
            <p>dfdsfsd</p>
            <p>dfdsfsd</p>
            <p>dfdsfsd</p>
            <p>dfdsfsd</p>
          </DropDown>
        </div>
      </div>
    </>
  )
}

export default DropDownPage;