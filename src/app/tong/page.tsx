
'use client';
import React, { useRef, useEffect } from 'react';
import { TongProvider } from '../../sharedUI/Tong/TongContext';
import { TongLayoutPage } from '../../sharedUI/Tong/TongLayout';
import { BarGraph } from '../../sharedUI/Graph/BarGraph';
import { DonutGraph } from '../../sharedUI/Graph/DonutGraph';
import { DonutGraphCanvas } from '../../sharedUI/Graph/DonutGraphCanvas';

export default function TongLayoutTestPage() {
  return (
    <TongProvider top={true} gnb={true} sideNav={true} topBottom={true}>
      {/*
      top = 학원로고 영역,
      gnb = 메인 메뉴,
      sideNav = 좌측 네비게이션,
      topBottom = 현재 상담중인 학생 DropDown영역
       'bg-[#FEDA62]': type === 'type_1',
                  'bg-[#84DCCA]'
      */}
      <TongLayoutPage>
        <div className="h-[1500px] bg-gray-50">
          <div className="flex justify-center w-full">
            <DonutGraphCanvas
              size={{ size: 200, depth: 10 }}
              color={['orange', '#e9e9e9']}
              min={0}
              max={100}
              score={99}
              addClass="text-xl"
              disabled
            />
          </div>
          <div className="flex flex-wrap gap-5">
            <DonutGraphCanvas
              size={{ size: 100, depth: 20 }}
              min={0}
              max={100}
              score={21}
            />
            <DonutGraphCanvas
              size={{ size: 300, depth: 60 }}
              color={['#23d599', '#e9e9e9']}
              min={0}
              max={1000}
              score={715}
              addClass="text-[1.875rem]"
            />
            <DonutGraph
              size={{ width: 100, depth: 10 }}
              color={['orange', '#e9e9e9']}
              min={0}
              max={100}
              score={78}
            />
            <DonutGraph
              size={{ width: 178, depth: 25 }}
              color={['red', '#e9e9e9']}
              min={0}
              max={100}
              score={78}
            />
            <DonutGraph
              size={{ width: 300, depth: 15 }}
              min={0}
              max={100}
              score={78}
              addClass="text-[3.5rem]"
            />
            <DonutGraph
              size={{ width: 300, depth: 40 }}
              color={['#23d599', '#e9e9e9']}
              min={0}
              max={1000}
              score={817}
              addClass="text-[2rem]"
            />
          </div>
          <div className="flex flex-wrap gap-15">
            <BarGraph disabled />
            <BarGraph
              size="sm"
              color={['#84DCCA', '#ddd']}
              min={0}
              max={100}
              average={85}
              myscore={99}
            />
            <BarGraph
              size="md"
              color={['#FEDA62', '#ddd']}
              min={350}
              max={900}
              average={800}
              myscore={10}
            />
            <BarGraph size="lg" min={200} max={850} average={7} myscore={650} />
            <BarGraph
              color={['purple', '#ddd']}
              min={200}
              max={850}
              average={700}
              myscore={650}
              addClass="h-[3rem] text-base text-white"
            />
          </div>
        </div>
      </TongLayoutPage>
    </TongProvider>
  );
}
