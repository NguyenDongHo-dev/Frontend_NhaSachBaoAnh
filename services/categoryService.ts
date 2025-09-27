import {
  Category,
  CategoryProductListResponse,
  CategoryResponse,
  CategoryResponseOne,
} from "@/types/category";

interface playLoat {
  token: string;
  category: Category;
}

interface playLoatDetele {
  token: string;
  id: number;
}

interface playLoatNew {
  token: string;
  form: {
    name: string;
    status: number;
  };
}

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
): Promise<CategoryProductListResponse> => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sort: sort,
  });

  const url = `${process.env.API_SERVER}/api/category/type/${slug}?${queryParams}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: {
          products: [],
          category: null,
        },
        total: 0,
        limit,
        current_page: page,
        last_page: 1,
        status: res.status,
      };
    }

    try {
      const data = await res.json();
      return data;
    } catch (parseError) {
      return {
        data: {
          products: [],
          category: null,
        },
        total: 0,
        limit,
        current_page: page,
        last_page: 1,
        status: 500,
      };
    }
  } catch (error) {
    return {
      data: {
        products: [],
        category: null,
      },
      total: 0,
      limit,
      current_page: page,
      last_page: 1,
      status: 500,
    };
  }
};

export const geetDetailsCatogory = async (
  slug: string
): Promise<CategoryResponseOne | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/category/${slug}`, {
    cache: "force-cache",
    next: { revalidate: 1800 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchUpdateCategory = async ({
  category,
  token,
}: playLoat): Promise<CategoryResponseOne | null> => {
  const res = await fetch(
    `${process.env.API_SERVER}/api/category/${category.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchDeleteCategory = async ({
  id,
  token,
}: playLoatDetele): Promise<CategoryResponseOne | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchNewCategory = async ({
  form,
  token,
}: playLoatNew): Promise<CategoryResponseOne | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
