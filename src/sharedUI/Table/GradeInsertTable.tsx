"use client";
import React, { useState, ChangeEvent } from 'react';
import { cn } from "../common/cn";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";

const GradeTable = () => {

  const theadThStyle = `
    p-0
    w-full h-9
    flex items-center justify-center
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
    md:border-b`;
  const tbodyTdStyle = `
    p-0 md:p-0
    w-full h-9
    flex items-center
    border-0
    border-t
    border-b-1 last:border-b
    md:py-0
    md:w-auto md:h-auto
    md:table-cell
    md:border-b`;
  const tbodyTdDivStyle = 'w-full flex md:flex-wrap text-center';
  const tbodyTdDivPTopStyle = 'w-full md:py-5 md:border-b md:bg-white';
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

  return (
    <>
      <div>
        <table className="flex md:table">
          <caption>점수 입력 서식</caption>
          <colgroup>
            <col width="9%" /><col width="9%" /><col width="17%" /><col width="17%" /><col width="9%" /><col width="30%" /><col width="9%" />
          </colgroup>
          <thead className='w-1/5 md:w-full'>
            <tr className="block md:table-row">
              <th scope="col" className={theadThStyle}>선택</th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_1"
                  checked={isChecked["checkbox_1"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_2"
                  checked={isChecked["checkbox_2"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_3"
                  checked={isChecked["checkbox_3"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_4"
                  checked={isChecked["checkbox_4"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={`${theadThStyle} h-[5rem]`}>
                <CheckBox
                  size="sm"
                  value="checkbox_5"
                  checked={isChecked["checkbox_5"] || false}
                  onChange={handleCheckChange}
                />
              </th>
              <th scope="col" className={theadThStyle}>
                <CheckBox
                  size="sm"
                  value="checkbox_6"
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
                  <div className={`${tbodyTdDivPTopStyle}`}>영역</div>
                  <div className={tbodyTdDivPTopStyle}>선택과목</div>
                  <div className={tbodyTdDivPBottomStyle}>표준점수</div>
                </div>
              </th>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>한국사</div>
                  <div className={tbodyTdDivPTopStyle}>-</div>
                  <div className={`${tbodyTdDivPBottomStyle}`}>
                    <TextInput
                      type="text"
                      addId="inp-1"
                      label="한국사"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
                      value={inputValue[0].score1}
                      onChange={(e) => handleInputChange(e, 0, "score1")}
                    />
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>국어</div>
                  <div className={tbodyTdDivPTopStyle}>
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      addId="inp-1"
                      label="국어"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
                      value={inputValue[0].score2}
                      onChange={(e) => handleInputChange(e, 0, "score2")}
                    />
                  </div>
                </div>
              </td>
              <td className={tbodyTdStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>수학</div>
                  <div className={tbodyTdDivPTopStyle}>
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </div>
                  <div className={tbodyTdDivPBottomStyle}>
                    <TextInput
                      type="text"
                      addId="inp-1"
                      label="수학"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
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
                      addId="inp-1"
                      label="영어"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
                      value={inputValue[0].score4}
                      onChange={(e) => handleInputChange(e, 0, "score4")}
                    />
                  </div>
                </div>
              </td>
              <td className={`${tbodyTdStyle} md:p-0 md:py-0 h-[5rem]`}>
                <div className={`${tbodyTdDivStyle} md:h-full`}>
                  <div className={`${cn(tbodyTdStyle, 'h-auto w-1/3 md:w-full md:h-full items-center border-none')}`}>
                    <div className={`${tbodyTdDivPTopStyle}`}>
                      <select title="수학 구분">
                        <option>--선택1--</option>
                        <option>확률과통계</option>
                        <option>미적분</option>
                        <option>기하</option>
                      </select>
                    </div>
                  </div>
                  <div className={`table-cell w-1/3 md:w-full md:flex`}>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 md:border-b h-[2.5rem] md:h-auto">
                      <select title="수학 구분">
                        <option>--선택2--</option>
                        <option>확률과통계</option>
                        <option>미적분</option>
                        <option>기하</option>
                      </select>
                    </div>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 md:border-b h-[2.5rem] md:h-auto">
                      <select title="수학 구분">
                        <option>--선택3--</option>
                        <option>확률과통계</option>
                        <option>미적분</option>
                        <option>기하</option>
                      </select>
                    </div>
                  </div>
                  <div className={`table-cell w-1/3 md:w-full md:flex`}>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 h-[2.5rem] md:h-auto">
                      <TextInput
                        type="text"
                        addId="inp-1"
                        label="사과탐1"
                        addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
                        value={inputValue[0].score5}
                        onChange={(e) => handleInputChange(e, 0, "score5")}
                      />
                    </div>
                    <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 h-[2.5rem] md:h-auto">
                      <TextInput
                        type="text"
                        addId="inp-1"
                        label="사과탐2"
                        addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
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
                      addId="inp-1"
                      label="영어"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300"
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