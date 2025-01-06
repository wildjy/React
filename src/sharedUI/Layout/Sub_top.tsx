"use client";
import React, { useMemo, useState, ChangeEvent } from 'react';
import CustomRadio from "../Input/CustomRadio";

interface subTopProps {
  subText?: boolean;
  flag?: {
    visible: boolean;
    flag1?: boolean;
    flag2?: boolean;
    flag3?: boolean;
  };
  radioBox?: boolean;
  infoBox?: {
    visible: boolean;
    infoDate?: string;
    infoText?: React.ReactNode; 
  };
}

const SubTop: React.FC<subTopProps> = ({
  subText = false,
  flag = {
    visible: false,
    flag1: false,
    flag2: false,
    flag3: false,
  },
  radioBox = false,
  infoBox = {},
}) => {
  const mergedInfoBox = useMemo(() => ({
    visible: false,
    infoDate: "ㅇㅇㅇㅇㅇ",
    infoText: (<>ㅇㅇ ㅇㅇㅇㅇ <span className="text-blue-800">올해 기준 점수</span>입니다.</>),
    ...infoBox, // 전달된 infoBox 속성 덮어쓰기
  }), [infoBox]);

  console.log(infoBox)

  // radio
  const [radioOptions, setRadioOptions] = useState<{[key: string]: string;}>({
    type: 'type_1',
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

  return (
    <>
      <div className="mt-10 flex justify-between relative">
        <div className="">
          <b className="md:text-xl">3.28 학력평가</b>
          <span className="hidden md:inline-block ml-2 text-gray-400">(2024년 3월 28일 서울교육청)</span>

          {subText && (
            <p className="mt-5 text-3xs md:text-s text-gray-400">※ 표준점수를 입력하시면 백분위, 등급은 자동 계산되어 보여집니다.</p>
          )}
        </div>

        <div className="text-right">
          {flag?.visible && (
          <div>
            {flag?.flag1 && (
              <p className="inline-block px-6 py-2 text-s text-center text-gray-600 bg-grayBlue-100 rounded-full">
              가채점 집계중
              </p>
            )}
            {flag?.flag2 && (
              <p className="inline-block px-6 py-2 text-s text-center text-[#3e4350] bg-[#eff3fc] rounded-full">
                가채점 확정
              </p>
            )}
            {flag?.flag3 && (
              <p className="inline-block px-6 py-2 text-s text-center text-[#54AAD2] bg-[#EDFBF8] rounded-full">
                실채점 확정
              </p>
            )}
          </div>
          )}

          {radioBox && (
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
          )}
        </div>
      </div>

      {mergedInfoBox?.visible && (
        <div className="mt-6 py-5 sm:py-7 text-center border border-grayBlue-200 rounded-lg">
          <p className="text-xs md:text-base text-gray-400">{mergedInfoBox.infoDate}</p>
          <p className="text-s md:text-lg">{mergedInfoBox.infoText}</p>
        </div>
      )}
    </>
  )
}

export default SubTop;