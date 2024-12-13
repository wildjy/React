
"use client";
import React from 'react';
import Accordion from './AccordionUseContext';
import AccordionOne from './AccordionOne';

const AccordionPage = () => {
  return (
    <>
      <div>
        <Accordion>
          <Accordion.Item>
            <Accordion.top>
              아코디언 top..11
            </Accordion.top>
            <Accordion.bottom>
              fgdgdfgdfgdfggsdgdg
              <img src="http://board.jinhak.com/BoardV1/Upload/JinhakMain/QuickMenu/high_icon_6(5).svg" alt="" />
            </Accordion.bottom>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.top>
              아코디언 top..22
            </Accordion.top>
            <Accordion.bottom>
              아코디언 bottom..22
            </Accordion.bottom>
          </Accordion.Item>
        </Accordion>
      </div>

      <div>
        <AccordionOne>
          <AccordionOne.item>
            <AccordionOne.top>
              top..1
            </AccordionOne.top>
            <AccordionOne.bottom>

              <AccordionOne>
                <AccordionOne.item>
                  <AccordionOne.top>
                    sub top..1
                  </AccordionOne.top>
                  <AccordionOne.bottom>
                  sub bottom..1
                  </AccordionOne.bottom>
                </AccordionOne.item>

                <AccordionOne.item>
                  <AccordionOne.top>
                    sub top..2
                  </AccordionOne.top>
                  <AccordionOne.bottom>
                  sub bottom..2
                  </AccordionOne.bottom>
                </AccordionOne.item>

              </AccordionOne>
            </AccordionOne.bottom>
          </AccordionOne.item>

          <AccordionOne.item>
            <AccordionOne.top>
              top..2
            </AccordionOne.top>
            <AccordionOne.bottom>
              bottom..2
            </AccordionOne.bottom>
          </AccordionOne.item>

          <AccordionOne.item>
            <AccordionOne.top>
              top..3
            </AccordionOne.top>
            <AccordionOne.bottom>
              bottom..3
            </AccordionOne.bottom>
          </AccordionOne.item>
        </AccordionOne>
      </div>
    </>
  )
}

export default AccordionPage;