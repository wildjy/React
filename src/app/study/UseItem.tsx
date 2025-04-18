
"use client";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";

export const UseItem = () => {
  interface Item {
    id: string;
    name: string;
  }

  const limit = 5;
  const defaultItem: Item = { id: '0', name: 'Please select an item' };

  const [items] = useState<Item[]>([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' },
  ]);

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>(defaultItem.name);

  // dropdown
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (item: Item) => {
    if (selectedItems.length >= limit) {
      alert(`최대 ${limit}개까지 선택 가능합니다.`);
      setIsOpen(false);
      return;
    }

    setSelectedItems((prev) => [...prev, item]);
    console.log(selectedItems)
    setSelectedTitle(item.name); // Update the val_tit
    setIsOpen(false); // Close dropdown after selection
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...selectedItems];
    console.log(updatedItems)
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);

    // Update title if the removed item is the last selected
    if (updatedItems.length === 0) {
      setSelectedTitle(defaultItem.name);
    } else {
      setSelectedTitle(updatedItems[updatedItems.length - 1].name);
    }
  };

  return (
    <div id="violence" className="w-[300px] relative">
      {/* Title */}
      <div
        className="val_tit cursor-pointer border px-4 py-2"
        onClick={handleToggleDropdown}
      >
        {selectedTitle}
      </div>

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