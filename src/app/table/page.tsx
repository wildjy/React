"use client";
import React from "react";
import { useRef, useState, ChangeEvent } from 'react';
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";

const theadThStyle = 'p-0 md:py-5 w-full h-9 md:h-auto flex border-b-0 last:border-b md:border-b border-r-0 md:w-auto md:table-cell items-center justify-center';
const tbodyTdStyle = 'p-0 md:py-5 w-full h-9 md:h-auto flex border-b-0 last:border-b md:border-b md:w-auto md:table-cell items-center';
const tbodyTdDivStyle = 'w-full flex md:flex-wrap text-center';

const TablePage: React.FC = () => {
  // input
  const [inputValue, setInputValue] = useState([
    {
      score1: "",
      score2: "",
      score3: "",
      score4: "",
      score5: "",
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
                <p className="w-full">영역</p>
                <p className="w-full">선택과목</p>
              </div>
            </th>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">한국사</p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">국어</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">수학</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">영어</p>
              </div>
            </td>
            <td className={`${tbodyTdStyle} md:p-0 md:py-0`}>
              <div className={tbodyTdDivStyle}>
                <div className={tbodyTdDivStyle}>
                  <p className="w-full md:p-5 md:border-b">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                </div>
                <div className={tbodyTdDivStyle}>
                  <p className="w-full md:p-5 md:w-1/2">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                  <p className="w-full md:p-5 md:w-1/2">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                </div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">제2외국어</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
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
            <th scope="col" className={`${theadThStyle} h-12`}>
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
                <p className="w-full">영역</p>
                <p className="w-full">선택과목</p>
                <p className="w-full">표준점수</p>
              </div>
            </th>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">한국사</p>
                <p className="w-full"></p>
                <p className="w-full">한국사</p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">국어</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">수학</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">영어</p>
                <p className="w-full"></p>
                <p className="w-full">영어
                </p>
              </div>
            </td>
            <td className={`${tbodyTdStyle} md:p-0 md:py-0 h-12`}>
              <div className={`${tbodyTdDivStyle} h-full`}>
                <div className={`${tbodyTdStyle} md:w-1/3 h-full items-center`}>
                  <p className="w-full md:py-5 md:border-b">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                </div>
                <div className={`${tbodyTdStyle} md:w-1/3 table-cell h-full`}>
                  <p className="w-full md:py-5 md:border-b">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                  <p className="w-full md:py-5">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                </div>
                <div className={`${tbodyTdStyle} md:w-1/3 table-cell h-full`}>
                  <p className="w-full md:py-5 md:border-b">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                  <p className="w-full md:py-5 ">
                    <select title="수학 구분">
                      <option>--선택--</option>
                      <option>확률과통계</option>
                      <option>미적분</option>
                      <option>기하</option>
                    </select>
                  </p>
                </div>
              </div>
            </td>
            <td className={tbodyTdStyle}>
              <div className={tbodyTdDivStyle}>
                <p className="w-full">제2외국어</p>
                <p className="w-full">제2외국어</p>
                <p className="w-full">
                  <select title="수학 구분">
                    <option>--선택--</option>
                    <option>확률과통계</option>
                    <option>미적분</option>
                    <option>기하</option>
                  </select>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default TablePage;