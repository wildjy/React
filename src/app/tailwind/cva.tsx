
import { cn } from "../../sharedUI/common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const ParentStyle = cva('default css..', {
  variants: {
    status: {
      true: 'text-sm active',
      false: 'text-lg inactive',
    },
    color: {
      true: 'text-sm active',
      false: 'text-lg inactive',
    },
  },
});

const ChildrenStyle = 'p-4 border border-blue-700';

interface DivProps {
  status?: string;
  color?: string;
}

const DivComponent: FC<DivProps> = ({ status, color, ...props }) => {
  const className = ParentStyle({});
  return (
    <>
      <div className={className}>
        test. cva 개별 Style
      </div>
      <div className={ParentStyle()}>
        test. cva 개별 Style
      </div>
      <div className={ParentStyle({status: true})}>
        status : true = text-sm, active class
        <p className={ChildrenStyle}>Children Style : const ChildrenStyle = 'p-4 border border-blue-700';</p>
      </div>
      <div className={ParentStyle({status: false})}>
        status : false = text-lg inactive class
      </div>
    </>
  );
};

export default DivComponent;