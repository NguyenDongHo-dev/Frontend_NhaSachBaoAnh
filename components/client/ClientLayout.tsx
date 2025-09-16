"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
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

  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRehydrated(true);
      unsub();
    });
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!rehydrated) return;

      if (!token && !user.isLoggedIn) {
        const res = await fetch(`${process.env.API_SERVER}/api/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const accessToken = data.token;

          const userRef = await fetchDetailUser({ token: data.token });

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
        }
      }
    };

    checkAndRefreshToken();
  }, [token, user.isLoggedIn, dispatch]);

  return <>{children}</>;
}
