import React, { useState, createContext, useContext } from 'react';

interface TabContextType {
  currentTab: number;
  setContent: (index: number) => void;
}

const TabContext = createContext<TabContextType | null>(null);
const useTabContext = () => {
  const context = useContext(TabContext);
  if(!context) {
    throw new Error('Error');
  }
  return context;
}

interface ChildProps {
  index: number | null;
}
interface TabPropsType {
  label: string;
  value: string;
}

interface TabType {
  // TabProps: TabPropsType[];
  initTab: number;
  children?: React.ReactNode;
};

interface TabTypePros extends React.FC<TabType> {
  List: typeof TabList;
  Button: typeof TabButton;
  ContentView: typeof TabContentView;
  Contents: typeof TabContent;
}

interface TabListType {
  children?: React.ReactNode;
  index?: number;
}

interface TabButtonType {
  children?: React.ReactNode;
  index?: number;
}

interface TabContentViewType {
  children?: React.ReactNode;
  index?: number;
}
interface TabContentType {
  children?: React.ReactNode;
  index?: number;
}

const Tab: TabTypePros = ({ initTab, children }) => {
  const [currentTab, setContent] = useState(initTab);

  return (
    <>
      <TabContext.Provider value={{ currentTab, setContent }}>
        <div className='Tab'>
          { children }
        </div>
      </TabContext.Provider>
    </>
  )
}

const TabList: React.FC<TabListType> = ({ children }) => {
  return (
    <>
      <div className='TabList'>
        {
          React.Children.map(children, (child, index) => {
            return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
          })
        }
      </div>
    </>
  )
}

const TabButton: React.FC<TabButtonType> = ({ children, index = 0, ...props }) => {
  const { currentTab, setContent } = useTabContext();

  return (
    <>
      <button type="button"
        onClick={() => setContent(index)}
        className={`${currentTab === index ? 'text-red-700' : ''} px-3 py-2 cursor-pointer`}
        {...props}
        >
        { children }
      </button>
    </>
  )
}

const TabContentView: React.FC<TabContentViewType> = ({ children }) => {
  return (
    <>
      <div className='TabContentView'>
        {
          React.Children.map(children, (child, index) => {
            return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
          })
        }
      </div>
    </>
  )
}
const TabContent: React.FC<TabContentType> = ({ children, index }) => {
  const { currentTab } = useTabContext();

  return (
    <>
      {index === currentTab && (
        <div>
        { children }
        </div>
      )}
    </>
  )
}

Tab.List = TabList;
Tab.Button = TabButton;
Tab.ContentView = TabContentView;
Tab.Contents = TabContent;

export default Tab;