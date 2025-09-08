"use client";
import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  Code: string;
  FullName: string;
}

interface Props {
  label: string;
  placeholder?: string;
  items: DropdownItem[];
  selected: string;
  setSelected: (val: string) => void;
}

const SearchableDropdown: React.FC<Props> = ({
  label,
  placeholder = "Tìm kiếm...",
  items,
  selected,
  setSelected,
}) => {
  const [show, setShow] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items

  function normalizeName(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(tinh|thanh pho|quan|huyen)\s+/g, "");
  }
  const filteredItems = items.filter((item) =>
    normalizeName(item.FullName).includes(normalizeName(search))
  );

  // Click outside để đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus vào input khi mở dropdown
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-[6px] relative">
      <p className="block text-[#222] font-medium">{label}</p>
      <div
        onClick={() => setShow((prev) => !prev)}
        className="relative shadow focus:shadow-lg h-[40px] px-3 border border-gray-300 rounded-md flex items-center cursor-pointer"
      >
        {selected || placeholder}
        <div className="absolute right-2 top-1/2 translate-y-[-50%]">
          <ChevronDown size={14} />
        </div>
      </div>

      {show && (
        <div className="absolute bg-white w-full z-30 top-full border shadow left-0 right-0">
          <div className="p-1">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 border focus:outline-none px-1"
              type="text"
              placeholder={placeholder}
            />
          </div>

          <div
            className={`${
              filteredItems.length > 0 ? "h-[200px]" : "h-auto"
            } overflow-y-auto`}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.Code}
                  onClick={() => {
                    setSelected(item.FullName);
                    setShow(false);
                    setSearch("");
                  }}
                  className={`p-[6px] ${
                    item.FullName === selected && "bg-gray-300"
                  } hover:bg-[#0073aa] hover:text-white duration-200 transition-colors cursor-pointer`}
                >
                  {item.FullName}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 cursor-default">
                Không tìm thấy
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
