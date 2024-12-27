import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

interface AccordionContextProps {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  motion?: boolean | string;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if(!context) {
    throw new Error('error');
  }
  return context;
}

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
interface AccordionProps {
  children?: React.ReactNode;
  index?: number;
  motion?: boolean | string;
}

interface ChildProps {
  index: number | null;
  motion: boolean | string;
}

interface AccordionType extends React.FC<AccordionProps> {
  Item: typeof AccdOneItem;
  Top: typeof AccdOneTop;
  Bottom: typeof AccdOneBottom;
}

interface AccdOneItemProps {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}

interface AccdOneTopProps extends VariantProps<typeof AccordionVariants> {
  children?: React.ReactNode;
  index?: number | null;
  addClass?: string;
}

interface AccdOneBottomProps {
  children?: React.ReactNode;
  index?: number;
}

const AccordionOne: AccordionType = ({ children, motion }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <AccordionContext.Provider value={{ openIndex, setOpenIndex, motion }}>
        <div className='Accordion'>
          {
            React.Children.map(children, (child, index) => {
              return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
            })
          }
        </div>
      </AccordionContext.Provider>
    </>
  )
}

const AccdOneItem: React.FC<AccdOneItemProps> = ({ children, addClass, index }) => {
  return (
    <>
      <div className={`Item first:border-t border-b border-gray-300 ${cn(addClass)}`}>
        {
          React.Children.map(children, (child) => {
            return (
              React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child
            );
          })
        }
      </div>
    </>
  )
}

const AccdOneTop: React.FC<AccdOneTopProps> = ({ children, icon, addClass, index = null, ...props }) => {
  const { openIndex, setOpenIndex } = useAccordionContext();

  const className = AccordionVariants({
    icon: icon as 'base' | 'plus' | 'arrow' | 'none' | undefined,
  })

  const EventOpen = () => {
    setOpenIndex(openIndex === index ? null : index);
  }

  const atArrow = icon === "plus";

  return (
    <>
      <div className={`Top ${cn(className, addClass)}
        ${openIndex === index ? atArrow ? 'after:-rotate-45' : 'font-bold text-blue-700 after:-rotate-180' : ''}
        `}
        onClick={EventOpen}
        {...props}
        >
        { children }
      </div>
    </>
  )
}

const AccdOneBottom: React.FC<AccdOneBottomProps> = ({ children, index }) => {
  const { openIndex, motion } = useAccordionContext();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const childObj = bottomRef.current;

    const resizeObserver = new ResizeObserver(() => {
      if (childObj) {
        setHeight(openIndex === index ? childObj.scrollHeight + childObj.scrollHeight : 0);
      }
    });

    if (childObj) {
      resizeObserver.observe(childObj);
    }

    return () => {
      if (childObj) resizeObserver.unobserve(childObj);
    };
  }, [openIndex === index ]);

  return (
    <>
      <div ref={bottomRef}
        style={{ maxHeight: motion ? `${height}px` : "" }}
        className={`Bottom overflow-hidden ease-in-out border-gray-300 bg-gray-100
          ${motion ? `transition-max-h duration-300` : ''}
          ${openIndex === index ? 'max-h-auto border-t' : 'max-h-0'}
      `}>
      { children }
      </div>
    </>
  )
}

AccordionOne.Item = AccdOneItem;
AccordionOne.Top = AccdOneTop;
AccordionOne.Bottom = AccdOneBottom;

export default AccordionOne;