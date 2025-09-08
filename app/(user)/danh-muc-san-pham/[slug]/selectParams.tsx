"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SelectParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sort = searchParams.get("sort") || "latest";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", e.target.value);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };
  return (
    <div>
      <select
        value={sort}
        onChange={handleChange}
        className="border-1 w-[278px] h-[50px] pl-[11px] pr-[22px]"
      >
        <option value="latest">Sắp xếp theo mới nhất</option>
        <option value="price_asc">Sắp xếp theo giá: thấp đến cao</option>
        <option value="price_desc">Sắp xếp theo giá: cao đến thấp</option>
      </select>
    </div>
  );
}
