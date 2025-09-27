"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "@/hooks/redux";

interface MyJwtPayload {
  role: number;
  type?: string;
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      try {
        if (!user.isLoggedIn) {
          if (pathname !== "/") router.replace("/");
          console.log("Chưa login, chờ xử lý...");
          return;
        }

        if (user.token) {
          const { role } = jwtDecode<MyJwtPayload>(user.token);

          if (role === 1) {
            setAuthorized(true);
          } else {
            if (pathname !== "/") {
              router.replace("/");
            }
          }
        }
      } catch (error) {
        if (pathname !== "/") {
          router.replace("/");
        }
      } finally {
        setChecked(true);
      }
    };

    checkToken();
  }, [user.token, user.isLoggedIn, router, pathname]);

  if (!checked) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
