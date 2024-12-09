"use client";
import { useState } from 'react';
import LayerPopup from './layerPopup';

const LayerPopupPage = () => {
  const [isOpen, setIsOpen] = useState<{[key: string]: boolean}>({
    popup1: true,
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
        <button onClick={() => EventOpen('popup1')}>열기1</button>

        <LayerPopup openEvent={isOpen.popup2} closeEvent={() => EventOpen('popup2')}>
          <LayerPopup.Title />
          <LayerPopup.Bottom />
        </LayerPopup>
        <button onClick={() => EventOpen('popup2')}>열기2</button>
      </div>
    </>
  )
}

export default LayerPopupPage;