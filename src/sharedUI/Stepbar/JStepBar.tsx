
"use client";
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC, useEffect, useRef, useState } from "react";
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

const StepPoints = cva(
  `text-sm xl:text-3xs z-5 size-6 md:size-5 lg:size-6 lg:h-6 text-white hover:text-white hover:bg-blue-700 relative flex justify-center items-center rounded-full transition`,
  {
    variants: {
      status: {
        completed: 'completed',
        true: 'active bg-blue-700 text-white',
        false:
          'inactive bg-grayBlue-400 group-hover:text-white group-hover:bg-blue-700',
      },
    },
  }
);

const StepLabels = cva('text-gray-400 ', {
  variants: {
    base: {
      label: 'block pl-2 text-grayBlue-600 text-base font-light',
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

export const JStepBar: FC<JStepBarProps> = ({
  step,
  currentStep = 1,
  onStepClick,
  addClass,
  isOpenLayer,
  disabled,
  onClose,
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const layerMobileRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, setIsOpen } = useOutHandler({
    refs: [ layerRef, layerMobileRef ]
  });

  const openStepLayer = () => {
    setIsOpen((prev) => !prev);
  };

  // const openLayerEvent = (e: MouseEvent) => {
  //   if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
  //     setIsOpen(false);
  //   }
  //   if (layerMobileRef.current && !layerMobileRef.current.contains(e.target as Node)) {
  //     onClose?.();
  //   }
  // };

  // const closeFocusOut = (e: FocusEvent) => {
  //   if (layerRef.current && !layerRef.current.contains(e.relatedTarget as Node)) {
  //     setIsOpen(false);
  //   }
  //   if (layerMobileRef.current && !layerMobileRef.current.contains(e.relatedTarget as Node)) {
  //     onClose?.();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', openLayerEvent);
  //   const currentRef = layerRef.current;
  //   if (currentRef) {
  //     currentRef.addEventListener('focusout', closeFocusOut);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', openLayerEvent);
  //     const currentRef = layerRef.current;
  //     if (currentRef) {
  //       currentRef.removeEventListener('focusout', closeFocusOut);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      }

      checkMobile();

      if (!isMobile) {
        if(isOpen) return setIsOpen(false);
        if(isOpenLayer) return onClose?.();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isOpen, isOpenLayer, onClose, setIsOpen]);


  const disabledTxt = [
    {
      result: { label: '성적산출, 모의지원을 위해 학생 기본정보 입력' },
    },
    {
      result: { label: '학생부 및 수능 성적 입력'},
    },
    {
      result: { label: '희망대학 모의지원 및 실제지원 희망대학 선택'},
    },
    {
      result: { label: '각 대학별 환산점수 및 수시 합격예측 결과 확인'},
    },
    {
      result: { label: '12/31 오픈 예정! 실제 경쟁자의 점수 및 나의 위치 확인' },
    },
    {
      result: { label: '6번째 disabled message!' },
    },
  ]

  const sizeClass = `md:px-6 lg:px-[3rem] xl:px-[7.25rem] md:pr-15 gap-2 md:gap-0`;
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
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // console.log('Dimm 클릭됨 → 닫힘');
              onClose?.();
            }
          }}
        >
        <div
          ref={layerMobileRef}
          className={`
            md:relative absolute left-0 right-0 bottom-0
            p-5 md:p-0
            ${isOpen || isOpenLayer ?
            'translate-y-0  bg-[#FAFBFC] border-gray-100 rounded-tl-lg rounded-tr-lg transition-all duration-300' :
            ' translate-y-full md:translate-y-0'}
          `}
        >
          {/* mobile */}
          <p className={`block md:hidden mb-3 text-lg sm:text-xl text-center`}><b>합격예측 서비스 이용 STEP</b></p>
          <div className='absolute block top-5 right-5 md:hidden'>
            <CloseButton size="md" onClick={onClose} title="합격예측 서비스 이용 STEP 닫기 버튼" />
          </div>
          {/* mobile */}

          {/* Step */}
          <div className={`relative`}>
            <div className={`${cn(className, addClass)}`}>
              {disabled && isMobile ? (
                // Mobile disabled
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
                        className={`flex flex-wrap items-center z-5 group`}
                        prefetch={item.url?.includes('aspx') ? false : true}
                      >
                        <div
                          className={cn(StepPoints({ status: true }))}
                        >
                          {index + 1}
                        </div>

                        <div className={StepLabels({ base: 'label' })}>
                          <span
                            className={StepLabels({ label: true })}
                          >
                            <b>{item.label}</b>
                            <span className={` block md:hidden text-xs underline`}>
                              {disabled ? disabledTxt[index].result?.label : item.result?.label}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })
                // Mobile disabled
              ) : (
                step.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={cn(StepItems({
                        status: index + 1 === currentStep ? 'completed' : false,
                      }))}
                    >
                      <div className={`flex flex-wrap items-center z-5 group`}>
                        <div
                          className={cn(StepPoints({
                            status: index + 1 === currentStep ? true : false,
                          }))}
                          onClick={() => onStepClick && onStepClick(index)}
                        >
                          {index + 1}
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

                            <Link
                              href={item.id === 4 ? item.result?.active ? item.url || '' : item.result?.url || '' : item.url || ''}
                              prefetch={item.url?.includes('aspx') ? false : true}
                            >
                              {item.label}
                            </Link>

                            <Link
                              href={item.id === 4 ? item.result?.active ? item.url || '' : item.result?.url || '' : item.url || ''}
                              prefetch={item.url?.includes('aspx') ? false : true}
                              className={`${cn('md:absolute top-14 text-xs md:text-md font-light underline z-[10]',
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
                -mt-.5 absolute left-0 right-0 z-5 px-0 h-[4rem] justify-center items-center bg-white border border-gray-100 rounded-lg z-[7]
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
