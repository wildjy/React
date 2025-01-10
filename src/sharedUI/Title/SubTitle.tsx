"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface TitleProps {
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  addClass?: string;
  title?: string;
  sub?: string;
}

export const SubTitle: React.FC<TitleProps> = ({ tag: Tag = "p", children, addClass }) => {
  return (
    <Tag className={`${cn(`mt-4 text-3xs md:text-s text-gray-400`, addClass)}`}>
      {children}
    </Tag>
  )
}