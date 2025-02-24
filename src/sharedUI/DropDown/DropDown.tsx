import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext,  HTMLAttributes } from 'react';

type typeMode = 'base' | 'shadow' | 'ghost' | 'ghostShadow' | 'check';
type alignMode = 'left' | 'center';
interface DropDownContextProps {
  type: typeMode;
  min: string;
  align: alignMode;
  isOpen: boolean;
  disabled: boolean;
  selectValue: string | null;
  onOpen: () => void;
  onClose: () => void;
  onChangeSelect: (option: DropDownOptionType) => void;
}

export interface DropDownOptionType {
  value: string;
  label: { univ: string; name: string } | string | React.ReactNode;
  disabled?: boolean;
}

const isLabelObject = (label: DropDownOptionType['label']): label is { univ: string; name: string } => {
  return typeof label === 'object' && label !== null && 'univ' in label && 'name' in label;
};

const renderLabel = (label: DropDownOptionType['label'], isInline: boolean) => {
  if (typeof label === 'string') {
    return <span className="">{label}</span>; //  개행 적용
  }
  if (isLabelObject(label)) {
    return (
      <span className={isInline ? 'flex justify-center md:block' : 'block'}>
        <span className={isInline ? '' : 'block md:inline'}>{label.univ}</span>
        <span>{label.name}</span>
      </span>
    );
  }
  return label; // ReactNode 처리
};
interface DropDownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, VariantProps<typeof DropDownVariants> {
  type?: typeMode;
  align?: alignMode;
  addClass?: string;
  min?: string;
  custom?: boolean;
  options?: DropDownOptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  layer?: boolean;
  fixed?: boolean;
  disabled?: boolean;
  onChange?: (option: DropDownOptionType) => void;
  value?: string | null; // 외부에서 전달받는 선택된 값
}

interface DropOptionProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof DropDownBoxVariants>,
    VariantProps<typeof DropDownInnerBoxVariants> {
  children?: React.ReactNode;
  resetClass?: string;
  addClass?: string;
  options?: DropDownOptionType[];
  custom?: boolean;
  layer?: boolean;
  fixed?: boolean;
  isOpen?: boolean;
  inner?: boolean;
  disabled?: boolean;
  onChangeSelect: (option: DropDownOptionType) => void;
  onClose: () => void;
}

const DropDownContext = createContext<DropDownContextProps | null>(null);

const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

const dropTopMargin = 'md:mt-2';

const DropDownVariants = cva(
  `pe-[1.5rem] sm:pe-[1.8rem] md:pe-[2.5rem] bg-white border border-gray-200
  w-full md:max-w-full relative truncate rounded-lg
  after:right-[0.6rem] after:w-[0.75rem] after:h-[0.375rem]
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
        ghostShadow: 'border-transparent',
        check: 'border-transparent',
      },
      size: {
        // pr-[1.2rem]  sm:pr-[1.2rem]
        sm: `pe-[1.2rem]
          pl-[0.4rem] sm:pl-[0.625rem] lg:pl-4 lg:pr-8
          py-[0.1rem] sm:py-[0.3rem] md:py-[0.5rem]
          h-[1.375rem] sm:h-[1.875rem] md:h-[2.5rem] lg:h-[2.375rem]
          text-2xs sm:text-sm md:text-base lg:text-sm
          rounded md:rounded-lg
          after:w-[0.5rem] after:h-[0.25rem]`,
        md: `
          px-4 py-3
          pl-[0.4rem] sm:pl-[0.625rem]
          text-2xs sm:text-sm md:text-base
        `,
        lg: 'px-5 py-4 text-xl',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
      },
      icon: {
        base: 'after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]',
        report: `
        pe-[2.5rem] sm:pe-[2.8rem] md:pe-[3.5rem]
        md:after:w-[1.25rem] md:after:h-[0.625rem] lg:after:w-[1.25rem] lg:after:h-[0.625rem]
        after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle_white.svg")]
        `,
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
      true: `min-w-[7rem] fixed top-0 left-0 w-full h-dvh bg-gray-1000 bg-opacity-65 z-20
      md:absolute md:top-auto md:right-0 md:w-auto md:h-auto md:bg-none md:bg-opacity-0
        `, //
      false: `min-w-[7rem] absolute left-0 w-[100%] z-10`,
    },
    fixed: {
      true: `min-w-[7rem] fixed top-0 left-0 w-full h-dvh bg-gray-1000 bg-opacity-65 z-20
        `, //
      false: `min-w-[7rem] absolute left-0 w-[100%] z-10`,
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
        // md:max-h-[10rem] md:relative md:w-full md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0

        // true: `layer.. absolute right-0 bottom-0 flex flex-col w-full max-w-[90dvw] rounded-none rounded-t-xl md:rounded-lg
        // md:max-h-[10rem] md:fixed md:w-auto md:max-w-auto md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2
        true: `layer.. absolute left-0 right-0 bottom-0 flex flex-col w-full max-w-[100dvw] rounded-none rounded-t-xl md:rounded-lg
        md:max-h-[10rem] md:relative md:w-full md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
        `, //
        false: `base.. max-h-[10rem]`,
      },
      fixed: {
        true: `layer.. absolute right-0 bottom-0 flex flex-col w-full max-w-[100dvw] max-h-[50dvh] rounded-none rounded-t-xl md:rounded-lg
        md:max-h-[20rem] md:fixed md:w-auto md:max-w-auto md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2
          `, //
        false: `base.. max-h-[10rem]`,
      },
    },
  }
);

export const DropDown: React.FC<DropDownProps> = ({
  options = [],
  type = 'base',
  size = 'md',
  align = 'left',
  icon,
  addClass,
  min = 'min-w-[7rem]',
  width = 'w-full',
  label,
  custom = false,
  layer = false,
  fixed = false,
  onChange,
  disabled,
  value, // 외부에서 전달받는 선택의 값
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const className = DropDownVariants({
    type: type as typeMode | undefined,
    size: size as 'sm' | 'md' | 'lg' | undefined,
    icon: icon as 'base' | undefined,
    align: align as alignMode | undefined,
  });

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const openMouseEvent = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const ChangeSelectValue = (option: DropDownOptionType) => {
    setSelectValue(option.value);
    setIsOpen(false);

    // 외부 콜백 실행
    if (onChange) {
      onChange(option); // onChange 함수 실행
    }
  };

  useEffect(() => {
    // 외부 value가 변경되면 내부 상태 업데이트
    // 초기화 = null
    setSelectValue(value as string | null);
  }, [value]);

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {
      document.removeEventListener('mousedown', openMouseEvent);
    };
  }, []);

  return (
    <>
      {/* ${size === "sm" ? '' : size === "lg" ? "" : null} */}
      <DropDownContext.Provider
        value={{
          type,
          min,
          align,
          isOpen,
          selectValue,
          onOpen: OpenEvent,
          disabled: false,
          onClose: () => setIsOpen(false),
          onChangeSelect: ChangeSelectValue,
        }}
      >
        <div ref={dropRef} className={`${width} ${layer || fixed ? 'md:relative' : 'relative'}`}>
          <div
            className={`${cn(className, addClass, { 'border-blue-700 after:-rotate-180': isOpen }, {
              'bg-disabled-bg' : disabled
            })}`}
            onClick={() => {
              if(!disabled){
                OpenEvent();
              }
            }}
            data-value={selectValue || null}
            {...props}
          >
            {/* options에서 value를 찾아서 label 보여주기 */}
            {renderLabel(options.find((option) => option.value === selectValue)?.label || label || '선택', false)}
          </div>
          {/* {isOpen && ( */}
          <DropOption
            isOpen={isOpen}
            options={options}
            custom={custom}
            resetClass={`${isOpen ? 'opacity-100 visible transition' : 'opacity-0 invisible'}`}
            layer={layer}
            fixed={fixed}
            onChangeSelect={ChangeSelectValue}
            onClose={OpenEvent}
          />
          {/* )} */}
        </div>
      </DropDownContext.Provider>
    </>
  );
};

const DropOption: React.FC<DropOptionProps> = ({ isOpen, children, resetClass, addClass, options = [], custom, layer, fixed }) => {
  const { type, align, min, onClose, onChangeSelect, selectValue } = useDropDownContext();
  const className = DropDownBoxVariants({
    layer: layer as boolean | undefined,
    fixed: fixed as boolean | undefined,
  });

  const innerClassName = DropDownInnerBoxVariants({
    layer: layer as boolean | undefined,
    fixed: fixed as boolean | undefined,
  });

  const atShadow = ['ghostShadow', 'shadow', 'check'].includes(type);
  const atCheck = ['check'].includes(type);

  return (
    <>
      {/* <div className={`${cn(className, addClass)} ${typeMode === 'shadow' ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : ''}`}> */}
      <div
        className={`${dropTopMargin} ${resetClass} ${cn(className, addClass, {
          'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]': atShadow,
          'md:!mt-0': fixed,
          [min]: layer || fixed,
        })}`}
      >
        <div
          className={`${cn(innerClassName, addClass, {
            'py-3': atShadow,
            'translate-y-0': (layer || fixed) && isOpen,
            'translate-y-full': (layer || fixed) && !isOpen,
          })}`}
        >
          {custom ? (
            <div>
              {children}
              <button onClick={onClose}>닫기</button>
            </div>
          ) : (
            <>
              <ul
                className={`${cn(
                  'p-3',
                  { 'text-left': align === 'left' },
                  { 'text-center': align === 'center' },
                  { 'p-5 md:p-3': layer },
                  { 'p-7 md:p-8': fixed },
                  { 'p-0': atShadow }
                )}`}
              >
                {options.map((option) => {
                  // const isSelected = selectValue === option.value;
                  return (
                    <li
                      key={option.value}
                      className={`text-xs md:text-sm ${cn(
                        'px-4 py-2 rounded ',
                        addClass,
                        option.disabled ? 'text-disabled-text' : 'md:hover:bg-gray-200 cursor-pointer',
                        { 'text-blue-800 font-bold': !option.disabled && (selectValue === option.value) },
                        {
                          'pl-7 md:pl-7 text-blue-500 bg-no-repeat bg-[length:0.8rem] bg-[0.5rem_center] bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg")]':
                          selectValue === option.value && atCheck,
                        },
                        { 'text-center md:text-left': layer || fixed },
                        { 'rounded-none': atShadow },
                      )}`}
                      onClick={() => {
                        if(!option.disabled){
                          onChangeSelect(option)
                        }
                      }}
                    >
                      {renderLabel(option.label, true)}
                    </li>
                  );
                })}
              </ul>
              {/* <button onClick={onClose}>닫기</button> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};
