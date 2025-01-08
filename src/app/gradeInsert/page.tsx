"use client"
import React, { useState } from "react";
import { pageData  } from "../../sharedUI/PageData/PageData";
import Container from "../../sharedUI/Layout/Container";
import ContFull from "../../sharedUI/Layout/ContFull";
import StepBar from "../../sharedUI/StepBar/StepBar";
import SubTop from "../../sharedUI/Layout/Sub_top";
import GradeTable from "../../sharedUI/Table/GradeInsertTable";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";
import dynamic from "next/dynamic";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

const gradeInsertPage = () => {

  const { steps, slides } = pageData;

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
        <div className="m-center w-full md:w-[41.875rem]">
          <StepBar step={steps} currentStep={1} />
        </div>

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

        <SubTop
          subTitle={{
            visible: true,
            text: "3.28 학력평가",
          }}
          subDate={{
            visible: true,
            text: "2024년 3월 28일 서울교육청"
          }}
          flag={{
            visible: false,
            flag1: true,
            // flag2: true, 추정
            // flag3: true, 가채점 확정
            // flag4: true, 실채점 확정
            text: "가채점 집계중",
          }}
          subText={{
            visible: true,
            text: "※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다."
          }}
          radioBox
          infoBox={{
            visible: false,
            infoDate: "3월 29일 오전 11시, 가채점 성적 확정 예정",
            infoText: (
              <>
              현재 표준점수/백분위/등급은 <span className="text-blue-800">전년도 기준 점수</span>입니다.
              </>
            ),
          }}
        />

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