'use client';
import { Arrow } from '../Flag/Arrow';

interface ScoreAnalysisProps {
  gapScore?: string;
  gapValue?: string;
  arrowType?: boolean;
  data: { label?: string; score?: string | [string, boolean] }[];
}

export const ScoreAnalysis: React.FC<ScoreAnalysisProps> = ({ gapScore, gapValue, data }) => {
  return (
    <div>
      <p className="pb-4 text-center text-gray-800 border-b border-gray-100 md:pb-6 text-2xs sm:text-sm md:text-md lg:text-base xl:text-lg">
        지원가능점수와 나의 점수차이 {gapScore}점은 , 수능 원점수로 약 {gapValue}점 정도입니다.
      </p>
      {/* px-[3rem] md:px-[5rem] lg:px-[12.5rem]  */}
      <ul className="flex-wrap justify-center mt-4 md:flex md:mt-6 text-2xs sm:text-sm md:text-md lg:text-base">
        {data.map((item, index) => (
          <li key={index} className="px-[3rem] md:px-0 w-full md:w-auto flex flex-wrap justify-between md:gap-x-[5rem] md:first:mr-[7rem]">
            <span className="flex items-center w-1/2 md:w-auto">{item.label}</span>
            <span className="flex items-center justify-end w-1/2 gap-2 md:w-auto md:justify-start">
              약 <Arrow type={item.score?.[1]} />
              {item.score?.[0]} 점
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
