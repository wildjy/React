
import { cn } from "../common/cn";

interface ScoreOptionProps {
  title: string;
  options: { value: string; label: string }[];
  align?: "left" | "center";
  selectValue: { value: string | null } | null;
  atShadow?: boolean;
  addClass?: string;
  onChangeSelect: (option: { value: string; label: string }) => void;
}

export const ScoreOption: React.FC<ScoreOptionProps> = ({
  title,
  options,
  align,
  selectValue,
  atShadow,
  addClass,
  onChangeSelect
}) => (
  // px-5 md:px-0
  <div className={`${cn('grow md:grow-0', '',
    { 'text-left': align === 'left' },
    { 'text-center': align === 'center' },
  )}`}>
    <p className="text-center"><b>{title}</b></p>
    <ul className={`whitespace-pre`}>
      {options.map((option) => (
        <li
          key={option.value}
          className={`text-2xs md:text-s ${cn('md:px-4 py-2 rounded md:hover:bg-gray-200 cursor-pointer', addClass,
            { 'text-blue-800 font-bold': selectValue?.value === option.value },
            { 'rounded-none': atShadow }
          )}`}
          onClick={() => onChangeSelect(option)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  </div>
);