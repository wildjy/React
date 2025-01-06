
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const StepItems = cva( //
  'StepItems.. md:mr-4 md:last:mr-0 md:flex-1 last:flex-none md:relative after:content-[""] after:block after:bg-gray-300', //
  {
    variants: {
      status: {
        completed: "completed", // mr-auto
        true: "active ", // flex-1  after:h-[1px] after:w-full after:bg-blue-300
        false: "inactive",
      },
    },
  }
);

const StepPoints = cva(
  'StepPoints.. text-xs md:text-base z-10 w-7 h-7 md:w-9 md:h-9 hover:text-white hover:bg-blue-700 relative  flex justify-center items-center rounded-full transition',
  {
    variants: {
      status: {
        completed: "completed",
        true: "active bg-blue-700 bg-center bg-[length:55%_55%] bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] bg-no-repeat",
        false: "inactive bg-grayBlue-200 group-hover:text-white group-hover:bg-blue-700",
      },
    },
  }
);

const StepLabels = cva(
  'StepLabels..',
  {
    variants: {
      base: {
        label : 'hidden px-4 md:block text-grayBlue-600 text-lg lg:text-base font-light bg-white ',
      },
      label: {
        true: "active text-gray-800 font-semi",
        false: "inactive group-hover:text-gray-800 group-hover:font-semi transition",
      },
    },
  }
);

const StepLines = cva(
  'StepLines.. hidden md:block absolute top-6 left-0 w-full h-[1px] bg-gray-300',
  {
    variants: {
      line: {
        true: "active",
        false: "inactive",
      },
    },
  }
);

interface Step {
  label?: string;
  name?: string;
  url?: string;
  isCompleted?: boolean;
}

interface StepBarProps extends HTMLAttributes<HTMLDivElement>{
  step: Step[];
  currentStep?: number;
  onStepClick?: (stepIndex: number) => void;
  addClass?: string;
  value?: string;
};

const StepBar: FC<StepBarProps> = ({
  step,
  currentStep = 0,
  onStepClick,
}) => {
  return (
    <>
      <div className="flex justify-end md:justify-between items-top gap-3 md:gap-0 relative">
        {
          step.map((item, index) => {
            return (
              <div key={index} className={
                StepItems({status: index < currentStep ? true : index === currentStep ? "completed" : false,})
                }
              >
                <p className={`
                  md:hidden absolute y_center left-0 ${cn('hidden', index < currentStep ? 'hidden' : index === currentStep ? "block" : false,)}
                `}>
                  {item.name}
                </p>

                <a href={item.url} className="group flex flex-wrap items-center relative z-10">
                  <div className={StepPoints({status: (index <= currentStep ? true : false)})}
                    onClick={() => onStepClick && onStepClick(index)}>
                    {index <= currentStep ? `` : index + 1}
                  </div>

                  <div className={StepLabels({base: 'label'})} onClick={() => onStepClick && onStepClick(index)}>
                    <span className="block text-2xs">{item.label}</span>
                    <span className={StepLabels({label: (index <= currentStep ? true : false)})}>{item.name}</span>
                  </div>
                </a>

                {index < step.length - 1 && (
                  <div className={StepLines({line: true})}></div>
                )}

              </div>
            )
          })
        }
      </div>
    </>
  );
};

export default StepBar;