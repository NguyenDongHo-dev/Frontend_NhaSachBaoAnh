"use client";

import Input from "@/components/client/Input";
import { fetchLogin } from "@/services/userService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserResponse, UserResponseOne } from "@/types/user";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "@/hooks/redux";

interface FormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string[];
  password?: string[];
}

interface IErr {
  errors?: {
    email?: string[];
    password?: string[];
  };
}

interface TokenPayload {
  id: number;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const [err, setErr] = useState<IErr>({});
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [data, setData] = useState<UserResponseOne>({
    success: false,
    data: null,
    token: "",
    message: "",
  });

  useEffect(() => {
    if (user.token || user.isLoggedIn) {
      router.replace("/");
    }
  }, [router]);

  if (user.token || user.isLoggedIn) {
    return null;
  }

  const validateForm = ({ email, password }: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!email) {
      errors.email = ["Email không được để trống"];
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = ["Email không đúng định dạng"];
    }

    if (!password) {
      errors.password = ["Mật khẩu không được để trống"];
    } else if (password.length < 6) {
      errors.password = ["Mật khẩu phải từ 6 kí tự trở lên"];
    }

    return errors;
  };

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = async () => {
    setErr({});
    setData({
      success: false,
      data: null,
      token: "",
      message: "",
    });

    const ValidationErrors = validateForm(form);
    if (Object.keys(ValidationErrors).length > 0) {
      setErr({ errors: ValidationErrors });
      setForm({
        email: form.email,
        password: "",
      });

      return;
    }
    setLoading(true);
    const dataRes = await fetchLogin({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (dataRes?.success) {
      const decoded = jwtDecode<TokenPayload>(dataRes.token);
      const { role } = decoded;

      dispatch(
        loginSuccess({
          user: { ...dataRes.data, role },
          token: dataRes.token,
        })
      );
      router.push("/");
    } else {
      setData(dataRes);
    }
    setForm({
      email: form.email,
      password: "",
    });
  };

  return (
    <div className="max-w-laptop mx-auto py-[30px] px-[10px] md:mt-0 mt-[30px]">
      <h1 className="text-primary uppercase font-bold text-[1.25em] pb-[10px]">
        ĐĂNG NHẬP
      </h1>
      <div className="flex flex-col gap-4">
        <Input
          onChangeForm={onChangeForm}
          type="email"
          nameInput="email"
          label="Địa chỉ Email "
          value={form.email}
          className="w-full"
        />
        <Input
          onChangeForm={onChangeForm}
          type="password"
          nameInput="password"
          label="Mật khẩu"
          value={form.password}
          className="w-full"
        />
      </div>
      <button
        onClick={onLogin}
        disabled={loading}
        className="uppercase cursor-pointer mt-4 hover:bg-[#CC1212] duration-200 inline px-[18px] py-2 bg-primary text-white font-bold"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      {data && !data.success && (
        <div className="text-red-500 mt-2">{data.message}</div>
      )}

      {err.errors?.email?.map((msg, index) => (
        <div key={index} className="text-red-500 text-sm mt-3">
          {msg}
        </div>
      ))}
      {err.errors?.password?.map((msg, index) => (
        <div key={index} className="text-red-500 text-sm mt-3">
          {msg}
        </div>
      ))}

      <div className="mt-4 text-[15x] flex items-center gap-1">
        Bạn chưa có tài khoản ?
        <Link className="text-primary text-[15px]" href={"/dang-ki"}>
          ĐĂNG KÍ
        </Link>
      </div>
    </div>
  );
}
