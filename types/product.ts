import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  status: number;
  description: string;
  short_description: string;
  discount: number;
  sold: number;
  price: number;
  stock: number;
  image: {
    id: number;
    url: string;
  }[];
  rating: string;
  category: Category;
  created_at: string;
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
  success?: boolean;
}
