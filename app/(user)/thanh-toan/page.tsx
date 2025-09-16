"use client";

import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import SearchableDropdown from "@/components/client/SearchableDropdown";
import { dataVn } from "@/data";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearCart, updateShip } from "@/redux/slices/cartSlice";
import { fetchCreateOrder } from "@/services/orderService";
import { formatPrice } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [street, setStreet] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedWart, setSelectedWart] = useState<
    { Code: string; FullName: string; ProvinceCode: string }[] | undefined
  >(undefined);
  const [ward, setWard] = useState<string>("");
  const [shipping, setShipping] = useState<number>(cart.shipping);

  const [formPayment, setFormPaymentPage] = useState({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    nodes: "",
  });

  const [err, setErr] = useState<{
    name?: string;
    phone?: string;
    selectedCity?: string;
    ward?: string;
    street?: string;
  }>({});

  useEffect(() => {
    const city = dataVn.find((isCity) => isCity.FullName === selectedCity);
    if (city) {
      setSelectedWart(city.Wards);
      setWard((prev) =>
        city.Wards.some((w) => w.FullName === prev) ? prev : ""
      );
    }
    setErr((prev) => {
      const newErr = { ...prev };
      delete newErr.ward;
      delete newErr.selectedCity;
      return newErr;
    });
  }, [selectedCity]);

  //form Payment
  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormPaymentPage({
      ...formPayment,
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

  useEffect(() => {
    dispatch(updateShip(shipping));
  }, [shipping, dispatch]);

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/gio-hang");
    }
  }, [cart.items.length, router]);

  useEffect(() => {
    if (user.user) {
      const newForm = {
        id: user.user.id,
        name: user.user.name || "",
        phone: user.user.phone || "",
        email: user.user.email || "",
        address: user.user.address || "",
        nodes: "",
      };

      setFormPaymentPage(newForm);

      if (newForm.address) {
        const [street, ward, city] = newForm.address
          .split(",")
          .map((s) => s.trim());

        setStreet(street || "");
        setSelectedCity(city || "");
        setWard(ward || "");
      }
    }
  }, [user.user]);

  //check is Login
  useEffect(() => {
    if (!user.token || !user.isLoggedIn) {
      router.push("/");
    }
  }, [dispatch, router]);

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

  const onCreaateOrder = async () => {
    const errors: {
      name?: string;
      phone?: string;
      selectedCity?: string;
      ward?: string;
      street?: string;
    } = {};

    if (!formPayment.name.trim()) {
      errors.name = "Họ và tên không được để trống";
    }

    if (!formPayment.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{9,11}$/.test(formPayment.phone)) {
      errors.phone = "Số điện thoại phải là số và có từ 9 đến 11 chữ số";
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

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }

    const address = `${street}, ${ward}, ${selectedCity}`;

    const formPost = new FormData();
    formPost.append("shipping_address", address);
    formPost.append("recipient_phone", formPayment.phone);
    formPost.append("order_recipient_name", formPayment.name);
    formPost.append("price_shipping", String(shipping));
    formPost.append(
      "delivery_method",
      shipping === 30000 ? "Giao hàng toàn quốc" : "Ship hỏa tốc"
    );
    formPost.append("notes", formPayment.nodes);

    cart.items.forEach((item, index) => {
      formPost.append(`products[${index}][product_id]`, item.id.toString());
      formPost.append(`products[${index}][quantity]`, item.quantity.toString());
    });

    const res = await fetchCreateOrder({
      token: user.token,
      formOder: formPost,
    });
    if (res?.success) {
      dispatch(clearCart());
      toast.success("Bạn đã đặt hàng thành công");
      router.push(`{/order/${res.order_id}}`);
    } else {
      toast.error("Đã xảy ra lỗi hãy thử lại");
    }
  };

  return (
    <div className="mt-[60px] max-w-laptop mx-auto md:mt-[30px] ">
      <div className="flex flex-col md:flex-row w-full ">
        <div className="px-[15px] pb-[30px] flex-1 ">
          <h3 className="text-primary text-[1.1em] font-semibold mb-2 uppercase">
            Thông tin thanh toán
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <Input
                onChangeForm={onChangeForm}
                type="text"
                nameInput="name"
                label="Họ và tên (*) "
                value={formPayment.name}
                className="w-full shadow"
              />
              {err.name && (
                <p className="text-sm text-red-500 mt-1">{err.name}</p>
              )}
            </div>

            <div className="flex flex-col  sm:flex-row   sm:gap-[22px] sm:items-start gap-[6px] ">
              <div className="flex-1">
                <div>
                  <Input
                    onChangeForm={onChangeForm}
                    type="text"
                    nameInput="phone"
                    label="Số điện thoại (*)"
                    value={formPayment.phone}
                    className="w-full shadow  "
                  />
                  {err.phone && (
                    <p className="text-sm text-red-500 mt-1">{err.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <Input
                  type="text"
                  nameInput="email"
                  label="Địa chỉ email"
                  value={formPayment.email}
                  className="w-full focus:shadow-none  cursor-default"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-[22px] sm:items-start gap-[6px] ">
              <div className="flex-1">
                <div>
                  <SearchableDropdown
                    label="Tỉnh/Thành phố (*)"
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
              </div>
              <div className="flex-1">
                <div>
                  <SearchableDropdown
                    label="Phường/Xã (*)"
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
            </div>

            <div>
              <Input
                onChangeForm={(e) => {
                  setStreet(e.target.value);
                  setErr((pew) => {
                    const newErr = { ...pew };
                    delete newErr.street;
                    return newErr;
                  });
                }}
                type="text"
                nameInput="street"
                label="Địa chỉ cụ thể (*)"
                value={street}
                className="w-full shadow"
              />
              {err.street && (
                <p className="text-sm text-red-500 mt-1">{err.street}</p>
              )}
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="block text-[#222] font-medium">
                Ghi chú đơn hàng (tuỳ chọn)
              </p>
              <textarea
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormPaymentPage({
                    ...formPayment,
                    [name]: value,
                  });
                }}
                cols={10}
                className="p-3 shadow border border-[#ddd] focus:outline-none focus:shadow w-[100%]"
                name="notes"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="px-[15px] md:max-w-[317px] lg:max-w-[420px] w-full ">
          <div className="p-[30px] bg-[rgba(0,0,0,.02)] shadow-[1px_1px_3px_0_rgba(0,0,0,.2),0_1px_0_rgba(0,0,0,.07),inset_0_0_0_1px_rgba(0,0,0,.05)]  ">
            <div className="lg:text-[.9em] text-[14px] ">
              <h3 className="text-primary text-[1.1em] font-semibold mb-2 uppercase">
                Đơn hàng của bạn
              </h3>
              <div className="flex justify-between text-black border-[#ECECEC] font-medium border-b-2 pb-[6px]">
                <div className="flex-1">Sản phẩm</div>
                <div className="inline-block">Tạm tính</div>
              </div>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 justify-between text-[.9em] text-black border-[#ECECEC]  border-b-2  py-[15px]"
                >
                  <div className="flex-1 text-[#666666] ">
                    {item.name}
                    <samp className="font-bold text-black">
                      {" "}
                      × {item.quantity}
                    </samp>
                  </div>
                  <div className=" font-semibold flex items-start gap-0.5">
                    {formatPrice(item.quantity * item.price)}
                    <span className="text-[10px] underline">đ</span>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 font-bold justify-between text-[.9em] text-black border-[#ECECEC]  border-b-2  py-[6px]">
                <div className="flex-1  ">Tạm tính</div>
                <div className="  flex items-start gap-0.5">
                  {formatPrice(cart.totalItmes)}
                  <span className="text-[10px] underline">đ</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div>Vận chuyển</div>
                <div className="flex items-center gap-0.5">
                  <input
                    onChange={(e) => setShipping(parseInt(e.target.value))}
                    type="radio"
                    id="shipping"
                    name="nationwide_delivery"
                    value="30000"
                    checked={shipping === 30000}
                  />
                   {" "}
                  <label htmlFor="ship" className="flex items-center gap-0.5 ">
                    Giao hàng toàn quốc:{" "}
                    <div className="flex items-start gap-0.5 font-bold text-[#111]">
                      <bdi className="">30.000 </bdi>
                      <span className="text-[10px] underline">đ</span>
                    </div>
                  </label>
                </div>
                <div className="flex items-center gap-0.5">
                  <input
                    onChange={(e) => setShipping(parseInt(e.target.value))}
                    type="radio"
                    id="shipping"
                    name="fast_delivery"
                    value="45000"
                    checked={shipping === 45000}
                  />

                  <label
                    htmlFor="shipping"
                    className="flex items-center gap-0.5"
                  >
                    {" "}
                      Ship hỏa tốc 24/7:
                    <div className=" flex items-start gap-0.5 font-bold text-[#111]">
                      <bdi className="">45.000 </bdi>
                      <span className="text-[10px] underline">đ</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t border-b-[3px] border-[#ececec] py-[7px]">
                  <div>Tổng</div>
                  <bdi className="font-bold text-[#111] flex items-start gap-0.5 ">
                    {formatPrice(cart.total)}{" "}
                    <span className="text-[10px] underline">đ</span>
                  </bdi>
                </div>
                <div>
                  <p className="text-[#111] font-semibold">
                    Trả tiền mặt khi nhận hàng
                  </p>
                  <p className="text-[#666666]">
                    Khách hàng thanh toán tiền mặt hoặc chuyển khoản khi nhận
                    được hàng từ nhân viên vận chuyển.
                  </p>
                </div>
                <div className="py-[10px]">
                  <Button
                    onClick={onCreaateOrder}
                    className="bg-primary px-3 py-2 text-white font-bold  hover:bg-[#CC1212] inline-block transition-colors duration-200"
                  >
                    Đặt hàng
                  </Button>
                </div>
                <p className="text-[#666666]">
                  Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng,
                  tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể
                  khác đã được mô tả trong{" "}
                  <samp className="text-[#0d6ec3] cursor-pointer">
                    chính sách riêng tư
                  </samp>{" "}
                  của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
