"use client";

import Quantity_button from "@/components/client/Quantity_button";
import loiKhuyen from "../../public/100-loi-khuyen-bds.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, MoveLeft } from "lucide-react";
import Button from "@/components/client/Button";
import Link from "next/link";

export default function page() {
  const [quantity, setQuantity] = useState<number>(1);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleQuantity = (type: string) => {
    setQuantity((prev) => {
      if (type === "+") return prev + 1;
      if (type === "-" && prev > 1) return prev - 1;
      return prev;
    });
  };
  return (
    <div className=" max-w-laptop mx-auto md:pt-[30px] pt-[50px]  px-[15px] ">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_462px]   ">
        <div className="lg:text-[.9em] text-[14px] border-r border-[#ececec] lg:pr-[30px]">
          <div className="grid uppercase grid-cols-[1fr_auto] md:grid-cols-[1fr_78px_95px_auto] items-center justify-end border-b-[3px] border-[#ececec] ">
            <div className="p-[7px]  order-first">Sản phẩm</div>
            <div className="p-[7px] hidden md:block text-left"> Giá </div>
            <div className="p-[7px] order-last  ">Số lượng</div>
            <div className="p-[7px]  md:order-last hidden md:block text-right">
              Tạm tính
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto] gap-2 md:gap-3 items-center border-[#ececec] border-b py-[15px] ">
              <div className="relative">
                <Image
                  width={77}
                  height={77}
                  className="object-contain ml-[7]"
                  src={loiKhuyen}
                  alt="loi khuyen"
                />
                <div className="absolute -top-[5px] left-0 z-20 size-[24px] flex items-center justify-center rounded-full border-2 border-[#ccc]">
                  <X size={18} color="#ccc" />
                </div>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <div className=" text-[#0d6ec3] hover:text-primary duration-200 transition-colors line-clamp-2">
                  100 Lời Khuyên Đầu Tư Bất Động Sản Khôn Ngoan Nhất
                </div>
                <div className="md:hidden">
                  1x<bdi className="font-bold text-[#111]"> 126.000 ₫</bdi>
                </div>
              </div>
              <div className="hidden md:block font-bold text-[#111]">
                126.000 ₫
              </div>
              <div>
                <Quantity_button
                  quantity={quantity}
                  setQuantity={setQuantity}
                  onClick={handleQuantity}
                />
              </div>
              <div className="hidden md:block font-bold text-[#111] pr-[7px]">
                126.000 ₫
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-[10px] pb-[15px]">
            <Link href={"/cua-hang"}>
              <Button className="text-primary border-primary border hover:text-white hover:bg-primary duration-200 transition-colors">
                <div className="flex items-center gap-1 ">
                  <MoveLeft size={14} />
                  <div>Tiếp tục xem sản phẩm</div>
                </div>
              </Button>
            </Link>
            <Button className="bg-primary text-white opacity-50 hover:bg-[#CA1212] transition-colors duration-200 ">
              Cập nhật giỏ hàng
            </Button>
          </div>
        </div>
        <div className="lg:text-[.9em] text-[14px] lg:pl-[30px]">
          <h5 className="uppercase font-medium border-b-[3px] border-[#ececec] py-[7px] ">
            Tổng cộng giỏ hàng
          </h5>
          <div className="grid grid-cols-2 items-center py-[7px] border-b border-[#ececec] ">
            <div>Tạm tính</div>
            <bdi className="font-bold text-[#111] text-right">126.000 ₫</bdi>
          </div>
          <div className="flex flex-col gap-3">
            <div>Vận chuyển</div>
            <div>
              <input type="radio" id="html" name="fav_language" value="HTML" /> {" "}
              <label htmlFor="html">
                Giao hàng toàn quốc:{" "}
                <bdi className="font-bold text-[#111]">45.000 ₫</bdi>
              </label>
            </div>
            <div>
              <input type="radio" id="html" name="fav_language" value="HTML" /> {" "}
              <label htmlFor="html">
                Ship hỏa tốc 24/7:{" "}
                <bdi className="font-bold text-[#111]">45.000 ₫</bdi>
              </label>
            </div>
            <div>
              <div>
                Giao hàng đến{" "}
                <bdi className="font-bold text-[#111] ">Thành phố Hà Nội</bdi>.
              </div>
            </div>
            <div className="cursor-pointer text-[#0d6ec3] hover:text-primary transition-colors duration-200">
              Đổi địa chỉ
            </div>
            <div className="flex items-center justify-between border-t border-b-[3px] border-[#ececec] py-[7px]">
              <div>Tổng</div>
              <bdi className="font-bold text-[#111] ">182.000 ₫</bdi>
            </div>
            <div className="pt-[10px]">
              <Button className="bg-primary text-white font-bold  hover:bg-[#CC1212] w-full transition-colors duration-200">
                Tiến hành thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
