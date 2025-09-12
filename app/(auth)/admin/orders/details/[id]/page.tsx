"use client";

import Input from "@/components/client/Input";
import Modal from "@/components/client/Modal";
import Quantity_button from "@/components/client/Quantity_button";
import SearchableDropdown from "@/components/client/SearchableDropdown";
import Loading from "@/components/loading ";
import { dataVn } from "@/data";
import {
  fetchDetailByAdminOrder,
  fetchUpdateOrderByAdmin,
} from "@/services/orderService";
import { Order } from "@/types/order";
import { formatDateVN, formatPrice } from "@/utils";
import { FileDown, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function DetailsOrderPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const tokenStoge = localStorage.getItem("refresh_Token");
  const [detailsOrder, setDetailsOrder] = useState<Order>();
  const [loading, setLoading] = useState(false);

  const [street, setStreet] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedWart, setSelectedWart] = useState<
    { Code: string; FullName: string; ProvinceCode: string }[] | undefined
  >(undefined);
  const [ward, setWard] = useState<string>("");

  const [priceShipping, setPriceShipping] = useState<number>(0);

  const [showRemoveItem, setShowRemoveItem] = useState(false);
  const [idRemoveItem, setIdRemoveItem] = useState<Number | null>(null);
  const [nameRemoveItem, setNameRemoveItem] = useState<string | null>(null);

  const [showUpdateItem, setShowUpdateItem] = useState(false);

  const [err, setErr] = useState<{
    order_recipient_name?: string;
    recipient_phone?: string;
    selectedCity?: string;
    ward?: string;
    street?: string;
    isItem?: string;
    isPaid?: string;
  }>({});

  useEffect(() => {
    const city = dataVn.find((isCity) => isCity.FullName === selectedCity);
    if (city) {
      setSelectedWart(city.Wards);
      setWard("");
    }
  }, [selectedCity]);

  const fetchDetailOrderAdmin = async () => {
    setErr({});
    if (tokenStoge) {
      setLoading(true);
      const res = await fetchDetailByAdminOrder({
        token: tokenStoge,
        idOrder: id,
      });
      if (res.success) {
        setLoading(false);
        setDetailsOrder(res.data);

        const [street, ward, city] = res.data.shipping_address
          .split(",")
          .map((s) => s.trim());
        setPriceShipping(res.data.price_shipping);

        setStreet(street || "");
        setWard(ward || "");
        setSelectedCity(city || "");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailOrderAdmin();
  }, [id]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setErr((prev) => {
      const newErr = { ...prev };
      delete newErr.selectedCity;
      return newErr;
    });
  };

  const handleSelectWard = (ward: string) => {
    setWard(ward);
    setErr((prev) => {
      const newErr = { ...prev };
      delete newErr.ward;
      return newErr;
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDetailsOrder({
      ...detailsOrder!,
      [name]: value,
    });

    if (err[name as keyof typeof err]) {
      setErr((prev) => {
        const newErr = { ...prev };
        delete newErr[name as keyof typeof err];
        return newErr;
      });
    }
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;

    if (!detailsOrder) return;

    if (name === "shipping") {
      value === "Ship hỏa tốc"
        ? setPriceShipping(45000)
        : setPriceShipping(30000);
      setDetailsOrder({
        ...detailsOrder!,
        delivery_method: value,
      });
    }

    if (name === "status") {
      setDetailsOrder({
        ...detailsOrder,
        status: value,
      });
    }

    if (name === "paid") {
      setDetailsOrder({
        ...detailsOrder,
        paid: Number(value),
      });
    }
  };

  const handleRemoveItem = () => {
    const updatedItems =
      detailsOrder?.order_items?.filter(
        (item) => item.product.id !== idRemoveItem
      ) ?? [];
    setDetailsOrder({
      ...detailsOrder!,
      order_items: updatedItems,
    });
  };

  const totalAllPrice = useMemo(() => {
    return (
      detailsOrder?.order_items?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) ?? 0
    );
  }, [detailsOrder?.order_items]);

  const totalAll = useMemo(() => {
    return totalAllPrice + priceShipping;
  }, [totalAllPrice, priceShipping]);

  const updataOrder = async () => {
    const errors: {
      order_recipient_name?: string;
      recipient_phone?: string;
      selectedCity?: string;
      ward?: string;
      street?: string;
      isItem?: string;
      isPaid?: string;
    } = {};

    const address = `${street}, ${ward}, ${selectedCity}`;

    if (!detailsOrder?.order_recipient_name.trim()) {
      errors.order_recipient_name = "Tên người nhận không được để trống";
    }

    if (!detailsOrder?.recipient_phone.trim()) {
      errors.recipient_phone = "Số điện thoại không được để trống";
    } else if (!/^\d{9,11}$/.test(detailsOrder.recipient_phone)) {
      errors.recipient_phone =
        "Số điện thoại phải là số và có từ 9 đến 11 chữ số";
    }

    if (!street.trim()) {
      errors.street = "Địa chỉ cụ thể không được để trống";
    }

    if (!ward.trim()) {
      errors.ward = "Phường/Xã bắt buộc phải chọn";
    }

    if (!selectedCity.trim()) {
      errors.selectedCity = "Tỉnh/Thành phố bắt buộc phải chọn";
    }

    if (!detailsOrder?.order_items || detailsOrder?.order_items.length === 0) {
      errors.isItem = "Phải còn ít nhất 1 sản phẩm trong hóa đơn";
    }

    if (detailsOrder?.paid === 1 && detailsOrder.status === "cancel") {
      errors.isPaid =
        "Đơn hàng đã hủy nên cập nhất đã thanh toán là không được";
    }

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }

    const body = {
      id: detailsOrder?.id,
      shipping_address: address,
      recipient_phone: detailsOrder?.recipient_phone ?? "",
      order_recipient_name: detailsOrder?.order_recipient_name ?? "",
      notes: detailsOrder?.notes ?? "",
      delivery_method: detailsOrder?.delivery_method ?? "",
      price_shipping: priceShipping,
      status: detailsOrder?.status ?? "",
      paid: detailsOrder?.paid ?? 0,
      products: detailsOrder?.order_items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    if (tokenStoge) {
      setLoading(true);
      const res = await fetchUpdateOrderByAdmin({
        formOder: body,
        token: tokenStoge,
        id: detailsOrder?.id!,
      });
      if (res.success) {
        toast.success("Đã cập nhật hành công");
        setDetailsOrder(res.data);
      }
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {showRemoveItem && (
        <Modal
          label={`Bạn có chắc muốn xóa sản phẩm "${nameRemoveItem}" ra khổi hóa đơn ?`}
          onClose={() => {
            setShowRemoveItem(false);
            setIdRemoveItem(null);
            setNameRemoveItem(null);
          }}
          onConfirm={handleRemoveItem}
        />
      )}

      {showUpdateItem && (
        <Modal
          label={`Bạn có chắc muốn cập nhật hóa đơn`}
          onClose={() => {
            setShowUpdateItem(false);
          }}
          onConfirm={updataOrder}
        />
      )}

      <div className="">
        <div className="flex gap-4">
          <div className="flex-1 h-[calc(100vh-32px)] overflow-y-auto border-r border-gray-200 pr-3">
            <div>
              <h1 className="text-primary text-[1.1em] font-bold uppercase  ">
                Chi tiết hóa đơn
              </h1>
              <div className="flex gap-1 items-center mt-2 ">
                <div className="font-bold">Mã hóa đơn:</div>
                <div>{detailsOrder?.order_number}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-1 items-center mt-2 ">
                  <div className="font-bold">Ngày đặt đơn hàng:</div>
                  <div>{formatDateVN(detailsOrder?.created_at!)}</div>
                </div>
                {detailsOrder?.paid === 1 && detailsOrder.paid_at && (
                  <div className="flex gap-1 items-center mt-2 ">
                    <div className="font-bold">Ngày thanh toán:</div>
                    <div>{formatDateVN(detailsOrder?.paid_at!)}</div>
                  </div>
                )}
              </div>
            </div>
            <h1 className=" text-[1em] text-primary font-bold uppercase mt-2 ">
              Thông tin người nhận hàng
            </h1>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex w-full gap-4 ">
                <div className="flex-1">
                  <Input
                    label="Tên người nhận hàng"
                    nameInput="order_recipient_name"
                    className="w-full"
                    value={detailsOrder?.order_recipient_name!}
                    onChangeForm={onChange}
                  />
                  {err.order_recipient_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {err.order_recipient_name}
                    </p>
                  )}
                </div>
                <div className=" flex-1 ">
                  <Input
                    label="Số điện thoại"
                    nameInput="recipient_phone"
                    className="w-full"
                    value={detailsOrder?.recipient_phone!}
                    onChangeForm={onChange}
                  />
                  {err.recipient_phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {err.recipient_phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-[6px] block text-[#222] font-medium">
                Đỉa chỉ giao hàng:
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-[22px] sm:items-start gap-[6px] ">
                <div className="flex-1">
                  <SearchableDropdown
                    label="Tỉnh/Thành phố "
                    placeholder="Chọn tỉnh/thành phố"
                    items={dataVn}
                    selected={selectedCity}
                    setSelected={handleSelectCity}
                  />
                  {err.selectedCity && (
                    <p className="text-sm text-red-500 mt-1">
                      {err.selectedCity}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <SearchableDropdown
                    label="Phường/Xã "
                    placeholder="Chọn phường/xã"
                    items={selectedWart || []}
                    selected={ward}
                    setSelected={handleSelectWard}
                  />
                  {err.ward && (
                    <p className="text-sm text-red-500 mt-1">{err.ward}</p>
                  )}
                </div>
              </div>
              <div>
                <Input
                  label="Địa chỉ cụ thể"
                  nameInput="street"
                  className="w-full"
                  value={street}
                  onChangeForm={onChange}
                />
                {err.street && (
                  <p className="text-sm text-red-500 mt-1">{err.street}</p>
                )}
              </div>

              <div className="mb-[4px] block text-[#222] font-medium">
                Notes:
              </div>
              <textarea
                cols={10}
                value={detailsOrder?.notes ?? ""}
                onChange={(e) =>
                  setDetailsOrder((prev) =>
                    prev ? { ...prev, notes: e.target.value } : prev
                  )
                }
                className="p-3 shadow border border-[#ddd] focus:outline-none focus:shadow w-[100%]"
                name="notes"
                placeholder="Ghi chú của đơn hàng"
              ></textarea>
            </div>
            <h1 className=" text-[1em] text-primary font-bold uppercase mt-2 ">
              Sản phẩm đã đặt
            </h1>
            <div className="mt-2 flex flex-col gap-3">
              <div className="bg-gray-200 p-2 rounded-[10px]">
                <div className="grid md:grid-cols-[1fr_120px_100px_150px] grid-cols-[1fr_100px] font-bold items-center text-center gap-1">
                  <div>Sản phẩm</div>
                  <div className="hidden md:block">Số lượng</div>
                  <div className="hidden md:block">Đơn giá</div>
                  <div className="text-primary  ">Tổng cộng</div>
                </div>
                <div className="py-2 mt-2 bg-white rounded-[4px] ">
                  <div className="flex flex-col gap-5">
                    {detailsOrder?.order_items &&
                    detailsOrder.order_items.length > 0 ? (
                      detailsOrder.order_items.map((item) => (
                        <div
                          key={item.product.id}
                          className="grid md:grid-cols-[1fr_120px_100px_150px] grid-cols-[1fr_100px] items-center gap-1"
                        >
                          <div className="ml-8 flex gap-4 items-center relative">
                            <div
                              onClick={() => {
                                setShowRemoveItem(true);
                                setIdRemoveItem(item.product.id);
                                setNameRemoveItem(item.product.name);
                              }}
                              className="absolute -left-6 top-1/2 -translate-y-1/2 z-50 border rounded-full cursor-pointer"
                            >
                              <X size={18} />
                            </div>
                            <div className="relative size-[80px] min-w-[80px]">
                              <Image
                                fill
                                alt={item.product.name}
                                src={`${process.env.API_SERVER}/${item.product.image[0]}`}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="line-clamp-2">
                                {item.product.name}
                              </div>
                              <div className="block md:hidden mt-1">
                                <div className="flex items-center gap-0.5">
                                  <div className="font-bold">
                                    {item.quantity}x
                                  </div>
                                  <div>{formatPrice(item.price)}đ</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" hidden md:flex justify-center">
                            <Quantity_button
                              quantity={item.quantity}
                              setQuantity={(newQuantity) => {
                                const updatedItems =
                                  detailsOrder.order_items.map((orderItem) =>
                                    orderItem.product.id === item.product.id
                                      ? { ...orderItem, quantity: newQuantity }
                                      : orderItem
                                  );
                                setDetailsOrder({
                                  ...detailsOrder,
                                  order_items: updatedItems,
                                });
                              }}
                              onClick={(type) => {
                                if (type === "+") {
                                  const newQuantity = item.quantity + 1;
                                  const updatedItems =
                                    detailsOrder.order_items.map((orderItem) =>
                                      orderItem.product.id === item.product.id
                                        ? {
                                            ...orderItem,
                                            quantity: newQuantity,
                                          }
                                        : orderItem
                                    );
                                  setDetailsOrder({
                                    ...detailsOrder,
                                    order_items: updatedItems,
                                  });
                                }
                                if (type === "-") {
                                  const newQuantity = Math.max(
                                    1,
                                    item.quantity - 1
                                  );
                                  const updatedItems =
                                    detailsOrder.order_items.map((orderItem) =>
                                      orderItem.product.id === item.product.id
                                        ? {
                                            ...orderItem,
                                            quantity: newQuantity,
                                          }
                                        : orderItem
                                    );
                                  setDetailsOrder({
                                    ...detailsOrder,
                                    order_items: updatedItems,
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="text-center hidden md:block">
                            {formatPrice(item.price)} đ
                          </div>
                          <div className="text-center">
                            {formatPrice(item.price * item.quantity)} đ
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Không có sản phẩm nào trong đơn hàng
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {err.isItem && (
                <p className="text-sm text-red-500 mt-1">{err.isItem}</p>
              )}
            </div>
          </div>
          <div className="w-[500px]">
            <div>
              <h1 className=" text-[1em] font-bold uppercase mt-2 ">
                Hình thức giao hàng
              </h1>

              <select
                value={detailsOrder?.delivery_method}
                onChange={handleChangeSelect}
                name="shipping"
                className="border-1 w-[300px] h-[50px] pl-[11px] pr-[22px] block mt-2"
              >
                <option value={"Giao hàng toàn quốc"}>
                  Giao hàng toàn quốc
                </option>
                <option value={"Ship hỏa tốc"}>Ship hỏa tốc</option>
              </select>
              <h1 className=" text-[1em] font-bold uppercase mt-2 ">
                Hình thức thanh toán
              </h1>
              <div className="mt-2">Tình trạng đơn hàng:</div>
              <select
                value={detailsOrder?.status}
                onChange={handleChangeSelect}
                name="status"
                className="border-1 w-[300px] h-[50px] pl-[11px] pr-[22px] block mt-2"
              >
                <option value={"padding"}>Đang xử lý</option>
                <option value={"shipping"}>Đang giao hàng</option>
                <option value={"success"}>Thành công</option>
                <option value={"cancel"}>Hủy đơn hàng</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <h1 className=" text-[1em] font-bold uppercase mt-2 ">Tổng</h1>
              <div className="flex items-center gap-1">
                <div>Tổng giá sản phẩm:</div>
                <div>{formatPrice(totalAllPrice!)} đ</div>
              </div>
              <div className="flex items-center gap-1">
                <div>Phí giao hàng:</div>
                <div>{formatPrice(priceShipping!)} đ</div>
              </div>
              <div className="bg-yellow-100 text-primary font-bold w-fit py-2 px-3 text-[18px]">
                Tổng: {formatPrice(totalAll!)}đ
              </div>
            </div>

            <select
              value={detailsOrder?.paid}
              onChange={handleChangeSelect}
              name="paid"
              className="border-1 w-[300px] h-[50px] pl-[11px] pr-[22px] block mt-2"
            >
              <option value={0}>Chua thanh toán</option>
              <option value={1}>Đã thanh toán</option>
            </select>
            {err.isPaid && (
              <p className="text-sm text-red-500 mt-1">{err.isPaid}</p>
            )}
            <div className="flex gap-4 mt-5">
              <button
                onClick={() => router.push("/admin/orders")}
                className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                ← Quay lại danh sách đơn
              </button>
              <button
                onClick={() => fetchDetailOrderAdmin()}
                className="px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200  rounded-md  cursor-pointer"
              >
                Làm mới
              </button>
              <button
                onClick={() => setShowUpdateItem(true)}
                className="px-3 py-2 bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
