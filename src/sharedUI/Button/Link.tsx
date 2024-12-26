import { cn } from "../common/cn";
import { VariantProps } from "class-variance-authority";
import { AnchorHTMLAttributes, FC } from "react";
import ButtonVariants from "./ButtonVariants";

type sizeType = "sm" | "md" | "lg";
type modeType = "primary" | "secondary" | "tertiary";
type roundType = "rec" | "sm" | "full";

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type">, VariantProps<typeof ButtonVariants> {
  blank?: boolean;
  addClass?: string;
  href?: string;
  value?: string;
  label?: string;
  disabled?: boolean,
};

const Link: React.FC<LinkButtonProps> = ({
  blank,
  size,
  mode,
  round,
  addClass,
  label,
  href,
  value,
  disabled,
  ...props
}) => {
  const className = ButtonVariants ({
    size: size as sizeType | undefined,
    mode: mode as modeType | undefined,
    round: round as roundType | undefined,
  });

  const primary = mode ===  null || "primary";
  const tertiary = mode ===  "tertiary";

  return (
    <>
      {/* <a href={href || "#"} {...(blank && {target: "_blank"})} */}
      <a
        href={href || "#"}
        target={blank ? "_blank" : undefined}
        rel={blank ? "noopener noreferrer" : undefined}
        className={cn(className, addClass, {
          'text-white bg-[#E0E0E0] cursor-default': disabled && primary,
          'text-[#C4C4C4] bg-white border-[#C4C4C4] cursor-default': disabled && tertiary,
        })}
        {...props}
      >
        {label}
      </a>
    </>
  );
};

export default Link;