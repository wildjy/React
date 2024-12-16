
"use client";
import React from 'react';
import Accordion from "../../sharedUI/Accordion/Accordion";
import AccordionOne from '../../sharedUI/Accordion/AccordionOne';

const AccordionPage = () => {
  return (
    <>
      <Accordion>
        <Accordion.Item>
          <Accordion.Top addClass='px-6'>
          아코디언.Top1
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom1
          </Accordion.Bottom>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Top icon="arrow">
          아코디언.Top2
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom2
          </Accordion.Bottom>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Top icon="plus">
          아코디언.Top3
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom3
          </Accordion.Bottom>
        </Accordion.Item>
      </Accordion>

      <AccordionOne>
        <AccordionOne.Item>
          <AccordionOne.Top>
            top..1
          </AccordionOne.Top>
          <AccordionOne.Bottom>
            bottom..1
            <AccordionOne>
              <AccordionOne.Item>
                <AccordionOne.Top>
                  Sub top..1
                </AccordionOne.Top>
                <AccordionOne.Bottom>
                  bottom..1
                </AccordionOne.Bottom>
              </AccordionOne.Item>
              <AccordionOne.Item>
                <AccordionOne.Top>
                  Sub top..2
                </AccordionOne.Top>
                <AccordionOne.Bottom>
                  bottom..2
                </AccordionOne.Bottom>
              </AccordionOne.Item>
              <AccordionOne.Item>
                <AccordionOne.Top>
                  Sub top..3
                </AccordionOne.Top>
                <AccordionOne.Bottom>
                  bottom..3
                </AccordionOne.Bottom>
              </AccordionOne.Item>
            </AccordionOne>
          </AccordionOne.Bottom>
        </AccordionOne.Item>

        <AccordionOne.Item>
          <AccordionOne.Top>
            top..2
          </AccordionOne.Top>
          <AccordionOne.Bottom>
            bottom..2
          </AccordionOne.Bottom>
        </AccordionOne.Item>
      </AccordionOne>
    </>
  )
}

export default AccordionPage;