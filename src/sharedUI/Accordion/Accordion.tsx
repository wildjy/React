import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext} from 'react';

const AccordionVariants = cva('first:border-t border-b border-gray-300', {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      color: {
        base: '',

      }
    },
    defaultVariants: {
      size: 'md',
      color: 'base',
    }
  }
)

const AccordionTopVariants = cva(`
    hover:font-bold
    cursor-pointer
    relative
    after:absolute
    after:top-center
    after:right-4
    after:content-[""]
    after:w-[1.25rem]
    after:h-[1.25rem]
    after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
    after:bg-center
    after:bg-[length:1.25rem_1.25rem]
    after:bg-no-repeat
    after:transition-all
    after:duration-300
  `, {
    variants: {
      size: {
        sm: 'py-3 ',
        md: 'px-4 py-4 ',
        lg: '',
      },
      icon: {
        base: 'carot  ',
        plus: 'plus after:bg-[length:100%_100%] after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_plus.svg")]',
        arrow: 'arrow after:-rotate-90',
        none: '',
      },
    },
    defaultVariants: {
      size: 'md',
      icon: 'base',
    }
  }
)
interface AccordionContextProps {
  isOpen: boolean;
  EventOpen: () => void;
}
const AccordionContext = createContext<AccordionContextProps | null>(null);

interface AccordionProps {
  children?: React.ReactNode;
}

interface AccordionType extends React.FC<AccordionProps> {
  Item: typeof AccdItem;
  Top: typeof AccdTop;
  Bottom: typeof AccdBottom;
}

interface AccdItemProps extends VariantProps<typeof AccordionVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

interface AccdTopProps extends VariantProps<typeof AccordionTopVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

interface AccdBottomProps {
  children?: React.ReactNode;
}

const Accordion: AccordionType = ({ children }) => {

  return (
    <>
      <div className="accordion">
        { children }
      </div>
    </>
  )
}

const AccdItem: React.FC<AccdItemProps> = ({ children, size, color, addClass, ...props }) => {
  const className = AccordionVariants({
    size: size as 'sm' | 'md' | 'lg' | undefined,
    color: color as 'base' | undefined,
  })

  const [isOpen, setIsOpen] = useState(false);
  const EventOpen = () => {
    setIsOpen((prevOpen) => {
      return !prevOpen
    });
  }

  return (
    <>
      <AccordionContext.Provider value={{ isOpen, EventOpen }}>
        <div className={`Item ${cn(className, addClass)}`}>
          { children }
        </div>
      </AccordionContext.Provider>
    </>
  )
}

const AccdTop: React.FC<AccdTopProps> = ({ children, icon, addClass, ...props }) => {
  const context = useContext(AccordionContext);
  if(!context) {
     throw new Error('error');
  }

  const className = AccordionTopVariants({
    icon: icon as 'base' | 'plus' | 'arrow' | 'none' | undefined,
  })

  const atArrow = icon === "plus";

  return (
    <>
      <div className={`Top ${cn(className, addClass)} ${context.isOpen ? 'font-bold text-blue-700 after:-rotate-180' : atArrow ? 'bg-red-600 after:-rotate-45' : ''}`} onClick={context.EventOpen}>
        { children }
      </div>
    </>
  )
}

const AccdBottom: React.FC<AccdBottomProps> = ({ children }) => {
  const context = useContext(AccordionContext);
  if(!context) {
    throw new Error('Error');
  }

  return (
    <>
      <div className={`Bottom ${context.isOpen ? 'block' : 'hidden'} border-t border-gray-300 bg-gray-100`}>
      { children }
      </div>
    </>
  )
}

Accordion.Item = AccdItem;
Accordion.Top = AccdTop;
Accordion.Bottom = AccdBottom;

export default Accordion;