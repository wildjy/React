"use client";
import React, { useMemo, useState, ChangeEvent } from 'react';
import CustomRadio from "../Input/CustomRadio";

interface subTopProps {
  subTitle?: {
    visible: boolean;
    text?: string;
  };
  subDate?: string;
  subText?: {
    visible: boolean;
    text?: string;
  };
  flag?: {
    visible: boolean;
    flag1?: boolean;
    flag2?: boolean;
    flag3?: boolean;
    flag4?: boolean;
  };
  radioBox?: boolean;
  infoBox?: {
    visible: boolean;
    infoDate?: string;
    infoText?: React.ReactNode;
  };
}

const SubTop: React.FC<subTopProps> = ({
  subTitle = {},
  subText = {},
  subDate = "20xx년 0월 0일 XXXX 학력평가",
  flag = {
    visible: false,
    flag1: false,
    flag2: false,
    flag3: false,
    flag4: false,
  },
  radioBox = false,
  infoBox = {},
}) => {

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

  const SubTitles = useMemo(() => ({
    visible: false,
    text: "ㅇㅇㅇ",
    ...subTitle,
  }), [subTitle]);

  const SubTexts = useMemo(() => ({
    visible: false,
    text: "ㅇㅇㅇ",
    ...subText,
  }), [subText]);

  const InfoBoxs = useMemo(() => ({
    visible: false,
    infoDate: "ㅇㅇㅇㅇㅇ",
    infoText: (<>ㅇㅇ ㅇㅇㅇㅇ <span className="text-blue-800">올해 기준 점수</span>입니다.</>),
    ...infoBox,
  }), [infoBox]);

  const flagItems = [{
    flagType: flag?.flag1,
    text: "가채점 집계중",
    textColor: "text-gray-600",
    textBg: "bg-grayBlue-100",
  }, {
    flagType: flag?.flag2,
    text: "실채점 집계중",
    textColor: "text-gray-600",
    textBg: "bg-grayBlue-100",
  }, {
    flagType: flag?.flag3,
    text: "가채점 확정",
    textColor: "text-[#3e4350]",
    textBg: "bg-[#eff3fc]",
  }, {
    flagType: flag?.flag4,
    text: "가채점 확정",
    textColor: "text-[#54AAD2]",
    textBg: "bg-[#EDFBF8]",
  }]

  return (
    <>
      <div className="mt-8 md:mt-10 relative">
        <div className="flex flex-wrap justify-between ">
          <div>
            {SubTitles?.visible && (
              <b className="md:text-2xl">{SubTitles.text}</b>
            )}
            <span className="hidden md:inline-block ml-6 text-gray-400">({subDate})</span>
          </div>

          <div className="text-right">
            {flag?.visible && (
              <div>
                {
                  flagItems.map((item, index) => item.flagType && (
                    <p key={index} className={`inline-block px-4 md:px-6 py-2 text-3xs md:text-s text-center ${item.textColor} ${item.textBg} rounded-full`}>
                      {item.text}
                    </p>
                  ))
                }
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

        {SubTexts?.visible && (
        <div className='mt-4 w-full'>
          <p className="text-3xs md:text-s text-gray-400">{SubTexts.text}</p>
        </div>
        )}
      </div>

      {InfoBoxs?.visible && (
        <div className="mt-5 py-5 sm:py-7 text-center border border-grayBlue-200 rounded-lg">
          <p className="text-xs md:text-base text-gray-400">{InfoBoxs.infoDate}</p>
          <p className="text-s md:text-lg">{InfoBoxs.infoText}</p>
        </div>
      )}
    </>
  )
}

export default SubTop;