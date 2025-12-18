import { cn } from "../common/cn";
import { cva, cx, VariantProps } from 'class-variance-authority';
import React, { createContext, HTMLAttributes, useContext, useEffect, forwardRef, useRef, useState } from 'react';
import { Title }  from '../Title/Title';
import { ButtonBox }  from '../Button/ButtonBox';
import { Button }  from '../Button/Button';

type typeMode = 'base' | 'shadow' | 'ghost' | 'ghostShadow' | 'check';
type alignMode = 'left' | 'center';
type iconMode = 'base' | 'report';

export interface DropDownReportOptionType {
  value: string;
  label:
    | { gun?: string; univ?: string; name?: string }
    | string
    | React.ReactNode;
  disabled?: boolean;
}

const isLabelObject = (
  label: DropDownReportOptionType['label']
): label is { gun?: string; univ?: string; name?: string } => {
  return (
    typeof label === 'object' &&
    label !== null &&
    'univ' in label &&
    'name' in label
  );
};

// Report Common DropDown
const RenderLabel = ({
  label,
  isInline,
  isFixedScroll,
}: {
  label: DropDownReportOptionType['label'];
  isInline: boolean;
  isFixedScroll?: boolean;
}) => {
  const gunClass = `
  ${cn(
    `mr-1
    min-w-5 h-5 sm:min-w-6 sm:h-6 md:min-w-[1.625rem] md:h-[1.625rem] xl:min-w-8 xl:h-8
    text-sm sm:text-base md:text-[1.125rem] xl:text-[1.375rem]
    leading-[1.25rem] sm:leading-[1.5rem] md:leading-[1.625rem] xl:leading-[2rem]
    font-normal
    bg-white border border-white rounded md:rounded-lg`,
    isInline || isFixedScroll
      ? `
    inline-block
    px-.5 min-w-[0.75rem] h-[0.75rem] sm:min-w-4 sm:h-4 md:min-w-[1.25rem] md:h-[1.25rem] xl:min-w-5 xl:h-5
    text-4xs sm:text-xs md:text-sm xl:text-sm
    leading-[0.75rem] sm:leading-[1rem] md:leading-[1.15rem] xl:leading-[1.25rem]
    text-gray-500
    border-gray-400
    rounded-sm md:rounded-sm
     `
      : `text-blue-800`,
    isInline && ' border-gray-400', // absolute left-0 top-1/2 -translate-y-1/2 md:mt-1
    isFixedScroll && ''
  )}
  `;
  if (typeof label === 'string') {
    return <span className="">{label}</span>; //  개행 적용
  }
  if (isLabelObject(label)) {
    return (
      <span
        className={
          isInline
            ? /* pl-5 sm:pl-7 md:pl-8  */ 'flex items-center md:block relative'
            : 'block'
        }
      >
        <span className="items-center justify-start text-center md:flex">
          <span
            className={`${isInline ? '' : 'flex items-center justify-center '}`}
          >
            {label.gun && <span className={gunClass}>{label.gun}</span>}
            <span>{label.univ}</span>
          </span>
          <span className={cx(isInline ? 'ml-1' : 'ml-2')}>{label.name}</span>
        </span>
      </span>
    );
  }
  return label; // ReactNode 처리
};

// Report Common DropDown
interface DropDownReportProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof DropDownReportVariants> {
  type?: typeMode;
  align?: alignMode;
  icon?: iconMode;
  addClass?: string;
  min?: string;
  custom?: boolean;
  options?: DropDownReportOptionType[];
  isOpen?: boolean;
  width?: string;
  label?: string;
  fixed?: boolean;
  isFixedScroll?: boolean;
  disabled?: boolean;
  onChange?: (option: DropDownReportOptionType) => void;
  value?: string | null; // 외부에서 전달받는 선택된 값
}

interface DropOptionProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof DropDownReportBoxVariants>,
    VariantProps<typeof DropDownReportInnerBoxVariants> {
  children?: React.ReactNode;
  resetClass?: string;
  addClass?: string;
  options?: DropDownReportOptionType[];
  custom?: boolean;
  fixed?: boolean;
  isOpen?: boolean;
  inner?: boolean;
  disabled?: boolean;
  onChangeSelect: (option: DropDownReportOptionType) => void;
  onClose: () => void;
}

interface DropDownReportContextProps {
  type: typeMode;
  align: alignMode;
  icon: iconMode;
  min: string;
  isOpen: boolean;
  isFixedScroll: boolean;
  disabled: boolean;
  selectValue: string | null;
  onOpen: () => void;
  onClose: () => void;
  onChangeSelect: (option: DropDownReportOptionType) => void;
}

const DropDownContext = createContext<DropDownReportContextProps | null>(null);

const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

const DropDownReportVariants = cva(
  `pe-[1.5rem] sm:pe-[1.8rem] md:pe-[2.5rem] bg-white border border-gray-200
  w-full md:max-w-full relative truncate rounded-lg
  after:right-[0.6rem] after:w-[0.75rem] after:h-[0.375rem]
  sm:after:right-[0.75rem] sm:after:w-[0.75rem] sm:after:h-[0.375rem]
  md:after:right-[0.75rem]
  lg:after:right-[1rem] lg:after:w-[0.625rem] lg:after:h-[0.375rem]
  after:bg-[length:100%_100%]
  after:absolute after:transform after:-translate-y-1/2 after:top-[50%]
  after:content-[""] after:bg-center after:bg-no-repeat after:transition-all after:duration-200 cursor-pointer
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
          pl-[0.4rem] sm:pl-[0.625rem] lg:pl-3 lg:pr-7
          py-[0.1rem] sm:py-[0.3rem] md:py-[0.5rem]
          h-[1.375rem] sm:h-[1.875rem] md:h-[2.5rem] lg:h-[2.375rem]
          text-2xs sm:text-sm md:text-base lg:text-sm
          rounded md:rounded-lg
          after:w-[0.5rem] after:h-[0.25rem]`,
        md: `
          px-3 py-2
          pl-[0.4rem] sm:pl-[0.625rem]
          text-2xs sm:text-sm md:text-base
        `,
        lg: 'px-4 py-3 text-xl',
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

const DropDownReportBoxVariants = cva(`DropDownBox..`, {
  variants: {
    fixed: {
      true: `min-w-[7rem] fixed top-0 left-0 w-full h-dvh bg-gray-1000 bg-opacity-65 z-20
        `, //
      false: `min-w-[7rem] absolute left-0 w-[100%] z-10`,
    },
  },
});

const DropDownReportInnerBoxVariants = cva(
  `
  inner-box scroll overflow-auto bg-white border border-gray-300 rounded-lg transition-all duration-300
  `,
  {
    variants: {
      // Report top Fixed
      fixed: {
        true: `layer.. absolute right-0 bottom-0 flex flex-col w-full md:min-w-[400px] max-w-[100dvw] max-h-[50dvh] rounded-none rounded-t-xl md:rounded-lg
        md:max-h-[25rem] md:fixed md:bottom-auto md:max-w-auto md:w-max md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2
          `, //
        false: `base.. max-h-[10rem]`,
      },
    },
  }
);

export const DropDownReport: React.FC<DropDownReportProps> = ({
  options = [],
  type = 'base',
  size = 'md',
  align = 'left',
  icon = 'base',
  addClass,
  min = 'min-w-[7rem]',
  width = 'w-full',
  label,
  custom = false,
  fixed = false,
  isFixedScroll = false,
  onChange,
  disabled,
  value,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(value || null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const className = DropDownReportVariants({
    type: type as typeMode | undefined,
    size: size as 'sm' | 'md' | 'lg' | undefined,
    icon: icon as iconMode | undefined,
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

  const ChangeSelectValue = (option: DropDownReportOptionType) => {
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
          icon,
          align,
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
        <div className={`${width} ${fixed ? 'md:relative' : 'relative'}`}>
          <div
            className={`${cn(
              className,
              addClass,
              { 'border-blue-700 after:-rotate-180': isOpen },
              {
                'bg-disabled-bg': disabled,
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
            <RenderLabel
              label={
                options.find((option) => option.value === selectValue)?.label ||
                label ||
                '선택'
              }
              isInline={false}
              isFixedScroll={isFixedScroll}
            />
          </div>

          <DropOption
            ref={dropRef}
            isOpen={isOpen}
            options={options}
            custom={custom}
            resetClass={`${
              isOpen ? 'opacity-100 visible transition' : 'opacity-0 invisible'
            }`}
            fixed={fixed}
            onChangeSelect={ChangeSelectValue}
            onClose={OpenEvent}
          />
        </div>
      </DropDownContext.Provider>
    </>
  );
};

const DropOption = forwardRef<HTMLDivElement, DropOptionProps>(
  (
    { isOpen, children, resetClass, addClass, options = [], custom, fixed },
    ref
  ) => {
    const { type, align, icon, min, onClose, onChangeSelect, selectValue } =
      useDropDownContext();

    const className = DropDownReportBoxVariants({
      fixed: fixed as boolean | undefined,
    });

    const innerClassName = DropDownReportInnerBoxVariants({
      fixed: fixed as boolean | undefined,
    });

    const atShadow = ['ghostShadow', 'shadow', 'check'].includes(type);
    const atCheck = ['check'].includes(type);
    const atReport = ['report'].includes(icon);

    return (
      <>
        {/* <div className={`${cn(className, addClass)} ${typeMode === 'shadow' ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]' : ''}`}> */}
        <div
          className={`${cn(className, addClass, {
            'drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]': atShadow,
            'md:!mt-0': fixed,
            [min]: fixed,
          })} 'md:mt-1' ${resetClass}`}
        >
          <div
            ref={ref}
            className={`${cn(innerClassName, addClass, {
              'py-2': atShadow,
              'overflow-hidden': atReport,
              'translate-y-0': fixed && isOpen,
              'translate-y-full': fixed && !isOpen,
            })}`}
          >
            {custom ? (
              <div>
                {children}
                <button onClick={onClose}>닫기</button>
              </div>
            ) : (
              <>
                <div
                  className={`hidden md:flex justify-center pt-4 pb-2 mb-2 border-b`}
                >
                  <Title title="내 저장 목록" />
                </div>

                <div className="flex-1 overflow-hidden overflow-y-auto scroll">
                  <ul
                    className={`${cn(
                      'p-2',
                      { 'text-left': align === 'left' },
                      { 'text-center': align === 'center' },
                      { 'px-3 py-6 md:py-2 md:px-7': fixed },
                      { 'p-0': atShadow }
                    )}`}
                  >
                    {options.map((option) => {
                      // const isSelected = selectValue === option.value;
                      return (
                        <li
                          key={option.value}
                          className={`
                      ${cn(
                        'px-3 py-1 text-xs md:text-sm rounded ',
                        addClass,
                        !option.disabled &&
                          selectValue === option.value &&
                          'text-blue-800 font-bold',
                        selectValue === option.value &&
                          atCheck &&
                          `pl-6 md:pl-6 text-blue-500
                          bg-no-repeat bg-[length:0.8rem] bg-[0.5rem_center]
                          bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_checked_blue.svg")]`,
                        fixed &&
                          'text-sm md:text-lg md:font-normal text-center md:text-left',
                        atShadow && 'rounded-none',
                        //disabled
                        option.disabled
                          ? 'text-disabled-text'
                          : 'md:hover:bg-gray-200 cursor-pointer'
                      )}`}
                          onClick={() => {
                            if (!option.disabled) {
                              onChangeSelect(option);
                            }
                          }}
                        >
                          <RenderLabel label={option.label} isInline={true} />
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <ButtonBox addClass="hidden md:flex md:mt-4 mb-4">
                  <Button mode="tertiary" onClick={onClose}>
                    닫기
                  </Button>
                </ButtonBox>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
);
