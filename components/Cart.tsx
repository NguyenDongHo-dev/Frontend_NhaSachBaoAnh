import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "./client/Button";

interface IProps {
  data: Product;
}

export default function Cart({ data }: IProps) {
  return (
    <div className="w-full cursor-pointer flex flex-col gap-1.5 items-center">
      <div className="relative w-full aspect-[4/5] group">
        <div className="absolute top-0 left-0 z-10 mt-[30px] md:text-[1em]  flex items-center justify-center bg-primary text-[.9em] font-bold size-[44px] rounded-full text-white ">
          -12{data.discount}%
        </div>

        <Link href={`/san-pham/${data.slug}`}>
          <Image
            src={`${process.env.API_SERVER}/${data.image[0]}`}
            fill
            alt={data.name}
            className="object-cover"
          />
          {data.image.length > 0 && (
            <div className=" z-[999] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              <Image
                src={`${process.env.API_SERVER}/${data.image[1]}`}
                fill
                alt={data.name}
                className="object-cover"
              />
            </div>
          )}
        </Link>
      </div>
      <div className="text-center line-clamp-2 text-[#0d6ec3] hover:text-primary duration-200">
        <Link href={`/san-pham/${data.slug}`}>{data.name}</Link>
      </div>
      <div className="text-center text-primary">{data.price}</div>
      <div className="mx-auto ">
        <Button className="text-primary border-primary hover:bg-primary hover:text-white">
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
}
