"use client";
import Link from 'next/link';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext } from 'react';

type modeType = 'type1' | 'type2' | 'type3' | 'type4';
interface TabContextType {
  modeType: modeType;
  currentTab: number;
  setContent: (index: number) => void;
}

const TabContext = createContext<TabContextType | null>(null);
const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

const TabVariants = cva(`TabList inline-flex items-center justify-center`, {
  variants: {
    mode: {
      type1: 'type1 gap-3 sm:gap-3 md:gap-4 rounded-none',
      type2: 'type2 p-2 bg-gray-50 border border-gray-200 rounded',
      type3: 'type3 rounded-lg',
      type4: 'type4 flex border-b',
    },
  },
  defaultVariants: {
    mode: 'type1',
  },
});

const TabButtonVariants = cva(
  `flex items-center justify-center px-3 min-w-[4.5rem] h-10 text-xs sm:text-base md:text-lg text-center cursor-pointer`,
  {
    variants: {
      mode: {
        type1: `
        h-[2.125rem] md:h-13
        px-6
        text-gray-300 border border-gray-200 rounded
      `,
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
        type3: `type3 min-w-[6rem] md:min-w-[8rem] lg:min-w-[12.5rem] text-gray-400 bg-gray-50`,
        type4: `grow
        h-auto
        py-4 lg:py-5
        text-sm sm:text-lg md:text-lg xl:text-xl
        text-gray-500`,
      },
    },
    defaultVariants: {
      mode: 'type1',
    },
  }
);
interface ChildProps {
  index: number | null;
}
interface TabType {
  initTab: number;
  children?: React.ReactNode;
  modeType: modeType;
  addClass?: string;
}

interface TabTypePros extends React.FC<TabType> {
  List: typeof TabList;
  Button: typeof TabButton;
  ContentView: typeof TabContentView;
  Contents: typeof TabContent;
  ContentsCopy: typeof TabContentCopy;
}

interface TabListType extends VariantProps<typeof TabVariants> {
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
}

// interface TabButtonType extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, VariantProps<typeof TabButtonVariants> {
interface TabButtonType extends VariantProps<typeof TabButtonVariants> {
  link?: boolean;
  href?: string;
  blank?: boolean;
  children?: React.ReactNode;
  index?: number;
  addClass?: string;
  returnIndex?: (index: number) => void;
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
    <TabContext.Provider value={{ modeType, currentTab, setContent }}>
      <div className={`${cn('Tab', addClass)}`}>{children}</div>
    </TabContext.Provider>
  );
};

const TabList: React.FC<TabListType> = ({ children, addClass }) => {
  const { modeType } = useTabContext();
  const className = TabVariants({
    mode: modeType as modeType | undefined,
  });

  return (
    <div
      className={` ${cn(className, addClass, {
        // 'gap-3': modeType === "type1",
        // '': modeType === "type2",
        // 'rounded': modeType === "type3",
      })}`}
    >
      {React.Children.map(children, (child, index) => {
        return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
      })}
    </div>
  );
};

const TabButton: React.FC<TabButtonType> = ({ link = false, href, blank, children, index = 0, addClass, returnIndex, ...props }) => {
  const { modeType, currentTab, setContent } = useTabContext();
  const className = TabButtonVariants({
    mode: modeType as modeType | undefined,
  });

  function handleClickSetContent() {
    setContent(index);
    if (returnIndex) {
      returnIndex(index);
    }
  }

  const currentStyle = {
    'text-blue-800 border-blue-800': modeType === 'type1',
    'bg-white border border-gray-200 rounded before:hidden after:block z-10': modeType === 'type2',
    'text-white bg-blue-800': modeType === 'type3',
    'text-blue-800 font-bold after:border-b-2 relative after:content-[""] after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:border-blue-800 after:z-10':
      modeType === 'type4',
  };

  return link ? (
    <Link
      href={href || '#/'}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noopener noreferrer' : undefined}
      className={`${cn(className, addClass, currentTab === index && currentStyle)}`}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => {
        if (!link) {
          handleClickSetContent();
        }
      }}
      className={`${cn(className, addClass, currentTab === index && currentStyle)}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabContentView: React.FC<TabContentViewType> = ({ children, addClass }) => {
  return (
    <div className={`${cn('TabContentView', addClass)}`}>
      {React.Children.map(children, (child, index) => {
        return React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { index }) : child;
      })}
    </div>
  );
};
const TabContent: React.FC<TabContentType> = ({ children, addClass, index }) => {
  const { currentTab } = useTabContext();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{currentTab === index && <div className={`${cn('TabContent', addClass)}`}>{children}</div>}</>;
};

const TabContentCopy: React.FC<TabContentType> = ({ children, addClass }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <div className={`${cn('TabContent', addClass)}`}>{children}</div>;
};

Tab.List = TabList;
Tab.Button = TabButton;
Tab.ContentView = TabContentView;
Tab.Contents = TabContent;
Tab.ContentsCopy = TabContentCopy;

export default Tab;
