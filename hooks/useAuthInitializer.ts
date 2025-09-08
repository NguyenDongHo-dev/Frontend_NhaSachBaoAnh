// hooks/useAuthInitializer.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginSuccess, logout } from "@/redux/slices/userSlice";
import { fetchDetailUser } from "@/services/userService";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export const useAuthInitializer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { token } = user;
  const router = useRouter();

  useEffect(() => {
    const refresh = async () => {
      const refreshToken = localStorage.getItem("refresh_Token");
      if (!token && refreshToken) {
        try {
          const res = await fetch(
            `${process.env.API_SERVER}/api/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            const newToken = data.token;
            const userRes = await fetchDetailUser(newToken);
            const decoded = jwtDecode<any>(newToken);

            dispatch(
              loginSuccess({
                user: { ...userRes.data, role: decoded.role },
                token: newToken,
              })
            );
          } else {
            dispatch(logout());
            localStorage.removeItem("refresh_Token");
            router.push("/dang-nhap");
          }
        } catch (error) {
          dispatch(logout());
          router.push("/dang-nhap");
        }
      }
    };
    refresh();
  }, []);
};
