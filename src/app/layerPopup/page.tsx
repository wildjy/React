
"use client";

import React from "react";
import { createContext, useContext } from 'react';
const MyContext = createContext();

// start : component
function GrandParent() {
  // return (
  //   <>
  //     <Parent />
  //   </>
  // );
  const value = useContext(MyContext);
  return (
    <>
      <div><span className="text-red-500">Receivied</span> : {value}</div>
    </>
  );
};

function Parent() {
  const value = useContext(MyContext);
  return (
    <>
      <div><span className="text-blue-500">Receivied</span> : {value}</div>
    </>
  );
};

function Child() {
  const value = useContext(MyContext);
  return (
    <>
      <div><span className="text-green-500">Receivied</span> : {value}</div>
    </>
  );
}

function Message() {
  const value = useContext(MyContext);
  return (
    <>
      <div><span className="text-yellow-500">Receivied</span> : {value}</div>
    </>
  );
};
// end : component

const InputPage = () => {
  return (
    <>
      <div>
        <MyContext.Provider value="Hello. Hershey's Cat World">
          <GrandParent />
          <Parent />
          <Child />
          <Message />
        </MyContext.Provider>
      </div>
    </>
  )
}

export default InputPage;
