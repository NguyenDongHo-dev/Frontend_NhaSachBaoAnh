"use client";

import { Order } from "@/types/order";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchAllOrderOflUser,
  fetchDeleteOderOfUser,
} from "@/services/orderService";
import { formatDateVN, formatPrice, isStates, statusColors } from "@/utils";
import Image from "next/image";
import Button from "@/components/client/Button";
import Link from "next/link";
import Loading from "@/components/loading ";
import Pagination from "@/components/client/Pagination";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/client/Modal";
import { toast } from "react-toastify";
import NotFondComponent from "@/components/client/NotFond";

interface OrderResponse {
  data?: Order[];
  total?: number;
  limit?: number;
  current_page?: number;
  last_page?: number;
}

export default function AllOrderDetailUserPage() {
  const searchParams = useSearchParams();
  const tokenStoge = localStorage.getItem("refresh_Token");
  const [allOder, setAllOder] = useState<OrderResponse>();
  const [loading, setLoading] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const page = Number(searchParams.get("page") || 1);
  const [notFound, setNotFound] = useState(false);
  const limit = 10;

  if (!tokenStoge) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="flex flex-col gap-2">
          <div>Bạn cần đăng nhập để xem đơn hàng.</div>
          <div className="mx-auto">
            <Link href={"/dang-nhap"}>
              <Button className="px-2 py-1 bg-primary  hover:bg-[#CC1212]  transition-all duration-300 text-white border-transparent font-bold rounded-[4px] text-[18px]">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!tokenStoge) return;
    const fetchApiDetailOrder = async () => {
      setLoading(true);
      if (tokenStoge) {
        const res = await fetchAllOrderOflUser({
          token: tokenStoge,
          limit,
          page,
        });
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setAllOder(res);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchApiDetailOrder();
  }, [page, tokenStoge]);

  if (loading) {
    return <Loading />;
  }

  if (!allOder?.data || allOder.data?.length === 0) {
    return <NotFondComponent />;
  }

  const handlerRemoveOrder = (id: number) => {
    setShowModalRemove(true);
    setSelectedId(id);
  };

  const confirmRemove = async () => {
    if (selectedId) {
      const res = await fetchDeleteOderOfUser({
        id: selectedId,
        token: tokenStoge,
      });
      if (res.success) {
        toast.success("Đã xóa đơn hàng hành công");
        setAllOder((prev) =>
          prev
            ? {
                ...prev,
                data: prev.data?.filter((order) => order.id !== selectedId),
              }
            : prev
        );
        setShowModalRemove(false);
        setSelectedId(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (!res.success) {
        toast.error(res.message);
        setShowModalRemove(false);
        setSelectedId(null);
      }
    }
  };

  return (
    <>
      {showModalRemove && (
        <Modal
          label="Bạn có chắc chấn muốn xóa đơn hàng này không"
          onClose={() => setShowModalRemove(false)}
          onConfirm={confirmRemove}
        />
      )}
      <div className="mt-[30px] md:mt-0 mx-auto max-w-laptop px-[15px] pt-[30px]">
        <h1 className="text-primary text-[1.1em] font-semibold uppercase  ">
          Đơn hàng của tôi
        </h1>
        <div className=" mt-2 flex flex-col gap-5 ">
          {allOder?.data.map((item) => (
            <div key={item.id} className=" bg-gray-200 rounded-[4px]   p-3">
              <div className="font-bold">
                Mã đơn hàng: <samp>{item.order_number}</samp>
              </div>
              <div className=" flex items-center gap-1">
                <div className="font-bold">Tình trang:</div>
                <div
                  className={`font-semibold ${
                    statusColors[item.status] || "text-gray-500"
                  }`}
                >
                  {isStates(item.status)}
                </div>
              </div>
              <div className=" flex items-center gap-1">
                <div className="font-bold">Thanh toán :</div>
                <span
                  className={`font-bold     ${
                    item?.paid === 1 ? "text-green-500" : "text-red-500"
                  } `}
                >
                  {item?.paid === 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <div className=" flex items-center gap-1">
                <div className="font-bold">Ngày đặt hàng:</div>
                <div>{formatDateVN(item.created_at)}</div>
              </div>
              <div className=" border-t border-l border-r border-b py-2 rounded-[4px] rounded-b-none mt-2">
                <div className="grid md:grid-cols-[1fr_70px_150px_150px] grid-cols-[1fr_100px] font-bold items-center text-center gap-1 ">
                  <div>Sản phẩm</div>
                  <div className="hidden md:block">Số lượng</div>
                  <div className="hidden md:block">Đơn giá</div>
                  <div className="text-primary  ">Tổng cộng</div>
                </div>
              </div>

              <div className="py-4  border-b border-r border-l">
                <div className="flex flex-col gap-5">
                  {item?.order_items.map((details) => (
                    <div
                      key={details.product.id}
                      className="grid md:grid-cols-[1fr_70px_150px_150px]  grid-cols-[1fr_100px]  items-center gap-1 r"
                    >
                      <div className=" ml-5 flex gap-4 items-center ">
                        <div className="relative size-[80px] min-w-[80px] bg-gray-200 ">
                          <Image
                            fill
                            alt={`${details.product.name}`}
                            src={`${process.env.API_SERVER}/${details.product.image[0]}`}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="line-clamp-2">
                            {details.product.name}
                          </div>
                          <div className="block md:hidden mt-1">
                            <div className="flex items-center gap-0.5  ">
                              <div className="font-bold">
                                {details.quantity}x
                              </div>
                              <div>{formatPrice(details.price)}đ</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center hidden md:block">
                        {details.quantity}
                      </div>
                      <div className="text-center hidden md:block">
                        {formatPrice(details.price)} đ
                      </div>
                      <div className="text-center">
                        {formatPrice(details.price * details.quantity)} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-yellow-100 p-1 rounded-md text-right font-bold text-primary text-lg">
                    Tổng tiền {formatPrice(item?.total_all!)} đ
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {item.status !== "cancel" ? (
                      <Button
                        onClick={() => handlerRemoveOrder(item.id)}
                        className="py-1 px-2 rounded-[4px] font-bold   "
                      >
                        Hủy đơn hàng
                      </Button>
                    ) : (
                      <div className="py-1 px-2 rounded-[4px] font-bold border text-red-500 cursor-default">
                        Đã hủy
                      </div>
                    )}
                    <Link href={`/order/${item.id}`}>
                      <Button className="py-1 px-2 bg-green-500 border-transparent text-white font-bold hover:bg-green-600 duration-200 transition-colors">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={allOder.current_page!}
          lastPage={allOder.last_page!}
        />
      </div>
    </>
  );
}
