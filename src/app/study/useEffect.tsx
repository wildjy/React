"use client";
import React from "react";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

const UseEffectPage: React.FC = () => {
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

  return (
    <>
      <div className="mb-8">
        <p className="mb-4"><b>1. useEffect</b></p>
        <p className="mb-4">- 마운트될 때, 업데이트될 때, 언마운트될 때 수행 <b>비동기적, DOM이 업데이트 된 후</b> </p>
        <p className="mb-4">- <b className="text-red-600">useLayoutEffect</b> <b>동기적, DOM이 업데이트 되기 전</b> </p>
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
    </>
  )
}

export default UseEffectPage;