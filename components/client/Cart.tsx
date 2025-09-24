"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addItem } from "@/redux/slices/cartSlice";
import { formatPrice } from "@/utils";
import { MoveRight } from "lucide-react";
import Favourite from "./Favourite";
import { fetchGetAllFavourite } from "@/services/favouriteService";
import { makeSelectIsFavourite } from "@/redux/slices/favouriteSlice";
import RemoveFavourite from "./removeFavourite";

interface IProps {
  data: Product;
  isShowFavouriteText?: boolean;
  handleRemoved?: (id: number) => void;
}

export default React.memo(function Cart({
  data,
  isShowFavouriteText,
  handleRemoved,
}: IProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const isLiked = useAppSelector(makeSelectIsFavourite(data.id));

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: data.id,
        name: data.name,
        price: data.price,
        quantity: 1,
        image: data.image?.[0]?.url || "",
        slug: data.slug,
        stock: data.stock,
      })
    );
  };

  return (
    <div>
      <div className="w-full cursor-pointer flex flex-col items-center group relative">
        <div className="relative w-full aspect-[4/5] group">
          {data.discount > 0 && (
            <div className="absolute top-5 -left-2 z-10 md:text-[1em]  flex items-center justify-center bg-primary text-[.9em] font-bold size-[44px] rounded-full text-white ">
              {data.discount}%
            </div>
          )}

          <Link href={`/san-pham/${data.slug}`}>
            <Image
              src={`${process.env.API_SERVER}/${data.image[0].url}`}
              fill
              alt={data.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover scale-90"
            />
            {data.image.length > 1 && (
              <div className=" z-[999] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                <Image
                  src={`${process.env.API_SERVER}/${data.image[1].url}`}
                  fill
                  alt={data.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
          </Link>
        </div>
        {!isShowFavouriteText && (
          <div
            className={`group-hover:opacity-100 transition-all duration-200 ${
              isLiked ? "opacity-100" : "opacity-0"
            } hover:bg-white cursor-pointer hover:text-primary text-white absolute right-1 top-5 bg-primary rounded-full size-[35px] flex items-center justify-center`}
          >
            <Favourite productId={data.id} />
          </div>
        )}

        <div className="text-[.75em] opacity-70 mt-2 uppercase ">
          <Link href={`/danh-muc-san-pham/${data.category.status}`}>
            {data.category.name}
          </Link>
        </div>
        <div className="text-[13px] text-center line-clamp-2 text-[#0d6ec3] hover:text-primary duration-200  h-[40px]">
          <Link href={`/san-pham/${data.slug}`}>{data.name}</Link>
        </div>
        <div className="mx-auto flex gap-1.5 items-center text-[14px]">
          <div className=" opacity-60 flex items-start gap-0.5 line-through">
            {formatPrice(
              Math.ceil(data.price / (1 - data.discount / 100) / 1000) * 1000
            )}
            <span className="text-[10px] underline">đ</span>
          </div>
          <div className=" text-primary flex items-start gap-0.5">
            {formatPrice(data.price)}
            <span className="text-[10px] underline">đ</span>
          </div>
        </div>

        <div className="mx-auto mt-2">
          {cart.some((item) => item.id === data.id) ? (
            <Link href="/gio-hang">
              <div className="flex items-center gap-1 font-bold text-[11px] text-[#0d6ec3] uppercase hover:text-primary transition-colors duration-200">
                <div></div> Xem giỏ hàng
                <MoveRight size={12} />
              </div>
            </Link>
          ) : data.stock > 0 ? (
            <Button
              onClick={handleAddToCart}
              className="text-primary border-primary hover:bg-primary px-[13px] py-1 hover:text-white text-[11px] font-bold"
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <div className="text-primary border-primary  py-1  text-[14px] font-bold cursor-default">
              Đã hết hàng
            </div>
          )}
        </div>
      </div>
      {isShowFavouriteText && (
        <RemoveFavourite idProduct={data.id} handleRemoved={handleRemoved} />
      )}
    </div>
  );
});
