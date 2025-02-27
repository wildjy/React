"use client";
import React, { useState } from 'react';
import ToggleBox from "../../sharedUI/ToggleBox/ToggleBox";

const ToggleBoxPage = () => {
  return (
    <>
    {/*  */}
      <div>
        <ToggleBox size="sm" align="center">
          <ToggleBox.Top activeClass="font-bold text-blue-700">
            유의사항 확인..
          </ToggleBox.Top>
          <ToggleBox.Bottom activeClass="border">
            Bottom..
            Bottom..
            Bottom..
          </ToggleBox.Bottom>
        </ToggleBox>

        <div className="mt-3 px-8">
          <ToggleBox isOpen>
            <ToggleBox.Top activeClass="font-bold text-green-700">
              유의사항 확인..
            </ToggleBox.Top>
            <ToggleBox.Bottom>
              Bottom..
              Bottom..
              Bottom..
            </ToggleBox.Bottom>
          </ToggleBox>
        </div>

        <div className="mt-3 px-3">
          <ToggleBox size="lg" icon="plus">
            <ToggleBox.Top addClass='bg-red-100'>
              유의사항 확인..
            </ToggleBox.Top>
            <ToggleBox.Bottom addClass='px-[2rem] pb-[1rem]'>
              Bottom..
              Bottom..
              Bottom..
            </ToggleBox.Bottom>
          </ToggleBox>
        </div>
      </div>
    </>
  )
}

export default ToggleBoxPage;