import { cva } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const StepItems = cva( //
  'StepItems.. md:flex-1 last:flex-none relative after:content-[""] after:block after:bg-gray-300', //
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
  'StepPoints.. relative z-10 w-9 h-9 hover:text-white hover:bg-blue-700 flex justify-center items-center rounded-full border transition',
  {
    variants: {
      status: {
        completed: "completed",
        true: "flex-1 active bg-blue-700 bg-center bg-[length:55%_55%] bg-[url('https://image.jinhak.com/jinhakImages/react/icon/icon_checkbox_checked.svg')] bg-no-repeat",
        false: "inactive bg-white",
      },
    },
  }
);

const StepLabels = cva(
  'StepLabels.. hidden md:block w-full',
  {
    variants: {
      label: {
        true: "active text-blue-700",
        false: "inactive", // hidden
      },
    },
  }
);
const StepLines = cva(
  'StepLines.. hidden md:block absolute top-5 left-0 w-full h-[1px] bg-gray-300',
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
  label: string;
  isCompleted: boolean;
}

interface StepBarProps extends HTMLAttributes<HTMLDivElement>{
  step: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  addClass?: string;
  value?: string;
};

const StepBar: FC<StepBarProps> = ({
  step,
  currentStep,
  onStepClick,
}) => {
  return (
    <>
      <div className="flex justify-end md:justify-between items-top gap-4 md:gap-0">
        {
          step.map((item, index) => {
            return (
            //  step
            <div key={index} className={
              StepItems({status: index < currentStep ? true : index === currentStep ? "completed" : false,})
              }
            >
              {/* points */}
              <a href="#/" className={StepPoints({status: (index <= currentStep ? true : false)})}
                onClick={() => onStepClick && onStepClick(index)}>
                {index <= currentStep ? `` : index + 1}
              </a>

              {/* label */}
              <div className={StepLabels({label: (index <= currentStep ? true : false)})}>{item.label}</div>

              {/* line */}
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