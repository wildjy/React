"use client";
import React from "react";
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { TextInput } from "../../sharedUI/Input/TextInput";
import { CheckBox } from "../../sharedUI/Input/CheckBox";
import { Radio } from "../../sharedUI/Input/Radio";
import Select from "../../sharedUI/Input/Select";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { Button } from "../../sharedUI/Button/Button";
import StepBars from "../../sharedUI/StepBar/Step";
import { StepBar } from "../../sharedUI/StepBar/StepBar";
import { ToastPopup } from "../../sharedUI/ToastPopup/ToastPopup";
import StepBarClick from "../../sharedUI/StepBar/StepBarClick";
import Title from "../../sharedUI/Title/TitleDemo";
import dynamic from 'next/dynamic';

import { SwiperSlide } from 'swiper/react';
import { SwiperSlider } from '../../sharedUI/Swiper/SwiperSlider';
import { lastIndexOf } from "lodash";
// const SwiperSlider = dynamic(() => import('../../sharedUI/Swiper/Swiper'), {
//   ssr: false
// });

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
  const [radioOptions, setRadioOptions] = useState<{
    [key: string]: string;
  }>({
    type: 'type_1',
    studentType: 'Go3',
    sex: 'male',
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRadioOptions((prevOptions) => {
      // console.log(prevOptions)
      return {
        ...prevOptions,
        [name]: value,
      }
    });
  };

  // checkbox
  //const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({
    checkbox_1: true,
    checkbox_2: true,
    checkbox_3: false,
    checkbox_4: false,
    checkbox_5: true,
    checkbox_6: false,
    checkbox_6_1: false,
    checkbox_6_2: false,
    checkbox_7: false,
    checkbox_8: false,
    checkbox_9: false,
    checkbox_10: false,
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
      { value: 'optionB', label: 'ㅇㅇ고등학교ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ 1' },
    ],
    select3: [
      { value: 'item1', label: 'Item 1' },
      { value: 'item2', label: 'Item 2' },
    ],
  };

  // stepBar
  const steps = [
    { label: "Step 1", name: "출신고교", url: "#1/" },
    { label: "Step 2", name: "성적입력",  url: "#2/" },
    { label: "Step 3", name: "모의지원",  url: "#3/" },
    { label: "Step 4", name: "저장소",  url: "#4/" },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const stepClicks = [
    { label: "Step 1", name: "출신고교", isCompleted: currentStep > 0 },
    { label: "Step 2", name: "성적입력",  isCompleted: currentStep > 1 },
    { label: "Step 3", name: "모의지원",  isCompleted: currentStep > 2 },
    { label: "Step 4", name: "저장소",  isCompleted: currentStep > 3 },
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


  const slidesCustom = [
    {
      width: 'auto',
      title: '슬라이드 1',
      sub_txt: "텍스트111~",
    },
    {
      width: 'auto',
      title: '슬라이드 1',
      sub_txt: "텍스트111~",
    },
    {
      padding: '60px',
      scale: '1.2',
      width: '400px',
      title: '슬라이드 2',
      sub_txt: "텍스트222~",
    },
    {
      width: 'auto',
      title: '슬라이드 3',
      sub_txt: "텍스트 333~",
    },
    {
      width: 'auto',
      title: '슬라이드 4',
      sub_txt: "텍스트 444~",
    },
  ];

  type Slide = {
    active?: string;
    title?: string;
    url?: string;
  };

  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const fetchSlides = [
      { active: '', title: '3.28 학력평가', url: '#/' },
      { active: 'active', title: '5.8 학력평가', url: '#/' },
      { active: '', title: '6.4 모의평가', url: '#/' },
      { active: '', title: '7.11 학력평가', url: '#/' },
      { active: '', title: '9.4 모의평가', url: '#/' },
      { active: '', title: '10.15 학력평가', url: '#/' },
    ];
    setSlides(fetchSlides);
  }, []);

  const slides_1 = [
    {
      active: '',
      title: '3월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '5월 학력평가',
      sub_txt: "텍스트111~",
    },
    {
      active: '',
      title: '6월 학력평가',
      sub_txt: "텍스트222~",
    },
    {
      active: '',
      title: '7월 학력평가',
      sub_txt: "텍스트 333~",
    },
    {
      active: '',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '10월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: '',
      title: '10월 학력평가',
      sub_txt: "텍스트 444~",
    },
    {
      active: 'active',
      title: '9월 학력평가',
      sub_txt: "텍스트 444~",
    },
  ];

  const slides_img = [
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/덕성여대(2).jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/국어_최서희.jpg',
    },
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: '',
      url: '#self',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/덕성여대(2).jpg',
    },
    {
      active: 'active',
      url: '',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
  ];
  const slides_img2 = [
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: 'active',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
    {
      active: '',
      url: 'https://swiperjs.com/demos',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/육군학과.jpg',
    },
    {
      active: '',
      url: '',
      imgUrl: 'https://board.jinhak.com/BoardV1/JinhakContent/BannerImage/20240902_272M.jpg',
    },
  ];

  const [toast, setToast] = useState(false);
  const OpenToast = () => {
    setToast(true);
    return;
  };

  return (
    <div id="contents" className="bg-gray-50">
      <div className="container">
      <div className="p-5 flex gap-y-7 flex-wrap">

        <div>
          <div className={`layer-popup ${ isVisible ? "is-visible border border-blue-700" : ""}`}>
            layer-popup
          </div>
          <Button onClick={handleCheckVisible}>체크</Button>

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
              addId="inp-1"
              label="이름"
              value={inputValue[0].name}
              onChange={(e) => handleInputChange(e, 0, "name")}
            />
            <TextInput
              type="text"
              addId="inp-2"
              label="수험생 이름"
              readonly="readonly"
              value={inputValue[0].readonly}
              onChange={(e) => handleInputChange(e, 0, "readonly")}
            />
            <TextInput
              type="text"
              addId="inp-3"
              label="disabled"
              disabled={true}
              value={inputValue[0].class}
              onChange={(e) => handleInputChange(e, 0, "class")}
            />
            <TextInput
              type="text"
              mode="success"
              addId="inp-4"
              label="success.."
              value={inputValue[1].success}
              onChange={(e) => handleInputChange(e, 1, 'success')}
              icon={<img src={inputValue[1].icon} className='w-6 h-6' />}
            />
            <TextInput
              type="text"
              mode="error"
              addId="inp-5"
              label="error.."
              value={inputValue[1].error}
              onChange={(e) => handleInputChange(e, 1, 'error')}
              icon={<img src={inputValue[1].icon} className='w-6 h-6' />}
            />
            <TextInput
              type="text"
              mode="ghost"
              addId="inp-6"
              label="ghost.."
              disabled={false}
              value={inputValue[0].school}
              onChange={(e) => handleInputChange(e, 0, "school")}
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
              mode="base"
              label="- item select -"
              disabled={true}
              options={selectOptions.select3}
              value={selectedValues.select3}
              onChange={handleSelectChange}
            />

          </div>
        </div>

        <div className="checkbox w-full">
          <Title title="Input [Type=checkbox]" size="md" bold="semi" />
          <div className="default_checkbox flex gap-3 flex-wrap">
            <CheckBox
              value="checkbox_1"
              checked={isChecked["checkbox_1"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              size="sm"
              value="checkbox_2"
              color="lineCheck"
              label="체크박스 2"
              checked={isChecked["checkbox_2"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              size="lg"
              value="checkbox_3"
              label="disabled "
              disabled={true}
              checked={isChecked["checkbox_3"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              value="checkbox_4"
              label="Checked 일때"
              disabled={true}
              checked={isChecked["checkbox_4"] || true}
              onChange={handleCheckChange}
            />
            <CheckBox
              round="full"
              value="checkbox_5"
              label="체크박스 5"
              checked={isChecked["checkbox_5"] || false}
              onChange={handleCheckChange}
            />
          </div>

          <div className="rectangle_checkbox flex gap-3 flex-wrap mt-5">
            <CheckBox
              mode="rectangle"
              value="checkbox_6"
              label="체크박스 6"
              checked={isChecked["checkbox_6"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              round="full"
              mode="rectangle"
              value="checkbox_6_1"
              label="체크박스 6_1"
              disabled={false}
              checked={isChecked["checkbox_6_1"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              color="fill"
              round="full"
              mode="rectangle"
              value="checkbox_6_2"
              label="checkbox_6_2"
              checked={isChecked["checkbox_6_2"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              mode="rectangle"
              value="checkbox_7"
              label="disabled"
              disabled={true}
              checked={isChecked["checkbox_7"] || false}
              onChange={handleCheckChange}
            />
          </div>

          <div className="text_checkbox flex gap-3 flex-wrap mt-5">
            <CheckBox
              mode="text"
              value="checkbox_8"
              label="체크박스 8"
              checked={isChecked["checkbox_8"] || false}
              onChange={handleCheckChange}
            />
            <CheckBox
              mode="text"
              value="checkbox_9"
              label="disabled"
              disabled={true}
              checked={isChecked["checkbox_9"] || false}
              onChange={handleCheckChange}
            />
          </div>

          <div className="icon_checkbox flex gap-3 flex-wrap mt-5">
            <CheckBox
              mode="icon"
              value="checkbox_10"
              label="체크박스 10"
              disabled={false}
              checked={isChecked["checkbox_10"] || false}
              onChange={handleCheckChange}
            />
          </div>
        </div>

        <div className="radio w-full">
          <Title title="Input [Type=radio]" size="md" bold="semi" />
          <div className="flex gap-3 flex-wrap">
            <Radio
              type="radio"
              label="고등학교 졸업(예정)자"
              name="type"
              value="type_1"
              checked={radioOptions.type === "type_1"} // checked
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              label="검정고시 출신자"
              name="type"
              value="type_2"
              checked={radioOptions.type === "type_2"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              label="검정고시 출신자"
              name="type"
              value="type_3"
              disabled={true}
              checked={radioOptions.type === "type_3"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              mode="check"
              label="고3"
              name="studentType"
              value="Go3"
              checked={radioOptions.studentType === "Go3"} // checked
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              mode="check"
              label="고1,2"
              name="studentType"
              value="Go12"
              checked={radioOptions.studentType === "Go12"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              mode="check"
              label="고1,2"
              name="studentType"
              value="Go4"
              disabled={true}
              checked={radioOptions.studentType === "Go4"}
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              size="sm"
              label="성별"
              name="sex"
              value="male"
              checked={radioOptions.sex === "male"} // checked
              onChange={handleRadioChange}
            />
            <Radio
              type="radio"
              size="lg"
              label="성별"
              name="sex"
              value="female"
              checked={radioOptions.sex === "female"}
              onChange={handleRadioChange}
            />
          </div>
        </div>

        <div className="button w-full">
          <Title title="Button" size="md" bold="semi" />

          <ButtonBox>
            <Button mode="secondary" round="full">취소</Button>
            <Button>확인</Button>
          </ButtonBox>

        </div>

        <div className="stepbar w-full">
          <Title title="StepBar" size="md" bold="semi" />

          {/* <StepBars steps={steps} currentStep={currentStep} onStepClick={handleStepClick} /> */}

          <StepBar step={steps} currentStep={0} />
          <StepBarClick step={stepClicks} currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="mt-5 w-full flex justify-between">
            <Button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} // 값들중 큰값을 반환, 0을 넘지 않음
              disabled={currentStep === 0}
              style={{
                cursor: currentStep === 0 ? "not-allowed" : "pointer",
                opacity: currentStep === 0 ? 0.5 : 1,
              }}>Previous</Button>
            <Button
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))} // 값들중 작은값을 반환, steps.length(최대)을 넘지 않음
              disabled={currentStep === steps.length - 1}
              style={{
                cursor: currentStep === steps.length - 1 ? "not-allowed" : "pointer",
                opacity: currentStep === steps.length - 1 ? 0.5 : 1,
              }}>Next</Button>
          </div>

        </div>

        <div className=" w-full">
          <Title title="Swiper" size="md" bold="semi" />

          <div>
            {/*
            <SwiperSlider id={"1"} slides={slides} pager={true} space={'1rem'} />
            <SwiperSlider id={"2"} slides={slides_img} images={true} pager={true} freeMode={false} space={'3rem'} loop={false} auto={false} delay={300} speed={1500} />
            <SwiperSlider id={'3'} slides={slides_img2} images={true} pager={true} freeMode={false} loop={false} auto={false} delay={300} speed={1500} space={'1rem'} />
            */}

            <div className="border-b border-gray-300">
              <SwiperSlider id={1} arrow pager={false} slides={[]}>
                {slides.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    style={{width: "auto" }}
                    className={`flex items-center justify-center w-auto `}
                  >
                    <div className={`pr-7 sm:pr-8 md:pr-14 lg:pr-0 last:pr-0 text-center ${ slide.active ? '' : ''}`}>
                      <a href="#self" className={`
                        ${slide.active}  block py-3 lg:px-10 xl:px-[3.167rem] lg:py-4 text-s sm:text-base md:text-lg lg:text-lg
                        ${slide.active ? 'text-blue-700 border-b-[0.313rem] border-blue-700 ' : ''}
                      `}>
                        <>
                          <p className='text-xl'>{slide.title}</p>
                          {/* <p className='text-0'>{slide.sub_txt}</p> */}
                        </>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </SwiperSlider>
            </div>

            <SwiperSlider id={2} arrow pager slides={[]}>
              {slides_img.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  style={{width: "auto" }}
                  className={`flex items-center justify-center w-auto pr-7 sm:pr-8 md:pr-14 lg:pr-0 last:pr-0`}
                >
                  <div className={`text-center ${ slide.active ? '' : ''}`}>
                    <a href="#self" className={`
                      ${slide.active}  block py-3 lg:py-4 text-s sm:text-base md:text-lg lg:text-lg
                      ${slide.active ? 'text-blue-700 border-b-[0.313rem] border-blue-700 ' : ''}
                    `}>
                      <>
                        <img src={slide.imgUrl} alt="" />
                        <p className=''>{slide.url}</p>
                      </>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </SwiperSlider>



            <Button onClick={OpenToast}>toast팝업 열기</Button>

            <ToastPopup child={true} isActive={toast} setToast={setToast} addClass="bottom-20">
              <b className="text-[#FFFC00]">[가군] 가야대 KMU International Business School</b>가 저장되었습니다.
            </ToastPopup>
            <ToastPopup
              isActive={toast}
              setToast={setToast}
              message={['[가군] Business School', '취소소']}
              setColor="text-[#FFFC00]"
            />
          </div>

        </div>

        <div className="w-full h-[500px] portrait:bg-blue-500 max-950:landscape:bg-green-500"></div>
      </div>


        {/* <Input baseTy onChange={handleChange} />
        <Input value="aa" ghost onChange={handleChange} readonly="readonly" />
        <Input onChange={handleChange} disabled={true}  />

        <TestInput type="password" size="sm" color="base" onChange={handleChange} />
        <TestInput type="password" size="sm" color="success" onChange={handleChange} />
        <TestInput type="password" size="sm" color="warning" onChange={handleChange} />
        <TestInput type="password" size="sm" color="error" onChange={handleChange} disabled={true} /> */}

      </div>
    </div>
  );
};

export default HighSchoolPage;
