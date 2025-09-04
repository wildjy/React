'use client';
import { cn } from "../common/cn";

interface BatteryProps {
  value?: number | null;
  color?: string;
  addClass?: string;
}

export function setBgColor(value: number, color: string) {
  const v = Number(value);
  if (v < 3) return '#F5948E';
  if (v < 5) return '#8BD58B';
  if (v < 7) return '#6CC9F5';
  if (v === 10) return 'transparent';
  return color;
}

export const Battery: React.FC<BatteryProps> = ({
  value = 0,
  color,
  addClass,
}) => {
  return (
    <div
      className={`
      ${cn(
        'w-[2.4375rem] h-[1.3125rem] sm:w-[3.0625rem] sm:h-7 md:w-[3.5rem] md:h-[2rem] relative bg-no-repeat bg-contain',
        addClass,
        value === 10
          ? 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_battery_rock.svg")]'
          : 'bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_battery_bg.svg")]'
      )}
    `}
    >
      <div
        className={`absolute
        start-[0.125rem] end-[0.4375rem] top-[0.125rem] bottom-[0.125rem]
        sm:start-1 sm:end-[0.4375rem] sm:top-1 sm:bottom-1
        flex overflow-hidden
      `}
      >
        <div
          className={`h-full rounded-[0.1875rem]`}
          style={{
            width: `${Math.min(100, (value || 0) / 9) * 100}%`,
            backgroundColor: color
              ? color
              : setBgColor(value || 0, color || '#6C82F5'),
          }}
        ></div>
      </div>
      <div
        className={`
          flex justify-center
          absolute top-1/2 -translate-y-1/2 left-0 right-[0.35rem]
          text-2xs sm:text-sm md:text-md
        `}
        style={{
          textShadow:
            '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
        }}
      >
        {value === 10 ? '' : value + '칸'}
      </div>
    </div>
  );
};
