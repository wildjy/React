'use client';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from "../common/cn";

const InfoTextVariants = cva(
  `
  mt-7 md:mt-7 flex flex-wrap items-center justify-between rounded
  `,
  {
    variants: {
      type: {
        line: 'p-4 sm:p-5 md:p-6 border',
        bg: 'p-4 sm:p-5 md:p-6',
      },
    },
  }
);
interface InfoTextBoxProps extends VariantProps<typeof InfoTextVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

export const InfoTextBox: React.FC<InfoTextBoxProps> = ({ type, children, addClass }) => {
  const className = InfoTextVariants({
    type: type as 'line' | 'bg' | undefined,
  });

  return <div className={`${cn(className, addClass)}`}>{children}</div>;
};
