"use client";
import Button from "@/components/client/Button";
import Pagination from "@/components/client/Pagination";
import { OderAllOderOfUser } from "@/types/order";
import { formatDateVN, formatPrice } from "@/utils";
import Link from "next/link";

interface Props {
  dataRer?: OderAllOderOfUser;
}

export default function RenderDataOrders({ dataRer }: Props) {
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
  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]">Quản lý hóa đơn</h1>
      <div className="w-full overflow-x-auto rounded-lg shadow mt-2 ">
        <table className="w-full text-left table-fixed border-collapse  ">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b text-center w-[120px]">Mã</th>
              <th className="p-3 border-b text-center">Sản phẩm</th>
              <th className="p-3 border-b text-center w-[200px]">
                Thông tin giao hàng
              </th>
              <th className="p-3 border-b text-center w-[120px]">
                Chế độ ship
              </th>
              <th className="p-3 border-b text-center w-[120px]">
                Ngày đặt hàng
              </th>
              <th className="p-3 border-b text-center w-[120px]">Tình trạng</th>
              <th className="p-3 border-b text-center w-[150px]">Tổng tiền</th>
              <th className="p-3 border-b text-center w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataRer?.data.map((item, i) => (
              <tr
                key={item.id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-2 text-center font-medium text-gray-700">
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
                      <button className="px-3 py-1 w-full text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Xem chi tiết
                      </button>
                    </Link>
                    <button className="px-3 py-1 w-full text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                      Hủy đơn
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <Pagination
          currentPage={dataRer?.current_page!}
          lastPage={dataRer?.last_page!}
        />
      </div>
    </div>
  );
}
