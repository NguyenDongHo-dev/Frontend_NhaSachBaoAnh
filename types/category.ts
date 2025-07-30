export interface Category {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  reated_at?: string;
  updated_at?: string;
}

export interface CategoryResponse {
  data: Category[];
}
