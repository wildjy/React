"use client";
import Tab from '../../sharedUI/Tab/Tab';
import AccordionOne from '../../sharedUI/Accordion/AccordionOne'

const TabPage = () => {

  return (
    <>
      <Tab initTab={2} modeType="type1" addClass="mt-5 ml-5">
        <Tab.List addClass="p-3 border">
          <Tab.Button addClass="text-red-300">국수영한한</Tab.Button>
          <Tab.Button>사회탐구</Tab.Button>
          <Tab.Button>과학탐구</Tab.Button>
        </Tab.List>
        <Tab.ContentView addClass="mt-5 p-5 bg-gray-300">
          <Tab.Contents addClass="mt-5 p-5 bg-white">

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

          </Tab.Contents>
          <Tab.Contents>11</Tab.Contents>
          <Tab.Contents>
            <div className='bg-gray-200'>
              22
            </div>
          </Tab.Contents>
        </Tab.ContentView>
      </Tab>

      <Tab initTab={1} modeType="type2" addClass="mt-5 ml-5">
        <Tab.List>
          <Tab.Button>1학년</Tab.Button>
          <Tab.Button>2학년</Tab.Button>
          <Tab.Button>3학년</Tab.Button>
        </Tab.List>
        <Tab.ContentView>
          <Tab.Contents>
            00
          </Tab.Contents>
          <Tab.Contents>11</Tab.Contents>
          <Tab.Contents>22</Tab.Contents>
        </Tab.ContentView>
      </Tab>

      <Tab initTab={0} modeType="type3" addClass="mt-5 ml-5">
        <Tab.List>
          <Tab.Button>국수영한한</Tab.Button>
          <Tab.Button>사회탐구</Tab.Button>
          <Tab.Button>과학탐구</Tab.Button>
        </Tab.List>
        <Tab.ContentView>
          <Tab.Contents>
            00
          </Tab.Contents>
          <Tab.Contents>11</Tab.Contents>
          <Tab.Contents>22</Tab.Contents>
        </Tab.ContentView>
      </Tab>
    </>
  )
}

export default TabPage;