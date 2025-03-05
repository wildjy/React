
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useEffect, createContext, useContext } from 'react';

interface ToggleContextProps {
  isOpen: boolean;
  EventOpen: () => void;
  size: string;
  align: string;
  icon: string;
}

const ToggleContext = createContext<ToggleContextProps | null>(null);

const useToggleContext = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
};

// after:w-[1.25rem]
// after:h-[1.25rem]
// after:bg-[length:1.25rem_1.25rem]
const ToggleBoxTopVariants = cva(
  `pr-9 relative cursor-pointer
  after:right-[0.6rem] after:w-[0.75rem] after:h-[0.75rem]
  md:after:right-[0.75rem]
  lg:after:right-[1rem] lg:after:w-[1rem] lg:after:h-[1rem]
  after:bg-[length:100%_100%]
  after:absolute after:top-[50%] after:transform after:-translate-y-1/2 after:right-4
  after:content-[""]
  after:bg-center
  after:bg-no-repeat
  after:transition-all
  after:duration-300
`,
  {
    variants: {
      size: {
        sm: `pl-3 py-2 text-2xs sm:text-sm`,
        md: `pl-4 py-3 text-xs sm:text-md`,
        lg: `pl-5 py-4 text-lg`,
      },
      align: {
        left: `text-left`,
        center: `text-center`,
        right: `text-right`,
      },
      icon: {
        none: '',
        default: `
          after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
        `,
        plus: `
          after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_plus.svg")]
        `,
      },
    },
  }
);

interface ToggleBoxProps {
  isOpen?: boolean;
  EventOpen?: () => void;
  children?: React.ReactNode;
  size?: string;
  align?: string;
  icon?: string;
  addClass?: string;
  topAddClass?: string;
  bottomAddClass?: string;
}

interface ToggleBoxTypes extends React.FC<ToggleBoxProps> {
  Top: typeof ToggleBoxTop;
  Bottom: typeof ToggleBoxBottom;
}

interface ToggleBoxTopProps extends VariantProps<typeof ToggleBoxTopVariants> {
  children?: React.ReactNode;
  onClick?: () => void;
  EventOpen?: () => void;
  addClass?: string;
  activeClass?: string;
}

interface ToggleBoxBottomProps {
  children?: React.ReactNode;
  addClass?: string;
  activeClass?: string;
}

const ToggleBox: ToggleBoxTypes = ({ isOpen: outIsOpen, size = 'md', align = 'left', icon = 'default', children, addClass }) => {
  const [isOpen, setIsOpen] = useState(outIsOpen || false);

  useEffect(() => {
    setIsOpen(outIsOpen || false);
  }, [outIsOpen]);

  const eventToggle = () => {
    setIsOpen(() => !isOpen);
  };

  return (
    <ToggleContext.Provider value={{ size, align, icon, isOpen: isOpen, EventOpen: eventToggle }}>
      <div className={`${cn(`toggleBox bg-white`, addClass, { active: isOpen })}`}>{children}</div>
    </ToggleContext.Provider>
  );
};

const ToggleBoxTop: React.FC<ToggleBoxTopProps> = ({ children, addClass, activeClass, onClick }) => {
  const { size, align, icon, isOpen, EventOpen } = useToggleContext();

  const className = ToggleBoxTopVariants({
    size: size as 'sm' | 'md' | 'lg' | undefined,
    align: align as 'left' | 'center' | 'right' | undefined,
    icon: icon as 'default' | 'plus' | undefined,
  });

  const atArrow = icon === 'plus';

  return (
    <div
      className={cn(
        className,
        addClass,
        isOpen && `${activeClass} after:-rotate-180`,
        isOpen && atArrow && `${activeClass} after:-rotate-45`
      )}
      onClick={onClick || EventOpen}
    >
      {children}
    </div>
  );
};

const ToggleBoxBottom: React.FC<ToggleBoxBottomProps> = ({ children, addClass, activeClass }) => {
  const { isOpen } = useToggleContext();

  return (
    <div className={`${cn('h-0 overflow-hidden', '', isOpen && `h-auto ${activeClass}`)}`}>
      <div className={cn(`p-4`, addClass)}>{children}</div>
    </div>
  );
};

ToggleBox.Top = ToggleBoxTop;
ToggleBox.Bottom = ToggleBoxBottom;

export default ToggleBox;
