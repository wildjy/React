"use client";
import React from "react";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";

const Conditional: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const handleVisible = () => {
    setVisible((prev) => prev = !prev)
  }
  return (
    <>

      <div className="mt-5 p-6 border border-gray-400">
        <p className="text-lg"><b>조건문 랜더링</b></p>
        <div className="mt-3">
          <p className="mb-3"><b>특정 조건에 맞는 랜더링을 구현 </b></p>
        </div>

        <div>
          <b className="block text-gray-900">1. 기본문법</b>
          <pre>
            {`
            { value && (
              true
            )},
            (value ? (
              true
            ) : (
              false
            )}


            return (
              {visible && (
                <>
                  <p>value : false..</p>
                </>
              )}

              Or..

              { visible ? (
                <p>value : true..</p>
               ) : (
                <> // or <div> wrapping..
                  <p>value : false..</p>
                  <p>value : false..</p>
                </>
               )}

               Or..

              { visible ? (
                <p>value : true..</p>
               ) : null }
              <p>${visible}</p>
            )
            `}
          </pre>
        </div>

        <div>
          <b className="block text-gray-900">2. 반복문</b>
          <pre>
            {`
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

              >>> map 이용하여 개선

              const flagItems = [{
                flagType: flag?.flag1,
                text: '가채점 집계중',
                textColor: 'text-gray-600',
                textBg: 'bg-grayBlue-100',
              }, {
                ...
              }]

              {flag?.visible && (
                <div>
                  {
                    flagItems.map((item, index) => item.flagType && (
                      <p key={index} className={'inline-block px-6 py-2 text-s text-center {item.textColor} {item.textBg} rounded-full'}>
                        {item.text}
                      </p>
                    ))
                  }
                </div>
              )}
            `}
          </pre>
        </div>

        <div>
          <b className="block text-gray-900">3. props 기본값, 덮어쓰기(useMemo 활용)</b>
          <pre>
            {`
              <SubTop
                infoBox={{
                  visible: false,
                  infoDate: "3월 29일 오전 11시, 가채점 성적 확정 예정",
                  infoText: (
                    <>
                    현재 표준점수/백분위/등급은 <span className="text-blue-800">전년도 기준 점수</span>입니다.
                    </>
                  ),
                }}
              />

              interface subTopProps {
                infoBox?: {
                  visible: boolean;
                  infoDate?: string;
                  infoText?: React.ReactNode;
                };
              }

              const SubTop: React.FC<subTopProps> = ({
                infoBox = {},
              }) => {
                const InfoBoxs = useMemo(() => ({
                  visible: false,
                  infoDate: "ㅇㅇㅇㅇㅇ",
                  infoText: (<>ㅇㅇ ㅇㅇㅇㅇ <span className="text-blue-800">올해 기준 점수</span>입니다.</>),
                  ...infoBox, // 스프레드 연산자 (Spread Operator) 전달된 infoBox 속성 덮어쓰기
                }), [infoBox]);
                ...

                {InfoBoxs?.visible && (
                  <p>{InfoBoxs.infoText}</p>
                )}
            `}
          </pre>
        </div>

        <div className="mt-4 p-6 border border-gray-400">
          <p><b>Sample</b></p>
          <div>count : { visible &&(
            <>
              <span>true = true</span>
            </>
          )}</div>

          <div>count : { visible ? (
            <>
              <span>true = true</span>
            </>
          ) : (
            <>
              <span>false = false</span>
            </>
          )}</div>
          <button
            type="button"
            className="px-5 py-2 border border-gray-500 rounded"
            onClick={ handleVisible }
            >
            <span className="text-error">Click!</span>
          </button>
        </div>
      </div>

    </>
  )
}

export default Conditional;