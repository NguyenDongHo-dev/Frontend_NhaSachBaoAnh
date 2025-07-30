import { useEffect, useState } from "react";

interface IPros {
  quantity: number;
  setQuantity: (value: number) => void;
  onClick?: (type: string) => void;
}

export default function Quantity_button(props: IPros) {
  const { quantity, setQuantity, onClick } = props;

  const [inputValue, setInputValue] = useState<string>(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.value);
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const hadleBlur = () => {
    if (inputValue === "") {
      setQuantity(1), setInputValue("1");
      return;
    }

    const number = Number(inputValue);
    if (number > 0) {
      setQuantity(number);
    } else {
      setInputValue(quantity.toString());
    }
  };

  return (
    <div className="flex h-[40px] w-fit items-center border border-[#ddd]">
      <button
        onClick={() => onClick?.("-")}
        className="px-[8px] h-full hover:text-[#000] cursor-pointer hover:bg-[#f1f1f1] bg-[#f9f9f9] inline-block text-[#666] font-normal"
      >
        -
      </button>
      <input
        type="text"
        value={inputValue}
        onBlur={hadleBlur}
        onChange={handleChange}
        className="size-[40px] text-center input-no-spinner border-x border-[#ddd] focus:outline-none focus:[box-shadow:0_4px_6px_rgba(0,0,0,0.2)]"
      />
      <button
        onClick={() => onClick?.("+")}
        className="px-[8px] h-full hover:text-[#000] cursor-pointer hover:bg-[#f1f1f1] bg-[#f9f9f9] inline-block text-[#666] font-normal"
      >
        +
      </button>
    </div>
  );
}
