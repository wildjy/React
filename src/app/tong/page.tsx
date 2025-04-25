
'use client';
import React, { useRef, useEffect } from 'react';
import { TongProvider } from '../../sharedUI/Tong/TongContext';
import { TongHeader } from '../../sharedUI/Tong/TongHeader';
import { TongTop } from '../../sharedUI/Tong/TongTop';
import { TongGnb } from '../../sharedUI/Tong/TongGnb';
import { TongTopBottom } from '../../sharedUI/Tong/TongTopBottom';
import TongContents  from '../../sharedUI/Tong/TongContents';
import { TongFooter } from '../../sharedUI/Tong/TongFooter';

export default function TongLayoutPage() {
  return (
    <TongProvider sideNav={true}>
      <div className="min-w-[72.5rem]">
        <TongHeader />
        <TongTop />
        <TongGnb />
        <TongTopBottom />
        <TongContents>
          <div className="h-[150px] bg-red-100">side nav</div>
          <div>
            <p className="min-h-[2000px] bg-gray-50">Contents</p>
          </div>
          <div>Container</div>
        </TongContents>
        <TongFooter />
        {/* <Tong>
        <Tong.Top>top</Tong.Top>
        <Tong.Header>Header</Tong.Header>
        <Tong.Gnb>Gnb</Tong.Gnb>
        <Tong.TopSelect>TopSelect</Tong.TopSelect>
        <Tong.Container>
          <div>
            <div className="h-[150px] bg-red-100">side nav</div>
          </div>
          <div className="min-h-[1000px]"></div>
          <div>Container</div>
        </Tong.Container>
        <Tong.Footer>Footer</Tong.Footer>
      </Tong> */}
      </div>
    </TongProvider>
  );
}
