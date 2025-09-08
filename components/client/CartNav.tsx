"use client";

import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";
import React, { useMemo } from "react";
import { formatPrice } from "@/utils";

export default function CartNav() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <Link href="/gio-hang">
      <div className="cursor-pointer text-[hsla(0,0%,40%,.85)] md:w-auto flex justify-end items-center gap-2 text-[12px]">
        <div className="hidden md:flex items-center gap-1 hover:text-[hsla(0,0%,7%,.85)] whitespace-nowrap">
          <div className="uppercase">Giỏ hàng / </div>
          <div className=" flex items-start gap-0.5">
            <span>{formatPrice(cart.totalItmes)}</span>
            <span className="text-[10px] underline">đ</span>
          </div>
        </div>
        <div className="group hover:bg-primary hover:text-white duration-100 size-[28px] border-2 bg-white border-primary flex items-center justify-center text-[12px] text-primary font-bold relative">
          {cart.lengthItmes || 0}
          <div className="group-hover:after:top-[-50%] group-hover:after:transition-all group-hover:duration-100 after:-z-50 after:border-2 after:border-b-0 after:rounded-tr-[99px] after:border-primary after:rounded-tl-[99px] after:h-[10px] after:w-[14px] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[-30%]"></div>
        </div>
      </div>
    </Link>
  );
}
