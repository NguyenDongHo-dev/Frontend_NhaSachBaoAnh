import { ison } from "./order";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: string;
  status: number;
}

export interface GetDetailReview extends ison {
  data: Review;
}

export interface GetReviews extends ison {
  data: Review[];
  total: number;
  limit: number;
  current_page?: number;
  last_page?: number;
}
