'use client';
import { cva, VariantProps } from 'class-variance-authority';
import React, { useEffect, useRef, useState } from 'react';
import { CloseButton } from '../Button/CloseButton';
import { cn } from "../common/cn";

const ToolTipVariants = cva(
  `
  top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20
  p-5 min-w-[100px] max-w-[80dvw] w-max max-h-[90dvh] md:max-w-[500px]
  bg-white border border-gray-100 rounded-lg
  transition-all duration-300
  drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] md:drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)]
  `,
  {
    variants: {
      type: {
        base: `fixed md:absolute md:top-auto md:-translate-y-0 md:left-0 md:translate-x-0`,
        layer: `fixed`,
      },
      align: {
        left: `md:left-0 md:translate-x-0`,
        center: `md:left-1/2 md:-translate-x-1/2 `,
        right: `md:left-auto md:right-0 md:translate-x-0 `,
      },
    },
    defaultVariants: {
      type: 'base',
    },
  }
);

const ToolTipButton = cva(
  `
  block
  text-transparent
  w-[0.875rem] h-[0.875rem]
  sm:w-[1.125rem] sm:h-[1.125rem]
  bg-center bg-no-repeat bg-[length:100%_100%]

  `,
  {
    variants: {
      icon: {
        base: `bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_tooltip.svg")]`,
      },
    },
    defaultVariants: {
      icon: 'base',
    },
  }
);

interface ToolTipProps
  extends VariantProps<typeof ToolTipButton>,
    VariantProps<typeof ToolTipVariants> {
  justify?: string;
  iconUrl?: string;
  children?: React.ReactNode;
  outClose?: boolean;
  close?: boolean;
  isOpen?: boolean;
  addClass?: string;
  onClick?: () => void;
}

export const ToolTip: React.FC<ToolTipProps> = ({
  icon,
  iconUrl,
  close = true,
  outClose = true,
  type,
  align,
  isOpen,
  onClick,
  children,
  addClass,
}) => {
  const toolTipRef = useRef<HTMLDivElement | null>(null);
  const [inIsOpen, setInIsOpen] = useState(isOpen || false);

  useEffect(() => {
    setInIsOpen(isOpen || false);
  }, [isOpen]);

  const EventOpen = () => {
    setInIsOpen((prev) => !prev);
    onClick?.();
  };

  const openMouseEvent = (event: MouseEvent) => {
    if (
      outClose &&
      (isOpen || inIsOpen) &&
      toolTipRef.current &&
      !toolTipRef.current.contains(event.target as Node)
    ) {
      setInIsOpen(false);
      onClick?.();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {
      document.removeEventListener('mousedown', openMouseEvent);
    };
  }, [isOpen, inIsOpen]);

  const classButton = ToolTipButton({
    icon: icon as 'base' | undefined,
  });

  const className = ToolTipVariants({
    type: type as 'base' | undefined,
    align:
      type === 'layer'
        ? undefined
        : (align as 'left' | 'center' | 'right' | undefined),
  });

  return (
    <div className="relative" ref={toolTipRef}>
      <button
        type="button"
        className={`${cn(classButton, '')}`}
        style={iconUrl ? { backgroundImage: `url(${iconUrl})` } : {}}
        onClick={EventOpen}
      >
        <span className="sr-only">tooltip 버튼</span>
      </button>
      <div
        className={`${cn(className, addClass)}
          ${inIsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        {close && (
          <div className="flex justify-end mb-1">
            <CloseButton onClick={EventOpen} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
