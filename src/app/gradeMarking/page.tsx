"use client"
import React, { useState } from "react";
import { pageData  } from "../../sharedUI/PageData/PageData";
import Container from "../../sharedUI/Layout/Container";
import ContFull from "../../sharedUI/Layout/ContFull";
import ContHalf from "../../sharedUI/Layout/ContHalf";
import StepBar from "../../sharedUI/StepBar/StepBar";
import SubTop from "../../sharedUI/Layout/Sub_top";
import GradeTable2 from "../../sharedUI/Table/GradeInsertTable2";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";
import dynamic from "next/dynamic";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

const gradeMarkingPage = () => {

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
            text: "채점하기",
          }}
          subText={{
            visible: true,
            text: "채점할 응시영역을 선택해주세요."
          }}
        />

        <div>
          <GradeTable2 />
        </div>

        <ButtonBox>
          <Link href="#/" mode="tertiary" >영역수정</Link>
          <Link href="#/" endIcon={["icon_btn_arrow.svg", "w-[0.45rem]"]}>성적입력</Link>
        </ButtonBox>

        <ContHalf addClass="bg-red-600" gap="gap-10 md:gap-7">
          <div>
            <SubTop
              subTitle={{
                visible: true,
                text: "문제정답 다운로드 ",
              }}
            />
          </div>
          <div>
            333
          </div>
        </ContHalf>

        <div className="flex flex-wrap md:flex-nowrap gap-10 md:gap-7">
          <div className="grow w-full bg-gray-100">
            left
          </div>
          <div className="grow w-full bg-gray-100">
            right
          </div>
        </div>

        <SubTop
          subTitle={{
            visible: true,
            text: "문제정답 다운로드 ",
          }}
        />


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

export default gradeMarkingPage;