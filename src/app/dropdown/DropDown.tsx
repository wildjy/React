import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState, useRef, useEffect } from 'react';

interface OptionType {
  value: string;
  label: string
}

interface DropDownProps {
  children?: React.ReactNode;
  custom?: boolean;
  options?: OptionType[];
  isOpen?: boolean;
  size?: string;
  label?: string;
  layer?: boolean;
}

interface DropDownType extends React.FC<DropDownProps> {
  Option: typeof DropOption;
}

interface DropOptionProps {
  children?: React.ReactNode;
}

const DropDown: DropDownType = ({ options = [], size, label, custom = false, layer = false, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<OptionType | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const OpenEvent = () => {
    setIsOpen((prevOpen) => !prevOpen);
  }

  const openMouseEvent = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      console.log(!dropRef.current.contains(event.target as Node));
      setIsOpen(false);
    }
  }

  const ChangeSelectValue = (option: OptionType) => {
    console.log(option);
    setSelectValue(option);
    setIsOpen(false);
  }

  useEffect(() => {
    document.addEventListener('mousedown', openMouseEvent);
    return () => {document.removeEventListener('mousedown', openMouseEvent);}
  }, [])

  return(
    <>
      <div ref={dropRef} className={`inline-block ${size} ${layer ? 'md:relative' : 'relative'}`}>
        <div className={`${isOpen ? 'active':''} ${isOpen ? ' after:-rotate-180' : ''}
        select-box px-4 py-3 pr-[1.75rem] w-full text-left border border-gray-3004 relative
        truncate
        after:w-[1rem]
        after:h-[1rem]
        after:bg-[length:1rem_1rem]
        after:absolute  after:transform after:-translate-y-1/2 after:top-[50%] after:right-3
        after:content-[""]
        after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
        after:bg-center
        after:bg-no-repeat
        after:transition-all
        after:duration-200
        `}
        onClick={OpenEvent}
        data-value={selectValue?.value || ''}
        >
          {selectValue ? selectValue.label : label}
        </div>
        {isOpen && (
          <div className={`dropDown-box ${layer ? `
          fixed top-0 left-0 w-dvw h-dvh bg-gray-1000 bg-opacity-65 z-20
          md:absolute md:-mt-[1px] md:top-auto md:right-0 md:min-w-[6rem] md:w-auto md:h-auto md:bg-none md:bg-opacity-0` :
          'absolute -mt-[1px] left-0 min-w-[6rem] w-[100%] z-10'
          }`}>
            <div className={`p-3 max-h-[10rem] scroll overflow-auto bg-white border border-gray-300
              ${layer ? `
              center_center max-w-[90dvw] w-max max-h-[50dvh]
              md:max-h-[10rem] md:relative md:w-full md:max-w-auto md:top-0 md:left-0 md:-translate-x-0 md:-translate-y-0
              ` : ''}`}>
              { custom ? (
                <div>{ children }
                  <button onClick={OpenEvent}>닫기</button>
                </div>
              ) : (
                  <ul className=''>
                    {
                      options.map((option) => (
                        <li key={option.value} onClick={() => ChangeSelectValue(option)} className='hover:bg-gray-200'>{ option.label }</li>
                      ))
                    }
                  </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const DropOption: React.FC<DropOptionProps> = ({ children }) => {
  return (
    <>
      <div>
        { children }
      </div>
    </>
  )
}

DropDown.Option = DropOption;

export default DropDown;