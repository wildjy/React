"use client";
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

  const [user, setUsers] = useState<{[key: string]: string}>({
    name: 'abcd',
    age: '10',
  })

  const handleControl = (newUsers) => {
    // setUsers((prevUsers) => ({
    //   ...prevUsers,
    //   name: newUsers
    // }))

    setUsers((prev) => {
      console.log(prev)
      return {
        ...prev,
        name: newUsers
      }
    })
  }

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

  // return prevValues.map((item, i) =>
  //   i === index ? { ...item, [filed] : newValue } : item

  const handleType = (index: number, newName: string, newType: string) => {
    setTestArray((prevType) => {
      console.log('prevType', prevType)
      return prevType.map((item, i) => {
        console.log(index);
        console.log(i);
        return i === index ? {...item, name: newName, type: newType} : item;
      })
    })
    // setTestArray((prevType) => {
    //   return prevType.map((item, i) =>
    //     i === index ? {...item, name: newName, type: newType} : item
    //   )
    // })
  }

  const [textValue, setTextValue] = useState<string>('');

  console.log(textValue);
  const handleChange = ( e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const [selectRadio, setSelectRadio] = useState<{[key: string]: string}>({
    type: '',
    sex: '',
    grade: '',
  });
  //console.log(selectRadio);

  const [checkCheckBox, setCheckCheckBox] = useState<{[key: string]: boolean}>({
    type: false,
    sex: false,
    grade: false,
  });
  //console.log(checkCheckBox);

  const [number, setNumber] = useState<{[key: string]: number}>({
    type: 1,
    sex: 2,
    grade: 3,
  })
  //console.log(number);

  const [inputValue, setInputValue] = useState([
    {
      name: "",
      phone: "010-112-1234",
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

  // useEffect
  useEffect(() => {
    console.log(inputValue)
    console.log(inputValue[0].phone);
    inputValue[0].name = "실행됨"
    return () => {
      inputValue[0].name = "클린업";
      console.log(inputValue)
    }
  }, [])

  // resize
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = throttle(() => { // debounce
  //     setWindowWidth(windowWidth);
  //     console.log(window.innerWidth)
  //   }, 200);

  //   window.addEventListener('resize', handleResize);
  //   console.log(windowWidth)
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // debounce
  const [query, setQuery] = useState<string>('');

  const handleDebounce = useCallback(
    debounce((newQuery) => {
      console.log('debounce for', newQuery)
    }, 500),
    []
  );

  const handleDebounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleDebounce(newQuery);
  };

  // useRef
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // const inputRef = useRef(null); // 문법오류 발생

  // ?.은 inputRef.current가 존재할 때만 .focus() 메서드를 호출한다는 의미입니다.
  useEffect(() => {
    // inputRef.current?.focus();
    // buttonRef.current?.focus();
  }, [])

  const [selectValue, setSelectValue] = useState<{[key: string]: string}>({
    select1: '',
    select2: '',
    select3: '',
  })

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    // setSelectValue((prevValue) => ({
    //   ...prevValue,
    //   [name]: value,
    // }))

    setSelectValue((prevValue) => {
      console.log(name)
      console.log(prevValue)
      return {
        ...prevValue,
        [name]: value,
      }
    })
  }

  const selectOptions = {
    select1: [
      { value: 'option1', label: '2000' },
      { value: 'option2', label: '1999' },
    ],
    select2: [
      { value: 'optionA', label: 'ㅇㅇ고등학교' },
      { value: 'optionB', label: 'ㅇㅇ고등학교 1' },
    ],
    select3: [
      { value: 'item1', label: 'Item 1' },
      { value: 'item2', label: 'Item 2' },
    ],
  };

// 학폭 기능
interface Item {
  id: string;
  name: string;
}

const limit = 2;
const defaultItem: Item = { id: '0', name: 'Please select an item' };
const [items] = useState<Item[]>([
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
  { id: '4', name: 'Item 4' },
  { id: '5', name: 'Item 5' },
]);

const [selectedItems, setSelectedItems] = useState<Item[]>([]);
const [dropdownVisible, setDropdownVisible] = useState(false);
const [selectedTitle, setSelectedTitle] = useState<string>(defaultItem.name);

// dropdown
const handleToggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
};

const handleSelectItem = (item: Item) => {
  if (selectedItems.length >= limit) {
    alert(`최대 ${limit}개까지 선택 가능합니다.`);
    setDropdownVisible(false);
    return;
  }

  setSelectedItems((prev) => [...prev, item]);
  setSelectedTitle(item.name); // Update the val_tit
  setDropdownVisible(false); // Close dropdown after selection
};

const handleRemoveItem = (index: number) => {
  const updatedItems = [...selectedItems];
  updatedItems.splice(index, 1);
  setSelectedItems(updatedItems);

  // Update title if the removed item is the last selected
  if (updatedItems.length === 0) {
    setSelectedTitle(defaultItem.name);
  } else {
    setSelectedTitle(updatedItems[updatedItems.length - 1].name);
  }
};

  return (
    <>
      <div className="p-6 w-tablet m-center">

        <h1 className="mb-5 text-2xl"><b>React Study</b></h1>
        <button className="p-5 py-2 border border-gray-600" onClick={() => handleControl('Su-57')}>click handleControl</button>
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
                ref={buttonRef}
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

                const handleCount = () => {
                  setCount((prevCount) => {
                    // console.log(prevCount);
                    return {
                      prevCount + 1;
                    }
                  })
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
                {/* <p>window Width = {windowWidth}px</p> */}
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

        <button className="p-5 py-2 border border-gray-600" onClick={() => {handleType(0, 'FGR-4', 'middle'); handleType(1, 'F-111', 'attack');}}>click handleType</button>
        <p>{[testArray[0].name, testArray[0].type]}</p>
        <p>{testArray[1].name}{testArray[1].type}</p>

        <div id="violence" className="w-[300px] relative">
          {/* Title */}
          <div
            className="val_tit cursor-pointer border px-4 py-2"
            onClick={handleToggleDropdown}
          >
            {selectedTitle}
          </div>

          {/* Dropdown */}
          {dropdownVisible && (
            <div id="save_list" className="absolute z-10 mt-1 border bg-white w-full shadow-md">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="item cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelectItem(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}

          {/* Selected Items */}
          <div className="mt-4">
            {selectedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="item flex items-center mb-2">
                <span className="mr-2">{item.name}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 underline"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          {selectedItems.length >= limit && (
            <p className="info_txt">최대 {limit}개까지 선택 가능합니다.</p>
          )}
        </div>


      </div>


    </>
  );
}
