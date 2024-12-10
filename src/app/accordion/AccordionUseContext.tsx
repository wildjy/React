import React, { useState, createContext, useContext } from 'react';


const AccdContext = createContext<{ isOpen: boolean; openEvent: () => void } | undefined>(undefined);

function useAccdContext() {
  return useContext(AccdContext);
}

interface accordionOneProps {
  children: React.ReactNode;
}

interface accordionOneType extends React.FC<accordionOneProps> {
  item: typeof AccordionOneItem;
  top: typeof AccordionOneTop;
  bottom: typeof AccordionOneBottom;
}

interface accordionOneItemProps {
  children: React.ReactNode;
}

interface accordionOneTopProps {
  children: React.ReactNode;
}

interface accordionOneBottomProps {
  children: React.ReactNode;
}

const AccordionOne: accordionOneType = ({ children }) => {
  return (
    <>
      <div className='accordionOne'>
        { children }
      </div>
    </>
  )
}

const AccordionOneItem: React.FC<accordionOneItemProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openEvent = () => {
    setIsOpen((prevValue) => {
      console.log(prevValue)
      return !prevValue;
    });
  }

  return (
    <>
      <AccdContext.Provider value={{ isOpen, openEvent}}>
        <div className='accdOne-item'>
          { children }
        </div>
      </AccdContext.Provider>
    </>
  )
}

const AccordionOneTop: React.FC<accordionOneTopProps> = ({ children }) => {
  const context = useAccdContext();

  if (!context) {
    throw new Error("Accordion.Header must be used within an Accordion.Item");
  }

  return (
    <>
      <div className='accdOne-top' onClick={context.openEvent}>
        { children }
      </div>
    </>
  )
}

const AccordionOneBottom: React.FC<accordionOneBottomProps> = ({ children }) => {
  const context = useAccdContext();

  if (!context) {
    throw new Error("Accordion.Header must be used within an Accordion.Item");
  }

  return (
    <>
      { context.isOpen ? (
        <div className='accdOne-bottom'>
        { children }
        </div>
      ) : null}
    </>
  )
}

AccordionOne.item = AccordionOneItem;
AccordionOne.top = AccordionOneTop;
AccordionOne.bottom = AccordionOneBottom;

export default AccordionOne;