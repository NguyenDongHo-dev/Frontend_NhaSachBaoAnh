"use client";

import { Category } from "@/types/category";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import SearchHeader from "./SearchHeader";
import { fetchLogin, fetchLogoutUser } from "@/services/userService";

interface NavBarProps {
  data: Category[];
}

function NavBar({ data }: NavBarProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [showNavbar, setShowNavbar] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={` ${
          showNavbar
            ? "-translate-x-3 opacity-0 pointer-events-none "
            : "translate-x-0 opacity-100 pointer-events-auto"
        } cursor-pointer hover:bg-[#CC1212]  transition-all duration-300 bg-primary px-[0.6em] rounded-[5px] w-[32px] h-[32px] flex items-center justify-center`}
      >
        <Menu size={15} color="white" />
      </div>

      <div
        className={`fixed top-0 left-0 h-screen max-w-[300px] w-full bg-white shadow-lg z-50 duration-300 ${
          showNavbar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-[20px]">
          <div className="p-5 flex items-center">
            <SearchHeader />
          </div>

          <ul className=" font-bold !list-none !pl-0 text-[0.8em]">
            {data.map((item) => (
              <li
                onClick={handleToggle}
                className="uppercase py-[15px] pl-5 border-t-[1px] border-[#ececec]  text-[hsla(0,0%,40%,.85)] hover:bg-[rgba(0,0,0,.05)]"
                key={item.id}
              >
                <Link className="block" href={item.slug}>
                  {item.name}
                </Link>
              </li>
            ))}
            {!user.isLoggedIn && (
              <li
                onClick={handleToggle}
                className="uppercase  py-[15px] pl-5 border-t-[1px] border-[#ececec]  text-[hsla(0,0%,40%,.85)] hover:bg-[rgba(0,0,0,.05)]"
              >
                <Link className="block" href={"/dang-nhap"}>
                  Đăng nhâp
                </Link>
              </li>
            )}

            <div className="py-[25px] pl-5 text-black border-t-[1px] border-[#ececec]">
              SÁCH VÀ VĂN PHÒNG PHẨM ONLINE
            </div>

            {user.isLoggedIn && (
              <div className="flex justify-between gap-2 items-center px-5  border-t-[1px] border-[#ececec]">
                <div className=" py-[25px]  text-primary">
                  {user.user?.email}
                </div>
                <button
                  onClick={async () => {
                    dispatch(logout());
                    setShowNavbar(false);
                    await fetchLogoutUser();
                  }}
                  className="font-medium inline-block hover:bg-[#CC1212]  cursor-pointer uppercase p-3 text-white bg-primary rounded-full  "
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
            {user?.user?.role === 1 && (
              <div className="uppercase text-primary pl-5 hover:bg-primary hover:text-white duration-200 transition-colors py-3">
                <Link className="block" href={"/admin/dashboard"}>
                  Trang admin
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>

      <div
        className={`fixed top-2 right-2 z-[999] cursor-pointer hover:text-white transition-all duration-300 ${
          showNavbar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-3 opacity-0 pointer-events-none"
        }`}
        onClick={handleToggle}
      >
        <X size={28} />
      </div>

      {showNavbar && (
        <div
          className={`fixed inset-0 bg-[#0b0b0b] transition-opacity  ${
            showNavbar ? "opacity-25" : "opacity-0"
          }   z-40`}
          onClick={handleToggle}
        ></div>
      )}
    </>
  );
}

export default NavBar;
