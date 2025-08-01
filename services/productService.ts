import { ProductDetailsResponse, ProductResponse } from "@/types/product";

export const fetchAllDetailsProduct = async (
  slug: string
): Promise<ProductDetailsResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/product/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};

export const fetchAllProduct = async (
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
    `${process.env.API_SERVER}/api/product?${queryParams}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};
