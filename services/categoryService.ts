import { CategoryResponse } from "@/types/category";
import { ProductResponse } from "@/types/product";

export const fetchAllCategory = async (): Promise<CategoryResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/category`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};

export const getProductsByCategory = async (
  slug: string,
  page: number = 1,
  limit: number,
  sort: string
): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sort: sort,
  });

  const res = await fetch(
    `${process.env.API_SERVER}/api/category/type/${slug}?${queryParams}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};
