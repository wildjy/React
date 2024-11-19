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
import Title from "../../sharedUI/Title/Title";

const HighSchoolPage: React.FC = () => {
  // input
  const [inputValue, setInputValue] = useState([
    {
      name: "",
      phone: "",
      readonly: "readonly",
      class: "",
      school: "",
      icon: "https://image.jinhak.com/renewal2020/svg/input_radio.svg",
    },
    {
      name: "",
      phone: "111-1111-1111",
      success: "Success",
      error: "Error",
      icon: "https://image.jinhak.com/renewal2020/svg/input_radio.svg",
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

  // radio
  // const [selectedOption , setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({
    type: 'type_1',
    studentType: '',
    sex: '',
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedOptions((prevOptions) => {
      // console.log(prevOptions)
      return {
        ...prevOptions,
        [name]: value,
      }
    });
  };

  // checkbox
  //const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<{
    [key: string]: boolean
  }>({
    checkbox_1: true,
    checkbox_2: false,
    checkbox_3: false,
    checkbox_4: false,
    checkbox_5: true,
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

  // select
  // 여러 Select 요소의 상태를 객체로 관리
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({
    select1: '', // selected option
    select2: '',
    select3: '',
    select4: '',
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
  const steps = [
    { label: "Step 1", isCompleted: currentStep > 0 },
    { label: "Step 2", isCompleted: currentStep > 1 },
    { label: "Step 3", isCompleted: currentStep > 2 },
    { label: "Step 4", isCompleted: currentStep > 3 },
  ];

  const handleStepClick = (stepIndex: number) => {
    console.log(stepIndex)
    setCurrentStep(stepIndex);
  };

  // isCheck addClass
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleCheckVisible = () => {
    setIsVisible((checkStatus) => !checkStatus);
  }

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
      <div className="p-5 flex gap-y-7 flex-wrap">

        <div>
          <div className={`layer-popup ${ isVisible ? "is-visible border border-blue-700" : ""}`}>
            layer-popup
          </div>
          <Button name="체크" onClick={handleCheckVisible} />

          <select name="" id="">
            <option value="">select..</option>
            {
              selectOptions.select1.map ((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))
            }
          </select>
        </div>

        <div className="input_text w-full">
          <Title title="Input [Type=text]" mode="base" size="md" color="base" bold="semi" />

          <div className="md:flex md:gap-3 md:flex-wrap">
            <TextInput
              type="text"
              size="sm"
              mode="base"
              addId="inp-2"
              label="이름"
              value={inputValue[0].name}
              onChange={(e) => handleInputChange(e, 0, "name")}
            />
            <TextInput
              type="text"
              mode="readonly"
              size="md"
              addId="inp-1"
              label="수험생 이름"
              value={inputValue[0].readonly}
              onChange={(e) => handleInputChange(e, 0, "readonly")}
            />
            <TextInput
              type="text"
              mode="disabled"
              size="md"
              addId="inp-1"
              label="수험생 이름"
              value={inputValue[0].class}
              onChange={(e) => handleInputChange(e, 0, "class")}
            />
            <TextInput
              type="text"
              mode="success"
              addId="inp"
              label="success.."
              value={inputValue[1].success}
              onChange={(e) => handleInputChange(e, 1, 'success')}
              icon={<img src={inputValue[1].icon} className='w-6 h-6' />}
            />
            <TextInput
              type="text"
              mode="error"
              addId="inp"
              label="error.."
              value={inputValue[1].error}
              onChange={(e) => handleInputChange(e, 1, 'error')}
              icon={<img src={inputValue[1].icon} className='w-6 h-6' />}
            />
          </div>
        </div>

        <div className="select w-full">
          <Title title="Select" size="md" bold="semi" addClass="text-error" />

          <div className="md:flex md:gap-3 md:flex-wrap">
            <Select
              name="select1"
              label="- 년도 선택 -"
              options={selectOptions.select1}
              value={selectedValues.select1}
              onChange={handleSelectChange}
            />

            <Select
              name="select2"
              size="lg"
              label="- 고등학교 선택 -"
              options={selectOptions.select2}
              value={selectedValues.select2}
              onChange={handleSelectChange}
            />

            <Select
              name="select3"
              mode="disabled"
              label="- item select -"
              options={selectOptions.select3}
              value={selectedValues.select3}
              onChange={handleSelectChange}
            />

          </div>
        </div>

        <div className="checkbox w-full">
          <Title title="Input [Type=checkbox]" size="md" bold="semi" />
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
            value="checkbox_3"
            label="체크박스 3"
            checked={isChecked["checkbox_3"] || false}
            onChange={handleCheckChange}
          />
          <CheckBox
            mode="disabled"
            value="checkbox_4"
            label="체크박스 4"
            checked={isChecked["checkbox_4"] || false}
            onChange={handleCheckChange}
          />
          <CheckBox
            mode="check"
            value="checkbox_5"
            label="체크박스 5"
            checked={isChecked["checkbox_5"] || false}
            onChange={handleCheckChange}
          />
          </div>
        </div>

        <div className="radio w-full">
          <Title title="Input [Type=radio]" size="md" bold="semi" />
          <div className="flex gap-3 flex-wrap">
            <Radio
              type="radio"
              size="sm"
              name="type"
              label="고등학교 졸업(예정)자"
              value="type_1"
              checked={selectedOptions.type === "type_1"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              name="type"
              label="검정고시 출신자"
              value="type_2"
              checked={selectedOptions.type === "type_2"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              size="lg"
              mode="check"
              name="type"
              label="현 고1,2 학생"
              value="type_3"
              checked={selectedOptions.type === "type_3"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              mode="disabled"
              name="type"
              label="현 고1,2 학생"
              value="type_4"
              checked={selectedOptions.type === "type_4"}
              onChange={handleRadioChange}
            />
          </div>
        </div>

        <div className="button w-full">
          <Title title="Button" size="md" bold="semi" />

          <Button
            name="확인"
          />
          <Button
            mode="secondary"
            round="full"
            name="ㅇㅇㅇ바로가기"
          />

        </div>

        <div className="button w-full">
          <Title title="StepBar" size="md" bold="semi" />

          <StepBars steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

          <StepBar step={steps} currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="mt-5 w-full flex justify-between">
            <Button
              name="Previous"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} // 값들중 큰값을 반환, 0을 넘지 않음
              disabled={currentStep === 0}
              style={{
                cursor: currentStep === 0 ? "not-allowed" : "pointer",
                opacity: currentStep === 0 ? 0.5 : 1,
              }}
            />
            <Button
              name="Next"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))} // 값들중 작은값을 반환, steps.length(최대)을 넘지 않음
              disabled={currentStep === steps.length - 1}
              style={{
                cursor: currentStep === steps.length - 1 ? "not-allowed" : "pointer",
                opacity: currentStep === steps.length - 1 ? 0.5 : 1,
              }}
             />
          </div>

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
