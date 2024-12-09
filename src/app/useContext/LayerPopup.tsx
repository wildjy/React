"use client";
import { useState } from 'react';
import { MyContext } from './context';

import LayerTitle from './title';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

// function ComponentA() {
//   const value = useContext(MyContext);
//   return <p className="text-blue-700">{value}</p>
// }

interface LayerPopupProps {
  openEvent?: boolean;
  closeEvent?: () => void;
  children: React.ReactNode;
}

interface ExtendedLayerPopup extends React.FC<LayerPopupProps> {
  title: React.FC;
  contA: React.FC;
  contB: React.FC;
}

const value = [
  {
    title: "Hello Context....",
    sub_txt: "sub_tit...",
  },
  {
    title: "im ComponentA....",
    sub_txt: "sub_titfdsdf...",
  },
  {
    info_txt: "study context",
  }
];

const LayerPopup: ExtendedLayerPopup = ( { children, openEvent, closeEvent }) => {
  return (
    <>
      {openEvent && (
        <MyContext.Provider value={value}>
        <div className={`layerPopup fixed top-0 left-0 bottom-0 right-0 bg-gray-1000 bg-opacity-65`}>
          <div className="inner absolute p-5 w-4/5 md:w-2/5 xl:w-[400px] center_center bg-white border border-gray-700">

            { children }

            <button onClick={closeEvent}>닫기</button>
          </div>
        </div>
        </MyContext.Provider>
      )}
    </>
  )
}

LayerPopup.title = LayerTitle;
LayerPopup.contA = ComponentA;
LayerPopup.contB = ComponentB;

export default LayerPopup;