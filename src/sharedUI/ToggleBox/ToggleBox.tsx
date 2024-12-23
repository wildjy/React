
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext } from 'react';

interface ToggleContextProps {
  // align: 'left' | 'center' | 'right';
  isOpen: boolean;
  EventOpen: () => void;
}

const ToggleContext = createContext<ToggleContextProps | null>(null);

const useToggleContext = () => {
  const context = useContext(ToggleContext);
  if(!context) {
    throw new Error('error');
  }
  return context;
}

const ToggleBoxTopVariants = cva(`pr-9 relative cursor-pointer
  after:w-[1.25rem]
  after:h-[1.25rem]
  after:bg-[length:1.25rem_1.25rem]
  after:absolute after:top-center after:right-4
  after:content-[""]
  after:bg-center
  after:bg-no-repeat
  after:transition-all
  after:duration-300
`,
  {
    variants: {
      size: {
        sm: `pl-3 py-2 text-s`,
        md: `pl-4 py-3`,
        lg: `pl-5 py-4 text-lg`,
      },
      align: {
        left: `text-left`,
        center: `text-center`,
        right: `text-right`,
      },
      icon: {
        default: `
          after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
        `,
        plus: `
          after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_plus.svg")]`
      }
    },
    defaultVariants: {
      size: 'md',
      align: 'left',
      icon: 'default',
    }
  }
)

interface ToggleBoxProps {
  children?: React.ReactNode;
}


interface ToggleBoxTypes extends React.FC<ToggleBoxProps> {
  Top: typeof ToggleBoxTop;
  Bottom: typeof ToggleBoxBottom;
}

interface ToggleBoxTopProps extends VariantProps<typeof ToggleBoxTopVariants> {
  children?: React.ReactNode;
  EventOpen?: () => void;
  addClass?: string;
}

interface ToggleBoxBottomProps {
  children?: React.ReactNode;
  addClass?: string;
}

const ToggleBox: ToggleBoxTypes = ({ children }) => {
  const [isOpen, setIsIOpen] = useState(false);
  const EventOpen = () => {
    setIsIOpen((prevOpen) => !prevOpen);
  }

  return (
    <>
      <ToggleContext.Provider value={{ isOpen, EventOpen }}>
        <div className={`${isOpen ? 'active': ''} toggleBox border rounded-lg`}>
          { children }
        </div>
      </ToggleContext.Provider>
    </>
  )
};

const ToggleBoxTop: React.FC<ToggleBoxTopProps> = ({ children, addClass, size, align, icon }) => {
  const { isOpen, EventOpen } = useToggleContext();

  const className = ToggleBoxTopVariants({
    size: size as 'sm' | 'md' | 'lg' | undefined,
    align: align as 'left' | 'center' | 'right' | undefined,
    icon: icon as 'default' | 'plus' | undefined,
  })

  const atArrow = icon === "plus";

  return (
    <>
      <div className={`${cn(className, addClass, {
        'font-bold text-blue-700 after:-rotate-180': isOpen,
        'font-bold text-blue-700 after:-rotate-45': isOpen && atArrow,
      })} `} onClick={EventOpen}>
        { children }
      </div>
    </>
  )
}

const ToggleBoxBottom: React.FC<ToggleBoxBottomProps> = ({ children, addClass }) => {
  const { isOpen } = useToggleContext();

  return (
    <>
      <div className={`${cn('h-0 overflow-hidden', '', {
        'h-auto': isOpen,
      })}`}>
        <div className={cn(`px-4 pb-3`, addClass)}>
          { children }
        </div>
      </div>
    </>
  )
}

ToggleBox.Top = ToggleBoxTop;
ToggleBox.Bottom = ToggleBoxBottom;

export default ToggleBox;