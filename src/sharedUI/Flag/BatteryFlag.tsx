
interface BatteryFlagProps {
  value: number;
}

export const BatteryFlag: React.FC<BatteryFlagProps> = ({
  value,
}) => {
  const filledCount = Math.round(value);

  return (
    <div className={`
      p-[0.375rem] pr-[0.7813rem] mt-6 md:mt-3 mb-6
      w-[9.1875rem] h-[4.8125rem]
      bg-[url("https://image.jinhak.com/jinhakImages/react/bg/battery_bg.svg")]
      bg-no-repeat
      bg-contain
      relative
    `}>
      <span className="absolute top-0 bottom-0 left-[4.375rem] border border-l border-dashed border-red-800">
        <span className="absolute -translate-x-1/2 w-[5rem] -bottom-6 left-1/2 text-3xs md:text-sm text-red-800 text-center ">
          최초 예상컷
        </span>
      </span>
      <ul className="flex w-full h-full gap-x-[0.1875rem]">
        {Array.from({ length: 10 }, (_, i) => (
          <li
            key={i}
            className={`
              w-[10%] h-full rounded-[0.125rem]
              ${i < filledCount ? "bg-[#72B1D7]" : "bg-gray-100"}
            `}
          />
        ))}
      </ul>
    </div>
  )
}