'use client';
import React, { useState } from 'react';


const MakeButton = () => {
  const [isLayerVisible, setIsLayerVisible] = useState(false);

  const handleClick = () => {
    setIsLayerVisible((state) => !state);
  };

  return (
    <div>
      <div className="flex justify-center py-5">
        <input
          id="button"
          type="button"
          value="click"
          className="test border-pink-600 border px-3 py-1 rounded-md cursor-pointer hover:bg-pink-600 hover:text-white"
          onClick={handleClick}
        />
        <button
          id="button"
          type="button"
          className="border-pink-600 border px-3 py-1 rounded-md cursor-pointer hover:bg-pink-600 hover:text-white"
          onClick={handleClick}
        > click</button>
        <div className={`layerPopup ${isLayerVisible ? 'visible': ''}`}>
          <button onClick={handleClick}>닫기</button>
        </div>
      </div>
      <style jsx>{`
        .test {
          background-color: #ddd;
        }
        .layerPopup {
          display: none;
        }
        .layerPopup.visible {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: block;
          background-color: #f0f0f0;
          padding: 10px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default MakeButton;