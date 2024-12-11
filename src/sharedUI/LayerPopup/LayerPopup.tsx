import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { createContext, HTMLAttributes } from 'react';
// min-w-[90dvw] nax-w-full
const LayerPopupVariants = cva(`
  inner p-8 xl:max-w-[1280px] flex flex-col absolute center_center scroll overflow-hidden rounded-lg
  `, {
  variants: {
    type: {
      base: 'max-w-[90dvw] min-w-[300px] w-max max-h-[90dvh]',
      full: 'p-0 w-[100dvw] h-[100dvh] lg:min-w-[300px] lg:max-w-[90dvw] lg:w-max lg:max-h-[90dvh] rounded-none',
      scroll: 'overflow-auto',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      base: 'bg-white',
      type1: 'd',
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

interface PopupBodyProps {
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

  const atFull = type && ["full"].includes(type);

  return (
    <>
     {isOpen && (
      <div className={`layerPopup fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-10`}>
        <div
          className={cn(className, addClass)}
          {...props}
        >
          { children }
          { !atFull && (
            <div className="fixed top-5 right-5">
              <button type="button" className="w-9 h-9
                bg-center
                bg-no-repeat
                bg-[length:60%_60%]
                bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg')]" onClick={OpenEvent}>
                <span className="sr-only">팝업 닫기</span>
              </button>
            </div>
          )}
        </div>
      </div>
     )}
    </>
  )
};

const PopupHeader: React.FC<PopupHeaderProps> = ({ children}) => {
  return (
    <>
      <div className="popup-header bg-gray-200">
        { children }
      </div>
    </>
  )
}

const PopupBody: React.FC<PopupBodyProps> = ({ children }) => {
  return (
    <>
      <div className="popup-body flex-1 scroll overflow-auto">
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