"use client"
import React, { } from "react";
import dynamic from "next/dynamic";
import { pageData  } from "../../sharedUI/PageData/PageData";
import { Container } from "../../sharedUI/Layout/Container";
import { ContFull  } from "../../sharedUI/Layout/ContFull";
import { SubTop } from "../../sharedUI/Layout/SubTop";

import { StepBar } from "../../sharedUI/StepBar/StepBar";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

import { Title } from "../../sharedUI/Title/Title";
// import { SubTitle } from "../../sharedUI/Title/SubTitle";
import { GradeFlag } from "../../sharedUI/Flag/GradeFlag";
// import CustomRadio from "../../sharedUI/Input/CustomRadio";
import { InfoBox } from "../../sharedUI/Info/InfoBox";

import Table from "../../sharedUI/Table/Table";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { ButtonLink } from "../../sharedUI/Button/Link";

const gradeInsertPage = () => {

  const { steps, slides } = pageData;

  return (
    <>
      <Container>
        <StepBar step={steps} currentStep={1} />

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

        <SubTop>
          <div>
            <Title tag="h3" title="3.28 학력평가" sub="2024년 3월 28일 서울교육청" />
          </div>

          <div className="text-right">
            <GradeFlag type="flag1" label="실채점 집계중" />
          </div>
        </SubTop>

        {/* <SubTitle tag="h4">
          ※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다.
        </SubTitle> */}

        <InfoBox>
          <p className="text-2xs sm:text-xs md:text-base text-gray-400">
            3월 29일 오전 11시, 가채점 성적 확정 예정
          </p>
          <p className="text-xs sm:text-s md:text-lg">
            현재 표준점수/백분위/등급은 <span className="text-blue-800">전년도 기준 점수</span>입니다.
          </p>
        </InfoBox>

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
              <tr>
                <th>구분</th>
                <th>한국사</th>
                <th>국어 <span className="inline md:block">(화법과 작문)</span></th>
                <th>수학 <span className="inline md:block">(화법과 작문)</span></th>
                <th>영어</th>
                <th>한국지리</th>
                <th>물리학I</th>
                <th><span className="hidden md:block" >(제2외국어)</span>영어</th>
              </tr>
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
          <ButtonLink href="#/" mode="tertiary" >수정</ButtonLink>
          <ButtonLink href="#/" endIcon={["icon_btn_arrow.svg", "w-[0.45rem]"]}>모의지원</ButtonLink>
          */}
          <ButtonLink href="#/">저장</ButtonLink>
        </ButtonBox>


      </Container>
    </>
  )
}

export default gradeInsertPage;