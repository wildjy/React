"use client"
import React, { useState, ChangeEvent } from "react";
import { pageData  } from "../../sharedUI/PageData/PageData";
import Container from "../../sharedUI/Layout/Container";
import ContFull from "../../sharedUI/Layout/ContFull";
import StepBar from "../../sharedUI/Stepbar/Stepbar";
import SubTop from "../../sharedUI/Layout/Sub_top";
import CustomRadio from "../../sharedUI/Input/CustomRadio";
import GradeTable from "../../sharedUI/Table/GradeInsertTable";
import Table from "../../sharedUI/Table/Table";
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";
import dynamic from "next/dynamic";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

const gradeInsertPage = () => {

  const { steps, slides } = pageData;

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
          subDate="2024년 3월 28일 서울교육청"
          subText={{
            visible: false,
            text: "※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다."
          }}
          flag={{
            visible: true,
            flag1: true,
            flag2: false,
            flag3: false,
            flag4: false,
          }}
          radioBox={false}
          infoBox={{
            visible: true,
            infoDate: "0월 00일 오전/오후 00시, 가채점 성적 확정 예정",
          }}
        />

        <div className="">
          <Table typeClass="tableType1 mt-5" >
            <Table.Colgroup>
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
              <col style={{ width: "calc(100%/8)" }} />
            </Table.Colgroup>
            <Table.Thead thW="w-1/3">
              <th>구분</th>
              <th>한국사</th>
              <th>국어 <span className="inline md:block">(화법과 작문)</span></th>
              <th>수학 <span className="inline md:block">(화법과 작문)</span></th>
              <th>영어</th>
              <th>한국지리</th>
              <th>물리학I</th>
              <th><span className="hidden md:block" >(제2외국어)</span>영어</th>
            </Table.Thead>
            <Table.Tbody tdW="w-2/3">
              <tr>
                <td>표준점수</td>
                <td>95</td>
                <td>95</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>100</td>
                <td>95</td>
              </tr>
              <tr>
                <td>백분위</td>
                <td>100</td>
                <td>95</td>
                <td>100</td>
                <td>95</td>
                <td>100</td>
                <td>95</td>
                <td>100</td>
              </tr>
              <tr>
                <td>등급</td>
                <td>td 2</td>
                <td>td 3</td>
                <td>td 4</td>
                <td>td 5</td>
                <td>td 2</td>
                <td>td 3</td>
                <td>td 4</td>
              </tr>
            </Table.Tbody>
          </Table>
        </div>

        <ButtonBox>
          {/*
          <Link href="#/" mode="tertiary" >수정</Link>
          <Link href="#/" endIcon={["icon_btn_arrow.svg", "w-[0.45rem]"]}>모의지원</Link>
          */}
          <Link href="#/">저장</Link>
        </ButtonBox>


      </Container>
    </>
  )
}

export default gradeInsertPage;