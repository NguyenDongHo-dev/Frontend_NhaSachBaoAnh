"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  role: number;
  type?: string;
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      try {
        const token = localStorage.getItem("refresh_Token");
        if (!token) {
          router.replace("/");
          return;
        }

        const { role, type } = jwtDecode<MyJwtPayload>(token);
        if (role === 1 && type === "refresh") {
          setAuthorized(true);
        } else {
          router.replace("/");
        }
      } catch (error) {
        router.replace("/");
      } finally {
        setChecked(true);
      }
    };

    checkToken();
  }, [router]);

  if (!checked) return null; 
  if (!authorized) return null;

  return <>{children}</>;
}
