
"use client";
import React, { useState, ChangeEvent } from "react";
import CustomSelect from './CustomSelect';
import CheckBox from "../../sharedUI/Input/CheckBox";


const CustomSelectPage = () => {

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
      { value: "1", label: "옵션옵션옵션옵션옵션 1-1" },
      { value: "2", label: "옵션 1-2" },
      { value: "3", label: "옵션 1-3" },
    ],
    dropOption2: [
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계통계통계통계통계통통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계통계통계통계통계통통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계통계통계통계통계통통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계통계통계통계통계통통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
      { value: "4", label: "가하" },
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "확률과 통계" },
      { value: "3", label: "미적분" },
    ],
  }

  return(
    <>
      <div>
        <div className="flex gap-3 flex-wrap">
          <div className="w-[7rem]">
            <CustomSelect options={dropOptions.dropOption2} size={'w-full'} label={'선택'} layer={true} />
          </div>
          <CustomSelect options={dropOptions.dropOption1} size={'min-w-[10rem]'} label={'선택'} />

          <CustomSelect custom={true} size={'min-w-[10rem]'} label={'옵션 선택'}>
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
          </CustomSelect>
        </div>
      </div>
    </>
  )
}

export default CustomSelectPage;