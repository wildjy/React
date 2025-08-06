import { cn } from "../common/cn";
import { cva, cx, VariantProps } from 'class-variance-authority';
import React, { createContext, HTMLAttributes, useContext, useEffect, forwardRef, useRef, useState } from 'react';
import { useOutHandler } from "../StepBar/useOutHandler";

type typeMode = 'base' | 'shadow' | 'ghost' | 'ghostShadow' | 'check';
type alignMode = 'left' | 'center';
type dropAlign = 'left' | 'right';
type iconMode = 'base' | 'report';
interface DropDownContextProps {
  type: typeMode;
  align: alignMode;
  icon: iconMode;
  min: string;
  dropAlign: string;
  isOpen: boolean;
  isFixedScroll: boolean;
  disabled: boolean;
  selectValue: string | null;
  onOpen: () => void;
  onClose: () => void;
  onChangeSelect: (option: DropDownOptionType) => void;
}

export interface DropDownOptionType {
  value: string;
  label: { gun?: string; univ?: string; name?: string } | string | React.ReactNode;
  disabled?: boolean;
}

const isLabelObject = (label: DropDownOptionType['label']): label is { gun?: string; univ?: string; name?: string } => {
  return typeof label === 'object' && label !== null && 'univ' in label && 'name' in label;
};

// Report Common DropDown
const ReportRenderLabel = (label: DropDownOptionType['label'], isInline: boolean, isFixedScroll?: boolean) => {
  const gunClass = `
  ${cn(
    `mr-2
    w-6 h-6 sm:w-7 sm:h-7 md:w-[1.625rem] md:h-[1.625rem] xl:w-9 xl:h-9
    text-sm sm:text-base md:text-[1.125rem] xl:text-[1.375rem]
    leading-[1.25rem] sm:leading-[1.5rem] md:leading-[1.625rem] xl:leading-[2rem]
    font-normal
    bg-white border border-white rounded md:rounded-lg`,
    isInline || isFixedScroll
      ? `
    inline-block
    w-[0.75rem] h-[0.75rem] sm:w-5 sm:h-5 md:w-[1.25rem] md:h-[1.25rem] xl:w-6 xl:h-6
    text-4xs sm:text-xs md:text-sm xl:text-sm
    leading-[0.75rem] sm:leading-[1rem] md:leading-[1.15rem] xl:leading-[1.25rem]
    text-gray-500
    border-gray-400
    rounded-sm md:rounded-sm
     `
      : `text-blue-800`,
    isInline && 'absolute left-0 top-1/2 -translate-y-1/2 md:mt-1 border-gray-400',
    isFixedScroll && ''
  )}
  `;
  if (typeof label === 'string') {
    return <span className="">{label}</span>; //  개행 적용
  }
  if (isLabelObject(label)) {
    return (
      <span className={isInline ? 'pl-5 sm:pl-7 md:pl-8 flex items-center md:block relative' : 'block'}>
        <span className="items-center justify-start text-center md:flex">
          <span className={`${isInline ? '' : 'flex items-center justify-center '}`}>
            {label.gun && <span className={gunClass}>{label.gun}</span>}
            <span>{label.univ}</span>
          </span>
          <span className={cx(isInline ? 'ml-2' : 'ml-3')}>{label.name}</span>
        </span>
      </span>
    );
  }
  return label; // ReactNode 처리
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
  cursor-pointer
  `,
  {
    variants: {
      type: {
        base: '',
        shadow: '',
        ghost: '!py-0 border-transparent',
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

// Report Common DropDown
interface DropDownProps extends VariantProps<typeof DropDownVariants> {
  type?: typeMode;
  align?: alignMode;
  icon?: iconMode;
  dropAlign?: string;
  addClass?: string;
  min?: string;
  custom?: boolean;
  options?: DropDownOptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  layer?: boolean;
  fixed?: boolean;
  isFixedScroll?: boolean;
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
  dropAlign?: string;
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

const DropDownBoxVariants = cva(`DropDownBox..`, {
  variants: {
    layer: {
      true: `min-w-[7rem] fixed top-0 left-0 w-full h-dvh bg-gray-1000 bg-opacity-65 z-20
      md:absolute md:top-auto md:right-0 md:w-auto md:h-auto md:bg-none md:bg-opacity-0
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
    },
  }
);

export const DropDown: React.FC<DropDownProps> = ({
  options = [],
  type = 'base',
  size = 'md',
  align = 'left',
  dropAlign = 'left',
  icon = 'base',
  addClass,
  min = 'min-w-[7rem]',
  width = 'w-full',
  label,
  custom = false,
  layer = false,
  isFixedScroll = false,
  onChange,
  disabled,
  value,
  ...props
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(value || null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, setIsOpen } = useOutHandler({ targetRef });

  const className = DropDownVariants({
    type: type as typeMode | undefined,
    size: size as 'sm' | 'md' | 'lg' | undefined,
    icon: icon as iconMode | undefined,
    align: align as alignMode | undefined,
  });

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const CloseEvent = () => {
    setIsOpen(false);
    setFocusIndex(null);
  };

  // const openMouseEvent = (event: MouseEvent) => {
  //   if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
  //     setIsOpen(false);
  //   }
  // };

  // const closeFocusOut = (e: FocusEvent) => {
  //   if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
  //     setIsOpen(false);
  //   }
  // };

  const ChangeSelectValue = (option: DropDownOptionType) => {
    setSelectValue(option.value);
    setIsOpen(false);

    // 외부 콜백 실행
    if (onChange) {
      onChange(option); // onChange 함수 실행
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(!isOpen) return;

    if(e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      CloseEvent();
    }
  }

  useEffect(() => {
    if(focusIndex != null && targetRef.current) {
      const findUl = targetRef.current.querySelector('ul');
      const optionItem = findUl?.children[focusIndex] as HTMLElement;
      optionItem?.focus();
    }
    // 외부 value가 변경되면 내부 상태 업데이트
    // 초기화 = null
    setSelectValue(value as string | null);
  }, [value, focusIndex]);

  // useEffect(() => {
  //   const currentRef = dropRef.current;
  //   document.addEventListener('mousedown', openMouseEvent);

  //   if (currentRef) {
  //     currentRef.addEventListener('focusout', closeFocusOut);
  //   }
  //   return () => {
  //     document.removeEventListener('mousedown', openMouseEvent);
  //   if (currentRef) {
  //     currentRef.removeEventListener('focusout', closeFocusOut);
  //   }
  //   };
  // }, []);

  return (
    <>
      {/* ${size === "sm" ? '' : size === "lg" ? "" : null} */}
      <DropDownContext.Provider
        value={{
          type,
          icon,
          align,
          dropAlign,
          min,
          isOpen,
          isFixedScroll,
          selectValue,
          onOpen: OpenEvent,
          disabled: false,
          onClose: () => setIsOpen(false),
          onChangeSelect: ChangeSelectValue,
        }}
      >
        <div className={`${width} ${layer ? 'md:relative' : 'relative'}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onKeyDown={handleKeyDown}>
          <button
            type="button"
            className={` ${cn(
              className,
              addClass,
              { 'border-blue-700 after:-rotate-180': isOpen },
              {
                'bg-disabled-bg cursor-default': disabled,
              }
            )}`}
            onClick={() => {
              if (!disabled) {
                OpenEvent();
              }
            }}
            data-value={selectValue || null}
            {...props}
          >
            {/* options에서 value를 찾아서 label 보여주기 */}
            {ReportRenderLabel(options.find((option) => option.value === selectValue)?.label || label || '선택', false, isFixedScroll)}
          </button>
          {/* {isOpen && ( */}
          <DropOption
            ref={targetRef}
            isOpen={isOpen}
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
  );
};

// eslint-disable-next-line react/display-name
const DropOption = forwardRef<HTMLDivElement, DropOptionProps>(
  ({ isOpen, children, resetClass, addClass, options = [], custom, layer }, ref) => {
    const { type, align, dropAlign, min, onClose, onChangeSelect, selectValue } = useDropDownContext();
    const className = DropDownBoxVariants({
      layer: layer as boolean | undefined,
    });

    const innerClassName = DropDownInnerBoxVariants({
      layer: layer as boolean | undefined,
    });

    const atShadow = ['ghostShadow', 'shadow', 'check'].includes(type);
    const atCheck = ['check'].includes(type);

    return (
      <>
        {/* <div className={`${cn(className, addClass)} ${typeMode === 'shadow' ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : ''}`}> */}
        <div
          className={`${cn(className, addClass, {
            'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]': atShadow,
            [`${min}`]: layer || min,
            'left-auto right-0': dropAlign === 'right',
          })} ${dropTopMargin} ${resetClass}`}
        >
          <div
            ref={ref}
            className={`${cn(innerClassName, addClass, {
              'py-3': atShadow,
              'translate-y-0': layer && isOpen,
              'translate-y-full': layer && !isOpen,
            })}`}
          >
            {custom ? (
              <div>
                {children}
                <button onClick={onClose}>닫기</button>
              </div>
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                <ul
                  className={`${cn(
                    'p-3',
                    { 'text-left': align === 'left' },
                    { 'text-center': align === 'center' },
                    { 'p-5 md:p-3': layer },
                    { 'p-0': atShadow }
                  )}`}
                  role="listbox"
                >
                  {options.map((option) => {
                    // const isSelected = selectValue === option.value;
                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={selectValue === option.value}
                        tabIndex={0}
                        className={`
                        ${cn(
                          'px-4 py-2 text-xs md:text-sm rounded ',
                          addClass,
                          !option.disabled && selectValue === option.value && 'text-blue-800 font-bold',
                          atCheck && selectValue === option.value &&
                            `pl-7 md:pl-7 text-blue-500
                            bg-no-repeat bg-[length:0.8rem] bg-[0.5rem_center]
                            bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg")]`,
                          layer && 'text-center md:text-left',
                          atShadow && 'rounded-none',
                          //disabled
                          option.disabled ? 'text-disabled-text' : 'md:hover:bg-gray-200 cursor-pointer'
                        )}`}
                        onClick={() => {
                          if (!option.disabled) {
                            onChangeSelect(option);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChangeSelect(option);
                          }
                        }}
                      >
                        {ReportRenderLabel(option.label, true)}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
);
