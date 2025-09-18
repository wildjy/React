
"use client";
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC, useEffect, useRef, useState } from "react";
import throttle from 'lodash/throttle';
import { CloseButton } from "../Button/CloseButton";
import Link from 'next/link';

const StepItems = cva(
  `
  md:flex-1 flex justify-start md:justify-center items-center text-center
  w-full md:w-auto
  md:relative after:content-[""] after:block
  after:bg-gray-300`,
  {
    variants: {
      status: {
        true: 'active cursor-pointer',
        false: 'inactive',
      },
    },
  }
);

const StepPoints = cva(
  `
  mt-1 md:mt-0 md:mb-2
  flex justify-center items-center text-center
  text-3xs md:text-sm
  size-5
  text-blue-800
  bg-center bg-no-repeat bg-[length:60%_60%]
  rounded-full
  relative z-[10]
  `,
  {
    variants: {
      status: {
        true: `active bg-blue-800 bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checked.svg')] text-white `,
        false: `inactive bg-white border border-blue-800`,
        icon: '',
      },
    },
  }
);

const StepLabels = cva(
  'text-sm sm:text-base md:text-sm text-left md:text-center text-gray-400 ',
  {
    variants: {
      base: {
        label: 'block text-grayBlue-600 text-sm sm:text-base',
      },
      label: {
        true: 'active text-gray-800',
        false: 'inactive transition',
      },
      result: {
        true: 'active text-blue-600',
        false: 'text-grayBlue-600',
      },
    },
  }
);

export interface JStep {
  id: number;
  label: string | { label: string; userName: string };
  result?: {
    active: boolean;
    value: string | number;
    activeUrl?: string;
    message?: string;
    disabled?: boolean;
  };
  url?: string;
  isCompleted?: boolean;
}

interface JStepBarProps extends HTMLAttributes<HTMLDivElement> {
  step: JStep[];
  isMobile: boolean;
  currentStep?: number | number[];
  addClass?: string;
  isOpenLayer?: boolean;
  // disabled?: { label?: string; url: string };
  disabledUrl?: string;
  onClose?: () => void;
}

export const JStepBar: FC<JStepBarProps> = ({
  step,
  isMobile,
  // currentStep,
  addClass,
  isOpenLayer,
  // disabled,
  disabledUrl,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isMobile, setIsMobile] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const layerMobileRef = useRef<HTMLDivElement | null>(null);

  // const disabled = Array.isArray(currentStep) && currentStep.length === 0;
  const getDisabled = step.map((i) => i.result?.active);
  const disabled = !getDisabled.some((item) => item === true);

  const renderLabel = (
    item: { id: number; label: string | { label: string; userName: string } },
    isActive: boolean
  ) => {
    if (typeof item.label === 'object') {
      if (item.id === 1) {
        return isActive ? `${item.label.userName} 님` : item.label.label;
      }
      return item.label.label;
    }
    return item.label;
  };

  // Step Label
  const getStepLabel = (
    item: JStep,
    isMobile: boolean,
    isActive: boolean,
    disabled: boolean,
    disabledTxt: { label: string }[],
    disabledPCTxt: { label: string }[]
  ) => {
    if (disabled) {
      if (item.result?.disabled) return item.result?.message || '오픈예정..';
      return isMobile
        ? disabledTxt[item.id - 1]?.label
        : disabledPCTxt[item.id - 1]?.label;
    }

    if (isActive) {
      if (item.id === 3) return item.result?.value + '/20개';
      if (item.id === 5) return item.result?.value + '개 완료';
      return item.result?.value;
    }

    if (item.result?.disabled) return item.result?.message || '오픈예정..';

    return isMobile
      ? !item.result?.disabled
        ? disabledPCTxt[item.id - 1]?.label
        : disabledTxt[item.id - 1]?.label
      : disabledPCTxt[item.id - 1]?.label;
  };

  // getHref
  const getHref = (item: JStep, isActive: boolean) => {
    if (isMobile && disabled) {
      return disabledUrl || '';
    } else if (item.id === 4) {
      return isActive ? item.result?.activeUrl || '' : item.url || '';
    }
    return !item.result?.active && item.result?.disabled ? '' : item.url || '';
  };

  const openStepLayer = () => {
    setIsOpen((prev) => !prev);
  };

  const openLayerEvent = (e: MouseEvent) => {
    if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
    if (
      layerMobileRef.current &&
      !layerMobileRef.current.contains(e.target as Node)
    ) {
      onClose?.();
    }
  };

  const closeFocusOut = (e: FocusEvent) => {
    if (
      layerRef.current &&
      !layerRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsOpen(false);
    }
    if (
      layerMobileRef.current &&
      !layerMobileRef.current.contains(e.relatedTarget as Node)
    ) {
      onClose?.();
    }
  };

  useEffect(() => {
    const openCheck = throttle(() => {
      if (!isMobile) {
        if (isOpen) return setIsOpen(false);
        if (isOpenLayer) return onClose?.();
      }
    }, 10);

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

  type disabledTxtType = {
    label: string;
  };

  const disabledTxt: disabledTxtType[] = [
    { label: '서비스 이용을 위한 수험생 정보 입력' },
    { label: '학생부 및 수능 성적 입력' },
    { label: '모의지원 및 실제지원 희망대학 선택' },
    { label: '대학별 환산점수 및 합격예측 결과 확인' },
    { label: '실제 경쟁자의 점수 및 나의 위치 확인' },
    { label: '6번째 disabled message!' },
  ];

  const disabledPCTxt: disabledTxtType[] = [
    { label: '입력하기' },
    { label: '입력하기' },
    { label: '모의지원 하기' },
    { label: '결제하기' },
    { label: '등록하기' },
    { label: '6번째 disabled message!' },
  ];

  return (
    <div
      className={`${cn(
        'mb-5 md:bg-white md:border md:border-grayBlue-200 rounded-lg',
        addClass
      )}`}
    >
      <div
        ref={layerRef}
        className={`
          ${cn(
            [
              `
              transition-all duration-300
              fixed bottom-0 left-0 w-full md:relative md:w-auto md:h-auto z-[100] md:z-[10]
            `,
            ],
            isOpen || isOpenLayer
              ? 'h-dvh bg-gray-1000 bg-opacity-65 md:bg-transparent md:bg-opacity-1'
              : 'md:bg-transparent md:bg-opacity-1 transition-all duration-300'
          )}`}
      >
        <div
          ref={layerMobileRef}
          className={`
            md:relative absolute left-0 right-0 bottom-0
            p-5 md:p-0
            ${
              isOpen || isOpenLayer
                ? 'translate-y-0 bg-white md:bg-transparent rounded-t-xl sm:rounded-t-2xl transition-all duration-300'
                : ' translate-y-full md:translate-y-0'
            }
          `}
        >
          {/* mobile */}
          <p
            className={`block md:hidden mb-5 pt-5 pb-2 text-base sm:text-lg border-b border-gray-200`}
          >
            <b>합격예측 서비스 이용 STEP</b>
          </p>
          <div className="absolute block top-5 right-5 md:hidden">
            <CloseButton
              size="md"
              onClick={onClose}
              title="합격예측 서비스 이용 STEP 닫기 버튼"
            />
          </div>
          {/* mobile */}

          {/* Step */}
          <div className="relative">
            <div
              className={`
                md:py-3 md:px-6 lg:px-[4.375rem]
                gap-y-4 md:gap-y-0
                flex flex-col md:flex-row items-center justify-start md:justify-between
                relative
                after:block after:absolute
                after:top-[1.375rem] after:bottom-[1.375rem] after:w-[1px]
                after:left-[0.6rem]
                md:after:inset-x-[12%] lg:after:inset-x-[15%]
                md:after:w-auto md:after:h-[1px] after:bg-[#CBDDF4]
              `}
            >
              {step.map((item) => {
                // const isActive = Array.isArray(currentStep)
                //   ? disabled
                //     ? false
                //     : currentStep.includes(item.id)
                //   : currentStep === item.id;
                const isActive = isMobile
                  ? item.result?.active
                  : disabled
                  ? false
                  : item.result?.active;
                const href = getHref(item, !!isActive);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      StepItems({
                        status:
                          isMobile && disabled
                            ? false
                            : isActive
                            ? true
                            : false,
                      })
                    )}
                  >
                    <Link
                      key={item.id}
                      href={href}
                      prefetch={!item.url?.includes('aspx')}
                      onClick={(e) => {
                        if (!item.result?.active && item.result?.disabled) {
                          e.preventDefault();
                          alert(item.result?.message);
                        }
                      }}
                      className={`
                        gap-x-2
                        flex md:flex-col
                        justify-start md:justify-center
                        items-start md:items-center
                      `}
                    >
                      {/* StepPoint */}
                      <div
                        className={cn(
                          StepPoints({
                            status:
                              isMobile && disabled
                                ? false
                                : isActive
                                ? true
                                : false,
                          })
                        )}
                      >
                        {isMobile && disabled
                          ? item.id
                          : isMobile && !isActive
                          ? item.id
                          : null}
                      </div>

                      {/* StepLabels */}
                      <div className={StepLabels({ base: 'label' })}>
                        <span
                          className={cn(
                            StepLabels({
                              label: disabled && isMobile ? true : isActive,
                            }),
                            'gap-x-5 sm:gap-x-7'
                          )}
                        >
                          <div className="w-full">
                            <span className="text-[#5D5C5C]">
                              {renderLabel(item, !!isActive)}
                            </span>
                          </div>

                          <b
                            className={cn(
                              [
                                `flex items-center md:justify-center
                                  text-gray-800
                                  after:content-[''] md:after:hidden
                                  after:mb-[0.15rem] sm:after:mb-0
                                  after:w-[1.35rem] after:h-[0.5rem]
                                  after:bg-center after:bg-no-repeat after:bg-[length:100%_100%]
                                  after:bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_back.svg')]
                                  after:rotate-180
                                `,
                              ],
                              !disabled &&
                                isMobile &&
                                !isActive &&
                                !item.result?.disabled
                                ? 'after:block'
                                : 'after:hidden',
                              !disabled && item.result?.disabled
                                ? 'no-underline'
                                : 'underline',
                              disabled &&
                                item.result?.disabled &&
                                'no-underline',
                              !disabled && isActive && 'no-underline',
                              isActive && ' after:border-blue-600'
                            )}
                          >
                            {getStepLabel(
                              item,
                              isMobile,
                              !!isActive,
                              !!disabled,
                              disabledTxt,
                              disabledPCTxt
                            )}
                          </b>
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Step */}
        </div>
      </div>
    </div>
  );
};
