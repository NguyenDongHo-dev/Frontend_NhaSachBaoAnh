import type { Metadata } from "next";
import Cartpage from "./cartPage";

export const metadata: Metadata = {
  title: "Giỏ hàng – Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <Cartpage />;
}
