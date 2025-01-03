
import { cn } from "../common/cn";
import { cva } from "class-variance-authority";

interface TableProps {
  children?: React.ReactNode;
  typeClass?: string;
}
interface ColgroupProps {
  children?: React.ReactNode;
}
interface TheadProps {
  children?: React.ReactNode;
  thW?: string;
}
interface TbodyProps {
  children?: React.ReactNode;
  tdW?: string;
}

interface TableType extends React.FC<TableProps> {
  Colgroup: typeof Colgroup;
  Thead: typeof Thead;
  Tbody: typeof Tbody;
}

const Table: TableType = ({ children, typeClass }) => {
  return (
    <>
      <table className={typeClass}>
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
        <tr>
          { children }
        </tr>
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

Table.Colgroup = Colgroup;
Table.Thead = Thead;
Table.Tbody = Tbody;

export default Table;