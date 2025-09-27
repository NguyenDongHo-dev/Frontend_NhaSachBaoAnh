import type { Metadata } from "next";
import LoginPage from "./renderLogin";

export const metadata: Metadata = {
  title: "Đăng nhập – Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Login() {
  return <LoginPage />;
}
