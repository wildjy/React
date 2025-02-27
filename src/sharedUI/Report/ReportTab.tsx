
'use client';
import React, { forwardRef } from 'react';
import { ScrollFixed } from '../Layout/ScrollFixed';
import Tab  from '../Tab/Tab';

interface ReportTabProps {
  targetHeight?: number | null;
  isFixed: boolean;
  fixOffset: string;
  mainTab?: { label: string; url: string }[];
  initTab?: number;
  children?: React.ReactNode;
  onChange?: () => void;
}

// eslint-disable-next-line react/display-name
export const ReportTab = forwardRef<HTMLDivElement, ReportTabProps>(({ isFixed, fixOffset, targetHeight, mainTab, initTab = 0 }, ref) => {
  return (
    <div className="relative z-10">
      <Tab initTab={initTab} modeType="type4">
        <ScrollFixed top={`${fixOffset}`} addStyle={{ height: `${targetHeight}px` }}>
          <div ref={ref} className={`bg-white ${isFixed ? 'pt-0 border-b' : 'pt-2 md:pt-4'}`}>
            <Tab.List addClass={`${isFixed ? 'm-center xl:w-[76.5rem] border-b-0' : 'pt-2 md:pt-4'}`}>
              {mainTab?.map((tab, index) => (
                <Tab.Button key={index} link={true} href={tab.url} blank addClass={`${isFixed && 'py-[0.375rem]'}`}>
                  {tab.label}
                </Tab.Button>
              ))}
            </Tab.List>
          </div>
        </ScrollFixed>
      </Tab>
    </div>
  );
});
