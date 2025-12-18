import React from 'react';
import { iconType, NoData } from '../NoData/NoData';
import { InfoText } from './InfoText';
import { ButtonBox, ButtonLink } from '../Button';

interface InfoNoDataProps {
  iconType?: iconType;
  title?: string | React.ReactNode;
  subTxt?: string | React.ReactNode;
  infoTxt?: { label: string | React.ReactNode; color?: string };
  tip?: { text: string | React.ReactNode; addClass?: string }[];
  button?: { label: string; url: string };
  addClass?: string;
}

export const InfoNoData: React.FC<InfoNoDataProps> = ({
  iconType = 'info',
  title,
  subTxt,
  infoTxt = { label: '', color: '' },
  tip,
  button,
  addClass,
}) => {
  return (
    <NoData icon={iconType} addClass={addClass}>
      <div className="flex flex-col items-center justify-center">
        <p className={`text-base sm:text-lg md:text-xl`}>
          <b>{title}</b>
        </p>
        <p className="mt-2 text-xs md:mt-4 sm:text-md md:text-base md:whitespace-pre">
          {subTxt}
        </p>

        <p
          className={`mt-2 text-xs sm:text-md md:text-base ${
            infoTxt.color ?? 'text-red-800'
          }`}
        >
          {infoTxt.label}
        </p>

        {tip && (
          <div
            className={`mt-7 md:mt-8 lg:mt-9 px-6 py-5 text-left bg-grayBlue-50`}
          >
            <p className="mb-3 text-red-800 underline">
              <b>이용 Tip!</b>
            </p>
            <InfoText texts={tip.map((t) => ({ text: t.text }))} />
          </div>
        )}
      </div>

      {button && (
        <ButtonBox>
          <ButtonLink
            tag="a"
            href={button.url}
            mode="tertiary"
            addClass="px-12"
          >
            {button.label}
          </ButtonLink>
        </ButtonBox>
      )}
    </NoData>
  );
};
