"use client";
import React, { } from "react";
import { cn } from "../common/cn";
interface TitleProps {
  child?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  addClass?: string;
  subClass?: string;
  title?: string;
  sub?: string;
}

export const Title: React.FC<TitleProps> = ({ tag: Tag = 'p', child = false, children, title, sub, addClass, subClass }) => {
  return (
    <Tag className={`${child ? '' : 'flex items-baseline'}`}>
      {child ? (
        children
      ) : (
        <>
          <b className={`${cn(`text-md sm:text-lg md:text-xl xl:text-2xl`, addClass)}`}>{title}</b>
          <span className={`${cn(`hidden ml-6 text-gray-400 lg:inline-block`, subClass)}`}>{sub}</span>
        </>
      )}
    </Tag>
  );
};
