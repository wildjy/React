
"use client";
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC, useEffect, useRef, useState } from "react";
import { CloseButton } from "../Button/CloseButton";
import Link from 'next/link';

const StepItems = cva(
  `flex items-center w-full md:relative after:content-[""] after:block after:bg-gray-300`,
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
  `text-sm xl:text-3xs z-5 w-6 h-6 text-white hover:text-white hover:bg-blue-700 relative flex justify-center items-center rounded-full transition`,
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
  label?: string;
  result?: {active: boolean, label: string | React.ReactNode, url?: string};
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);

  console.log(isOpenLayer)
  const openStepLayer = () => {
    setIsOpen((prev) => !prev);
  };

  const openLayerEvent = (e: MouseEvent) => {
    if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const closeFocusOut = (e: FocusEvent) => {
    if (layerRef.current && !layerRef.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    const currentRef = layerRef.current;
    document.addEventListener('mousedown', openLayerEvent);
    if (currentRef) {
      currentRef.addEventListener('focusout', closeFocusOut);
    }

    return () => {
      document.removeEventListener('mousedown', openLayerEvent);
      if (currentRef) {
        currentRef.removeEventListener('focusout', closeFocusOut);
      }
    };
  }, []);

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

  const sizeClass = `md:px-5 md:pr-10 gap-2 md:gap-0`;
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
          className={`
            md:relative absolute left-0 right-0 bottom-0
            p-5 md:p-0
            ${isOpen || isOpenLayer ?
            'bg-[#FAFBFC] border-gray-100 rounded-tl-lg rounded-tr-lg translate-y-0 transition-all duration-300' :
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
          <div className={`${cn(className, addClass)}`}>
            {disabled && isMobile ? (
              isMobile ? (
                step.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(StepItems({
                        status: index + 1 === currentStep ? 'completed' : false,
                      }))}
                    >
                      <Link
                        href={disabled.url || ''}
                        className={`relative flex flex-wrap items-center z-5 group`}
                        prefetch={disabled.url?.includes('aspx') ? false : true}
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
              ) : (
                <div className='block text-center md:hidden'>
                  <Link href={disabled.url || ''} className='underline'>{disabled.label}</Link>
                </div>
              )
            ) : (
              step.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={cn(StepItems({
                      status: index + 1 === currentStep ? 'completed' : false,
                    }))}
                  >
                    <Link
                      href={item.url || ''}
                      className={`relative flex flex-wrap items-center z-5 group`}
                      prefetch={item.url?.includes('aspx') ? false : true}
                    >
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
                          className={StepLabels({
                            label: index + 1 === currentStep ? true : false,
                          })}
                        >
                          <b>{item.label}</b>
                          <span
                            className={`
                              block md:hidden text-xs underline
                              ${item.result?.active ? 'text-blue-600' : 'text-grayBlue-600'}
                            `}
                          >
                            {item.result?.label}
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
            )}

            <button type="button" className={buttonClass} onClick={openStepLayer}>
              <span className="sr-only">스텝 안내 레이어 열기</span>
            </button>
          </div>
          {/* Step */}

          {/* layer */}
          <div className="relative hidden md:block">
            <div
              className={`
                ${isOpen ? 'hidden md:block' : 'hidden'}
                -mt-.5 absolute left-0 right-0 z-5 px-0 py-5 bg-white border border-gray-100 rounded-lg z-[7]
              `}
            >
              {disabled ? (
                <div className='text-center'>
                  <Link href={disabled.url || ''} className='underline'>{disabled.label}</Link>
                </div>
              ) : (
                <div className={`${sizeClass} flex justify-center gap-2 md:gap-0`}>
                  {step.map((item, index) => {
                    return (
                      <div key={index} className={`w-1/5 relative mt-4 first:mt-0 md:mt-0 text-center`}>
                        <Link
                          href={item.result?.url || ''}
                          className={`
                            md:block
                            flex items-center gap-2
                            w-full text-center
                            lg:pl-8 lg:text-left
                            group hover:underline
                          `}
                        >
                          <span
                            className={cn(StepLabels({
                              result: item.result?.active ? true : false,
                            }), 'text-sm')}
                          >
                            {item.result?.label}
                          </span>
                        </Link>
                      </div>
                    );
                  })}
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
