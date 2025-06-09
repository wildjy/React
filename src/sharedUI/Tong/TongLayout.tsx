'use client';
import React, { useRef, useEffect } from 'react';
import { useTong } from '../../sharedUI/Tong/TongContext';
import { TongHeader } from '../../sharedUI/Tong/TongHeader';
import { TongTop } from '../../sharedUI/Tong/TongTop';
import { TongGnb } from '../../sharedUI/Tong/TongGnb';
import TongTopBottom  from '../../sharedUI/Tong/TongTopBottom';
import TongContents  from '../../sharedUI/Tong/TongContents';
import { TongSideNav }  from '../../sharedUI/Tong/TongSideNav';
import { TongFooter } from '../../sharedUI/Tong/TongFooter';

interface TongLayoutPageProps {
  children?: React.ReactNode;
}

export const TongLayoutPage: React.FC<TongLayoutPageProps> = ({ children }) => {
  const { top, gnb, sideNav, topBottom } = useTong();

  return (
    <div className="wrapper.. overflow-hidden">
      <TongHeader />
      {top && <TongTop />}
      {gnb && <TongGnb />}
      {topBottom && <TongTopBottom />}
      <TongContents>
        {sideNav && <TongSideNav />}
        <div>{children}</div>
      </TongContents>
      <TongFooter />
    </div>
  );
};
