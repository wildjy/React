import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { createContext, useContext, HTMLAttributes, useRef, useEffect } from 'react';

type typeMode = 'base' | 'full' | 'scroll' | 'absolute' | 'bottomSheet';
interface LayerPopupContextType {
  type: typeMode;
}

const LayerPopupContext = createContext<LayerPopupContextType | null>(null);
const useLayerPopupContext = () => {
  const context = useContext(LayerPopupContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

// size controls
const BodyMargin = 'mt-0';
const FooterMargin = 'mt-0';
const ScrollBodyPadding = 'p-5 pt-0 md:p-8 md:pt-0';
const ScrollCloseButtonPadding = 'pr-5 pt-5 md:pt-8 md:pr-8';
const CloseButtonSize = 'w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10';

const LayerPopupVariants = cva(
  `
  min-w-[300px] max-w-[90dvw] w-max max-h-[90dvh] xl:max-w-[1280px] absolute flex flex-col
  scroll overflow-hidden rounded-lg transition-all
  `,
  {
    variants: {
      type: {
        base: 'px-5 pt-5 pb-5 md:px-10 md:pt-6 md:pb-12',
        full: `
          w-[100dvw] max-w-[100dvw] md:min-w-[300px] md:max-w-[90dvw] md:w-max
          h-[100dvh] max-h-dvh md:h-auto md:max-h-[90dvh]
          rounded-none
        `,
        scroll: 'overflow-hidden',
        absolute: 'max-w-[100dvw] w-auto top-0 left-0 p-5 md:p-8',
        bottomSheet: `
          bottom-0 md:bottom-auto
          max-w-[100dvw] max-h-[70dvh]
          translate-y-full md:translate-none
          px-5 pt-5 pb-5 md:px-10 md:py-7
          transition-all duration-300 md:duration-0
          rounded-b-none md:rounded-b-lg
        `,
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
        sm: 'rounded-sm',
        md: 'rounded-md',
        xl: 'rounded-xl',
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

interface LayerPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type' | 'color'>, VariantProps<typeof LayerPopupVariants> {
  type?: typeMode;
  children: React.ReactNode;
  isOpen?: boolean;
  OpenEvent?: () => void;
  dimm?: boolean;
  parentClass?: string;
  addClass?: string;
  closeType?: string;
  close?: boolean;
  outClose?: boolean;
}

interface LayerPopupType extends React.FC<LayerPopupProps> {
  Header: typeof PopupHeader;
  Body: typeof PopupBody;
  Footer: typeof PopupFooter;
}

interface PopupHeaderProps {
  children?: React.ReactNode;
  addClass?: string;
}

interface PopupBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'type' | 'color'>, VariantProps<typeof LayerPopupVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

interface PopupFooterProps {
  children?: React.ReactNode;
  addClass?: string;
}

const LayerPopup: LayerPopupType = ({
  isOpen,
  OpenEvent,
  children,
  type = 'base',
  align,
  dimm = true,
  closeType = 'default',
  close = true,
  outClose = false,
  color,
  round,
  parentClass,
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

  const className = LayerPopupVariants({
    type: type as typeMode | undefined,
    align: align as 'left' | 'center' | 'right' | undefined,
    color: color as 'base' | 'type1' | undefined,
    round: round as 'base' | 'sm' | 'md' | 'xl' | undefined,
  });

  const atAbsolute = type === 'absolute';
  const atBottomSheet = type === 'bottomSheet';
  // const atFull = type === 'full';
  // ${type === 'full' && dimm ? 'md:bg-gray-1000 md:bg-opacity-65' : 'bg-gray-1000 bg-opacity-65'}
  const atScroll = type === 'scroll';

  return (
    <LayerPopupContext.Provider value={{ type }}>
      <div
        className={`
        ${cn('top-0 left-0 transition-all duration-50 md:duration-0', parentClass, {
          'opacity-100 visible z-[100]': isPopupOpen,
          'opacity-0 invisible': !isPopupOpen,
          'fixed w-dvw h-dvh md:w-full flex justify-center items-center': !atAbsolute,
          'w-auto md:w-auto': atAbsolute,
          'bg-gray-1000 bg-opacity-65': dimm,
        })}
        `}
      >
        <div
          ref={layerRef}
          className={`${cn(className, { 'md:pt-12': !close }, addClass, {
            'border border-gray-300': dimm,
            'shadow-lg': !dimm,
            'translate-y-0 md:translate-none': isPopupOpen && atBottomSheet,
          })}`}
          {...props}
        >
          {close && (
            <div
              className={`flex ${
                closeType === 'back' ? 'justify-start' : atScroll ? `${ScrollCloseButtonPadding} justify-end` : 'justify-end'
              }`}
            >
              <button
                type="button"
                className={`${CloseButtonSize} bg-center bg-no-repeat bg-[length:60%_60%]
                  ${
                    closeType === 'back'
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

          {atScroll ? <div className={`${ScrollBodyPadding} flex flex-col w-full h-full scroll overflow-auto`}>{children}</div> : children}
        </div>
      </div>
    </LayerPopupContext.Provider>
  );
};

const PopupHeader: React.FC<PopupHeaderProps> = ({ children, addClass }) => {
  return <div className={`${cn('popup-header', addClass)}`}>{children}</div>;
};

const PopupBody: React.FC<PopupBodyProps> = ({ children, addClass }) => {
  const { type } = useLayerPopupContext();

  return (
    <div
      className={`${cn('pb-.5 popup-body flex-1 scroll', addClass)}
      ${type === 'full' ? '' : BodyMargin}
      ${type === 'scroll' ? '' : 'overflow-hidden overflow-y-auto'}`}
    >
      {children}
    </div>
  );
};

const PopupFooter: React.FC<PopupFooterProps> = ({ children, addClass }) => {
  const { type } = useLayerPopupContext();

  return <div className={`${cn('popup-footer', addClass)} ${type === 'full' ? '' : FooterMargin}`}>{children}</div>;
};

LayerPopup.Header = PopupHeader;
LayerPopup.Body = PopupBody;
LayerPopup.Footer = PopupFooter;

export default LayerPopup;

