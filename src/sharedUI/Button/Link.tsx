'use client';
import { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { cn } from '../common/cn';
import { ButtonVariants } from './ButtonVariants';

type sizeType = 'sm' | 'md' | 'lg';
type modeType = 'primary' | 'secondary' | 'tertiary' | 'text';
type roundType = 'rec' | 'sm' | 'full';

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>, VariantProps<typeof ButtonVariants> {
  tag?: keyof JSX.IntrinsicElements | React.ElementType;
  children?: React.ReactNode;
  blank?: boolean;
  addClass?: string;
  href?: string;
  value?: string;
  startIcon?: React.ReactNode[];
  endIcon?: React.ReactNode[];
  disabled?: boolean;
}

export const ButtonLink: React.FC<LinkButtonProps> = ({
  tag: Tag = 'a',
  children,
  blank,
  size,
  mode,
  round,
  addClass,
  href,
  startIcon,
  endIcon,
  disabled,
  ...props
}) => {
  const primary = mode === null || 'primary';
  const tertiary = mode === 'tertiary';

  const className = ButtonVariants({
    size: size as sizeType | undefined,
    mode: mode as modeType | undefined,
    round: round as roundType | undefined,
  });

  const buttonStyle = cn(className, addClass, {
    'gap-3': startIcon || endIcon,
    'text-white bg-[#E0E0E0] cursor-default': disabled && primary,
    'text-[#C4C4C4] bg-white border-[#C4C4C4] cursor-default': disabled && tertiary,
  });
  const buttonIcon = () => (
    <>
      {startIcon && (
        <img src={`https://image.jinhak.com/jinhakImages/react/icon/${startIcon[0]}`} className={`${startIcon[1]}`} alt="icon" />
      )}
      {children}
      {endIcon && <img src={`https://image.jinhak.com/jinhakImages/react/icon/${endIcon[0]}`} className={`${endIcon[1]}`} alt="icon" />}
    </>
  );

  if (Tag === 'a') {
    return (
      <Tag
        href={(!disabled && href) || '#/'}
        target={blank ? '_blank' : undefined}
        rel={blank ? 'noopener noreferrer' : undefined}
        className={buttonStyle}
        onClick={(e) => disabled && e.preventDefault()}
        {...props}
      >
        {buttonIcon()}
      </Tag>
    );
  }

  return (
    <ButtonLink href={href || '#'} rel={blank ? 'noopener noreferrer' : undefined} className={buttonStyle} {...props}>
      {buttonIcon()}
    </ButtonLink>
  );
};