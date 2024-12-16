import React, { useState, createContext, useContext} from 'react';

interface AccordionContextProps {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}
const AccordionContext = createContext<AccordionContextProps | null>(null);

interface AccordionProps {
  children?: React.ReactNode;
  index?: number;
}

interface ChildProps {
  index: number | null;
}

interface AccordionType extends React.FC<AccordionProps> {
  Item: typeof AccdOneItem;
  Top: typeof AccdOneTop;
  Bottom: typeof AccdOneBottom;
}

interface AccdOneItemProps {
  children?: React.ReactNode;
  index?: number;
}

interface AccdOneTopProps {
  children?: React.ReactNode;
  index?: number | null;
}

interface AccdOneBottomProps {
  children?: React.ReactNode;
  index?: number;
}

const AccordionOne: AccordionType = ({ children }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
        <div className='Accordion'>
          {
            React.Children.map(children, (child, index) => {
              console.log(index)
              return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
            })
          }
        </div>
      </AccordionContext.Provider>
    </>
  )
}

const AccdOneItem: React.FC<AccdOneItemProps> = ({ children, index }) => {
  return (
    <>
      <div className='Item'>
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

const AccdOneTop: React.FC<AccdOneTopProps> = ({ children,  index = null }) => {
  const context = useContext(AccordionContext);
  if(!context) {
     throw new Error('error');
  }

  const { openIndex, setOpenIndex } = context;

  const EventOpen = () => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <>
      <div className={`top ${openIndex === index ? 'active' : ''}`} onClick={EventOpen}>
        { children }
      </div>
    </>
  )
}

const AccdOneBottom: React.FC<AccdOneBottomProps> = ({ children, index }) => {
  const context = useContext(AccordionContext);
  if(!context) {
    throw new Error('Error');
  }

  const { openIndex } = context;

  return (
    <>
      <div className={`Bottom ${openIndex === index ? 'block' : 'hidden'}`}>
      { children }
      </div>
    </>
  )
}

AccordionOne.Item = AccdOneItem;
AccordionOne.Top = AccdOneTop;
AccordionOne.Bottom = AccdOneBottom;

export default AccordionOne;