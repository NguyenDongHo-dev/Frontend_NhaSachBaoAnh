"use client";

import Cart from "@/components/Cart";
import Pagination from "@/components/client/Pagination";
import Loading from "@/components/loading ";
import { getProductsByCategory } from "@/services/categoryService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SelectParams from "./selectParams";
import Link from "next/link";

interface Props {
  slug: string;
  dataRer: ProductListResponse;
}

interface ProductListResponse {
  products?: Product[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
  category?: Category;
}

export default function ProductList({ slug, dataRer }: Props) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "latest";
  const limit = 12;

  const [data, setData] = useState<ProductListResponse>({
    products: dataRer.products,
    total: dataRer.total,
    limit: dataRer.limit,
    current_page: dataRer.current_page,
    last_page: dataRer.last_page,
    category: dataRer.category,
  });
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current && page === 1 && dataRer?.products?.length) {
      isFirstLoad.current = false;
      return;
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProductsByCategory(slug, page, limit, sort);

        const { products, category } = res.data;
        setData({
          products,
          total: res.total,
          limit: res.limit,
          current_page: res.current_page,
          last_page: res.last_page,
          category,
        });
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, page, sort]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center md:justify-between justify-center w-full ">
            <div className="flex items-center gap-2  text-[1.15em]">
              <div className="uppercase cursor-pointer text-[hsla(0,0%,40%,.7)] font-normal hover:text-[#111] duration-200 ">
                <Link href={"/"}>Trang chủ</Link>
              </div>
              <span className="font-light text-[#222]">/</span>

              <div
                className={`uppercase  ${
                  page > 1
                    ? "text-[hsla(0,0%,40%,.7)]"
                    : "text-[#222] font-bold"
                } `}
              >
                {page > 1 ? (
                  <Link href={`/danh-muc-san-pham/${data.category?.slug}`}>
                    {data?.category?.name}
                  </Link>
                ) : (
                  <div> {data?.category?.name}</div>
                )}
              </div>
              {page > 1 && (
                <>
                  <span className="font-light text-[#222]">/</span>
                  <div className="uppercase text-black font-bold">
                    Trang {page}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {data?.current_page && data?.total && (
                <div className="hidden md:block">
                  Hiển thị {(data?.current_page - 1) * limit + 1}–
                  {Math.min(data?.current_page * limit, data?.total)} của{" "}
                  {data.total} kết quả
                </div>
              )}
              <SelectParams />
            </div>
          </div>
          <div className="pt-[30px] w-full">
            <div className="px-[15px] pb-[30px]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
                {data?.products?.map((item) => (
                  <Cart key={item.id} data={item} />
                ))}
              </div>
              {data.products != undefined &&
                data?.current_page &&
                data?.last_page && (
                  <Pagination
                    currentPage={Number(data.current_page)}
                    lastPage={Number(data.last_page)}
                  />
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
