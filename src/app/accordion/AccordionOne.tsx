import React, { useId, useState, createContext, useContext } from 'react';

interface AccdContextProps {
  openId: string | null;
  openEvent: (id: string) => void;
}

interface ChildProps {
  id: string | null;
}

const AccdContext = createContext<AccdContextProps | undefined>(undefined);

function useAccdContext() {
  const context = useContext(AccdContext);

  if (!context) {
    throw new Error("Accordion error");
  }

  return context;
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
  id?: string;
}

interface accordionOneBottomProps {
  children: React.ReactNode;
  id?: string;
}

const AccordionOne: accordionOneType = ({ children }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  // console.log(openId)
  const openEvent = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  }

  return (
    <>
      <AccdContext.Provider value={{ openId, openEvent }}>
        <div className='accordionOne'>
          { children }
        </div>
      </AccdContext.Provider>
    </>
  )
}

const AccordionOneItem: React.FC<accordionOneItemProps> = ({ children }) => {
  const id = useId();

  return (
    <>
      <div className='accdOne-item'>
        {
          React.Children.map(children, (child) => {
            if(!React.isValidElement<ChildProps>(child)) return child;

            return React.cloneElement(child, {id});
          })
        }
      </div>
    </>
  )
}

const AccordionOneTop: React.FC<accordionOneTopProps> = ({ children, id }) => {
  const context = useAccdContext();
  const { openId, openEvent } = context;

  return (
    <>
      <div className={`accdOne-top ${openId === id ? 'active' : ''}`} onClick={() => openEvent(id)}>
        { children }
      </div>
    </>
  )
}

const AccordionOneBottom: React.FC<accordionOneBottomProps> = ({ children, id }) => {
  const context = useAccdContext();
  const { openId } = context;

  return (
    <>
      { openId === id ? (
        <div className={`accdOne-bottom ${openId === id ? 'active' : ''}`}>
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