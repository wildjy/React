
import React, { useState } from 'react';

interface AccordionProps {
  children: React.ReactNode;
}

interface ChildProps  {
  openValue?: boolean;
  eventToggle?: () => void;
}

interface AccordionTypes extends React.FC<AccordionProps> {
  top: typeof AccordionTop;
  bottom: typeof AccordionBottom;
}

interface AccordionItemProps {
  children: React.ReactNode;
  openValue?: boolean;
  eventToggle?: () => void;
}

interface AccordionTopProps {
  children: React.ReactNode;
  openValue?: boolean;
  eventToggle?: () => void;
}

interface AccordionBottomProps {
  children: React.ReactNode;
  openValue?: boolean;
}

const Accordion: AccordionTypes & { Item: React.FC<AccordionProps>; } = ({ children }) => {
  return (
    <>
      <div className="accordion">
        { children }
      </div>
    </>
  )
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, openValue, eventToggle }) => {
  return (
    <>
      <div className="accd-item">
        {
          React.Children.map(children, (child) => {
            if (!React.isValidElement<ChildProps>(child)) return child;

            return React.cloneElement(child, { openValue, eventToggle })
          })
        }
      </div>
    </>
  )
}

const AccordionTop: React.FC<AccordionTopProps> = ({ children, openValue, eventToggle }) => {
  return (
    <>
      <div className={`accd-top ${openValue ? 'active' : ''}`} onClick={eventToggle}>
        { children }
      </div>
    </>
  )
}

const AccordionBottom: React.FC<AccordionBottomProps> = ({ children, openValue }) => {
  return (
    <>
      {openValue ? (
        <div className={`accd-bottom ${openValue ? 'bg-gray-100' : ''}`}>
        { children }
        </div>
      ) : null}
    </>
  )
}

Accordion.Item = ({ children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleEvent = () => {
    setIsOpen((prevValue) => {
      console.log(prevValue)
      return !prevValue
    });
  }

  return (
    <>
      <AccordionItem openValue={isOpen} eventToggle={toggleEvent}>
        { children }
      </AccordionItem>
    </>
  )
}

Accordion.top = AccordionTop;
Accordion.bottom = AccordionBottom;

export default Accordion;