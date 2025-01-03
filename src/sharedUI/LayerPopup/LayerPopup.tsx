import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext, HTMLAttributes } from 'react';

// type LayerPopupContextType = "base" | "full" | "scroll";

type typeMode = "base" | "full" | "scroll" | "absolute";
interface LayerPopupContextType {
  type: typeMode;
}

const LayerPopupContext = createContext<LayerPopupContextType | null>(null);
const useLayerPopupContext = () => {
  const context = useContext(LayerPopupContext);
  if(!context) {
    throw new Error('Error')
  }
  return context;
}

// size controls
const BodyMargin = "mt-6";
const FooterMargin = "mt-6";
const ScrollBodyPadding = "p-6 pt-0 md:p-9 md:pt-0";
const ScrollCloseButtonPadding = "pr-6 pt-6 md:pt-9 md:pr-9";
const CloseButtonSize = "w-8 h-8 md:w-9 md:h-9";

const LayerPopupVariants = cva(`
  min-w-[300px] max-w-[90dvw] w-max max-h-[90dvh] xl:max-w-[1280px] absolute flex flex-col
  scroll overflow-hidden rounded-lg transition-all
  `, {
  variants: {
    type: {
      base: 'center_center p-6 md:p-9',
      full: 'center_center w-[100dvw] max-w-[100dvw] h-[100dvh] max-h-dvh lg:min-w-[300px] lg:max-w-[90dvw] lg:w-max lg:h-fit lg:max-h-[90dvh] rounded-none',
      scroll: 'center_center overflow-hidden',
      absolute: 'max-w-[100dvw] w-auto top-0 left-0 right-0 p-6 md:p-9',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      base: 'bg-white',
      type1: '',
    },
    round: {
      base: '',
      sm: "rounded-sm",
      md: "rounded-md",
      xl: "rounded-xl",
    },
  },
  defaultVariants: {
    type: 'base',
    align: 'left',
    color: 'base',
    round: 'base',
  },
});

interface LayerPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, "type" | "color">,
  VariantProps<typeof LayerPopupVariants> {
  type?: typeMode;
  children: React.ReactNode;
  isOpen?: boolean;
  OpenEvent?: () => void;
  dimm?: boolean;
  parentClass?: string;
  addClass?: string;
  close?: boolean;
}

interface LayerPopupType extends React.FC<LayerPopupProps> {
  Header: typeof PopupHeader;
  Body: typeof PopupBody;
  Footer: typeof PopupFooter;
}

interface PopupHeaderProps {
  children: React.ReactNode;
}

interface PopupBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, "type" | "color">,
VariantProps<typeof LayerPopupVariants>  {
  children: React.ReactNode;
}

interface PopupFooterProps {
  children: React.ReactNode;
}

const LayerPopup: LayerPopupType = ({
  isOpen,
  OpenEvent,
  children,
  type = "base",
  align,
  dimm = true,
  close = true,
  color,
  round,
  parentClass,
  addClass,
  ...props
}) => {

  const className = LayerPopupVariants ({
    type: type as typeMode | undefined,
    align: align as "left" | "center" | "right" | undefined,
    color: color as "base" | "type1" | undefined,
    round: round as "base" | "sm" | "md" | "xl" | undefined,
  });

  const atAbsolute = type === "absolute";
  const atFull = type === "full";
  const atScroll = type === "scroll";

  return (
    <>
      <LayerPopupContext.Provider value={{ type }}>
        <div
        className={`${cn('top-0 left-0 z-10 transition-all duration-300', parentClass)}
        ${atAbsolute ? '' : 'fixed w-dvw h-dvh'}
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        ${dimm ? 'bg-gray-1000 bg-opacity-65' : ''}
        `}>
          <div
            className={`${cn(className, addClass)} ${dimm ? '' : 'border border-gray-300'}`}
            {...props}
          >
            { close && (
              <div className={`flex ${atFull ? 'justify-start' : atScroll ? `${ScrollCloseButtonPadding} justify-end` : 'justify-end'}`}>
                <button type="button" className={`${CloseButtonSize} bg-center bg-no-repeat bg-[length:60%_60%]
                  ${atFull ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg")]'
                    : 'bg-right bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg")]'}
                  `} onClick={OpenEvent}>
                  <span className="sr-only">팝업 닫기</span>
                </button>
              </div>
            )}

            {atScroll ? (
              <div className={`${ScrollBodyPadding} flex flex-col w-full h-full scroll overflow-auto`}>
              { children }
              </div>
            ) : children }

          </div>
        </div>
      </LayerPopupContext.Provider>
    </>
  )
};

const PopupHeader: React.FC<PopupHeaderProps> = ({ children }) => {
  return (
    <>
      <div className="popup-header bg-gray-200">
        { children }
      </div>
    </>
  )
}

const PopupBody: React.FC<PopupBodyProps> = ({ children }) => {
  const { type } = useLayerPopupContext();

  return (
    <>
      <div className={`${type === "full" ? '' : BodyMargin} popup-body flex-1 scroll ${type === "scroll" ? '' : 'overflow-auto'} bg-gray-400`}>
        { children }
      </div>
    </>
  )
}

const PopupFooter: React.FC<PopupFooterProps> = ({ children }) => {
  const { type } = useLayerPopupContext();

  return (
    <>
      <div className={`${type === "full" ? '' : FooterMargin} popup-footer bg-gray-200`}>
        { children }
      </div>
    </>
  )
}

LayerPopup.Header = PopupHeader;
LayerPopup.Body = PopupBody;
LayerPopup.Footer = PopupFooter;

export default LayerPopup;