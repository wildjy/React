"use client"
import React, { useState, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { pageData  } from "../../sharedUI/PageData/PageData";
import { Container } from "../../sharedUI/Layout/Container";
import { ContFull  } from "../../sharedUI/Layout/ContFull";
import { SubTop } from "../../sharedUI/Layout/SubTop";
import { SideADBanner } from "../../sharedUI/Banner/SideADBanner";
import { SideADRolling } from "../../sharedUI/Banner/SideADRolling";
import { BottomJson } from "../../sharedUI/Banner/BottomJson";
import { BottomRolling } from "../../sharedUI/Banner/BottomRolling";

import { StepBar } from "../../sharedUI/StepBar/StepBar";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

import { Title } from "../../sharedUI/Title/Title";
import { SubTitle } from "../../sharedUI/Title/SubTitle";
import CustomRadio from "../../sharedUI/Input/CustomRadio";
import Table from "../../sharedUI/Table/Table";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { ButtonLink } from "../../sharedUI/Button/Link";

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

  const datas = [
    {
      badge: {
        imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_1.jpg',
        clickUrl:
          'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/22_NesinP/L22/1768910538/x01/JINHAK/hongik_2023_0410_173x182/hongik_2023_0410_173x182.html/792f7563516d67416f573441446d7746',
        openInExternalBrowser: '1',
      },
    },
    {
      badge: {
        imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_2.jpg',
        clickUrl:
          'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/22_NesinP/L22/98121208/x01/JINHAK/2408_iajou_173x182/2408_iajou_173x182_240903.html/792f7563516d67416f573441446d7746',
        openInExternalBrowser: '1',
      },
    },
  ];

  return (
    <>
      <Container>

        <SideADBanner
          datas={[
            {
              badge: {
                imgurl: 'https://image.jinhak.com/jinhakImages/banner/storybook/side_ad_1.jpg',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhakinfo/22_NesinP/L22/98121208/x01/JINHAK/2408_iajou_173x182/2408_iajou_173x182_240903.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '1',
              },
            },
          ]}
        />
        <SideADRolling time={1000} datas={datas} controls addClass="top-[300px]" />
        <SideADRolling type="fixed" align="right" datas={datas} />

        <StepBar step={steps} currentStep={0} />

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

        <p>안녕하세요</p>
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

        <BottomJson datas={[
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_dankook_WMNesinL_564x91_1/dankook240704_564x91.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1479641528/x01/JINHAK/2505_dankook_WMNesinL_564x91_1/2505_dankook_WMNesinL_564x91_1_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_joongbu_WMNesinL_564x91_2/joongbu240816_564x91.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1834219446/x02/JINHAK/2505_joongbu_WMNesinL_564x91_2/2505_joongbu_WMNesinL_564x91_2_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
          ]}/>

        <BottomRolling
          leftTime={3500}
          rightTime={1500}
          controls
          leftBanners={[
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_dankook_WMNesinL_564x91_1/dankook240704_564x91.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1479641528/x01/JINHAK/2505_dankook_WMNesinL_564x91_1/2505_dankook_WMNesinL_564x91_1_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_joongbu_WMNesinL_564x91_2/joongbu240816_564x91.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1834219446/x02/JINHAK/2505_joongbu_WMNesinL_564x91_2/2505_joongbu_WMNesinL_564x91_2_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_seowon_WMNesinL_564x91_3/seowon240910_564x91re.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinL/L17/1310221744/x03/JINHAK/2505_seowon_WMNesinL_564x91_3/2505_seowon_WMNesinL_564x91_3_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
          ]}
          rightBanners={[
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2505_konyang_WMNesinR_564x91_1/konyang220621_564x91.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinR/L17/1144723437/x01/JINHAK/2505_konyang_WMNesinR_564x91_1/2505_konyang_WMNesinR_564x91_1_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
            {
              badge: {
                imgurl:
                  'https://navycdn.contentsfeed.com/RealMedia/ads/Creatives/JINHAK/2503_gachon_WMNesinR_564x91_2/gachon210107_564x91r.jpg',
                imageHeight: '91',
                clickUrl:
                  'https://wads.jinhak.com/RealMedia/ads/click_lx.ads/U_jinhak/WMNesinR/L17/704474922/x02/JINHAK/2503_gachon_WMNesinR_564x91_2/2503_gachon_WMNesinR_564x91_2_250514.html/792f7563516d67416f573441446d7746',
                openInExternalBrowser: '0',
              },
            },
          ]}
        />

      </Container>
    </>
  )
}

export default gradeInsertPage;