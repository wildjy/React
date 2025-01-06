"use client"
import React, { useState, ChangeEvent } from "react";
import StepBar from "../../sharedUI/Stepbar/Stepbar";
import SubTop from "../../sharedUI/Layout/Sub_top";
import CustomRadio from "../../sharedUI/Input/CustomRadio";
import GradeTable from "../../sharedUI/Table/GradeInsertTable";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";
import dynamic from "next/dynamic";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
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
      active: "active",
      title: "3월 학력평가",
      url: "#/",
    },
    {
      active: "",
      title: "5월 학력평가",
      url: "#/",
    },
    {
      active: "",
      title: "6월 학력평가",
      url: "#/",
    },
    {
      active: "",
      title: "7월 학력평가",
      url: "#/",
    },
    {
      active: "",
      title: "9월 학력평가",
      url: "#/",
    },
    {
      active: "",
      title: "10월 학력평가",
      url: "#/",
    },
  ];

  // radio
  const [radioOptions, setRadioOptions] = useState<{[key: string]: string;}>({
    type: "type_1",
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRadioOptions((prevOptions) => {
      return {
        ...prevOptions,
        [name]: value,
      }
    });
  };

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: false,
  });

  const OpenEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  }

  return (
    <>
      <div className="container overflow-hidden">
        <div className="m-center w-full md:w-[41.875rem]">
          <StepBar step={steps} currentStep={1} />
        </div>

        <div className="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </div>

        <SubTop flag={false} infoBox={false} radioBox />


        {/* <div className="mt-10 flex justify-between relative">
          <div className="">
            <b className="md:text-xl">3.28 학력평가</b>
            <span className="hidden md:inline-block ml-2 text-gray-400">(2024년 3월 28일 서울교육청)</span>

            <p className="mt-5 text-2xs md:text-s text-gray-400">※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다.</p>
          </div>

          <div className="text-right">
            <div>
              <p className="inline-block px-6 py-2 text-s text-center text-gray-600 bg-grayBlue-100 rounded-full">
                가채점 집계중
              </p>
              <p className="inline-block px-6 py-2 text-s text-center text-[#3e4350] bg-[#eff3fc] rounded-full">
                가채점 확정
              </p>
              <p className="inline-block px-6 py-2 text-s text-center text-[#54AAD2] bg-[#EDFBF8] rounded-full">
                실채점 확정
              </p>
            </div>

            <CustomRadio>
              <CustomRadio.Radio
                type="radio"
                label="원점수"
                name="type"
                size="sm"
                value="type_1"
                checked={radioOptions.type === "type_1"}
                onChange={handleRadioChange}
              />
              <CustomRadio.Radio
                type="radio"
                label="표준점수"
                name="type"
                size="sm"
                value="type_2"
                checked={radioOptions.type === "type_2"}
                onChange={handleRadioChange}
              />
            </CustomRadio>
          </div>
        </div>

        <div className="mt-4 py-7 text-center border border-grayBlue-200 rounded-lg">
          <p className="text-xs md:text-base text-gray-400">3월 29일 오전 11시, 가채점 성적 확정 예정</p>
          <p className="text-s md:text-lg">현재 표준점수/백분위/등급은 <span className="text-blue-800">전년도 기준 점수</span>입니다.</p>
        </div> */}

        <div className="mt-5 md:mt-6 ">
          <GradeTable />
        </div>

        <ButtonBox>
          {/*
          <Link href="#/" mode="tertiary" >수정</Link>
          <Link href="#/" endIcon={["icon_btn_arrow.svg", "w-[0.45rem]"]}>모의지원</Link>
          */}
          <Link href="#/">저장</Link>
        </ButtonBox>


        <button type="button"
          onClick={() => OpenEventPopup("popup1")}
          className="inline-block py-3 w-[12rem] text-center border border-blue-700 rounded">팝업(default) 열기
        </button>

        <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup("popup1")}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className="w-[703px] h-[10rem]">
              <p className="text-xl">
                Body..
              </p>
              <p>
                컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
              </p>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className="flex justify-center">
              <a href="#self" className="px-5 py-3 text-center border border-blue-700 rounded" onClick={() => OpenEventPopup("popup1")}>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

      </div>
    </>
  )
}

export default gradeInsertPage;