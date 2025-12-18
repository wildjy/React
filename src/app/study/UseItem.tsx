
"use client";
import { useState } from "react";
import { cn }  from "../../sharedUI/common/cn";

export interface Itemtype {
  id: string;
  name: string;
}

interface UseItemProps {
  items: Itemtype[];
  value: Itemtype[];
  limits: number;
  onChange: (items: Itemtype[]) => void;
  initText?: string;
  addClass?: string;
}

export const UseItem: React.FC<UseItemProps> = (
  {
    items,
    value = [],
    limits,
    onChange,
    initText = 'Please select an item',
    addClass = ''
  }) => {
  const selectedItems = value || [];
  const limit = limits;
  const defaultItem: Itemtype = { id: '0', name: initText || 'Please select an item' };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>(defaultItem.name);

  // dropdown
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (item: Itemtype) => {
    if (selectedItems.length >= limit) {
      alert(`최대 ${limit}개까지 선택 가능합니다.`);
      setIsOpen(false);
      return;
    }
    onChange([...selectedItems, item]);
    setSelectedTitle(item.name); // Update the val_tit
    setIsOpen(false); // Close dropdown after selection
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);

    onChange(updatedItems);

    // const updatedItems = [...selectedItems];
    // console.log(updatedItems)
    // updatedItems.splice(index, 1);
    // setSelectedItems(updatedItems);

    // Update title
    if (updatedItems.length === 0) {
      setSelectedTitle(defaultItem.name);
    } else {
      setSelectedTitle(updatedItems[updatedItems.length - 1].name);
    }
  };

  // console.log(selectedItems)

  return (
    <div id="violence" className="">
      {/* Title */}
      <button
        type="button"
        className={cn(`
          val_tit flex justify-start items-center border px-4 py-2
          after:right-[0.6rem] after:w-[0.75rem] after:h-[0.375rem]
          relative
          sm:after:right-[0.75rem] sm:after:w-[0.75rem] sm:after:h-[0.375rem]
          md:after:right-[0.75rem]
          lg:after:right-[1rem] lg:after:w-[0.625rem] lg:after:h-[0.375rem]
          after:bg-[length:100%_100%]
          after:absolute after:transform after:-translate-y-1/2 after:top-[50%]
          after:content-[""] after:bg-center after:bg-no-repeat after:transition-all after:duration-200
          after:bg-[url("https://image.jinhak.com/jinhakImages/react/icon/icon_toggle.svg")]
          `,
          isOpen && 'border-blue-700 after:-rotate-180',
          addClass
        )}
        onClick={handleToggleDropdown}
      >
        {selectedTitle}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div id="save_list" className="absolute z-10 mt-1 border bg-white w-full shadow">
          {items.map((item) => (
            <div
              key={item.id}
              className="item cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSelectItem(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Selected Items */}
      <div className="mt-4">
        {selectedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="item flex items-center mb-2">
            <span className="mr-2">{item.name}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 underline"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      {selectedItems.length >= limit && (
        <p className="info_txt">최대 {limit}개까지 선택 가능합니다.</p>
      )}
    </div>
  )
}