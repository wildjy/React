
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const StepItems = cva( //  
  'StepItems.. flex-1 last:flex-none relative after:content-[""] after:block after:bg-gray-300',
  {
    variants: {
      status: {
        completed: "completed",
        true: "active ", //after:h-[1px] after:w-full after:bg-blue-300
        false: "inactive",
      },
    },
  }
);
const StepPoints = cva(
  'StepPoints.. relative z-10 w-9 h-9 flex justify-center items-center rounded-full border bg-white',
  {
    variants: {
      status: {
        completed: "completed",
        true: "active bg-blue-700",
        false: "inactive",
      },
    },
  }
);

const StepLabels = cva(
  'StepLabels.. w-full',
  {
    variants: {
      label: {
        true: "active text-blue-700",
        false: "inactive",
      },
    },
  }
);
const StepLines = cva(
  'StepLines.. absolute top-6 left-0 w-full h-[1px] bg-gray-300',
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
  addClass,
  step,
  currentStep,
  ...props
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        {
          step.map((item, index) => {
            console.log(item)
            console.log(index)
            return <div key={index} className={StepItems({status: (index <= currentStep ? `true` : `false`)})}
            >
              
              <div className={StepPoints({status: (index <= currentStep ? `true` : `false`)})}>{index + 1}</div>
              <div className={StepLabels({label: (index <= currentStep ? `true` : `false`)})}>{item.label}</div>


              {index < step.length - 1 && (
                <div className={StepLines({line: 'true'})}></div>
              )}
            </div>
          })
        }
      </div>
    </>
  );
};

export default StepBar;