"use client";
import React, { HTMLAttributes } from 'react';
import { cn } from "../common/cn";

interface TableProps {
  children?: React.ReactNode;
  addClass?: string;
}
interface ColgroupProps {
  children?: React.ReactNode;
}
interface TheadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  thW?: string;
}
interface TbodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  tdW?: string;
}

interface TableType extends React.FC<TableProps> {
  Colgroup: typeof Colgroup;
  Thead: typeof Thead;
  Tbody: typeof Tbody;
}

const TableTr: TableType = ({ children, addClass}) => {
  return (
    <>
      <table className={cn(addClass, '')}>
        { children }
      </table>
    </>
  )
}

const Colgroup: React.FC<ColgroupProps> = ({ children }) => {
  return (
    <>
      <colgroup>
        { children }
      </colgroup>
    </>
  )
}

const Thead: React.FC<TheadProps> = ({ children, thW = "w-1/5" }) => {
  return (
    <>
      <thead className={`${thW} md:w-full`}>
        { children }
      </thead>
    </>
  )
}

const Tbody: React.FC<TbodyProps> = ({ children, tdW = "w-4/5" }) => {
  return (
    <>
      <tbody className={`${tdW} md:w-full`}>
        { children }
      </tbody>
    </>
  )
}

TableTr.Colgroup = Colgroup;
TableTr.Thead = Thead;
TableTr.Tbody = Tbody;

export default TableTr;