"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { removeItem } from "@/redux/slices/cartSlice";
import { formatPrice } from "@/utils";
import { ShoppingBag, ShoppingBasket, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Badge() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [show, setShow] = useState<boolean>(false);
  const [showBadge, setShowBadge] = useState<boolean>(false);

  const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (totalQuantity === 0) {
      setShowBadge(false);
      return;
    }

    setShowBadge(true);

    if (pathname === "/gio-hang") {
      setShow(false);
      return;
    }
  }, [totalQuantity, pathname]);

  const prevQuantity = useRef(totalQuantity);

  useEffect(() => {
    if (totalQuantity > prevQuantity.current) {
      if (pathname !== "/gio-hang") {
        setShow(true);
      }
    }
    prevQuantity.current = totalQuantity;
  }, [totalQuantity, pathname]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  return (
    <>
      {showBadge && cart.items.length > 0 && (
        <div
          onClick={() => setShow((pew) => !pew)}
          className={`fixed transform transition-transform duration-500 ease-in-out z-[51]
             ${show ? "-translate-x-[300px]" : "translate-x-0"}
          bottom-4 right-3 cursor-pointer rounded-full flex items-center justify-center size-[60px] bg-white shadow-primary shadow-[0_1px_4px_0] border border-primary`}
        >
          <div className="absolute -top-2 -left-2 bg-primary text-white size-[28px] rounded-full flex items-center justify-center">
            {cart.lengthItmes}
          </div>
          <ShoppingBasket color="#FF1616" />
        </div>
      )}

      {show && (
        <div
          className={`fixed inset-0 bg-[#0b0b0b] transition-opacity duration-300 ease-in-out z-50 ${
            show ? "opacity-25" : "opacity-0"
          }`}
          onClick={() => setShow(false)}
        ></div>
      )}

      <div
        className={`bg-white flex flex-col w-[300px] fixed max-h-full bottom-0 right-0 z-[51] transform transition-transform duration-500 ease-in-out
        ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-center w-full p-[15px] border-b-2 relative border-[#eee]">
          <div className="flex items-center   font-normal gap-2 text-[20px] uppercase  ">
            <ShoppingBag />
            <h5>GIỎ HÀNG CỦA BẠN</h5>
          </div>
          <div
            onClick={() => setShow(false)}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
          >
            <X size={16} />
          </div>
        </div>
        <div className="flex-1 h-full  overflow-y-auto">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="py-4 px-[15px] flex  gap-[15px] items-center justify-between border-b border-[#eee]"
              >
                <div className="relative aspect-[4/5] size-[85px]">
                  <Image
                    src={`${process.env.API_SERVER}/${item.image}`}
                    alt={item.name}
                    fill
                    sizes="100%"
                    className="object-contain absolute"
                  />
                </div>
                <div className="flex flex-col flex-1 flex-wrap text-[16px] ">
                  <div className="font-bold ">{item.name}</div>
                  <div className="flex items-center gap-1">
                    <div className="text-gray-500">{item.quantity}</div>
                    <div className="text-gray-500">X</div>
                    <div className="font-bold ">
                      {formatPrice(item.price)}{" "}
                      <span className=" underline underline-offset-1"> đ</span>
                    </div>
                    <div>=</div>
                  </div>
                  <div className="font-bold">
                    {formatPrice(item.quantity * item.price)}
                  </div>
                </div>
                <div className=" cursor-pointer ">
                  <Trash2
                    onClick={() => dispatch(removeItem(item.id))}
                    size={15}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-[30px]">
              <div className="flex items-center justify-center">
                <div className="">
                  <h6 className="text-center">GIỎ HÀNG TRỐNG</h6>
                  <Link href={"/cua-hang"}>
                    <div className="text-center mt-[20px] font-bold text-white px-4 bg-primary py-2 hover:bg-[#CC1212] transition-colors duration-200 cursor-pointer ">
                      ĐẾN CỬA HÀNG
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full  bg-white pt-[10px] pb-[25px] px-[20px] shadow-[5px_-5px_10px_#0000001a]">
          {cart.items.length > 0 ? (
            <div>
              <h3 className="text-center text-[18px] font-semibold pb-[10px] pt-[5px]">
                Tổng: {formatPrice(cart.totalItmes)}{" "}
                <span className=" underline underline-offset-1"> đ</span>
              </h3>
              <div className="flex flex-col gap-[18px] w-full font-bold text-[18px] ">
                <Link onClick={() => setShow(false)} href={"/"}>
                  <div className="text-center text-white bg-primary py-2 hover:bg-[#CC1212] transition-colors duration-200 cursor-pointer  ">
                    CHỌN THÊM
                  </div>
                </Link>

                <Link onClick={() => setShow(false)} href={"/gio-hang"}>
                  <div className="text-center text-white bg-primary py-2 hover:bg-[#CC1212] transition-colors duration-200 cursor-pointer  ">
                    XEM GIỎ HÀNG
                  </div>
                </Link>
                <Link onClick={() => setShow(false)} href={"/thanh-toan"}>
                  <div className="text-center text-white bg-primary py-2 hover:bg-[#CC1212] transition-colors duration-200 cursor-pointer  ">
                    ĐẶT HÀNG
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <Link onClick={() => setShow(false)} href={"/"}>
              <div className="text-center text-white bg-primary py-2 hover:bg-[#CC1212] transition-colors duration-200 cursor-pointer  ">
                CHỌN THÊM
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
