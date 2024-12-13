"use client"
import React, { useState } from 'react';
import BottomSheet from "../../sharedUI/LayerPopup/BottomSheet";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const LayerPopupPage = () => {

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: true,
    popup2: true,
    popup3: false,
    popup4: false,
    popup5: false,
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
        <button type="button"
          onClick={() => OpenEventPopup('popup1')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(default) 열기
        </button>

        <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className='h-[10rem]'>
              <p className="text-xl">
                Body..
              </p>
              <p>
                컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
              </p>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup2')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(Full) 열기
        </button>

        <LayerPopup type="full" align="center" isOpen={isOpenPopup.popup2} OpenEvent={() => OpenEventPopup('popup2')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>

            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p>

            <div className='flex flex-wrap'>
              <div className='md:w-1/2'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
              <div className='md:w-1/2'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
              <div className='md:w-1/2'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>Footer</button>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup3')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(scroll) 열기
        </button>

        <LayerPopup type="scroll" align="center" isOpen={isOpenPopup.popup3} OpenEvent={() => OpenEventPopup('popup3')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p>

            <div>
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" />
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" />
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>Footer</button>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup4')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트 열기
        </button>

        <BottomSheet align="center" isOpen={isOpenPopup.popup4} OpenEvent={() => OpenEventPopup('popup4')}>
          <BottomSheet.Header>
            <p className="text-4xl"><b>Header</b></p>
          </BottomSheet.Header>

          <BottomSheet.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로  수 있으며, 12월 23일부터 리포트 열람이 제한될 수 있습니다
            </p>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </BottomSheet.Footer>
        </BottomSheet>

        <button type="button" onClick={() => OpenEventPopup('popup5')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트(Full) 열기
        </button>

        <BottomSheet type="full" align="center" isOpen={isOpenPopup.popup5} OpenEvent={() => OpenEventPopup('popup5')}>
          <BottomSheet.Header>
            <p className="text-4xl"><b>Header</b></p>
          </BottomSheet.Header>

          <BottomSheet.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며
            </p>
            <div><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" /></div>
            <div><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" /></div>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </BottomSheet.Footer>
        </BottomSheet>

      </div>
    </>
  )
}

export default LayerPopupPage;