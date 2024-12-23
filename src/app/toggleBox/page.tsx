"use client";
import React, { useState } from 'react';
import ToggleBox from "../../sharedUI/ToggleBox/ToggleBox";

const ToggleBoxPage = () => {
  return (
    <>
      <div>
        <ToggleBox>
          <ToggleBox.Top align="center">
            유의사항 확인..
          </ToggleBox.Top>
          <ToggleBox.Bottom>
            Bottom..
            Bottom..
            Bottom..
          </ToggleBox.Bottom>
        </ToggleBox>

        <div className="mt-3 px-8">
          <ToggleBox>
            <ToggleBox.Top size="sm">
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
          <ToggleBox>
            <ToggleBox.Top size="lg" icon="plus">
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