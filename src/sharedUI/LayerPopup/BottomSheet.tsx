import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { createContext, useContext, HTMLAttributes, useRef, useEffect } from 'react';

type typeMode = 'base' | 'full';
interface BottomSheetContextType {
  type: typeMode;
}
const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

const BottomUseContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
};

// size controls
const BodyMargin = 'mt-0';
const FooterMargin = 'mt-0';
const CloseButtonSize = 'w-7 h-7 md:w-8 md:h-8';

const BottomSheetVariants = cva(
  `
  min-w-[300px] max-w-[100dvw] w-max xl:max-w-[1280px] fixed x_center bottom-0 flex flex-col
  scroll overflow-hidden transition-all duration-500 rounded-t-lg z-[100]
  `,
  {
    variants: {
      type: {
        base: 'p-5 md:p-8 max-h-[90dvh]',
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
        sm: 'rounded-t-sm',
        md: 'rounded-t-md',
        xl: 'rounded-t-xl',
        '2xl': 'rounded-t-2xl',
      },
    },
    defaultVariants: {
      type: 'base',
      align: 'left',
      color: 'base',
      round: 'base',
    },
  }
);

interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type' | 'color'>, VariantProps<typeof BottomSheetVariants> {
  type?: typeMode;
  children: React.ReactNode;
  isOpen: boolean;
  OpenEvent?: () => void;
  dimm?: boolean;
  addClass?: string;
  close?: boolean;
  outClose?: boolean;
}

interface BottomSheetType extends React.FC<BottomSheetProps> {
  Header: typeof PopupHeader;
  Body: typeof PopupBody;
  Footer: typeof PopupFooter;
}

interface PopupHeaderProps {
  children: React.ReactNode;
  addClass?: string;
}

interface PopupBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type' | 'color'>, VariantProps<typeof BottomSheetVariants> {
  children: React.ReactNode;
  addClass?: string;
}

interface PopupFooterProps {
  children: React.ReactNode;
  addClass?: string;
}

const BottomSheet: BottomSheetType = ({
  isOpen,
  OpenEvent,
  children,
  type = 'base',
  align,
  dimm = true,
  close = true,
  outClose = false,
  color,
  round,
  addClass,
  ...props
}) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const isPopupOpen = isOpen ?? false;

  const openMouseEvent = (event: MouseEvent) => {
    if (outClose && isPopupOpen && layerRef.current && !layerRef.current.contains(event.target as Node)) {
      OpenEvent?.();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {
      document.removeEventListener('mousedown', openMouseEvent);
    };
  }, [isPopupOpen]);

  const className = BottomSheetVariants({
    type: type as 'base' | 'full' | undefined,
    align: align as 'left' | 'center' | 'right' | undefined,
    color: color as 'base' | 'type1' | undefined,
    round: round as 'base' | 'sm' | 'md' | 'xl' | undefined,
  });

  const atFull = type === 'full';

  return (
    <BottomSheetContext.Provider value={{ type }}>
      <div
        className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        fixed bottom-0 left-0 w-dvw md:w-full transition-all duration-300 z-[100]
        ${dimm ? 'top-0 h-dvh bg-gray-1000 bg-opacity-65' : ''} `}
      >
        <div
          ref={layerRef}
          className={cn(className, addClass, {
            'translate-y-0': isPopupOpen,
            'translate-y-full': !isPopupOpen,
            'border border-b-0 border-gray-300': !dimm,
          })}
          {...props}
        >
          {close && (
            <div className={`flex ${atFull ? 'justify-start' : 'justify-end'}`}>
              <button
                type="button"
                className={`${CloseButtonSize}
                  bg-center
                  bg-no-repeat
                  bg-[length:60%_60%]
                  ${
                    atFull
                      ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg")]'
                      : 'bg-right bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_close.svg")]'
                  }
                  `}
                onClick={OpenEvent}
              >
                <span className="sr-only">팝업 닫기</span>
              </button>
            </div>
          )}

          {children}
        </div>
      </div>
    </BottomSheetContext.Provider>
  );
};

const PopupHeader: React.FC<PopupHeaderProps> = ({ children, addClass }) => {
  return <div className={`${cn('popup-header', addClass)}`}>{children}</div>;
};

const PopupBody: React.FC<PopupBodyProps> = ({ children, addClass }) => {
  const { type } = BottomUseContext();

  return (
    <div
      className={`${type === 'full' ? '' : BodyMargin} ${cn('popup-body pb-.5 flex-1 scroll overflow-x-hidden overflow-y-auto', addClass)}`}
    >
      {children}
    </div>
  );
};

const PopupFooter: React.FC<PopupFooterProps> = ({ children, addClass }) => {
  const { type } = BottomUseContext();

  return <div className={`${type === 'full' ? '' : FooterMargin} ${cn('popup-footer', addClass)}`}>{children}</div>;
};

BottomSheet.Header = PopupHeader;
BottomSheet.Body = PopupBody;
BottomSheet.Footer = PopupFooter;

export default BottomSheet;