import React from 'react';
import { InfoTransformItem } from '../InfoTransformItem';
import { InfoTransformFrame } from '../InfoTransformFrame';

export default {
  title: 'UI/InfoTransform/InfoTransformItem',
  component: InfoTransformItem,
  tags: ['autodocs'],
};

const dummyItems = [
  {
    title: { tit: '국어', sub: '표준점수' },
    value: '132',
    arrow: { value: 5, arrowType: true },
    tooltip: {
      show: true,
      data: {
        title: '국어 점수',
        text: '표준점수 기준 국어 성적입니다.',
      },
    },
  },
  {
    title: { tit: '수학', sub: '표준점수' },
    value: '140',
    arrow: { value: 3, arrowType: false },
    tooltip: {
      show: true,
      data: {
        title: '수학 점수',
        text: '미적분 선택 기준 점수입니다.',
      },
    },
  },
  {
    title: { tit: '영어', sub: '표준점수' },
    value: '2',
    text: '등급',
    tooltip: {
      show: true,
      data: {
        title: '영어 등급',
        text: '절대평가 과목입니다.',
      },
    },
  },
  {
    title: { tit: '탐구', sub: '표준점수' },
    value: '65',
    arrow: { value: 2, arrowType: true },
    url: '/',
  },
];

export const Default = () => (
  <div className="p-6 bg-gray-50">
    <InfoTransformFrame type="rec">
      {dummyItems.map((item, index) => (
        <InfoTransformItem
          key={index}
          {...item}
          index={index}
          lastIndex={index === dummyItems.length - 1}
        />
      ))}
    </InfoTransformFrame>
  </div>
);

export const Rec1 = () => (
  <div className="p-6 bg-gray-50">
    <InfoTransformFrame type="rec1">
      {dummyItems.map((item, index) => (
        <InfoTransformItem
          key={index}
          {...item}
          index={index}
          lastIndex={index === dummyItems.length - 1}
        />
      ))}
    </InfoTransformFrame>
  </div>
);

export const RecBg = () => (
  <div className="p-6 bg-gray-100">
    <InfoTransformFrame type="recBg">
      {dummyItems.map((item, index) => (
        <InfoTransformItem
          key={index}
          {...item}
          index={index}
          lastIndex={index === dummyItems.length - 1}
        />
      ))}
    </InfoTransformFrame>
  </div>
);

export const TooltipByIndex = () => (
  <div className="p-6 bg-gray-50">
    <InfoTransformFrame type="rec">
      {dummyItems.map((item, index) => (
        <InfoTransformItem
          key={index}
          {...item}
          index={index}
          tooltip={{
            ...item.tooltip,
            show: index === 1, // 수학만 tooltip
          }}
        />
      ))}
    </InfoTransformFrame>
  </div>
);
