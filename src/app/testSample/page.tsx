"use client";
import React from "react";
import { useState, ChangeEvent } from 'react';
import MakeButton  from "../highschool/MakeButton";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import Radio from "../../sharedUI/Input/Radio";


import Input  from "../highschool/inputClsx";
import TestInput  from "../highschool/inputCva";

const HighSchoolPage: React.FC = () => {

  const [inputValue, setInputValue] = useState([
    {
      name: '',
      phone: '',
      grade: '',
      class: '',
      school: '',
      icon: 'https://image.jinhak.com/renewal2020/svg/input_radio.svg'
    },
    {
      name: 'ㄱㄴㄷ',
      phone: '111-1111-1111',
      icon: ''
    }
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index:number,
    field:string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      console.log("Previous Values:", prevValues);

      return prevValues.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      )
    });
  };

  // radio

  const [selectedOption , setSelectedOption] = useState<string>('');
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value);
  };

  // checkbox
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    console.log("Checked status:", checked);
  };

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">

        <h2 className="p-4 text-3xl font-bold">출신고교(필수)</h2>

        <table className="border-t border-gray-900">
          <caption>출신고교 테이블</caption>
          <colgroup>
            <col style={{"width": "20%"}} />
            <col style={{"width": "80%"}} />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-1">수험생 이름</label>
              </th>
              <td className="border-t-gray-900">
                <TextInput
                  type="text"
                  mode="base"
                  size="md"
                  color="base"
                  addClass="border-gray-400"
                  addId="inp-1"
                  label="수험생 이름"
                  value={inputValue[0].name}
                  onChange={(e) => handleInputChange(e, 0, 'name')}
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-2">학생구분</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <Radio
                    type="radio"
                    name="type"
                    label="고등학교 졸업(예정)자"
                    value="gradeType_1"
                    checked={ selectedOption === 'gradeType_1' }
                    onChange={ handleRadioChange }
                  />
                  <Radio
                    type="radio"
                    name="type"
                    label="검정고시 출신자"
                    value="gradeType_2"
                    checked={ selectedOption === 'gradeType_2' }
                    onChange={ handleRadioChange }
                  />
                  <Radio
                    type="radio"
                    name="type"
                    label="현 고1,2 학생"
                    value="gradeType_3"
                    checked={ selectedOption === 'gradeType_3' }
                    onChange={ handleRadioChange }
                  />
                  <Radio
                    type="radio"
                    name="studentType"
                    label="2 학생"
                    value="studentType_1"
                    checked={ selectedOption === 'studentType_1' }
                    onChange={ handleRadioChange }
                  />
                  <Radio
                    type="radio"
                    name="studentType"
                    label="학생"
                    value="studentType_2"
                    checked={ selectedOption === 'studentType_2' }
                    onChange={ handleRadioChange }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="">졸업년도</label>
              </th>
              <td>
                <div className="flex items-center gap-4">
                  <select name="" id="" className="p-2 border border-gray-400">
                    <option value="0">- 졸업년도 선택 -</option>
                  </select>

                  <TextInput
                    type="text"
                    mode="base"
                    size="sm"
                    color="base"
                    addClass="border-gray-400"
                    addId="inp-2"
                    label="반"
                    value={inputValue[0].grade}
                    onChange={(e) => handleInputChange(e, 0, 'grade')}
                  /> 반

                  <TextInput
                    type="text"
                    mode="base"
                    size="sm"
                    color="base"
                    addClass="border-gray-400"
                    addId="inp-3"
                    label="번"
                    value={inputValue[0].class}
                    onChange={(e) => handleInputChange(e, 0, 'class')}
                  /> 번
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-3">출신 고등학교</label>
              </th>
              <td>
                <TextInput
                  type="text"
                  mode="base"
                  size="md"
                  color="base"
                  addClass="border-gray-400"
                  addId="inp-4"
                  label="고등학교 검색"
                  value={inputValue[0].school}
                  onChange={(e) => handleInputChange(e, 0, 'school')}
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-3">학생유형</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <CheckBox
                    type="checkbox"
                    value="checkbox_1"
                    label="체크박스"
                    checked={ isChecked }
                    onChange={ handleCheckChange }
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <TextInput
          type="text"
          value={inputValue[1].name}
          onChange={(e) => handleInputChange(e, 1, 'name')}
          size="sm"
          color="ghost"
          addClass="py-4"
          addId="inp"
          icon={<img src={inputValue[0].icon} className='w-6 h-6' />}
          label="수험생 연락처"
        />


        {/* <Input baseTy onChange={handleChange} />
        <Input value="aa" ghost onChange={handleChange} readonly="readonly" />
        <Input onChange={handleChange} disabled="disabled"  />

        <TestInput type="password" size="sm" color="base" onChange={handleChange} />
        <TestInput type="password" size="sm" color="success" onChange={handleChange} />
        <TestInput type="password" size="sm" color="warning" onChange={handleChange} />
        <TestInput type="password" size="sm" color="error" onChange={handleChange} disabled="disabled" /> */}


        <MakeButton  />
      </div>
    </div>
  );
};

export default HighSchoolPage;
