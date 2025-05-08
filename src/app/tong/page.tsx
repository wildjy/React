
'use client';
import React, { useRef, useEffect } from 'react';
import { TongProvider } from '../../sharedUI/Tong/TongContext';
import { TongHeader } from '../../sharedUI/Tong/TongHeader';
import { TongTop } from '../../sharedUI/Tong/TongTop';
import { TongGnb } from '../../sharedUI/Tong/TongGnb';
import TongTopBottom  from '../../sharedUI/Tong/TongTopBottom';
import TongContents  from '../../sharedUI/Tong/TongContents';
import { TongSideNav }  from '../../sharedUI/Tong/TongSideNav';
import { TongFooter } from '../../sharedUI/Tong/TongFooter';

export default function TongLayoutPage() {
  return (
    <TongProvider sideNav topBottom>
      <div className="wrapper.. overflow-hidden">
        <TongHeader />
        <TongTop />
        <TongGnb />
        <TongTopBottom />
        <TongContents>
          <TongSideNav />
          <div>
            <p className="min-h-[2000px] bg-gray-50">Contents</p>
          </div>
          <div>Container</div>
        </TongContents>
        <TongFooter />
      </div>
    </TongProvider>
  );
}
