"use client";
import React, { useState, ChangeEvent } from 'react';
import { cn } from "../common/cn";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import DropDown_Score from '../../sharedUI/DropDown/DropDown_Score';
import DropDown from '../../sharedUI/DropDown/DropDown';

const GradeTable = () => {

  const theadThStyle = `
    text-xs md:text-base
    p-0 md:p-0
    w-full h-[2.7rem]
    flex items-center justify-center text-center
    first:border-t-gray-1000
    md:border-t-gray-1000
    border-0
    border-t first:border-t-0 last:border-b
    first:bg-[#F4F5F6]
    bg-white
    md:py-5
    md:bg-[#F4F5F6]
    md:w-auto md:h-auto
    md:table-cell
    md:align-middle
    md:border-b`;
  const firstTdAlign = `md:py-[1.45rem]`;
  const theadThHeight = `h-[5.4rem]`;
  const tbodyTdHeight = `md:py-[0.54rem]`;
  const tbodyTdStyle = `
    text-xs md:text-base
    p-0 md:p-0
    w-full h-[2.7rem]
    flex items-center
    border-0
    border-t border-b-1 last:border-b
    md:w-auto md:h-auto
    md:table-cell
    md:border-b`;
  const tbodyTdDivStyle = 'w-full flex h-full md:flex-wrap items-center text-center';
  const tbodyTdDivPTopStyle = 'w-full md:py-5 md:border-b md:bg-white items-center';
  const tbodyTdDivPBottomStyle = 'w-full md:py-5 md:bg-white';

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
                  <div className={tbodyTdDivPTopStyle}>선택과목</div>
                  <div className={`${tbodyTdDivPBottomStyle} ${firstTdAlign}`}>표준점수</div>
                </div>
              </th>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>한국사</div>
                  <div className={tbodyTdDivPTopStyle}>-</div>
                  <div className={`${tbodyTdDivPBottomStyle}`}>
                    <TextInput
                      type="text"
                      size="sm"
                      align="center"
                      addId="inp-1"
                      label="한국사"
                      addClass='w-4/5'
                      value={inputValue[0].score1}
                      onChange={(e) => handleInputChange(e, 0, "score1")}
                    />
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>국어</div>
                  <div className={`${tbodyTdDivPTopStyle} ${tbodyTdHeight}`}>
                    <div className='w-4/5 m-center'>
                      <DropDown options={dropOptions.dropOption1} size="sm" align="left" label='선택' />
                    </div>
                  </div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      size="sm"
                      align="center"
                      addId="inp-1"
                      label="국어"
                      addClass='w-4/5'
                      value={inputValue[0].score2}
                      onChange={(e) => handleInputChange(e, 0, "score2")}
                    />
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>수학</div>
                  <div className={`${tbodyTdDivPTopStyle} ${tbodyTdHeight}`}>
                    <div className='w-4/5 m-center'>
                      <DropDown options={dropOptions.dropOption2} size="sm" align="left" label='선택' />
                    </div>
                  </div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      size="sm"
                      align="center"
                      addId="inp-1"
                      label="수학"
                      addClass='w-4/5'
                      value={inputValue[0].score3}
                      onChange={(e) => handleInputChange(e, 0, "score3")}
                    />
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>영어</div>
                  <div className={tbodyTdDivPTopStyle}>-</div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      size="sm"
                      align="center"
                      addId="inp-1"
                      label="영어"
                      addClass='w-4/5'
                      value={inputValue[0].score4}
                      onChange={(e) => handleInputChange(e, 0, "score4")}
                    />
                  </div>
                </div>
              </td>
              <td className={`${tbodyTdStyle} md:p-0 md:py-0 ${theadThHeight}`}>
                <div className={`${tbodyTdDivStyle} md:h-full`}>
                  <div className={`${cn(tbodyTdStyle, 'h-auto w-1/3 md:w-full md:h-full items-center border-none')}`}>
                    <div className={`${tbodyTdDivPTopStyle} ${tbodyTdHeight}`}>
                      <div className='w-[90%] m-center'>
                        <DropDown options={dropOptions.dropOption3} size="sm" align="left" label='선택' />
                      </div>
                    </div>
                  </div>
                  <div className={`table-cell w-1/3 md:w-full md:flex`}>
                    <div className={`w-full flex items-center justify-center md:table-cell md:w-1/2 ${tbodyTdHeight} md:border-b h-[2rem] md:h-auto`}>
                      <div className='w-4/5 m-center text-left'>
                        <DropDown_Score options={dropOptions.dropOption4} options1={dropOptions.dropOption5} layer size="sm" align="left" label='사/과탐 선택' />
                      </div>
                    </div>
                    <div className={`w-full flex items-center justify-center md:table-cell md:w-1/2 ${tbodyTdHeight} md:border-b h-[2rem] md:h-auto`}>
                      <div className='w-4/5 m-center'>
                        <DropDown options={dropOptions.dropOption6} layer min="min-w-[9rem]" size="sm" align="left" label='직탐 선택' />
                      </div>
                    </div>
                  </div>
                  <div className={`table-cell w-1/3 md:w-full md:flex`}>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 h-[2rem] md:h-auto">
                      <TextInput
                        type="text"
                        size="sm"
                        align="center"
                        addId="inp-1"
                        label="사과탐1"
                        addClass="w-4/5"
                        value={inputValue[0].score5}
                        onChange={(e) => handleInputChange(e, 0, "score5")}
                      />
                    </div>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 h-[2rem] md:h-auto">
                      <TextInput
                        type="text"
                        size="sm"
                        align="center"
                        addId="inp-1"
                        label="사과탐2"
                        addClass="w-4/5"
                        value={inputValue[0].score6}
                        onChange={(e) => handleInputChange(e, 0, "score6")}
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>제2외국어</div>
                  <div className={tbodyTdDivPTopStyle}>제2외국어</div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      size="sm"
                      align="center"
                      addId="inp-1"
                      label="영어"
                      addClass="w-4/5"
                      value={inputValue[0].score7}
                      onChange={(e) => handleInputChange(e, 0, "score7")}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default GradeTable;