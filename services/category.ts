import { CategoryResponse } from "@/types/category";

export const fetchAllCategory = async (): Promise<CategoryResponse> => {

  const res = await fetch(`${process.env.API_SERVER}/category`, {
    next: { revalidate: 3600 },
  });

   if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};