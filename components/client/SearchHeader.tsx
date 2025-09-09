"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { fetchAllProduct } from "@/services/productService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { formatPrice } from "@/utils";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export interface ProductListResponse {
  data?: Product[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
  category?: Category;
}

export default function SearchHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState<ProductListResponse>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const debounce = useDebounce(search);
  const limit = 30;
  const sort = "latest";

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounce.length >= 3) {
      setOpen(true);
      setLoading(true);
      const fetchSearch = async () => {
        const res = await fetchAllProduct({
          page,
          limit,
          sort,
          searchName: debounce,
        });
        console.log(res);

        setProductSearch(res);
        setLoading(false);
      };
      fetchSearch();
    }
    if (debounce.length === 0) {
      setOpen(false);
      setProductSearch({});
      setLoading(false);
    }
  }, [debounce]);

  const onClickSearch = () => {
    if (search.trim()) {
      setOpen(false);
      setSearch("");
      router.push(
        `/cua-hang?name=${encodeURIComponent(search).replace(/%20/g, "+")}`
      );
    } else {
      router.push("/cua-hang");
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full ">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="px-[10px] h-[32px] w-full  border border-r-0 bg-white text-[12px] "
        type="text"
        placeholder="Tìm kiếm..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onClickSearch();
          }
        }}
        onFocus={() => {
          if (productSearch?.data && productSearch.data.length > 0) {
            setOpen(true);
          }
        }}
      />

      {open && (
        <div className="absolute top-full shadow w-full z-20 bg-white/90 max-h-[800px]   overflow-y-auto">
          {productSearch?.data?.map((item) => (
            <Link
              onClick={() => {
                setSearch("");
                setOpen(false);
              }}
              key={item.id}
              href={`/san-pham/${item.slug}`}
            >
              <div className="p-[10px] hover:bg-gray-100 duration-200 transition-colors cursor-pointer">
                <div className="grid grid-cols-[40px_1fr_120px] w-full items-center">
                  <div className="relative size-[40px] bg-white  ">
                    <Image
                      src={`${process.env.API_SERVER}/${item.image[0].url}`}
                      fill
                      alt={item.name}
                      className="object-contain"
                    />
                  </div>
                  <div className="line-clamp-3 text-[14px] pl-[10px]">
                    {item.name}
                  </div>
                  <div className="mx-auto flex gap-1.5 items-center text-[13px]">
                    <div className=" opacity-60 flex items-start gap-0.5 line-through">
                      {formatPrice(
                        Math.ceil(
                          item.price / (1 - item.discount / 100) / 1000
                        ) * 1000
                      )}
                      <span className="text-[10px] underline">đ</span>
                    </div>
                    <div className=" text-primary flex items-start gap-0.5 font-bold">
                      {formatPrice(item.price)}
                      <span className="text-[10px] underline">đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {productSearch?.data?.length === 0 && (
            <div className="p-[10px] hover:bg-gray-100 duration-200 transition-colors cursor-default">
              Không tìm thấy sản phẩm nào.
            </div>
          )}
        </div>
      )}

      <div className="size-[34px] flex items-center justify-center bg-primary absolute right-0 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : (
          <Search onClick={onClickSearch} size={18} className="text-white" />
        )}
      </div>
    </div>
  );
}
