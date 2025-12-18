import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";
import { InfoTransformProvider, InfoTransformType } from "./Provider/InfoTransformProvider";

/*
 InfoTransformFrame 컴포넌트는 InfoTransformItem 컴포넌트를 감싸서 레이아웃을 구성하는 역할을 합니다.
 다양한 타입의 프레임을 지원하며, 각 타입에 따라 다른 스타일과 레이아웃을 적용할 수 있습니다.
*/

const InfoTransformFrameVariants = cva('flex flex-col md:flex-row', {
  variants: {
    type: {
      rec: 'rec.. gap-x-1 gap-y-3 md:gap-y-0',
      rec1: 'rec1.. gap-y-3 md:gap-y-0 md:p-5 md:bg-white md:rounded-lg',
      recBg: 'recBg.. gap-x-3',
      recLine: 'md:py-6 lg:py-10 pt-5 border-t md:border md:border-grayBlue-100 md:rounded-lg gap-x-1 gap-y-3 md:gap-y-0',
      recCustom: 'recCustom..',
    }
  },
  defaultVariants: {
    type: 'rec',
  }
});

interface InfoTransformFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type'>,
VariantProps<typeof InfoTransformFrameVariants> {
  type?: InfoTransformType;
  display?: string;
  children?: React.ReactNode;
  addClass?: string;
  leftClass?: string;
  rightClass?: string;
  widths?: string[];
}

export const InfoTransformFrame: React.FC<InfoTransformFrameProps> = ({
  type,
  display,
  children,
  addClass,
  widths = [],
}) => {
  const slots = React.Children.toArray(children);
  const mode = display ?? 'flex';

  const className = InfoTransformFrameVariants({ type })

  const recClass = `
    md:pb-4 md:pt-6
    md:justify-center
    items-start
    bg-white
    md:border md:border-gray-200
    rounded-lg
  `
  const rec1Class = `
    md:justify-center
    items-center
    md:border-dashed md:border-l first:border-l-0
  `
  const recBgClass = `
    md:p-6
    md:bg-grayBlue-50
    md:rounded-lg
  `
  const recLineClass = `
    md:justify-center
    items-start
    md:border-dashed md:border-l first:border-l-0
  `
  const recCustomClass = `
    md:justify-center
    items-start
    md:border-dashed md:border-l first:border-l-0
  `

  return (
    <InfoTransformProvider type={type ?? 'rec'}>
      <div className={`
        ${cn(className, addClass)}`}>
          {slots.length > 0 ?
            slots.map((slot, index) => slot && (
            <div
              key={index}
              className={`${cn(widths[index] ?? "flex-1 flex",
                type === 'rec' && recClass,
                type === 'rec1' && rec1Class,
                type === 'recBg' && recBgClass,
                type === 'recLine' && recLineClass,
                type === 'recCustom' && recCustomClass,
              )}`}>
                {slot}
            </div>
          )) : (
            <div>no data</div>
          )
        }
      </div>
    </InfoTransformProvider>
  );
};
