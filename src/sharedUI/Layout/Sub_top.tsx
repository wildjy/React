"use client";
import React, { useMemo, useState, ChangeEvent } from 'react';
import CustomRadio from "../Input/CustomRadio";

interface subTopProps {
  subTitle?: {
    visible: boolean;
    text?: string;
  };
  subDate?: {
    visible: boolean;
    text?: string;
  };
  subText?: {
    visible: boolean;
    text?: string;
  };
  flag?: {
    visible: boolean;
    text?: string;
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
  subDate = {},
  flag = {
    visible: false,
    text: "",
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

  const patchSubTitle = useMemo(() => ({
    visible: false,
    text: "ㅇㅇㅇ",
    ...subTitle,
  }), [subTitle]);

  const patchSubDate = useMemo(() => ({
    visible: false,
    text: "ㅇㅇㅇ",
    ...subDate,
  }), [subDate]);

  const patchSubText = useMemo(() => ({
    visible: false,
    text: "ㅇㅇㅇ",
    ...subText,
  }), [subText]);

  const patchInfoBox = useMemo(() => ({
    visible: false,
    infoDate: "ㅇㅇㅇㅇㅇ",
    infoText: (<>ㅇㅇ ㅇㅇㅇㅇ <span className="text-blue-800">올해 기준 점수</span>입니다.</>),
    ...infoBox,
  }), [infoBox]);

  const flagItems = [{
    flagType: flag?.flag1, // 집계중
    text: flag?.text,
    textColor: "text-gray-600",
    textBg: "bg-grayBlue-100",
  }, {
    flagType: flag?.flag2, // 추정
    text: flag?.text,
    textColor: "text-[#EDA67C]",
    textBg: "bg-[#FDF6EB]",
  }, {
    flagType: flag?.flag3, // 가채점 확정
    text: flag?.text,
    textColor: "text-[#6E87CA]",
    textBg: "bg-[#F3F6FE]",
  }, {
    flagType: flag?.flag4, // 실채점 확정
    text: flag?.text,
    textColor: "text-[#54AAD2]",
    textBg: "bg-[#EDFBF8]",
  }]

  return (
    <>
      <div className="mt-8 md:mt-10 relative">
        <div className="flex flex-wrap justify-between ">
          <div>
            {patchSubTitle?.visible && (
              <b className="md:text-2xl">{patchSubTitle.text}</b>
            )}
            {patchSubDate?.visible && (
              <span className="hidden md:inline-block ml-6 text-gray-400">({patchSubDate.text})</span>
            )}
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

        {patchSubText?.visible && (
        <div className='mt-4 w-full'>
          <p className="text-3xs md:text-s text-gray-400">{patchSubText.text}</p>
        </div>
        )}
      </div>

      {patchInfoBox?.visible && (
        <div className="mt-5 py-5 sm:py-7 text-center border border-grayBlue-200 rounded-lg">
          <p className="text-xs md:text-base text-gray-400">{patchInfoBox.infoDate}</p>
          <p className="text-s md:text-lg">{patchInfoBox.infoText}</p>
        </div>
      )}
    </>
  )
}

export default SubTop;