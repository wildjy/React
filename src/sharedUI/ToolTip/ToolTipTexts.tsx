'use client';

/*
  TitleContainer 등에서 툴팁 텍스트를 렌더링할 때 사용하는 컴포넌트
  대학검색 - 검색결과 타이틀 에서 동일한 스타일로 사용하기 위해 분리
  InfoTransformText, InfoTransformItem - 리포트쪽 컴포넌트 에서도 사용됨
*/

interface ToolTipTextsProps {
  title?: React.ReactNode | string;
  text: React.ReactNode | string;
}

export const ToolTipTexts: React.FC<ToolTipTextsProps> = ({ title, text }) => {
  return (
    <>
      {title && (
        <p className="mb-2 text-gray-800 text-md">
          <b>{title}</b>
        </p>
      )}
      <p className="text-xs text-gray-500 sm:text-sm">{text}</p>
    </>
  );
};
