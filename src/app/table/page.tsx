"use client";
import React from "react";
import { useRef, useState, ChangeEvent } from 'react';
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";

const theadThStyle = 'p-0 md:py-5 w-full h-9 md:h-auto flex border-b-0 last:border-b md:border-b border-r-0 md:w-auto md:table-cell items-center justify-center';
const tbodyTdStyle = 'p-0 md:p-0 md:py-0  w-full h-9 md:h-auto flex border-b-0 last:border-b md:border-b md:w-auto md:table-cell items-center';
const tbodyTdDivStyle = 'w-full flex md:flex-wrap text-center';
const tbodyTdDivPTopStyle = 'w-full md:py-5 md:border-b ';
const tbodyTdDivPBottomStyle = 'w-full md:py-5';

const TablePage: React.FC = () => {
  // input
  const [inputValue, setInputValue] = useState([
    {
      score1: "",
      score2: "",
      score3: "",
      score4: "",
      score5: "",
      score6: "",
    },
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      // console.log("Previous Values:", prevValues);
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
    checkbox_7: false,
    checkbox_8: false,
    checkbox_9: false,
    checkbox_10: false,
    checkbox_11: false,
    checkbox_12: false,
  });

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const checked = e.target.checked;
    const { value, checked } = e.target;
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [value]: checked,
    }));
    // console.log(`Checked status: ${value}`, checked);
  };

  return (
    <>
      <table className="flex md:table">
        <caption>점수 입력 서식</caption>
        <colgroup>
          <col width="9%" /><col width="9%" /><col width="17%" /><col width="17%" /><col width="9%" /><col width="30%" /><col width="9%" />
        </colgroup>
        <thead className='w-1/5 md:w-full'>
          <tr className="block md:table-row">
            <th scope="col" className={theadThStyle}>체크</th>
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
            <th scope="col" className={theadThStyle}>
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
            <th scope="col" className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>영역</div>
                <div className={tbodyTdDivPBottomStyle}>선택과목</div>
              </div>
            </th>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className="w-full">한국사</div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>국어</div>
                <div className={tbodyTdDivPBottomStyle}>
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>수학</div>
                <div className={tbodyTdDivPBottomStyle}>
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className="w-full">영어</div>
              </div>
            </td>
            <td className={`${tbodyTdStyle}`}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivStyle}>
                  <div className={tbodyTdDivPTopStyle}>
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </div>
                </div>
                <div className={tbodyTdDivStyle}>
                  <div className="w-full md:p-5 md:w-1/2">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </div>
                  <div className="w-full md:p-5 md:w-1/2">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </div>
                </div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>제2외국어</div>
                <div className={tbodyTdDivPBottomStyle}>
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="flex md:table mt-5">
        <caption>점수 입력 서식</caption>
        <colgroup>
          <col width="9%" /><col width="9%" /><col width="17%" /><col width="17%" /><col width="9%" /><col width="30%" /><col width="9%" />
        </colgroup>
        <thead className='w-1/5 md:w-full'>
          <tr className="block md:table-row">
            <th scope="col" className={theadThStyle}>체크</th>
            <th scope="col" className={theadThStyle}>
              <CheckBox
                size="sm"
                value="checkbox_7"
                checked={isChecked["checkbox_7"] || false}
                onChange={handleCheckChange}
              />
            </th>
            <th scope="col" className={theadThStyle}>
              <CheckBox
                size="sm"
                value="checkbox_8"
                checked={isChecked["checkbox_8"] || false}
                onChange={handleCheckChange}
              />
            </th>
            <th scope="col" className={theadThStyle}>
              <CheckBox
                size="sm"
                value="checkbox_9"
                checked={isChecked["checkbox_9"] || false}
                onChange={handleCheckChange}
              />
            </th>
            <th scope="col" className={theadThStyle}>
              <CheckBox
                size="sm"
                value="checkbox_10"
                checked={isChecked["checkbox_10"] || false}
                onChange={handleCheckChange}
              />
            </th>
            <th scope="col" className={`${theadThStyle} h-[5rem]`}>
              <CheckBox
                size="sm"
                value="checkbox_11"
                checked={isChecked["checkbox_11"] || false}
                onChange={handleCheckChange}
              />
            </th>
            <th scope="col" className={theadThStyle}>
              <CheckBox
                size="sm"
                value="checkbox_12"
                checked={isChecked["checkbox_12"] || false}
                onChange={handleCheckChange}
              />
            </th>
          </tr>
        </thead>
        <tbody className='w-4/5 md:w-full'>
          <tr className="block md:table-row">
            <th scope="col" className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>영역</div>
                <div className={tbodyTdDivPTopStyle}>선택과목</div>
                <div className={tbodyTdDivPBottomStyle}>표준점수</div>
              </div>
            </th>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivPTopStyle}>한국사</div>
                <div className={tbodyTdDivPTopStyle}>-</div>
                <div className={tbodyTdDivPBottomStyle}>
                  <TextInput
                    type="text"
                    addId="inp-1"
                    label="한국사"
                    addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
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
                    addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
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
                    addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
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
                    addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
                    value={inputValue[0].score4}
                    onChange={(e) => handleInputChange(e, 0, "score4")}
                  />
                </div>
              </div>
            </td>
            <td className={`${tbodyTdStyle} md:p-0 md:py-0 h-[5rem]`}>
              <div className={`${tbodyTdDivStyle} md:h-full`}>
                <div className={`${tbodyTdStyle} h-auto w-1/3 md:w-full md:h-full items-center md:border-b-0`}>
                  <div className={tbodyTdDivPTopStyle}>
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
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
                      value={inputValue[0].score4}
                      onChange={(e) => handleInputChange(e, 0, "score4")}
                    />
                  </div>
                  <div className="w-full flex items-center justify-center md:table-cell md:w-1/2 md:py-5 h-[2.5rem] md:h-auto">
                    <TextInput
                      type="text"
                      addId="inp-1"
                      label="사과탐2"
                      addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
                      value={inputValue[0].score5}
                      onChange={(e) => handleInputChange(e, 0, "score5")}
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
                    addClass="p-0 py-[0.1rem] w-4/5 h-full text-center border-gray-300 rounded-md"
                    value={inputValue[0].score6}
                    onChange={(e) => handleInputChange(e, 0, "score6")}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default TablePage;