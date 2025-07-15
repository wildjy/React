
'use client';
import React, { useRef, useEffect } from 'react';
import { TongProvider } from '../../sharedUI/Tong/TongContext';
import { TongLayoutPage } from '../../sharedUI/Tong/TongLayout';
import { BarGraph } from '../../sharedUI/Graph/BarGraph';
import { DonutGraph } from '../../sharedUI/Graph/DonutGraph';
import { DonutGraphCanvas } from '../../sharedUI/Graph/DonutGraphCanvas';
import { DistributionGraph } from '../../sharedUI/Graph/DistributionGraph';

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
          <div>
            <DistributionGraph  />
          </div>

          <div className="flex flex-wrap justify-center w-full gap-y-8">
            <DonutGraphCanvas
              activeLine={{ show: true, label: true }}
              tick={{ show: true, length: 20, label: true }}
              size={{ size: 200, depth: 20, p: 0 }}
              colors={['orange']}
              min={0}
              // mark
              max={100}
              scores={{score: 30}}
              unit="점"
              addClass="text-white md:text-[#272727]"
            />
            <DonutGraphCanvas
              // activeLine={{ show: true, label: true }}
              tick={{ show: true, length: 10, label: true }}
              size={{ size: 200, depth: 20, p: 0 }}
              colors={['#FFCA69', '#FFFF00', '#6969FF']}
              min={0}
              max={100}
              scores={{score: [6.54, 22.46, 31]}}
              unit="%"
            />
            <DonutGraphCanvas
              tick={{ show: true, length: 6, label: true }}
              size={{ size: 200, depth: 20, p: 0 }}
              colors={['#FFCA69', '#358035', '#6969FF']}
              min={0}
              max={60}
              scores={{score: [6.54, 22.46, 31], total: false, label: [6.54, 22.46, 31], center: true}}
            />
            <DonutGraphCanvas
              tick={{ show: true, length: 10, label: true }}
              size={{ size: 200, depth: 20, p: 0 }}
              colors={['#FFCA69', '#FFFF00', '#6969FF', '#358035', '#FF9191']}
              min={0}
              max={100}
              scores={{score: [10, 15, 25, 10, 40], label: true, total: true, legend: true, center: false}}
              unit="%"
            />
            <DonutGraphCanvas
              tick={{ show: false, length: 10, label: true }}
              size={{ size: 200, depth: 40, p: 0 }}
              colors={['#FFCA69', '#FFFF00', '#6969FF', '#358035', '#FF9191']}
              min={0}
              max={100}
              scores={{score: [10, 15, 25, 10, 40], label: true, total: true, legend: true, center: false}}
              unit="%"
            />
            <DonutGraphCanvas
              tick={{ show: false, length: 10, label: true }}
              size={{ size: 180, depth: 90, p: 0 }}
              colors={['#FFCA69', '#FFFF00', '#6969FF', '#358035', '#FF9191']}
              min={0}
              max={100}
              scores={{
                score: [15, 10, 25, 10, 40],
                total: false,
                label: ['국어', '사탐/사탐', '사탐/과탐1', '외국어', '과탐2/과탐2'],
                center: true
              }}
              unit="%"
            />
            <DonutGraphCanvas
              half
              tick={{ show: true, length: 10, label: true, fontSize: '.8rem', }}
              size={{ size: 300, depth: 20, p: 25 }}
              colors={['#8393D6', '#54AEC8', '#99CC33', '#B2B1B1', '#7D7D7D']}
              min={0}
              max={100}
              myscore={{ score: 87.7, label: '상위' }}
              scores={{
                score: [5, 10, 25, 10, 20],
                total: false,
                label: ['국어', '사탐/사탐', '사탐/과탐1', '외국어', '과탐2/과탐2'],
                center: false,
                fontSize: '.8rem',
                color: '#0069E2'
              }}
              unit="%"
            />
            <DonutGraphCanvas
              half
              tick={{ show: false, length: 10, label: true }}
              size={{ size: 300, depth: 150, p: 0 }}
              colors={['#8393D6', '#54AEC8', '#99CC33', '#B2B1B1', '#7D7D7D']}
              min={0}
              max={100}
              scores={{
                score: [10, 15, 25, 10, 40],
                total: true,
                label: ['국어', '사탐/사탐', '사탐/과탐1', '외국어', '과탐2/과탐2'],
                center: true,
                fontSize: '.8rem',
                legend: true,
              }}
              unit="%"
            />
          </div>

          <div>
            <DonutGraphCanvas
              half
              tick={{ show: true, length: 4, label: true }}
              size={{ size: 250, depth: 10, p: 30 }}
              colors={['orange', '#ccc']}
              min={0}
              max={100}
              scores={{ score: 77 }}
              myscore={{ score: 87.7, label: '상위' }}
              unit="%"
              addClass="pb-4 text-xl text-white md:text-[#272727]"
            />
          </div>

          <div className="flex flex-wrap gap-10">
            <DonutGraphCanvas
              tick={{ show: true, length: 5 }}
              size={{ size: 200, depth: 20 }}
              min={0}
              max={100}
              scores={{ score: 20 }}
            />
            <DonutGraphCanvas
              size={{ size: 300, depth: 60 }}
              colors={['#23d599', '#e9e9e9']}
              min={0}
              max={1000}
              scores={{score: 777}}
              addClass="text-[1.875rem]"
            />
            <DonutGraph
              size={{ width: 100, depth: 10 }}
              color={['orange', '#e9e9e9']}
              min={0}
              max={100}
              score={78}
            />
            {/* <DonutGraph
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
            /> */}
          </div>

          <div className="flex flex-wrap gap-15">
            <BarGraph disabled />
            <BarGraph
              size={25}
              color={['#84DCCA', '#ddd']}
              min={0}
              max={100}
              average={85}
              myscore={99}
            />
            <BarGraph
              size={30}
              color={['#FEDA62', '#ddd']}
              min={350}
              max={900}
              average={800}
              myscore={10}
            />
            <BarGraph
              size={40} min={200} max={850} average={7} myscore={650} />
            <BarGraph
              color={['purple', '#ddd']}
              min={200}
              max={850}
              average={700}
              myscore={650}
              addClass="h-[3rem] text-sm text-white"
            />
          </div>
        </div>
      </TongLayoutPage>
    </TongProvider>
  );
}
