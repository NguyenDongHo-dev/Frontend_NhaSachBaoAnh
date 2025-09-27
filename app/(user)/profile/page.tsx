import type { Metadata } from "next";
import ProfilePgae from "./profile";

export const metadata: Metadata = {
  title: "Tài khoản – Nhà sách Bảo Anh",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfilePage() {
  return <ProfilePgae />;
}
