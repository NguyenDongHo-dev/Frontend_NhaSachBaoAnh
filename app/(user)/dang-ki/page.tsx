import type { Metadata } from "next";
import RegisterPage from "./renderRegister";

export const metadata: Metadata = {
  title: "Đăng kí– Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Register() {
  return <RegisterPage />;
}
