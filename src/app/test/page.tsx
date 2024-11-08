"use client";
import ModuleInput from "../../sharedUI/Input/TextInput";
import { useState, ChangeEvent } from "react";

export default function Page() {
  const [inputValue, setInputValue] = useState([
    {
      name: "",
      phone: "",
      grade: "",
      class: "",
      school: "",
      icon: "https://image.jinhak.com/renewal2020/svg/input_radio.svg",
    },
    {
      name: "ㄱㄴㄷ",
      phone: "111-1111-1111",
      icon: "",
    },
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const newValue = e.target.value;

    setInputValue((prevValues) => {
      console.log("Previous Values:", prevValues);

      return prevValues.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
    });
  };

  return (
    <>
      <ModuleInput
        type="text"
        mode="base"
        inputSize="lg"
        color="success"
        addClass="border-gray-800"
        addId="inp-1"
        label="수험생 이름"
        value={inputValue[0].name}
        onChange={(e) => handleInputChange(e, 0, "name")}
      />
    </>
  );
}
