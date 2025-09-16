import {
  Product,
  ProductDetailsResponse,
  ProductResponse,
} from "@/types/product";

interface playLoatNew {
  token: string;
  form: any;
  productId?: number;
}

export const fetchAllDetailsProduct = async (
  slug: string
): Promise<ProductDetailsResponse | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/product/${slug}`, {
    // next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
};

export const fetchAllProduct = async ({
  page = 1,
  limit,
  sort,
  status,
  categoryId,
  searchName,
}: {
  page: number;
  limit: number;
  sort: string;
  status?: string;
  categoryId?: string;
  searchName?: string;
}): Promise<ProductResponse> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
    sort: sort,
  };
  if (status) {
    params.status = status;
  }
  if (categoryId) {
    params.categoryId = categoryId;
  }
  if (searchName) {
    params.name = searchName;
  }
  const queryParams = new URLSearchParams(params);
  const res = await fetch(
    `${process.env.API_SERVER}/api/product?${queryParams}`
    // {
    //   next: { revalidate: 3600 },
    // }
  );

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  return data;
};

export const fetchNewProduct = async ({
  form,
  token,
}: playLoatNew): Promise<ProductDetailsResponse | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: form,
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchDeleteProduct = async ({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<ProductDetailsResponse> => {
  const res = await fetch(`${process.env.API_SERVER}/api/product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  return data;
};

export const fetchUpdateProduct = async ({
  form,
  token,
  productId,
}: playLoatNew): Promise<ProductDetailsResponse | null> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/product/${productId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: form,
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
