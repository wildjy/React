import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';

interface DropDownContextProps {
  typeMode: "base" | "shadow" | "ghost";
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
  min-w-[6rem] w-full text-left relative truncate rounded-lg
  after:right-3 after:w-[1rem] after:h-[1rem] after:bg-[length:1rem_1rem]
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
        sm: 'px-3 py-2 text-s',
        md: 'px-4 py-3',
        lg: 'px-5 py-4 text-xl',
      },
      icon: {
        base: 'after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]',
      },
    },
    defaultVariants: {
      type: 'base',
      size: 'md',
      icon: 'base',
    }
  }
);

const DropDownBoxVariants = cva(``, {
    variants: {
      layer: {
        true: `
          fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-20
          md:absolute md:top-auto md:h-auto md:bg-none md:bg-opacity-0
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
          md:max-h-[10rem] md:relative md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
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
  children?: React.ReactNode;
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
  addClass?: string;
  options?: OptionType[]; options1?: OptionType[];
  custom?: boolean;
  layer?: boolean;
  inner?: boolean;
  onChangeSelect: (option: OptionType) => void;
  onClose: () => void;
}

const DropDown_Score: React.FC<DropDownProps> = ({
  children,
  options = [], options1 = [],
  type,
  size = "md",
  icon,
  addClass,
  width,
  label,
  custom = false,
  layer = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<OptionType | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const className = DropDownVariants ({
    type: type as 'base' |'shadow' | 'ghost' | undefined,
    size: size as 'sm' |'md' | 'lg' | undefined,
    icon: icon as 'base' | undefined,
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

  const typeMode = type  || "base"  || "shadow" || "ghost";

  return(
    <>
    {/* ${size === "sm" ? '' : size === "lg" ? "" : null} */}
      <DropDownContext.Provider value={{
        typeMode,
        isOpen,
        selectValue,
        onOpen: OpenEvent,
        onClose: () => setIsOpen(false),
        onChangeSelect: ChangeSelectValue
      }}>
      <div ref={dropRef} className={`inline-block ${width} ${layer ? 'md:relative' : 'relative'}`}>
        <div className={`${cn(className, addClass, {'border-blue-700 after:-rotate-180': isOpen})}`}
          onClick={OpenEvent}
          data-value={selectValue?.value || ''}
        >
          {selectValue ? selectValue.label : label ? label : '선택'}
        </div>
        {isOpen && (
          <DropOption
            children={children}
            options={options}
            options1={options1}
            custom={custom}
            layer={layer}
            onChangeSelect={ChangeSelectValue}
            onClose={OpenEvent}
          />
        )}
      </div>
      </DropDownContext.Provider>
    </>
  )
}

const DropOption: React.FC<DropOptionProps> = ({
  children,
  addClass,
  options = [], options1 = [],
  custom,
  layer
}) => {
  const { typeMode, onClose, onChangeSelect } = useDropDownContext();

  const className = DropDownBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const innerClassName = DropDownInnerBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const atText = ["shadow"].includes(typeMode);
  console.log(atText)

  return (
    <>
      <div className={`${cn(className, addClass, {'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : atText})}`}>
        <div className={`${cn(innerClassName, addClass)}`}>
          { custom ? (
            <div>
              { children }
              <button onClick={onClose}>닫기</button>
            </div>
          ) : (
            <div className="p-5 flex gap-5">
              <div>
                <p className="text-lg"><b>[사탐]</b></p>
                <ul className={`whitespace-pre`}>
                  {
                    options.map((option) => (
                      <li
                        key={option.value}
                        className={`${cn('py-1 text-s hover:text-blue-700 cursor-pointer')}`}
                        onClick={() => onChangeSelect(option)}
                      >
                        { option.label }
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div>
                <p className=""><b>[과탐]</b></p>
                <ul className={`whitespace-pre`}>
                  {
                    options1.map((option) => (
                      <li
                        key={option.value}
                        className={`${cn('py-1 text-s hover:text-blue-700 cursor-pointer')}`}
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