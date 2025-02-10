
"use client";
import React, { } from "react";
import { InfoTextBox } from "../../sharedUI/Info/InfoTextBox";
import { InfoText } from "../../sharedUI/Info/InfoText";
import { ButtonBox } from "../../sharedUI/Button/ButtonBox";
import { ButtonLink } from "../../sharedUI/Button/Link";
// import { CheckBox } from "../../sharedUI/Input/CheckBox";


const InfoBoxPage = () => {
  const infoText = [
    { text: '정확한 표준점수는 성적 입력을 통해 확인할 수 있습니다.' },
    { text: '데이터 표집하여 서비스 준비중이며, 내일 11시 예상 등급컷 업데이트 예정입니다.' },
  ];

  const InfoTexts = [
    {
      text: (
        <>
          <span className="text-[#EC0045]">
            진학닷컴 회원 정보(아이디/비밀번호)를 타인에게 공유하는 행위를 금지 하며,1인 1아이디 사용을 원칙으로 합니다.{' '}
          </span>
          <a href="#/" className="underline">
            [관련 이용 약관]
          </a>
        </>
      ),
    },
    {
      text: (
        <>
          <span className="">
            합격예측 서비스는 대학 진학을 앞둔 수험생, 학부모를 위한 참고용 자료 로서, 대학/학과를 결정하는 절대적인 기준이 아닙니다. 따라서
            합격예측 결과가 일치하지 않을 수 있으니 반드시 참고용으로만 활용해주시기 바랍 니다.
          </span>
        </>
      ),
    },
  ];

  return(
    <>
    <div>
      <InfoText texts={infoText} />

      <InfoTextBox>
        <InfoText texts={infoText} addClass="text-gray-400" />
      </InfoTextBox>

      <InfoTextBox type="bg" addClass="bg-grayBlue-50">
        <InfoText texts={InfoTexts} addClass="text-gray-400" />

        <ButtonBox addClass="w-full mt-4 md:mt-0 md:w-auto">
          <ButtonLink href="#/" size="auto" endIcon={['icon_btn_arrow.svg', 'w-[0.35rem]']}>
            성적입력
          </ButtonLink>
        </ButtonBox>
      </InfoTextBox>
    </div>
    </>
  )
}

export default InfoBoxPage;