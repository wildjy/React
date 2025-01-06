import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';

type typeMode = "base" | "shadow" | "ghost" | "check";
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

const DropDownVariants = cva(`pe-[1.8rem] border bg-white
  w-full relative truncate rounded-lg
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
        check: 'border-transparent',
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
        true: `fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-20`, //md:absolute md:-mt-[1px] md:top-auto md:right-0 md:min-w-[6rem] md:w-auto md:h-auto md:bg-none md:bg-opacity-0
        false: `absolute left-0 min-w-[6rem] w-[100%] z-10`,
      },
    },
  }
)

const DropDownInnerBoxVariants = cva(`
  inner-box scroll overflow-auto bg-white border border-gray-300 rounded-lg
  `, {
    variants: {
      layer: {
        true: `layer.. center_center max-w-[90dvw] w-max max-h-[50dvh]`, //md:max-h-[10rem] md:relative md:w-full md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
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
  options?: OptionType[];
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
  options?: OptionType[];
  custom?: boolean;
  layer?: boolean;
  inner?: boolean;
  onChangeSelect: (option: OptionType) => void;
  onClose: () => void;
}

const DropDown: React.FC<DropDownProps> = ({
  options = [],
  type = "base",
  size = "md",
  align = "left",
  icon,
  addClass,
  width = "w-auto",
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
  }, []);

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
          {/* {isOpen && ( */}
            <DropOption
              options={options}
              custom={custom}
              resetClass={`${isOpen ? 'opacity-100 visible transition' : 'opacity-0 invisible'}`}
              layer={layer}
              onChangeSelect={ChangeSelectValue}
              onClose={OpenEvent}
            />
          {/* )} */}
        </div>
      </DropDownContext.Provider>
    </>
  )
}

const DropOption: React.FC<DropOptionProps> = ({
  children,
  resetClass,
  addClass,
  options = [],
  custom,
  layer,
}) => {
  const { type, align, onClose, onChangeSelect, selectValue } = useDropDownContext();
  const className = DropDownBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const innerClassName = DropDownInnerBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const atShadow = ["shadow"].includes(type);
  const atCheck = ["check"].includes(type);

  return (
    <>
      {/* <div className={`${cn(className, addClass)} ${typeMode === 'shadow' ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : ''}`}> */}
      <div className={`${resetClass} ${cn(className, addClass,
          {'mt-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : atShadow || atCheck},
        )}`}>
        <div className={`${cn(innerClassName, addClass, {'py-3' : atShadow})}`}>
          { custom ? (
            <div>
              { children }
              <button onClick={onClose}>닫기</button>
            </div>
          ) : (
            <ul className={`${cn('p-3', {'p-0' : atShadow})}`}>
              {
                options.map((option) => (
                  <li
                    key={option.value}
                    className={`text-2xs md:text-s ${cn('md:px-4 py-2 rounded hover:bg-gray-200 cursor-pointer', addClass,
                      {'text-left': align === 'left'},
                      {'text-center': align === 'center'},
                      {'font-bold': selectValue?.value === option.value},
                      {'rounded-none' : atShadow},
                      {'rounded-none' : atCheck},
                      {'pl-7 md:pl-7 text-blue-500 bg-no-repeat bg-[length:17%] bg-[10%_center] bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg")]' : selectValue?.value === option.value && atCheck},
                    )}`}
                    onClick={() => onChangeSelect(option)}
                  >
                    { option.label }
                  </li>
                ))
              }
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default DropDown;