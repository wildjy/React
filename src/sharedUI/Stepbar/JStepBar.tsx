
"use client";
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC, useEffect, useRef, useState } from "react";
import throttle from 'lodash/throttle';
import { CloseButton } from "../Button/CloseButton";
import { useOutHandler } from "./useOutHandler";
import Link from 'next/link';

const StepItems = cva(
  `flex items-center
  w-full md:w-auto grow md:last:grow-0
  md:relative after:content-[""] after:block
  after:bg-gray-300`, // md:w-auto  md:last:grow-0
  {
    variants: {
      status: {
        completed: 'completed',
        true: 'active ',
        false: 'inactive',
      },
    },
  }
);

const StepPoints = cva(`
  hidden md:flex justify-center items-center
  text-sm xl:text-3xs
  size-6 md:size-5 lg:size-6 lg:h-6
  text-white hover:text-white
  hover:bg-blue-700 rounded-full
  transition
  relative z-5
  `,
  {
    variants: {
      status: {
        completed: 'completed',
        true: 'active bg-blue-700 text-white',
        false: 'inactive bg-grayBlue-400 group-hover:text-white group-hover:bg-blue-700',
        icon: '',
      },
    },
  }
);

  const StepLabels = cva('flex flex-wrap gap-x-5 sm:gap-x-7 items-end text-gray-400 ', {
  variants: {
    base: {
      label: 'block pl-2 text-grayBlue-600 text-sm sm:text-base font-light',
    },
    label: {
      true: 'active text-gray-800 font-semi',
      false:
        'inactive group-hover:text-gray-800 group-hover:font-semi transition',
    },
    result: {
      true: 'active text-blue-600',
      false: 'text-grayBlue-600',
    },
  },
});

const StepLines = cva(
  'hidden md:inline-flex grow md:ml-4 xl:ml-6 h-[1px] bg-gray-300',
  {
    variants: {
      line: {
        true: 'active',
        false: 'inactive',
      },
    },
  }
);

export interface JStep {
  id: number;
  label: string;
  result?: {active: boolean, label: string | React.ReactNode | number, url?: string};
  url?: string;
  isCompleted?: boolean;
}

interface JStepBarProps extends HTMLAttributes<HTMLDivElement> {
  step: JStep[];
  currentStep?: number;
  onStepClick?: (stepIndex: number) => void;
  addClass?: string;
  value?: string;
  isOpenLayer?: boolean;
  disabled?: {label: string, url: string};
  onClose?: () => void;
}

const getHref = (item: any) => {
  // id === 4일 때만 result.active 우선
  if (item.id === 4) {
    return item.result?.active ? (item.result?.url || '') : (item.url || '');
  }
  return item.url || '';
};

export const JStepBar: FC<JStepBarProps> = ({
  step,
  currentStep = 1,
  onStepClick,
  addClass,
  isOpenLayer,
  disabled,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const layerMobileRef = useRef<HTMLDivElement | null>(null);

  const openStepLayer = () => {
    setIsOpen((prev) => !prev);
  };

  const openLayerEvent = (e: MouseEvent) => {
    if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
    if (layerMobileRef.current && !layerMobileRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  const closeFocusOut = (e: FocusEvent) => {
    if (layerRef.current && !layerRef.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
    if (layerMobileRef.current && !layerMobileRef.current.contains(e.relatedTarget as Node)) {
      onClose?.();
    }
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      }

      checkMobile();
    }, 10);

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const openCheck = throttle(() => {
      if (!isMobile) {
        if(isOpen) return setIsOpen(false);
        if(isOpenLayer) return onClose?.();
      }
    }, 50);

    window.addEventListener('resize', openCheck);
    return () => window.removeEventListener('resize', openCheck);
  }, [isOpen, isOpenLayer, onClose, isMobile]);

  useEffect(() => {
    document.addEventListener('mousedown', openLayerEvent);
    const currentRef = layerRef.current;
    if (currentRef) {
      currentRef.addEventListener('focusout', closeFocusOut);
    }

    return () => {
      document.removeEventListener('mousedown', openLayerEvent);
      const currentRef = layerRef.current;
      if (currentRef) {
        currentRef.removeEventListener('focusout', closeFocusOut);
      }
    };
  }, []);

  const disabledTxt = [
    {
      result: { label: '서비스 이용을 위한 수험생 정보 입력' },
    },
    {
      result: { label: '학생부 및 수능 성적 입력'},
    },
    {
      result: { label: '모의지원 및 실제지원 희망대학 선택'},
    },
    {
      result: { label: '대학별 환산점수 및 합격예측 결과 확인'},
    },
    {
      result: { label: '실제 경쟁자의 점수 및 나의 위치 확인' },
    },
    {
      result: { label: '6번째 disabled message!' },
    },
  ]

  const sizeClass = `md:px-6 lg:px-[3rem] xl:px-[7.25rem] md:pr-15 gap-y-3 md:gap-0`;
  const className = `${sizeClass} md:py-3 flex flex-col md:flex-row items-center justify-start md:justify-between relative`; // xl:px-4 xl:py-3 xl:pb-0
  const buttonClass = `${isOpen ? '-rotate-180' : '-rotate-0'} hidden md:block absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-[length:40%] bg-center bg-no-repeat
  bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")] transition-all duration-300`;

  return (
    <div className='md:bg-[#FAFBFC] md:border-gray-100 rounded-lg'>
      <div
        ref={layerRef}
        className={`
          ${cn([`
              transition-all duration-300
              fixed bottom-0 left-0 w-full md:relative md:w-auto md:h-auto z-[100] md:z-[10]
            `],
            isOpen || isOpenLayer ?
            'h-dvh bg-gray-1000 bg-opacity-65 md:bg-transparent md:bg-opacity-1' :
            'md:bg-transparent md:bg-opacity-1 transition-all duration-300'
          )}`}
        >
        <div
          ref={layerMobileRef}
          className={`
            md:relative absolute left-0 right-0 bottom-0
            p-5 md:p-0
            ${isOpen || isOpenLayer ?
            'translate-y-0  bg-[#FAFBFC] border-gray-100 rounded-t-xl sm:rounded-t-2xl transition-all duration-300' :
            ' translate-y-full md:translate-y-0'}
          `}
        >
          {/* mobile */}
          <p className={`block md:hidden mb-5 pt-5 pb-2 text-lg sm:text-xl border-b border-gray-200`}><b>합격예측 서비스 이용 STEP</b></p>
          <div className='absolute block top-5 right-5 md:hidden'>
            <CloseButton size="md" onClick={onClose} title="합격예측 서비스 이용 STEP 닫기 버튼" />
          </div>
          {/* mobile */}

          {/* Step */}
          <div className={`relative`}>
            <div className={`${cn(className, addClass)}`}>
              {disabled ? (
                step.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={cn(StepItems({
                        status: index + 1 === currentStep ? 'completed' : false,
                      }))}
                    >
                      <Link
                        href={item.url || ''}
                        className={`flex flex-wrap items-center z-[5] group`}
                        prefetch={!item.url?.includes('aspx')}
                      >
                        <div
                          className={cn(StepPoints({
                            status: index + 1 === currentStep,
                          }))}
                        >
                          {index + 1}
                        </div>

                        <div className={`
                          md:hidden
                          flex items-center justify-center
                          size-11
                          bg-no-repeat bg-[length:100%_100%] bg-center
                          `}
                          style={{ backgroundImage: `url("https://image.jinhak.com/jinhakImages/react/icon/icon_step_${index + 1}.svg")` }}>
                        </div>

                        <div className={StepLabels({ base: 'label' })}>
                          <span
                            className={StepLabels({ label: true })}
                          >
                            <div>
                              <p className='font-light md:hidden text-3xs sm:text-xs text-grayBlue-500'>STEP 0{index + 1}</p>
                              <b>{item.label}</b>
                            </div>

                            <span className={`block md:hidden text-2xs sm:text-sm text-gray-500 font-light`}>
                              {disabled ? disabledTxt[index].result?.label : item.result?.label}
                            </span>
                          </span>
                        </div>
                      </Link>

                      {index < step.length - 1 && (
                        <div className={cn(StepLines({ line: true }))}></div>
                      )}
                    </div>
                  );
                })
              ) : (
                step.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={cn(StepItems({
                        status: index + 1 === currentStep ? 'completed' : false,
                      }))}
                    >
                      <div className={`flex flex-wrap items-center z-[7] group`}>
                        <div
                          className={cn(StepPoints({
                            status: index + 1 === currentStep,
                          }))}
                          onClick={() => onStepClick && onStepClick(index)}
                        >
                          {index + 1}
                        </div>

                        <div className={`
                          md:hidden
                          flex items-center justify-center
                          size-11
                          bg-no-repeat bg-[length:100%_100%] bg-center
                          `}
                          style={{ backgroundImage: `url("https://image.jinhak.com/jinhakImages/react/icon/icon_step_${index + 1}.svg")` }}>
                        </div>

                        <div
                          className={StepLabels({ base: 'label' })}
                          onClick={() => onStepClick && onStepClick(index)}
                        >
                          <span
                            className={cn(StepLabels({
                              label: index + 1 === currentStep ? true : false,
                            }))}
                          >
                            <div className=''>
                              <p className='font-light md:hidden sm:text-xs text-grayBlue-500'>STEP 0{index + 1}</p>
                              <Link
                                href={item.id === 4 ? item.result?.active ? item.result?.url || '' : item.url || '' : item.url || ''}
                                prefetch={!item.url?.includes('aspx')}
                              >
                                {item.label}
                              </Link>
                            </div>

                            <Link
                              href={item.id === 4 ? item.result?.active ? item.result?.url || '' : item.url || '' : item.url || ''}
                              prefetch={item.url?.includes('aspx') ? false : true}
                              className={`${cn('md:absolute top-14 text-xs md:text-md font-light underline z-[10]',
                                index === step.length - 1 && 'md:w-full',
                                isOpen && !disabled ? 'md:flex' : 'block md:hidden',
                                item.result?.active ? 'text-blue-600' : 'text-grayBlue-600'
                              )}
                              `}
                            >
                              {item.result?.label}
                            </Link>
                          </span>
                        </div>
                      </div>

                      {index < step.length - 1 && (
                        <div className={cn(StepLines({ line: true }))}></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button type="button" className={buttonClass} onClick={openStepLayer}>
              <span className="sr-only">스텝 안내 레이어 열기</span>
            </button>
          </div>
          {/* Step */}

          {/* layer */}
          <div className="relative hidden md:block">
            <div
              className={`
                ${isOpen ? 'hidden md:flex' : 'hidden'}
                -mt-.5 absolute left-0 right-0 px-0 h-[4rem] justify-center items-center bg-white border border-gray-100 rounded-lg z-[4]
              `}
            >
              {disabled && (
                <div className='text-center'>
                  <Link href={disabled.url || ''} className='underline'>{disabled.label}</Link>
                </div>
              )}
            </div>
          </div>
          {/* layer */}
        </div>
      </div>
    </div>
  );
};
