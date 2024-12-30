
"use client";
import { cn }  from "../../sharedUI/common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext } from 'react';

type modeType = "type1" | "type2" | "type3";
interface DivContextType {
  modeType: modeType;
}

const DivContext = createContext<DivContextType | null>(null);
const useDivContext = () => {
  const context = useContext(DivContext);
  if(!context) {
    throw new Error('Error');
  }
  return context;
}

const TopStyle = cva('TopStyle css..', {
  variants: {
    mode: {
      type1: 'type1..',
      type2: 'type2..',
      type3: 'type3..',
    },
  },
});
const BottomStyle = cva('BottomStyle css..', {
  variants: {
    mode: {
      type1: 'type1..',
      type2: 'type2..',
      type3: 'type3..',
    },
  },
});

interface DivType {
  children?: React.ReactNode;
  modeType: modeType;
}

interface DivProps extends React.FC<DivType> {
  Top: typeof DivTop;
  Bottom: typeof DivBottom;
}

interface DivTopType extends VariantProps<typeof TopStyle> {
  children?: React.ReactNode;
  addClass?: string;
}

interface DivBottomType extends VariantProps<typeof BottomStyle> {
  children?: React.ReactNode;
  addClass?: string;
}

const DivTest: DivProps = ({ children, modeType = "type1"}) => {
  console.log(modeType)
  return (
    <>
      <DivContext.Provider value={{ modeType }}>
        <div className=''>
          { children }
        </div>
      </DivContext.Provider>
    </>
  );
};

const DivTop: React.FC<DivTopType> = ({ children, addClass, ...props }) => {
  const { modeType } = useDivContext();
  const className = TopStyle({
    mode: modeType as modeType | undefined,
  })

  return (
    <>
      <div className={`${cn(className, addClass)}`} {...props}>
        { children }
      </div>
    </>
  );
}

const DivBottom: React.FC<DivBottomType> = ({ children, addClass, ...props }) => {
  const { modeType } = useDivContext();
  const className = BottomStyle({
    mode: modeType as modeType | undefined,
  })

  return (
    <>
      <div className={`${cn(className, addClass)}`} {...props}>
        { children }
      </div>
    </>
  );
}

DivTest.Top = DivTop;
DivTest.Bottom = DivBottom;

export default DivTest;