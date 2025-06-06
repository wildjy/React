"use client";
import React, { useState, ChangeEvent } from 'react';
import { cn } from "../common/cn";
import { TextInput } from "../Input/TextInput";
import { CheckBox } from "../Input/CheckBox";
import { DropDown_Score } from '../DropDown/DropDown_Score';
import { DropDown } from '../DropDown/DropDown';

export const GradeTable2 = () => {
  const theadThStyle = `
    p-0 lg:p-0
    w-full h-[2.5rem] sm:h-[3.375rem] md:h-[4.75rem] lg:h-[5.375rem]
    flex items-center justify-center text-center
    border-b-0 border-t-[#d9d9d9] first:border-t-0 last:border-b
    bg-[#F4F5F6]
    lg:py-5
    lg:bg-[#F4F5F6]
    lg:w-auto lg:h-auto
    lg:table-cell
    lg:align-middle
    lg:border-b`;
  const firstTdAlign = `lg:py-[1.1rem]`;
  const theadThHeight = `h-[3.875rem] sm:h-[5.3rem] md:h-[6.8125rem]`;
  const tbodyTdHeight = `h-[1.6rem] sm:h-[2.2rem] md:h-auto md:py-2 lg:py-[0.663rem]`;
  const tbodyTdStyle = `
      p-0 lg:p-0
      w-full h-[2.5rem] sm:h-[3.375rem] md:h-[4.75rem]
      flex items-center
      border-0
      border-t border-b-1 first:border-t-0 last:border-b
      lg:w-auto lg:h-auto
      lg:table-cell
      lg:border-b`;
  const tbodyTdDivStyle = 'w-full flex h-full lg:flex-wrap items-center text-center';
  const tbodyTdDivPTopStyle = 'w-full lg:py-[1.1rem] lg:border-b lg:bg-white items-center';
  const tbodyTdDivPBottomStyle = 'w-full lg:py-[1.1rem] lg:bg-white';

  // input
  const [inputValue, setInputValue] = useState([
    {
      score1: "",
      score2: "",
      score3: "",
      score4: "",
      score5: "",
      score6: "",
      score7: "",
    },
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      return prevValues.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
    });
  };

  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({
    checkbox_1: false,
    checkbox_2: false,
    checkbox_3: false,
    checkbox_4: false,
    checkbox_5: false,
    checkbox_6: false,
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
      { value: "1", label: "화법과 작문" },
      { value: "2", label: "언어와 매체" },
    ],
    dropOption2: [
      { value: "1", label: "확률과 통계" },
      { value: "2", label: "미적분" },
      { value: "3", label: "가하" },
    ],
    dropOption3: [
      { value: "1", label: "사/과탐" },
      { value: "2", label: "직탐" },
    ],
    dropOption4: [
      { value: "1_1", label: "사회문학" },
      { value: "1_2", label: "생활과윤리" },
      { value: "1_3", label: "정치와법" },
      { value: "1_4", label: "윤리와사상" },
      { value: "1_5", label: "경제" },
    ],
    dropOption5: [
      { value: "2_1", label: "물리학 Ⅰ" },
      { value: "2_2", label: "화학 Ⅰ" },
      { value: "2_3", label: "생물학 Ⅰ" },
      { value: "2_4", label: "지구과학 Ⅰ" },
      { value: "2_5", label: "물리학 Ⅰ" },
    ],
    dropOption6: [
      { value: "1", label: "농업기초기술" },
      { value: "2", label: "공업일반" },
      { value: "3", label: "상업경제" },
      { value: "4", label: "수산해운산업기초" },
      { value: "5", label: "인간발달" },
    ],
  }

  return (
    <>
      <div>
        <table className="mt-5 flex md:table w-full">
          <caption>점수 입력 서식</caption>
          <colgroup>
            <col width="9%" /><col width="10%" /><col width="10%" /><col width="10%" /><col width="10%" /><col width="20%" /><col width="10%" />
          </colgroup>
          <thead className='w-1/5 md:w-full'>
            <tr className="block md:table-row">
              <th scope="col" className={theadThStyle}>선택</th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_1"
                  addClass="m-center"
                  checked={isChecked["checkbox_1"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_2"
                  addClass="m-center"
                  checked={isChecked["checkbox_2"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_3"
                  addClass="m-center"
                  checked={isChecked["checkbox_3"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_4"
                  addClass="m-center"
                  checked={isChecked["checkbox_4"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={`${theadThStyle} ${theadThHeight}`}>
                <CheckBox
                  size="sm"
                  value="checkbox_5"
                  addClass="m-center"
                  checked={isChecked["checkbox_5"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_6"
                  addClass="m-center"
                  checked={isChecked["checkbox_6"] || false}
                  onChange={handleCheckChange}
                />
              </th>
            </tr>
          </thead>
          <tbody className='w-4/5 md:w-full'>
            <tr className="block md:table-row">
              <th scope="col" className={`${tbodyTdStyle} md:bg-white`}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>영역</div>
                  <div className={tbodyTdDivPBottomStyle }>선택과목</div>
                </div>
              </th>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>한국사</div>
                  <div className={tbodyTdDivPBottomStyle}>-</div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>국어</div>
                  <div className={`${cn('w-full flex items-center justify-center lg:table-cell md:h-auto ', tbodyTdHeight)}`}>
                    <div className='w-4/5 m-center'>
                      <DropDown options={dropOptions.dropOption1} size="sm" align="left" label='선택' />
                    </div>
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>수학</div>
                  <div className={`${cn('w-full flex items-center justify-center lg:table-cell md:h-auto ', tbodyTdHeight)}`}>
                    <div className='w-4/5 m-center'>
                      <DropDown options={dropOptions.dropOption2} size="sm" align="left" label='선택' />
                    </div>
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>영어</div>
                  <div className={tbodyTdDivPBottomStyle}>-</div>
                </div>
              </td>
              <td className={`${tbodyTdStyle} md:p-0 md:py-0 ${theadThHeight}`}>
                <div className={`${tbodyTdDivStyle} md:h-full`}>
                  <div className={`${cn(tbodyTdStyle, 'h-auto w-1/3 lg:w-full lg:h-full items-center border-none')}`}>
                    <div className={`${cn(tbodyTdDivPTopStyle, tbodyTdHeight)}`}>
                      <div className='w-[90%] m-center'>
                        <DropDown options={dropOptions.dropOption3} size="sm" align="left" label='선택' />
                      </div>
                    </div>
                  </div>
                  <div className={`table-cell w-1/2 md:w-full md:flex`}>
                    <div className={`${cn('w-full flex items-center justify-center lg:table-cell lg:w-1/2 md:h-auto ', tbodyTdHeight)}`}>
                      <div className='w-4/5 m-center '>
                        <DropDown_Score options={dropOptions.dropOption4} options1={dropOptions.dropOption5} layer size="sm" width="w-full" align="left" label='사과탐 선택' />
                      </div>
                    </div>
                    <div className={`${cn('w-full flex items-center justify-center lg:table-cell lg:w-1/2 md:h-auto ', tbodyTdHeight)}`}>
                      <div className='w-4/5 m-center'>
                        <DropDown options={dropOptions.dropOption6} layer min="min-w-[9rem]" size="sm" align="left" label='직탐 선택' />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>제2외국어</div>
                  <div className={tbodyTdDivPBottomStyle}>제2외국어</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}