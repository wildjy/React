import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, forwardRef, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';
import { ScoreOption } from './ScoreOption';

type typeMode = 'base' | 'shadow' | 'ghostShadow' | 'ghost';
type alignMode = "left" | "center";
interface DropDownContextProps {
  type: typeMode;
  align: alignMode;
  isOpen: boolean;
  disabled: boolean;
  selectValue: string | null;
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
  cursor-pointer
  `,
  {
    variants: {
      type: {
        base: '',
        shadow: '',
        ghost: 'border-transparent',
        ghostShadow: 'border-transparent',
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

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropDownProps extends VariantProps<typeof DropDownVariants> {
  type?: typeMode;
  align?: alignMode;
  addClass?: string;
  custom?: boolean;
  options?: OptionType[]; options1?: OptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  layer?: boolean;
  disabled?: boolean;
  onChange?: (option: OptionType) => void;
  value?: string | null; // 외부에서 전달받는 선택된 값
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
  disabled,
  value, // 외부에서 전달받는 선택의 값
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [ulIndex, setUlIndex] = useState(0);
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

  const CloseEvent = () => {
    setIsOpen(false);
    setFocusIndex(null);
  };

  const openMouseEvent = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  const closeFocusOut = (e: FocusEvent) => {
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const ChangeSelectValue = (option: OptionType) => {
    setSelectValue(option.value);
    setIsOpen(false);
    // 외부 콜백 실행
    if (onChange) {
      onChange(option); // onChange 함수 실행
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(!isOpen) return;

    if(dropRef.current) {
      const uls = dropRef.current.querySelectorAll('ul');
      const currentUl = uls[ulIndex];
      const nextUl = uls[(ulIndex + 1) % uls.length];
      const prevUl = uls[(ulIndex - 1 + uls.length) % uls.length];

      if (e.key === 'ArrowDown') {
        e.preventDefault();

        let nextIndex = focusIndex;
        if (focusIndex === null || focusIndex < 0) {
          nextIndex = 0;
        } else {
          nextIndex = focusIndex + 1;
        }

        if (currentUl && nextIndex < currentUl.children.length) {
          setFocusIndex(nextIndex);
          (currentUl.children[nextIndex] as HTMLElement)?.focus();
        } else {
          // 현재 UL 마지막 → 다음 UL 첫 번째
          const nextUlIndex = (ulIndex + 1) % uls.length;
          setUlIndex(nextUlIndex);
          setFocusIndex(0);
          (nextUl.children[0] as HTMLElement)?.focus();
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();

        let prevIndex = focusIndex;
        if (focusIndex === null || focusIndex < 0) {
          prevIndex = 0;
        } else {
          prevIndex = focusIndex - 1;
        }

        if (prevIndex >= 0) {
          setFocusIndex(prevIndex);
          (currentUl.children[prevIndex] as HTMLElement)?.focus();
        } else {
          // 현재 UL 첫 번째 → 이전 UL 마지막
          const prevUlIndex = (ulIndex - 1 + uls.length) % uls.length;
          const lastIndex = prevUl.children.length - 1;
          setUlIndex(prevUlIndex);
          setFocusIndex(lastIndex);
          (prevUl.children[lastIndex] as HTMLElement)?.focus();
        }
      } else if (e.key === 'Escape') {
        CloseEvent();
      }
    }
  }

  useEffect(() => {
    if(focusIndex != null && dropRef.current) {
      const findUl = dropRef.current.querySelectorAll('ul');
      const targetUl = findUl[ulIndex];

      if(targetUl && targetUl.children.length > focusIndex){
        const optionItem = targetUl.children[focusIndex] as HTMLElement;
        optionItem?.focus();
      }
    }

    // 외부 value가 변경되면 내부 상태 업데이트
    if (value) {
      setSelectValue(value);
    }
  }, [value, focusIndex, ulIndex]);

  useEffect(() => {
    const currentRef = dropRef.current;
    document.addEventListener('mousedown', openMouseEvent);

    if (currentRef) {
      currentRef.addEventListener('focusout', closeFocusOut);
    }
    return () => {
      document.removeEventListener('mousedown', openMouseEvent);
      if (currentRef) {
        currentRef.removeEventListener('focusout', closeFocusOut);
      }
    }
  }, [])

  const selectedOption = [...options, ...options1].find((option) => option.value === selectValue);

  return(
    <>
    {/* ${size === "sm" ? '' : size === "lg" ? "" : null} */}
      <DropDownContext.Provider value={{
        type,
        align,
        isOpen,
        selectValue,
        onOpen: OpenEvent,
        disabled: false,
        onClose: () => setIsOpen(false),
        onChangeSelect: ChangeSelectValue
      }}>
      <div className={`${width} ${layer ? 'md:relative' : 'relative'}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onKeyDown={handleKeyDown}
      >
        <button
            type="button"
            className={` ${cn(className, addClass,
            {'border-blue-700 after:-rotate-180': isOpen},
            {
              'bg-disabled-bg cursor-default': disabled,
            },
          )}`}
          onClick={() => {
            if(!disabled){
              OpenEvent();
            }
          }}
          data-value={selectValue || null}
          {...props}
        >
            {selectedOption?.label || label || '선택'}
        </button>
        <DropOption
           ref={dropRef}
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

// eslint-disable-next-line react/display-name
const DropOption = forwardRef<HTMLDivElement, DropOptionProps>(
  ({ isOpen, children, resetClass, addClass, options = [], options1 = [], custom, layer }, ref) => {
  const { type, align, onClose, onChangeSelect, selectValue } = useDropDownContext();

  const className = DropDownBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const innerClassName = DropDownInnerBoxVariants ({
    layer: layer as boolean | undefined,
  });

  const atShadow = ['ghostShadow', 'shadow'].includes(type);

  return (
    <>
      <div className={`${dropTopMargin} ${resetClass} ${cn(className, addClass, {
        'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : atShadow
        })}`}>
        <div
          ref={ref}
          className={`${cn(innerClassName, addClass, {
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
    );
  }
);