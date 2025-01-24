import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';
import { ScoreOption } from './ScoreOption';

type typeMode = "base" | "shadow" | "ghost";
type alignMode = "left" | "center";
interface DropDownContextProps {
  type: typeMode;
  align: alignMode;
  isOpen: boolean;
  selectValue: OptionType | null;
  onOpen: () => void;
  onClose: () => void;
  onChangeSelect: (option: OptionType) => void;
}

const DropDownContext = createContext<DropDownContextProps | null>(null);

const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if(!context) {
    throw new Error('Error');
  }
  return context;
}

const dropTopMargin = 'mt-2';
const DropDownVariants = cva(
  `pe-[1.2rem] sm:pe-[1.8rem] bg-white border border-gray-200
  min-w-[4rem] md:w-full md:max-w-full text-left relative truncate rounded-lg
  after:right-[0.6rem] after:w-[0.5rem] after:h-[0.25rem]
  sm:after:right-[0.75rem] sm:after:w-[0.75rem] sm:after:h-[0.375rem]
  md:after:right-[0.75rem]
  lg:after:right-[1rem] lg:after:w-[0.625rem] lg:after:h-[0.375rem]
  after:bg-[length:100%_100%]
  after:absolute after:transform after:-translate-y-1/2 after:top-[50%]
  after:content-[""] after:bg-center after:bg-no-repeat after:transition-all after:duration-200
  `,
  {
    variants: {
      type: {
        base: '',
        shadow: '',
        ghost: 'border-transparent',
      },
      size: {
        // pr-[1.2rem] sm:pr-[1.2rem]
        sm: `
          pl-[0.4rem] sm:pl-[0.625rem] lg:pl-4 lg:pr-8
          py-[0.1rem] sm:py-[0.3rem] md:py-[0.5rem]
          h-[1.375rem] sm:h-[1.875rem] md:h-[2.5rem] lg:h-[2.375rem]
          text-2xs sm:text-s md:text-base lg:text-s
          rounded md:rounded-lg`,
        md: 'px-4 py-3',
        lg: 'px-5 py-4 text-xl',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
      },
      icon: {
        base: 'after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]',
      },
    },
    defaultVariants: {
      type: 'base',
      size: 'md',
      icon: 'base',
      align: 'left',
    },
  }
);

const DropDownBoxVariants = cva(``, {
  variants: {
    layer: {
      true: `
          fixed top-0 left-0 right-0 md:right-auto w-full h-dvh bg-gray-1000 bg-opacity-65 z-20
          md:absolute md:w-auto md:top-auto md:h-auto md:bg-none md:bg-opacity-0
        `, // md:min-w-[6rem] md:w-auto
      false: `absolute left-0 z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]`, // min-w-[6rem] w-[100%]
    },
  },
});
const DropDownInnerBoxVariants = cva(
  `
  inner-box scroll overflow-auto bg-white border border-gray-300 rounded-lg transition-all duration-300
  `,
  {
    variants: {
      layer: {
        // true: `layer.. center_center max-w-[90dvw] w-max max-h-[50dvh]
        // md:max-h-[10rem] md:relative md:max-w-[100dvw] md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
        true: `layer.. absolute left-0 right-0 bottom-0 flex flex-col w-full max-w-[100dvw] max-h-[50dvh] rounded-none rounded-t-xl md:rounded-lg
        md:max-h-[10rem] md:relative md:w-full md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
        `, // md:w-full
        false: `base.. max-h-[10rem]`,
      },
    },
  }
);

interface OptionType {
  value: string;
  label: string;
}

interface DropDownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, VariantProps<typeof DropDownVariants> {
  type?: typeMode;
  align?: alignMode;
  addClass?: string;
  custom?: boolean;
  options?: OptionType[]; options1?: OptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  layer?: boolean;
  onChange?: (option: OptionType) => void;
  value?: OptionType | null; // 외부에서 전달받는 선택된 값
}

interface DropOptionProps extends HTMLAttributes<HTMLDivElement>,
VariantProps<typeof DropDownBoxVariants>,
VariantProps<typeof DropDownInnerBoxVariants> {
  children?: React.ReactNode;
  resetClass?: string;
  addClass?: string;
  options?: OptionType[]; options1?: OptionType[];
  custom?: boolean;
  isOpen?: boolean;
  layer?: boolean;
  inner?: boolean;
  onChangeSelect: (option: OptionType) => void;
  onClose: () => void;
}

export const DropDown_Score: React.FC<DropDownProps> = ({
  options = [], options1 = [],
  type = "base",
  size = "md",
  align = "left",
  icon,
  addClass,
  width = "w-full",
  label,
  custom = false,
  layer = false,
  onChange,
  value, // 외부에서 전달받는 선택의 값
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<OptionType | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const className = DropDownVariants ({
    type: type as typeMode | undefined,
    size: size as 'sm' |'md' | 'lg' | undefined,
    icon: icon as 'base' | undefined,
    align: align as alignMode | undefined,
  })

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  }

  const openMouseEvent = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  const ChangeSelectValue = (option: OptionType) => {
    setSelectValue(option);
    setIsOpen(false);
    // 외부 콜백 실행
    if (onChange) {
      onChange(option); // onChange 함수 실행
    }
  };

  useEffect(() => {
    // 외부 value가 변경되면 내부 상태 업데이트
    if (value) {
      setSelectValue(value);
    }
  }, [value]);

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {document.removeEventListener('mousedown', openMouseEvent);}
  }, [])

  return(
    <>
    {/* ${size === "sm" ? '' : size === "lg" ? "" : null} */}
      <DropDownContext.Provider value={{
        type,
        align,
        isOpen,
        selectValue,
        onOpen: OpenEvent,
        onClose: () => setIsOpen(false),
        onChangeSelect: ChangeSelectValue
      }}>
      <div ref={dropRef} className={`${width} ${layer ? 'md:relative' : 'relative'}`}>
        <div className={`${cn(className, addClass, {'border-blue-700 after:-rotate-180': isOpen})}`}
          onClick={OpenEvent}
          data-value={selectValue?.value || null}
          {...props}
        >
          {selectValue ? selectValue.label : label ? label : '선택'}
        </div>
        <DropOption
          isOpen={isOpen}
          options={options}
          options1={options1}
          resetClass={`${isOpen ? 'opacity-100 visible transition' : 'opacity-0 invisible'}`}
          custom={custom}
          layer={layer}
          onChangeSelect={ChangeSelectValue}
          onClose={OpenEvent}
        />
      </div>
      </DropDownContext.Provider>
    </>
  )
}

const DropOption: React.FC<DropOptionProps> = ({
  isOpen,
  children,
  resetClass,
  addClass,
  options = [], options1 = [],
  custom,
  layer
}) => {
  const { type, align, onClose, onChangeSelect, selectValue } = useDropDownContext();

  const className = DropDownBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const innerClassName = DropDownInnerBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const atShadow = ["shadow"].includes(type);

  return (
    <>
      <div className={`${dropTopMargin} ${resetClass} ${cn(className, addClass, {
        'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : atShadow
        })}`}>
        <div className={`${cn(innerClassName, addClass, {
          'translate-y-0': layer && isOpen,
          'translate-y-full': layer && !isOpen,
        })}`}>
          { custom ? (
            <div>
              { children }
              <button onClick={onClose}>닫기</button>
            </div>
          ) : (
            <div className="p-5 flex gap-5">
              <ScoreOption
                title="[사탐]"
                options={options}
                align={align}
                selectValue={selectValue}
                atShadow={atShadow}
                addClass={addClass}
                onChangeSelect={onChangeSelect}
              />
              <ScoreOption
                title="[과탐]"
                options={options1}
                align={align}
                selectValue={selectValue}
                atShadow={atShadow}
                addClass={addClass}
                onChangeSelect={onChangeSelect}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}