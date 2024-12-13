import React, {} from 'react';


interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionType extends React.FC<AccordionProps> {
  Item: typeof AccdItem;
}

interface AccdItemProps {
  children: React.ReactNode;
}

const Accordion: AccordionType = ({ children }) => {
  return (
    <>
      <div className='Accordion'>
        { children }
      </div>
    </>
  )
}

const AccdItem: React.FC<AccdItemProps> = ({ children }) => {
  return (
    <>
      <div className='Item'>
        { children }
      </div>
    </>
  )
}

Accordion.Item = AccdItem;

export default Accordion;