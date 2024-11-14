"use client";
import React from "react";
import { useState, ChangeEvent } from "react";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import Radio from "../../sharedUI/Input/Radio";
import Select from "../../sharedUI/Input/Select";

const HighSchoolPage: React.FC = () => {
  // input
  const [inputValue, setInputValue] = useState([
    {
      name: "",
      phone: "",
      grade: "",
      class: "",
      school: "",
      icon: "https://image.jinhak.com/renewal2020/svg/input_radio.svg",
    },
    {
      name: "ㄱㄴㄷ",
      phone: "111-1111-1111",
      icon: "",
    },
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      console.log("Previous Values:", prevValues);

      return prevValues.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
    });
  };

  // radio
  // const [selectedOption , setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({
    type: '',
    studentType: '',
    sex: '',
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedOptions((prevOptions) => {
      console.log(prevOptions)
      return {
        ...prevOptions,
        [name]: value,
      }
    });
    console.log(`selected ${name} :`, value);
  };

  // checkbox
  //const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<{
    [key: string]: boolean
  }>({
    checkbox_1: false,
    checkbox_2: false,
    checkbox_3: false,
  });

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const checked = e.target.checked;
    const { value, checked } = e.target;
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [value]: checked,
    }));
    console.log(`Checked status: ${value}`, checked);
  };

  // select
  // 여러 Select 요소의 상태를 객체로 관리
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({
    select1: '', // selected option
    select2: '',
    select3: '',
  });

  // Select의 변경 사항을 관리하는 함수
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const selectOptions = {
    select1: [
      { value: 'option1', label: '2000' },
      { value: 'option2', label: '1999' },
    ],
    select2: [
      { value: 'optionA', label: 'ㅇㅇ고등학교' },
      { value: 'optionB', label: 'ㅇㅇ고등학교 1' },
    ],
    select3: [
      { value: 'item1', label: 'Item 1' },
      { value: 'item2', label: 'Item 2' },
    ],
  };

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
        <h2 className="p-4 text-3xl font-bold">출신고교(필수)</h2>

        <table className="border-t border-gray-900">
          <caption>출신고교 테이블</caption>
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "80%" }} />
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
                  inputSize="md"
                  addClass="border-gray-400"
                  addId="inp-1"
                  label="수험생 이름"
                  disabled="disabled"
                  value={inputValue[0].name}
                  onChange={(e) => handleInputChange(e, 0, "name")}
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="gradeType_1">학생구분</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <Radio
                    type="radio"
                    name="type"
                    label="고등학교 졸업(예정)자"
                    value="gradeType_1"
                    checked={selectedOptions.type === "gradeType_1"}
                    onChange={handleRadioChange}
                  />
                  <Radio
                    type="radio"
                    name="type"
                    label="검정고시 출신자"
                    value="gradeType_2"
                    checked={selectedOptions.type === "gradeType_2"}
                    onChange={handleRadioChange}
                  />
                  <Radio
                    type="radio"
                    name="type"
                    label="현 고1,2 학생"
                    value="gradeType_3"
                    checked={selectedOptions.type === "gradeType_3"}
                    onChange={handleRadioChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-2">졸업년도</label>
              </th>
              <td>
                <div className="flex items-center gap-4">
                  <Select
                    name="select1"
                    label="- 졸업년도 선택 -"
                    options={selectOptions.select1}
                    value={selectedValues.select1}
                    onChange={handleSelectChange}
                  />
                  <p>{selectedValues.select1}</p>

                  <TextInput
                    type="text"
                    mode="base"
                    inputSize="sm"
                    color="base"
                    addClass="border-gray-400"
                    addId="inp-2"
                    label="반"
                    value={inputValue[0].grade}
                    onChange={(e) => handleInputChange(e, 0, "grade")}
                  />{" "}
                  반
                  <TextInput
                    type="text"
                    mode="base"
                    inputSize="sm"
                    color="base"
                    addClass="border-gray-400"
                    addId="inp-3"
                    label="번"
                    value={inputValue[0].class}
                    onChange={(e) => handleInputChange(e, 0, "class")}
                  />{" "}
                  번
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="inp-4">출신 고등학교</label>
              </th>
              <td>
                <div className="flex items-center gap-4">
                  <TextInput
                    type="text"
                    mode="base"
                    inputSize="md"
                    color="base"
                    addClass="border-gray-400"
                    addId="inp-4"
                    label="고등학교 검색"
                    value={inputValue[0].school}
                    onChange={(e) => handleInputChange(e, 0, "school")}
                  />

                  <Select
                    name="select2"
                    color="ghost"
                    label="- 고등학교 유형선택 -"
                    options={selectOptions.select2}
                    value={selectedValues.select2}
                    onChange={handleSelectChange}
                  />
                  <p>{selectedValues.select2}</p>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="checkbox_1">학생유형</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <Radio
                    type="radio"
                    name="studentType"
                    label="일반학생"
                    value="studentType_1"
                    checked={selectedOptions.studentType === "studentType_1"}
                    onChange={handleRadioChange}
                  />
                  <Radio
                    type="radio"
                    name="studentType"
                    label="직업과정 위탁생"
                    value="studentType_2"
                    checked={selectedOptions.studentType === "studentType_2"}
                    onChange={handleRadioChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="checkbox_1">학생 성별</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <Radio
                    type="radio"
                    name="sexType"
                    label="남자"
                    value="sexType_1"
                    checked={selectedOptions.sexType === "sexType_1"}
                    onChange={handleRadioChange}
                  />
                  <Radio
                    type="radio"
                    name="sexType"
                    label="여자"
                    value="sexType_2"
                    checked={selectedOptions.sexType === "sexType_2"}
                    onChange={handleRadioChange}
                  />
                </div>
                <p className="mt-3"><a href="#self" className="text-blue-600 underline">수능성적 입력페이지</a> 에서 성별 수정이 가능합니다.</p>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="checkbox_1">지원성향</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <p>희망 전공 : <a href="#self" className="text-blue-600 underline">[설정하기]</a></p>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" className="border-t-gray-900 bg-gray-50">
                <label htmlFor="checkbox_1">학생 성별</label>
              </th>
              <td>
                <div className="flex gap-4 flex-wrap">
                  <CheckBox
                    value="checkbox_1"
                    label="체크박스 1"
                    checked={isChecked["checkbox_1"] || false}
                    onChange={handleCheckChange}
                  />
                  <CheckBox
                    value="checkbox_2"
                    label="체크박스 2"
                    checked={isChecked["checkbox_2"] || false}
                    onChange={handleCheckChange}
                  />
                  <CheckBox
                    value="checkbox_3"
                    label="체크박스 3"
                    checked={isChecked["checkbox_3"] || false}
                    onChange={handleCheckChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighSchoolPage;
