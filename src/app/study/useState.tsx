"use client";
import React from "react";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";

const UseStatePage: React.FC = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  console.log(count);

  const handleCount = () => {
    setCount(count + 1);
    countRef.current += 1;
    console.log("Ref value:", countRef.current);
  }
  return (
    <>
      <div className="mb-8">
        <p className="mb-4"><b>1. useState</b></p>
        <p className="mb-4">- 상태(state) 관리 훅, 함수형 컴포넌트에서 상태를 추가/관리, 동적으로 변하는 데이터를 추적하여 재렌더링</p>
        <div className="p-6 border border-gray-400">
          <p className="mb-3">count = 상태변수(초기값), setCount =  상태 업데이트 함수, useState(0) = 초기값은 0</p>
          <div>
            <pre>
              {`
              import { useState } from "react";

              const [count, setCount] = useState(0);
              const [state, setState] = useState(initialValue);
              // console : count = 0, state = initialValue

              useState의 타입을 지정할 때는 제네릭 타입 (<string>)을 사용해야 합니다.

              const [name, setName] = useState<string>('');
              const [age, setAge] = useState<number>(0);

              const [selectRadio, setSelectRadio] = useState({[key: string] : string})({
                type: '',
                sex: '',
                grade: '',
              })
              // {type: '', sex: '', grade: ''}

              const [checkCheckBox, setCheckCheckBox] = useState({[key: string]: string})({
                type: false,
                sex: false,
                grade: false,
              })
              // {type: false, sex: false, grade: false}
              `}
            </pre>
          </div>

          <div className="mt-4 p-6 border border-gray-400">
            <p><b>Sample</b></p>
            <p>count : { count }</p>
            <button
              type="button"
              className="px-5 py-2 border border-gray-500 rounded"
              onClick={ handleCount }
              >
              <span className="text-error">Click!</span> count + 1
            </button>
          </div>
        </div>

        <div className="mt-5 p-6 border border-gray-400">
          <p className="text-lg"><b>상태 업데이트 방식</b></p>
          <div className="mt-3">
            <b className="block text-gray-900">1. 새로운 값</b>
            <pre>
              {`
              const handleCount = () => {
                setCount(count + 1);
              }

              // Use
              <p>count : { count }</p>
              <button
                type="button"
                onClick={ handleCount }
                >
                Click! count + 1
              </button>
              `}
            </pre>
          </div>

          <div className="mt-3">
            <b className="block text-gray-900">2. 이전 상태를 기반으로 관리</b>
            <pre>
              {`

              const [count, setCount] = useState(0)
              const handleCount = () => {
                setCount((prevCount) => prevCount + 1) ;
              }

              const handleCount = () => {
                setCount((prevCount) => {
                  // console.log(prevCount);
                  return {
                    prevCount + 1;
                  }
                })
              }

              // boolean
              const [check, setCheck] = useState(false);

              const handleCheck = () => {
                setCheck((prevCheck) => prevCheck = !prevCheck); // true <=> false
              }


              // 1. 동적필드 [name]
              const [value, setValue] = useState<>({
                type1: '',
                type2: '',
              })

              const handleValue = (e: ChangeEvent<HTMLSelectElement>) => {
                const {name, value} = e.target;
                setValue((prevValue) => ({
                  ...prevValue,
                  [name]: value,
                }))
              }

              // 1. 특정필드 name
              const [testArray, setTestArray] = useState([
                {
                  name: 'F-16',
                  type: 'light',
                },
                {
                  name: 'su-57',
                  type: 'heavy',
                },
              ])

              const handleChange = (index: number, newName: string, newType: string) => {
                setTestArray((prevValue) => {
                  return prevValue.map((item, i) =>
                    i === index ? {...item, name: newName, type: newType} : item
                  )
                })
              }
              `}
            </pre>
          </div>

          <div className="mt-3">
            <b className="block text-gray-900">3. 여러 상태 변수 관리</b>
            <span>하나의 컴포넌트에서 여러개의 useState를 사용 가능.</span>
            <pre>
              {`
              const [name, setName] = useState<string>('');
              const [age, setAge] = useState<number>(0);
              `}
            </pre>
          </div>

          <div className="mt-3">
            <b className="block text-gray-900">4. 객채 상태 변수 관리</b>
            <pre>
              {`
              const [user, setUser] = useState({
                name : '',
                age : 0
              });

              const [users, setUsers] = useState([
                {
                  name : 'useState',
                  age : 0,
                },
                {
                  name : 'useEffect',
                  age : 10,
                },
              ])

              const handleNameChange = (newName) => {
                setUsers((prevName) => ({
                  ...prevName,
                  name: newName
                }))

                // setUsers((prevName) = {
                //   console.log(prevName)
                //   return {
                //     ...prevName,
                //     name: newName
                //   }
                // })
              };

              // Use
              <button onClick={ () => handleNameChange('new name!!')}></button>


              const handleMultiValue = (index: number, newName: string, newAge: number) => {
                setUsers((prevName) => {
                  console.log('prevName', prevName)
                  return prevName.map((item, i) => {
                    console.log(item)
                    return i === index ? {...item, name: newName, age: newAge} : item;
                  })
                })
              }
              // prevName
              // 0:{name: 'useState', age: '0'}
              // 1:{name: 'useEffect', age: '10'}

              // item
              // {name: 'useState', age: '0'} {name: 'useEffect', age: '10'}

              // Use
              <button onClick={() => {
                handleMultiValue(0, 'F-5', '5');
                handleMultiValue(1, 'F-22', '8');
              }}
              >click handleType</button>
              // {name: 'F-5', age: '6'} {name: 'F-22', age: '8'}
              `}
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}

export default UseStatePage;