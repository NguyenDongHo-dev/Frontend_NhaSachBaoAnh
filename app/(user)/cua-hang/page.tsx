"use client";

import { ProductListResponse } from "@/components/client/SearchHeader";
import { fetchAllProduct } from "@/services/productService";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductList from "./productList";
import NotFound from "../not-found";

export default function StorePage() {
  const searchParams = useSearchParams();
  const searchName = searchParams.get("name") || "";
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState<ProductListResponse>();
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "latest";

  const limit = 12;

  useEffect(() => {
    const fetchSearchParams = async () => {
      setLoading(true);
      try {
        const res = await fetchAllProduct({
          page,
          limit,
          sort,
          searchName,
        });

        setProductSearch(res);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchParams();
  }, [searchName, page, sort]);

  return (
    <div className="md:mt-0 mt-[30px] pt-5  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
      <ProductList
        dataRer={productSearch}
        loading={loading}
        searchName={searchName}
      />
    </div>
  );
}
