"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginSuccess, logout } from "@/redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { fetchDetailUser } from "@/services/userService";

interface JwtPayload {
  id: number;
  role: string;
}

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [isClient, setIsClient] = useState(false);
  const { token } = user;

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const refresh = localStorage.getItem("refresh_Token");

      if (!token && refresh) {
        try {
          const res = await fetch(
            `${process.env.API_SERVER}/api/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${refresh}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            const accessToken = data.token;

            const userRef = await fetchDetailUser(accessToken);

            const decode = jwtDecode<JwtPayload>(accessToken);
            const { role } = decode;

            dispatch(
              loginSuccess({
                user: { ...userRef.data, role },
                token: accessToken,
              })
            );
          } else {
            dispatch(logout());
            localStorage.setItem("refresh_Token", "");
            router.push("/dang-nhap");
          }
        } catch (err) {
          console.error("Lỗi khi refresh token:", err);
          localStorage.setItem("refresh_Token", "");
          router.push("/dang-nhap");
        }
      }
    };

    checkAndRefreshToken();
  }, []);

  return <>{children}</>;
}
