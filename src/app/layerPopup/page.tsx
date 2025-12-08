"use client"
import React, { useState } from 'react';
import BottomSheet from "../../sharedUI/LayerPopup/BottomSheet";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const LayerPopupPage = () => {

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup0: true,
    popup1: false,
    popup2: false,
    popup3: false,
    popup4: false,
    popup5: false,
    popup6: false,
    popup7: false,
  });

  const handleEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  }

  return (
    <>
      <div>
        <button type="button"
          onClick={() => handleEventPopup('popup1')}
          className='inline-block py-3 min-w-[12rem] text-center border border-blue-700 rounded'>팝업(default + outClose) 열기
        </button>

        <LayerPopup align="center" outClose isOpen={isOpenPopup.popup1} OpenEvent={() => handleEventPopup('popup1')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className='h-[10rem]'>
              <p className="text-xl">
                Body..
              </p>
              <p className='text-red-500'><b>outClose={true} 팝업 밖 클릭시 레이어 닫힘 설정</b></p>
              <p>
                컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
              </p>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup1')}>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button"
          onClick={() => handleEventPopup('popup0')}
          className='inline-block py-3 px-5 min-w-[12rem] text-center border border-blue-700 rounded'>팝업(change bottomSheet) 열기
        </button>

        <LayerPopup type="bottomSheet" align="center" isOpen={isOpenPopup.popup0} OpenEvent={() => handleEventPopup('popup0')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <p className="text-xl">
              Body..
            </p>
            <p>
              Device Break point 768 이하에선 bottomSheet로 변형
            </p>
            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-red-500"></div>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup0')}>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => handleEventPopup('popup2')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(Full) 열기
        </button>

        <LayerPopup type="full" align="center" isOpen={isOpenPopup.popup2} closeType="back" OpenEvent={() => handleEventPopup('popup2')}>
          {/* <LayerPopup.Header>
            <p className="ml-4 text-4xl"><b>Header</b></p>
          </LayerPopup.Header> */}

          <LayerPopup.Body>

            {/* <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p> */}

            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              {/* <div className="block md:hidden w-full h-[250px] bg-blue-500"></div> */}
            </div>
          </LayerPopup.Body>

          {/* <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup2')}>Footer</a>
            </div>
          </LayerPopup.Footer> */}
        </LayerPopup>

        <button type="button" onClick={() => handleEventPopup('popup3')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(scroll) 열기
        </button>

        <LayerPopup type="scroll" align="center" isOpen={isOpenPopup.popup3} OpenEvent={() => handleEventPopup('popup3')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며,<br />
              12월 23일부터 리포트 열람이 제한될 수 있습니다.<br />
              ※ 수능 성적증명서가 준비되었다면 인증을 완료해 주세요.
            </p>

            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
            </div>
          </LayerPopup.Body>

          <LayerPopup.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup3')}>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

        <button type="button" onClick={() => handleEventPopup('popup7')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(absolute) 열기
        </button>

        <button type="button" onClick={() => handleEventPopup('popup4')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트 열기
        </button>

        <BottomSheet align="center" outClose dimm={false} isOpen={isOpenPopup.popup4} OpenEvent={() => handleEventPopup('popup4')}>
          <BottomSheet.Header>
            <p className="text-4xl"><b>Header</b></p>
          </BottomSheet.Header>

          <BottomSheet.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로  수 있으며, 12월 23일부터 리포트 열람이 제한될 수 있습니다
            </p>
            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
            </div>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup4')}>Footer</a>
            </div>
          </BottomSheet.Footer>
        </BottomSheet>

        <button type="button" onClick={() => handleEventPopup('popup5')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>바텀시트(Full) 열기
        </button>

        <BottomSheet type="full" align="center" isOpen={isOpenPopup.popup5} OpenEvent={() => handleEventPopup('popup5')}>
          <BottomSheet.Header>
            <p className="ml-4 text-4xl"><b>Header</b></p>
          </BottomSheet.Header>

          <BottomSheet.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며
            </p>
            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
            </div>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup5')}>Footer</a>
            </div>
          </BottomSheet.Footer>
        </BottomSheet>

        <button type="button" onClick={() => handleEventPopup('popup6')}
          className='inline-block py-3 w-[17rem] text-center border border-blue-700 rounded'>바텀시트(Full + 닫기 별도 사용) 열기
        </button>

        <BottomSheet type="full" align="center" close={false} isOpen={isOpenPopup.popup6}>
          <BottomSheet.Header>
            {/* 닫기 버튼 별도 사용 */}
            <div className="flex" onClick={() => handleEventPopup('popup6')}>
              <button type="button" className="w-8 h-8 md:w-9 md:h-9 bg-center bg-no-repeat bg-[length:60%_60%] bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg')]" >
                <span className="sr-only">팝업 닫기</span>
              </button>

              <p className="ml-4 text-4xl"><b>Header</b></p>
            </div>
            {/* 닫기 버튼 별도 사용 */}
          </BottomSheet.Header>

          <BottomSheet.Body>
            <p className="text-xl">
              인증이 완료되지 않으면 허수데이터로 분류될 수 있으며
            </p>
            <div className="flex flex-wrap">
              <div className="w-full h-[250px] bg-green-500"></div>
              <div className="block md:hidden w-full h-[250px] bg-blue-500"></div>
            </div>
          </BottomSheet.Body>

          <BottomSheet.Footer>
            <div className='flex justify-center'>
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup6')}>확인</a>
            </div>
          </BottomSheet.Footer>
        </BottomSheet>


        <div className='mt-10 w-5 h-5 relative bg-gray-600'>
          <LayerPopup type="absolute" dimm={false} align="center" isOpen={isOpenPopup.popup7} OpenEvent={() => handleEventPopup('popup7')}>
            <LayerPopup.Header>
              <p className="text-4xl"><b>Header</b></p>
            </LayerPopup.Header>

            <LayerPopup.Body>
              <p className="text-xl">
                ※ 수능 성적증명서가  인증을 완료해 주세요.
              </p>
            </LayerPopup.Body>

            <LayerPopup.Footer>
              <div className='flex justify-center'>
                <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => handleEventPopup('popup7')}>Footer</a>
              </div>
            </LayerPopup.Footer>
          </LayerPopup>
        </div>

      </div>
    </>
  )
}

export default LayerPopupPage;