
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

  return(
    <>
    <div>
      <InfoText texts={infoText} />

      <InfoTextBox>
        <InfoText texts={infoText} addClass="text-gray-400" />
      </InfoTextBox>

      <InfoTextBox type="bg" addClass="bg-grayBlue-50">
        <InfoText texts={infoText} addClass="text-gray-400" />

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