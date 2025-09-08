"use client";

import { fetchAllCategory } from "@/services/categoryService";
import { Category } from "@/types/category";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequestProduct() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await fetchAllCategory();
      setCategory(data);
    };
    fetchCategories();
  }, []);

  const sort = searchParams.get("sort") || "latest";
  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "all";
  const name = searchParams.get("name") || "";

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearch(value);
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex">
        <input
          value={search}
          onChange={onChangeSearch}
          name="name"
          className="py-[3px] pl-[10px] border-t border border-b focus:outline-none rounded-tl-[3px] rounded-b-[3px] w-[200px]"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <div className="p-[3px]  border flex items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-400 duration-200 transition-colors ">
          <Search color="white" />
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <div>Sắp xếp:</div>
        <select
          onChange={handleChange}
          value={sort}
          name="sort"
          className="border-1 w-auto h-[30px] pl-[11px] pr-[22px]"
        >
          <option value="latest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="price_desc">Giá cao nhất</option>
          <option value="price_asc">Giá thấp nhất</option>
        </select>
      </div>
      <div className="flex gap-1 items-center">
        <div>Lọc:</div>
        <select
          value={categoryId}
          name="categoryId"
          onChange={handleChange}
          className="border-1 w-auto h-[30px] pl-[11px] pr-[22px]"
        >
          <option value={""}>--Chọn danh mục sản phẩm--</option>
          {category.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex gap-1 items-center">
        <div>Status: </div>
        <select
          value={status}
          name="status"
          onChange={handleChange}
          className="border-1 w-auto h-[30px] pl-[11px] pr-[22px]"
        >
          <option value="all">Tất cả</option>
          <option value="block">Hiện thị</option>
          <option value="hidden">Ẩn</option>
        </select>
      </div>
    </div>
  );
}
