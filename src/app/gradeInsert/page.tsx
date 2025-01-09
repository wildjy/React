"use client"
import React, { useState, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { pageData  } from "../../sharedUI/PageData/PageData";
import Container from "../../sharedUI/Layout/Container";
import ContFull from "../../sharedUI/Layout/ContFull";
import { SubTop } from "../../sharedUI/Layout/SubTop";

import StepBar from "../../sharedUI/StepBar/StepBar";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

import Title from "../../sharedUI/Title/Title";
import SubTitle from "../../sharedUI/Title/SubTitle";
// import GradeFlag from "../../sharedUI/Flag/GradeFlag";
import CustomRadio from "../../sharedUI/Input/CustomRadio";
// import InfoBox from "../../sharedUI/Info/InfoBox";

import GradeTable from "../../sharedUI/Table/GradeInsertTable";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const gradeInsertPage = () => {

  const { steps, slides } = pageData;

  // radio
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [radioOptions, setRadioOptions] = useState<{ [key: string]: string }>({
    type: "type_1",
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRadioOptions((prevOptions) => {
      return {
        ...prevOptions,
        [name]: value,
      };
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Container>
        <StepBar step={steps} currentStep={0} />

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

        <SubTop>
          <div>
            <Title tag="h3" title="3.28 학력평가" sub="2024년 3월 28일 서울교육청" />
          </div>

          <div className="text-right">
            {/* <GradeFlag type="flag1" label="실채점 집계중" /> */}

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
        </SubTop>

        <SubTitle tag="h4">
          ※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다.
        </SubTitle>

        {/* <InfoBox>
          <p className="text-xs md:text-base text-gray-400">
            patchInfoBox.infoDate
          </p>
          <p className="text-s md:text-lg">patchInfoBox.infoText</p>
        </InfoBox> */}

        <div>
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

      </Container>
    </>
  )
}

export default gradeInsertPage;