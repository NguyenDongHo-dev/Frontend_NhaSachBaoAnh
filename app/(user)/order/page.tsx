import type { Metadata } from "next";
import AllOrderDetailUserPage from "./orderPage";

export const metadata: Metadata = {
  title: "Đơn hàng – Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MyOrder() {
  return <AllOrderDetailUserPage />;
}
