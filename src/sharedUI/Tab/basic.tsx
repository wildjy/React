import React, { useState } from 'react';
interface TabType {
  TabProps: {label: string; value: string;}[];
  content: React.ReactNode;
};

const Tab: React.FC<TabType> = ({ TabProps }) => {
  const [currentTab, setContent] = useState(0);

  const EventTab = (index: number) => {
    setContent(index)
  }
  return (
    <>
      <div>
        <ul className='flex flex-wrap'>
          {
            TabProps.map((tab, index) => (
              <li key={index} value={tab.value} onClick={() => EventTab(index)} className='px-3 py-2 cursor-pointer'>{tab.label}</li>
            ))
          }
        </ul>

        <div>
          {currentTab === 0 && (
            <div>00</div>
          )}
          {currentTab === 1 && (
            <div>11</div>
          )}
        </div>
      </div>
    </>
  )
}

export default Tab;