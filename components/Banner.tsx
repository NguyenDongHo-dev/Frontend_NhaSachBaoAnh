import Image from "next/image";
import slide from "../public/slide.jpg";
import { ShoppingBag } from "lucide-react";

export default function Banner() {
  return (
    <div className="relative w-full h-[640px]">
      <Image src={slide} alt="Banner" fill className="object-cover" />
      <div className="absolute z-10  top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.25)]">
        <div className="max-w-laptop mx-auto h-full flex items-center z-20 px-[10px]">
          <div className="flex flex-col gap-5 ">
            <div className="text-[#f1f1f1] font-bold">
              Combo WhatElse – Luật chơi sáng tạo
            </div>
            <h1 className="text-[43px] font-bold text-white pb-[10px] ">
              BẢO ANH BOOKS
            </h1>
            <div className="uppercase border border-white hover:bg-[#CCCCCC] duration-300 cursor-pointer text-[#666] font-semibold bg-white h-[55px] w-[223px] rounded-full flex items-center justify-center gap-3 ">
              Combo WhatElse
              <samp>
                <ShoppingBag />
              </samp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
