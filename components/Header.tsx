import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import NavBar from "./client/NavBar";
import { fetchAllCategory } from "@/services/categoryService";
import { CategoryResponse } from "@/types/category";
import CartHeader from "./client/CartHeader";
import SearchHeader from "./client/SearchHeader";

async function Header() {
  const categories: CategoryResponse = await fetchAllCategory();
  const { data } = categories;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white ">
      <div className=" md:max-w-laptop md:mx-auto md:w-full px-[15px]">
        <strong className=" md:hidden min-h-[30px] flex items-center justify-center  uppercase bg-primary w-full text-[12px] text-white">
          nhà sách bảo anh | bảo anh books
        </strong>
        <div className="min-h-[90px] flex items-center justify-between">
          {/* Cột trái */}
          <div className="flex items-center flex-1 ">
            <NavBar data={data} />
            <div className="pl-[15px] h-[43px] hidden items-center md:flex flex-1 ">
              <SearchHeader />
            </div>
          </div>

          {/* Cột giữa (logo) */}
          <div className="flex-1  sm:flex-0 flex justify-center md:order-first sm:mr-[30px]">
            <div className="relative w-[200px] h-[67.5px]">
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
          </div>

          {/* Cột phải */}
          <CartHeader />
        </div>

        {/* mobile */}
      </div>
      <div className=" px-[15px] h-[43px] w-full bg-secondary flex items-center md:hidden ">
        <SearchHeader />
      </div>
      <div className="hidden md:flex items-center bg-secondary h-[40px] w-full text-[hsla(0,0%,40%,.85)] ">
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
