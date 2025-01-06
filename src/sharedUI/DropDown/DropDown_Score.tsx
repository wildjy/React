import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';

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

const DropDownVariants = cva(`pe-[1.8rem] border
  min-w-[4rem] w-full text-left relative truncate rounded-lg
  after:right-3 after:w-[1rem] after:h-[0.375rem] after:bg-[length:100%_100%]
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
        sm: 'px-3 py-2 text-2xs md:text-s',
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
    }
  }
);

const DropDownBoxVariants = cva(``, {
    variants: {
      layer: {
        true: `
          fixed top-0 left-0 right-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-20
          md:absolute md:w-auto md:top-auto md:h-auto md:bg-none md:bg-opacity-0
        `, // md:min-w-[6rem] md:w-auto
        false: `absolute left-0 z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]`, // min-w-[6rem] w-[100%]
      },
    },
  }
)
const DropDownInnerBoxVariants = cva(`
  inner-box scroll overflow-auto bg-white border border-gray-300 rounded-lg
  `, {
    variants: {
      layer: {
        true: `
          layer.. center_center max-w-[90dvw] w-max max-h-[50dvh]
          md:max-h-[10rem] md:relative md:max-w-[100dvw] md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
        `, // md:w-full
        false: `base.. max-h-[10rem]`,
      },
    },
  }
)

interface OptionType {
  value: string;
  label: string
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof DropDownVariants> {
  type?: typeMode;
  align?: alignMode;
  addClass?: string;
  custom?: boolean;
  options?: OptionType[]; options1?: OptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  layer?: boolean;
}

interface DropOptionProps extends HTMLAttributes<HTMLDivElement>,
VariantProps<typeof DropDownBoxVariants>,
VariantProps<typeof DropDownInnerBoxVariants> {
  children?: React.ReactNode;
  resetClass?: string;
  addClass?: string;
  options?: OptionType[]; options1?: OptionType[];
  custom?: boolean;
  layer?: boolean;
  inner?: boolean;
  onChangeSelect: (option: OptionType) => void;
  onClose: () => void;
}

const DropDown_Score: React.FC<DropDownProps> = ({
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
  }

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
          data-value={selectValue?.value || ''}
          {...props}
        >
          {selectValue ? selectValue.label : label ? label : '선택'}
        </div>
        <DropOption
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
      <div className={`${resetClass} ${cn(className, addClass, {'mt-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : atShadow})}`}>
        <div className={`${cn(innerClassName, addClass)}`}>
          { custom ? (
            <div>
              { children }
              <button onClick={onClose}>닫기</button>
            </div>
          ) : (
            <div className="p-5 flex gap-5">
              <div className="px-5 md:px-0">
                <p className=""><b>[사탐]</b></p>
                <ul className={`whitespace-pre`}>
                  {
                    options.map((option) => (
                      <li
                        key={option.value}
                        className={`text-2xs md:text-s ${cn('md:px-4 py-2 rounded hover:bg-gray-200 cursor-pointer', addClass,
                          {'text-left': align === 'left'},
                          {'text-center': align === 'center'},
                          {'font-bold': selectValue?.value === option.value},
                          {'rounded-none' : atShadow},
                        )}`}
                        onClick={() => onChangeSelect(option)}
                      >
                        { option.label }
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="px-5 md:px-0">
                <p className=""><b>[과탐]</b></p>
                <ul className={`whitespace-pre`}>
                  {
                    options1.map((option) => (
                      <li
                        key={option.value}
                        className={`text-2xs md:text-s ${cn('md:px-4 py-2 rounded hover:bg-gray-200 cursor-pointer', addClass,
                          {'text-left': align === 'left'},
                          {'text-center': align === 'center'},
                          {'font-bold': selectValue?.value === option.value},
                          {'rounded-none' : atShadow},
                        )}`}
                        onClick={() => onChangeSelect(option)}
                      >
                        { option.label }
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default DropDown_Score;