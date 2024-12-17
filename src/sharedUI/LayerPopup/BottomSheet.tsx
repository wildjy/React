import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { createContext, useContext, HTMLAttributes } from 'react';

type BottomSheetContextType = "base" | "full" | "scroll" | "bottom";
const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

// size controls
const BodyMargin = "mt-6";
const FooterMargin = "mt-6";
const CloseButtonSize = "w-8 h-8 md:w-9 md:h-9";

const BottomSheetVariants = cva(`
  min-w-[300px] max-w-[100dvw] w-max xl:max-w-[1280px] fixed x_center bottom-0 flex flex-col
  scroll overflow-hidden transition-all duration-500 rounded-t-lg z-10
  `, {
  variants: {
    type: {
      base: 'p-6 md:p-9 max-h-[90dvh]', // max-h-[90dvh]
      full: 'max-h-dvh lg:max-h-[90dvh] rounded-t-none lg:rounded-t-lg',
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
      sm: "rounded-t-sm",
      md: "rounded-t-md",
      xl: "rounded-t-xl",
    },
  },
  defaultVariants: {
    type: 'base',
    align: 'left',
    color: 'base',
    round: 'base',
  },
});

interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, "type" | "color">,
  VariantProps<typeof BottomSheetVariants> {
  children: React.ReactNode;
  isOpen: boolean;
  OpenEvent?: () => void;
  type?: "base" | "full";
  dimm?: boolean;
  addClass?: string;
  close?: boolean;
}

interface BottomSheetType extends React.FC<BottomSheetProps> {
  Header: typeof PopupHeader;
  Body: typeof PopupBody;
  Footer: typeof PopupFooter;
}

interface PopupHeaderProps {
  children: React.ReactNode;
}

interface PopupBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, "type" | "color">,
VariantProps<typeof BottomSheetVariants>  {
  children: React.ReactNode;
}

interface PopupFooterProps {
  children: React.ReactNode;
}

const BottomSheet: BottomSheetType = ({
  isOpen,
  OpenEvent,
  children,
  type,
  align,
  dimm = true,
  close = true,
  color,
  round,
  addClass,
  ...props
}) => {

  const className = BottomSheetVariants ({
    type: type as "base" | "full" | undefined,
    align: align as "left" | "center" | "right" | undefined,
    color: color as "base" | "type1" | undefined,
    round: round as "base" | "sm" | "md" | "xl" | undefined,
  });

  const typeMode = type  || "base"  || "full";
  const atFull = type === "full";

  return (
    <>
     {/* {isOpen && ( */}
      <BottomSheetContext.Provider value={ typeMode }>
        <div
        className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible' } fixed top-0 left-0 w-dvw h-dvh z-10 transition-all duration-300
        ${dimm ? 'bg-gray-1000 bg-opacity-65' : ''}`}>
          <div
            className={cn(className, addClass, {
              'translate-y-0': isOpen,
              'translate-y-full': !isOpen,
              'border border-gray-300': !dimm,
            })}
            {...props}
          >
            { close && (
              <div className={`flex ${atFull ? 'justify-start' : 'justify-end'}`}>
                <button type="button" className={`${CloseButtonSize}
                  bg-center
                  bg-no-repeat
                  bg-[length:60%_60%]
                  ${atFull ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg")]'
                    : 'bg-right bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg")]'}
                  `} onClick={OpenEvent}>
                  <span className="sr-only">팝업 닫기</span>
                </button>
              </div>
            )}

            { children }

          </div>
        </div>
      </BottomSheetContext.Provider>
     {/* )} */}
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
  const type = useContext(BottomSheetContext);

  return (
    <>
      <div className={`${type === "full" ? '' : BodyMargin} popup-body flex-1 scroll overflow-auto bg-gray-400`}>
        { children }
      </div>
    </>
  )
}

const PopupFooter: React.FC<PopupFooterProps> = ({ children }) => {
  const type = useContext(BottomSheetContext);

  return (
    <>
      <div className={`${type === "full" ? '' : FooterMargin} popup-footer bg-gray-200`}>
        { children }
      </div>
    </>
  )
}

BottomSheet.Header = PopupHeader;
BottomSheet.Body = PopupBody;
BottomSheet.Footer = PopupFooter;

export default BottomSheet;