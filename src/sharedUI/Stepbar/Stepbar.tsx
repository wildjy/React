
"use client";
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC, useEffect, useRef, useState } from "react";

const StepItems = cva(
  `xl:mr-4 xl:last:mr-0 flex-1 xl:flex-initial last:flex-none md:relative after:content-[""] after:block after:bg-gray-300`, //
  {
    variants: {
      status: {
        completed: 'completed', // mr-auto
        true: 'active ', // flex-1  after:h-[1px] after:w-full after:bg-blue-300
        false: 'inactive',
      },
    },
  }
);

const StepPoints = cva(
  `text-s xl:text-3xs z-10 w-7 h-7 text-white hover:text-white hover:bg-blue-700 relative flex justify-center items-center rounded-full transition`,
  {
    variants: {
      status: {
        completed: 'completed',
        true: "active bg-blue-700 bg-center bg-[length:55%_55%] bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] bg-no-repeat",
        false: 'inactive bg-grayBlue-400 group-hover:text-white group-hover:bg-blue-700',
      },
    },
  }
);

const StepLabels = cva('text-gray-400 bg-[#FAFBFC]', {
  variants: {
    base: {
      label: 'block xl:hidden px-4 text-grayBlue-600 text-base font-light',
    },
    label: {
      true: 'active text-gray-800 font-semi',
      false: 'inactive group-hover:text-gray-800 group-hover:font-semi transition',
    },
  },
});

const StepLines = cva('md:block absolute top-1/2 left-0 xl:left-7 w-full h-[1px] bg-gray-300', {
  variants: {
    line: {
      true: 'active',
      false: 'inactive',
    },
  },
});

interface Step {
  label?: string;
  name?: string;
  url?: string;
  isCompleted?: boolean;
}

interface StepBarProps extends HTMLAttributes<HTMLDivElement> {
  step: Step[];
  currentStep?: number;
  onStepClick?: (stepIndex: number) => void;
  addClass?: string;
  value?: string;
}

export const StepBar: FC<StepBarProps> = ({ step, currentStep = 0, onStepClick, addClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);

  const openStepLayer = () => {
    setIsOpen((prev) => !prev);
  };

  const openLayerEvent = (event: MouseEvent) => {
    if (layerRef.current && !layerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', openLayerEvent);
    return () => {
      document.removeEventListener('mousedown', openLayerEvent);
    };
  }, []);

  const className = `xl:px-5 xl:py-4 xl:pb-0 flex w-auto gap-3 items-center justify-between xl:justify-end items-top md:gap-0 relative `;
  const buttonClass = `w-full h-full bg-[length:0.625rem_0.375rem] bg-center bg-no-repeat
  bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]`;

  return (
    <div ref={layerRef} className="relative xl:flex xl:justify-end">
      <div className={`hidden md:block px-[5%] lg:px-[15%] xl:px-0 py-4 xl:py-0 bg-[#FAFBFC] xl:border border-gray-100 rounded-lg`}>
        <div className={`${cn(className, addClass)}`}>
          <p className="mr-4 text-base text-grayBlue-600 xl:text-xs">STEP</p>
          {step.map((item, index) => {
            return (
              <div key={index} className={StepItems({ status: index < currentStep ? true : index === currentStep ? 'completed' : false })}>
                <p
                  className={`
                      md:hidden absolute y_center left-0 ${cn(
                        'hidden',
                        index < currentStep ? 'hidden' : index === currentStep ? 'block' : false
                      )}
                    `}
                >
                  {item.name}
                </p>

                <a href={item.url} className="relative z-10 flex flex-wrap items-center group">
                  <div
                    className={StepPoints({ status: index <= currentStep ? true : false })}
                    onClick={() => onStepClick && onStepClick(index)}
                  >
                    {index <= currentStep ? `` : index + 1}
                  </div>

                  <div className={StepLabels({ base: 'label' })} onClick={() => onStepClick && onStepClick(index)}>
                    {/* <span className="block text-2xs">{item.label}</span> */}
                    <span className={StepLabels({ label: index <= currentStep ? true : false })}>{item.name}</span>
                  </div>
                </a>

                {index < step.length - 1 && <div className={StepLines({ line: true })}></div>}
              </div>
            );
          })}
        </div>

        <div className="relative hidden pt-2 h-7 xl:block">
          <button type="button" className={buttonClass} onClick={openStepLayer}>
            <span className="sr-only">스텝 안내 레이어 열기</span>
          </button>

          <div
            className={`${
              isOpen ? 'block' : 'hidden'
            } -mt-1 absolute left-0 right-0 z-10 px-5 py-6 bg-white border border-gray-100 rounded-lg`}
          >
            {step.map((item, index) => {
              return (
                <div key={index} className="relative mt-5 first:mt-0">
                  <a href={item.url} className="flex items-center gap-3 group">
                    <div className={StepPoints({ status: index <= currentStep ? true : false })}>
                      {index <= currentStep ? `` : index + 1}
                    </div>
                    <p className={StepLabels({ label: index <= currentStep ? true : false })}>{item.name}</p>
                  </a>

                  {index < step.length - 1 && <div className={`absolute left-4 top-[1.62rem] h-[0.7rem] border-l-[1px]`}></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
