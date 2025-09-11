"use client";
import Input from "@/components/client/Input";
import Modal from "@/components/client/Modal";
import Pagination from "@/components/client/Pagination";
import Loading from "@/components/loading ";
import { fetchCancelledByAdmin } from "@/services/orderService";
import { OderAllOderOfUser, Order } from "@/types/order";
import { formatDateVN, formatPrice, isStates } from "@/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SelectHTMLAttributes, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  dataRer?: OderAllOderOfUser;
  loading: boolean;
}

export default function RenderDataOrders({ dataRer, loading }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenStoge = localStorage.getItem("refresh_Token");
  const [orders, setOrders] = useState<Order[]>(dataRer?.data ?? []);

  const searchType = searchParams.get("typeSearch") || "all";

  const [placeholderSearch, setPlaceholderSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [showCancelled, setShowCancelled] = useState(false);
  const [idCancelled, setIdCancelled] = useState<number | null>(null);

  useEffect(() => {
    if (dataRer?.data) {
      setOrders(dataRer.data);
    }
  }, [dataRer]);

  const cancelledOrder = async () => {
    if (tokenStoge) {
      const res = await fetchCancelledByAdmin({
        token: tokenStoge,
        id: idCancelled!,
      });
      if (res.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === idCancelled ? { ...order, status: "cancel" } : order
          )
        );

        toast.success("Đã hủy đơn hàng thành công");
      }
      setIdCancelled(null);
      setShowCancelled(false);
    }
  };

  const typePlaceholder = (type: string) => {
    if (type === "name") {
      setPlaceholderSearch("tên khách hàng");
    } else if (type === "phone") {
      setPlaceholderSearch("số điện thoại");
    } else if (type === "all") {
      setPlaceholderSearch("tất cả");
    } else {
      setPlaceholderSearch("mã hóa đơn");
    }
  };

  useEffect(() => {
    typePlaceholder(searchType);
  }, [searchType]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearch(value);
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };
  const handleSelectSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());
    if (name === "typeSearch") {
      newParams.set("typeSearch", value);
    } else {
      newParams.set("status", value);
    }
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      {showCancelled && (
        <Modal
          label={`Bạn có chắc muốn hủy đơn hàng này`}
          onClose={() => {
            setShowCancelled(false);
            setIdCancelled(null);
          }}
          onConfirm={cancelledOrder}
        />
      )}
      <h1 className="font-bold text-primary text-[20px]">Quản lý hóa đơn</h1>
      <div className="flex justify-between">
        <div className="mt-2 flex items-center gap-4">
          <input
            value={search}
            onChange={onChangeSearch}
            name="search"
            className="border focus:outline-none p-1 rounded-[4px]"
            type="text"
            placeholder={`Search ${placeholderSearch}...`}
          />
          <div className="flex gap-2 items-center">
            <div className="font-bold">Tìm kiếm theo:</div>
            <select
              onChange={handleSelectSearch}
              className="border p-1 rounded-[4px]"
              name="typeSearch"
            >
              <option value="all">Tất cả</option>
              <option value="name">Tên khách hàng</option>
              <option value="phone">Số điện thoại</option>
              <option value="id">Mã đơn</option>
            </select>
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <div className="font-bold">Lọc:</div>
            <select
              onChange={handleSelectSearch}
              className="border p-1 rounded-[4px]"
              name="status"
            >
              <option value="all">Tất cả</option>
              <option value="padding">Đang xử lí</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="success">Thành công</option>
              <option value="cancel">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg shadow mt-4 ">
            <table className="w-full text-left table-fixed border-collapse  ">
              <thead>
                <tr className={`bg-gray-100 text-gray-700 border-b `}>
                  <th className="p-3  text-center w-[120px]">Mã</th>
                  <th className="p-3  text-center">Sản phẩm</th>
                  <th className="p-3  text-center w-[200px]">
                    Thông tin giao hàng
                  </th>
                  <th className="p-3  text-center w-[120px]">Chế độ ship</th>
                  <th className="p-3  text-center w-[120px]">Ngày đặt hàng</th>
                  <th className="p-3  text-center w-[120px]">Tình trạng</th>
                  <th className="p-3  text-center w-[150px]">Tổng tiền</th>
                  <th className="p-3  text-center w-[120px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((item, i) => (
                    <tr
                      key={item.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"}
               
                hover:bg-blue-50  b  `}
                    >
                      <td
                        className={`p-2 text-center font-medium duration-200  transition-colors  ${
                          idCancelled && idCancelled === item.id
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {item.order_number}
                      </td>
                      <td className="p-2">
                        {item.order_items.map((details, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span>{details.product.name}</span>
                            <span className="font-bold text-red-500">
                              x{details.quantity}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Tên:</span>{" "}
                            {item.order_recipient_name}
                          </div>
                          <div>
                            <span className="font-semibold">SĐT:</span>{" "}
                            {item.recipient_phone}
                          </div>
                          <div>
                            <span className="font-semibold">Địa chỉ:</span>{" "}
                            {item.shipping_address}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center font-semibold text-gray-700">
                        {item.delivery_method}
                      </td>
                      <td className="p-2 text-center text-gray-600">
                        {formatDateVN(item.created_at)}
                      </td>
                      <td className="p-2 text-center text-gray-600">
                        {isStates(item.status)}
                      </td>
                      <td className="p-2 text-center font-bold text-primary">
                        {formatPrice(item.total_all)}đ
                      </td>
                      <td className="px-2 align-middle">
                        <div className="flex flex-col gap-2">
                          <Link href={`/admin/orders/details/${item.id}`}>
                            <button className="px-3 py-1 w-full text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                              Xem chi tiết
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setShowCancelled(true);
                              setIdCancelled(item.id);
                            }}
                            className="px-3 py-1 w-full text-sm bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                          >
                            Hủy đơn
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2">
            <Pagination
              currentPage={dataRer?.current_page!}
              lastPage={dataRer?.last_page!}
            />
          </div>
        </>
      )}
    </div>
  );
}
