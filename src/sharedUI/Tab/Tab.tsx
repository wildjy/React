"use client";
import Link from 'next/link';
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, createContext, useContext, useEffect } from 'react';
import { SwiperSlider } from '../Swiper/SwiperSlider';
import { SwiperSlide } from 'swiper/react';

type sizeType = 'default' | 'report';
type modeType = 'type1' | 'type2' | 'type3' | 'type4' | 'type5';
interface TabContextType {
  slider: boolean;
  sizeType: sizeType;
  modeType: modeType;
  currentTab: number;
  setCurrentTab: (index: number) => void;
}

const TabContext = createContext<TabContextType | null>(null);
const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

/*
  px-2 py-2
  min-w-[4rem] min-h-9
*/
const TabVariants = cva(`TabList flex items-stretch justify-left`, {
  variants: {
    size: {
      default: `default..`,
      report: `report..`,
    },
    mode: {
      type1: 'type1 gap-2 sm:gap-2 md:gap-3 rounded-none',
      type2: 'type2 p-0.5 bg-gray-50 border border-gray-200 rounded',
      type3: 'type3 rounded-lg',
      type4: 'type4 flex border-b items-end',
      type5: 'type5 overflow-hidden',
    },
  },
  compoundVariants: [
    {
      size: 'report',
      mode: 'type2',
      className: `p-1 border-none rounded-sm md:rounded-lg`,
    },
  ],
  defaultVariants: {
    size: 'default',
    mode: 'type1',
  },
});

const TabButtonVariants = cva(
  `flex items-center justify-center
  text-xs sm:text-base md:text-lg
  text-center
  cursor-pointer
  focus:outline-none `,
  {
    variants: {
      size: {
        default: `default..`,
        report: `report..`,
      },
      mode: {
        type1: `
          min-h-[2.125rem] md:min-h-12
          px-5
          text-gray-400 border border-gray-300 rounded-md md:rounded-lg
        `,
        type2: `type2
          px-1 md:px-2
          min-w-[3rem] md:min-w-[3.5rem] h-5 md:h-6
          text-3xs sm:text-2xs md:text-sm
          first:before:hidden
          before:content-[""]
          before:block
          before:absolute before:top-2 before:bottom-2 before:-left-[1px]
          before:w-[1px] before:bg-[#C5C6CC]
          after:content-[""]
          after:hidden
          after:absolute after:top-0 after:bottom-0 after:-right-[3px]
          after:w-[2px] after:bg-gray-50
          relative
          `,
        type3: `type3
          px-2 py-2
          min-w-[6rem] md:min-w-[8rem] lg:min-w-[12.5rem]
          text-gray-400 bg-gray-50
          relative
          first:rounded-l-sm
          last:rounded-r-sm
          md:first:rounded-l-lg
          md:last:rounded-r-lg
          `,
        type4: `grow
          h-auto
          py-3 lg:py-4
          text-sm sm:text-lg md:text-lg xl:text-xl
          text-gray-500`,
        type5: `
          w-full
          min-h-[2.125rem] md:min-h-12
          md:px-5
          text-gray-400 relative
          before:content-[""] before:absolute before:top-0 before:bottom-0 before:-left-[1px] before:right-0
          before:border before:border-gray-300
          first:before:left-0
          before:first:rounded-l-sm
          before:last:rounded-r-sm
          md:before:first:rounded-l-lg
          md:before:last:rounded-r-lg
        `,
      },
    },
    compoundVariants: [
      {
        size: 'report',
        className: `
        py-0
        h-9 sm:h-11 md:h-12 xl:h-[3.25rem]
        text-sm sm:text-md md:text-base xl:text-lg
        `,
      },
      {
        size: 'report',
        mode: 'type1',
        className: ``,
      },
      {
        size: 'report',
        mode: 'type2',
        className: `
        border-none
        first:rounded-l-sm
        last:rounded-r-sm
        md:first:rounded-l-lg
        md:last:rounded-r-lg
        before:hidden
        last:after:hidden
        after:block after:w-[1px] after:top-[30%] after:bottom-[30%]
        after:bg-gray-200
        `,
      },
      {
        size: 'report',
        mode: 'type3',
        className: '',
      },
      {
        size: 'report',
        mode: 'type5',
        className:
          'text-2xs sm:text-xs md:text-base xl:text-lg before:first:rounded-l before:last:rounded-r',
      },
    ],
    defaultVariants: {
      size: 'default',
      mode: 'type1',
    },
  }
);

interface ChildProps {
  index: number | null;
}
interface TabType {
  slider?: boolean;
  initTab: number;
  children?: React.ReactNode;
  sizeType?: sizeType;
  modeType?: modeType;
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

const Tab: TabTypePros = ({
  slider = false,
  initTab,
  children,
  sizeType = 'default',
  modeType = 'type1',
  addClass,
}) => {
  const [currentTab, setCurrentTab] = useState(initTab);

  useEffect(() => {
    setCurrentTab(initTab);
  }, [initTab]);

  return (
    <TabContext.Provider
      value={{ slider, sizeType, modeType, currentTab, setCurrentTab }}
    >
      <div className={`${cn('Tab', addClass)}`}>{children}</div>
    </TabContext.Provider>
  );
};

const TabList: React.FC<TabListType> = ({ children, addClass }) => {
  const { slider, sizeType, modeType } = useTabContext();
  const className = TabVariants({
    size: sizeType as sizeType | undefined,
    mode: modeType as modeType | undefined,
  });

  return (
    <div
      className={`${cn(className, addClass, {
        // 'gap-3': modeType === "type1",
        // '': modeType === "type2",
        // 'rounded': modeType === "type3",
      })}`}
    >
      {!slider ? (
        React.Children.map(children, (child, index) => {
          return React.isValidElement<ChildProps>(child)
            ? React.cloneElement(child, { index })
            : child;
        })
      ) : (
        <SwiperSlider
          id="tabSwiper"
          freeMode
          slidesPerView="auto"
          arrow={false}
          pager={false}
          addClass="w-full"
        >
          {React.Children.map(children, (child, index) => {
            const childCount = React.Children.count(children);

            return React.isValidElement<ChildProps>(child) ? (
              <SwiperSlide
                key={index}
                className=""
                style={{
                  width: 'auto',
                  minWidth: `${100 / childCount}%`,
                }}
              >
                {React.cloneElement(child, { index })}
              </SwiperSlide>
            ) : (
              child
            );
          })}
        </SwiperSlider>
      )}
    </div>
  );
};

const TabButton: React.FC<TabButtonType> = ({
  link = false,
  href,
  blank,
  children,
  index = 0,
  addClass,
  returnIndex,
  ...props
}) => {
  const { sizeType, modeType, currentTab, setCurrentTab } = useTabContext();
  const className = TabButtonVariants({
    size: sizeType as sizeType | undefined,
    mode: modeType as modeType | undefined,
  });

  function handleClickSetContent() {
    setCurrentTab(index);
    if (returnIndex) {
      returnIndex(index);
    }
  }

  const currentStyle = {
    'text-blue-800 border-blue-800': modeType === 'type1',
    'bg-white text-blue-800 border border-gray-200 rounded shadow-[1px_1px_4px_0_rgba(0,0,0,0.08)] before:hidden after:hidden z-[5]':
      modeType === 'type2',
    'text-white bg-blue-800': modeType === 'type3',
    [`
      text-blue-800 font-bold relative
      after:border-b-2
      after:content-[""]
      after:absolute
      after:-bottom-[1px]
      after:left-0 after:right-0
      after:border-blue-800 after:z-[5]
    `]: modeType === 'type4',
    [`
      text-blue-800
      before:border-blue-800
      first:before:left-0 z-[5]
    `]: modeType === 'type5',
  };

  return link ? (
    <Link
      href={href || '#/'}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noopener noreferrer' : undefined}
      className={`${cn(
        className,
        currentTab === index && currentStyle,
        addClass
      )}`}
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
      className={`${cn(
        className,
        currentTab === index && currentStyle,
        addClass
      )}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabContentView: React.FC<TabContentViewType> = ({
  children,
  addClass,
}) => {
  return (
    <div className={`${cn('TabContentView', addClass)}`}>
      {React.Children.map(children, (child, index) => {
        return React.isValidElement<ChildProps>(child)
          ? React.cloneElement(child, { index })
          : child;
      })}
    </div>
  );
};
const TabContent: React.FC<TabContentType> = ({
  children,
  addClass,
  index,
}) => {
  const { currentTab } = useTabContext();

  return (
    <>
      {currentTab === index && (
        <div className={`${cn('TabContent', addClass)}`}>{children}</div>
      )}
    </>
  );
};

const TabContentCopy: React.FC<TabContentType> = ({ children, addClass }) => {
  return <div className={`${cn('TabContent', addClass)}`}>{children}</div>;
};

Tab.List = TabList;
Tab.Button = TabButton;
Tab.ContentView = TabContentView;
Tab.Contents = TabContent;
Tab.ContentsCopy = TabContentCopy;

export default Tab;
