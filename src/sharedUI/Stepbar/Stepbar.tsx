import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const StepItems = cva( //
  'StepItems.. md:flex-1 last:flex-none relative after:content-[""] after:block after:bg-gray-300', //
  {
    variants: {
      status: {
        completed: "mr-auto completed", //
        true: "active ", // flex-1  after:h-[1px] after:w-full after:bg-blue-300
        false: "inactive",
      },
    },
  }
);
const StepPoints = cva(
  'StepPoints.. relative z-10 w-9 h-9 flex justify-center items-center rounded-full border',
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
  'StepLabels..  md:block w-full',
  {
    variants: {
      label: {
        true: "block active text-blue-700",
        false: "hidden inactive",
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
      <div className="flex justify-end md:justify-between items-top gap-4 md:gap-0">
        {
          step.map((item, index) => {
            console.log(item)
            console.log(index)
            return <div key={index} className={StepItems({status:
              index < currentStep ? "true" : index === currentStep ? "completed" : "false",
            })}
            >

              <div className={StepPoints({status: (index <= currentStep ? `true` : `false`)})}>
                {index <= currentStep ? `` : index + 1}

                </div>
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