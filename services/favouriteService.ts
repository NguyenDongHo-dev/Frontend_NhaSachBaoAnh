import {
  FavouriteGetIDProductResponse,
  FavouriteOfProductResponse,
  FavouriteResponse,
} from "@/types/favourite";
import { ison } from "@/types/order";
import { promises } from "dns";

interface playLoatNew {
  token: string;
  product_id?: Number;
  idUser: number | undefined;
}

interface playLoatGet extends playLoatNew {
  page: number;
  limit: number;
}

export const fetchFavourite = async ({
  product_id,
  token,
  idUser,
}: playLoatNew): Promise<FavouriteResponse | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/wishlist/${idUser}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ product_id }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchGetAllFavourite = async ({
  token,
  idUser,
}: playLoatNew): Promise<FavouriteGetIDProductResponse | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/wishlist/${idUser}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchProductOfFavourite = async ({
  token,
  page,
  limit,
  idUser,
}: playLoatGet): Promise<FavouriteOfProductResponse | null> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  const queryParams = new URLSearchParams(params);
  const res = await fetch(
    `${process.env.API_SERVER}/api/wishlist/product/${idUser}?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

export const fetchRemoveFavourite = async ({
  token,
  idUser,
  product_id,
}: playLoatNew): Promise<ison | null> => {
  const res = await fetch(`${process.env.API_SERVER}/api/wishlist/${idUser}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ product_id }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
