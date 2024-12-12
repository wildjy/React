"use client"
import React, { useState } from 'react';
import BottomSheet from "../../sharedUI/LayerPopup/BottomSheet";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const LayerPopupPage = () => {

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: false,
    popup2: false,
    popup3: false,
    popup4: true,
    popup5: true,
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
            <p className="text-4xl"><b>타이틀..</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className="bg-gray-300">
              <div className='w-full h-[0rem] bg-gray-700'></div>
              <p className="text-xl">
                인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
                12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
                ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
              </p>
              <div className='flex justify-center'>
                <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</a>
              </div>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup2')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(Full) 열기
        </button>

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

          <LayerPopup.Body>

            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p>

            <div className='flex flex-wrap'>
              <div className='w-1/3'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
              <div className='w-1/3'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
              <div className='w-1/3'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
              <div className='w-1/3'><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img></div>
            </div>
            <div className="bg-gray-300">
              {/* <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트"></img> */}
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup3')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(scroll) 열기
        </button>

        <LayerPopup type="scroll" align="center" isOpen={isOpenPopup.popup3} OpenEvent={() => OpenEventPopup('popup3')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>타이틀..</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p>

            <div className="bg-gray-300">
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" />
              <img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" />
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => OpenEventPopup('popup4')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트 열기
        </button>

        <BottomSheet align="center" isOpen={isOpenPopup.popup4} OpenEvent={() => OpenEventPopup('popup4')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Bottom타이틀..</b></p>
          </LayerPopup.Header>
          <LayerPopup.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며, 12월 23일부터 리포트 열람이 제한될 수 있습니다
            </p>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </LayerPopup.Footer>
        </BottomSheet>

        <button type="button" onClick={() => OpenEventPopup('popup5')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트(Full) 열기
        </button>
        <BottomSheet type="full" align="center" isOpen={isOpenPopup.popup5} OpenEvent={() => OpenEventPopup('popup5')}>
          <LayerPopup.Header>
            <div className="fixed top-0 left-0">
              <button type="button" className="w-9 h-9 text-white bg-slate-500" onClick={() => OpenEventPopup('popup5')}>
                <span className="sr-only-none">Back</span>
              </button>
            </div>
            <p className="text-4xl"><b>타이틀..</b></p>
            <p className="text-4xl"><b>타이틀..</b></p>
          </LayerPopup.Header>
          <LayerPopup.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며, 12월 23일부터 리포트 열람이 제한될 수 있습니다
            </p>
            <div><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" /></div>
            <div><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" /></div>
            <div><img src="https://image.jinhak.com/jinhakImages/event/241125/img_title.png" alt="삼성전자 이벤트" /></div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <button type="button" className='py-3 w-10 text-center border border-blue-700 rounded'>확인</button>
            </div>
          </LayerPopup.Footer>
        </BottomSheet>

      </div>
    </>
  )
}

export default LayerPopupPage;