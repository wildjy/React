import { ButtonBox } from '../Button/ButtonBox';
import { ButtonLink } from '../Button/Link';
import { Spinner } from '../Loading/Spinner';

export interface CalcInfoProps {
  datas?: {
    name?: string;
    time?: string;
    label?: string;
    text?: string;
    button?: {
      label: string;
      href: string;
    };
  };
}

export const CalcInfo: React.FC<CalcInfoProps> = ({ datas }) => {
  return (
    <div className="py-9 md:py-13">
      <Spinner addClass="w-11 h-11 sm:w-13 sm:h-13" />
      <div className={`mt-4 md:mt-6 flex flex-wrap justify-center text-center text-gray-800`}>
        <div className="w-full">
          <p className="text-lg sm:text-lg md:text-2xl">
            <b>{datas?.name}님의 성적을 계산하는 중입니다.</b>
          </p>
          <p className="mt-2 md:mt-4 text-md md:text-base">
            정확한 결과를 제공해 드리고자 계산과정에 <span className="text-red-500">약 {datas?.time || '3'}분</span> 정도의 시간이 소요되니{' '}
            <br />
            잠시만 기다려 주시기 바랍니다.
          </p>
        </div>

        <div
          className={`
            mt-9 flex flex-wrap justify-start
            text-xs md:text-base
            text-left
          `}
        >
          <p className="w-full text-red-500">
            <b>이용 Tip!</b>
          </p>
          <ul>
            <li>
              계산중에도 {datas?.label}과 같은 다른 메뉴 이용이 가능합니다.
              <br />
              (해당 메뉴를 나가거나 로그아웃하셔도 내부 시스템에서 계속 계산됩니다.)
            </li>
            <li>계산은 최초 이용시에 이루어지며, {datas?.text || '수능/내신/기본정보'} 등을 수정한 경우 다시 재계산됩니다.</li>
          </ul>
        </div>

        {datas?.button && (
          <ButtonBox addClass="w-full">
            <ButtonLink href={datas?.button.href} mode="tertiary" tag="div">
              {datas?.button.label}
            </ButtonLink>
          </ButtonBox>
        )}
      </div>
    </div>
  );
};
