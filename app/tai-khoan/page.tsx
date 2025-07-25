"use client";

import Input from "@/components/client/Input";
import { fetchLogin } from "@/services/user";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserResponse } from "@/types/user";

interface FormData {
  email: string;
  password: string;
}

export default function page() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [data, setData] = useState<UserResponse>({
    success: false,
    message: "",
    data: [],
    token: "",
  });

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = async () => {
    const dataRes = await fetchLogin({
      email: form.email,
      password: form.password,
    });

    if (dataRes?.success) {
      localStorage.setItem("token", JSON.stringify(dataRes.token));
      router.push("/");
    } else {
      setForm({
        email: form.email,
        password: "",
      });
    }
    setData(dataRes);
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
          label="Tên tài khoản hoặc địa chỉ email "
          value={form.email}
        />
        <Input
          onChangeForm={onChangeForm}
          type="password"
          nameInput="password"
          label="Mật khẩu"
          value={form.password}
        />
      </div>
      <button
        onClick={onLogin}
        className="uppercase cursor-pointer mt-4 hover:bg-[#CC1212] duration-200 inline px-[18px] py-2 bg-primary text-white font-bold"
      >
        Đăng nhập
      </button>
      {data && !data.success && (
        <div className="text-red-500 mt-2">{data.message}</div>
      )}

      <div className="mt-4 text-[15x] flex items-center gap-1">
        Bạn chưa có tài khoản ?
        <Link className="text-primary text-[15px]" href={"/dang-ki"}>
          ĐĂNG KÍ
        </Link>
      </div>
    </div>
  );
}
