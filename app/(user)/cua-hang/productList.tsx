"use client";

import Cart from "@/components/client/Cart";
import Pagination from "@/components/client/Pagination";
import Loading from "@/components/loading ";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Link from "next/link";
import SelectParams from "../danh-muc-san-pham/[slug]/selectParams";
import NotFondComponent from "@/components/client/NotFond";

interface Props {
  dataRer?: ProductListResponse;
  loading: boolean;
  searchName: string;
}

interface ProductListResponse {
  data?: Product[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
  category?: Category;
}

export default function ProductList({ dataRer, loading, searchName }: Props) {
  if (loading) {
    return <Loading />;
  }

  if (!dataRer || !dataRer.data || dataRer.data.length === 0) {
    return <NotFondComponent />;
  }

  const { data, total, limit, current_page, last_page } = dataRer;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center md:justify-between justify-center w-full ">
        <div className="flex items-center gap-2 text-[1.15em]">
          <div className="uppercase cursor-pointer text-[hsla(0,0%,40%,.7)] font-normal hover:text-[#111] duration-200 ">
            <Link href={"/"}>Trang chủ</Link>
          </div>
          <span className="font-light text-[#222]">/</span>

          <div
            className={`${
              searchName ? " text-[hsla(0,0%,40%,.7)]" : "font-semibold"
            } uppercase`}
          >
            <Link href={`/cua-hang`}>Của hàng</Link>
          </div>
          {searchName && (
            <div className="uppercase font-semibold">
              / Kết quả tìm kiếm cho "{searchName}"
            </div>
          )}

          {current_page && current_page > 1 && (
            <>
              <span className="font-light text-[#222]">/</span>
              <div className="uppercase text-black font-bold">
                Trang {current_page}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {current_page && total && limit && (
            <div className="hidden md:block">
              Hiển thị {(current_page - 1) * limit + 1}–
              {Math.min(current_page * limit, total)} của {total} kết quả
            </div>
          )}

          <SelectParams />
        </div>
      </div>

      <div className="pt-[30px] w-full">
        <div className="px-[15px] pb-[30px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
            {data?.map((item) => (
              <Cart key={item.id} data={item} />
            ))}
          </div>

          {data && current_page && last_page && (
            <Pagination
              currentPage={Number(current_page)}
              lastPage={Number(last_page)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
