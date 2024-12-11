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