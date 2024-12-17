import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext} from 'react';

const AccordionVariants = cva(` hover:font-bold cursor-pointer relative
    after:w-[1.25rem]
    after:h-[1.25rem]
    after:bg-[length:1.25rem_1.25rem]
    after:absolute after:top-center after:right-4
    after:content-[""]
    after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
    after:bg-center
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
        base: 'carot',
        plus: 'plus after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_plus.svg")]',
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
  motion?: boolean | string;
}

interface ChildProps {
  motion: boolean | string;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

interface AccordionProps {
  children?: React.ReactNode;
  motion?: boolean;
}

interface AccordionType extends React.FC<AccordionProps> {
  Item: typeof AccdItem;
  Top: typeof AccdTop;
  Bottom: typeof AccdBottom;
}

interface AccdItemProps {
  children?: React.ReactNode;
  addClass?: string;
  motion?: boolean | string;
}

interface AccdTopProps extends VariantProps<typeof AccordionVariants> {
  children?: React.ReactNode;
  addClass?: string;
}

interface AccdBottomProps {
  children?: React.ReactNode;
  addClass?: string;
}

const Accordion: AccordionType = ({ children, motion }) => {

  return (
    <>
      <div className="accordion">
        {
          React.Children.map(children, (child) => {
            return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { motion }) : child;
          })
        }
      </div>
    </>
  )
}

const AccdItem: React.FC<AccdItemProps> = ({ children, addClass, motion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const EventOpen = () => {
    setIsOpen((prevOpen) => {
      return !prevOpen
    });
  }

  return (
    <>
      <AccordionContext.Provider value={{ isOpen, EventOpen, motion }}>
        <div className={`Item first:border-t border-b border-gray-300 ${cn(addClass)}`}>
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

  const className = AccordionVariants({
    icon: icon as 'base' | 'plus' | 'arrow' | 'none' | undefined,
  })

  const atArrow = icon === "plus";

  return (
    <>
      <div className={`Top ${cn(className, addClass)}
        ${context.isOpen ? atArrow ? 'after:-rotate-45' : 'font-bold text-blue-700 after:-rotate-180' : ''}
        `} onClick={context.EventOpen}
      >
        { children }
      </div>
    </>
  )
}

const AccdBottom: React.FC<AccdBottomProps> = ({ children, addClass }) => {
  const context = useContext(AccordionContext);
  if(!context) {
    throw new Error('Error');
  }

  const { isOpen, motion } = context;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const childObj = bottomRef.current;

    const resizeObserver = new ResizeObserver(() => {
      if (childObj) {
        setHeight(isOpen ? childObj.scrollHeight + childObj.scrollHeight : 0);
      }
    });

    if (childObj) {
      resizeObserver.observe(childObj);
    }

    return () => {
      if (childObj) resizeObserver.unobserve(childObj);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={bottomRef}
        style={{ maxHeight: motion ? `${height}px` : "" }}
        className={`Bottom overflow-hidden ease-in-out border-gray-300 bg-gray-100
          ${motion ? `transition-max-h duration-300` : ''}
          ${isOpen ? `max-h-auto border-t` : 'max-h-0'} ${cn(addClass)}`}
        >
        { children }
      </div>
    </>
  )
}

Accordion.Item = AccdItem;
Accordion.Top = AccdTop;
Accordion.Bottom = AccdBottom;

export default Accordion;