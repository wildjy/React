"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface TitleProps {
  child?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  type?: 'default' | 'report';
  children?: React.ReactNode;
  align?: string;
  addClass?: string;
  subClass?: string;
  title?: string;
  sub?: string;
}

export const Title: React.FC<TitleProps> = ({
  type = 'default',
  tag: Tag = 'p',
  child = false,
  children,
  title,
  sub,
  align = 'left',
  addClass,
  subClass,
}) => {
  const typeMargin = {
    default: { class: 'mb-0' },
    report: { class: 'mt-7 mb-4' },
  };

  const typeClass = typeMargin[type];

  return (
    <Tag
      className={`${cn(`${typeClass.class} `, addClass, {
        'justify-start text-left': align === 'left',
        'justify-center text-center': align === 'center',
        'justify-end text-right': align === 'right',
      })}
     ${child ? addClass : `flex items-baseline`}`}
    >
      {child ? (
        children
      ) : (
        <>
          <b className={``}>{title}</b>
          {sub && <span className={`${cn(`hidden ml-4 text-base text-gray-400 lg:inline-block`, subClass)}`}>{sub}</span>}
        </>
      )}
    </Tag>
  );
};

