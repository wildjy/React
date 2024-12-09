"use client";

import { useState } from "react";
import LayerPopup from './LayerPopup';

// function ComponentA() {
//   const value = useContext(MyContext);
//   return <p className="text-blue-700">{value}</p>
// }

const LayerPopupPage = () => {
  const [isLayerOpen, setIsLayerOpen] = useState<{[key: string]: boolean}>({
    popup1: false,
    popup2: false,
  });

  const EventPopup = (key: string) => {
    setIsLayerOpen((prevValue) => ({
      ...prevValue,
      [key]: !prevValue[key],
    }));
  }

  return (
    <>
      <div>
        <p>body contents </p>
        <LayerPopup openEvent={isLayerOpen.popup1} closeEvent={() => EventPopup('popup1')}>
          <LayerPopup.title />
          <LayerPopup.contA />
          <LayerPopup.contB />
        </LayerPopup>
        <button className="py-2 px-5 border border-blue-700 rounded" onClick={() => EventPopup('popup1')}>열기</button>

        <LayerPopup openEvent={isLayerOpen.popup2} closeEvent={() => EventPopup('popup2')}>
          <LayerPopup.title />
          <LayerPopup.contB />
        </LayerPopup>
        <button className="py-2 px-5 border border-blue-700 rounded" onClick={() => EventPopup('popup2')}>열기</button>
      </div>
    </>
  )
}

export default LayerPopupPage;