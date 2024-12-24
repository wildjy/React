import { cn } from "../common/cn";
import { VariantProps } from "class-variance-authority";
import { AnchorHTMLAttributes, FC } from "react";
import ButtonVariants from "./ButtonVariants";

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type">, VariantProps<typeof ButtonVariants> {
  blank?: boolean;
  size?: "sm" | "md" | "lg";
  mode?: "primary" | "secondary" | "tertiary";
  round?: "default" | "sm" | "full";
  addClass?: string;
  href?: string;
  value?: string;
  name?: string;
  disabled?: boolean,
};

const Link: React.FC<LinkButtonProps> = ({
  blank,
  size,
  mode,
  round,
  addClass,
  name,
  href,
  value,
  disabled,
  ...props
}) => {
  const className = ButtonVariants ({
    size: size as "sm" | "md" | "lg" | undefined,
    mode: mode as "primary" | "secondary" | "tertiary" | undefined,
    round: round as "default" | "sm" | "full" | undefined,
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
          'text-white bg-disabled-bg cursor-default': disabled && primary,
          'text-disabled-text bg-white border-disabled-line cursor-default': disabled && tertiary,
        })}
        {...props}
      >
        {name}
      </a>
    </>
  );
};

export default Link;