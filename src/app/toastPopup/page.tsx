"use client";
import React, { useState } from 'react';
import { Button } from "../../sharedUI/Button/Button";
import { ToastPopup } from "../../sharedUI/ToastPopup/ToastPopup";

const ToastPopupPage = () => {

  const [toast, setToast] = useState(true);
  const OpenToast = () => {
    setToast(true);
    return;
  };

  return (
    <>
      <div className='h-[1200px]'>
        <Button onClick={OpenToast}>toast팝업 열기</Button>

        <ToastPopup align="left" size="sm" child={true} isActive={toast} setToast={setToast} addClass="bottom-20">
          <b className="text-[#FFFC00]">[가군] 가야대 KMU International Business School</b>가 저장되었습니다.
        </ToastPopup>
        <ToastPopup
          isActive={toast}
          setToast={setToast}
          message={['[가군] Business School', '취소']}
          setColor="text-[#FFFC00]"
        />
        <ToastPopup align="right" isActive={toast} message={['앞으로 100번째', '대기']} setToast={setToast} />
      </div>
    </>
  )
}

export default ToastPopupPage;