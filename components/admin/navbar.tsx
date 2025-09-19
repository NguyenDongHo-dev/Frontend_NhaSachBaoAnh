"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();

  const menus = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Người dùng", href: "/admin/users" },
    { name: "Sản phẩm", href: "/admin/product" },
    { name: "Đơn hàng", href: "/admin/orders" },
  ];

  return (
    <div className="min-w-[200px] fixed h-screen top-0 left-0 bottom-0 z-30  py-[15px] px-3 border-r-2 bg-blue-500 text-white ">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <Link href={"/"}>
              <House size={25} />
            </Link>
            <h1 className="text-center uppercase font-bold py-[15px]">
              Trang quản trị
            </h1>
          </div>

          <div className="flex flex-col gap-2 uppercase font-medium">
            {menus.map((item) => (
              <Link
                key={item.name}
                className={`pl-[15px] hover:bg-blue-400 py-2 rounded-[4px] ${
                  pathName.startsWith(item.href) && "bg-blue-400"
                }`}
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="pl-[15px] mb-[20px] cursor-pointer py-2  hover:bg-blue-300 rounded-[4px] uppercase font-bold">
          logout
        </div>
      </div>
    </div>
  );
}
