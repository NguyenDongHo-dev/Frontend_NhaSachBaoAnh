import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryResponse {
  data: Category[];
}

export interface CategoryResponseOne {
  success?: boolean;
  data: Category;
}

export interface CategoryProductListResponse {
  data: {
    products: Product[];
    category: Category | null;
  };
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
  success?: boolean;
  message?: string;
  status?: number;
}
