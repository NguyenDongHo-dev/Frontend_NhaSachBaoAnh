"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginSuccess, logout } from "@/redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { fetchDetailUser } from "@/services/userService";
import { fetchGetAllFavourite } from "@/services/favouriteService";
import { setFavourite } from "@/redux/slices/favouriteSlice";
import { usePathname } from "next/navigation";

interface JwtPayload {
  id: number;
  role: string;
  exp: number;
}

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      let currentToken;
      if (user.token) {
        currentToken = user.token;
      }

      try {
        if (currentToken) {
          const decoded = jwtDecode<JwtPayload>(currentToken);
          const now = Math.floor(Date.now() / 1000);

          if (decoded.exp <= now) {
            const res = await fetch(
              `${process.env.API_SERVER}/api/refresh-token`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            if (!res.ok) throw new Error("refresh fail");

            const data = await res.json();
            currentToken = data.token;

            const decodedNew = jwtDecode<JwtPayload>(currentToken);
            const userRef = await fetchDetailUser({ token: currentToken });

            dispatch(
              loginSuccess({
                user: { ...userRef.data, role: decodedNew.role },
                token: currentToken,
              })
            );
          }
        } else if (user.isLoggedIn) {
          const res = await fetch(
            `${process.env.API_SERVER}/api/refresh-token`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (!res.ok) throw new Error("refresh fail");

          const data = await res.json();
          currentToken = data.token;

          const decoded = jwtDecode<JwtPayload>(currentToken);
          const userRef = await fetchDetailUser({ token: currentToken });

          dispatch(
            loginSuccess({
              user: { ...userRef.data, role: decoded.role },
              token: currentToken,
            })
          );
        }
      } catch {
        dispatch(logout());
      }
    };

    checkAndRefreshToken();
  }, [user.token, user.isLoggedIn, dispatch]);

  useEffect(() => {
    const fetchFavourite = async () => {
      if (user.token && user.user?.id && pathname !== "/favourite") {
        const res = await fetchGetAllFavourite({
          idUser: user.user.id,
          token: user.token,
        });
        if (res) {
          if (res.data.length > 0) {
            dispatch(setFavourite(res.data));
          }
        }
      }
    };
    fetchFavourite();
  }, [user.token, user?.user?.id]);

  return <>{children}</>;
}
