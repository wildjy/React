
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
import { BarGraph } from '../../sharedUI/Graph/BarGraph';

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
            <div className="min-h-[2000px] bg-gray-50">
              <div className="flex flex-wrap gap-15">
                <BarGraph disabled />
                <BarGraph size="sm" min={0} max={100} average={85} myscore={90} />
                <BarGraph type="type_1" size="md" min={350} max={900} average={800} myscore={875} />
                <BarGraph type="type_2" size="lg" min={200} max={850} average={700} myscore={290} />
              </div>
            </div>
          </div>
          <div>Container</div>
        </TongContents>
        <TongFooter />
      </div>
    </TongProvider>
  );
}
