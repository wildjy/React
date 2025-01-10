/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { pageData  } from "../../sharedUI/PageData/PageData";
import { Container } from "../../sharedUI/Layout/Container";
import { ContFull  } from "../../sharedUI/Layout/ContFull";
import { ContSlot } from "../../sharedUI/Layout/ContSlot";
import { SubTop } from "../../sharedUI/Layout/SubTop";

import Accordion from "../../sharedUI/Accordion/Accordion";

import { StepBar } from "../../sharedUI/StepBar/StepBar";
const SwiperSlider = dynamic(() => import("../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

import { Title } from "../../sharedUI/Title/Title";

import { GradeTable2 } from "../../sharedUI/Table/GradeInsertTable2";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { ButtonLink } from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

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
        <StepBar step={steps} currentStep={1} />

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

      <Accordion motion={false}>
        <Accordion.Item>
          <Accordion.Top size="sm">
          아코디언.Top1
          </Accordion.Top>
          <Accordion.Bottom addClass="bg-white">
            <Accordion motion={true}>
              <Accordion.Item addClass='first:border-t-0'>
                <Accordion.Top>
                아코디언 Sub .Top1
                </Accordion.Top>
                <Accordion.Bottom>
                  <Accordion motion={true}>
                    <Accordion.Item addClass='first:border-t-0'>
                      <Accordion.Top>
                      아코디언 Sub333 .Top1
                      </Accordion.Top>
                      <Accordion.Bottom addClass='bg-white'>
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                      </Accordion.Bottom>
                    </Accordion.Item>
                    <Accordion.Item addClass='border-b-0'>
                      <Accordion.Top>
                      아코디언 Sub33 .Top2
                      </Accordion.Top>
                      <Accordion.Bottom addClass='bg-white'>
                        아코디언 Sub33 .Bottom2<br />
                        아코디언 Sub33 .Bottom2<br />
                        아코디언 Sub33 .Bottom2
                      </Accordion.Bottom>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Bottom>
              </Accordion.Item>
              <Accordion.Item addClass='border-b-0'>
                <Accordion.Top>
                아코디언 Sub .Top2
                </Accordion.Top>
                <Accordion.Bottom>
                  아코디언 Sub .Bottom2<br />
                  아코디언 Sub .Bottom2<br />
                  아코디언 Sub .Bottom2
                </Accordion.Bottom>
              </Accordion.Item>
            </Accordion>
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top size="lg" icon="arrow">
          아코디언.Top2
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom2<br />
          아코디언.Bottom2<br />
          아코디언.Bottom2
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top icon="arrow">
          아코디언.Top2
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom2<br />
          아코디언.Bottom2<br />
          아코디언.Bottom2
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top icon="plus">
          아코디언.Top3
          </Accordion.Top>
          <Accordion.Bottom>

            <button type="button"
              onClick={() => OpenEventPopup('popup1')}
              className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(default) 열기
            </button>

            <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
              <LayerPopup.Header>
                <p className="text-4xl"><b>Header</b></p>
              </LayerPopup.Header>

              <LayerPopup.Body>
                <div className='h-[10rem]'>
                  <p className="text-xl">
                    Body..
                  </p>
                  <p>
                    컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
                  </p>
                </div>
              </LayerPopup.Body>

              <LayerPopup.Footer>
                <div className='flex justify-center'>
                  <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>Footer</a>
                </div>
              </LayerPopup.Footer>
            </LayerPopup>
          </Accordion.Bottom>
        </Accordion.Item>
      </Accordion>

        <SubTop>
          <Title tag="h3" title="3.28 학력평가" sub="2024년 3월 28일 서울교육청" />
        </SubTop>

        <div>
          <GradeTable2 />
        </div>

        <ButtonBox>
          <ButtonLink href="#/" mode="tertiary" >영역수정</ButtonLink>
          <ButtonLink href="#/" endIcon={["icon_btn_arrow.svg", "w-[0.45rem]"]}>성적입력</ButtonLink>
        </ButtonBox>

        <ContSlot addClass="grid-cols-1 md:grid-cols-2 gap-10 md:gap-7">
          <div className="bg-white">
            <Title tag="h3" title="채점하기" sub="채점할 응시영역을 선택하세요." />
          </div>
          <div>
            22
          </div>
        </ContSlot>

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