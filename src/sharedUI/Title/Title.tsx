import clsx from 'clsx'
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";

const TitleStyle = cva('mb-5', {
  variants: {
    mode: {
      base: 'base',
      line: 'line',
      number: 'number',
    },
    size: {
      sm: 'text-s',
      md: 'text-base md:text-3xl lg:text-4xl',
      lg: 'text-4xl',
    },
    color: {
      base: 'base',
      red: 'text-red',
      blue: 'text-blue-700',
    },
    bold: {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      md: "font-md",
      semi: 'font-semi',
      bold: 'font-bold',
    }
  },

  defaultVariants: {
    mode: 'base',
    size: 'md',
    color: 'base',
    bold: 'normal',
  }
})

interface titleProps extends Omit<HTMLAttributes<HTMLHeadingElement>, "mode">, VariantProps<typeof TitleStyle> {
  mode?: "base" | "line" | "number";
  size?: "sm" | "md" | "lg";
  color?: "base" | "red" | "blue";
  bold?: "thin" | "light" | "normal" | "md" | "semi" | "bold";
  title: string;
  className?: string;
  addClass?: string;
}

const Title: React.FC<titleProps> = ({
  mode, size, color, bold,
  title,
  addClass,
  ...props
}) => {

  const className = TitleStyle ({
    mode: mode as "base" | "line" | "number" | undefined,
    size: size as "sm" | "md" | "lg" | undefined,
    color: color as "base" | "red" | "blue" | undefined,
    bold: bold as "thin" | "light" | "normal" | "md" | "semi" | "bold" | undefined,
  });

  return (
    <>
      <h2 className={cn(className, addClass)} {...props}> { title } </h2>
    </>
  );
};

export default Title;