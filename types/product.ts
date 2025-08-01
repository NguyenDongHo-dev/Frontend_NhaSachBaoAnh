import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  description: string;
  short_description: string;
  discount: number;
  sold: number;
  price: number;
  stock: number;
  image: string[];
  rating: string;
  category: Category;
  reated_at: string;
  updated_at: string;
}

export interface ProductResponse {
  data: Product[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
}

export interface ProductDetailsResponse {
  data: Product;
}
