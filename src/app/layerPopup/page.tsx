"use client";

import {useState } from "react";
import LayerPopup from './LayerPopup';

// function ComponentA() {
//   const value = useContext(MyContext);
//   return <p className="text-blue-700">{value}</p>
// }

const LayerPopupPage = () => {
  const [isLayerOpen, setIsLayerOpen] = useState();

  const OpenPopup = () => {
    setIsLayerOpen((prev) => !prev);
  }

  return (
    <>
      <div>
        <p>body contents </p>
        <LayerPopup openEvent={isLayerOpen} closeEvent={OpenPopup}>
          <LayerPopup.title />
          <LayerPopup.contA />
          <LayerPopup.contB />
        </LayerPopup>
        <button onClick={OpenPopup}>열기</button>

        {/* <LayerPopup>
          <LayerPopup.title />
          <LayerPopup.contB />
        </LayerPopup> */}
        {/* <button onClick={OpenPopup}>열기</button> */}
      </div>
    </>
  )
}

export default LayerPopupPage;