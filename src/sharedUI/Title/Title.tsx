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
  align,
  addClass,
  subClass,
}) => {
  const typeMargin = {
    default: { class: 'mb-0' },
    report: { class: 'mt-7 mb-4' },
  };

  const typeClass = typeMargin[type];

  return (
    <Tag className={`${typeClass.class} ${child ? addClass : `flex items-baseline ${align}`}`}>
      {child ? (
        children
      ) : (
        <>
          <b className={`${cn(`text-md sm:text-lg md:text-xl xl:text-2xl`, addClass)}`}>{title}</b>
          <span className={`${cn(`hidden ml-5 text-gray-400 lg:inline-block`, subClass)}`}>{sub}</span>
        </>
      )}
    </Tag>
  );
};

