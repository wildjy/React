import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { createContext, useContext, HTMLAttributes } from 'react';

type LayerPopupContextType = "base" | "full" | "scroll" | "bottom";

const LayerPopupContext = createContext<LayerPopupContextType | null>(null);

const LayerPopupVariants = cva(`
  inner p-8 absolute center_center min-w-[300px] max-w-[90dvw] w-max xl:max-w-[1280px] max-h-[90dvh] flex flex-col
  scroll overflow-hidden rounded-lg transition-all
  `, {
  variants: {
    type: {
      base: '', // max-h-[90dvh]
      full: 'p-0 w-[100dvw] h-[100dvh] max-w-[100dvw] max-h-dvh lg:h-fit lg:max-h-[90dvh] lg:min-w-[300px] lg:max-w-[90dvw] lg:w-max rounded-none',
      scroll: 'p-0 overflow-hidden',
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

interface LayerPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, "type" | "color">,
  VariantProps<typeof LayerPopupVariants> {
  children: React.ReactNode;
  isOpen: boolean;
  OpenEvent: () => void;
  type?: "base" | "full" | "scroll";
  addClass?: string;
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
  type,
  align,
  color,
  round,
  addClass,
  ...props
}) => {

  const className = LayerPopupVariants ({
    type: type as "base" | "full" | "scroll" | undefined,
    align: align as "left" | "center" | "right" | undefined,
    color: color as "base" | "type1" | undefined,
    round: round as "base" | "sm" | "md" | "lg" | undefined,
  });

  const typeMode = type  || "base"  || "full" || "scroll";
  const atFull = type === "full";
  const atScroll = type === "scroll";

  return (
    <>
     {/* {isOpen && ( */}
      <LayerPopupContext.Provider value={ typeMode }>
        <div
        className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible' } layerPopup fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-10 transition-all duration-300`}>
          <div
            className={cn(className, addClass)}
            {...props}
          >
            <div className={`flex ${atFull ? 'justify-start' : atScroll ? 'pt-8 pr-8 justify-end' : 'justify-end'}`}>
              <button type="button" className={`w-9 h-9
                bg-center
                bg-no-repeat
                bg-[length:60%_60%]
                ${atFull ? 'bg-slate-500' : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg")]'}
                `} onClick={OpenEvent}>
                <span className="sr-only">팝업 닫기</span>
              </button>
            </div>

            {atScroll ? (
              <div className={`p-8 pt-0 flex flex-col w-full h-full scroll overflow-auto`}>
              { children }
              </div>
            ) : children }

          </div>
        </div>
      </LayerPopupContext.Provider>
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
  const type = useContext(LayerPopupContext);

  console.log(type)
  console.log(type === "scroll")
  // const { type } = useContext(LayerPopupContext);
  // console.log(type) && ["scroll"]

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

LayerPopup.Header = PopupHeader;
LayerPopup.Body = PopupBody;
LayerPopup.Footer = PopupFooter;

export default LayerPopup;