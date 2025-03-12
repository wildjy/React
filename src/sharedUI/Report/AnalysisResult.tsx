
'use client';
import { InfoTextBox } from '../Info/InfoTextBox';
import { Arrow } from '../Flag/Arrow';

interface AnalysisResultProps {
  Analysis: { label?: string; score?: string | [string, boolean] }[];
  name?: string;
  myScore?: string;
  type?: 'type1' | 'type2' | 'type3' | 'type4' | 'type5' | 'type6';
  score?: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ Analysis, name, myScore, type = 'type1', score }) => {
  const defaultType = {
    type1: { label: '안정지원', txtColor: 'text-[#8393D6]', color1: '#8393D6', color2: '#C2C9E9' },
    type2: { label: '적정지원', txtColor: 'text-[#54AEC8]', color1: '#54AEC8', color2: '#84D8F0' },
    type3: { label: '소신지원', txtColor: 'text-[#99CC33]', color1: '#99CC33', color2: '#E5FABB' },
    type4: { label: '위험지원', txtColor: 'text-[#B2B1B1]', color1: '#B2B1B1', color2: '#E7E7E7' },
    type5: { label: '매우위험', txtColor: 'text-[#7D7D7D]', color1: '#7D7D7D', color2: '#C0C0C0' },
    type6: { label: '계산불가', txtColor: 'text-[#999]', color1: 'white', color2: 'white' },
  };

  const types = defaultType[type];

  return (
    <div>
      <InfoTextBox type="line" align="center" addClass="mt-0 md:mt-0 text-2xs sm:text-sm md:text-base text-center border1 border-blue-800">
        <p>
          <span className="block md:inline">{name}님의 수능예측점수를 기준으로 계산한</span>
          대학환산점수는 {myScore}점으로 <b className={`${types.txtColor}`}>{types.label}</b>으로 예측됩니다.
        </p>
      </InfoTextBox>
      <div className="flex items-center my-7">
        <div className="mx-5 md:mx-7 w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] md:w-[5rem] md:h-[5rem] xl:w-[7.5rem] xl:h-[7.5rem] relative">
          {type === 'type6' ? ( <div className='w-full h-full border border-gray-400 rounded-full'></div>) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="48" fill="url(#paint0_radial_1693_4796)" />
            <defs>
              <radialGradient
                id="paint0_radial_1693_4796"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(96 -40.2) rotate(112.62) scale(124.8)"
              >
                <stop offset="0.0121951" stopColor={types.color2} stopOpacity="0.5" />
                <stop offset="0.865" stopColor={types.color1} />
              </radialGradient>
            </defs>
          </svg>
          )}
          <p
            className={`${type === 'type6' ? types.txtColor : 'text-white'} w-full text-center
            absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 md:-translate-y-[50%]
             text-xs sm:text-base xl:text-xl
            `}
          >
            {types.label}
          </p>
        </div>
        <div className="lg:mx-7 grow">
          <ul className="flex-wrap md:flex text-2xs sm:text-sm md:text-base xl:text-lg">
            {Analysis.map((item, index) => (
              <li
                key={index}
                className={`pt-2 first:pt-0 md:pt-0 md:w-1/4 flex flex-wrap justify-between items-center ${
                  index === 0 ? 'text-left' : index === Analysis.length - 1 ? 'text-right' : 'text-center'
                }`}
              >
                <span className="text-gray-500 border-gray-100 md:pb-3 md:border-b md:block md:w-full">{item.label}</span>
                <span
                  className={`md:pt-3 text-gray-800 ${
                    index === 0 ? 'justify-start' : index === Analysis.length - 1 ? 'justify-end' : 'justify-center'
                  } flex md:w-full`}
                >
                  {index === Analysis.length - 1 ? (
                    <>
                      <b className="flex items-center gap-1">
                        <Arrow type={item.score?.[1]} />
                        {item.score?.[0]}
                      </b>
                      점
                    </>
                  ) : (
                    <>
                      <b>{item.score}</b>점
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
