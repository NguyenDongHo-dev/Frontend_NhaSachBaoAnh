"use client";

import Loading from "@/components/loading ";
import { useAppSelector } from "@/hooks/redux";
import { fetchDetailOrder } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatPrice } from "@/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import NotFondComponent from "@/components/client/NotFond";

export default function DetailsOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>();
  const isFirstLoad = useRef(false);
  const tokenStoge = localStorage.getItem("refresh_Token");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isFirstLoad.current) return;
    isFirstLoad.current = true;
    const fetchApiDetailOrder = async () => {
      setLoading(true);
      if (tokenStoge) {
        const res = await fetchDetailOrder({
          idOrder: Number(id),
          token: tokenStoge,
        });
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setOrder(res.data);
        setLoading(false);
      }
    };
    fetchApiDetailOrder();
  }, [id]);

  const isStates = (status: string) => {
    let str = "";
    switch (status) {
      case "padding":
        str = "Đang xử lý";
        break;
      case "in_transit":
        str = "Đang giao hàng";
        break;
      case "completed":
        str = "Hoàn tất";
        break;
      case "cancelled":
        str = "Đã hủy";
        break;
      default:
        str = "Không xác định";
    }
    return str;
  };

  if (notFound) return <NotFondComponent />;
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[500px]">
          <Loading />;
        </div>
      ) : (
        <div className="mt-[30px] md:mt-0 mx-auto max-w-laptop px-[15px] pt-[30px]">
          <h1 className="text-primary text-[1.1em] font-semibold uppercase  ">
            Chi tiết hóa đơn
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <div className="font-bold">Mã hóa đơn:</div>
            <div>{order?.order_number}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-[30px] grid-cols-1  mt-4 ">
            <div className="bg-gray-200 rounded-[10px] p-2 ">
              <div className="">
                <h1 className="text-center font-bold text-primary pb-3 ">
                  Thông tin người nhận hàng
                </h1>
                <div className="flex flex-col gap-1 text-[15px]">
                  <div className="line-clamp-2">
                    <span className="font-bold ">Tên Người nhận hàng:</span>{" "}
                    <samp>{order?.order_recipient_name}</samp>
                  </div>
                  <div className="line-clamp-2">
                    <span className="font-bold  ">Số điện thoại:</span>{" "}
                    <samp>{order?.recipient_phone}</samp>
                  </div>
                  <div>
                    <span className="font-bold ">Địa chỉ:</span>{" "}
                    <samp>{order?.shipping_address}</samp>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-[10px] p-2 ">
              <div className="">
                <h1 className="text-center font-bold text-primary pb-3 ">
                  Hình thức giao hàng
                </h1>
                <div className="flex flex-col gap-1 text-[15px]">
                  <div>
                    <span className="font-bold ">Phương thúc giao hàng:</span>{" "}
                    <samp>{order?.delivery_method}</samp>
                  </div>
                  <div>
                    <span className="font-bold ">Phí giao hành:</span>{" "}
                    <samp>{formatPrice(order?.price_shipping ?? 0)}đ </samp>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 rounded-[10px] p-2  ">
              <div className="">
                <h1 className="text-center font-bold text-primary pb-3 ">
                  Hình thức thanh toán
                </h1>
                <div className="flex flex-col gap-1 text-[15px]">
                  <div>
                    <span className="font-bold ">Thanh toán khi nhận hàng</span>{" "}
                  </div>
                  <div>
                    <span className="font-bold ">Thanh toán:</span>{" "}
                    <span
                      className={`font-bold     ${
                        order?.paid === 1 ? "text-green-500" : "text-red-500"
                      } `}
                    >
                      {order?.paid === 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold ">Trạng thái:</span>{" "}
                    <samp>{isStates(order?.status!)}</samp>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="font-bold text-primary mt-10">Chi tiết sản phẩm</h1>
          <div className="bg-gray-200 p-2 rounded-[10px] mt-4">
            <div className="grid md:grid-cols-[1fr_70px_150px_150px] grid-cols-[1fr_100px] font-bold items-center text-center gap-1">
              <div>Sản phẩm</div>
              <div className="hidden md:block">Số lượng</div>
              <div className="hidden md:block">Đơn giá</div>
              <div className="text-primary  ">Tổng cộng</div>
            </div>
            <div className="py-2 mt-2 bg-white rounded-[4px] ">
              <div className="flex flex-col gap-5">
                {order?.order_items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid md:grid-cols-[1fr_70px_150px_150px]  grid-cols-[1fr_100px]  items-center gap-1"
                  >
                    <div className=" ml-5 flex gap-4 items-center ">
                      <div className="relative size-[80px] min-w-[80px] ">
                        <Image
                          fill
                          alt={`${item.product.name}`}
                          src={`${process.env.API_SERVER}/${item.product.image[0]}`}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="line-clamp-2">{item.product.name}</div>
                        <div className="block md:hidden mt-1">
                          <div className="flex items-center gap-0.5  ">
                            <div className="font-bold">{item.quantity}x</div>
                            <div>{formatPrice(item.price)}đ</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center hidden md:block">
                      {item.quantity}
                    </div>
                    <div className="text-center hidden md:block">
                      {formatPrice(item.price)} đ
                    </div>
                    <div className="text-center">
                      {formatPrice(item.price * item.quantity)} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <div className="flex flex-col gap-2 items-end">
              <div className="font-medium ">
                Giá sản phẩm: {formatPrice(order?.total_price!)} đ
              </div>
              <div className="font-medium">
                Phí giao hàng: {formatPrice(order?.price_shipping!)} đ
              </div>
              <div className="bg-yellow-100 p-1 rounded-md text-right font-bold text-primary text-lg">
                Thành tiền: {formatPrice(order?.total_all!)} đ
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
