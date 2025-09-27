"use client";

import Input from "@/components/client/Input";
import { APIResponse, fetchRegister } from "@/services/userService";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserResponse, UserResponseOne } from "@/types/user";
import Button from "@/components/client/Button";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export interface IErr {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState<IErr>({});

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [data, setData] = useState<UserResponseOne>({
    success: false,
    data: null,
    token: "",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = ({
    email,
    password,
    confirmPassword,
  }: FormData): ValidationErrors => {
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

    if (!confirmPassword) {
      errors.confirmPassword = ["Xác nhận mật khẩu không được để trống"];
    } else if (confirmPassword !== password) {
      errors.confirmPassword = [
        "Mật khẩu và xác nhập mật khẩu phải trùng nhau",
      ];
    }

    return errors;
  };

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onRegister = async () => {
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
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      return;
    }

    setLoading(true);
    const dataRes = await fetchRegister({
      email: form.email,
      password: form.password,
    });

    setLoading(false);
    if (dataRes.status === 422) {
      setErr((prev) => ({
        ...prev,
        errors: dataRes.errors,
      }));
      return;
    }

    if (dataRes?.success) {
      toast.success("Đăng kí thành công");
      router.push("/dang-nhap");
    } else {
      setData(dataRes);
      setForm({
        email: form.email,
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="max-w-laptop mx-auto py-[30px] px-[10px] md:mt-0 mt-[30px]">
      <h1 className="text-primary uppercase font-bold text-[1.25em] pb-[10px]">
        ĐĂNG KÍ
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
        <Input
          onChangeForm={onChangeForm}
          type="password"
          nameInput="confirmPassword"
          label="Xác nhận mật khẩu"
          value={form.confirmPassword}
          className="w-full"
        />
      </div>
      <Button
        onClick={onRegister}
        disabled={loading}
        className="uppercase cursor-pointer mt-4 hover:bg-[#CC1212] duration-200 inline px-[18px] py-2 bg-primary text-white font-bold"
      >
        {loading ? "Đang xử lý..." : "Đăng kí"}
      </Button>

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
      {err.errors?.confirmPassword?.map((msg, index) => (
        <div key={index} className="text-red-500 text-sm mt-3">
          {msg}
        </div>
      ))}

      <div className="mt-4 text-[15x] flex items-center gap-1">
        Bạn đã có tài khoản ?
        <Link className="text-primary text-[15px]" href={"/dang-nhap"}>
          ĐĂNG NHẬP
        </Link>
      </div>
    </div>
  );
}
