/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { pageData  } from "../../../sharedUI/PageData/PageData";
import { Container } from "../../../sharedUI/Layout/Container";
import { ContFull  } from "../../../sharedUI/Layout/ContFull";
import { DownLoadTable } from "..//DownLoadTable";
import { SubTop } from "../../../sharedUI/Layout/SubTop";

import { StepBar } from "../../../sharedUI/StepBar/StepBar";
const SwiperSlider = dynamic(() => import("../../../sharedUI/Swiper/SwiperTab"), {
  ssr: false
});

import { Title } from "../../../sharedUI/Title/Title";

import Table from "../../../sharedUI/Table/Table";
import { TextInput } from '../../../sharedUI/Input/TextInput';
import { DropDown } from '../../../sharedUI/DropDown/DropDown';

import { ButtonBox } from "../../../sharedUI/Button/ButtonBox";
import { ButtonLink } from "../../../sharedUI/Button/Link";
import LayerPopup from "../../../sharedUI/LayerPopup/LayerPopup";

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


  const dropOptions = {
    dropOption1: [
      { value: '1', label: '화법과 작문' },
      { value: '2', label: '언어와 매체' },
    ],
    dropOption2: [
      { value: '1', label: '확률과 통계' },
      { value: '2', label: '미적분' },
      { value: '3', label: '가하' },
    ],
    dropOption3: [
      { value: '1', label: '사/과탐' },
      { value: '2', label: '직탐' },
    ],
    dropOption4: [
      { value: '1_1', label: '사회문학' },
      { value: '1_2', label: '생활과윤리' },
      { value: '1_3', label: '정치와법' },
      { value: '1_4', label: '윤리와사상' },
      { value: '1_5', label: '경제' },
    ],
    dropOption5: [
      { value: '2_1', label: '물리학 Ⅰ' },
      { value: '2_2', label: '화학 Ⅰ' },
      { value: '2_3', label: '생물학 Ⅰ' },
      { value: '2_4', label: '지구과학 Ⅰ' },
      { value: '2_5', label: '물리학 Ⅰ' },
    ],
    dropOption6: [
      { value: '1', label: '농업기초기술' },
      { value: '2', label: '공업일반' },
      { value: '3', label: '상업경제' },
      { value: '4', label: '수산해운산업기초' },
      { value: '5', label: '인간발달' },
    ],
  };

  interface OptionType {
    value: string;
    label: string;
  }

  const [selectedOption, setSelectedOption] = useState<{ [key: string]: OptionType | null }>({
    drop1: {
      value: 'a',
      label: '화법과 작문',
    },
    drop2: {
      value: 'b',
      label: '확률과 통계',
    },
    drop3: {
      value: '2_2',
      label: '화학 Ⅰ',
    },
  });

  const handleChange = (key: string, option: OptionType) => {
    console.log('Selected Option:', option);
    setSelectedOption((prevState) => ({
      ...prevState,
      [key]: option,
    }));
  };

  // input
  const [inputValue, setInputValue] = useState([
    { score: 'score1', value: '' },
    { score: 'score2', value: '' },
    { score: 'score3', value: '' },
    { score: 'score4', value: '' },
    { score: 'score5', value: '' },
    { score: 'score6', value: '' },
    { score: 'score7', value: '' },
    { score: 'score8', value: '' },
    { score: 'score9', value: '' },
    { score: 'score10', value: '' },
  ]);

  // const updated = [...inputValue];
  // updated[index].value = e.target.value;
  // setInputValue(updated);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const prevValues = [...inputValue];
    console.log('updated:', prevValues);
    prevValues[index].value = e.target.value;
    setInputValue(prevValues);

    // const newValue = e.target.value;

    // setInputValue((prevValues) => {
    //   console.log('Previous Values:', prevValues.value);
    //   return prevValues.map((item, i) => (i === index ? { ...item, [field]: newValue } : item));
    // });
  };

  return (
    <>
      <Container>
        <StepBar step={steps} currentStep={0} />

        <ContFull addClass="mt-9 md:mt-11">
          <SwiperSlider id={1} slides={slides} />
        </ContFull>

        <SubTop>
          <Title tag="h3" title="채점하기" />
        </SubTop>

        <Table typeClass="mt-5">
          <Table.Colgroup>
            <col width="20%" />
            <col width="15%" />
            <col className="hide" />
            <col width="15%" />
            <col width="15%" />
          </Table.Colgroup>
          <Table.Thead>
            <th>구분</th>
            <th>원점수</th>
            <th className="hide">
              <span className="flex justify-center gap-8">
                <span>표점</span>
                <span>백분위</span>
                <span>등급급</span>
              </span>
            </th>
            <th>채점</th>
            <th>결과</th>
          </Table.Thead>
          <Table.Tbody>
            <tr>
              <td>한국사</td>
              <td>99</td>
              <td className="hide">
                <span className="flex justify-center gap-8">
                  <span className="text-gray-400">정답 발표 후 결과 확인</span>
                </span>
              </td>
              <td>
                <ButtonLink href="#/" size="sm" onClick={() => OpenEventPopup('popup1')}>
                  채점
                </ButtonLink>
              </td>
              <td>
                <ButtonLink href="https://www.jinhak.com" mode="tertiary" size="sm">
                  결과보기
                </ButtonLink>
              </td>
            </tr>
            <tr>
              <td>한국사</td>
              <td>85(72+13)</td>
              <td className="hide">
                <span className="flex justify-center gap-8">
                  <span>64</span>
                  <span>100</span>
                  <span>9</span>
                </span>
              </td>
              <td>
                <ButtonLink href="#/" size="sm">
                  채점
                </ButtonLink>
              </td>
              <td>
                <ButtonLink href="https://www.jinhak.com" mode="tertiary" size="sm" disabled>
                  결과보기
                </ButtonLink>
              </td>
            </tr>
          </Table.Tbody>
        </Table>

        <ButtonBox>
          <ButtonLink href="#/" mode="tertiary">
            영역수정
          </ButtonLink>
          <ButtonLink href="#/">성적입력</ButtonLink>
        </ButtonBox>

        <DownLoadTable />

        <LayerPopup
          type="full"
          align="center"
          closeType="default"
          addClass="px-6 pt-6 pb-6 md:px-11 md:pt-7 md:pb-13 md:rounded-lg"
          isOpen={isOpenPopup.popup1}
          OpenEvent={() => OpenEventPopup('popup1')}
        >
          <LayerPopup.Header>
            <DropDown
              options={dropOptions.dropOption2}
              layer
              min="min-w-[9rem]"
              value={selectedOption.drop1}
              onChange={(option) => handleChange('drop1', option)}
              label="선택 layer"
            />
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className="mt-5 w-full md:w-[52.75rem] xl:w-[53.75rem]">
              <div className="flex flex-wrap items-center w-full border-t border-t-gray-700">
                {inputValue.map((item, index) => {
                  return (
                    <div key={index} className="flex flex-col w-1/5 md:w-[10%] border-b">
                      <div className="py-4 bg-grayBlue-100 ">{index + 1}</div>
                      <div className="flex items-center px-3 h-[2.5rem] sm:h-[2.8rem] md:h-[3.437rem]">
                        {index < 45 && (
                          <TextInput
                            type="text"
                            size="sm"
                            align="center"
                            addId={`inp-${index + 1}`}
                            label={`${index + 1}`}
                            value={item.value}
                            onChange={(e) => {
                              handleInputChange(e, index);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center w-full mt-10">
                <div className="flex flex-col md:w-[10%] w-1/5">
                  <div className="p-2 bg-gray-200 border-black border-y">1</div>
                  <div className="px-3 py-3">
                    <div className="text-red-500">2</div>
                    <div className="text-red-500">X</div>
                  </div>
                </div>
              </div>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className="flex justify-center">
              <a href="#self" className="px-5 py-3 text-center border border-blue-700 rounded" onClick={() => OpenEventPopup('popup1')}>
                Footer
              </a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>
      </Container>
    </>
  )
}

export default gradeMarkingPage;