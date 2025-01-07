"use client";
import React, { useState } from 'react';
import ButtonBox from "../../sharedUI/Button/ButtonBox";
import Button from "../../sharedUI/Button/Button";
import Link from "../../sharedUI/Button/Link";
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const ButtonPage = () => {


    const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
      popup1: false,
    });

    const OpenEventPopup = (key: string) => {
      setIsOpenPopup((prevOpen) => ({
        ...prevOpen,
        [key]: !prevOpen[key],
      }));
    }

  return (
    <>
      <div className="p-4">
        <p className="text-xl"><b>[Button]</b></p>
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button size="sm" endIcon={['icon_btn_arrow.svg', 'w-[0.4rem]']}>
              Primary Small
            </Button>
            <Button type="submit" startIcon={['icon_checked.svg', 'w-[0.75rem]']}>Primary submit</Button>
            <Button size="lg">Primary Large</Button>
            <Button round="full">Primary</Button>
            <Button round="rec">Primary</Button>
            <Button disabled>Primary disabled</Button>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="secondary">secondary</Button>
            <Button mode="secondary" round="full">취소</Button>
            <Button mode="secondary" round="rec">secondary</Button>
            <Button mode="secondary" disabled>secondary disabled</Button>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Button mode="tertiary">tertiary</Button>
            <Button mode="tertiary" round="full">tertiary</Button>
            <Button mode="tertiary" round="rec">tertiary</Button>
            <Button mode="tertiary" disabled>tertiary disabled</Button>
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[A link]</b></p>
        <div className="flex flex-wrap gap-3">
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link href="https://www.jinhak.com/" blank mode="primary" size="sm">Primary Small + blank</Link>
            <Link mode="primary" startIcon={['icon_checked.svg', 'w-[0.75rem]']}>primary</Link>
            <Link mode="primary" size="lg" endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>Primary Large</Link>
            <Link disabled>Primary disabled</Link>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="secondary">secondary</Link>
            <Link mode="secondary" disabled>secondary disabled</Link>
          </div>
          <div className="w-full flex flex-wrap items-center gap-3">
            <Link mode="tertiary">tertiary</Link>
            <Link size="auto" addClass="px-2 md:px-4 py-2 text-s text-white bg-red-700">ok</Link>
            <Link mode="tertiary" size="auto" addClass="">cancel</Link>
          </div>
        </div>

        <p className="mt-8 text-xl"><b>[ButtonBox]</b></p>

        <ButtonBox align="left" addClass="border border-red-400">
          <Button mode="secondary" size="sm" >취소 Small</Button>
          <Link href="https://www.jinhak.com/" blank size="sm">모의지원 Small</Link>
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" >취소</Button>
          <Link href="https://www.jinhak.com/" blank>모의지원</Link>
        </ButtonBox>

        <ButtonBox align="right">
          <Link href="https://www.jinhak.com/" blank>리포트</Link>
        </ButtonBox>

        <ButtonBox>
          <Button mode="secondary" >취소</Button>
          <Link href="https://www.jinhak.com/" blank>모의지원</Link>
          <Link href="https://www.jinhak.com/" blank endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>모의지원</Link>
        </ButtonBox>

        <ButtonBox>
          {/* <Link size="auto" addClass="px-2 md:px-4 py-2">ok</Link>
          <Link mode="tertiary" size="auto" addClass="py-2 text-white bg-blue-1000">cancel</Link> */}
          <Link href="https://www.jinhak.com/" blank size="auto" addClass="py-3" endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>모의지원</Link>
          <Link href="https://www.jinhak.com/" blank size="auto" addClass="py-3" endIcon={['icon_btn_arrow.svg', 'w-[0.5rem]']}>모의지원</Link>
        </ButtonBox>

        <button type="button"
          onClick={() => OpenEventPopup('popup1')}
          className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(default) 열기
        </button>

        <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
          <LayerPopup.Header>
            <p className="text-4xl"><b>Header</b></p>
          </LayerPopup.Header>

          <LayerPopup.Body>
            <div className='w-[703px] h-[10rem]'>
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
              <a href="#self" className='px-5 py-3 text-center border border-blue-700 rounded' onClick={() => OpenEventPopup('popup1')}>Footer</a>
            </div>
          </LayerPopup.Footer>
        </LayerPopup>

      </div>
    </>
  )
}

export default ButtonPage;