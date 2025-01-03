"use client";
import React, { useState, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import StepBar from "../../sharedUI/Stepbar/Stepbar";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Button from "../../sharedUI/Button/Button";
import Link from "../../sharedUI/Button/Link";
import TextInput from "../../sharedUI/Input/TextInput";
import CheckBox from "../../sharedUI/Input/CheckBox";
import GradeTable from "../../sharedUI/Table/GradeInsertTable";
const SwiperSlider = dynamic(() => import('../../sharedUI/Swiper/SwiperTab'), {
  ssr: false
});

const gradeInsertPage = () => {

  // stepBar
  const steps = [
    { label: "Step 1", name: "출신고교", url: "#1/" },
    { label: "Step 2", name: "성적입력",  url: "#2/" },
    { label: "Step 3", name: "모의지원",  url: "#3/" },
    { label: "Step 4", name: "저장소",  url: "#4/" },
  ];

  // swiper tab
  const slides = [
    {
      active: 'active',
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
  ];

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
    const { value, checked } = e.target;
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [value]: checked,
    }));
  };

  return (
    <>
      <div className='virtual-Layout p-6 sm:p-7 md:p-10 w-full'>
        <div className='m-center w-full md:w-[41.875rem]'>
          <StepBar step={steps} currentStep={2} />
        </div>

        <div className='mt-9 md:mt-11'>
          <SwiperSlider id={1} slides={slides} />
        </div>

        <div className="overflow-hidden mt-5 md:mt-6 ">
          <GradeTable />
        </div>

        <ButtonBox>
          <Link href="#/" mode="tertiary" >수정</Link>
          <Link href="#/" endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>모의지원</Link>
          <Link href="#/">저장</Link>
        </ButtonBox>
      </div>
    </>
  )
}

export default gradeInsertPage;