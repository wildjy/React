"use client";
// import { useId } from 'react';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext, ButtonHTMLAttributes } from 'react';

type modeType = "type1" | "type2" | "type3";
interface TabContextType {
  modeType: modeType;
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

const TabVariants = cva(`TabList inline-flex items-center justify-center overflow-hidden`, {
    variants: {
      mode: {
        type1: 'type1 gap-3 rounded-none',
        type2: 'type2 p-2 bg-gray-50 border border-gray-200 rounded',
        type3: 'type3 rounded-lg',
      },
    },
    defaultVariants: {
      mode: "type1",
    }
  }
)

const TabButtonVariants = cva(`px-3 min-w-[4.5rem] h-10 cursor-pointer`, {
    variants: {
      mode: {
        type1: 'type1 px-6 text-gray-300 border border-gray-200 rounded',
        type2: `type2 h-9 relative
          first:before:hidden
          before:absolute
          before:top-3
          before:bottom-3
          before:left-0
          before:block
          before:content-[""]
          before:w-[1px]
          before:bg-[#C5C6CC]
          after:hidden
          after:absolute
          after:top-0
          after:bottom-0
          after:-right-[3px]
          after:content-[""]
          after:w-[2px]
          after:bg-gray-50
        `,
        type3: 'type3 min-w-[6rem] md:min-w-[8rem] lg:min-w-[12.5rem] text-gray-400 bg-gray-50',
      },
    },
    defaultVariants: {
      mode: 'type1',
    }
  }
)
interface ChildProps {
  index: number | null;
}
interface TabType {
  initTab: number;
  children?: React.ReactNode;
  modeType: modeType;
  addClass?: string;
};

interface TabTypePros extends React.FC<TabType> {
  List: typeof TabList;
  Button: typeof TabButton;
  ContentView: typeof TabContentView;
  Contents: typeof TabContent;
}

interface TabListType extends VariantProps<typeof TabVariants> {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}

interface TabButtonType extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">, VariantProps<typeof TabButtonVariants> {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}

interface TabContentViewType {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}
interface TabContentType {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}

const Tab: TabTypePros = ({ initTab, children, modeType, addClass }) => {
  const [currentTab, setContent] = useState(initTab);

  return (
    <>
      <TabContext.Provider value={{ modeType, currentTab, setContent }}>
        <div className={`${cn('Tab', addClass)}`}>
          { children }
        </div>
      </TabContext.Provider>
    </>
  )
}

const TabList: React.FC<TabListType> = ({ children, addClass }) => {
  const { modeType } = useTabContext();
  const className = TabVariants({
    mode: modeType as modeType | undefined,
  })

  return (
    <>
      <div className={` ${cn(className, addClass, {
        // 'gap-3': modeType === "type1",
        // '': modeType === "type2",
        // 'rounded': modeType === "type3",
      })}`}>
        {
          React.Children.map(children, (child, index) => {
            return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
          })
        }
      </div>
    </>
  )
}

const TabButton: React.FC<TabButtonType> = ({ children, index = 0, addClass, ...props }) => {
  const { modeType, currentTab, setContent } = useTabContext();
  const className = TabButtonVariants({
    mode: modeType as modeType | undefined,
  })

  return (
    <>
      <button type="button"
        onClick={() => setContent(index)}
        className={`${cn(className, addClass, {
          'text-blue-800 border-blue-800': currentTab === index && modeType === "type1",
          ' bg-white border border-gray-200 rounded before:hidden after:block z-10': currentTab === index && modeType === "type2",
          'text-white bg-blue-800': currentTab === index && modeType === "type3",
        })}`}
        {...props}
        >
        { children }
      </button>
    </>
  )
}

const TabContentView: React.FC<TabContentViewType> = ({ children, addClass }) => {
  return (
    <>
      <div className={`${cn('TabContentView', addClass)}`}>
        {
          React.Children.map(children, (child, index) => {
            return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
          })
        }
      </div>
    </>
  )
}
const TabContent: React.FC<TabContentType> = ({ children, addClass , index }) => {
  const { currentTab } = useTabContext();

  return (
    <>
      {index === currentTab && (
        <div className={`${cn('TabContent', addClass)}`}>
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