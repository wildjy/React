import { cn } from '@hijinhak-front/utils';

interface InfoNumberTextProps {
  datas?: {
    main?: string;
    text?: string;
    text1?: string;
    text2?: string;
    text3?: string;
  }[];
  addClass?: string;
}

export const InfoNumberText: React.FC<InfoNumberTextProps> = ({
  datas,
  addClass,
}) => {
  return (
    <ul className={cn('', addClass)}>
      {datas?.map((data, index) => (
        <li
          key={index}
          className={`first:mt-0 mt-3 md:mt-4 lg:mt-5
            flex gap-x-1 text-2xs md:text-sm lg:text-base

          `}
        >
          {datas.length > 1 && (
            <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 mt-[0.125rem] text-xs md:text-sm text-blue-800 border border-blue-800 rounded">
              {index + 1}
            </span>
          )}

          {data.text1 || data.text2 || data.text3 ? (
            <div className="flex flex-col gap-y-3 md:gap-y-4 lg:gap-y-5">
              <p>{data.text1}</p>
              <p>{data.text2}</p>
              <p>{data.text3}</p>
            </div>
          ) : (
            <span>
              {data.main && (
                <p>
                  <b>{data.main}</b>
                </p>
              )}
              {data.text}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
