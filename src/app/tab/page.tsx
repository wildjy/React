"use client";
import Tab from '../../sharedUI/Tab/Tab';
import AccordionOne from '../../sharedUI/Accordion/AccordionOne'

const TabPage = () => {
  const tabConfig = {
    tab1: [
      { label: 'tab0', value: '0' },
      { label: 'tab1', value: '1' },
      { label: 'tab2', value: '2' },
    ],
    tab2: [
      { label: 'tab2_0', value: '0' },
      { label: 'tab2_1', value: '1' },
      { label: 'tab2_2', value: '2' },
    ],
  };

  return (
    <>
      <Tab initTab={0}> {/*  TabProps={tabConfig.tab1} */}
        <Tab.List>
          <Tab.Button>tab0</Tab.Button>
          <Tab.Button>tab1</Tab.Button>
          <Tab.Button>tab2</Tab.Button>
        </Tab.List>
        <Tab.ContentView>
          <Tab.Contents>

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
          <Tab.Contents>22</Tab.Contents>
        </Tab.ContentView>
      </Tab>
    </>
  )
}

export default TabPage;