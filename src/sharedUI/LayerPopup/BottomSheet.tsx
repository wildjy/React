import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { createContext, useContext, HTMLAttributes } from 'react';

type BottomSheetContextType = "base" | "full" | "scroll" | "bottom";

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

const BottomSheetVariants = cva(`
  inner p-8 fixed bottom-0 x_center min-w-[300px] max-w-[100dvw] w-max xl:max-w-[1280px] flex flex-col
  scroll overflow-hidden transition-all duration-500 rounded-t-lg z-10
  `, {
  variants: {
    type: {
      base: 'max-h-[90dvh]', // max-h-[90dvh]
      full: 'max-h-dvh lg:max-h-[90dvh] rounded-t-none lg:rounded-t-lg',
      scroll: '',
      bottom: '',
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
      lg: "rounded-xl",
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
  OpenEvent: () => void;
  type?: "base" | "full" | "scroll" | "bottom";
  addClass?: string;
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
  color,
  round,
  addClass,
  ...props
}) => {

  const className = BottomSheetVariants ({
    type: type as "base" | "full" | "scroll" | "bottom" | undefined,
    align: align as "left" | "center" | "right" | undefined,
    color: color as "base" | "type1" | undefined,
    round: round as "base" | "sm" | "md" | "lg" | undefined,
  });

  const typeMode = type  || "base"  || "full" || "scroll" || "bottom";
  const atFull = type === "full";
  const atScroll = type === "scroll";
  const atBottom = type === "bottom";

  return (
    <>
     {/* {isOpen && ( */}
      <BottomSheetContext.Provider value={ typeMode }>
        <div
        className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible' } layerPopup fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-10`}>
          <div
            className={cn(className, addClass, {
              'translate-y-0': isOpen,
              'translate-y-full': !isOpen,
            })}
            {...props}
          >
            { !atFull && (
              <div className="flex justify-end">
                <button type="button" className="w-9 h-9
                  bg-center
                  bg-no-repeat
                  bg-[length:60%_60%]
                  bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg')]" onClick={OpenEvent}>
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

  console.log(type)
  console.log(type === "scroll")

  return (
    <>
      <div className={`popup-body flex-1 scroll ${type === "scroll" ? '' : 'overflow-auto'}`}>
        { children }
      </div>
    </>
  )
}

const PopupFooter: React.FC<PopupFooterProps> = ({ children }) => {
  return (
    <>
      <div className="popup-footer">
        { children }
      </div>
    </>
  )
}

BottomSheet.Header = PopupHeader;
BottomSheet.Body = PopupBody;
BottomSheet.Footer = PopupFooter;

export default BottomSheet;