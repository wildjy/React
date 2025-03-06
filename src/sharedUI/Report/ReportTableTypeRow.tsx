'use client';
import { useState, useEffect } from 'react';
import Table from '../Table/Table';
import { cn } from "../common/cn";

interface ReportTableTypeRowProps {
  addClass?: string;
  datas: {
    children: {
      label?: string | React.ReactNode;
      th?: boolean;
    }[];
  }[];
}
export const ReportTableTypeRow: React.FC<ReportTableTypeRowProps> = ({ addClass, datas }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Table addClass={`${cn('tableTypeRow', addClass)}`}>
      <Table.Colgroup>
        {datas[0].children.map((_, index) => (
          <col key={index} className="w-full md:w-auto" style={isDesktop ? { width: `${100 / datas[0].children.length}%` } : {}} />
        ))}
      </Table.Colgroup>
      <Table.Tbody tdW="w-full">
        {datas?.map((item, index) => (
          <tr key={index}>{item.children.map((obj, i) => (obj.th ? <th key={i}>{obj.label}</th> : <td key={i}>{obj.label}</td>))}</tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
