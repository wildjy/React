"use client";
import React from "react";
import { useState, ChangeEvent } from "react";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import Radio from "../../sharedUI/Input/Radio";

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
                  color="base"
                  addClass="border-gray-400"
                  addId="inp-1"
                  label="수험생 이름"
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
                  <select name="" id="" className="p-2 border border-gray-400">
                    <option value="0">- 졸업년도 선택 -</option>
                  </select>
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
                    label="일반학생"
                    value="sexType_1"
                    checked={selectedOptions.sexType === "sexType_1"}
                    onChange={handleRadioChange}
                  />
                  <Radio
                    type="radio"
                    name="sexType"
                    label="직업과정 위탁생"
                    value="sexType_2"
                    checked={selectedOptions.sexType === "sexType_2"}
                    onChange={handleRadioChange}
                  />
                  <p className=""><a href="#self" className="">수능성적 입력페이지</a> 에서 성별 수정이 가능합니다.</p>
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
