'use client';
import React from 'react';
import { cn } from "../common/cn";

interface ContTableProps {
  children?: React.ReactNode;
  addClass?: string;
}

export const ContTable: React.FC<ContTableProps> = ({ children, addClass }) => {
  return <div className={`${cn('mt-3 sm:mt-4 md:mt-5', addClass)}`}>{children}</div>;
};
