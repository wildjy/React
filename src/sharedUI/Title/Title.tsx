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

export const Title: React.FC<TitleProps> = ({ tag: Tag = "p", title, sub, addClass }) => {
  return (
    <Tag className={`${cn(``, addClass)}`}>
      <b className="md:text-2xl">{ title }</b>

      <span className="hidden md:inline-block ml-6 text-gray-400">
        {sub}
      </span>
    </Tag>
  )
}