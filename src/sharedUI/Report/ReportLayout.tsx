
'use client';
import React from 'react';
import { cn } from "../common/cn";

interface ReportLayoutProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const ReportLayout: React.FC<ReportLayoutProps> = ({ children, addClass }) => {
  const className = `
after:bg-blue-700
  xl:after:bg-[url('https://image.jinhak.com/jinhakImages/react/bg/bg_reportTop.jpg')]
  after:w-full after:h-[350px]
  after:bg-[length:100%_100%]
  after:absolute after:top-0
  after:content-[""] after:bg-center after:transition-all after:duration-200
  xl:after:rounded-bl-[5.5313rem_3.125rem] xl:after:rounded-br-[5.5313rem_3.125rem] after:bg-repeat-x
  `;

  return (
    <div className={`${cn(className, addClass)}`}>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
