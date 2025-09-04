import { cn } from "../common/cn";

interface analysisType {
  datas: {
    mainTitle?: string | React.ReactNode;
    title?: string | React.ReactNode;
    value?: string | React.ReactNode;
    text?: string | React.ReactNode;
    url?: string;
  }[];
};

export const InfoTransformText: React.FC<analysisType> = ({
  datas,
}) => {

  const recClass = `
    md:pb-4 md:pt-6
    md:justify-center
    items-start
  `
  const rec1Class = `
    md:justify-center
    items-center
    md:border-dashed md:border-l first:border-l-0
  `
  const recBgClass = `
    md:p-6
    md:bg-grayBlue-50
    md:rounded-lg
  `

  return (
    datas.map((item, index) => (
      <div key={index} className={`${cn(`mt-3 lg:mt-4 first:mt-0
        flex w-full
        items-start justify-between
        text-xs sm:text-sm
        text-left md:text-center md:text-base
        `, item.mainTitle && 'flex-wrap')}
      `}>
        {item.mainTitle && (
          <p className='w-full pb-3 mb-5 text-left border-b'><b>{item.mainTitle}</b></p>
        )}
        <p className={` text-gray-500 `}>
          {item.title}
        </p>
        <div className='text-right'>
          <p className={``}>
            <b>
            {item.value}
            </b>
          </p>
          <p className='font-light text-2xs lg:text-md'>{item.text}</p>
        </div>
      </div>
    ))
  )
}