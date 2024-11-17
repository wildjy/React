"use client";
import React from "react";
import { useState, ChangeEvent } from 'react';
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import Radio from "../../sharedUI/Input/Radio";
import Select from "../../sharedUI/Input/Select";
import Button from "../../sharedUI/Button/ButtonUi";
import StepBars from "../../sharedUI/Stepbar/Step";
import StepBar from "../../sharedUI/Stepbar/Stepbar";

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

  // step
  const [currentStep, setCurrentStep] = useState(0);
  console.log(currentStep)
  const steps = [
    { label: "Step 1", isCompleted: currentStep > 0 },
    { label: "Step 2", isCompleted: currentStep > 1 },
    { label: "Step 3", isCompleted: currentStep > 2 },
    { label: "Step 4", isCompleted: currentStep > 3 },
  ];

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">

      <div className="p-5 flex gap-y-7 flex-wrap">
        <div className="input_text w-full">
          <h2 className="p-4 text-3xl font-bold">Input [Type=text]</h2>
          <div className="flex gap-3 flex-wrap">
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
            />
            <TextInput
              type="text"
              mode="base"
              inputSize="md"
              addClass="border-gray-400"
              addId="inp-1"
              label="수험생 이름"
              value={inputValue[0].name}
              onChange={(e) => handleInputChange(e, 0, "name")}
            />
            <TextInput
              type="text"
              mode="base"
              color="disabled"
              disabled="disabled"
              inputSize="md"
              addClass="border-gray-400"
              addId="inp-1"
              label="수험생 이름"
              value={inputValue[0].name}
              onChange={(e) => handleInputChange(e, 0, "phone")}
            />
            <TextInput
              type="text"
              mode="focus"
              value={inputValue[0].name}
              onChange={(e) => handleInputChange(e, 1, 'grade')}
              size="sm"
              color="ghost"
              addClass="py-4"
              addId="inp"
              icon={<img src={inputValue[0].icon} className='w-6 h-6' />}
              label="수험생 연락처"
            />
          </div>
        </div>

        <div className="select w-full">
          <h2 className="p-4 text-3xl font-bold">Select</h2>
          <div className="flex gap-3 flex-wrap">

            <Select
              name="select1"
              label="- 년도 선택 -"
              options={selectOptions.select1}
              value={selectedValues.select1}
              onChange={handleSelectChange}
            />

            <Select
              name="select2"
              label="- 고등학교 선택 -"
              options={selectOptions.select2}
              value={selectedValues.select2}
              onChange={handleSelectChange}
            />

            <Select
              name="select3"
              color="disabled"
              disabled="disabled"
              label="- item select -"
              options={selectOptions.select3}
              value={selectedValues.select3}
              onChange={handleSelectChange}
            />

          </div>
        </div>

        <div className="checkbox w-full">
          <h2 className="p-4 text-3xl font-bold">Input [Type=checkbox]</h2>
          <div className="flex gap-3 flex-wrap">

          <CheckBox
            size="sm"
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
            size="lg"
            color="disabled"
            disabled="disabled"
            value="checkbox_3"
            label="체크박스 3"
            checked={isChecked["checkbox_3"] || false}
            onChange={handleCheckChange}
          />
          </div>
        </div>

        <div className="radio w-full">
          <h2 className="p-4 text-3xl font-bold">Input [Type=radio]</h2>
          <div className="flex gap-3 flex-wrap">
            <Radio
              type="radio"
              size="sm"
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
              size="lg"
              color="disabled"
              disabled="disabled"
              name="type"
              label="현 고1,2 학생"
              value="gradeType_3"
              checked={selectedOptions.type === "gradeType_3"}
              onChange={handleRadioChange}
            />
          </div>
        </div>

        <div className="button w-full">
        <h2 className="p-4 text-3xl font-bold">Button</h2>
          <Button
            name="확인"
          />

          <StepBars steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} // 값들중 큰값을 반환, 0을 넘지 않음
              disabled={currentStep === 0}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ccc",
                border: "none",
                cursor: currentStep === 0 ? "not-allowed" : "pointer",
                opacity: currentStep === 0 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))} // 값들중 작은값을 반환, steps.length(최대)을 넘지 않음
              disabled={currentStep === steps.length - 1}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                cursor: currentStep === steps.length - 1 ? "not-allowed" : "pointer",
                opacity: currentStep === steps.length - 1 ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>

          <StepBar step={steps} currentStep={currentStep} />




        </div>
      </div>


        {/* <Input baseTy onChange={handleChange} />
        <Input value="aa" ghost onChange={handleChange} readonly="readonly" />
        <Input onChange={handleChange} disabled="disabled"  />

        <TestInput type="password" size="sm" color="base" onChange={handleChange} />
        <TestInput type="password" size="sm" color="success" onChange={handleChange} />
        <TestInput type="password" size="sm" color="warning" onChange={handleChange} />
        <TestInput type="password" size="sm" color="error" onChange={handleChange} disabled="disabled" /> */}


      </div>
    </div>
  );
};

export default HighSchoolPage;
