import React from "react";

// import "./button.css";

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: "small" | "medium" | "large";
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "bg-blue-500 text-white"
    : "shadow-inner bg-transparent text-gray-800";

  let classNameSize = "px-5 py-3 text-sm";
  if (size === "small") {
    classNameSize = "px-4 py-2 text-xs";
  } else if (size === "large") {
    classNameSize = "px-6 py-3 text-base";
  } else if (size === "medium") {
    classNameSize = "px-5 py-3 text-sm";
  }

  return (
    <button
      type="button"
      className={[
        "inline-block cursor-pointer border-0 rounded-full font-bold leading-none font-sans",
        classNameSize,
        mode,
      ].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
