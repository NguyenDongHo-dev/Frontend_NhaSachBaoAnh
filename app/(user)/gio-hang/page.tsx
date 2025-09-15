"use client";

import Quantity_button from "@/components/client/Quantity_button";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { X, MoveLeft } from "lucide-react";
import Button from "@/components/client/Button";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  removeItem,
  updateQuantity,
  updateShip,
} from "@/redux/slices/cartSlice";
import Modal from "@/components/client/Modal";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils";
import { toast } from "react-toastify";

export default function page() {
  const dispatch = useAppDispatch();
  const reoter = useRouter();
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [shipping, setShipping] = useState<number>(cart.shipping || 30000);

  const totalPrice = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const grandTotal = useMemo(
    () => totalPrice + shipping,
    [totalPrice, shipping]
  );

  useEffect(() => {
    dispatch(updateShip(shipping));
  }, [shipping]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleQuantity = (type: string, productId: number) => {
    const item = cart.items.find((item) => item.id === productId);
    if (!item) return;

    const newQuantity =
      type === "+" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    if (cart.err) {
      toast.error(cart.err);
    }
  };

  const removeCart = (id: number) => {
    dispatch(removeItem(id));
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-laptop mx-auto mt-[60px]">
        <div className="flex items-center justify-center ">
          <div className="flex flex-col gap-2 items-center">
            <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link href={"/cua-hang"}>
              <Button className="bg-primary text-white font-bold py-2 px-3">
                Quay trở lại cửa hàng{" "}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  //onClichPayment
  const handlePayment = () => {
    if (!user.isLoggedIn) {
      setShowModal(true);
    } else {
      reoter.push("/thanh-toan");
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          label="Bạn có cần phải đăng nhập để tiến thành thanh toán"
          onClose={() => setShowModal(false)}
          onConfirm={() => reoter.push("/dang-nhap")}
        />
      )}
      <div className=" max-w-laptop mx-auto md:pt-[30px] pt-[50px] px-[15px] ">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_462px]   ">
          <div className="lg:text-[.9em] text-[14px] lg:border-r border-[#ececec] lg:pr-[30px]">
            <div className="grid uppercase grid-cols-[1fr_auto] md:grid-cols-[1fr_78px_95px_90px] items-center border-b-[3px] border-[#ececec] ">
              <div className="p-[7px]  order-first">Sản phẩm</div>
              <div className="p-[7px] hidden md:block text-left"> Giá </div>
              <div className="p-[7px] order-last  ">Số lượng</div>
              <div className="p-[7px]  md:order-last hidden md:block text-right">
                Tạm tính
              </div>
            </div>
            <div>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_78px_95px_90px] items-center border-[#ececec] border-b py-[15px] "
                >
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center ">
                    <div className="flex items-center  gap-1.5 ">
                      <div
                        onClick={() => removeCart(item.id)}
                        className=" hidden cursor-pointer text-[#ccc] hover:text-black hover:border-black transition-colors duration-200  size-[24px] lg:flex items-center justify-center rounded-full border-2 border-[#ccc]"
                      >
                        <X size={13} />
                      </div>

                      <div className="relative">
                        <Image
                          width={77}
                          height={77}
                          className="object-contain"
                          src={`${process.env.API_SERVER}/${item.image}`}
                          alt={item.name}
                        />

                        <div
                          onClick={() => removeCart(item.id)}
                          className="absolute -top-1 -left-1 lg:hidden cursor-pointer text-[#ccc] hover:text-black hover:border-black transition-colors duration-200  size-[24px] flex items-center justify-center rounded-full border-2 border-[#ccc]"
                        >
                          <X size={13} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="text-[#0d6ec3] hover:text-primary duration-200 transition-colors line-clamp-3 cursor-pointer">
                        <Link href={`/san-pham/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="md:hidden ">
                        {item.quantity}x{" "}
                        <bdi className="font-bold text-[#111]">
                          {item.quantity && item.price ? (
                            <div className="flex items-start gap-0.5">
                              {formatPrice(item.quantity * item.price)}
                              <span className="text-[10px] underline">đ</span>
                            </div>
                          ) : (
                            0
                          )}
                        </bdi>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex font-bold text-[#111] px-[7px] items-start gap-0.5 ">
                    {formatPrice(item.price)}
                    <span className="text-[10px] underline">đ</span>
                  </div>
                  <div className="md:px-[7px]">
                    <Quantity_button
                      quantity={item.quantity ?? 1}
                      setQuantity={(val: number) => {
                        dispatch(
                          updateQuantity({ id: item.id, quantity: val })
                        );
                      }}
                      onClick={(type: string) => handleQuantity(type, item.id)}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="hidden md:flex font-bold text-[#111] items-start gap-0.5  ">
                      {formatPrice(item.quantity * item.price)}
                      <span className="text-[10px] underline">đ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-[10px] pb-[15px]">
              <Link href={"/cua-hang"}>
                <Button className="text-primary py-1 px-3 font-bold border-primary border hover:text-white hover:bg-primary duration-200 transition-colors">
                  <div className="flex items-center gap-1 ">
                    <MoveLeft size={14} />
                    <div>Tiếp tục xem sản phẩm</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:text-[.9em] text-[14px] lg:pl-[30px]">
            <h5 className="uppercase font-medium border-b-[3px] border-[#ececec] py-[7px] ">
              Tổng cộng giỏ hàng
            </h5>
            <div className="flex justify-between  items-center py-[7px] border-b border-[#ececec] ">
              <div>Tạm tính</div>
              <bdi className="font-bold text-[#111]  flex items-start gap-0.5  ">
                {formatPrice(totalPrice)}
                <span className="text-[10px] underline">đ</span>
              </bdi>
            </div>
            <div className="flex flex-col gap-3">
              <div>Vận chuyển</div>
              <div className="flex items-center gap-0.5">
                <input
                  onChange={(e) => setShipping(parseInt(e.target.value))}
                  type="radio"
                  id="shipping"
                  name="shipping"
                  value="30000"
                  checked={shipping === 30000}
                />
                 {" "}
                <label htmlFor="ship" className="flex items-center gap-0.5">
                  Giao hàng toàn quốc:{" "}
                  <div className="flex items-start gap-0.5 font-bold text-[#111]">
                    <bdi className="">30.000</bdi>
                    <span className="text-[10px] underline">đ</span>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-0.5">
                <input
                  onChange={(e) => setShipping(parseInt(e.target.value))}
                  type="radio"
                  id="shipping"
                  name="shipping"
                  value="45000"
                  checked={shipping === 45000}
                />
                 {" "}
                <label htmlFor="shipping" className="flex items-center gap-0.5">
                  Ship hỏa tốc 24/7:{" "}
                  <div className="flex items-start gap-0.5 text-[#111] font-bold ">
                    <bdi className="">45.000</bdi>
                    <span className="text-[10px] underline">đ</span>
                  </div>
                </label>
              </div>
              <div>
                <div>
                  Giao hàng đến{" "}
                  <bdi className="font-bold text-[#111] ">Thành phố Hà Nội</bdi>
                  .
                </div>
              </div>
              <div className="cursor-pointer text-[#0d6ec3] hover:text-primary transition-colors duration-200">
                Đổi địa chỉ
              </div>
              <div className="flex items-center justify-between border-t border-b-[3px] border-[#ececec] py-[7px]">
                <div>Tổng</div>
                <bdi className="font-bold text-[#111] flex gap-0.5 items-start ">
                  {formatPrice(grandTotal)}{" "}
                  <span className="text-[10px] underline">đ</span>
                </bdi>
              </div>
              <div className="pt-[10px]">
                <Button
                  onClick={handlePayment}
                  className="bg-primary py-2 text-white font-bold  hover:bg-[#CC1212] w-full transition-colors duration-200"
                >
                  Tiến hành thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
