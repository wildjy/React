"use client";
import ModuleInput from "../../sharedUI/Input/TextInput";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

export default function Page() {
  // Sample count
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  console.log(count);

  const handleCount = () => {
    setCount(count + 1);
    countRef.current += 1;
    console.log("Ref value:", countRef.current);
  }

  useEffect(() => {
    console.log(`count changed to ${count}`)
    return () => {
      // setCount(0);
    }
  }, [count]); // count가 변경될 때마다 실행
  // input

  const [textValue, setTextValue] = useState<string>('');

  const handleChange = ( e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const [inputValue, setInputValue] = useState([
    {
      name: "",
      phone: "112",
    },
    {
      name: "리액트",
      phone: "010-1234-5678",
    }
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      console.log("Previous Values:", prevValues);

      return prevValues.map((item, i) => {
        console.log("item index:", i);
        console.log("item Values:", item);
        return i === index ? { ...item, [field]: newValue } : item
      });
    });
  };

  useEffect(() => {
    console.log(inputValue[0].name);
    inputValue[0].name = "실행됨"
    console.log(inputValue[0].name);
    console.log(inputValue)
    return () => {
      inputValue[0].name = "클린업";
      console.log(inputValue)
    }
  }, [])

  // resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = throttle(() => { // debounce
      setWindowWidth(windowWidth);
      console.log(window.innerWidth)
    }, 200);

    window.addEventListener('resize', handleResize);
    console.log(windowWidth)
  }, []);

  // debounce
  const [query, setQuery] = useState<string>('');

  const handleDebounce = useCallback(
    debounce((newQuery) => {
      console.log('debounce for', newQuery)
    }, 500),
  );

  const handleDebounceChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    handleDebounce(newQuery);
  };

  // useRef
  const inputRef = useRef<HTMLInputElement>(null);
  // const inputRef = useRef(null); // 문법오류 발생

  // ?.은 inputRef.current가 존재할 때만 .focus() 메서드를 호출한다는 의미입니다.
  useEffect(() => {
    inputRef.current?.focus();
  }, [])


  return (
    <>
      <div className="p-6 w-tablet m-center">

        <h1 className="mb-5 text-2xl"><b>React Study</b></h1>

        {/* useState */}
        <div className="mb-8">
          <p className="mb-4">1. useState</p>
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
                const handleCount = () => {
                  setCount((prevCount) => prevCount + 1) ;
                }
                `}
              </pre>
            </div>

            <div className="mt-3">
              <b className="block text-gray-900">3. 여러 상태 변수 관리
                <span>하나의 컴포넌트에서 여러개의 useState를 사용 가능.</span>
              </b>
              <pre>
                {`
                useState의 타입을 지정할 때는 제네릭 타입 (<string>)을 사용해야 합니다.

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
                  setUser((prevName) => ({
                    ...prevName,
                    name: newName
                  }));
                };
                `}
              </pre>
            </div>
          </div>
        </div>

        {/*  useEffect, useRef : 라이프사이클과 DOM 접근, 값의 참조, 상태변화에 따른 작업처리 */}
        <div className="mb-8">
          <p className="mb-4">1. useEffect</p>
          <p className="mb-4">- 마운트될 때, 업데이트될 때, 언마운트될 때 수행</p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3">첫번째 인자 = 콜백함수(실행할 작업),  정리 작업 =  return(cleanup)</p>
            <div>
              <pre>
                {`
                import { useEffect } from "react";

                useEffect(() => {
                  // 실행할 작업
                  return () => {
                    // 정리 작업 (cleanup)
                  }
                }, [dependencies]);

                // 의존성 배열 [dependencies]
                1. 배열내 상태, props가 변경될떄만 실행
                2. 빈 배열은 마운트 될 때 한 번만 실행
                3. 생략 하면 매 렌더링마다 실행
                `}
              </pre>
            </div>
          </div>

          <div className="mt-5 p-6 border border-gray-400">
            <p className="text-lg"><b>예제</b></p>
            <div className="mt-3">
              <b className="block text-gray-900">1. 데이터 가져오기 (마운트 시 한 번 실행)</b>
              <pre>
                {`
                useEffect(() => {
                  fetchData();
                }, []) // 빈 배열은 마운트 시 한 번만 실행
                `}
              </pre>
            </div>

            <div className="mt-3">
              <b className="block text-gray-900">2. 상태 변경에 따른 작업 수행</b>
              <pre>
                {`
                const [count, setCount] = useState(0);

                useEffect(() => {
                  console.log('Count changed to ${count}');
                }, [count]) // count가 변경될 때마다 실행
                `}
              </pre>
            </div>

            <div className="mt-3">
              <b className="block text-gray-900">3. 정리작업 (cleanup)</b>
              <pre>
                {`
                1. timer
                useEffect(() => {
                  const timer = setInterval(() => {
                    console.log('timer..');
                  }, 1000)

                  return () => {
                    clearInterval(timer);
                  }
                }, [])


                2. resize (throttle 사용)
                const [windowWidth, setWindowWidth] = useState(window.innerWidth);

                useEffect(() => {
                  const handleResize = throttle(() => {
                    setWindowWidth(windowWidth);
                    console.log(window.innerWidth)
                  }, 200);

                  // resize 상시 이벤트 발생으로 메모리누수 발생 방지 : 디바운스(debounce) 또는 스로틀링(throttle)

                  window.addEventListener('resize', handleResize);

                  return () => {
                    window.removeEventListener('resize', handleResize);
                  }
                }, [])


                3. input (debounce 사용)
                const [query, setQuery] = useState<string>('');

                const handleSearch = useCallback(
                  debounce((newQuery) => {
                    console.log('debounce for', newQuery)
                  }, 500)
                );

                const handleDebounceChange = (e) => {
                  const newQuery = e.target.value;
                  setQuery(newQuery);
                  handleSearch(newQuery);
                }

                // Use
                <input
                  type="text"
                  className="p-3 border border-gray-600 rounded-lg"
                  placeholder="[ex] debounce.."
                  value={query}
                  onChange={handleDebounceChange}
                />
                `}
              </pre>
              <div className="mt-4 p-6 border border-gray-400">
                <p><b>Sample</b></p>
                <p>window Width = {windowWidth}px</p>
                <input
                  type="text"
                  className="p-3 border border-gray-600 rounded-lg"
                  placeholder="[ex] debounce.."
                  value={query}
                  onChange={handleDebounceChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-4">1. useRef</p>
          <p className="mb-4">- DOM에 직접 접근, 유지하고 싶은 값을 저장하고자 할 때</p>
          <div className="p-6 border border-gray-400">
            <p className="mb-3">useRef로 생성된 객체는 .current라는 프로퍼티를 가짐(저장소:유지)</p>
            <div>
              <pre>
                {`
                import React, { useRef } from 'react';

                const ref = useRef(ininitalValue);
                `}
              </pre>
              <div className="mt-4 p-6 border border-gray-400">
                <p><b>Sample</b></p>
                <p>Ref count: {countRef.current}</p>
                <button
                  type="button"
                  className="px-5 py-2 border border-gray-500 rounded"
                  onClick={ handleCount }
                  >
                  <span className="text-error">Click!</span> useRef + 1
                </button>

                <div>
                  <input
                    type="text"
                    className="p-3 border border-gray-600 rounded-lg"
                    ref={inputRef}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-6 border border-gray-400">
            <p className="text-lg"><b>예제</b></p>
            <div className="mt-3">
              <b className="block text-gray-900">1. DOM 접근 (포커스 설정)</b>
              <pre>
                {`
                const inputRef = useRef<HTMLInputElement>(null);

                useEffect(() => {
                  inputRef.current?.focus();
                  return () => {

                  }
                }, [])

                // ? 의미
                // 객체가 null 또는 undefined일 경우 오류 없이 undefined를 반환
                // Optional Chaining 사용
                inputRef.current?.focus();

                // Optional Chaining 미사용
                if (inputRef.current) {
                  inputRef.current.focus();
                }

                // Use
                <input
                  type="text"
                  ref={inputRef}
                />
                `}
              </pre>
            </div>

            <div className="mt-3">
              <b className="block text-gray-900">2. 상태 변화 없이 값 추적</b>
              <pre>
                {`
                const countRef = useRef(0);

                const increment = () => {
                  countRef.current += 1; // countRef 값 증가, 재렌더링 없음
                  console.log("Ref value:", countRef.current);
                };

                <p>Ref count: {countRef.current}</p>
                <button onClick={increment}>Increment</button>

                // useRef를 사용해 이전 값을 참조하거나 추적하는 용도로 사용
                `}
              </pre>
              <div className="mt-4 p-6 border border-gray-400">
                <p><b>Sample</b></p>
                <p>window Width = {windowWidth}px</p>
                <input
                  type="text"
                  className="p-3 border border-gray-600 rounded-lg"
                  placeholder="[ex] debounce.."
                  value={query}
                  onChange={handleDebounceChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-6 border border-gray-400">
          <p className="text-lg"><b>changeEvent</b></p>
          <div className="mt-3">
            <p className="mb-3"><b>HTML요소에서 발생하는 이벤트의 타입</b>을 지정할때 사용</p>
            <p className="mb-3"><b>폼 입력 요소 (예: input, select, textarea 등)</b>에서 발생하는 onChange이벤트 처리시 사용</p>
            <p className="mb-3">
              input : HTMLInputElement<br />
              select : HTMLSelectElement<br />
              textarea : HTMLTextAreaElement
            </p>
            <div>
              <b className="block text-gray-900">1. 기본문법</b>
              <pre>
                {`
                import { useState, ChangeEvent } from "react";

                const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  console.log(value);
                };
                `}
              </pre>
            </div>

            <div>
              <b className="block text-gray-900">2. input: text</b>
              <p className="mt-4">[단일 input 예제]</p>
              <pre>
                {`
                const [inputValue, setInputValue] = useState<string>('');

                const handleChange = ( e: changeEvent<HTMLInputElement>) => {
                  setInputValue(e.target.value);
                };

                // Use
                <input type="text"
                  className="p-3 border border-gray-600 rounded-lg"
                  value={ inputValue }
                  onChange={ handleChange }
                  placeholder="enter text"
                />
                `}
              </pre>

              <div className="mt-4 p-6 border border-gray-400">
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={textValue}
                onChange={ handleChange }
                placeholder="enter text"
                />
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={textValue}
                onChange={ handleChange }
                placeholder="enter text"
                />
              </div>

              <p className="mt-4">[다수 input 예제]</p>
              <pre>
                {`
                const [inputValue, setInputValue] = useState([
                  {
                    name: "",
                    phone: "112",
                  },
                  {
                    name: "리액트",
                    phone: "010-1234-5678",
                  }
                ]);

                const handleInputChange = ( e: changeEvent<HTMLInputElement>,
                index: number, // 업데이트할 배열의 index
                filed: string // 업데이트할 배열의 필드이름
                ) => {
                  const newValue = e.target.value; // 변경된 입력 값
                  setInputValue((prevValues) => {
                    return prevValues.map((item, i) =>
                      i === index ? { ...item, [filed] : newValue } : item
                    );
                  });
                };

                // 특정 필드 업데이트 호출 방법
                onChange={ (e) => handleInputChange(e, 0, 'name') }
                `}
              </pre>

              <div className="mt-4 p-6 border border-gray-400">
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={inputValue[0].name}
                onChange={(e) => handleInputChange(e, 0, "name")}
                placeholder="enter text"
                />
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={inputValue[0].phone}
                onChange={(e) => handleInputChange(e, 0, "phone")}
                placeholder="enter text"
                />
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={inputValue[1].name}
                onChange={(e) => handleInputChange(e, 1, "name")}
                placeholder="enter text"
                />
                <input type="text"
                className="p-3 border border-gray-600 rounded-lg"
                value={inputValue[1].phone}
                onChange={(e) => handleInputChange(e, 1, "phone")}
                placeholder="enter text"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
