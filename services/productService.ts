import { ProductDetailsResponse } from "@/types/product";

export const fetchAllDetailsProduct = async (
  slug: string
): Promise<ProductDetailsResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/product/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};
