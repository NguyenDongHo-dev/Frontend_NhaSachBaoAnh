"use client";

import React, { useEffect, useRef, useState } from "react";
import CartNav from "./CartNav";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/redux/slices/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { fetchLogoutUser } from "@/services/userService";
import { clearFavourite } from "@/redux/slices/favouriteSlice";

export default function CartHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.user);
  const [show, setShow] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const publicRoutes = [
    "/dang-nhap",
    "/dang-ki",
    "/danh-muc-san-pham",
    "/gio-hang",
    "/san-pham",
    "/cua-hang",
  ];

  const startCloseTimer = () => {
    timerRef.current = setTimeout(() => {
      setShow(false);
    }, 4000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  const clearCloseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleLogout = async () => {
    await fetchLogoutUser();
    const isPublic =
      pathname === "/" ||
      publicRoutes.some((path) => pathname.startsWith(path));

    if (!isPublic) {
      router.push("/");
    }

    dispatch(logout());
    dispatch(clearFavourite());
    setShow(false);
  };

  return (
    <div className="flex items-center justify-end gap-3 flex-1  ">
      <CartNav />
      <div className="hidden md:block h-[30px] w-0.5 opacity-50 bg-[rgba(0,0,0,.1)]"></div>
      {user.isLoggedIn && user.user?.email ? (
        <div ref={wrapperRef} className="relative hidden md:block">
          <div
            onClick={() => setShow((pew) => !pew)}
            className="text-primary text-[12px] hidden md:block cursor-pointer  "
          >
            {user.user.email}
          </div>

          {show && (
            <div
              onMouseEnter={clearCloseTimer}
              onMouseLeave={startCloseTimer}
              className="absolute w-[200px] right-0 top-7 bg-white shadow-2xs border border-gray-300 rounded-[4px] z-30 p-2"
            >
              <div className="flex flex-col gap-2">
                <Link onClick={() => setShow(false)} href={"/profile"}>
                  <div className="hover:bg-primary   hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-[4px]">
                    Thông tin tài khoản
                  </div>
                </Link>
                <Link onClick={() => setShow(false)} href={"/favourite"}>
                  <div className="hover:bg-primary   hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-[4px]">
                    Sản phẩm đã yêu thích
                  </div>
                </Link>

                <Link onClick={() => setShow(false)} href={"/order"}>
                  <div className="hover:bg-primary   hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-[4px]">
                    Đơn hàng của bạn
                  </div>
                </Link>

                <div
                  onClick={handleLogout}
                  className="hover:bg-primary   hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-[4px]"
                >
                  Thoát
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href={"/dang-nhap"}>
          <button className="hidden font-medium md:block hover:bg-[#CC1212] cursor-pointer uppercase w-[119px] h-[32px] text-white bg-primary rounded-full text-[14px]">
            Đăng nhập
          </button>
        </Link>
      )}
    </div>
  );
}
