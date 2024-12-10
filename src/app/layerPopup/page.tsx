"use client";
import { useState } from 'react';
import LayerPopup from './layerPopup';

const LayerPopupPage = () => {
  const [isOpen, setIsOpen] = useState<{[key: string]: boolean}>({
    popup1: false,
    popup2: false,
  });

  const EventOpen = (key: string) => {
    setIsOpen((prevValue) => ({
      ...prevValue,
      [key]: !prevValue[key],
    }))
  }

  return (
    <>
      <div>
        <LayerPopup openEvent={isOpen.popup1} closeEvent={() => EventOpen('popup1')}>
          <LayerPopup.Title />
          <LayerPopup.Contents_1 />
          <LayerPopup.Bottom />
        </LayerPopup>

        <LayerPopup openEvent={isOpen.popup2} closeEvent={() => EventOpen('popup2')}>
          <LayerPopup.Title />
          <LayerPopup.Bottom />
        </LayerPopup>

        <div className='center_center flex justify-center items-center'>
          <button className="px-4 py-2 border border-blue-700 rounded-lg" onClick={() => EventOpen('popup1')}>열기1</button>
          <button className="px-4 py-2 border border-blue-700 rounded-lg" onClick={() => EventOpen('popup2')}>열기2</button>
        </div>
      </div>
    </>
  )
}

export default LayerPopupPage;