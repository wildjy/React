'use client';
import React, { ReactNode } from 'react';

interface ReportContentsProps {
  addClass?: string;
  children?: ReactNode;
}

export const ReportContents: React.FC<ReportContentsProps> = ({ children, addClass }) => {
  const slots = React.Children.toArray(children);

  return (
    <div>
      {slots.length > 0 ? (
        slots.map((slot, index) => {
          if (React.isValidElement<{ className?: string; children?: ReactNode }>(slot) && slot.props?.children) {
            return (
              <div key={index} className={addClass}>
                {React.Children.map(slot.props.children, (child) => {
                  if (
                    React.isValidElement<{ className?: string; children?: ReactNode }>(child) &&
                    child.props.className?.includes('reportTitle')
                  ) {
                    return React.cloneElement(child, {
                      children: (
                        <b
                          className={`
                          mt-8 mb-7
                          flex items-center gap-3 text-base text-blue-800 sm:text-xl md:text-2xl
                          `}
                        >
                          <span
                            className={`flex items-center justify-center
                            w-7 h-7 sm:w-[1.875rem] sm:h-[1.875rem] xl:w-[2.125rem] xl:h-[2.125rem]
                            text-sm sm:text-md xl:text-lg
                            text-white text-center
                            bg-blue-800 rounded-full
                            `}
                          >
                            0{index + 1}
                          </span>
                          {child.props.children}
                        </b>
                      ),
                    });
                  }
                  return child;
                })}
              </div>
            );
          }
          return <div key={index}>{slot}</div>;
        })
      ) : (
        <div>No data.</div>
      )}
    </div>
  );
};
