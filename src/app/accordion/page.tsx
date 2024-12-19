
"use client";
import React, { useState } from 'react';
import Accordion from "../../sharedUI/Accordion/Accordion";
import AccordionOne from '../../sharedUI/Accordion/AccordionOne';
import LayerPopup from "../../sharedUI/LayerPopup/LayerPopup";

const AccordionPage = () => {

  const [isOpenPopup, setIsOpenPopup] = useState<{[key: string]: boolean}>({
    popup1: false,
  });

  const OpenEventPopup = (key: string) => {
    setIsOpenPopup((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  }

  return (
    <>
      <Accordion motion={false}>
        <Accordion.Item>
          <Accordion.Top size="sm">
          아코디언.Top1
          </Accordion.Top>
          <Accordion.Bottom addClass="bg-white">
            <Accordion motion={true}>
              <Accordion.Item addClass='first:border-t-0'>
                <Accordion.Top>
                아코디언 Sub .Top1
                </Accordion.Top>
                <Accordion.Bottom>
                  <Accordion motion={true}>
                    <Accordion.Item addClass='first:border-t-0'>
                      <Accordion.Top>
                      아코디언 Sub333 .Top1
                      </Accordion.Top>
                      <Accordion.Bottom addClass='bg-white'>
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                        아코디언 Sub33 .Bottom1<br />
                      </Accordion.Bottom>
                    </Accordion.Item>
                    <Accordion.Item addClass='border-b-0'>
                      <Accordion.Top>
                      아코디언 Sub33 .Top2
                      </Accordion.Top>
                      <Accordion.Bottom addClass='bg-white'>
                        아코디언 Sub33 .Bottom2<br />
                        아코디언 Sub33 .Bottom2<br />
                        아코디언 Sub33 .Bottom2
                      </Accordion.Bottom>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Bottom>
              </Accordion.Item>
              <Accordion.Item addClass='border-b-0'>
                <Accordion.Top>
                아코디언 Sub .Top2
                </Accordion.Top>
                <Accordion.Bottom>
                  아코디언 Sub .Bottom2<br />
                  아코디언 Sub .Bottom2<br />
                  아코디언 Sub .Bottom2
                </Accordion.Bottom>
              </Accordion.Item>
            </Accordion>
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top size="lg" icon="arrow">
          아코디언.Top2
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom2<br />
          아코디언.Bottom2<br />
          아코디언.Bottom2
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top icon="arrow">
          아코디언.Top2
          </Accordion.Top>
          <Accordion.Bottom>
          아코디언.Bottom2<br />
          아코디언.Bottom2<br />
          아코디언.Bottom2
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          아코디언.Bottom1<br />
          </Accordion.Bottom>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Top icon="plus">
          아코디언.Top3
          </Accordion.Top>
          <Accordion.Bottom>

            <button type="button"
              onClick={() => OpenEventPopup('popup1')}
              className='inline-block py-3 w-[12rem] text-center border border-blue-700 rounded'>팝업(default) 열기
            </button>

            <LayerPopup align="center" isOpen={isOpenPopup.popup1} OpenEvent={() => OpenEventPopup('popup1')}>
              <LayerPopup.Header>
                <p className="text-4xl"><b>Header</b></p>
              </LayerPopup.Header>

              <LayerPopup.Body>
                <div className='h-[10rem]'>
                  <p className="text-xl">
                    Body..
                  </p>
                  <p>
                    컨텐츠가 박스 밖으로 넘치지 않는 한에서 박스가 가질 수 있는 가장 작은 크기를 말한다.
                  </p>
                </div>
              </LayerPopup.Body>

              <LayerPopup.Footer>
                <div className='flex justify-center'>
                  <a href="#self" className='py-3 w-10 text-center border border-blue-700 rounded'>Footer</a>
                </div>
              </LayerPopup.Footer>
            </LayerPopup>
          </Accordion.Bottom>
        </Accordion.Item>
      </Accordion>

      <div className='h-10'></div>

      <AccordionOne>
        <AccordionOne.Item>
          <AccordionOne.Top icon="plus">
            top..1
          </AccordionOne.Top>
          <AccordionOne.Bottom>
            <AccordionOne motion={true}>
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