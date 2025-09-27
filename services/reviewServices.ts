import { GetDetailReview, GetReviews } from "@/types/review";

interface playLoatNew {
  form: any;
  token: string;
}

export const fetchNewReview = async ({
  form,
  token,
}: playLoatNew): Promise<GetDetailReview | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/review`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchAllReviewByProduct = async ({
  id,
  limit,
  page = 1,
}: {
  id: number;
  limit: number;
  page: number;
}): Promise<GetReviews> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
  };

  const queryParams = new URLSearchParams(params);

  const res = await fetch(
    `${process.env.API_SERVER}/api/review/${id}?${queryParams}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};
