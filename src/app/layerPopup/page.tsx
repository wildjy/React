"use client"
import React, { useState } from 'react';
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const LayerPopupPage = () => {

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: true,
    popup2: true,
  });

  const OpenEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  }

  return (
    <>
      <div>
        <a href="javascript:void(0)" onClick={() => OpenEventPopup('popup1')} className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>열기</a>

        <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>타이틀..</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className="bg-gray-300 scroll overflow-auto">
              <img src="https://board.jinhak.com/BoardV1/HTMLImage/241209_news3_image1.jpg" alt="삼성전자 이벤트" />
              <div className='flex justify-center'>
                <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</a>
              </div>
            </div>
          </LayerPopup.Body>
        </LayerPopup>

        <a href="javascript:void(0)" onClick={() => OpenEventPopup('popup2')} className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>열기</a>

        <LayerPopup type="full" align="center" isOpen={isOpenPopup.popup2} OpenEvent={() => OpenEventPopup('popup2')}>
          <LayerPopup.Header>
            <div className="fixed top-0 left-0">
              <button type="button" className="w-9 h-9 text-white bg-slate-500" onClick={() => OpenEventPopup('popup2')}>
                <span className="sr-only-none">Back</span>
              </button>
            </div>
            <p className="text-4xl"><b>타이틀..</b></p>
            <p className="text-4xl"><b>타이틀..</b></p>
          </LayerPopup.Header>

          {/* scroll */}
          <LayerPopup.Body>
            <div className="bg-gray-300">
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img>
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img>
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>
      </div>
    </>
  )
}

export default LayerPopupPage;