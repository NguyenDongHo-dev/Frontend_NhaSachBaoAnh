import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import NavBar from "./client/NavBar";
import { fetchAllCategory } from "@/services/categoryService";
import { CategoryResponse } from "@/types/category";

async function Header() {
  const categories: CategoryResponse = await fetchAllCategory();
  const { data } = categories;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white ">
      <div className=" md:max-w-laptop md:mx-auto md:w-full px-[15px]">
        <strong className=" md:hidden min-h-[30px] flex items-center justify-center  uppercase bg-primary w-full text-[12px] text-white">
          nhà sách bảo anh | bảo anh books
        </strong>
        <div className="min-h-[90px] flex items-center justify-between ">
          <div className=" md:flex  items-center md:flex-1">
            <NavBar data={data} />

            <div className="px-[15px] h-[43px] hidden items-center md:flex flex-1 ">
              <input
                className="px-[10px] h-[32px] w-full md:w-[248px] lg:w-[375px]  border border-r-0 bg-white text-[12px] "
                type="text"
                placeholder="Tìm kiếm..."
              />
              <div className="size-[34px] flex items-center justify-center bg-primary">
                <Search size={16} color="white" />
              </div>
            </div>
          </div>

          <div className="relative w-[200px] h-[67.500px] md:order-first md:mr-[30px]  ">
            <Link href={"/"}>
              <Image
                src={logo}
                sizes="(max-width: 200px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="logo"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center justify-between lg:w-[284px] md:w-[350px] md:order-last  ">
            <Link href={"/gio-hang"}>
              <div className="cursor-pointer font-normal text-[hsla(0,0%,40%,.85)] md:w-[136px] md:flex items-center gap-1 flex justify-end">
                <div className="hidden hover:text-[hsla(0,0%,7%,.85)] md:flex items-center gap-1 md:text-[14px]">
                  <div className="uppercase">Giỏ hàng / </div>
                  <samp>0 đ</samp>
                </div>
                <div className=" group hover:bg-primary hover:text-white duration-100 size-[28px] border-2  bg-white border-primary flex items-center justify-center text-[12px] text-primary font-bold relative  ">
                  0
                  <div className="group-hover:after:top-[-50%] group-hover:after:transition-all group-hover:duration-100 after:-z-50 after:border-2 after:border-b-0 after:rounded-tr-[99px] after:border-primary after:rounded-tl-[99px] after:h-[10px] after:w-[14px] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[-30%]"></div>
                </div>
              </div>
            </Link>

            <div className="hidden md:block h-[30px] w-0.5 opacity-50 bg-[rgba(0,0,0,.1)]"></div>
            <button className="hidden font-medium md:block hover:bg-[#CC1212]  cursor-pointer uppercase w-[119px] h-[32px] text-white bg-primary rounded-full text-[14px] ">
              THANH TOÁN
            </button>
          </div>
        </div>
        {/* mobile */}
      </div>
      <div className=" px-[15px] h-[43px] w-full bg-secondary flex items-center md:hidden ">
        <input
          className="px-[10px] h-[32px] flex-1 border border-r-0 bg-white text-[12px] "
          type="text"
          placeholder="Tìm kiếm..."
        />
        <div className="size-[34px] flex items-center justify-center bg-primary">
          <Search size={16} color="white" />
        </div>
      </div>
      <div className="hidden lg:flex items-center bg-secondary h-[40px] w-full text-[hsla(0,0%,40%,.85)] ">
        <div className="md:max-w-laptop mx-auto flex items-center gap-3">
          {data?.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/danh-muc-san-pham/${item.slug}`}
                className="uppercase py-[10px] text-[13px] font-semibold hover:text-[hsla(0,0%,7%,.85)]"
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Header;
