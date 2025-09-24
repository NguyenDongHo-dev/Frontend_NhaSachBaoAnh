import { ison } from "./order";
import { Product } from "./product";

interface Favourite {
  id: number;
  user_id: number;
  product_id: number;

  created_at: string;
  updated_at: string;
}

export interface FavouriteResponse extends ison {
  data: Favourite;
  action?: string;
}

export interface FavouriteGetIDProductResponse extends ison {
  data: number[];
}

export interface FavouriteOfProductResponse extends ison {
  data: Product[];
}
