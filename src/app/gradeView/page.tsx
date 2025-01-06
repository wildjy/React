"use client"
import React, { useState, ChangeEvent } from "react";
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

  return (
    <>
      <div className="container overflow-hidden">
        <div className="m-center w-full md:w-[41.875rem]">
          <StepBar step={steps} currentStep={1} />
        </div>

        <div className="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </div>

        {/* <SubTop subText={false} flag={true} infoBox radioBox={false} /> */}

        <SubTop 
          subText ={false}
          flag={{visible: true, flag2: true}} 
          radioBox={false}
          infoBox={{
            visible: true,
            infoDate: "0월 00일 오전/오후 00시, 가채점 성적 확정 예정",
          }} 
        />

        <div className="mt-5 md:mt-6">

          <Table typeClass="tableType1">
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


      </div>
    </>
  )
}

export default gradeInsertPage;