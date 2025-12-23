// eslint-disable-next-line @nx/enforce-module-boundaries
import { cn } from "../common/cn";

export const Spinner = ({ width, height, addClass }: { width?: string; height?: string; addClass?: string }) => {
  const spinnerWidth = width ? `w-${width}` : '';
  const spinnerHeight = height ? `h-${height}` : '';

  return (
    <div className="flex items-center justify-center ">
      <div
        className={cn('border-4 border-blue-300 border-t-transparent rounded-full animate-spin', spinnerHeight, spinnerWidth, addClass)}
      ></div>
    </div>
  );
};
