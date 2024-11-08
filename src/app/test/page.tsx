"use client";
import ModuleInput from "../../sharedUI/Input/TextInput";
import { useState, ChangeEvent } from "react";

export default function Page() {
  // Sample count
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount(count + 1);
  }

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

  return (
    <>
      <div className="p-6 w-tablet m-center">

        <h1 className="mb-5 text-2xl"><b>React Study</b></h1>

        <p className="mb-4">1. useState</p>
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
              setCount(count + 1);
              `}
            </pre>
          </div>

          <div className="mt-3">
            <b className="block text-gray-900">2. 이전 상태를 기반으로 관리</b>
            <pre>
              {`
              setCount((prevCount) => prevCount + 1) ;
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
