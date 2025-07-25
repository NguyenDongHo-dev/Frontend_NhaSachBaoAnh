"use client";

import { Category } from "@/types/category";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavBarProps {
  data: Category[];
}

function NavBar({ data }: NavBarProps) {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={` ${
          showNavbar
            ? "-translate-x-3 opacity-0 pointer-events-none "
            : "translate-x-0 opacity-100 pointer-events-auto"
        } cursor-pointer hover:bg-[#CC1212]  transition-all duration-300 bg-primary px-[0.6em] rounded-[5px] w-[32px] h-[32px] flex items-center justify-center`}
      >
        <Menu size={15} color="white" />
      </div>

      <div
        className={`fixed top-0 left-0 h-screen max-w-[300px] w-full bg-white shadow-lg z-50 duration-300 ${
          showNavbar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-[20px]">
          <div className="p-5 flex items-center">
            <input
              className="px-[10px] h-[32px] w-full border border-r-0 bg-white text-[12px] "
              type="text"
              placeholder="Tìm kiếm..."
            />
            <div className="size-[34px] flex items-center justify-center bg-primary">
              <Search size={16} color="white" />
            </div>
          </div>

          <ul className=" font-bold  text-[0.8em]">
            {data.map((item) => (
              <li
                className="uppercase py-[15px] pl-5 border-t-[1px] border-[#ececec]  text-[hsla(0,0%,40%,.85)] hover:bg-[rgba(0,0,0,.05)]"
                key={item.id}
              >
                <Link href={item.slug}>{item.name}</Link>
              </li>
            ))}
            <div className="py-[25px] pl-5 text-black border-t-[1px] border-[#ececec]">
              SÁCH VÀ VĂN PHÒNG PHẨM ONLINE
            </div>
          </ul>
        </div>
      </div>

      <div
        className={`fixed top-2 right-2 z-[999] cursor-pointer hover:text-white transition-all duration-300 ${
          showNavbar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-3 opacity-0 pointer-events-none"
        }`}
        onClick={handleToggle}
      >
        <X size={28} />
      </div>

      {showNavbar && (
        <div
          className={`fixed inset-0 bg-[#0b0b0b] transition-opacity  ${
            showNavbar ? "opacity-25" : "opacity-0"
          }   z-40`}
          onClick={handleToggle}
        ></div>
      )}
    </>
  );
}

export default NavBar;
