"use client";
import React, { HTMLAttributes } from 'react';
import { cn } from "../common/cn";

interface TableProps {
  children?: React.ReactNode;
  caption?: string;
  thW?: string;
  tdW?: string;
  addClass?: string;
  typeClass?: string;
}
interface ColgroupProps {
  children?: React.ReactNode;
  addClass?: string;
}
interface TheadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  thW?: string;
  addClass?: string;
}
interface TbodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  tdW?: string;
  addClass?: string;
}

interface TableType extends React.FC<TableProps> {
  Colgroup: typeof Colgroup;
  Thead: typeof Thead;
  Tbody: typeof Tbody;
}

const Table: TableType = ({ children, caption = 'table caption..', addClass }) => {
  return (
    <table className={cn(addClass, '')}>
      <caption className="hidden">{caption}</caption>
      {children}
    </table>
  );
};

const Colgroup: React.FC<ColgroupProps> = ({ children }) => {
  return <colgroup className={cn(`lg:w-full`)}>{children}</colgroup>;
};

const Thead: React.FC<TableProps> = ({ children, thW = 'w-1/5', addClass }) => {
  return <thead className={cn(`lg:w-full`, addClass, thW)}>{children}</thead>;
};

const Tbody: React.FC<TableProps> = ({ children, tdW = 'w-4/5', addClass }) => {
  return <tbody className={cn(`lg:w-full`, addClass, tdW)}>{children}</tbody>;
};

Table.Colgroup = Colgroup;
Table.Thead = Thead;
Table.Tbody = Tbody;

export default Table;
