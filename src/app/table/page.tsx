"use client";
import { cn } from "../../sharedUI/common/cn";
import { cva } from "class-variance-authority";
import React from "react";
import { useRef, useState, ChangeEvent } from 'react';
import Table from "../../sharedUI/Table/Table";
import { TableBase } from "../../sharedUI/Table/TableBase";
import { TableType } from "../../sharedUI/Table/TableType";
import { TableTypeRow } from "../../sharedUI/Table/TableTypeRow";
import { TableTypeMd } from "../../sharedUI/Table/TableTypeMd";
import { TextInput } from "../../sharedUI/Input/TextInput";
import { CheckBox } from "../../sharedUI/Input/CheckBox";

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

  const tableData = [
    {
      title: 'Column',
      data: 'Data 1',
    },
    {
      title: 'Column',
      data: 'Data 2',
    },
    {
      title: 'Column',
      data: 'Data 3',
    },
    {
      title: 'Column',
      data: 'Data 4',
    },
    {
      title: 'Column',
      data: 'Data 5',
    },
  ]


  const testData = [
    {
      title: '',
      data1: '나',
      data2: '나-내 계열차이',
      data3: `ㅇㅇ계열 평균`,
      data4: '전체평균',
    },
    {
      title: '국어',
      data1: '국어1 점수',
      data2: '국어2 점수',
      data3: '국어3 점수',
      data4: '국어4 점수',
    },
    {
      title: '수학',
      data1: '수학1 점수',
      data2: '수학2 점수',
      data3: '수학3 점수',
      data4: '수학4 점수',
    },
    {
      title: '탐구',
      data1: '탐구1 점수',
      data2: '탐구2 점수',
      data3: '탐구3 점수',
      data4: '탐구4 점수',
    },
    {
      title: '영어',
      data1: '영어1 점수',
      data2: '영어2 점수',
      data3: '영어3 점수',
      data4: '영어4 점수',
    },
  ];
  const tableColumns = ['data1', 'data2', 'data3', 'data4'];
  const datas = tableColumns.map((key) => ({
    children: testData.map((row) => ({
      title: row.title,
      data: row[key as keyof typeof row],
    })),
  }));

  return (
    <>
      <div className="overflow-hidden">
        <div className="p-5">

          <Table addClass="">
            <Table.Colgroup>
              <col width="20%" /><col width="20%" /><col width="20%" />
            </Table.Colgroup>
            <Table.Thead>
              <th>1</th>
              <th>2</th>
              <th>3</th>
            </Table.Thead>
            <Table.Tbody>
              <tr>
                <td>td 1</td>
                <td>td 2</td>
                <td>td 3</td>
              </tr>
              <tr>
                <td>td 1</td>
                <td>td 2</td>
                <td>td 3</td>
              </tr>
            </Table.Tbody>
          </Table>

          <Table addClass="">
            <Table.Colgroup>
              <col width="20%" />
              <col width="20%" className="hide" />
              <col width="20%" />
              <col width="20%" className="hide" />
              <col width="20%" />
            </Table.Colgroup>
            <Table.Thead>
              <th>1</th>
              <th className="hide">hide 2</th>
              <th>3</th>
              <th className="hide">hide 4</th>
              <th>5</th>
            </Table.Thead>
            <Table.Tbody>
              <tr>
                <td>td 1</td>
                <td className="hide">td 2</td>
                <td>td 3</td>
                <td className="hide">td 4</td>
                <td>td 5</td>
              </tr>
              <tr>
                <td>td 1</td>
                <td className="hide">td 2</td>
                <td>td 3</td>
                <td className="hide">td 4</td>
                <td>td 5</td>
              </tr>
            </Table.Tbody>
          </Table>

          <TableBase
            addClass="bg-red-50"
            datas={datas}
          />

          <TableBase
            addClass=""
            datas={[
              {
                children: [
                  {
                    title: 'Column 1',
                    data: 'Data 1',
                    row: 3,
                    width: [
                      {
                        m: '10%',
                        pc: '30%',
                      },
                    ],
                  },
                  {
                    title: 'Column 2',
                    data: 'Data 2',
                    hide: true,
                    width: [
                      {
                        // m: '12.5%',
                        pc: '17.5%',
                      },
                    ],
                  },
                  {
                    title: 'Column 3',
                    data: 'Data 3',
                    row: 3,
                    width: [
                      {
                        // m: '12.5%',
                        pc: '17.5%',
                      },
                    ],
                  },
                  {
                    title: 'Column 4',
                    data: 'Data 4',
                    width: [
                      {
                        // m: '12.5%',
                        pc: '17.5%',
                      },
                    ],
                  },
                  {
                    title: 'Column 5',
                    data: 'Data 5',
                    width: [
                      {
                        // m: '12.5%',
                        pc: '17.5%',
                      },
                    ],
                  },
                ],
              },
              {
                children: [
                  // {
                  //   data: 'Data A',
                  // },
                  {
                    data: 'Data A',
                    hide: true,
                  },
                  // {
                  //   data: 'Data B',
                  // },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                ],
              },
              {
                children: [
                  {
                    data: 'Data A',
                    hide: true,
                  },
                  // {
                  //   data: 'Data B',
                  // },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                ],
              },
            ]}
          />

          <TableType
            datas={[
              {
                children: [

                  ...tableData.map((row, i) => ({
                    title: row.title + `+ index ${i}`,
                    data: row.data + `+ index ${i + 1}`,
                  })),
                ],
              },
              {
                children: [
                  {
                    data: 'Data A',
                  },
                  {
                    data: 'Data B',
                  },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                  {
                    data: 'Data E',
                  },
                ],
              },
              {
                children: [
                  {
                    data: 'Data A',
                  },
                  {
                    data: 'Data B',
                  },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                  {
                    data: 'Data E',
                  },
                ],
              },
            ]}
          />

          <TableType
          addClass="double"
            datas={[
              {
                children: [
                  {
                    title: <>Column 1<br /> Column 1</>,
                    data: 'Data 1',
                  },
                  {
                    title: 'Column 2',
                    data: <>Data2 <br /> Data22</>,
                  },
                  {
                    title: 'Column 3',
                    data: 'Data 3',
                  },
                  {
                    title: 'Column 4',
                    data: 'Data 4',
                  },
                  {
                    title: 'Column 5',
                    data: 'Data 5',
                  },
                ],
              },
              {
                children: [
                  {
                    data: 'Data A',
                  },
                  {
                    data: 'Data B',
                  },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                  {
                    data: 'Data E',
                  },
                ],
              },
              {
                children: [
                  {
                    data: 'Data A',
                  },
                  {
                    data: 'Data B',
                  },
                  {
                    data: 'Data C',
                  },
                  {
                    data: 'Data D',
                  },
                  {
                    data: 'Data E',
                  },
                ],
              },
            ]}
          />

          <TableTypeRow
            datas={[
              {
                children: [
                  {
                    title: 'Column 1',
                    th: true,
                  },
                  {
                    title: 'Column 2',
                  },
                  {
                    title: 'Column 3',
                  },
                  {
                    title: 'Column 4',
                  },
                  {
                    title: 'Column 5',
                  },
                ],
              },
              {
                children: [
                  {
                    title: 'Data A',
                    th: true,
                  },
                  {
                    title: 'Data B',
                  },
                  {
                    title: 'Data C',
                  },
                  {
                    title: 'Data D',
                  },
                  {
                    title: 'Data E',
                  },
                ],
              },
            ]}
          />

          <TableTypeMd
            datas={[
              {
                children: [
                  {
                    title: 'MD Column 1',
                    data: 'Data 1',
                    align: 'left',
                    hide: true,
                  },
                  {
                    title: 'Column 2',
                    data: 'Data 2',
                  },
                  {
                    title: 'Column 3',
                    data: 'Data 3',
                  },
                  {
                    title: 'Column 4',
                    data: 'Data 4',
                    hide: true,
                  },
                  {
                    title: 'Column 5',
                    data: 'Data 5',
                  },
                ],
              },
              {
                children: [
                  {
                    data: 'Data 1',
                    hide: true,
                  },
                  {
                    data: 'Data 2',
                  },
                  {
                    data: 'Data 3',
                  },
                  {
                    data: 'Data 4',
                    hide: true,
                  },
                  {
                    data: 'Data 5',
                  },
                ],
              },
            ]}
          />

          <Table addClass="tableTypeRow">
            <Table.Colgroup>
              <col className="w-full md:w-1/6" />
            </Table.Colgroup>
            <Table.Tbody tdW="w-full">
              <tr>
                <th>합격가능성 구분</th>
                <td>인정지원</td>
                <td>적정지원</td>
                <td>소신지원</td>
                <td>모험지원</td>
                <td>모험지원</td>
              </tr>
              <tr>
                <th>점수범위</th>
                <td>770~800</td>
                <td>740~769</td>
                <td>700~739</td>
                <td>600~699</td>
                <td>0~599</td>
              </tr>
              <tr>
                <th>점수범위</th>
                <td>770~800</td>
                <td>740~769</td>
                <td>700~739</td>
                <td>600~699</td>
                <td>0~599</td>
              </tr>
            </Table.Tbody>
          </Table>

          <Table addClass="tableType1 double">
            <Table.Colgroup>
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
            </Table.Colgroup>
            <Table.Thead>
              <th>영역</th>
              <th>국어<br />(화법과 작문)</th>
              <th>수학<br />(미적분)</th>
              <th>4</th>
              <th>5</th>
            </Table.Thead>
            <Table.Tbody>
              <tr>
                <td>영역별 점수</td>
                <td>td 2</td>
                <td>td 3</td>
                <td>td 4</td>
                <td className="bg-blue-50">688.575<br />(1000)</td>
              </tr>
              <tr>
                <td>가감점</td>
                <td>td 7</td>
                <td>td 8</td>
                <td>td 9</td>
                <td className="bg-blue-50">100</td>
              </tr>
              <tr>
                <td>내 환산점수<br />(만점)</td>
                <td>td 12</td>
                <td>td 13</td>
                <td>td 14</td>
                <td className="bg-blue-50">688.575<br />(1000)</td>
              </tr>
            </Table.Tbody>
          </Table>

          <Table addClass="tableTypeMd mt-5">
            <Table.Colgroup>
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
            </Table.Colgroup>
            <Table.Thead thW="w-1/3">
              <th>군</th>
              <th>대학</th>
              <th>모집단위</th>
              <th>모집인원</th>
              <th>전년도 경쟁률</th>
            </Table.Thead>
            <Table.Tbody tdW="w-2/3">
              <tr>
                <td>가군</td>
                <td>한국외국어대</td>
                <td>경영경제</td>
                <td>-</td>
                <td>5.35</td>
              </tr>
            </Table.Tbody>
          </Table>

        </div>

        <table className="mt-[10rem] flex md:table">
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

export default TablePage;