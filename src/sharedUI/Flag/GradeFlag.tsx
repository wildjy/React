
"use client";
import React, { } from "react";
import { cn } from "../common/cn";

interface GradeFlagProps {
  tag?: keyof JSX.IntrinsicElements;
  addClass?: string;
  label?: string;
  type?: string;
}

export const GradeFlag: React.FC<GradeFlagProps>= ({ tag: Flag = "span", type, label, addClass }) => {
  const flagItems = [
    {
      flagType: type === "flag1",
      textColor: "text-gray-600",
      textBg: "bg-grayBlue-100",
    },
    {
      flagType: type === "flag2",
      textColor: "text-[#EDA67C]",
      textBg: "bg-[#FDF6EB]",
    },
    {
      flagType: type === "flag3",
      textColor: "text-[#6E87CA]",
      textBg: "bg-[#F3F6FE]",
    },
    {
      flagType: type === "flag4",
      textColor: "text-[#54AAD2]",
      textBg: "bg-[#EDFBF8]",
    },
  ];

  const className = `inline-block px-4 md:px-6 py-2 md:py-3 text-4xs md:text-s text-center  rounded-full`
  return (
    <>
      {
        flagItems.map((flag, index) => flag.flagType && (
          <Flag key={index}
            className={` ${flag.textColor} ${flag.textBg} ${cn(className, addClass)}`}
          >
            {label}
          </Flag>
        ))
      }
    </>
  )
}