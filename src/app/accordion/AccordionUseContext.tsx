import React, { useState, createContext, useContext } from 'react';
interface AccdContextType {
  isOpen: boolean;
  openEvent: () => void
}

const AccdContext = createContext<AccdContextType | null>(null);

function useAccdContext() {
  return useContext(AccdContext);
}

interface accordionOneProps {
  children: React.ReactNode;
}

interface accordionOneType extends React.FC<accordionOneProps> {
  Item: typeof AccordionItem;
  top: typeof AccordionTop;
  bottom: typeof AccordionBottom;
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

const Accordion: accordionOneType = ({ children }) => {
  return (
    <>
      <div className='accordionOne'>
        { children }
      </div>
    </>
  )
}

const AccordionItem: React.FC<accordionOneItemProps> = ({ children }) => {
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

const AccordionTop: React.FC<accordionOneTopProps> = ({ children }) => {
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

const AccordionBottom: React.FC<accordionOneBottomProps> = ({ children }) => {
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

Accordion.Item = AccordionItem;
Accordion.top = AccordionTop;
Accordion.bottom = AccordionBottom;

export default Accordion;