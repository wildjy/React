
import { ResultFlag } from "./ResultFlag"
import { cn } from "../common/cn";
import { code } from "../common/common-code-definitions";

interface ResultFlagSummaryProps {
  align?: string;
}

export const ResultFlagSummary: React.FC<ResultFlagSummaryProps> = ({ align = 'center' }) => {
  return (
    <div className={`${cn('mt-2 md:mt-3 flex justify-center gap-x-5',
      align === 'left' && 'justify-start',
      align === 'right' && 'justify-end',
    )}`}>
      <ResultFlag mode="badge" type={code("REGULAR_PASS_SCORE_RANGE_CODES", "PASS_FIRST")} label={"최초합격"} summary />
      <ResultFlag mode="badge" type={code("REGULAR_PASS_SCORE_RANGE_CODES", "PASS_SUPPLEMENT")} label={"추가합격"} summary />
      <ResultFlag mode="badge" type={code("REGULAR_PASS_SCORE_RANGE_CODES", "PASS_FAIL")} label={"불합격"} summary />
    </div>
  )
}